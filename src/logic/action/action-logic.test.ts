import { afterEach, describe, expect, it, vi } from 'vitest';

import { BaseData } from '../../data/base-data';

import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionType } from '../../enums/condition-type';
import { DamageType } from '../../enums/damage-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { SkillType } from '../../enums/skill-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';

import type { ActionEffectModel, ActionModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../../models/action';
import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';
import type { ItemModel } from '../../models/item';

import { ActionEffects, ActionLogic, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from './action-logic';
import { ConditionLogic } from '../condition/condition-logic';
import { EncounterLogic } from '../encounter/encounter-logic';
import { Factory } from '../factory/factory';
import { FeatureLogic } from '../feature/feature-logic';
import { GameLogic } from '../game/game-logic';
import { PackLogic } from '../pack/pack-logic';
import { Random } from '../../utils/random/random';

const combatantWith = (...conditions: ConditionModel[]) => {
	return { combat: { conditions: conditions } } as CombatantModel;
};

const penalty = (trait: TraitType) => ConditionLogic.createTraitPenaltyCondition(trait, 4, trait);

// ActionPrerequisites.condition() used to take a trait, use it for the description, and then store
// data: null. isSatisfied read that null back and compared it against ConditionModel.trait, which is
// never null, so the prerequisite could not be satisfied by any combatant in any state - and the
// seven cards that use it had actions nobody could ever take
describe('ActionPrerequisites.condition', () => {
	it('is satisfied by a combatant carrying any condition', () => {
		const prerequisite = ActionPrerequisites.condition(TraitType.Any);
		expect(ActionPrerequisites.isSatisfied(prerequisite, combatantWith(penalty(TraitType.Endurance)))).toBe(true);
	});

	it('is not satisfied by a combatant carrying none', () => {
		const prerequisite = ActionPrerequisites.condition(TraitType.Any);
		expect(ActionPrerequisites.isSatisfied(prerequisite, combatantWith())).toBe(false);
	});

	it('is satisfied by a condition on the trait it names', () => {
		const prerequisite = ActionPrerequisites.condition(TraitType.Resolve);
		expect(ActionPrerequisites.isSatisfied(prerequisite, combatantWith(penalty(TraitType.Resolve)))).toBe(true);
	});

	it('is not satisfied by a condition on some other trait', () => {
		const prerequisite = ActionPrerequisites.condition(TraitType.Resolve);
		expect(ActionPrerequisites.isSatisfied(prerequisite, combatantWith(penalty(TraitType.Speed)))).toBe(false);
	});
});

// A prerequisite that carries an argument has to store it; one that stores null is a card whose
// action is quietly unplayable, which is not something the type system will catch
describe('every prerequisite on every card in every pack', () => {
	it('carries the data its check will look for', () => {
		const packIDs = PackLogic.getAllPacks().map(p => p.id);
		const needsData = [ 'item', 'condition' ];
		const broken = GameLogic.getAllActions(packIDs)
			.flatMap(action => action.prerequisites.map(p => ({ action: action.name, prerequisite: p })))
			.filter(x => needsData.includes(x.prerequisite.id))
			.filter(x => (x.prerequisite.data === null) || (x.prerequisite.data === undefined))
			.map(x => `${x.action} (${x.prerequisite.id})`);
		expect(broken).toEqual([]);
	});
});

// removeCondition(TraitType.Any) is described as 'Remove a condition', but it used to draw one of
// the three traits at random and look only at that one - so the eight cards that promise to remove
// a condition did nothing about two times in three
describe('ActionEffects.removeCondition', () => {
	const encounterWith = (...conditions: ConditionModel[]) => {
		const encounter = {
			regionID: '', packIDs: [], round: 0, combatants: [], loot: [], traps: [], log: [],
			mapSquares: [ { x: 0, y: 0, type: EncounterMapSquareType.Clear } ]
		} as EncounterModel;
		const combatant = Factory.createCombatant(CombatantType.Hero);
		combatant.combat.conditions = conditions;
		encounter.combatants.push(combatant);
		return { encounter, combatant };
	};

	const removeFrom = (trait: TraitType, ...conditions: ConditionModel[]) => {
		const { encounter, combatant } = encounterWith(...conditions);
		const param = ActionTargetParameters.self();
		param.value = [ combatant.id ];
		ActionEffects.run(ActionEffects.removeCondition(trait), encounter, combatant, [ param ]);
		return combatant.combat.conditions;
	};

	it('removes a condition whatever trait it sits on', () => {
		expect(removeFrom(TraitType.Any, penalty(TraitType.Speed))).toHaveLength(0);
	});

	it('removes exactly one condition, not all of them', () => {
		const left = removeFrom(TraitType.Any, penalty(TraitType.Speed), penalty(TraitType.Resolve));
		expect(left).toHaveLength(1);
	});

	it('removes the worst condition it can find', () => {
		const mild = ConditionLogic.createTraitPenaltyCondition(TraitType.Speed, 1, TraitType.Speed);
		const severe = ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 9, TraitType.Resolve);
		const left = removeFrom(TraitType.Any, mild, severe);
		expect(left.map(c => c.rank)).toEqual([ 1 ]);
	});

	it('still limits itself to the trait it is given', () => {
		const left = removeFrom(TraitType.Resolve, penalty(TraitType.Speed));
		expect(left).toHaveLength(1);
	});

	it('leaves a combatant with nothing to remove alone', () => {
		expect(removeFrom(TraitType.Any)).toHaveLength(0);
	});
});

// Prerequisites are evaluated to decide whether an action can be selected, which happens before a
// target exists - so ifTarget is the only way an action can care what state its target is in. It
// exists so that the thirty knockDown effects in the card pool have something to set up
describe('ActionEffects.ifTarget', () => {
	const encounterWithTarget = () => {
		const encounter = {
			regionID: '', packIDs: [], round: 0, combatants: [], loot: [], traps: [], log: [],
			mapSquares: [ { x: 0, y: 0, type: EncounterMapSquareType.Clear } ]
		} as EncounterModel;
		const attacker = Factory.createCombatant(CombatantType.Hero);
		const target = Factory.createCombatant(CombatantType.Monster);
		encounter.combatants.push(attacker, target);
		return { encounter, attacker, target };
	};

	const runAgainst = (target: CombatantModel, encounter: EncounterModel, attacker: CombatantModel, state: TargetStateType) => {
		const param = ActionTargetParameters.self();
		param.value = [ target.id ];
		const effect = ActionEffects.ifTarget(state, [ ActionEffects.inflictWounds(1) ]);
		ActionEffects.run(effect, encounter, attacker, [ param ]);
		return target.combat.wounds;
	};

	it('runs its children against a target in that state', () => {
		const { encounter, attacker, target } = encounterWithTarget();
		target.combat.state = CombatantState.Prone;
		expect(runAgainst(target, encounter, attacker, TargetStateType.Prone)).toBe(1);
	});

	it('does nothing against a target who is not', () => {
		const { encounter, attacker, target } = encounterWithTarget();
		target.combat.state = CombatantState.Standing;
		expect(runAgainst(target, encounter, attacker, TargetStateType.Prone)).toBe(0);
	});

	it('reads the stunned flag', () => {
		const { encounter, attacker, target } = encounterWithTarget();
		target.combat.stunned = true;
		expect(runAgainst(target, encounter, attacker, TargetStateType.Stunned)).toBe(1);
	});

	it('reads damage', () => {
		const { encounter, attacker, target } = encounterWithTarget();
		target.combat.damage = 3;
		expect(runAgainst(target, encounter, attacker, TargetStateType.Damaged)).toBe(1);
	});

	it('reads conditions', () => {
		const { encounter, attacker, target } = encounterWithTarget();
		target.combat.conditions = [ penalty(TraitType.Speed) ];
		expect(runAgainst(target, encounter, attacker, TargetStateType.Afflicted)).toBe(1);
	});

	it('only affects the targets that qualify, not every target named', () => {
		const { encounter, attacker, target } = encounterWithTarget();
		const standing = Factory.createCombatant(CombatantType.Monster);
		encounter.combatants.push(standing);
		target.combat.state = CombatantState.Prone;

		const param = ActionTargetParameters.self();
		param.value = [ target.id, standing.id ];
		ActionEffects.run(ActionEffects.ifTarget(TargetStateType.Prone, [ ActionEffects.inflictWounds(1) ]), encounter, attacker, [ param ]);

		expect([ target.combat.wounds, standing.combat.wounds ]).toEqual([ 1, 0 ]);
	});

	it('carries its children so the card renders them', () => {
		const effect = ActionEffects.ifTarget(TargetStateType.Prone, [ ActionEffects.knockDown() ]);
		expect(effect.children).toHaveLength(1);
		expect(ActionEffects.getDescription(effect, null, null)).toContain('prone');
	});
});

// A conditional effect is worthless to the AI unless the AI can see it: monsters weigh an action
// once per candidate target, so a knockdown only becomes a set-up if the follow-up scores higher
// against the combatant who is now on the floor
describe('ActionLogic.getTargetStateBonus', () => {
	const prone = () => {
		const c = Factory.createCombatant(CombatantType.Hero);
		c.combat.state = CombatantState.Prone;
		return c;
	};
	const standing = () => Factory.createCombatant(CombatantType.Hero);

	const action = (...effects: ReturnType<typeof ActionEffects.knockDown>[]) => ({
		id: 'test', name: 'Test', prerequisites: [], parameters: [], effects: effects
	});

	const finisher = action(ActionEffects.ifTarget(TargetStateType.Prone, [ ActionEffects.dealDamage(DamageType.Impact, 4) ]));

	it('is nothing for an action with no conditional effect', () => {
		expect(ActionLogic.getTargetStateBonus(action(ActionEffects.knockDown()), prone())).toBe(0);
	});

	it('is nothing when the target is not in the state', () => {
		expect(ActionLogic.getTargetStateBonus(finisher, standing())).toBe(0);
	});

	it('rewards an action whose conditional matches the target', () => {
		expect(ActionLogic.getTargetStateBonus(finisher, prone())).toBeGreaterThan(0);
	});

	it('finds a conditional nested inside an attack', () => {
		const nested = action(ActionEffects.attack({
			weapon: true,
			skill: SkillType.Weapon,
			trait: TraitType.Speed,
			skillBonus: 0,
			hit: [
				ActionEffects.dealWeaponDamage(),
				ActionEffects.ifTarget(TargetStateType.Prone, [ ActionEffects.dealDamage(DamageType.Impact, 4) ])
			]
		}));
		expect(ActionLogic.getTargetStateBonus(nested, prone())).toBeGreaterThan(0);
		expect(ActionLogic.getTargetStateBonus(nested, standing())).toBe(0);
	});

	it('scores the Stormcaller\'s Storm Hammer higher against a prone target', () => {
		const stormcaller = PackLogic.getAllPacks().flatMap(p => PackLogic.getRoles(p.id)).find(r => r.name === 'Stormcaller');
		const hammer = stormcaller?.actions.find(a => a.name === 'Storm Hammer');
		expect(hammer).toBeDefined();
		expect(ActionLogic.getTargetStateBonus(hammer!, prone()))
			.toBeGreaterThan(ActionLogic.getTargetStateBonus(hammer!, standing()));
	});
});

// Turn order is derived live: endTurn parks the finished combatant at Number.MIN_VALUE and
// getActiveCombatants takes whoever is left with the highest initiative. So these effects move a
// number and re-sort - but they must never give a real initiative back to someone already parked,
// which would hand them a second turn in the same round
describe('ActionEffects.delay and hasten', () => {
	const encounterWith = (...initiatives: number[]) => {
		const encounter = {
			regionID: '', packIDs: [], round: 1, combatants: [], loot: [], traps: [], log: [],
			mapSquares: [ { x: 0, y: 0, type: EncounterMapSquareType.Clear } ]
		} as EncounterModel;
		const combatants = initiatives.map(i => {
			const c = Factory.createCombatant(CombatantType.Monster);
			c.combat.initiative = i;
			encounter.combatants.push(c);
			return c;
		});
		return { encounter, combatants };
	};

	const apply = (encounter: EncounterModel, actor: CombatantModel, target: CombatantModel, effect: ReturnType<typeof ActionEffects.delay>) => {
		const param = ActionTargetParameters.self();
		param.value = [ target.id ];
		ActionEffects.run(effect, encounter, actor, [ param ]);
	};

	it('lowers the initiative of a delayed target', () => {
		const { encounter, combatants } = encounterWith(20, 10);
		apply(encounter, combatants[1], combatants[0], ActionEffects.delay(4));
		expect(combatants[0].combat.initiative).toBeLessThan(20);
	});

	it('raises the initiative of a hastened target', () => {
		const { encounter, combatants } = encounterWith(20, 10);
		apply(encounter, combatants[0], combatants[1], ActionEffects.hasten(4));
		expect(combatants[1].combat.initiative).toBeGreaterThan(10);
	});

	// Both start level on purpose. Random.dice never returns less than 1, so any delay at all puts
	// the target strictly behind - whereas starting them one apart ties whenever the roll comes up
	// 1, and sortInitiative's last tie-break is the name, which these two share
	it('re-sorts the turn order so the change actually takes effect', () => {
		const { encounter, combatants } = encounterWith(20, 20);
		const [ delayed, other ] = combatants;
		apply(encounter, other, delayed, ActionEffects.delay(10));
		expect(delayed.combat.initiative).toBeLessThan(other.combat.initiative);
		expect(EncounterLogic.getActiveCombatants(encounter)[0].id).toBe(other.id);
	});

	it('leaves a combatant who has already acted parked, rather than granting a second turn', () => {
		const { encounter, combatants } = encounterWith(Number.MIN_VALUE, 10);
		apply(encounter, combatants[1], combatants[0], ActionEffects.hasten(10));
		expect(combatants[0].combat.initiative).toBe(Number.MIN_VALUE);
		expect(EncounterLogic.getActiveCombatants(encounter).map(c => c.id)).toEqual([ combatants[1].id ]);
	});

	it('never drives initiative below zero, which would sort beneath the parked value', () => {
		const { encounter, combatants } = encounterWith(1, 10);
		apply(encounter, combatants[1], combatants[0], ActionEffects.delay(10));
		expect(combatants[0].combat.initiative).toBeGreaterThanOrEqual(0);
	});

	it('is valued by the AI against a target who still has a turn to lose', () => {
		const harrying = PackLogic.getAllPacks().flatMap(p => PackLogic.getRoles(p.id))
			.find(r => r.name === 'Skirmisher')?.actions.find(a => a.name === 'Harrying Strike');
		expect(harrying).toBeDefined();

		const pending = Factory.createCombatant(CombatantType.Hero);
		pending.combat.initiative = 12;
		const acted = Factory.createCombatant(CombatantType.Hero);
		acted.combat.initiative = Number.MIN_VALUE;

		expect(ActionLogic.getTargetStateBonus(harrying!, pending))
			.toBeGreaterThan(ActionLogic.getTargetStateBonus(harrying!, acted));
	});
});

describe('ActionEffects.createTerrain', () => {
	const createEncounter = (width = 5, height = 5) => {
		const mapSquares = [];
		for (let x = 0; x < width; ++x) {
			for (let y = 0; y < height; ++y) {
				mapSquares.push({ x: x, y: y, type: EncounterMapSquareType.Clear });
			}
		}

		return {
			regionID: '', packIDs: [], round: 1, combatants: [], loot: [], traps: [], log: [],
			mapSquares: mapSquares
		} as EncounterModel;
	};

	const apply = (encounter: EncounterModel, effect: ReturnType<typeof ActionEffects.createTerrain>, x = 2, y = 2) => {
		const param = ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10);
		param.value = [ { x: x, y: y } ];
		ActionEffects.run(effect, encounter, Factory.createCombatant(CombatantType.Monster), [ param ]);
	};

	const countOf = (encounter: EncounterModel, type: EncounterMapSquareType) => {
		return encounter.mapSquares.filter(sq => sq.type === type).length;
	};

	it('paints a blob when given no options, as the Geomancer has always done', () => {
		const encounter = createEncounter(9, 9);
		apply(encounter, ActionEffects.createTerrain(EncounterMapSquareType.Obstructed));
		expect(countOf(encounter, EncounterMapSquareType.Obstructed)).toBeGreaterThanOrEqual(5);
	});

	it('paints exactly the squares inside a radius when given one', () => {
		const encounter = createEncounter();
		apply(encounter, ActionEffects.createTerrain(EncounterMapSquareType.Ice, { radius: 1 }));
		expect(countOf(encounter, EncounterMapSquareType.Ice)).toBe(9);
	});

	it('leaves everything outside the radius alone', () => {
		const encounter = createEncounter();
		apply(encounter, ActionEffects.createTerrain(EncounterMapSquareType.Ice, { radius: 1 }));
		const corner = encounter.mapSquares.find(sq => (sq.x === 0) && (sq.y === 0));
		expect(corner?.type).toBe(EncounterMapSquareType.Clear);
	});

	it('converts only the squares already of the type it names', () => {
		const encounter = createEncounter();
		encounter.mapSquares.filter(sq => sq.x === 2).forEach(sq => sq.type = EncounterMapSquareType.Ice);
		apply(encounter, ActionEffects.createTerrain(EncounterMapSquareType.Water, { radius: 1, from: EncounterMapSquareType.Ice }));

		expect(countOf(encounter, EncounterMapSquareType.Water)).toBe(3);
		expect(countOf(encounter, EncounterMapSquareType.Ice)).toBe(2);
	});

	it('changes nothing, and logs nothing, when there is none of that type to convert', () => {
		const encounter = createEncounter();
		apply(encounter, ActionEffects.createTerrain(EncounterMapSquareType.Water, { radius: 1, from: EncounterMapSquareType.Ice }));
		expect(countOf(encounter, EncounterMapSquareType.Clear)).toBe(25);
		expect(encounter.log).toEqual([]);
	});

	it('still reads the shape it used to store', () => {
		const encounter = createEncounter(9, 9);
		const legacy = { id: 'createTerrain', data: EncounterMapSquareType.Water, children: [] };
		apply(encounter, legacy);
		expect(countOf(encounter, EncounterMapSquareType.Water)).toBeGreaterThanOrEqual(5);
	});

	it('describes what it will convert, not just what it creates', () => {
		const thaw = ActionEffects.createTerrain(EncounterMapSquareType.Water, { radius: 1, from: EncounterMapSquareType.Ice });
		expect(ActionEffects.getDescription(thaw, null, null)).toBe('Turn ice terrain within 1 square to water');
	});
});

const equip = (combatant: CombatantModel, itemID: string) => {
	const item = JSON.parse(JSON.stringify(GameLogic.getItem(itemID))) as ItemModel;
	item.id = `${itemID}-${combatant.items.length}`;
	combatant.items.push(item);
	return item;
};

const proficient = (combatant: CombatantModel, proficiency: ItemProficiencyType) => {
	combatant.features.push(FeatureLogic.createProficiencyFeature(`test-${proficiency}`, proficiency));
};

describe('ActionPrerequisites.proficiency', () => {
	it('is satisfied by an equipped weapon of that group the combatant is proficient with', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		equip(hero, 'item-sword');
		proficient(hero, ItemProficiencyType.MilitaryWeapons);
		expect(ActionPrerequisites.isSatisfied(ActionPrerequisites.proficiency(ItemProficiencyType.MilitaryWeapons), hero)).toBe(true);
	});

	it('is not satisfied without the proficiency', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		equip(hero, 'item-sword');
		expect(ActionPrerequisites.isSatisfied(ActionPrerequisites.proficiency(ItemProficiencyType.MilitaryWeapons), hero)).toBe(false);
	});

	// A Greatsword and Military proficiency is not a proficient Military weapon
	it('is not satisfied by a weapon from some other group', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		equip(hero, 'item-greatsword');
		proficient(hero, ItemProficiencyType.MilitaryWeapons);
		expect(ActionPrerequisites.isSatisfied(ActionPrerequisites.proficiency(ItemProficiencyType.MilitaryWeapons), hero)).toBe(false);
	});

	it('names the group it needs', () => {
		expect(ActionPrerequisites.proficiency(ItemProficiencyType.MilitaryWeapons).description).toBe('Requires you to have a military weapon');
		expect(ActionPrerequisites.proficiency(ItemProficiencyType.Implements).description).toBe('Requires you to have an implement');
	});
});

describe('ActionLogic.checkWeaponParameter', () => {
	const candidatesFor = (parameter: ActionWeaponParameterModel, ...itemIDs: string[]) => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		const items = itemIDs.map(id => equip(hero, id));
		ActionLogic.checkWeaponParameter(parameter, hero);
		return parameter.candidates.map(id => items.find(i => i.id === id)?.name);
	};

	it('offers only the named group when a proficiency is set', () => {
		expect(candidatesFor(ActionWeaponParameters.forProficiency(ItemProficiencyType.MilitaryWeapons), 'item-sword', 'item-greatsword')).toEqual([ 'Sword' ]);
		expect(candidatesFor(ActionWeaponParameters.forProficiency(ItemProficiencyType.LargeWeapons), 'item-sword', 'item-greatsword')).toEqual([ 'Greatsword' ]);
	});

	it('offers nothing when no weapon of that group is equipped', () => {
		const parameter = ActionWeaponParameters.forProficiency(ItemProficiencyType.RangedWeapons);
		expect(candidatesFor(parameter, 'item-sword')).toEqual([]);
		expect(parameter.value).toBeNull();
	});

	// Role cards use the plain melee / ranged parameters, which must still span every group
	it('still offers every melee weapon to a melee parameter', () => {
		expect(candidatesFor(ActionWeaponParameters.melee(), 'item-sword', 'item-greatsword', 'item-longbow')).toEqual([ 'Sword', 'Greatsword' ]);
	});

	it('still offers every ranged weapon to a ranged parameter', () => {
		expect(candidatesFor(ActionWeaponParameters.ranged(), 'item-sword', 'item-longbow')).toEqual([ 'Longbow' ]);
	});

	it('classes each group as melee or ranged', () => {
		const type = (proficiency: ItemProficiencyType) => ActionWeaponParameters.forProficiency(proficiency).type;
		expect([ ItemProficiencyType.MilitaryWeapons, ItemProficiencyType.LargeWeapons, ItemProficiencyType.PairedWeapons ].map(type)).toEqual([ 'melee', 'melee', 'melee' ]);
		expect([ ItemProficiencyType.RangedWeapons, ItemProficiencyType.PowderWeapons ].map(type)).toEqual([ 'ranged', 'ranged' ]);
	});

	it('names the group on the card', () => {
		expect(ActionLogic.getParameterDescription(ActionWeaponParameters.forProficiency(ItemProficiencyType.MilitaryWeapons))).toBe('Uses weapon: Military weapons');
		expect(ActionLogic.getParameterDescription(ActionWeaponParameters.melee())).toBe('Uses weapon: melee');
	});
});

describe('resolving an item default action', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	const setUp = (itemID: string, proficiency: ItemProficiencyType) => {
		const mapSquares = [];
		for (let x = 0; x < 5; ++x) {
			for (let y = 0; y < 5; ++y) {
				mapSquares.push({ x: x, y: y, type: EncounterMapSquareType.Clear });
			}
		}
		const encounter: EncounterModel = {
			regionID: '', packIDs: [], round: 0, combatants: [], loot: [], traps: [], log: [], mapSquares: mapSquares
		};

		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.combat.position = { x: 1, y: 1 };
		equip(hero, itemID);
		proficient(hero, proficiency);

		const monster = Factory.createCombatant(CombatantType.Monster);
		monster.combat.position = { x: 2, y: 1 };
		encounter.combatants.push(hero, monster);

		const action = BaseData.getItemAction(proficiency) as ActionModel;
		EncounterLogic.checkParameters(encounter, hero, action);
		const targets = action.parameters.find(p => p.id === 'targets') as ActionTargetParameterModel;
		expect(targets.candidates).toContain(monster.id);
		targets.value = [ monster.id ];

		return { encounter, hero, monster, action };
	};

	// The attack roll comes first and the defence roll second; anything after that is damage
	const rollAttack = (hit: boolean) => {
		return vi.spyOn(Random, 'dice')
			.mockReturnValueOnce(hit ? 50 : 1)
			.mockReturnValueOnce(hit ? 1 : 50)
			.mockReturnValue(1);
	};

	const run = (encounter: EncounterModel, hero: CombatantModel, action: ActionModel) => {
		EncounterLogic.selectAction(encounter, hero, action);
		EncounterLogic.runAction(encounter, hero);
	};

	const resistance = (hero: CombatantModel) => {
		return hero.combat.conditions.filter(c => c.type === ConditionType.DamageResistance);
	};

	it('gives Guarded Strike a rank 1 resistance to all damage on a hit', () => {
		const { encounter, hero, action } = setUp('item-sword', ItemProficiencyType.MilitaryWeapons);
		vi.spyOn(EncounterLogic, 'dealDamage').mockImplementation(() => {});
		rollAttack(true);
		run(encounter, hero, action);

		const conditions = resistance(hero);
		expect(conditions).toHaveLength(1);
		expect(conditions[0].rank).toBe(1);
		expect(conditions[0].trait).toBe(TraitType.Endurance);
		expect(conditions[0].details.damage).toBe(DamageType.All);
		expect(EncounterLogic.dealDamage).toHaveBeenCalled();
	});

	it('gives Guarded Strike its resistance on a miss too', () => {
		const { encounter, hero, action } = setUp('item-sword', ItemProficiencyType.MilitaryWeapons);
		vi.spyOn(EncounterLogic, 'dealDamage').mockImplementation(() => {});
		rollAttack(false);
		run(encounter, hero, action);

		expect(resistance(hero)).toHaveLength(1);
		expect(EncounterLogic.dealDamage).not.toHaveBeenCalled();
	});

	it('rolls Nimble Strike and Aimed Shot at +1', () => {
		[
			{ itemID: 'item-dagger', proficiency: ItemProficiencyType.PairedWeapons },
			{ itemID: 'item-longbow', proficiency: ItemProficiencyType.RangedWeapons }
		].forEach(({ itemID, proficiency }) => {
			const { encounter, hero, action } = setUp(itemID, proficiency);
			vi.spyOn(EncounterLogic, 'dealDamage').mockImplementation(() => {});
			const dice = rollAttack(true);
			const rank = EncounterLogic.getSkillRank(encounter, hero, SkillType.Weapon);
			run(encounter, hero, action);

			expect(dice.mock.calls[0][0]).toBe(rank + 1);
			vi.restoreAllMocks();
		});
	});

	it('rolls Guarded Strike at no bonus', () => {
		const { encounter, hero, action } = setUp('item-sword', ItemProficiencyType.MilitaryWeapons);
		vi.spyOn(EncounterLogic, 'dealDamage').mockImplementation(() => {});
		const dice = rollAttack(true);
		const rank = EncounterLogic.getSkillRank(encounter, hero, SkillType.Weapon);
		run(encounter, hero, action);

		expect(dice.mock.calls[0][0]).toBe(rank);
	});

	it('has Focused Bolt deal rank 2 Electricity damage with Spellcasting', () => {
		const { encounter, hero, monster, action } = setUp('item-wand', ItemProficiencyType.Implements);
		const damage = vi.spyOn(EncounterLogic, 'dealDamage').mockImplementation(() => {});
		const dice = rollAttack(true);
		const rank = EncounterLogic.getSkillRank(encounter, hero, SkillType.Spellcasting);
		run(encounter, hero, action);

		expect(dice.mock.calls[0][0]).toBe(rank);
		expect(damage).toHaveBeenCalledWith(encounter, hero, monster, 2, DamageType.Electricity);
	});
});

// A default card is there so that nobody is ever without a basic action; it must never be a reason
// to pick it over a role card
describe('item default actions', () => {
	const templates = BaseData.getItemActionTemplates();

	const allEffects = (effects: ActionEffectModel[]): ActionEffectModel[] => {
		return effects.flatMap(e => [ e, ...allEffects(e.children) ]);
	};

	const forEachEffect = (check: (action: ActionModel, effect: ActionEffectModel) => void) => {
		templates.forEach(t => allEffects(t.action.effects).forEach(e => check(t.action, e)));
	};

	it('cover every weapon group and implements, once each', () => {
		expect(templates.map(t => t.proficiency)).toEqual([
			ItemProficiencyType.MilitaryWeapons,
			ItemProficiencyType.LargeWeapons,
			ItemProficiencyType.PairedWeapons,
			ItemProficiencyType.RangedWeapons,
			ItemProficiencyType.PowderWeapons,
			ItemProficiencyType.Implements
		]);
		expect(new Set(templates.map(t => t.action.id)).size).toBe(templates.length);
	});

	it('are each gated on their own group', () => {
		templates.forEach(t => {
			expect(t.action.prerequisites.map(p => p.data)).toEqual([ [ t.proficiency ] ]);
			const weapon = t.action.parameters.find(p => p.id === 'weapon') as ActionWeaponParameterModel | undefined;
			if (t.proficiency !== ItemProficiencyType.Implements) {
				expect(weapon?.proficiency).toBe(t.proficiency);
			}
		});
	});

	it('do not share a name with any card in any pack', () => {
		const names = GameLogic.getAllActions(PackLogic.getAllPacks().map(p => p.id)).map(a => a.name);
		templates.forEach(t => expect(names).not.toContain(t.action.name));
	});

	it('make one attack at no more than +1', () => {
		templates.forEach(t => {
			const attacks = allEffects(t.action.effects).filter(e => e.id === 'attack');
			expect(attacks).toHaveLength(1);
			expect((attacks[0].data as { skillBonus: number }).skillBonus).toBeLessThanOrEqual(1);
		});
	});

	it('have no control or tempo effects', () => {
		const banned = [ 'knockdown', 'stun', 'disarm', 'forceMovement', 'takeAnotherAction' ];
		forEachEffect((action, effect) => expect(banned, action.name).not.toContain(effect.id));
	});

	it('never add to weapon damage', () => {
		forEachEffect((action, effect) => {
			if (effect.id === 'weapondamage') {
				expect(effect.data as number, action.name).toBeLessThanOrEqual(0);
			}
		});
	});

	it('add no condition above rank 1', () => {
		forEachEffect((action, effect) => {
			if (effect.id === 'addcondition') {
				expect((effect.data as ConditionModel).rank, action.name).toBeLessThanOrEqual(1);
			}
		});
	});

	it('deal no fixed damage above rank 2', () => {
		forEachEffect((action, effect) => {
			if (effect.id === 'damage') {
				expect((effect.data as { rank: number }).rank, action.name).toBeLessThanOrEqual(2);
			}
		});
	});
});
