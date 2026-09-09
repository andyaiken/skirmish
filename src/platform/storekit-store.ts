import { registerPlugin } from '@capacitor/core';

import type { Store, StoreProductModel } from './store';
import { packIDForProduct, productIDForPack } from './store';

interface SkirmishStorePlugin {
	getProducts: (options: { productIDs: string[] }) => Promise<{ products: { productID: string, price: string, title: string }[] }>;
	purchase: (options: { productID: string }) => Promise<{ productIDs: string[] }>;
	restore: () => Promise<{ productIDs: string[] }>;
	getOwned: () => Promise<{ productIDs: string[] }>;
	addListener: (event: 'ownershipChanged', handler: () => void) => Promise<{ remove: () => Promise<void> }>;
}

const plugin = registerPlugin<SkirmishStorePlugin>('SkirmishStore');

export class StoreKitStore implements Store {
	// Null until the App Store answers, which the packs modal shows as 'not available to
	// buy' rather than a price it does not have yet.
	private products: StoreProductModel[] | null = null;

	// Called when the App Store hands us something we did not ask for - an Ask to Buy
	// approval, or a purchase made on another device - so the game can re-read ownership.
	constructor(private onOwnershipChanged: (packIDs: string[]) => void, private onError: (ex: unknown) => void) {
		plugin.addListener('ownershipChanged', () => {
			this.restore().then(this.onOwnershipChanged).catch(this.onError);
		}).catch(this.onError);
	}

	// Products are fetched once at startup. A failure here is not worth reporting to the
	// player: it means no prices, which the modal already explains on its own.
	loadProducts = (packIDs: string[], onLoaded: () => void) => {
		plugin
			.getProducts({ productIDs: packIDs.map(productIDForPack) })
			.then(result => {
				this.products = result.products.map(p => ({
					packID: packIDForProduct(p.productID),
					price: p.price
				}));
				onLoaded();
			})
			.catch(this.onError);
	};

	getProducts = () => this.products;

	purchase = (packIDs: string[]) => {
		// StoreKit shows its own sheet per product, so buying several at once would mean
		// several sheets in a row. The modal only ever buys one.
		const packID = packIDs[0];

		return plugin
			.purchase({ productID: productIDForPack(packID) })
			.then(result => result.productIDs.map(packIDForProduct).filter(id => id !== ''));
	};

	restore = () => {
		return plugin
			.restore()
			.then(result => result.productIDs.map(packIDForProduct).filter(id => id !== ''));
	};

	getOwned = () => {
		return plugin
			.getOwned()
			.then(result => result.productIDs.map(packIDForProduct).filter(id => id !== ''));
	};
}
