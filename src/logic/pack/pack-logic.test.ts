import { describe, expect, it } from 'vitest';

import type { ScrollModel } from '../../models/item';

import { SummonType } from '../../enums/summon-type';

import { ActionEffects } from '../action/action-logic';
import { GameLogic } from '../game/game-logic';
import { PackLogic } from '../pack/pack-logic';

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
		potions: GameLogic.getPotionDeck(packIDs).length,
		scrolls: GameLogic.getScrollDeck(packIDs).length,
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

	// A scroll puts its action into a hand alongside the ones drawn from the deck, so its ID has
	// to be distinct from those too
	it('do not collide with the actions carried by scrolls', () => {
		const ids = [
			...GameLogic.getAllActions(allPackIDs()).map(a => a.id),
			...GameLogic.getScrollDeck(allPackIDs()).map(sc => (sc.scroll as ScrollModel).action.id)
		];
		expect([ ...new Set(ids) ]).toHaveLength(ids.length);
	});
});

describe('every scroll', () => {
	it('has an action to run', () => {
		GameLogic.getScrollDeck(allPackIDs()).forEach(sc => expect(sc.scroll).not.toBeNull());
	});

	// Scrolls are named by the effect they invoke, and both the item card and the action card in
	// hand show that name, so the two must agree
	it('shares its name with its action', () => {
		GameLogic.getScrollDeck(allPackIDs()).forEach(sc => expect((sc.scroll as ScrollModel).action.name).toBe(sc.name));
	});
});

// A summon type with no monsters behind it is an action that silently does nothing. The Druid's
// Animal Companion was the only card summoning Beasts, so moving the Druid into Overgrowth and
// dropping that action emptied the type until the Beastcaller took it over - which is exactly the
// kind of break nothing else would have caught
describe('every summon type', () => {
	it('has at least one monster species it can draw', () => {
		const empty = Object.values(SummonType).filter(type => ActionEffects.getSummonCandidates(type).length === 0);
		expect(empty).toEqual([]);
	});

	it('is used by at least one card, so no type is dead weight', () => {
		const json = JSON.stringify(GameLogic.getAllActions(allPackIDs()));
		const unused = Object.values(SummonType).filter(type => !json.includes(`"${type}"`));
		expect(unused).toEqual([]);
	});
});
