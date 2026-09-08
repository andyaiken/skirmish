import localforage from 'localforage';

import { BoonType } from '../enums/boon-type';
import { StructureType } from '../enums/structure-type';

import { BoonGenerator } from '../generators/boon/boon-generator';

import { GameLogic } from '../logic/game/game-logic';
import { StrongholdLogic } from '../logic/stronghold/stronghold-logic';

import type { GameModel } from '../models/game';
import type { OptionsModel } from '../models/options';
import type { PackModel } from '../models/pack';
import type { StructureModel } from '../models/structure';

import { Utils } from '../utils/utils/utils';

import { UnavailableStore, priceForPack } from './store';
import type { Store } from './store';

import pkg from '../../package.json';

export class Platform {
	worker: Worker;
	// Replaced with a real implementation once the store SDK is wired up; until then this
	// reports no products, which the packs modal renders as 'not for sale here'.
	store: Store = new UnavailableStore();

	getGame: () => (GameModel | null);
	getOptions: () => (OptionsModel | null);
	logException: (msg: unknown) => void;

	constructor() {
		this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
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

	logIn = async (): Promise<{ game: GameModel | null, options: OptionsModel }> => {
		const game = await localforage.getItem<GameModel>('skirmish-game');
		if (game) {
			this.updateGame(game);
		}

		let options = await localforage.getItem<OptionsModel>('skirmish-options');
		if (options) {
			this.updateOptions(options);
		} else {
			options = this.getDefaultOptions();
		}

		options.version = pkg.version;
		options.renderer = this.getRenderer();

		return { game: game, options: options };
	};

	getDefaultOptions = (): OptionsModel => {
		return {
			version: pkg.version,
			developer: false,
			showTips: true,
			reduceMotion: false,
			soundEffectsVolume: 0.5,
			packIDs: [],
			renderer: this.getRenderer()
		};
	};

	private updateGame = (game: GameModel) => {
		game.map.regions.forEach(r => {
			if (r.boon.type === BoonType.Structure) {
				const s = r.boon.data as StructureModel;
				if (!StrongholdLogic.canBuild(s)) {
					r.boon = BoonGenerator.generateBoon([], Math.random);
				}
			}
		});

		game.heroes.forEach(h => {
			if (h.faction === undefined) {
				h.faction = h.type;
			}
		});

		if (!game.stronghold) {
			game.stronghold = [];
		}

		if (game.stronghold.filter(s => s.type === StructureType.Barracks).length !== 1) {
			game.stronghold = game.stronghold.filter(s => s.type !== StructureType.Barracks);
			StrongholdLogic.addStructure(game, GameLogic.getStructure('structure-barracks')!);
		}
		if (game.stronghold.filter(s => s.type === StructureType.Warehouse).length !== 1) {
			game.stronghold = game.stronghold.filter(s => s.type !== StructureType.Warehouse);
			StrongholdLogic.addStructure(game, GameLogic.getStructure('structure-warehouse')!);
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

			if (game.encounter.traps === undefined) {
				game.encounter.traps = [];
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

		if (options.reduceMotion === undefined) {
			options.reduceMotion = false;
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

	// The store formats prices itself, in the player's own currency and at whichever tier
	// Apple currently maps the product to, so this hands back its string or null when the
	// pack is not on sale here.
	getPackPrice = (pack: PackModel) => {
		return priceForPack(this.store, pack);
	};

	// Resolves with every pack the player owns afterwards. In a developer build the packs
	// are simply granted, so the game stays playable without a store to buy from.
	getPacks = (packs: PackModel[], options: OptionsModel): Promise<string[]> => {
		const requested = packs.map(pack => pack.id);

		if (options.developer) {
			return Promise.resolve([ ...options.packIDs, ...requested ]);
		}

		return this.store.purchase(requested);
	};

	// App Review requires this to be reachable, and it is the only way a player who
	// reinstalls gets their packs back - nothing about ownership is stored on our side.
	restorePurchases = (): Promise<string[]> => {
		return this.store.restore();
	};
}
