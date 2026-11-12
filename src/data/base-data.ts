import { ActionTargetType } from '../enums/action-target-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionEffectModel, ActionModel } from '../models/action';
import type { FeatureModel } from '../models/feature';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action/action-logic';
import { ConditionLogic } from '../logic/condition/condition-logic';
import { FeatureLogic } from '../logic/feature/feature-logic';

export class BaseData {
	static getBaseFeatures = (): FeatureModel[] => {
		return [
			FeatureLogic.createTraitFeature('base-trait', TraitType.Any, 1),
			FeatureLogic.createSkillFeature('base-skill', SkillType.Any, 1),
			FeatureLogic.createProficiencyFeature('base-prof', ItemProficiencyType.Any),
			FeatureLogic.createDamageBonusFeature('base-dmg-bonus', DamageType.Any, 1),
			FeatureLogic.createDamageResistFeature('base-dmg-resist', DamageType.Any, 1)
		];
	};

	static getBaseActions = (): ActionModel[] => {
		return [
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
			},
			{
				id: 'base-5',
				name: 'Dig',
				prerequisites: [
					ActionPrerequisites.wallAdjacent()
				],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Walls, 1)
				],
				effects: [
					ActionEffects.destroyWalls()
				]
			}
		];
	};

	private static weaponCard = (id: string, name: string, proficiency: ItemProficiencyType, skillBonus: number, after: ActionEffectModel[] = []): ActionModel => {
		return {
			id: id,
			name: name,
			prerequisites: [
				ActionPrerequisites.proficiency(proficiency)
			],
			parameters: [
				ActionWeaponParameters.forProficiency(proficiency),
				ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
			],
			effects: [
				ActionEffects.attack({
					weapon: true,
					skill: SkillType.Weapon,
					trait: TraitType.Speed,
					skillBonus: skillBonus,
					hit: [
						ActionEffects.dealWeaponDamage()
					]
				}),
				...after
			]
		};
	};

	// Default actions granted by equipped items; each call returns fresh objects
	static getItemActionTemplates = (): { proficiency: ItemProficiencyType, action: ActionModel }[] => {
		return [
			{
				proficiency: ItemProficiencyType.MilitaryWeapons,
				action: BaseData.weaponCard('default-military', 'Guarded Strike', ItemProficiencyType.MilitaryWeapons, 0, [
					ActionEffects.toSelf([
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Endurance, 1, DamageType.All))
					])
				])
			},
			{
				proficiency: ItemProficiencyType.LargeWeapons,
				action: BaseData.weaponCard('default-large', 'Heavy Blow', ItemProficiencyType.LargeWeapons, 0)
			},
			{
				proficiency: ItemProficiencyType.PairedWeapons,
				action: BaseData.weaponCard('default-paired', 'Nimble Strike', ItemProficiencyType.PairedWeapons, 1)
			},
			{
				proficiency: ItemProficiencyType.RangedWeapons,
				action: BaseData.weaponCard('default-ranged', 'Aimed Shot', ItemProficiencyType.RangedWeapons, 1)
			},
			{
				proficiency: ItemProficiencyType.PowderWeapons,
				action: BaseData.weaponCard('default-powder', 'Discharge', ItemProficiencyType.PowderWeapons, 0)
			},
			{
				proficiency: ItemProficiencyType.Implements,
				action: {
					id: 'default-implement',
					name: 'Focused Bolt',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Electricity, 2)
							]
						})
					]
				}
			}
		];
	};

	static getItemAction = (proficiency: ItemProficiencyType): ActionModel | null => {
		return BaseData.getItemActionTemplates().find(t => t.proficiency === proficiency)?.action ?? null;
	};

	static isItemAction = (id: string): boolean => {
		return BaseData.getItemActionTemplates().some(t => t.action.id === id);
	};
}
