import { createPlaceholder } from '../models/action';
import { Background } from '../models/background';
import { DamageCategory, DamageType } from '../models/damage';
import { createDamageCategoryBonusFeature, createDamageCategoryResistFeature, createDamageResistFeature, createSkillFeature, createTraitFeature } from '../models/feature';
import { Skill } from '../models/skill';
import { Trait } from '../models/trait';

export const BackgroundList: Background[] = [
	{
		id: 'background-acrobat',
		name: 'Acrobat',
		features: [
			createSkillFeature(Skill.Athletics, 2),
			createTraitFeature(Trait.Speed, 1)
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
			createPlaceholder('Knock prone'),
			createPlaceholder('Extra move')
		]
	},
	{
		id: 'background-mountebank',
		name: 'Mountebank',
		features: [
			// TODO: Attack redirection aura
		],
		actions: [
			createPlaceholder('Command attack'),
			createPlaceholder('Command move'),
			createPlaceholder('Buff ally')
		]
	},
	{
		id: 'background-mystic',
		name: 'Mystic',
		features: [
			createSkillFeature(Skill.Spellcasting, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1),
			createDamageCategoryBonusFeature(DamageCategory.Corruption, 1),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
		],
		actions: [
			createPlaceholder('Confusion (target makes attack)'),
			createPlaceholder('Stun (target loses action)'),
			createPlaceholder('Transfer a condition')
		]
	},
	{
		id: 'background-noble',
		name: 'Noble',
		features: [
			// TODO: Buffing arua
		],
		actions: [
			createPlaceholder('Buff ally'),
			createPlaceholder('Debuff enemy'),
			createPlaceholder('Taunt')
		]
	},
	{
		id: 'background-physician',
		name: 'Physician',
		features: [
			// TODO: Healing aura
		],
		actions: [
			createPlaceholder('Remove condition (ally)'),
			createPlaceholder('Healing (damage)'),
			createPlaceholder('Healing (wounds)')
		]
	},
	{
		id: 'background-reaver',
		name: 'Reaver',
		features: [
			createSkillFeature(Skill.Brawl, 2),
			createSkillFeature(Skill.Weapon, 2),
			createDamageCategoryResistFeature(DamageCategory.Any, 1),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			createPlaceholder('Frenzy (adds to damage)'),
			createPlaceholder('Speed boost'),
			createPlaceholder('Endurance boost')
		]
	},
	{
		id: 'background-sentinel',
		name: 'Sentinel',
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createTraitFeature(Trait.Resolve, 1),
			createDamageResistFeature(DamageType.All, 1)
			// TODO: Prevent disengage aura
		],
		actions: [
			createPlaceholder('Mark enemy'),
			createPlaceholder('Interposing stance')
		]
	},
	{
		id: 'background-thief',
		name: 'Thief',
		features: [
			createSkillFeature(Skill.Reactions, 2),
			createSkillFeature(Skill.Stealth, 2)
			// TODO: Attack redirection aura
		],
		actions: [
			createPlaceholder('Disable trap'),
			createPlaceholder('Set trap')
		]
	}
];
