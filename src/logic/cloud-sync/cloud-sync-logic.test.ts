import { beforeEach, describe, expect, it } from 'vitest';

import { CloudSyncLogic } from './cloud-sync-logic';

import type { CloudSaveModel } from '../../models/cloud-save';
import type { GameModel } from '../../models/game';

// A campaign, told apart by its label
const campaign = (label: string) => ({ label: label } as unknown as GameModel);
const labelOf = (game: GameModel | null) => (game ? (game as unknown as { label: string }).label : null);

let clock = 0;

// iCloud's key-value store, as the devices see it: the server keeps whichever write has the
// later timestamp, and each device holds a local copy that only meets the server when online.
class Server {
	save: CloudSaveModel | null = null;
}

class Device {
	state = CloudSyncLogic.createState();
	game: GameModel | null = null;
	online = true;
	// The device's local copy of the key-value store, and whether it holds a write not yet sent
	store: CloudSaveModel | null = null;
	unsent = false;
	// The save this device is asking the player about, if any
	asking: CloudSaveModel | null = null;

	constructor(private name: string, private server: Server) {}

	play = (label: string | null) => {
		this.game = label === null ? null : campaign(label);
		const result = CloudSyncLogic.write(this.state, this.game, this.name, clock++);
		this.state = result.state;
		this.store = result.save;
		this.unsent = true;
		this.sync();
	};

	// The device meets the server, then acts on whatever iCloud now holds - what a launch or a
	// change notification does
	sync = () => {
		if (!this.online) {
			return;
		}

		if (this.unsent) {
			if ((this.server.save === null) || (this.store as CloudSaveModel).savedAt > this.server.save.savedAt) {
				this.server.save = this.store;
			}
			this.unsent = false;
		}
		this.store = this.server.save;

		switch (CloudSyncLogic.compare(this.state, this.game !== null, this.store)) {
			case 'adopt':
				this.game = (this.store as CloudSaveModel).game;
				this.state = CloudSyncLogic.adopt(this.state, this.store as CloudSaveModel);
				break;
			case 'push': {
				const result = CloudSyncLogic.write(this.state, this.game, this.name, clock++);
				this.state = result.state;
				this.store = result.save;
				this.unsent = true;
				this.sync();
				break;
			}
			case 'conflict':
				this.asking = this.store;
				break;
		}
	};

	keepMine = () => {
		const result = CloudSyncLogic.keepLocal(this.state, this.asking as CloudSaveModel, this.game, this.name, clock++);
		this.state = result.state;
		this.store = result.save;
		this.unsent = true;
		this.asking = null;
		this.sync();
	};

	keepICloud = () => {
		this.game = (this.asking as CloudSaveModel).game;
		this.state = CloudSyncLogic.adopt(this.state, this.asking as CloudSaveModel);
		this.asking = null;
	};
}

const inStep = (a: Device, b: Device) => {
	expect(a.asking).toBeNull();
	expect(b.asking).toBeNull();
	expect(a.state.head).toBe(b.state.head);
	expect(labelOf(a.game)).toBe(labelOf(b.game));
};

describe('syncing a campaign between two devices', () => {
	let server: Server;
	let ipad: Device;
	let mac: Device;

	beforeEach(() => {
		clock = 0;
		server = new Server();
		ipad = new Device('iPad', server);
		mac = new Device('Mac', server);
	});

	it('uploads the first campaign to an empty iCloud', () => {
		ipad.play('turn 1');
		expect(server.save?.game).toEqual(campaign('turn 1'));
		expect(server.save?.deviceName).toBe('iPad');
	});

	it('hands a campaign over to a device with none of its own', () => {
		ipad.play('turn 1');
		ipad.play('turn 2');
		mac.sync();
		inStep(ipad, mac);
		expect(labelOf(mac.game)).toBe('turn 2');
	});

	it('follows along while another device plays, then hands back without asking', () => {
		ipad.play('turn 1');
		mac.sync();
		// Each iPad save reaches the Mac as it happens
		ipad.play('turn 2');
		mac.sync();
		ipad.play('turn 3');
		mac.sync();
		inStep(ipad, mac);

		// Now the Mac plays, and the iPad picks it up
		mac.play('turn 4');
		mac.play('turn 5');
		ipad.sync();
		inStep(ipad, mac);
		expect(labelOf(ipad.game)).toBe('turn 5');
	});

	it('takes an offline session on one device without asking, if the other did nothing', () => {
		ipad.play('turn 1');
		mac.sync();

		ipad.online = false;
		ipad.play('turn 2 on a plane');
		ipad.play('turn 3 on a plane');
		mac.sync();
		expect(labelOf(mac.game)).toBe('turn 1');

		ipad.online = true;
		ipad.sync();
		mac.sync();
		inStep(ipad, mac);
		expect(labelOf(mac.game)).toBe('turn 3 on a plane');
	});

	describe('when both devices play while apart', () => {
		beforeEach(() => {
			ipad.play('turn 1');
			mac.sync();

			ipad.online = false;
			mac.online = false;
			ipad.play('iPad turn 2');
			mac.play('Mac turn 2');
			mac.play('Mac turn 3');

			ipad.online = true;
			mac.online = true;
			ipad.sync();
			mac.sync();
			ipad.sync();
		});

		it('asks on exactly one device rather than quietly losing either', () => {
			// The Mac wrote last, so iCloud kept its save; the iPad is the one left out
			expect(labelOf(server.save?.game ?? null)).toBe('Mac turn 3');
			expect(ipad.asking).not.toBeNull();
			expect(mac.asking).toBeNull();
			// Nothing has been overwritten on the iPad while it waits for an answer
			expect(labelOf(ipad.game)).toBe('iPad turn 2');
		});

		it('settles on the iCloud campaign when the player chooses it', () => {
			ipad.keepICloud();
			mac.sync();
			inStep(ipad, mac);
			expect(labelOf(ipad.game)).toBe('Mac turn 3');
		});

		it('settles on this device\'s campaign when the player chooses it, without asking the other device', () => {
			ipad.keepMine();
			mac.sync();
			inStep(ipad, mac);
			expect(labelOf(mac.game)).toBe('iPad turn 2');
		});
	});

	it('asks when a device already had a campaign of its own from before syncing', () => {
		ipad.play('iPad campaign');
		// The Mac's campaign was made before it synced, so it has a game but no position
		mac.game = campaign('Mac campaign');
		mac.sync();
		expect(mac.asking).not.toBeNull();

		mac.keepMine();
		ipad.sync();
		inStep(ipad, mac);
		expect(labelOf(ipad.game)).toBe('Mac campaign');
	});

	it('uploads a campaign from before syncing when iCloud is empty', () => {
		mac.game = campaign('Mac campaign');
		mac.sync();
		expect(labelOf(server.save?.game ?? null)).toBe('Mac campaign');
		expect(mac.asking).toBeNull();
	});

	it('ends the campaign everywhere when it is abandoned on one device', () => {
		ipad.play('turn 1');
		mac.sync();
		mac.play(null);
		ipad.sync();
		inStep(ipad, mac);
		expect(ipad.game).toBeNull();
	});

	it('brings iCloud up to date when it holds one of this device\'s older saves', () => {
		ipad.play('turn 1');
		const older = server.save;
		ipad.play('turn 2');
		expect(CloudSyncLogic.compare(ipad.state, true, older)).toBe('push');
	});
});

describe('CloudSyncLogic.parse', () => {
	it('reads an empty slot as an empty iCloud', () => {
		expect(CloudSyncLogic.parse(undefined)).toEqual({ readable: true, save: null });
		expect(CloudSyncLogic.parse('')).toEqual({ readable: true, save: null });
	});

	it('reads a save it understands', () => {
		const { save } = CloudSyncLogic.write(CloudSyncLogic.createState(), campaign('turn 1'), 'iPad', 1);
		expect(CloudSyncLogic.parse(JSON.stringify(save))).toEqual({ readable: true, save: save });
	});

	// An older copy of the game must not take a newer save it can't read for an empty iCloud,
	// or it would upload over it
	it('marks a save from a later version, or garbage, as unreadable rather than empty', () => {
		expect(CloudSyncLogic.parse(JSON.stringify({ version: 2, writeID: 'x' }))).toEqual({ readable: false, save: null });
		expect(CloudSyncLogic.parse('not json')).toEqual({ readable: false, save: null });
	});
});
