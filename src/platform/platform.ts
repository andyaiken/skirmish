import localforage from 'localforage';

import { StructureData } from '../data/structure-data';

import { StrongholdLogic } from '../logic/stronghold-logic';

import type { GameModel } from '../models/game';
import type { OptionsModel } from '../models/options';
import type { PackModel } from '../models/pack';

import { Utils } from '../utils/utils';

import pkg from '../../package.json';

export class Platform {
	worker: Worker;

	getGame: () => (GameModel | null);
	getOptions: () => (OptionsModel | null);
	logException: (msg: unknown) => void;

	constructor() {
		this.worker = new Worker(new URL('./worker.ts', import.meta.url));
		this.worker.onmessage = message => {
			this.logException(message);
		};

		this.getGame = () => {
			return null;
		};

		this.getOptions = () => {
			return null;
		};

		this.logException = msg => {
			console.error(msg);
		};
	}

	logIn = () => {
		return new Promise<{ game: GameModel | null, options: OptionsModel }>(resolve => {
			localforage
				.getItem<GameModel>('skirmish-game')
				.then(game => {
					if (game) {
						this.updateGame(game);
					}

					localforage
						.getItem<OptionsModel>('skirmish-options')
						.then(options => {
							if (options) {
								this.updateOptions(options);
							} else {
								options = {
									version: '',
									developer: false,
									showTips: true,
									soundEffectsVolume: 0.5,
									packIDs: [],
									renderer: ''
								};
							}

							options.version = pkg.version;
							options.renderer = this.getRenderer();

							resolve({ game: game, options: options });
						});
				});
		});
	};

	private updateGame = (game: GameModel) => {
		game.heroes.forEach(h => {
			if (h.faction === undefined) {
				h.faction = h.type;
			}
		});

		if (!game.stronghold) {
			game.stronghold = [];
			StrongholdLogic.addStructure(game.stronghold, StructureData.barracks());
		}

		if (game.encounter) {
			game.encounter.combatants.forEach(c => {
				if (c.faction === undefined) {
					c.faction = c.type;
				}
			});

			game.encounter.loot.forEach(lp => {
				if (lp.money === undefined) {
					lp.money = 0;
				}
			});

			if (game.encounter.log === undefined) {
				game.encounter.log = [];
			}
		}

		game.map.regions
			.filter(r => r.encounters.length > 10)
			.forEach(r => {
				r.encounters = r.encounters.slice(0, 9);
			});
	};

	private updateOptions = (options: OptionsModel) => {
		if (options.showTips === undefined) {
			options.showTips = true;
		}

		if (options.packIDs === undefined) {
			options.packIDs = [];
		}
	};

	private getRenderer = () => {
		if (navigator.userAgent.toLowerCase().includes('edg/')) {
			return 'edge';
		}

		if (navigator.userAgent.toLowerCase().includes('chrome/')) {
			return 'chrome';
		}

		if (navigator.userAgent.toLowerCase().includes('firefox/')) {
			return 'firefox';
		}

		return 'safari';
	};

	saveGame = Utils.debounce(() => {
		this.worker.postMessage({ type: 'game', payload: this.getGame() });
	});

	saveOptions = Utils.debounce(() => {
		this.worker.postMessage({ type: 'options', payload: this.getOptions() });
	});

	getPackPrice = (packs: PackModel[], options: OptionsModel) => {
		return 0;

		/*
		return Collections.sum(packs, pack => {
			const cards = PackLogic.getPackCardCount(pack.id);
			const cents = Math.max((cards - 1) * 50, 100);
			return (cents - 1) / 100;
		});
		*/
	};

	getPacks = (packs: PackModel[], options: OptionsModel) => {
		return Promise.resolve();
	};
}
