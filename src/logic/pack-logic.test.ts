import { describe, expect, it } from 'vitest';

import { GameLogic } from './game-logic';
import { PackLogic } from './pack-logic';

const allPackIDs = () => PackLogic.getAllPacks().map(p => p.id);
const expansionIDs = () => PackLogic.getExpansionPacks().map(p => p.id);

describe('PackLogic.getAvailablePacks', () => {
	it('always includes the core game', () => {
		expect(PackLogic.getAvailablePacks([]).map(p => p.id)).toContain('core');
	});

	it('includes the core game exactly once when its ID is also named', () => {
		// getAllPacks() includes the core game, so anything that maps it to IDs and passes them
		// back in used to get the core game twice
		const ids = PackLogic.getAvailablePacks(allPackIDs()).map(p => p.id);
		expect(ids.filter(id => id === 'core')).toHaveLength(1);
	});

	it('returns the same packs whether or not the core ID is named', () => {
		const withCore = PackLogic.getAvailablePacks(allPackIDs()).map(p => p.id).sort();
		const withoutCore = PackLogic.getAvailablePacks(expansionIDs()).map(p => p.id).sort();
		expect(withCore).toEqual(withoutCore);
	});

	it('ignores an ID it does not recognise', () => {
		expect(PackLogic.getAvailablePacks([ 'pack-that-does-not-exist' ]).map(p => p.id)).toEqual([ 'core' ]);
	});

	it('does not double a pack named twice', () => {
		const ids = PackLogic.getAvailablePacks([ 'pack-deep-water', 'pack-deep-water' ]).map(p => p.id);
		expect(ids.filter(id => id === 'pack-deep-water')).toHaveLength(1);
	});
});

describe('the decks drawn from available packs', () => {
	// A duplicated pack would double the draw weight of every card in it, which is a balance bug
	// long before it is a rendering one
	const decks = (packIDs: string[]) => ({
		heroes: GameLogic.getHeroSpeciesDeck(packIDs).length,
		monsters: GameLogic.getMonsterSpeciesDeck(packIDs).length,
		roles: GameLogic.getRoleDeck(packIDs).length,
		backgrounds: GameLogic.getBackgroundDeck(packIDs).length,
		items: GameLogic.getItemDeck(packIDs).length,
		structures: GameLogic.getStructureDeck(packIDs).length
	});

	it('are the same size whether or not the core ID is named', () => {
		expect(decks(allPackIDs())).toEqual(decks(expansionIDs()));
	});
});

describe('action IDs across every pack', () => {
	it('are unique, so a list of actions can safely be keyed by ID', () => {
		const ids = GameLogic.getAllActions(allPackIDs()).map(a => a.id);
		expect([ ...new Set(ids) ]).toHaveLength(ids.length);
	});
});
