import { ActionTargetType } from '../enums/action-target-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionModel } from '../models/action';
import type { FeatureModel } from '../models/feature';

import { ActionLogic } from '../logic/action-logic';
import { FeatureLogic } from '../logic/feature-logic';

export class UniversalData {
	static getUniversalFeatures = (): FeatureModel[] => {
		return [
			FeatureLogic.createTraitFeature('universal-trait', TraitType.Any, 1),
			FeatureLogic.createSkillFeature('universal-skill', SkillType.Any, 1),
			FeatureLogic.createProficiencyFeature('universal-prof', ItemProficiencyType.Any)
		];
	};

	static getUniversalActions = (): ActionModel[] => {
		return [
			{
				id: 'universal-punch',
				name: 'Unarmed Attack',
				prerequisites: [
					ActionLogic.prerequisiteEmptyHand()
				],
				target: ActionLogic.targetAdjacent(ActionTargetType.Enemies, 1),
				prologue: [
					ActionLogic.effectSelectTargets()
				],
				attack: {
					roll: ActionLogic.attack(SkillType.Brawl, TraitType.Speed),
					hit: [
						ActionLogic.effectDamage(DamageType.Impact, 1)
					],
					miss: []
				},
				epilogue: []
			}
		];
	};
}
