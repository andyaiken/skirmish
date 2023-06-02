import { ActionTargetType } from '../enums/action-target-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionModel } from '../models/action';
import type { FeatureModel } from '../models/feature';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action-logic';
import { FeatureLogic } from '../logic/feature-logic';

export class BaseData {
	static getBaseFeatures = (): FeatureModel[] => {
		return [
			FeatureLogic.createTraitFeature('base-trait', TraitType.Any, 1),
			FeatureLogic.createSkillFeature('base-skill', SkillType.Any, 1),
			FeatureLogic.createProficiencyFeature('base-prof', ItemProficiencyType.Any)
		];
	};

	static getBaseActions = (): ActionModel[] => {
		return [
			{
				id: 'base-1',
				name: 'Melee Weapon Attack',
				prerequisites: [
					ActionPrerequisites.meleeWeapon()
				],
				parameters: [
					ActionWeaponParameters.melee(),
					ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
				],
				effects: [
					ActionEffects.attack({
						weapon: true,
						skill: SkillType.Weapon,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealWeaponDamage()
						]
					})
				]
			},
			{
				id: 'base-2',
				name: 'Ranged Weapon Attack',
				prerequisites: [
					ActionPrerequisites.rangedWeapon()
				],
				parameters: [
					ActionWeaponParameters.ranged(),
					ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
				],
				effects: [
					ActionEffects.attack({
						weapon: true,
						skill: SkillType.Weapon,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealWeaponDamage()
						]
					})
				]
			},
			{
				id: 'base-3',
				name: 'Unarmed Attack',
				prerequisites: [
					ActionPrerequisites.emptyHand()
				],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Brawl,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Impact, 1)
						]
					})
				]
			},
			{
				id: 'base-4',
				name: 'Stand Up',
				prerequisites: [
					ActionPrerequisites.prone()
				],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.stand()
				]
			}
		];
	};
}
