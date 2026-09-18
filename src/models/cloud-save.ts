import type { GameModel } from './game';

// One save as it travels through iCloud. Every write gets a fresh writeID; an unbroken run of
// writes by one device shares a branchID, and branchBase is the save that run continued from.
// That is enough for another device to tell a save that simply follows on from its own from
// one that went its own way while the two were apart.
export interface CloudSaveModel {
	version: 1;
	writeID: string;
	branchID: string;
	branchBase: string | null;
	deviceID: string;
	deviceName: string;
	savedAt: number;
	// Null when the campaign was abandoned, so that ending it on one device ends it everywhere
	game: GameModel | null;
}

// What this device remembers about where its local save stands against iCloud. It is saved
// beside the game, and changes whenever the game is written or a save is taken from iCloud.
export interface CloudSyncStateModel {
	deviceID: string;
	// The writeID of the local save, or null if this device has never written or taken one
	head: string | null;
	branchID: string | null;
	branchBase: string | null;
	// True when this device wrote the branch it is on, rather than taking it from iCloud
	wroteBranch: boolean;
	savedAt: number | null;
}
