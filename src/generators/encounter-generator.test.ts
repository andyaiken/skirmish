import { describe, expect, it } from 'vitest';

import { CombatantType } from '../enums/combatant-type';

import { EncounterLogic } from '../logic/encounter-logic';
import { Factory } from '../logic/factory';

import type { EncounterModel } from '../models/encounter';

import { Random } from '../utils/random';

import { EncounterGenerator } from './encounter-generator';
import { EncounterMapGenerator } from './encounter-map-generator';

const mapGenerators = {
	dungeon: EncounterMapGenerator.generateDungeonMap,
	ruin: EncounterMapGenerator.generateRuinMap,
	cavern: EncounterMapGenerator.generateCavernMap,
	street: EncounterMapGenerator.generateStreetMap
};

// Spec 12 item 3 makes the Minotaur a size 2 hero, which is the first time a
// hero has occupied more than one square. Placement and movement are shared
// with the size 2 and 3 monsters, but had never been exercised for a hero.
describe('placing a larger combatant', () => {
	Object.entries(mapGenerators).forEach(([ name, generate ]) => {
		it(`places a size 2 hero on a ${name} map`, () => {
			const rng = Random.getSeededRNG(`${name} placement`);

			const encounter: EncounterModel = {
				regionID: '',
				round: 0,
				combatants: [],
				loot: [],
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
