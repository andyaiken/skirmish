import { describe, expect, it } from 'vitest';

import { CombatantType } from '../../enums/combatant-type';
import { ConditionType } from '../../enums/condition-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';

import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';

import { CombatantLogic } from './combatant-logic';
import { ConditionLogic } from '../condition/condition-logic';
import { EncounterLogic } from '../encounter/encounter-logic';
import { Factory } from '../factory/factory';
import { FeatureLogic } from '../feature/feature-logic';

const createEncounter = (): EncounterModel => {
	const mapSquares = [];
	for (let x = 0; x < 5; ++x) {
		for (let y = 0; y < 5; ++y) {
			mapSquares.push({ x: x, y: y, type: EncounterMapSquareType.Clear });
		}
	}

	return {
		regionID: '', round: 0, combatants: [], loot: [], traps: [], mapSquares: mapSquares, log: []
	};
};

const addCombatant = (encounter: EncounterModel, x: number, y: number): CombatantModel => {
	const combatant = Factory.createCombatant(CombatantType.Hero);
	combatant.combat.position = { x: x, y: y };
	encounter.combatants.push(combatant);
	return combatant;
};

// The Wyrdling is the first card in the game to carry an aura that moves a skill rather than damage
// or a trait. The helper and the plumbing both existed, but nothing had ever exercised them.
describe('an aura that raises a skill', () => {
	const spellcasting = (encounter: EncounterModel, combatant: CombatantModel) => {
		return EncounterLogic.getSkillRank(encounter, combatant, SkillType.Spellcasting);
	};

	it('raises that skill for an ally standing beside it', () => {
		const encounter = createEncounter();
		const ally = addCombatant(encounter, 1, 1);
		const before = spellcasting(encounter, ally);

		const wyrdling = addCombatant(encounter, 1, 2);
		wyrdling.features.push(FeatureLogic.createAuraSkillFeature('test-aura', ConditionType.SkillBonus, SkillType.Spellcasting, 2));

		expect(spellcasting(encounter, ally)).toBe(before + 2);
	});

	it('does not reach an ally standing well away from it', () => {
		const encounter = createEncounter();
		const ally = addCombatant(encounter, 0, 0);
		const before = spellcasting(encounter, ally);

		const wyrdling = addCombatant(encounter, 4, 4);
		wyrdling.features.push(FeatureLogic.createAuraSkillFeature('test-aura', ConditionType.SkillBonus, SkillType.Spellcasting, 2));

		expect(spellcasting(encounter, ally)).toBe(before);
	});

	it('leaves other skills alone', () => {
		const encounter = createEncounter();
		const ally = addCombatant(encounter, 1, 1);
		const before = EncounterLogic.getSkillRank(encounter, ally, SkillType.Stealth);

		const wyrdling = addCombatant(encounter, 1, 2);
		wyrdling.features.push(FeatureLogic.createAuraSkillFeature('test-aura', ConditionType.SkillBonus, SkillType.Spellcasting, 2));

		expect(EncounterLogic.getSkillRank(encounter, ally, SkillType.Stealth)).toBe(before);
	});

	it('is carried by the Wyrdling card itself', () => {
		const auras = CombatantLogic.getFeatureDeck({ speciesID: 'species-wyrdling', roleID: '', backgroundID: '' } as CombatantModel)
			.filter(f => f.skill === SkillType.Spellcasting)
			.filter(f => f.aura === ConditionType.SkillBonus);
		expect(auras).toHaveLength(1);
	});
});

// The all-skills cases have to be tested on someone who has the skill to begin with: getSkillRank
// floors at 0, so a penalty against a rank of 0 reads the same whether it applied or not.
//
// The penalty branch used to read `c.details.trait === TraitType.All` where the bonus branch above
// it reads `c.details.skill === SkillType.All`. Nothing ever sets details.trait on a skill
// condition, so an all-skills penalty applied to nothing at all
describe('a condition that moves every skill at once', () => {
	const stealthRank = (...conditions: ConditionModel[]) => {
		const combatant = Factory.createCombatant(CombatantType.Hero);
		combatant.features.push(FeatureLogic.createSkillFeature('test-base', SkillType.Stealth, 5));
		return CombatantLogic.getSkillRank(combatant, conditions, SkillType.Stealth);
	};

	it('leaves the rank alone when there is no condition', () => {
		expect(stealthRank()).toBe(5);
	});

	it('raises a named skill', () => {
		expect(stealthRank(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 3, SkillType.Stealth))).toBe(8);
	});

	it('raises every skill', () => {
		expect(stealthRank(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 3, SkillType.All))).toBe(8);
	});

	it('lowers a named skill', () => {
		expect(stealthRank(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 3, SkillType.Stealth))).toBe(2);
	});

	it('lowers every skill', () => {
		expect(stealthRank(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 3, SkillType.All))).toBe(2);
	});

	it('lowers a skill the combatant does not have no further than zero', () => {
		const combatant = Factory.createCombatant(CombatantType.Hero);
		const penalty = ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 3, SkillType.All);
		expect(CombatantLogic.getSkillRank(combatant, [ penalty ], SkillType.Brawl)).toBe(0);
	});
});
