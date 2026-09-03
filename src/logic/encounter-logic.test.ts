import { beforeEach, describe, expect, it } from 'vitest';

import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import type { EncounterMapSquareModel, EncounterModel } from '../models/encounter';
import type { CombatantModel } from '../models/combatant';

import { EncounterLogic } from './encounter-logic';
import { Factory } from './factory';
import { PackLogic } from './pack-logic';

// A square open map, big enough for a combatant to move in every direction.
const createEncounter = (width = 5, height = 5): EncounterModel => {
	const mapSquares = [];
	for (let x = 0; x < width; ++x) {
		for (let y = 0; y < height; ++y) {
			mapSquares.push({ x: x, y: y, type: EncounterMapSquareType.Clear });
		}
	}

	return {
		regionID: '',
		round: 0,
		combatants: [],
		loot: [],
		mapSquares: mapSquares,
		log: []
	};
};

const addCombatant = (encounter: EncounterModel, type: CombatantType, x: number, y: number, size = 1) => {
	const combatant = Factory.createCombatant(type);
	combatant.size = size;
	combatant.combat.position = { x: x, y: y };
	encounter.combatants.push(combatant);
	return combatant;
};

const setSquareType = (encounter: EncounterModel, x: number, y: number, type: EncounterMapSquareType) => {
	const square = encounter.mapSquares.find(sq => (sq.x === x) && (sq.y === y)) as EncounterMapSquareModel;
	square.type = type;
};

describe('EncounterLogic.getMoveCost', () => {
	let encounter: EncounterModel;
	let hero: CombatantModel;

	beforeEach(() => {
		encounter = createEncounter();
		hero = addCombatant(encounter, CombatantType.Hero, 2, 2);
	});

	it('costs 1 to move into an empty clear square', () => {
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(1);
	});

	it('costs 2 to move into an obstructed square', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Obstructed);
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(2);
	});

	it('cannot move off the map', () => {
		hero.combat.position = { x: 0, y: 0 };
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'nw')).toBe(Number.MAX_VALUE);
	});

	it('cannot move into a square occupied by another combatant', () => {
		addCombatant(encounter, CombatantType.Monster, 2, 1);
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(Number.MAX_VALUE);
	});

	it('adds 4 for disengaging from an adjacent opponent', () => {
		addCombatant(encounter, CombatantType.Monster, 3, 2);
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'w')).toBe(5);
	});

	it('does not charge disengagement for moving past an ally', () => {
		addCombatant(encounter, CombatantType.Hero, 3, 2);
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'w')).toBe(1);
	});

	it('does not charge disengagement for a prone opponent', () => {
		const monster = addCombatant(encounter, CombatantType.Monster, 3, 2);
		monster.combat.state = CombatantState.Prone;
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'w')).toBe(1);
	});

	it('does not charge disengagement for a stunned opponent', () => {
		const monster = addCombatant(encounter, CombatantType.Monster, 3, 2);
		monster.combat.stunned = true;
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'w')).toBe(1);
	});

	it('doubles the cost when prone', () => {
		hero.combat.state = CombatantState.Prone;
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(2);
	});

	it('doubles the cost when hidden', () => {
		hero.combat.hidden = 1;
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(2);
	});

	it('applies the prone doubling after the obstruction and disengagement additions', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Obstructed);
		addCombatant(encounter, CombatantType.Monster, 3, 2);
		hero.combat.state = CombatantState.Prone;
		// (1 base + 1 obstructed + 4 disengage) * 2
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(12);
	});
});

describe('EncounterLogic.getCombatantSquares', () => {
	it('returns one square for a size 1 combatant', () => {
		const encounter = createEncounter();
		const combatant = addCombatant(encounter, CombatantType.Hero, 1, 1);
		expect(EncounterLogic.getCombatantSquares(encounter, combatant)).toEqual([ { x: 1, y: 1 } ]);
	});

	it('returns a square block for a larger combatant', () => {
		const encounter = createEncounter();
		const combatant = addCombatant(encounter, CombatantType.Hero, 1, 1, 2);
		expect(EncounterLogic.getCombatantSquares(encounter, combatant)).toEqual([
			{ x: 1, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 1 },
			{ x: 2, y: 2 }
		]);
	});
});

describe('EncounterLogic.getMoveCost for larger combatants', () => {
	it('blocks a move that would take any part of the combatant off the map', () => {
		const encounter = createEncounter();
		// Occupies (3,3) to (4,4); the map's right edge is x = 4.
		const combatant = addCombatant(encounter, CombatantType.Hero, 3, 3, 2);
		expect(EncounterLogic.getMoveCost(encounter, combatant, combatant.combat.position, 'e')).toBe(Number.MAX_VALUE);
		expect(EncounterLogic.getMoveCost(encounter, combatant, combatant.combat.position, 'w')).toBe(1);
	});

	it('charges for obstruction under any part of the destination', () => {
		const encounter = createEncounter();
		const combatant = addCombatant(encounter, CombatantType.Hero, 1, 1, 2);
		// Moving east puts the combatant on (2,1) to (3,2).
		setSquareType(encounter, 3, 2, EncounterMapSquareType.Obstructed);
		expect(EncounterLogic.getMoveCost(encounter, combatant, combatant.combat.position, 'e')).toBe(2);
	});
});

describe('EncounterLogic.getPossibleMoveSquares', () => {
	it('offers eight directions in open ground', () => {
		const encounter = createEncounter();
		const hero = addCombatant(encounter, CombatantType.Hero, 2, 2);
		expect(EncounterLogic.getPossibleMoveSquares(encounter, hero)).toHaveLength(8);
	});

	it('omits directions that leave the map', () => {
		const encounter = createEncounter();
		const hero = addCombatant(encounter, CombatantType.Hero, 0, 0);
		const dirs = EncounterLogic.getPossibleMoveSquares(encounter, hero).map(sq => sq.dir);
		expect(dirs.sort()).toEqual([ 'e', 's', 'se' ]);
	});
});

describe('EncounterLogic.kill', () => {
	const monsters = PackLogic.getAllPacks().flatMap(pack => PackLogic.getMonsterSpecies(pack.id));
	const createKeg = (encounter: EncounterModel, x: number, y: number) => {
		const keg = addCombatant(encounter, CombatantType.Monster, x, y);
		keg.speciesID = monsters.find(species => species.id === 'species-powder-keg')!.id;
		return keg;
	};

	it('leaves bystanders alone when the species has no death actions', () => {
		const encounter = createEncounter();
		const monster = addCombatant(encounter, CombatantType.Monster, 2, 2);
		monster.speciesID = monsters.find(species => species.id === 'species-goblin')!.id;
		const hero = addCombatant(encounter, CombatantType.Hero, 2, 1);

		EncounterLogic.kill(encounter, monster);

		expect(monster.combat.state).toBe(CombatantState.Dead);
		expect(hero.combat.damage).toBe(0);
		expect(hero.combat.wounds).toBe(0);
	});

	// Damage rolls are random, and enough damage turns into a wound, resetting
	// the damage counter - so measure both.
	const harm = (combatant: CombatantModel) => combatant.combat.damage + combatant.combat.wounds;

	it('runs the death action against everyone in range', () => {
		const encounter = createEncounter(9, 9);
		const keg = createKeg(encounter, 4, 4);
		const near = addCombatant(encounter, CombatantType.Hero, 4, 3);
		const far = addCombatant(encounter, CombatantType.Hero, 0, 0);

		EncounterLogic.kill(encounter, keg);

		// Detonate is a radius 2 burst, so (4,3) is caught and (0,0) is not.
		expect(harm(near)).toBeGreaterThan(0);
		expect(harm(far)).toBe(0);
	});

	it('catches the dying combatant\'s own allies', () => {
		const encounter = createEncounter();
		const keg = createKeg(encounter, 2, 2);
		const ally = addCombatant(encounter, CombatantType.Monster, 2, 1);

		EncounterLogic.kill(encounter, keg);

		expect(harm(ally)).toBeGreaterThan(0);
	});

	it('does not run the death action twice', () => {
		const encounter = createEncounter();
		const keg = createKeg(encounter, 2, 2);
		const hero = addCombatant(encounter, CombatantType.Hero, 2, 1);

		EncounterLogic.kill(encounter, keg);
		const before = harm(hero);
		EncounterLogic.kill(encounter, keg);

		expect(harm(hero)).toBe(before);
	});

	it('chains through a second keg, detonating each at most once', () => {
		const encounter = createEncounter(9, 9);
		const first = createKeg(encounter, 4, 4);
		const second = createKeg(encounter, 4, 5);

		// The second keg is caught in the first blast and, if that kills it,
		// detonates in turn. Reaching the assertions at all proves the chain
		// terminates rather than looping back into the first keg.
		EncounterLogic.kill(encounter, first);

		expect(first.combat.state).toBe(CombatantState.Dead);
		expect(harm(second)).toBeGreaterThan(0);

		const detonations = encounter.log
			.filter(message => message.parts.some(part => part.data === 'triggers Detonate'))
			.length;
		expect(detonations).toBeLessThanOrEqual(2);
	});
});
