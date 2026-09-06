import { describe, expect, it } from 'vitest';

import { GameLogic } from '../../logic/game/game-logic';

import type { CombatantModel } from '../../models/combatant';

import { Random } from '../../utils/random/random';

import { HeroGenerator } from './hero-generator';

// A party is five heroes, and the base game alone holds four hero species, so the
// fifth draw is the one that runs the species deck dry.
const PARTY_SIZE = 5;

const buildParty = (packIDs: string[], seed: string) => {
	const rng = Random.getSeededRNG(seed);
	const party: CombatantModel[] = [];
	while (party.length < PARTY_SIZE) {
		party.push(HeroGenerator.generateHero(packIDs, party, rng));
	}
	return party;
};

describe('generating a random hero', () => {
	// Every card is applied by ID, and a wrong or missing ID is dropped in silence by
	// applyCombatantCards rather than raised, so the IDs landing on the hero are the
	// only evidence that the right deck was drawn from.
	it('gives every hero a species, a role and a background', () => {
		[ [], [ 'pack-fae-realm', 'pack-menagerie' ] ].forEach(packIDs => {
			buildParty(packIDs, `cards for ${packIDs.length} packs`).forEach(hero => {
				expect(hero.speciesID).not.toBe('');
				expect(hero.roleID).not.toBe('');
				expect(hero.backgroundID).not.toBe('');
			});
		});
	});

	// Drawing a role out of the species deck type-checks, because every card carries a
	// string id - so assert each ID belongs to the deck it should have come from.
	it('draws each card from its own deck', () => {
		const packIDs: string[] = [];
		const species = GameLogic.getHeroSpeciesDeck(packIDs).map(s => s.id);
		const roles = GameLogic.getRoleDeck(packIDs).map(r => r.id);
		const backgrounds = GameLogic.getBackgroundDeck(packIDs).map(b => b.id);

		buildParty(packIDs, 'decks').forEach(hero => {
			expect(species).toContain(hero.speciesID);
			expect(roles).toContain(hero.roleID);
			expect(backgrounds).toContain(hero.backgroundID);
		});
	});

	// The base game has fewer hero species than party slots, so the last hero has to
	// reuse one. Falling back is correct; returning a hero with no species is not.
	it('completes a full party from the base game alone', () => {
		const party = buildParty([], 'base game only');
		expect(party).toHaveLength(PARTY_SIZE);
		expect(GameLogic.getHeroSpeciesDeck([]).length).toBeLessThan(PARTY_SIZE);
		party.forEach(hero => expect(hero.speciesID).not.toBe(''));
	});

	// With enough packs open there is no reason to repeat a card, and repeating one
	// would mean the "unused" filter is comparing against the wrong field.
	it('avoids repeats while the decks are deep enough', () => {
		const party = buildParty([ 'pack-fae-realm', 'pack-menagerie', 'pack-overgrowth' ], 'deep decks');
		const ids = party.map(h => h.speciesID);
		expect(new Set(ids).size).toBe(PARTY_SIZE);
	});
});
