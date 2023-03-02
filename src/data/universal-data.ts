import { ActionTargetType } from '../enums/action-target-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionModel } from '../models/action';
import type { FeatureModel } from '../models/feature';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action-logic';
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
				id: 'universal-1',
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
				id: 'universal-2',
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
				id: 'universal-3',
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
			}
		];
	};
}
