/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */

import localforage from 'localforage';

import type { GameModel } from '../../models/game';
import type { OptionsModel } from '../../models/options';

const GAME_KEY = 'skirmish-game';
const OPTIONS_KEY = 'skirmish-options';

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
			saveOptions(data.payload as OptionsModel | null);
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
