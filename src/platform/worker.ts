/* eslint-disable @typescript-eslint/no-explicit-any */

import localforage from 'localforage';

import type { CloudSyncStateModel } from '../models/cloud-save';
import type { GameModel } from '../models/game';
import type { OptionsModel } from '../models/options';

const GAME_KEY = 'skirmish-game';
const OPTIONS_KEY = 'skirmish-options';
// Where this device stands against iCloud; written with the game, which it describes
const SYNC_KEY = 'skirmish-sync';
// The campaign a player chose not to keep when two devices disagreed
const BACKUP_KEY = 'skirmish-game-backup';

self.onmessage = (message: any) => {
	const data = message.data as {
		type: 'game' | 'options' | 'backup',
		payload: any
	};

	switch (data.type) {
		case 'game': {
			const { game, sync } = data.payload as { game: GameModel | null, sync: CloudSyncStateModel };
			saveGame(game);
			saveSync(sync);
			break;
		}
		case 'options':
			saveOptions(data.payload as OptionsModel | null);
			break;
		case 'backup':
			saveBackup(data.payload as GameModel | null);
			break;
	}
};

const saveGame = (game: GameModel | null) => {
	try {
		if (game) {
			localforage.setItem<GameModel>(GAME_KEY, game);
		} else {
			localforage.removeItem(GAME_KEY);
		}
	} catch (ex) {
		self.postMessage(ex);
	}
};

const saveSync = (sync: CloudSyncStateModel) => {
	try {
		localforage.setItem<CloudSyncStateModel>(SYNC_KEY, sync);
	} catch (ex) {
		self.postMessage(ex);
	}
};

const saveBackup = (game: GameModel | null) => {
	try {
		// Setting aside 'no campaign' would only clear an earlier backup worth keeping
		if (game) {
			localforage.setItem<GameModel>(BACKUP_KEY, game);
		}
	} catch (ex) {
		self.postMessage(ex);
	}
};

const saveOptions = (options: OptionsModel | null) => {
	try {
		if (options) {
			localforage.setItem<OptionsModel>(OPTIONS_KEY, options);
		} else {
			localforage.removeItem(OPTIONS_KEY);
		}
	} catch (ex) {
		self.postMessage(ex);
	}
};

export {};
