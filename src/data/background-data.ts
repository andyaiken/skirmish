import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionLogic } from '../logic/action-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { BackgroundModel } from '../models/background';

export class BackgroundData {
	static getList = (): BackgroundModel[] => {
		return [
			{
				id: 'background-acrobat',
				name: 'Acrobat',
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Move through occupied spaces'),
					ActionLogic.createActionPlaceholder('Burst of speed (roll speed again and add)')
				]
			},
			{
				id: 'background-commander',
				name: 'Commander',
				features: [
					FeatureLogic.createAuraDamageCategoryFeature(ConditionType.DamageCategoryBonus, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryFeature(ConditionType.DamageCategoryBonus, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryFeature(ConditionType.DamageCategoryBonus, DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Knock prone'),
					ActionLogic.createActionPlaceholder('Extra move')
				]
			},
			{
				id: 'background-mountebank',
				name: 'Mountebank',
				features: [
					FeatureLogic.createAuraDamageCategoryFeature(ConditionType.DamageCategoryVulnerability, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryFeature(ConditionType.DamageCategoryVulnerability, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryFeature(ConditionType.DamageCategoryVulnerability, DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Command attack'),
					ActionLogic.createActionPlaceholder('Command move'),
					ActionLogic.createActionPlaceholder('Buff ally')
				]
			},
			{
				id: 'background-mystic',
				name: 'Mystic',
				features: [
					FeatureLogic.createSkillFeature(SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Corruption, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Confusion (target makes attack)'),
					ActionLogic.createActionPlaceholder('Stun (target loses action)'),
					ActionLogic.createActionPlaceholder('Transfer a condition'),
					ActionLogic.createActionPlaceholder('Invert a condition')
				]
			},
			{
				id: 'background-noble',
				name: 'Noble',
				features: [
					FeatureLogic.createAuraFeature(ConditionType.MovementBonus, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Buff ally'),
					ActionLogic.createActionPlaceholder('Debuff enemy'),
					ActionLogic.createActionPlaceholder('Taunt')
				]
			},
			{
				id: 'background-physician',
				name: 'Physician',
				features: [
					FeatureLogic.createAuraFeature(ConditionType.AutoHeal, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Remove condition (ally)'),
					ActionLogic.createActionPlaceholder('Healing (damage)'),
					ActionLogic.createActionPlaceholder('Healing (wounds)')
				]
			},
			{
				id: 'background-reaver',
				name: 'Reaver',
				features: [
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Any, 1),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Edged, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Impact, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Piercing, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Frenzy (adds to damage)'),
					ActionLogic.createActionPlaceholder('Speed boost'),
					ActionLogic.createActionPlaceholder('Endurance boost')
				]
			},
			{
				id: 'background-sentinel',
				name: 'Sentinel',
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature(DamageType.All, 1),
					FeatureLogic.createAuraFeature(ConditionType.MovementPenalty, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Mark enemy'),
					ActionLogic.createActionPlaceholder('Interposing stance')
				]
			},
			{
				id: 'background-thief',
				name: 'Thief',
				features: [
					FeatureLogic.createSkillFeature(SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Disable trap'),
					ActionLogic.createActionPlaceholder('Set trap')
				]
			}
		];
	};
}
