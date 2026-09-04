import { describe, expect, it } from 'vitest';

import { CombatantType } from '../enums/combatant-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import { EncounterLogic } from '../logic/encounter-logic';
import { EncounterMapLogic } from '../logic/encounter-map-logic';
import { Factory } from '../logic/factory';

import type { EncounterModel } from '../models/encounter';
import type { RegionModel } from '../models/region';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

import { EncounterGenerator } from './encounter-generator';
import { EncounterMapGenerator } from './encounter-map-generator';

const mapGenerators = {
	dungeon: EncounterMapGenerator.generateDungeonMap,
	ruin: EncounterMapGenerator.generateRuinMap,
	cavern: EncounterMapGenerator.generateCavernMap,
	street: EncounterMapGenerator.generateStreetMap
};

// The Minotaur is a size 2 hero, the only case of a hero occupying more than
// one square. Placement and movement are shared with the size 2 and 3 monsters,
// but are otherwise never exercised for a hero.
describe('placing a larger combatant', () => {
	Object.entries(mapGenerators).forEach(([ name, generate ]) => {
		it(`places a size 2 hero on a ${name} map`, () => {
			const rng = Random.getSeededRNG(`${name} placement`);

			const encounter: EncounterModel = {
				regionID: '',
				round: 0,
				combatants: [],
				loot: [],
				traps: [],
				mapSquares: generate(400, rng),
				log: []
			};

			const hero = Factory.createCombatant(CombatantType.Hero);
			hero.size = 2;
			hero.combat.position = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
			encounter.combatants.push(hero);

			EncounterGenerator.placeCombatants(encounter, rng);

			// A combatant that could not be placed is dropped from the encounter.
			expect(encounter.combatants).toContain(hero);

			// All four of its squares are on the map and unoccupied by anything else.
			const squares = EncounterLogic.getCombatantSquares(encounter, hero);
			expect(squares).toHaveLength(4);
			squares.forEach(sq => {
				expect(encounter.mapSquares.some(ms => (ms.x === sq.x) && (ms.y === sq.y))).toBe(true);
			});

			// And it can move somewhere.
			expect(EncounterLogic.getPossibleMoveSquares(encounter, hero).length).toBeGreaterThan(0);
		});
	});

	it('does not overlap two size 2 combatants', () => {
		const rng = Random.getSeededRNG('overlap');

		const encounter: EncounterModel = {
			regionID: '',
			round: 0,
			combatants: [],
			loot: [],
			traps: [],
			mapSquares: EncounterMapGenerator.generateCavernMap(400, rng),
			log: []
		};

		for (let i = 0; i < 6; ++i) {
			const combatant = Factory.createCombatant(i % 2 === 0 ? CombatantType.Hero : CombatantType.Monster);
			combatant.size = 2;
			combatant.combat.position = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
			encounter.combatants.push(combatant);
		}

		EncounterGenerator.placeCombatants(encounter, rng);
		expect(encounter.combatants).toHaveLength(6);

		const occupied = encounter.combatants.flatMap(c => EncounterLogic.getCombatantSquares(encounter, c)).map(sq => `${sq.x},${sq.y}`);
		expect(new Set(occupied).size).toBe(occupied.length);
	});
});

const createRegion = (seed: string): RegionModel => ({
	id: seed,
	name: seed,
	color: '',
	encounters: [ seed ],
	boon: null as unknown as RegionModel['boon'],
	demographics: { size: 3, population: 5, terrain: 'Plains' }
});

describe('EncounterGenerator.createEncounter', () => {
	// The seed drives everything, including whether the encounter drops a loot pile and what goes
	// into it, so a spread of seeds is the only way to reach every branch.
	const seeds = Array.from({ length: 40 }, (_, n) => `encounter ${n}`);

	const build = (seed: string, packIDs: string[]) =>
		EncounterGenerator.createEncounter(createRegion(seed), [ Factory.createCombatant(CombatantType.Hero) ], packIDs);

	it('builds an encounter for a game with no packs switched on', () => {
		// The core game has no potions of its own, so a loot pile that rolls a potion has an empty
		// deck to draw from; that used to throw rather than fall back to something else
		seeds.forEach(seed => expect(() => build(seed, [])).not.toThrow());
	});

	it('never leaves a loot pile with nothing in it', () => {
		seeds.forEach(seed => {
			build(seed, []).loot.forEach(lp => expect(lp.items.length + lp.money).toBeGreaterThan(0));
		});
	});

	it('builds an encounter with the Deep Water cards switched on', () => {
		seeds.forEach(seed => expect(() => build(seed, [ 'pack-deep-water' ])).not.toThrow());
	});

	// Traps are base-game map furniture, so no pack has to be switched on for them to appear
	it('lays traps on some encounters whatever packs are switched on', () => {
		expect(Collections.sum(seeds, seed => build(seed, []).traps.length)).toBeGreaterThan(0);
	});

	it('lays traps on clear ground, well away from where anyone starts', () => {
		seeds.forEach(seed => {
			const encounter = build(seed, []);
			const occupied = encounter.combatants.flatMap(c => EncounterLogic.getCombatantSquares(encounter, c));

			encounter.traps.forEach(trap => {
				const square = encounter.mapSquares.find(sq => (sq.x === trap.position.x) && (sq.y === trap.position.y));
				expect(square?.type).toBe(EncounterMapSquareType.Clear);
				occupied.forEach(sq => expect(EncounterMapLogic.getDistance(sq, trap.position)).toBeGreaterThan(3));
			});
		});
	});

	it('never lays two traps on the same square', () => {
		seeds.forEach(seed => {
			const traps = build(seed, []).traps;
			expect(Collections.distinct(traps, t => `${t.position.x} ${t.position.y}`)).toHaveLength(traps.length);
		});
	});

	it('puts water on the map whether or not any pack is switched on', () => {
		// Water is base-game terrain now, so the pack list must make no difference to it. Blob
		// counts are random, so this compares totals across a spread of seeds rather than one map.
		const water = (packIDs: string[]) => Collections.sum(seeds.slice(0, 8), seed =>
			build(seed, packIDs).mapSquares.filter(sq => sq.type === EncounterMapSquareType.Water).length);

		expect(water([])).toBeGreaterThan(0);
		expect(water([ 'pack-deep-water' ])).toBe(water([]));
	});
});
