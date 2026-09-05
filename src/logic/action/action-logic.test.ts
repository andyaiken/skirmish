import { describe, expect, it } from 'vitest';

import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { DamageType } from '../../enums/damage-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { SkillType } from '../../enums/skill-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';

import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';

import { ActionEffects, ActionLogic, ActionPrerequisites, ActionTargetParameters } from './action-logic';
import { ConditionLogic } from '../condition/condition-logic';
import { EncounterLogic } from '../encounter/encounter-logic';
import { Factory } from '../factory/factory';
import { GameLogic } from '../game/game-logic';
import { PackLogic } from '../pack/pack-logic';

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
			regionID: '', round: 0, combatants: [], loot: [], traps: [], log: [],
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
			regionID: '', round: 0, combatants: [], loot: [], traps: [], log: [],
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
			regionID: '', round: 1, combatants: [], loot: [], traps: [], log: [],
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

	it('re-sorts the turn order so the change actually takes effect', () => {
		const { encounter, combatants } = encounterWith(20, 19);
		const [ leader, follower ] = combatants;
		apply(encounter, follower, leader, ActionEffects.delay(10));
		expect(EncounterLogic.getActiveCombatants(encounter)[0].id).toBe(follower.id);
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
