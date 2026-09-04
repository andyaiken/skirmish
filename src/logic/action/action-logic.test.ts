import { describe, expect, it } from 'vitest';

import { CombatantType } from '../../enums/combatant-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { TraitType } from '../../enums/trait-type';

import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from './action-logic';
import { ConditionLogic } from '../condition/condition-logic';
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
