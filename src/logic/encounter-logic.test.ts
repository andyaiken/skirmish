import { beforeEach, describe, expect, it } from 'vitest';

import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { DamageType } from '../enums/damage-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { QuirkType } from '../enums/quirk-type';
import { TraitType } from '../enums/trait-type';

import type { EncounterMapSquareModel, EncounterModel } from '../models/encounter';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';

import { ConditionLogic } from './condition-logic';
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

describe('EncounterLogic.spreadContagion', () => {
	let encounter: EncounterModel;
	let carrier: CombatantModel;

	const infect = (combatant: CombatantModel, rank = 10) => {
		const condition = ConditionLogic.makeContagious(
			ConditionLogic.createAutoDamageCondition(TraitType.Endurance, rank, DamageType.Poison)
		);
		combatant.combat.conditions.push(condition);
		return condition;
	};

	// For each adjacent combatant, spreadContagion rolls that target's resistance and
	// then the condition's. Scripting the rng on that cycle fixes the outcome, so these
	// tests do not depend on luck - Random.dice explodes, so no rank alone would settle it.
	const scripted = (condition: ConditionModel, sample: CombatantModel, resisted: boolean) => {
		const lows = Math.max(EncounterLogic.getTraitRank(encounter, sample, condition.trait), 1);
		const cycle = lows + condition.rank;
		let i = 0;
		return () => {
			const low = (i++ % cycle) < lows;
			return (low === resisted) ? 0.85 : 0;
		};
	};

	beforeEach(() => {
		encounter = createEncounter();
		carrier = addCombatant(encounter, CombatantType.Hero, 2, 2);
	});

	it('spreads a contagious condition to an adjacent combatant', () => {
		const neighbour = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const condition = infect(carrier);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, neighbour, false));

		expect(neighbour.combat.conditions.length).toBe(1);
	});

	it('spreads to every adjacent combatant that fails to resist', () => {
		const a = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const b = addCombatant(encounter, CombatantType.Hero, 2, 1);
		const c = addCombatant(encounter, CombatantType.Hero, 1, 2);
		const condition = infect(carrier);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, a, false));

		expect([ a, b, c ].every(x => x.combat.conditions.length === 1)).toBe(true);
	});

	it('does not infect a combatant who resists', () => {
		const neighbour = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const condition = infect(carrier);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, neighbour, true));

		expect(neighbour.combat.conditions.length).toBe(0);
	});

	it('does not spread to a combatant who is not adjacent', () => {
		const distant = addCombatant(encounter, CombatantType.Hero, 0, 0);
		infect(carrier);

		EncounterLogic.spreadContagion(encounter, carrier);

		expect(distant.combat.conditions.length).toBe(0);
	});

	it('does not spread a condition that is not contagious', () => {
		const neighbour = addCombatant(encounter, CombatantType.Hero, 2, 3);
		carrier.combat.conditions.push(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 10, DamageType.Poison));

		EncounterLogic.spreadContagion(encounter, carrier);

		expect(neighbour.combat.conditions.length).toBe(0);
	});

	it('passes on a copy one rank weaker, so an outbreak burns out', () => {
		const neighbour = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const condition = infect(carrier);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, neighbour, false));

		expect(neighbour.combat.conditions[0].rank).toBe(condition.rank - 1);
		expect(condition.rank).toBe(10);
	});

	it('does not give a combatant a condition it already carries', () => {
		const neighbour = addCombatant(encounter, CombatantType.Hero, 2, 3);
		infect(carrier);
		infect(neighbour);

		EncounterLogic.spreadContagion(encounter, carrier);

		expect(neighbour.combat.conditions.length).toBe(1);
	});

	it('does not spread to the dead', () => {
		const corpse = addCombatant(encounter, CombatantType.Hero, 2, 3);
		corpse.combat.state = CombatantState.Dead;
		infect(carrier);

		EncounterLogic.spreadContagion(encounter, carrier);

		expect(corpse.combat.conditions.length).toBe(0);
	});

	it('does not spread a rank 1 condition, which would copy across at rank 0', () => {
		const neighbour = addCombatant(encounter, CombatantType.Hero, 2, 3);
		infect(carrier, 1);

		EncounterLogic.spreadContagion(encounter, carrier);

		expect(neighbour.combat.conditions.length).toBe(0);
	});
});

describe('EncounterLogic.knockout', () => {
	it('wounds the combatant to the threshold that makes them unconscious', () => {
		const encounter = createEncounter();
		const hero = addCombatant(encounter, CombatantType.Hero, 2, 2);

		EncounterLogic.knockout(encounter, hero);

		expect(hero.combat.state).toBe(CombatantState.Unconscious);
		expect(hero.combat.wounds).toBe(EncounterLogic.getTraitRank(encounter, hero, TraitType.Resolve));
	});
});

describe('EncounterLogic.treatWounds', () => {
	let encounter: EncounterModel;
	let hero: CombatantModel;

	beforeEach(() => {
		encounter = createEncounter();
		hero = addCombatant(encounter, CombatantType.Hero, 2, 2);
	});

	it('clears every wound', () => {
		hero.combat.wounds = 2;

		EncounterLogic.treatWounds(encounter, hero);

		expect(hero.combat.wounds).toBe(0);
	});

	it('brings an unconscious hero round', () => {
		hero.combat.wounds = EncounterLogic.getTraitRank(encounter, hero, TraitType.Resolve);
		hero.combat.state = CombatantState.Unconscious;

		EncounterLogic.treatWounds(encounter, hero);

		expect(hero.combat.state).toBe(CombatantState.Prone);
	});

	it('gives a revived hero the turn they were denied', () => {
		hero.combat.wounds = EncounterLogic.getTraitRank(encounter, hero, TraitType.Resolve);
		hero.combat.state = CombatantState.Unconscious;
		// an unconscious combatant starts their turn with none of these
		hero.combat.movement = 0;
		hero.combat.actions = [];

		EncounterLogic.treatWounds(encounter, hero);

		expect(hero.combat.movement).toBeGreaterThan(0);
		expect(hero.combat.actions.length).toBeGreaterThan(0);
	});

	it('revives a hero who is unconscious without wounds', () => {
		// defensive: the revival check is wounds < resolve, so it must not depend on
		// there being wounds to clear
		hero.combat.state = CombatantState.Unconscious;
		hero.combat.wounds = 0;

		EncounterLogic.treatWounds(encounter, hero);

		expect(hero.combat.state).toBe(CombatantState.Prone);
		expect(hero.combat.actions.length).toBeGreaterThan(0);
	});

	it('does not hand a second turn to a hero who was already conscious', () => {
		hero.combat.wounds = 1;
		hero.combat.movement = 3;
		hero.combat.actions = [];

		EncounterLogic.treatWounds(encounter, hero);

		expect(hero.combat.movement).toBe(3);
		expect(hero.combat.actions.length).toBe(0);
	});
});

describe('EncounterLogic.getMoveCost in water and ice', () => {
	let encounter: EncounterModel;
	let hero: CombatantModel;

	beforeEach(() => {
		encounter = createEncounter();
		hero = addCombatant(encounter, CombatantType.Hero, 2, 2);
	});

	it('costs 2 to wade into a water square', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(2);
	});

	it('costs an Aquatic combatant nothing extra', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);
		hero.quirks.push(QuirkType.Aquatic);
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(1);
	});

	it('costs 1 to cross ice - it is not difficult terrain', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Ice);
		expect(EncounterLogic.getMoveCost(encounter, hero, hero.combat.position, 'n')).toBe(1);
	});
});

describe('EncounterLogic.getDamageResistance in water', () => {
	let encounter: EncounterModel;
	let hero: CombatantModel;

	beforeEach(() => {
		encounter = createEncounter();
		hero = addCombatant(encounter, CombatantType.Hero, 2, 2);
	});

	it('shelters a combatant standing in water from fire', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		expect(EncounterLogic.getDamageResistance(encounter, hero, DamageType.Fire)).toBe(3);
	});

	it('gives nothing on dry ground', () => {
		expect(EncounterLogic.getDamageResistance(encounter, hero, DamageType.Fire)).toBe(0);
	});

	it('gives nothing against other damage types', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		expect(EncounterLogic.getDamageResistance(encounter, hero, DamageType.Cold)).toBe(0);
	});

	it('does not shelter an Aquatic combatant, who is in the water rather than behind it', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		hero.quirks.push(QuirkType.Aquatic);
		expect(EncounterLogic.getDamageResistance(encounter, hero, DamageType.Fire)).toBe(0);
	});

	it('gives an Aquatic combatant cold resistance, in or out of the water', () => {
		hero.quirks.push(QuirkType.Aquatic);
		expect(EncounterLogic.getDamageResistance(encounter, hero, DamageType.Cold)).toBe(3);
	});
});

// takeDamage either adds to the damage total or converts it into a wound, depending on an
// Endurance roll, so "was hurt at all" is the only stable assertion
const isHurt = (combatant: CombatantModel) => (combatant.combat.damage > 0) || (combatant.combat.wounds > 0);

describe('EncounterLogic.conductDamage', () => {
	let encounter: EncounterModel;
	let target: CombatantModel;

	beforeEach(() => {
		encounter = createEncounter();
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		target = addCombatant(encounter, CombatantType.Monster, 2, 2);
	});

	it('carries poison to a combatant in adjacent water', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);
		const bystander = addCombatant(encounter, CombatantType.Hero, 2, 1);
		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Poison);
		expect(isHurt(bystander)).toBe(true);
	});

	it('carries acid and electricity too', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);
		setSquareType(encounter, 3, 2, EncounterMapSquareType.Water);
		const a = addCombatant(encounter, CombatantType.Hero, 2, 1);
		const b = addCombatant(encounter, CombatantType.Hero, 3, 2);
		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Acid);
		expect(isHurt(a)).toBe(true);
		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Electricity);
		expect(isHurt(b)).toBe(true);
	});

	it('spares a combatant standing on adjacent dry ground', () => {
		const bystander = addCombatant(encounter, CombatantType.Hero, 2, 1);
		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Poison);
		expect(isHurt(bystander)).toBe(false);
	});

	it('spares a combatant in water that does not touch the target', () => {
		setSquareType(encounter, 2, 0, EncounterMapSquareType.Water);
		const bystander = addCombatant(encounter, CombatantType.Hero, 2, 0);
		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Poison);
		expect(isHurt(bystander)).toBe(false);
	});

	it('does not chain onward from the combatants it reaches', () => {
		// A pool running north: the target at (2,2), one bystander next to them, and a second
		// bystander next to the first but two squares from the target
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);
		setSquareType(encounter, 2, 0, EncounterMapSquareType.Water);
		const near = addCombatant(encounter, CombatantType.Hero, 2, 1);
		const far = addCombatant(encounter, CombatantType.Hero, 2, 0);

		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Poison);

		expect(isHurt(near)).toBe(true);
		expect(isHurt(far)).toBe(false);
	});

	it('does not conduct damage types that water does not carry', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);
		const bystander = addCombatant(encounter, CombatantType.Hero, 2, 1);
		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Edged);
		expect(isHurt(bystander)).toBe(false);
	});

	it('does not conduct from a target standing on dry ground', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Clear);
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);
		const bystander = addCombatant(encounter, CombatantType.Hero, 2, 1);
		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Poison);
		expect(isHurt(bystander)).toBe(false);
	});
});

describe('EncounterLogic water phase changes', () => {
	let encounter: EncounterModel;
	let target: CombatantModel;

	const typeAt = (x: number, y: number) =>
		(encounter.mapSquares.find(sq => (sq.x === x) && (sq.y === y)) as EncounterMapSquareModel).type;

	beforeEach(() => {
		encounter = createEncounter();
		target = addCombatant(encounter, CombatantType.Monster, 2, 2);
	});

	it('freezes the water under and around a target hit with cold', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);

		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Cold);

		expect(typeAt(2, 2)).toBe(EncounterMapSquareType.Ice);
		expect(typeAt(2, 1)).toBe(EncounterMapSquareType.Ice);
	});

	it('leaves water beyond the target untouched', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		setSquareType(encounter, 2, 0, EncounterMapSquareType.Water);

		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Cold);

		expect(typeAt(2, 0)).toBe(EncounterMapSquareType.Water);
	});

	it('leaves clear and obstructed ground alone', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		setSquareType(encounter, 3, 3, EncounterMapSquareType.Obstructed);

		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Cold);

		expect(typeAt(2, 1)).toBe(EncounterMapSquareType.Clear);
		expect(typeAt(3, 3)).toBe(EncounterMapSquareType.Obstructed);
	});

	it('thaws the ice under and around a target hit with fire', () => {
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Ice);
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Ice);

		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Fire);

		expect(typeAt(2, 2)).toBe(EncounterMapSquareType.Water);
		expect(typeAt(2, 1)).toBe(EncounterMapSquareType.Water);
	});

	it('does nothing when the target is not standing on water or ice', () => {
		setSquareType(encounter, 2, 1, EncounterMapSquareType.Water);

		EncounterLogic.takeDamage(encounter, target, 5, DamageType.Cold);

		expect(typeAt(2, 1)).toBe(EncounterMapSquareType.Water);
	});

	it('freezes even when the target resists the damage entirely', () => {
		// Terrain reacts to the cold being dealt, not to how much of it landed
		setSquareType(encounter, 2, 2, EncounterMapSquareType.Water);
		target.quirks.push(QuirkType.Aquatic);

		EncounterLogic.takeDamage(encounter, target, 1, DamageType.Cold);

		expect(typeAt(2, 2)).toBe(EncounterMapSquareType.Ice);
		expect(isHurt(target)).toBe(false);
	});
});
