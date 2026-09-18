import { registerPlugin } from '@capacitor/core';

import type { CloudBackend } from './cloud-sync';

interface SkirmishCloudPlugin {
	getDeviceName: () => Promise<{ deviceName: string }>;
	get: (options: { key: string }) => Promise<{ value?: string }>;
	set: (options: { key: string, value: string }) => Promise<void>;
	addListener: (event: 'changed', handler: (data: { reason: string, keys: string[] }) => void) => Promise<{ remove: () => Promise<void> }>;
}

const plugin = registerPlugin<SkirmishCloudPlugin>('SkirmishCloud');

// The whole campaign lives under one key, so it always arrives in one piece
const CAMPAIGN_KEY = 'skirmish-campaign';

export class ICloudBackend implements CloudBackend {
	constructor(private onError: (ex: unknown) => void) {}

	getDeviceName = () => plugin.getDeviceName().then(result => result.deviceName);

	read = () => plugin.get({ key: CAMPAIGN_KEY }).then(result => result.value);

	write = (text: string) => plugin.set({ key: CAMPAIGN_KEY, value: text });

	onChanged = (handler: () => void) => {
		plugin
			.addListener('changed', data => {
				if (data.reason === 'quota') {
					this.onError(new Error('iCloud has no room for this campaign, so it is only saved on this device.'));
				}

				// A different iCloud account brings a different store, which is as much a change as
				// another device writing to this one
				if (data.keys.includes(CAMPAIGN_KEY) || (data.reason === 'account')) {
					handler();
				}
			})
			.catch(this.onError);
	};
}
