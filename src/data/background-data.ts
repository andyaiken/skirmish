import { AuraType } from '../enums/aura-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { FeatureLogic } from '../logic/feature-logic';

import type { ActionModel } from '../models/action';
import type { BackgroundModel } from '../models/background';

import { Utils } from '../utils/utils';

export class BackgroundData {
	static createActionPlaceholder = (name: string): ActionModel => {
		return {
			id: Utils.guid(),
			name: name
		};
	};

	static getList = (): BackgroundModel[] => {
		return [
			{
				id: 'background-acrobat',
				name: 'Acrobat',
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Move through occupied spaces'),
					BackgroundData.createActionPlaceholder('Burst of speed (roll speed again and add)')
				]
			},
			{
				id: 'background-commander',
				name: 'Commander',
				features: [
					FeatureLogic.createAuraDamageCategoryTypeFeature(AuraType.DamageResistance, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryTypeFeature(AuraType.DamageResistance, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryTypeFeature(AuraType.DamageResistance, DamageCategoryType.Physical, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Knock prone'),
					BackgroundData.createActionPlaceholder('Extra move')
				]
			},
			{
				id: 'background-mountebank',
				name: 'Mountebank',
				features: [
					FeatureLogic.createAuraDamageCategoryTypeFeature(AuraType.DamageVulnerability, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryTypeFeature(AuraType.DamageVulnerability, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryTypeFeature(AuraType.DamageVulnerability, DamageCategoryType.Physical, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Command attack'),
					BackgroundData.createActionPlaceholder('Command move'),
					BackgroundData.createActionPlaceholder('Buff ally')
				]
			},
			{
				id: 'background-mystic',
				name: 'Mystic',
				features: [
					FeatureLogic.createSkillFeature(SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Corruption, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Confusion (target makes attack)'),
					BackgroundData.createActionPlaceholder('Stun (target loses action)'),
					BackgroundData.createActionPlaceholder('Transfer a condition'),
					BackgroundData.createActionPlaceholder('Invert a condition')
				]
			},
			{
				id: 'background-noble',
				name: 'Noble',
				features: [
					FeatureLogic.createAuraFeature(AuraType.EaseMovement, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Buff ally'),
					BackgroundData.createActionPlaceholder('Debuff enemy'),
					BackgroundData.createActionPlaceholder('Taunt')
				]
			},
			{
				id: 'background-physician',
				name: 'Physician',
				features: [
					FeatureLogic.createAuraFeature(AuraType.AutomaticHealing, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Remove condition (ally)'),
					BackgroundData.createActionPlaceholder('Healing (damage)'),
					BackgroundData.createActionPlaceholder('Healing (wounds)')
				]
			},
			{
				id: 'background-reaver',
				name: 'Reaver',
				features: [
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Any, 1),
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Edged, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Impact, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Piercing, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Frenzy (adds to damage)'),
					BackgroundData.createActionPlaceholder('Speed boost'),
					BackgroundData.createActionPlaceholder('Endurance boost')
				]
			},
			{
				id: 'background-sentinel',
				name: 'Sentinel',
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature(DamageType.All, 1),
					FeatureLogic.createAuraFeature(AuraType.PreventMovement, 1)
				],
				actions: [
					BackgroundData.createActionPlaceholder('Mark enemy'),
					BackgroundData.createActionPlaceholder('Interposing stance')
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
					BackgroundData.createActionPlaceholder('Disable trap'),
					BackgroundData.createActionPlaceholder('Set trap')
				]
			}
		];
	};
}
