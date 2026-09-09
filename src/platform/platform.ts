import { Capacitor } from '@capacitor/core';
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

import { DeveloperStore, priceForPack } from './store';
import type { Store } from './store';
import { StoreKitStore } from './storekit-store';

import pkg from '../../package.json';

export class Platform {
	worker: Worker;
	// StoreKit on a device, and a stub everywhere else - the browser has no App Store, so
	// prices are simply absent there rather than the app pretending otherwise.
	store: Store;

	getGame: () => (GameModel | null);
	getOptions: () => (OptionsModel | null);
	logException: (msg: unknown) => void;
	// Prices arrive after the first render, and StoreKit can hand us a purchase we never
	// asked for, so the app needs telling to look again.
	onStoreUpdated: () => void;
	onOwnershipChanged: (packIDs: string[]) => void;

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

		this.onStoreUpdated = () => {
			// Assigned by Main once it is mounted.
		};

		this.onOwnershipChanged = () => {
			// Assigned by Main once it is mounted.
		};

		// StoreKit on a device; in a browser there is no App Store to ask, so Developer Mode
		// hands packs over instead. The check is on the platform rather than the build, so a
		// shipped app can never reach the developer path.
		this.store = Capacitor.isNativePlatform() ?
			new StoreKitStore(packIDs => this.onOwnershipChanged(packIDs), ex => this.logException(ex))
			: new DeveloperStore(() => this.getOptions());
	}

	// Called once the app is running, because prices are worth nothing before there is a
	// packs modal to show them in.
	loadStore = (packIDs: string[]) => {
		if (this.store instanceof StoreKitStore) {
			this.store.loadProducts(packIDs, () => this.onStoreUpdated());
		}
	};

	// Asks the store, quietly, what the player actually owns. This is what notices a refund
	// or a Family Sharing entitlement being withdrawn, and what fills an empty list after a
	// reinstall without the player having to find Restore Purchases.
	//
	// Deliberately not restore(): that syncs with the App Store and can raise a sign-in
	// prompt, which has no business appearing on a cold launch.
	syncOwnedPacks = (options: OptionsModel) => {
		if (options.developer) {
			// A developer build grants packs locally, so taking the store's word for it here
			// would strip them again on every launch.
			return;
		}

		if (this.store instanceof StoreKitStore) {
			this.store
				.getOwned()
				.then(packIDs => {
					// An empty answer is ambiguous: it means 'you own nothing', which is equally
					// what a refund and a signed-out App Store account look like. Acting on it
					// would strip a paying player's packs the first time they launched while
					// signed out, so an empty result is left alone and only a non-empty one is
					// treated as the truth. Restore Purchases stays authoritative either way,
					// because it signs in first.
					if (packIDs.length > 0) {
						this.onOwnershipChanged(packIDs);
					}
				})
				.catch(() => {
					// Almost always no network. The locally stored list is what the player had
					// last time and is the right thing to keep, so this stays silent.
				});
		}
	};

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

	// Resolves with every pack the player owns afterwards, whichever store answered.
	getPacks = (packs: PackModel[]): Promise<string[]> => {
		return this.store.purchase(packs.map(pack => pack.id));
	};

	// App Review requires this to be reachable, and it is the only way a player who
	// reinstalls gets their packs back - nothing about ownership is stored on our side.
	restorePurchases = (): Promise<string[]> => {
		return this.store.restore();
	};
}
