import { describe, expect, it } from 'vitest';

import { BackgroundData } from '../data/background-data';
import { HeroSpeciesData } from '../data/hero-species-data';
import { MonsterSpeciesData } from '../data/monster-species-data';
import { PackData } from '../data/pack-data';
import { RoleData } from '../data/role-data';

import { GameLogic } from './game-logic';

// These are the balance gates described in specs/README.md. They are ranges
// rather than exact values so that adding a card in band does not break them,
// but a card well outside the band does.
describe('card strength', () => {
	it('scores every hero species in the 5 to 6 band', () => {
		HeroSpeciesData.getList().forEach(species => {
			const strength = GameLogic.getSpeciesStrength(species);
			expect(strength, species.name).toBeGreaterThanOrEqual(5);
			expect(strength, species.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every monster species in the 4 to 6 band', () => {
		MonsterSpeciesData.getList().forEach(species => {
			const strength = GameLogic.getSpeciesStrength(species);
			expect(strength, species.name).toBeGreaterThanOrEqual(4);
			expect(strength, species.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every role in the 4 to 6 band', () => {
		RoleData.getList().forEach(role => {
			const strength = GameLogic.getRoleStrength(role);
			expect(strength, role.name).toBeGreaterThanOrEqual(4);
			expect(strength, role.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every background in the 3 to 4 band', () => {
		BackgroundData.getList().forEach(background => {
			const strength = GameLogic.getBackgroundStrength(background);
			expect(strength, background.name).toBeGreaterThanOrEqual(3);
			expect(strength, background.name).toBeLessThanOrEqual(4);
		});
	});

	// Spec 12 item 6: Luckweaver is the one role below the 5 to 6 band. If this
	// ever fails it is because the role was rebalanced, and the band above can
	// be tightened to 5 to 6.
	it('has Luckweaver as the only role below 5', () => {
		const below = RoleData.getList().filter(r => GameLogic.getRoleStrength(r) < 5).map(r => r.name);
		expect(below).toEqual([ 'Luckweaver' ]);
	});
});

const allCards = () => [
	...HeroSpeciesData.getList(),
	...MonsterSpeciesData.getList(),
	...RoleData.getList(),
	...BackgroundData.getList()
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

	it('puts every card in a real pack, or in the base game', () => {
		const packIDs = PackData.getList().map(p => p.id);
		allCards().forEach(card => {
			expect((card.packID === '') || packIDs.includes(card.packID), `${card.name}: ${card.packID}`).toBe(true);
		});
	});
});

// Spec 11 Part A: five packs changed what you played but not what you fought.
describe('monster coverage', () => {
	it('gives every pack at least one monster', () => {
		const withoutMonsters = PackData.getList()
			.filter(pack => !MonsterSpeciesData.getList().some(s => s.packID === pack.id))
			.map(pack => pack.name);
		expect(withoutMonsters).toEqual([]);
	});

	it('changes the monster deck when a pack is enabled', () => {
		const base = GameLogic.getMonsterSpeciesDeck([]);
		PackData.getList().forEach(pack => {
			const withPack = GameLogic.getMonsterSpeciesDeck([ pack.id ]);
			expect(withPack.length, pack.name).toBeGreaterThan(base.length);
		});
	});
});
