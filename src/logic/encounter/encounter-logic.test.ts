import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TrapData } from '../../data/trap-data';

import { ActionTargetType } from '../../enums/action-target-type';
import { CardType } from '../../enums/card-type';
import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { ContagionType } from '../../enums/contagion-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { QuirkType } from '../../enums/quirk-type';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';
import { TrapType } from '../../enums/trap-type';

import type { ActionModel, ActionTargetParameterModel } from '../../models/action';
import type { EncounterMapSquareModel, EncounterModel, TrapModel } from '../../models/encounter';

import type { BackgroundModel } from '../../models/background';
import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { ItemModel } from '../../models/item';

import { ActionEffects, ActionLogic, ActionTargetParameters } from '../action/action-logic';
import { CombatantLogic } from '../combatant/combatant-logic';
import { ConditionLogic } from '../condition/condition-logic';
import { EncounterLogic } from './encounter-logic';
import { Factory } from '../factory/factory';
import { FeatureLogic } from '../feature/feature-logic';
import { GameLogic } from '../game/game-logic';
import { PackLogic } from '../pack/pack-logic';
import { PathLogic } from '../path/path-logic';

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
		traps: [],
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
		// Naming the species doesn't apply its cards, so give the keg the Brawl its species grants.
		// Detonate attacks with Brawl, and at rank 0 against a defender's rank 1 it can barely land.
		keg.features.push(FeatureLogic.createSkillFeature(`${keg.id} brawl`, SkillType.Brawl, 2));
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

	// Detonate is an attack: it rolls to hit before it rolls damage, and both combatants roll at
	// rank 0, so with real dice the blast missed about half the time and every assertion below
	// that someone was harmed failed at random. Pinning Math.random makes the rolls tie, which
	// the attacker wins. It has to be pinned around the blast rather than for the whole test,
	// because Utils.guid() draws from Math.random too - pin it any earlier and every combatant is
	// handed the same ID, which drops them all from the target list.
	const detonate = (encounter: EncounterModel, keg: CombatantModel) => {
		const random = vi.spyOn(Math, 'random').mockReturnValue(0.85);
		try {
			EncounterLogic.kill(encounter, keg);
		} finally {
			random.mockRestore();
		}
	};

	it('runs the death action against everyone in range', () => {
		const encounter = createEncounter(9, 9);
		const keg = createKeg(encounter, 4, 4);
		const near = addCombatant(encounter, CombatantType.Hero, 4, 3);
		const far = addCombatant(encounter, CombatantType.Hero, 0, 0);

		detonate(encounter, keg);

		// Detonate is a radius 2 burst, so (4,3) is caught and (0,0) is not.
		expect(harm(near)).toBeGreaterThan(0);
		expect(harm(far)).toBe(0);
	});

	it('catches the dying combatant\'s own allies', () => {
		const encounter = createEncounter();
		const keg = createKeg(encounter, 2, 2);
		const ally = addCombatant(encounter, CombatantType.Monster, 2, 1);

		detonate(encounter, keg);

		expect(harm(ally)).toBeGreaterThan(0);
	});

	it('does not run the death action twice', () => {
		const encounter = createEncounter();
		const keg = createKeg(encounter, 2, 2);
		const hero = addCombatant(encounter, CombatantType.Hero, 2, 1);

		detonate(encounter, keg);
		const before = harm(hero);
		detonate(encounter, keg);

		expect(harm(hero)).toBe(before);
	});

	it('chains through a second keg, detonating each at most once', () => {
		const encounter = createEncounter(9, 9);
		const first = createKeg(encounter, 4, 4);
		const second = createKeg(encounter, 4, 5);

		// The second keg is caught in the first blast and, if that kills it,
		// detonates in turn. Reaching the assertions at all proves the chain
		// terminates rather than looping back into the first keg.
		detonate(encounter, first);

		expect(first.combat.state).toBe(CombatantState.Dead);
		expect(harm(second)).toBeGreaterThan(0);

		const detonations = encounter.log
			.filter(message => message.parts.some(part => part.data === 'triggers Detonate'))
			.length;
		expect(detonations).toBeLessThanOrEqual(2);
	});
});

describe('traps', () => {
	let encounter: EncounterModel;
	let hero: CombatantModel;
	let trap: TrapModel;

	// Damage can turn into a wound, resetting the damage counter, so measure both
	const harm = (combatant: CombatantModel) => combatant.combat.damage + combatant.combat.wounds;

	const addTrap = (type: TrapType, x: number, y: number, hidden = 0) => {
		const t = TrapData.createTrap(type, CombatantType.Monster);
		t.position = { x: x, y: y };
		t.hidden = hidden;
		encounter.traps.push(t);
		return t;
	};

	beforeEach(() => {
		encounter = createEncounter();
		hero = addCombatant(encounter, CombatantType.Hero, 2, 2);
		hero.combat.movement = 10;
		trap = addTrap(TrapType.Fire, 2, 3);
	});

	it('go off when someone moves onto them', () => {
		EncounterLogic.move(encounter, hero, 's', 1);

		expect(harm(hero)).toBeGreaterThan(0);
		expect(trap.armed).toBe(false);
	});

	// A sprung trap stays on the map as wreckage, so walking back over it must be harmless
	it('do not go off a second time', () => {
		EncounterLogic.move(encounter, hero, 's', 1);
		const harmed = harm(hero);

		EncounterLogic.move(encounter, hero, 'n', 1);
		EncounterLogic.move(encounter, hero, 's', 1);

		expect(harm(hero)).toBe(harmed);
	});

	it('leave the squares around them alone', () => {
		EncounterLogic.move(encounter, hero, 'e', 1);

		expect(harm(hero)).toBe(0);
		expect(trap.armed).toBe(true);
	});

	it('come into plain sight once they have been set off', () => {
		trap.hidden = 6;

		EncounterLogic.move(encounter, hero, 's', 1);

		expect(trap.hidden).toBe(0);
	});

	it('are visible to the other side only when senses beat their hidden score', () => {
		trap.hidden = 4;

		hero.combat.senses = 3;
		expect(EncounterLogic.canSeeTrap(hero, trap)).toBe(false);

		hero.combat.senses = 4;
		expect(EncounterLogic.canSeeTrap(hero, trap)).toBe(true);
	});

	it('are found by findTraps within the given radius', () => {
		addTrap(TrapType.Spike, 4, 4);

		expect(EncounterLogic.findTraps(encounter, [ { x: 2, y: 2 } ], 1)).toHaveLength(1);
		expect(EncounterLogic.findTraps(encounter, [ { x: 2, y: 2 } ], 3)).toHaveLength(2);
	});

	// A rank 0 roll is half of one die, but that die explodes on a 10 and so can still reach 8 now
	// and again - pin it low enough that this attempt is definitely a failure
	it('survive a failed disarm attempt, but not in hiding', () => {
		trap.hidden = 6;

		const random = vi.spyOn(Math, 'random').mockReturnValue(0.15);
		try {
			EncounterLogic.disarmTrap(encounter, hero, trap);
		} finally {
			random.mockRestore();
		}

		expect(encounter.traps).toHaveLength(1);
		expect(trap.hidden).toBe(0);
	});

	it('are removed by a successful disarm attempt', () => {
		hero.features.push(FeatureLogic.createSkillFeature('test-perception', SkillType.Perception, 3));
		const random = vi.spyOn(Math, 'random').mockReturnValue(0.85);

		try {
			EncounterLogic.disarmTrap(encounter, hero, trap);
		} finally {
			random.mockRestore();
		}

		expect(encounter.traps).toHaveLength(0);
	});

	// However well a snare is concealed, the side that laid it always knows where it is
	it('are always visible to the faction that set them', () => {
		hero.features.push(FeatureLogic.createSkillFeature('test-stealth', SkillType.Stealth, 5));
		hero.combat.senses = 0;
		const monster = addCombatant(encounter, CombatantType.Monster, 0, 0);
		monster.combat.senses = 0;

		const placed = EncounterLogic.placeTrap(encounter, hero, TrapType.Spike, { x: 3, y: 2 });
		placed.hidden = 8;

		expect(EncounterLogic.canSeeTrap(hero, placed)).toBe(true);
		expect(EncounterLogic.canSeeTrap(monster, placed)).toBe(false);
	});

	// The map is the player's view, so a monster's turn must not put the monsters' own traps on it
	it('are not revealed to the player by the turn of a monster that knows about them', () => {
		trap.hidden = 8;
		const monster = addCombatant(encounter, CombatantType.Monster, 0, 0);
		const snare = EncounterLogic.placeTrap(encounter, hero, TrapType.Spike, { x: 3, y: 2 });

		// The monster can see the monster-set trap, but the player is not shown it
		expect(EncounterLogic.canSeeTrap(monster, trap)).toBe(true);
		expect(EncounterLogic.getTrapsVisibleToPlayer(encounter, monster)).toEqual([ snare ]);

		hero.combat.senses = 8;
		expect(EncounterLogic.getTrapsVisibleToPlayer(encounter, hero)).toEqual([ trap, snare ]);
	});

	// Automatic movement - a monster's turn, or a commanded hero - routes around a trap you know
	// about, and only around the ones you know about
	it('are avoided by automatic pathing when the mover can see them', () => {
		const monster = addCombatant(encounter, CombatantType.Monster, 2, 2);
		monster.combat.movement = 10;
		const known = addTrap(TrapType.Spike, 1, 1);
		known.setBy = CombatantType.Monster;

		const paths = PathLogic.findPaths(encounter, monster, true);
		expect(paths.some(p => (p.x === known.position.x) && (p.y === known.position.y))).toBe(false);
	});

	it('are walked over by automatic pathing when the mover cannot see them', () => {
		const monster = addCombatant(encounter, CombatantType.Monster, 2, 2);
		monster.combat.movement = 10;
		monster.combat.senses = 0;
		const unknown = addTrap(TrapType.Spike, 1, 1, 8);
		unknown.setBy = CombatantType.Hero;

		const paths = PathLogic.findPaths(encounter, monster, true);
		expect(paths.some(p => (p.x === unknown.position.x) && (p.y === unknown.position.y))).toBe(true);
	});

	it('no longer block automatic pathing once they have been sprung', () => {
		const monster = addCombatant(encounter, CombatantType.Monster, 2, 2);
		monster.combat.movement = 10;
		const sprung = addTrap(TrapType.Spike, 1, 1);
		sprung.armed = false;

		const paths = PathLogic.findPaths(encounter, monster, true);
		expect(paths.some(p => (p.x === sprung.position.x) && (p.y === sprung.position.y))).toBe(true);
	});

	// However you arrive on a square you arrive on it, so a teleport springs a trap the same way a
	// step does - otherwise the Scroll of Recall would be a way to ignore them
	it('go off when someone is moved onto them without walking', () => {
		const param = ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10);
		param.value = [ trap.position ];

		ActionEffects.run(ActionEffects.moveToTargetSquare(), encounter, hero, [ param ]);

		expect(hero.combat.position).toEqual(trap.position);
		expect(trap.armed).toBe(false);
		expect(harm(hero)).toBeGreaterThan(0);
	});

	// The bonus is what a combatant adds to what they dish out; a trap is not their attack
	it('do not scale with the damage bonus of whoever sets them off', () => {
		const specialist = addCombatant(encounter, CombatantType.Hero, 0, 0);
		specialist.combat.movement = 10;
		specialist.features.push(FeatureLogic.createDamageBonusFeature('test-fire', DamageType.Fire, 5));
		addTrap(TrapType.Fire, 0, 1);

		const random = vi.spyOn(Math, 'random').mockReturnValue(0.85);
		try {
			EncounterLogic.move(encounter, hero, 's', 1);
			EncounterLogic.move(encounter, specialist, 's', 1);
		} finally {
			random.mockRestore();
		}

		expect(harm(specialist)).toBe(harm(hero));
	});

	// An action that can never do anything must not be allowed to burn the turn's action
	it('leave a disarm action unrunnable when there are none in range', () => {
		const trapper = GameLogic.getBackground('background-trapper') as BackgroundModel;
		const action = JSON.parse(JSON.stringify(trapper.actions.find(a => a.name === 'Disarm Trap'))) as ActionModel;

		// The only trap is two squares away, and this one reaches an adjacent square
		EncounterLogic.checkParameters(encounter, hero, action);
		const param = action.parameters.find(p => p.id === 'targets') as ActionTargetParameterModel;
		expect(param.candidates).toHaveLength(1);
		expect(ActionLogic.isParameterSet(param)).toBe(true);

		encounter.traps = [];
		EncounterLogic.checkParameters(encounter, hero, action);
		expect(param.candidates).toHaveLength(0);
		expect(ActionLogic.isParameterSet(param)).toBe(false);
	});

	it('can be set by a combatant, and go off when someone walks into them', () => {
		const placed = EncounterLogic.placeTrap(encounter, hero, TrapType.Spike, { x: 3, y: 2 });
		expect(encounter.traps).toHaveLength(2);

		const victim = addCombatant(encounter, CombatantType.Monster, 4, 2);
		victim.combat.movement = 10;
		EncounterLogic.move(encounter, victim, 'w', 1);

		expect(placed.armed).toBe(false);
		expect(harm(victim)).toBeGreaterThan(0);
	});
});

describe('scrolls in an encounter', () => {
	let encounter: EncounterModel;
	let hero: CombatantModel;
	let scroll: ItemModel;

	beforeEach(() => {
		encounter = createEncounter();
		hero = addCombatant(encounter, CombatantType.Hero, 2, 2);

		scroll = JSON.parse(JSON.stringify(GameLogic.getScroll('scroll-warding'))) as ItemModel;
		scroll.id = 'carried-scroll';
		hero.carried.push(scroll);
	});

	it('put a card into the hand alongside the drawn actions', () => {
		EncounterLogic.drawActions(encounter, hero);
		expect(hero.combat.actions.map(a => a.id)).toContain(scroll.id);
	});

	// Two copies of the same scroll are separate cards, so their actions can't share an ID
	it('give each copy of a scroll its own card', () => {
		const second = JSON.parse(JSON.stringify(scroll)) as ItemModel;
		second.id = 'carried-scroll-2';
		hero.carried.push(second);

		EncounterLogic.drawActions(encounter, hero);
		expect(hero.combat.actions.filter(a => (a.id === scroll.id) || (a.id === second.id))).toHaveLength(2);
	});

	it('are named as the source of their own action', () => {
		EncounterLogic.drawActions(encounter, hero);
		expect(CombatantLogic.getActionSource(hero, scroll.id)).toBe(scroll.name);
		expect(CombatantLogic.getActionSourceType(hero, scroll.id)).toBe(CardType.Scroll);
	});

	it('are spent when the action is run', () => {
		EncounterLogic.drawActions(encounter, hero);
		const action = hero.combat.actions.find(a => a.id === scroll.id) as ActionModel;

		EncounterLogic.selectAction(encounter, hero, action);
		EncounterLogic.runAction(encounter, hero);

		expect(hero.carried.map(i => i.id)).not.toContain(scroll.id);
		expect(hero.combat.actions.map(a => a.id)).not.toContain(scroll.id);
	});

	it('do not come back when the hand is redrawn', () => {
		EncounterLogic.drawActions(encounter, hero);
		const action = hero.combat.actions.find(a => a.id === scroll.id) as ActionModel;

		EncounterLogic.selectAction(encounter, hero, action);
		EncounterLogic.runAction(encounter, hero);
		EncounterLogic.drawActions(encounter, hero);

		expect(hero.combat.actions.map(a => a.id)).not.toContain(scroll.id);
	});

	// The Scribe's whole contribution is the createScroll effect, so it has to put a usable copy
	// into the carried items
	it('can be created by an action effect', () => {
		const scribe = GameLogic.getBackground('background-scribe') as BackgroundModel;
		const action = scribe.actions.find(a => a.name.includes('Warding')) as ActionModel;

		EncounterLogic.drawActions(encounter, hero);
		hero.combat.actions.push(action);
		EncounterLogic.selectAction(encounter, hero, action);
		EncounterLogic.runAction(encounter, hero);

		const created = hero.carried.filter(i => i.name === 'Scroll of Warding');
		expect(created).toHaveLength(2);
		expect(created[0].id).not.toBe(created[1].id);
	});

	it('leave the hand when the scroll is dropped', () => {
		EncounterLogic.drawActions(encounter, hero);
		EncounterLogic.dropItem(encounter, hero, scroll);

		expect(hero.combat.actions.map(a => a.id)).not.toContain(scroll.id);
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

	// Contagion is read relative to whoever is carrying the condition now, not to whoever first
	// applied it - a hero carrying a plague spreads it to the heroes standing beside them
	it('spreads an Allies contagion only to the carrier\'s own side', () => {
		const ally = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const enemy = addCombatant(encounter, CombatantType.Monster, 2, 1);
		const condition = ConditionLogic.makeContagious(
			ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 10, DamageType.Poison),
			ContagionType.Allies
		);
		carrier.combat.conditions.push(condition);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, ally, false));

		expect(ally.combat.conditions).toHaveLength(1);
		expect(enemy.combat.conditions).toHaveLength(0);
	});

	it('spreads an Enemies contagion only to the other side', () => {
		const ally = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const enemy = addCombatant(encounter, CombatantType.Monster, 2, 1);
		const condition = ConditionLogic.makeContagious(
			ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 10, DamageType.Poison),
			ContagionType.Enemies
		);
		carrier.combat.conditions.push(condition);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, enemy, false));

		expect(enemy.combat.conditions).toHaveLength(1);
		expect(ally.combat.conditions).toHaveLength(0);
	});

	it('still reaches both sides when the contagion names neither', () => {
		const ally = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const enemy = addCombatant(encounter, CombatantType.Monster, 2, 1);
		const condition = infect(carrier);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, ally, false));

		expect(ally.combat.conditions).toHaveLength(1);
		expect(enemy.combat.conditions).toHaveLength(1);
	});

	// The scripted rng fixes whether the target's Trait roll beats the condition's rank. For an
	// affliction that means shrugging it off; for a blessing it has to mean the opposite, or the
	// stoutest ally would be the one least able to share in it
	const bless = (combatant: CombatantModel, rank = 10) => {
		const condition = ConditionLogic.makeContagious(
			ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, rank, DamageCategoryType.Corruption),
			ContagionType.Allies
		);
		combatant.combat.conditions.push(condition);
		return condition;
	};

	it('gives a blessing to the ally whose Trait roll beats it', () => {
		const ally = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const condition = bless(carrier);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, ally, true));

		expect(ally.combat.conditions).toHaveLength(1);
	});

	it('withholds a blessing from the ally whose Trait roll does not', () => {
		const ally = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const condition = bless(carrier);

		EncounterLogic.spreadContagion(encounter, carrier, scripted(condition, ally, false));

		expect(ally.combat.conditions).toHaveLength(0);
	});

	it('reads the very same roll the opposite way for a blessing and an affliction', () => {
		const blessed = addCombatant(encounter, CombatantType.Hero, 2, 3);
		const boon = bless(carrier);
		EncounterLogic.spreadContagion(encounter, carrier, scripted(boon, blessed, true));

		const other = createEncounter();
		const plagued = addCombatant(other, CombatantType.Hero, 2, 2);
		const neighbour = addCombatant(other, CombatantType.Hero, 2, 3);
		const bane = ConditionLogic.makeContagious(
			ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 10, DamageType.Poison)
		);
		plagued.combat.conditions.push(bane);
		const rank = Math.max(EncounterLogic.getTraitRank(other, neighbour, bane.trait), 1);
		const cycle = rank + bane.rank;
		let i = 0;
		EncounterLogic.spreadContagion(other, plagued, () => ((i++ % cycle) < rank) ? 0.85 : 0);

		// Same roll: the blessing lands, the plague is shrugged off
		expect([ blessed.combat.conditions.length, neighbour.combat.conditions.length ]).toEqual([ 1, 0 ]);
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
