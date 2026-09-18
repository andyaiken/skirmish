import type { CloudSaveModel, CloudSyncStateModel } from '../../models/cloud-save';
import type { GameModel } from '../../models/game';

import { Utils } from '../../utils/utils/utils';

// What to do about the save currently in iCloud:
//   'same'     - it is the local save; nothing to do
//   'push'     - iCloud is behind this device; upload the local save
//   'adopt'    - iCloud carries on from the local save; take it, nothing is lost
//   'conflict' - both have moved on from a common point; only the player can say which to keep
export type CloudSyncAction = 'same' | 'push' | 'adopt' | 'conflict';

export class CloudSyncLogic {
	// iCloud's key-value store holds at most 1MB for the whole app. The caps on heroes and
	// stored items keep a campaign near 145kB, so this is a guard against the unforeseen rather
	// than a limit a player should meet; a save over it stays on the device.
	static maxSaveLength = 900_000;

	static createState = (): CloudSyncStateModel => {
		return {
			deviceID: Utils.guid(),
			head: null,
			branchID: null,
			branchBase: null,
			wroteBranch: false,
			savedAt: null
		};
	};

	static compare = (state: CloudSyncStateModel, hasLocalGame: boolean, cloud: CloudSaveModel | null): CloudSyncAction => {
		if (cloud === null) {
			// Nothing in iCloud yet. Anything local is worth sending; nothing local, nothing to do.
			return hasLocalGame ? 'push' : 'same';
		}

		if (cloud.writeID === state.head) {
			return 'same';
		}

		if (state.head === null) {
			// This device has never written or taken a synced save. With no campaign of its own
			// it simply takes iCloud's; with one, that campaign predates syncing here, and whether
			// it or iCloud's matters more is not something to guess.
			return hasLocalGame ? 'conflict' : 'adopt';
		}

		if (cloud.branchID === state.branchID) {
			// The same run of writes. If this device wrote it, iCloud holds one of its older saves
			// and should be brought up to date; if it took the run from iCloud, this is simply a
			// later save on it, since writing anything locally would have started a new run.
			return state.wroteBranch ? 'push' : 'adopt';
		}

		if (cloud.branchBase === state.head) {
			// Another device carried on from exactly this device's save
			return 'adopt';
		}

		return 'conflict';
	};

	// Records a local write, returning the save to upload and the device's new position.
	static write = (state: CloudSyncStateModel, game: GameModel | null, deviceName: string, now: number): { save: CloudSaveModel, state: CloudSyncStateModel } => {
		// Writing on top of something taken from iCloud starts a new run; further writes extend it
		const continuing = state.wroteBranch && (state.branchID !== null);
		const branchID = continuing ? state.branchID as string : Utils.guid();
		const branchBase = continuing ? state.branchBase : state.head;

		const save: CloudSaveModel = {
			version: 1,
			writeID: Utils.guid(),
			branchID: branchID,
			branchBase: branchBase,
			deviceID: state.deviceID,
			deviceName: deviceName,
			savedAt: now,
			game: game
		};

		return {
			save: save,
			state: {
				deviceID: state.deviceID,
				head: save.writeID,
				branchID: branchID,
				branchBase: branchBase,
				wroteBranch: true,
				savedAt: now
			}
		};
	};

	// The device's position after taking a save from iCloud.
	static adopt = (state: CloudSyncStateModel, cloud: CloudSaveModel): CloudSyncStateModel => {
		return {
			deviceID: state.deviceID,
			head: cloud.writeID,
			branchID: cloud.branchID,
			branchBase: cloud.branchBase,
			wroteBranch: false,
			savedAt: cloud.savedAt
		};
	};

	// Settles a conflict in this device's favour. The save it uploads carries on from the one in
	// iCloud, so the other device - whose latest save that is - takes it without asking again.
	static keepLocal = (state: CloudSyncStateModel, cloud: CloudSaveModel, game: GameModel | null, deviceName: string, now: number): { save: CloudSaveModel, state: CloudSyncStateModel } => {
		return CloudSyncLogic.write(CloudSyncLogic.adopt(state, cloud), game, deviceName, now);
	};

	// Reads what is in iCloud. An empty slot and an unreadable save are different things: iCloud
	// being empty means this device should upload, but a save it can't read - most likely from a
	// newer version of the game - must be left alone, or an out-of-date copy would overwrite it.
	static parse = (text: string | null | undefined): { readable: boolean, save: CloudSaveModel | null } => {
		if (!text) {
			return { readable: true, save: null };
		}

		try {
			const save = JSON.parse(text) as CloudSaveModel;
			if (save && (save.version === 1) && (typeof save.writeID === 'string')) {
				return { readable: true, save: save };
			}
		} catch {
			// Falls through to unreadable
		}

		return { readable: false, save: null };
	};
}
