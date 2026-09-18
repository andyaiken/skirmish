import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CloudAdoptionReason, CloudBackend, CloudConflictModel, CloudSyncHost } from './cloud-sync';
import { CloudSync } from './cloud-sync';

import { CloudSyncLogic } from '../logic/cloud-sync/cloud-sync-logic';

import type { CloudSyncStateModel } from '../models/cloud-save';
import type { GameModel } from '../models/game';

const campaign = (label: string) => ({ label: label } as unknown as GameModel);
const labelOf = (game: GameModel | null) => (game ? (game as unknown as { label: string }).label : null);

// Lets every queued read, write and notification run to completion
const settle = async () => {
	for (let n = 0; n < 20; ++n) {
		await new Promise(resolve => setImmediate(resolve));
	}
};

// An iCloud account's key-value store: the server keeps the later write, and tells each online
// device when its value changes.
class Account {
	value: string | undefined = undefined;
	writes = 0;
	devices: FakeICloud[] = [];

	receive = (from: FakeICloud, text: string) => {
		const incoming = JSON.parse(text).savedAt as number;
		const current = this.value ? JSON.parse(this.value).savedAt as number : -1;
		if (incoming >= current) {
			this.value = text;
			this.writes++;
			this.devices.filter(d => (d !== from) && d.online && d.delivering).forEach(d => d.pull());
		}
	};
}

class FakeICloud implements CloudBackend {
	local: string | undefined = undefined;
	unsent = false;
	online = true;
	// When false, changes on the server are held back from this device, as a notification can be
	delivering = true;
	// When false, a change reaches this device's copy of the store but its handler hasn't run yet
	notifying = true;
	private handlers: (() => void)[] = [];

	constructor(private account: Account, private name: string) {
		account.devices.push(this);
	}

	getDeviceName = async () => this.name;

	read = async () => this.local;

	write = async (text: string) => {
		this.local = text;
		this.unsent = true;
		this.reconnect();
	};

	onChanged = (handler: () => void) => {
		this.handlers.push(handler);
	};

	reconnect = () => {
		if (!this.online) {
			return;
		}
		if (this.unsent) {
			this.unsent = false;
			this.account.receive(this, this.local as string);
		}
		this.pull();
	};

	pull = () => {
		if (this.local !== this.account.value) {
			this.local = this.account.value;
			if (this.notifying) {
				this.handlers.forEach(h => h());
			}
		}
	};
}

class FakeApp implements CloudSyncHost {
	game: GameModel | null = null;
	persisted: { game: GameModel | null, state: CloudSyncStateModel } | null = null;
	backups: (GameModel | null)[] = [];
	adoptions: CloudAdoptionReason[] = [];
	conflicts: CloudConflictModel[] = [];
	errors: unknown[] = [];

	getGame = () => this.game;
	persist = (game: GameModel | null, state: CloudSyncStateModel) => {
		this.persisted = { game: game, state: state };
	};
	backup = (game: GameModel | null) => {
		this.backups.push(game);
	};
	onAdopted = (game: GameModel | null, _deviceName: string, reason: CloudAdoptionReason) => {
		this.game = game;
		this.adoptions.push(reason);
	};
	onConflict = (conflict: CloudConflictModel) => {
		this.conflicts.push(conflict);
	};
	logException = (ex: unknown) => {
		this.errors.push(ex);
	};
}

const device = (account: Account | null, name: string, game: GameModel | null = null) => {
	const cloud = account ? new FakeICloud(account, name) : null;
	const app = new FakeApp();
	app.game = game;
	const sync = new CloudSync(cloud, app, CloudSyncLogic.createState(), game);
	return { cloud: cloud as FakeICloud, app: app, sync: sync };
};

describe('CloudSync', () => {
	let account: Account;
	let time: number;

	// Every action happens a second after the last, so iCloud can always tell which came later
	const play = async (d: ReturnType<typeof device>, label: string | null) => {
		time += 1000;
		vi.setSystemTime(time);
		d.app.game = label === null ? null : campaign(label);
		await d.sync.save();
		await settle();
	};

	beforeEach(() => {
		vi.useFakeTimers({ toFake: [ 'Date' ] });
		time = 1_000_000;
		vi.setSystemTime(time);
		account = new Account();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('does not treat saving an unchanged campaign as progress', async () => {
		const ipad = device(account, 'iPad');
		await ipad.sync.start();
		await play(ipad, 'turn 1');
		// Pressing Continue saves the same campaign again
		await ipad.sync.save();
		await ipad.sync.save();
		await settle();
		expect(account.writes).toBe(1);
	});

	it('hands a campaign to a device with none, announcing it once', async () => {
		const ipad = device(account, 'iPad');
		await ipad.sync.start();
		await play(ipad, 'turn 1');
		await play(ipad, 'turn 2');

		const mac = device(account, 'Mac');
		mac.cloud.local = account.value;
		await mac.sync.start();
		await settle();

		expect(labelOf(mac.app.game)).toBe('turn 2');
		expect(mac.app.adoptions).toEqual([ 'carried-on' ]);
		expect(mac.app.conflicts).toEqual([]);
	});

	it('follows another device quietly, then hands back without asking', async () => {
		const ipad = device(account, 'iPad');
		const mac = device(account, 'Mac');
		await ipad.sync.start();
		await mac.sync.start();

		await play(ipad, 'turn 1');
		await play(ipad, 'turn 2');
		await play(ipad, 'turn 3');
		expect(labelOf(mac.app.game)).toBe('turn 3');
		// Announced when the iPad's run began, not on every save of it
		expect(mac.app.adoptions).toEqual([ 'carried-on', 'following', 'following' ]);

		await play(mac, 'turn 4');
		expect(labelOf(ipad.app.game)).toBe('turn 4');
		expect(ipad.app.adoptions).toEqual([ 'carried-on' ]);
		expect([ ...ipad.app.conflicts, ...mac.app.conflicts ]).toEqual([]);
	});

	describe('when both devices play while apart', () => {
		let ipad: ReturnType<typeof device>;
		let mac: ReturnType<typeof device>;

		beforeEach(async () => {
			ipad = device(account, 'iPad');
			mac = device(account, 'Mac');
			await ipad.sync.start();
			await mac.sync.start();
			await play(ipad, 'turn 1');

			ipad.cloud.online = false;
			mac.cloud.online = false;
			await play(ipad, 'iPad turn 2');
			await play(mac, 'Mac turn 2');

			mac.cloud.online = true;
			mac.cloud.reconnect();
			await settle();
			ipad.cloud.online = true;
			ipad.cloud.reconnect();
			await settle();
		});

		it('asks on one device and overwrites nothing', () => {
			// The iPad's offline save was older, so iCloud kept the Mac's
			expect(labelOf(JSON.parse(account.value as string).game)).toBe('Mac turn 2');
			expect(ipad.app.conflicts).toHaveLength(1);
			expect(mac.app.conflicts).toHaveLength(0);
			expect(labelOf(ipad.app.game)).toBe('iPad turn 2');
			expect(labelOf(ipad.app.conflicts[0].local.game)).toBe('iPad turn 2');
			expect(ipad.app.conflicts[0].cloud.deviceName).toBe('Mac');
		});

		it('holds back uploads while the player decides', async () => {
			const writes = account.writes;
			await play(ipad, 'iPad turn 3');
			expect(account.writes).toBe(writes);
			expect(labelOf(ipad.app.persisted?.game ?? null)).toBe('iPad turn 3');
		});

		it('keeps the other device\'s campaign when chosen, setting this one aside', async () => {
			await ipad.sync.keepCloud();
			await settle();
			expect(labelOf(ipad.app.game)).toBe('Mac turn 2');
			expect(ipad.app.adoptions).toContain('chosen');
			expect(ipad.app.backups.map(labelOf)).toEqual([ 'iPad turn 2' ]);

			await play(ipad, 'turn 3');
			expect(labelOf(mac.app.game)).toBe('turn 3');
			expect(mac.app.conflicts).toHaveLength(0);
		});

		it('keeps this device\'s campaign when chosen, and the other device takes it without asking', async () => {
			await ipad.sync.keepThisDevice();
			await settle();
			expect(labelOf(mac.app.game)).toBe('iPad turn 2');
			expect(mac.app.conflicts).toHaveLength(0);
			expect(ipad.app.backups.map(labelOf)).toEqual([ 'Mac turn 2' ]);
		});
	});

	it('does not silently lose progress when a save races a change that hasn\'t arrived yet', async () => {
		const ipad = device(account, 'iPad');
		const mac = device(account, 'Mac');
		await ipad.sync.start();
		await mac.sync.start();
		await play(ipad, 'turn 1');
		// The Mac has taken turn 1 in the ordinary way; what matters is what happens from here
		expect(mac.app.adoptions).toEqual([ 'carried-on' ]);
		const before = { ipad: ipad.app.adoptions.length, mac: mac.app.adoptions.length };

		// The Mac plays on, but its change hasn't reached the iPad yet when the iPad saves
		ipad.cloud.delivering = false;
		await play(mac, 'Mac turn 2');
		await play(ipad, 'iPad turn 2');
		ipad.cloud.delivering = true;
		ipad.cloud.pull();
		await settle();

		// Whichever device ends up holding the older campaign is asked; neither is simply replaced
		const asked = ipad.app.conflicts.length + mac.app.conflicts.length;
		expect(asked).toBe(1);
		expect(ipad.app.adoptions).toHaveLength(before.ipad);
		expect(mac.app.adoptions).toHaveLength(before.mac);
	});

	it('asks rather than uploading over a change that has arrived but not yet been handled', async () => {
		const ipad = device(account, 'iPad');
		const mac = device(account, 'Mac');
		await ipad.sync.start();
		await mac.sync.start();
		await play(ipad, 'turn 1');

		// The Mac's save is in the iPad's copy of the store, but the iPad hasn't acted on it when
		// the player makes a move there
		ipad.cloud.notifying = false;
		await play(mac, 'Mac turn 2');
		await play(ipad, 'iPad turn 2');

		expect(labelOf(JSON.parse(account.value as string).game)).toBe('Mac turn 2');
		expect(ipad.app.conflicts).toHaveLength(1);
	});

	it('leaves a save it can\'t read alone', async () => {
		account.value = JSON.stringify({ version: 2, writeID: 'from the future', savedAt: 5_000_000 });
		const ipad = device(account, 'iPad');
		ipad.cloud.local = account.value;
		await ipad.sync.start();
		await play(ipad, 'turn 1');
		expect(JSON.parse(account.value).version).toBe(2);
		expect(ipad.app.conflicts).toEqual([]);
	});

	it('keeps a campaign too large for iCloud on the device, and says so', async () => {
		const ipad = device(account, 'iPad');
		await ipad.sync.start();
		time += 1000;
		vi.setSystemTime(time);
		ipad.app.game = { label: 'x'.repeat(CloudSyncLogic.maxSaveLength) } as unknown as GameModel;
		await ipad.sync.save();
		await settle();
		expect(account.writes).toBe(0);
		expect(ipad.app.persisted).not.toBeNull();
		expect(ipad.app.errors).toHaveLength(1);
	});

	it('just saves locally where there is no iCloud', async () => {
		const browser = device(null, 'browser');
		await browser.sync.start();
		await play(browser, 'turn 1');
		expect(labelOf(browser.app.persisted?.game ?? null)).toBe('turn 1');
		expect(browser.app.errors).toEqual([]);
	});
});
