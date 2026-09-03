import { describe, expect, it } from 'vitest';

import { GameLogic } from './game-logic';
import { PackLogic } from './pack-logic';

const packs = () => PackLogic.getAllPacks();
const heroSpecies = () => packs().flatMap(pack => PackLogic.getHeroSpecies(pack.id));
const monsterSpecies = () => packs().flatMap(pack => PackLogic.getMonsterSpecies(pack.id));
const roles = () => packs().flatMap(pack => PackLogic.getRoles(pack.id));
const backgrounds = () => packs().flatMap(pack => PackLogic.getBackgrounds(pack.id));

// These are the balance gates described in specs/README.md. They are ranges
// rather than exact values so that adding a card in band does not break them,
// but a card well outside the band does.
describe('card strength', () => {
	it('scores every hero species in the 5 to 6 band', () => {
		heroSpecies().forEach(species => {
			const strength = GameLogic.getSpeciesStrength(species);
			expect(strength, species.name).toBeGreaterThanOrEqual(5);
			expect(strength, species.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every monster species in the 4 to 6 band', () => {
		monsterSpecies().forEach(species => {
			const strength = GameLogic.getSpeciesStrength(species);
			expect(strength, species.name).toBeGreaterThanOrEqual(4);
			expect(strength, species.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every role in the 4 to 6 band', () => {
		roles().forEach(role => {
			const strength = GameLogic.getRoleStrength(role);
			expect(strength, role.name).toBeGreaterThanOrEqual(4);
			expect(strength, role.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every background in the 3 to 4 band', () => {
		backgrounds().forEach(background => {
			const strength = GameLogic.getBackgroundStrength(background);
			expect(strength, background.name).toBeGreaterThanOrEqual(3);
			expect(strength, background.name).toBeLessThanOrEqual(4);
		});
	});

	// Luckweaver is the one role below the 5 to 6 band. If this ever fails it is
	// because the role was rebalanced, and the band above can be tightened to
	// 5 to 6.
	it('has Luckweaver as the only role below 5', () => {
		const below = roles().filter(r => GameLogic.getRoleStrength(r) < 5).map(r => r.name);
		expect(below).toEqual([ 'Luckweaver' ]);
	});
});

const allCards = () => [
	...heroSpecies(),
	...monsterSpecies(),
	...roles(),
	...backgrounds()
];

describe('card registration', () => {
	it('gives every card a unique ID', () => {
		const ids = allCards().map(c => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('gives every feature and action a unique ID', () => {
		const ids = allCards().flatMap(card => [
			...card.startingFeatures.map(f => f.id),
			...card.features.map(f => f.id),
			...card.actions.map(a => a.id)
		]);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
