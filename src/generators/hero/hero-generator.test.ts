import { describe, expect, it } from 'vitest';

import { GameLogic } from '../../logic/game/game-logic';
import { PackLogic } from '../../logic/pack/pack-logic';

import type { CombatantModel } from '../../models/combatant';

import { Random } from '../../utils/random/random';

import { HeroGenerator } from './hero-generator';

// A party is five heroes. The base game used to hold four hero species, so the fifth draw ran the
// deck dry and had to fall back on a species already taken; moving the Dragonkin into the core game
// brought it up to five, so the deck is now exactly the size of a party.
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
		[ [], [ 'pack-fae-green-realm', 'pack-menagerie' ] ].forEach(packIDs => {
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

	// The base game is the shallowest deck there is, so it is where the generator is most likely to
	// run out of cards. Whether it has to reuse a species or not, every hero must come back with one:
	// applyCombatantCards drops an unknown ID in silence, so an empty speciesID is the failure to
	// watch for. This deliberately does not assert how deep the deck is - that changes as cards move
	// between packs, and the guarantee here is about the generator, not the roster
	it('completes a full party from the base game alone', () => {
		const party = buildParty([], 'base game only');
		expect(party).toHaveLength(PARTY_SIZE);
		expect(GameLogic.getHeroSpeciesDeck([]).length).toBeGreaterThan(0);
		party.forEach(hero => expect(hero.speciesID).not.toBe(''));
	});

	// The fall-back itself, which the base game used to exercise on its own before the core roster
	// grew to a full party's worth of species. Drawing from an empty list yields undefined, and
	// applyCombatantCards skips an unknown ID in silence, so falling back to a used card matters
	it('falls back to an already-used card rather than drawing from an empty deck', () => {
		const deck = [ { id: 'a' }, { id: 'b' } ];
		const rng = Random.getSeededRNG('exhausted deck');

		const drawn = HeroGenerator.drawUnused(deck, [ 'a', 'b' ], rng);
		expect(drawn).toBeDefined();
		expect(deck.map(d => d.id)).toContain(drawn.id);
	});

	it('prefers a card that is not already in the party', () => {
		const deck = [ { id: 'a' }, { id: 'b' } ];
		const rng = Random.getSeededRNG('partly used deck');

		Array.from({ length: 10 }).forEach(() => {
			expect(HeroGenerator.drawUnused(deck, [ 'a' ], rng).id).toBe('b');
		});
	});

	// With enough packs open there is no reason to repeat a card, and repeating one
	// would mean the "unused" filter is comparing against the wrong field. Naming every
	// pack rather than a chosen few keeps this from quietly testing a shallower deck each
	// time packs are merged - an ID that no longer exists is dropped in silence.
	it('avoids repeats while the decks are deep enough', () => {
		const party = buildParty(PackLogic.getAllPacks().map(p => p.id), 'deep decks');
		const ids = party.map(h => h.speciesID);
		expect(new Set(ids).size).toBe(PARTY_SIZE);
	});
});
