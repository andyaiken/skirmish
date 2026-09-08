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
}

// Stands in until the store SDK is wired up. It reports no products, which leaves the
// packs modal showing its packs without prices and with buying disabled - the honest
// state for a build that cannot take money.
export class UnavailableStore implements Store {
	getProducts = () => [] as StoreProductModel[];
	purchase = () => Promise.reject(new Error('The store is not available in this build.'));
	restore = () => Promise.reject(new Error('The store is not available in this build.'));
}

export const priceForPack = (store: Store, pack: PackModel) => {
	const product = store.getProducts()?.find(p => p.packID === pack.id);
	return product ? product.price : null;
};
