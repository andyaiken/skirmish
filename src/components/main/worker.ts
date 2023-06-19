/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */

import localforage from 'localforage';

import type { GameModel } from '../../models/game';
import type { OptionsModel } from '../../models/options';

self.onmessage = (message: any) => {
	const data = message.data as {
		type: 'game' | 'options',
		payload: any
	};

	switch (data.type) {
		case 'game':
			saveGame(data.payload as GameModel | null);
			break;
		case 'options':
			saveOptions(data.payload as OptionsModel);
			break;
	}
};

const saveGame = (game: GameModel | null) => {
	try {
		if (game) {
			localforage.setItem<GameModel>('skirmish-game', game);
		} else {
			localforage.removeItem('skirmish-game');
		}
	} catch (ex) {
		self.postMessage(ex);
	}
};

const saveOptions = (options: OptionsModel) => {
	try {
		localforage.setItem<OptionsModel>('skirmish-options', options);
	} catch (ex) {
		self.postMessage(ex);
	}
};

export {};
