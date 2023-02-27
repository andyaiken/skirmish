import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
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
					FeatureLogic.createTraitFeature('acrobat-feature-1', TraitType.Speed, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('acrobat-action-1', 'Move through occupied spaces'),
					ActionLogic.createActionPlaceholder('acrobat-action-2', 'Burst of speed (roll speed again and add)')
				]
			},
			{
				id: 'background-artificer',
				name: 'Artificer',
				features: [
					FeatureLogic.createSkillFeature('artificer-feature-1', SkillType.Perception, 2),
					FeatureLogic.createProficiencyFeature('artificer-feature-2', ItemProficiencyType.Any)
				],
				actions: [
					ActionLogic.createActionPlaceholder('artificer-action-1', 'Infuse item'),
					ActionLogic.createActionPlaceholder('artificer-action-2', 'Drain item')
				]
			},
			{
				id: 'background-bard',
				name: 'Bard',
				features: [
					FeatureLogic.createSkillCategoryFeature('bard-feature-1', SkillCategoryType.Mental, 2),
					FeatureLogic.createProficiencyFeature('bard-feature-2', ItemProficiencyType.Any)
				],
				actions: [
					ActionLogic.createActionPlaceholder('bard-action-1', 'Song of health (AOE heal)'),
					ActionLogic.createActionPlaceholder('bard-action-2', 'Song of inspiration (AOE buff)')
				]
			},
			{
				id: 'background-commander',
				name: 'Commander',
				features: [
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-1', ConditionType.DamageCategoryBonus, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-2', ConditionType.DamageCategoryBonus, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-3', ConditionType.DamageCategoryBonus, DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('commander-action-1', 'Knock prone'),
					ActionLogic.createActionPlaceholder('commander-action-2', 'Extra move'),
					ActionLogic.createActionPlaceholder('commander-action-3', 'Reveal hidden enemies')
				]
			},
			{
				id: 'background-mountebank',
				name: 'Mountebank',
				features: [
					FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-1', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-2', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-3', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('mountebank-action-1', 'Command attack'),
					ActionLogic.createActionPlaceholder('mountebank-action-2', 'Command move'),
					ActionLogic.createActionPlaceholder('mountebank-action-3', 'Buff ally')
				]
			},
			{
				id: 'background-mystic',
				name: 'Mystic',
				features: [
					FeatureLogic.createSkillFeature('mystic-feature-1', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-2', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-3', DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryResistFeature('mystic-feature-4', DamageCategoryType.Corruption, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('mystic-action-1', 'Confusion (target makes attack)'),
					ActionLogic.createActionPlaceholder('mystic-action-2', 'Stun (target loses action)'),
					ActionLogic.createActionPlaceholder('mystic-action-3', 'Transfer a condition'),
					ActionLogic.createActionPlaceholder('mystic-action-4', 'Invert a condition')
				]
			},
			{
				id: 'background-noble',
				name: 'Noble',
				features: [
					FeatureLogic.createAuraFeature('noble-feature-1', ConditionType.MovementBonus, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-2', ConditionType.TraitBonus, TraitType.Endurance, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-2', ConditionType.TraitBonus, TraitType.Resolve, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-3', ConditionType.TraitBonus, TraitType.Speed, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('noble-action-1', 'Buff ally'),
					ActionLogic.createActionPlaceholder('noble-action-2', 'Debuff enemy'),
					ActionLogic.createActionPlaceholder('noble-action-3', 'Taunt')
				]
			},
			{
				id: 'background-physician',
				name: 'Physician',
				features: [
					FeatureLogic.createAuraFeature('physician-feature-1', ConditionType.AutoHeal, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('physician-action-1', 'Remove condition (ally)'),
					ActionLogic.createActionPlaceholder('physician-action-2', 'Healing (damage)'),
					ActionLogic.createActionPlaceholder('physician-action-3', 'Healing (wounds)')
				]
			},
			{
				id: 'background-reaver',
				name: 'Reaver',
				features: [
					FeatureLogic.createSkillFeature('reaver-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('reaver-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryResistFeature('reaver-feature-3', DamageCategoryType.Any, 1),
					FeatureLogic.createDamageCategoryBonusFeature('reaver-feature-4', DamageCategoryType.Physical, 1),
					FeatureLogic.createAuraDamageFeature('reaver-feature-5', ConditionType.AutoDamage, DamageType.Edged, 1),
					FeatureLogic.createAuraDamageFeature('reaver-feature-6', ConditionType.AutoDamage, DamageType.Impact, 1),
					FeatureLogic.createAuraDamageFeature('reaver-feature-7', ConditionType.AutoDamage, DamageType.Piercing, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('reaver-action-1', 'Frenzy (adds to damage)'),
					ActionLogic.createActionPlaceholder('reaver-action-2', 'Speed boost'),
					ActionLogic.createActionPlaceholder('reaver-action-3', 'Endurance boost')
				]
			},
			{
				id: 'background-sentinel',
				name: 'Sentinel',
				features: [
					FeatureLogic.createTraitFeature('sentinel-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature('sentinel-feature-2', TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature('sentinel-feature-3', DamageType.All, 1),
					FeatureLogic.createAuraFeature('sentinel-feature-4', ConditionType.MovementPenalty, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('sentinel-action-1', 'Mark enemy'),
					ActionLogic.createActionPlaceholder('sentinel-action-2', 'Interposing stance')
				]
			},
			{
				id: 'background-thief',
				name: 'Thief',
				features: [
					FeatureLogic.createSkillFeature('thief-feature-1', SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature('thief-feature-2', SkillType.Stealth, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('thief-action-1', 'Steal item'),
					ActionLogic.createActionPlaceholder('thief-action-2', 'Disable trap'),
					ActionLogic.createActionPlaceholder('thief-action-3', 'Set trap')
				]
			}
		];
	};
}
