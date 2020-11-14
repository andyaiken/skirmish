import { ActionHelper } from '../models/action';
import { Background } from '../models/background';
import { DamageCategory, DamageType } from '../models/damage';
import { FeatureHelper } from '../models/feature';
import { Skill } from '../models/skill';
import { Trait } from '../models/trait';

export const BackgroundList: Background[] = [
	{
		id: 'background-acrobat',
		name: 'Acrobat',
		features: [
			FeatureHelper.createSkillFeature(Skill.Athletics, 2),
			FeatureHelper.createTraitFeature(Trait.Speed, 1)
			// TODO: Move through occupied spaces
		],
		actions: [
			//
		]
	},
	{
		id: 'background-commander',
		name: 'Commander',
		features: [
			// TODO: Protection aura
		],
		actions: [
			ActionHelper.createPlaceholder('Knock prone'),
			ActionHelper.createPlaceholder('Extra move')
		]
	},
	{
		id: 'background-mountebank',
		name: 'Mountebank',
		features: [
			// TODO: Attack redirection aura
		],
		actions: [
			ActionHelper.createPlaceholder('Command attack'),
			ActionHelper.createPlaceholder('Command move'),
			ActionHelper.createPlaceholder('Buff ally')
		]
	},
	{
		id: 'background-mystic',
		name: 'Mystic',
		features: [
			FeatureHelper.createSkillFeature(Skill.Spellcasting, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Energy, 1),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Corruption, 1),
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Confusion (target makes attack)'),
			ActionHelper.createPlaceholder('Stun (target loses action)'),
			ActionHelper.createPlaceholder('Transfer a condition')
		]
	},
	{
		id: 'background-noble',
		name: 'Noble',
		features: [
			// TODO: Buffing arua
		],
		actions: [
			ActionHelper.createPlaceholder('Buff ally'),
			ActionHelper.createPlaceholder('Debuff enemy'),
			ActionHelper.createPlaceholder('Taunt')
		]
	},
	{
		id: 'background-physician',
		name: 'Physician',
		features: [
			// TODO: Healing aura
		],
		actions: [
			ActionHelper.createPlaceholder('Remove condition (ally)'),
			ActionHelper.createPlaceholder('Healing (damage)'),
			ActionHelper.createPlaceholder('Healing (wounds)')
		]
	},
	{
		id: 'background-reaver',
		name: 'Reaver',
		features: [
			FeatureHelper.createSkillFeature(Skill.Brawl, 2),
			FeatureHelper.createSkillFeature(Skill.Weapon, 2),
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Any, 1),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Frenzy (adds to damage)'),
			ActionHelper.createPlaceholder('Speed boost'),
			ActionHelper.createPlaceholder('Endurance boost')
		]
	},
	{
		id: 'background-sentinel',
		name: 'Sentinel',
		features: [
			FeatureHelper.createTraitFeature(Trait.Endurance, 1),
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createDamageResistFeature(DamageType.All, 1)
			// TODO: Prevent disengage aura
		],
		actions: [
			ActionHelper.createPlaceholder('Mark enemy'),
			ActionHelper.createPlaceholder('Interposing stance')
		]
	},
	{
		id: 'background-thief',
		name: 'Thief',
		features: [
			FeatureHelper.createSkillFeature(Skill.Reactions, 2),
			FeatureHelper.createSkillFeature(Skill.Stealth, 2)
			// TODO: Attack redirection aura
		],
		actions: [
			ActionHelper.createPlaceholder('Disable trap'),
			ActionHelper.createPlaceholder('Set trap')
		]
	}
];
