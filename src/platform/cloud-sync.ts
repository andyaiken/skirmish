import { CloudSyncLogic } from '../logic/cloud-sync/cloud-sync-logic';

import type { CloudSaveModel, CloudSyncStateModel } from '../models/cloud-save';
import type { GameModel } from '../models/game';

// Somewhere a campaign can be kept for the player's other devices: iCloud on a device, and
// nothing at all in a browser.
export interface CloudBackend {
	getDeviceName: () => Promise<string>;
	read: () => Promise<string | undefined>;
	write: (text: string) => Promise<void>;
	onChanged: (handler: () => void) => void;
}

export interface CloudCampaignModel {
	game: GameModel | null;
	savedAt: number | null;
	deviceName: string;
}

export interface CloudConflictModel {
	local: CloudCampaignModel;
	cloud: CloudCampaignModel;
}

// How a campaign from another device came to replace this one's:
//   'carried-on' - another device picked up where this one left off
//   'following'  - a later save from a device already being followed
//   'chosen'     - the player chose it when asked
export type CloudAdoptionReason = 'carried-on' | 'following' | 'chosen';

export interface CloudSyncHost {
	getGame: () => GameModel | null;
	persist: (game: GameModel | null, state: CloudSyncStateModel) => void;
	backup: (game: GameModel | null) => void;
	onAdopted: (game: GameModel | null, deviceName: string, reason: CloudAdoptionReason) => void;
	onConflict: (conflict: CloudConflictModel) => void;
	logException: (ex: unknown) => void;
}

export class CloudSync {
	private deviceName = 'device';
	// The iCloud save the player is being asked about. Nothing is uploaded until they answer.
	private asking: CloudSaveModel | null = null;
	// What was last written or taken, so re-saving an unchanged campaign - which pressing
	// Continue does - isn't mistaken for progress
	private lastSavedText: string;
	// Every read, write and decision runs in turn, so a change arriving from iCloud can't be
	// weighed against a save that is only half written
	private queue: Promise<void> = Promise.resolve();

	constructor(private backend: CloudBackend | null, private host: CloudSyncHost, public state: CloudSyncStateModel, savedGame: GameModel | null) {
		this.lastSavedText = JSON.stringify(savedGame);
	}

	start = () => this.run(async () => {
		if (!this.backend) {
			return;
		}

		this.deviceName = await this.backend.getDeviceName();
		this.backend.onChanged(() => {
			this.check();
		});
		await this.checkNow();
	});

	// Looks at iCloud again - on a change notification, or when the app comes back to the front
	check = () => this.run(this.checkNow);

	save = () => this.run(async () => {
		const game = this.host.getGame();
		const text = JSON.stringify(game);
		if (text === this.lastSavedText) {
			return;
		}

		// The write is recorded locally even if it can't be uploaded yet: this device's position
		// has to move on with its campaign, or a later save from iCloud that carries on from the
		// old position would be taken as safe, quietly discarding what was just played
		const previous = this.state;
		const { save, state } = CloudSyncLogic.write(previous, game, this.deviceName, Date.now());
		this.state = state;
		this.lastSavedText = text;
		this.host.persist(game, state);

		if (!this.backend || this.asking) {
			return;
		}

		// If another device has moved on since this one last looked, uploading would overwrite
		// it - and this device has moved on too, so it is a question for the player
		const current = CloudSyncLogic.parse(await this.backend.read());
		if (!current.readable) {
			return;
		}
		const action = CloudSyncLogic.compare(previous, true, current.save);
		if ((action === 'adopt') || (action === 'conflict')) {
			this.ask(current.save as CloudSaveModel);
			return;
		}

		await this.send(save);
	});

	keepThisDevice = () => this.run(async () => {
		if (!this.backend || !this.asking) {
			return;
		}

		const cloud = this.asking;
		this.asking = null;

		const game = this.host.getGame();
		const { save, state } = CloudSyncLogic.keepLocal(this.state, cloud, game, this.deviceName, Date.now());
		this.state = state;
		this.lastSavedText = JSON.stringify(game);
		// The campaign not chosen is set aside rather than deleted
		this.host.backup(cloud.game);
		this.host.persist(game, state);
		await this.send(save);

		await this.checkNow();
	});

	keepCloud = () => this.run(async () => {
		if (!this.asking) {
			return;
		}

		const cloud = this.asking;
		this.asking = null;

		this.host.backup(this.host.getGame());
		this.adopt(cloud, 'chosen');

		await this.checkNow();
	});

	private run = (task: () => Promise<void>) => {
		this.queue = this.queue.then(task).catch(ex => this.host.logException(ex));
		return this.queue;
	};

	private checkNow = async () => {
		if (!this.backend || this.asking) {
			return;
		}

		const { readable, save } = CloudSyncLogic.parse(await this.backend.read());
		if (!readable) {
			return;
		}

		switch (CloudSyncLogic.compare(this.state, this.host.getGame() !== null, save)) {
			case 'push':
				await this.upload();
				break;
			case 'adopt': {
				const cloud = save as CloudSaveModel;
				this.adopt(cloud, cloud.branchID === this.state.branchID ? 'following' : 'carried-on');
				break;
			}
			case 'conflict':
				this.ask(save as CloudSaveModel);
				break;
		}
	};

	private upload = async () => {
		const game = this.host.getGame();
		const { save, state } = CloudSyncLogic.write(this.state, game, this.deviceName, Date.now());
		this.state = state;
		this.lastSavedText = JSON.stringify(game);
		this.host.persist(game, state);
		await this.send(save);
	};

	private adopt = (cloud: CloudSaveModel, reason: CloudAdoptionReason) => {
		this.state = CloudSyncLogic.adopt(this.state, cloud);
		this.lastSavedText = JSON.stringify(cloud.game);
		this.host.persist(cloud.game, this.state);
		this.host.onAdopted(cloud.game, cloud.deviceName, reason);
	};

	private ask = (cloud: CloudSaveModel) => {
		this.asking = cloud;
		this.host.onConflict({
			local: { game: this.host.getGame(), savedAt: this.state.savedAt, deviceName: this.deviceName },
			cloud: { game: cloud.game, savedAt: cloud.savedAt, deviceName: cloud.deviceName }
		});
	};

	private send = async (save: CloudSaveModel) => {
		const text = JSON.stringify(save);
		if (text.length > CloudSyncLogic.maxSaveLength) {
			this.host.logException(new Error(`This campaign is too large to sync (${text.length} characters), so it is only saved on this device.`));
			return;
		}

		await (this.backend as CloudBackend).write(text);
	};
}
