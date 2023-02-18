import type { ActionModel } from '../models/action';
import type { BackgroundModel } from '../models/background';
import { TraitType } from '../enums/trait-type';
import { FeatureUtils } from '../logic/feature-utils';
import { Utils } from '../utils/utils';
import { AuraType } from '../enums/aura-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillType } from '../enums/skill-type';

const createActionPlaceholder = (name: string): ActionModel => {
	return {
		id: Utils.guid(),
		name: name
	};
};

export const BackgroundList: BackgroundModel[] = [
	{
		id: 'background-acrobat',
		name: 'Acrobat',
		features: [
			FeatureUtils.createTraitFeature(TraitType.Speed, 1)
		],
		actions: [
			createActionPlaceholder('Move through occupied spaces'),
			createActionPlaceholder('Burst of speed (roll speed again and add)')
		]
	},
	{
		id: 'background-commander',
		name: 'Commander',
		features: [
			FeatureUtils.createAuraDamageCategoryTypeFeature(AuraType.DamageResistance, DamageCategoryType.Corruption, 1),
			FeatureUtils.createAuraDamageCategoryTypeFeature(AuraType.DamageResistance, DamageCategoryType.Energy, 1),
			FeatureUtils.createAuraDamageCategoryTypeFeature(AuraType.DamageResistance, DamageCategoryType.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Knock prone'),
			createActionPlaceholder('Extra move')
		]
	},
	{
		id: 'background-mountebank',
		name: 'Mountebank',
		features: [
			FeatureUtils.createAuraDamageCategoryTypeFeature(AuraType.DamageVulnerability, DamageCategoryType.Corruption, 1),
			FeatureUtils.createAuraDamageCategoryTypeFeature(AuraType.DamageVulnerability, DamageCategoryType.Energy, 1),
			FeatureUtils.createAuraDamageCategoryTypeFeature(AuraType.DamageVulnerability, DamageCategoryType.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Command attack'),
			createActionPlaceholder('Command move'),
			createActionPlaceholder('Buff ally')
		]
	},
	{
		id: 'background-mystic',
		name: 'Mystic',
		features: [
			FeatureUtils.createSkillFeature(SkillType.Spellcasting, 2),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Corruption, 1),
			FeatureUtils.createDamageCategoryTypeResistFeature(DamageCategoryType.Corruption, 1)
		],
		actions: [
			createActionPlaceholder('Confusion (target makes attack)'),
			createActionPlaceholder('Stun (target loses action)'),
			createActionPlaceholder('Transfer a condition'),
			createActionPlaceholder('Invert a condition')
		]
	},
	{
		id: 'background-noble',
		name: 'Noble',
		features: [
			FeatureUtils.createAuraFeature(AuraType.EaseMovement, 1)
		],
		actions: [
			createActionPlaceholder('Buff ally'),
			createActionPlaceholder('Debuff enemy'),
			createActionPlaceholder('Taunt')
		]
	},
	{
		id: 'background-physician',
		name: 'Physician',
		features: [
			FeatureUtils.createAuraFeature(AuraType.AutomaticHealing, 1)
		],
		actions: [
			createActionPlaceholder('Remove condition (ally)'),
			createActionPlaceholder('Healing (damage)'),
			createActionPlaceholder('Healing (wounds)')
		]
	},
	{
		id: 'background-reaver',
		name: 'Reaver',
		features: [
			FeatureUtils.createSkillFeature(SkillType.Brawl, 2),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2),
			FeatureUtils.createDamageCategoryTypeResistFeature(DamageCategoryType.Any, 1),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1),
			FeatureUtils.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Edged, 1),
			FeatureUtils.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Impact, 1),
			FeatureUtils.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Piercing, 1)
		],
		actions: [
			createActionPlaceholder('Frenzy (adds to damage)'),
			createActionPlaceholder('Speed boost'),
			createActionPlaceholder('Endurance boost')
		]
	},
	{
		id: 'background-sentinel',
		name: 'Sentinel',
		features: [
			FeatureUtils.createTraitFeature(TraitType.Endurance, 1),
			FeatureUtils.createTraitFeature(TraitType.Resolve, 1),
			FeatureUtils.createDamageResistFeature(DamageType.All, 1),
			FeatureUtils.createAuraFeature(AuraType.PreventMovement, 1)
		],
		actions: [
			createActionPlaceholder('Mark enemy'),
			createActionPlaceholder('Interposing stance')
		]
	},
	{
		id: 'background-thief',
		name: 'Thief',
		features: [
			FeatureUtils.createSkillFeature(SkillType.Reactions, 2),
			FeatureUtils.createSkillFeature(SkillType.Stealth, 2)
		],
		actions: [
			createActionPlaceholder('Disable trap'),
			createActionPlaceholder('Set trap')
		]
	}
];
