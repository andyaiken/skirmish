import { PackLogic } from '../logic/pack/pack-logic';

import type { OptionsModel } from '../models/options';
import type { PackModel } from '../models/pack';

// Product identifiers are the pack ID behind the app's bundle ID, so the two only ever
// differ by this prefix. App Store Connect allows letters, digits, periods and
// underscores in a product ID, which is why the pack IDs carry underscores too.
const PRODUCT_PREFIX = 'com.andyaiken.skirmish.';

export const productIDForPack = (packID: string) => `${PRODUCT_PREFIX}${packID}`;
export const packIDForProduct = (productID: string) => productID.startsWith(PRODUCT_PREFIX) ? productID.substring(PRODUCT_PREFIX.length) : '';

export interface StoreProductModel {
	packID: string;
	// Already formatted by the store in the viewer's own currency; the app never builds
	// this itself, because it knows neither the local currency nor Apple's price tiers.
	price: string;
}

export interface Store {
	// Null while the store has not answered yet, so callers can tell 'still loading' from
	// 'this pack is not for sale'.
	getProducts: () => (StoreProductModel[] | null);
	// Both resolve with every pack the player owns after the operation, not just the ones
	// this call bought - a restore reports the whole entitlement.
	purchase: (packIDs: string[]) => Promise<string[]>;
	restore: () => Promise<string[]>;
	// What the store already knows is owned, without contacting the App Store. Cheap and
	// silent, so it can run at launch; restore() cannot, because it may ask the player to
	// sign in.
	getOwned: () => Promise<string[]>;
}

// Stands in for StoreKit when the game runs in a browser, where there is no App Store to
// ask. It hands packs over for nothing, so the buying flow can be exercised with `npm
// start` rather than a simulator.
//
// It only does any of that while Developer Mode is on. With it off, a browser build
// reports no products and the packs modal says the packs cannot be bought - which is the
// truth there. A shipped build is always native and never reaches this class at all.
export class DeveloperStore implements Store {
	// Options are read through a function rather than held, because the store is built
	// before the save has loaded, and because Developer Mode can be switched on mid-session.
	constructor(private readOptions: () => (OptionsModel | null)) {}

	private isEnabled = () => this.readOptions()?.developer === true;
	private ownedPackIDs = () => this.readOptions()?.packIDs ?? [];

	// Stand-in prices, shaped like the real tiers so the modal lays out the way it will in
	// the shipped app. They are not read from App Store Connect and will not follow it if
	// the real prices change.
	getProducts = () => {
		if (!this.isEnabled()) {
			return [] as StoreProductModel[];
		}

		return PackLogic.getExpansionPacks().map(pack => ({
			packID: pack.id,
			price: pack.id === 'pack_codex_arcanum' ? '£3.99' : '£1.99'
		}));
	};

	purchase = (packIDs: string[]) => {
		if (!this.isEnabled()) {
			return Promise.reject(new Error('The store is not available in this build.'));
		}

		// Resolves with everything owned afterwards, exactly as StoreKit does, so the code
		// that handles a real purchase is the same code exercised here.
		return Promise.resolve([ ...this.ownedPackIDs(), ...packIDs ]);
	};

	restore = () => {
		if (!this.isEnabled()) {
			return Promise.reject(new Error('The store is not available in this build.'));
		}

		return Promise.resolve(this.ownedPackIDs());
	};

	getOwned = () => this.restore();
}

export const priceForPack = (store: Store, pack: PackModel) => {
	const product = store.getProducts()?.find(p => p.packID === pack.id);
	return product ? product.price : null;
};
