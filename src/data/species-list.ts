import { ActionHelper } from '../models/action';
import { DamageCategory, DamageType } from '../models/damage';
import { FeatureHelper } from '../models/feature';
import { Skill } from '../models/skill';
import { Species } from '../models/species';
import { Trait } from '../models/trait';

export const SpeciesList: Species[] = [
	{
		id: 'species-human',
		name: 'Human',
		traits: [
			Trait.All
		],
		features: [
			FeatureHelper.createSkillFeature(Skill.Any, 2),
			FeatureHelper.createDamageBonusFeature(DamageType.Any, 1),
			FeatureHelper.createDamageResistFeature(DamageType.Any, 1)
			// TODO: Bonus action card slot
		],
		actions: [
			ActionHelper.createPlaceholder('Resilient (remove condition on self)')
		]
	},
	{
		id: 'species-construct',
		name: 'Construct',
		traits: [
			Trait.Endurance
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Endurance, 1),
			FeatureHelper.createDamageResistFeature(DamageType.Poison, 1),
			FeatureHelper.createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Knockdown attack'),
			ActionHelper.createPlaceholder('Repair (heal self damage)')
		]
	},
	{
		id: 'species-deva',
		name: 'Deva',
		traits: [
			Trait.Resolve
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createSkillFeature(Skill.Spellcasting, 2),
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Insight (see opponent stats)'),
			ActionHelper.createPlaceholder('Divine light (spell vs resolve, stuns)')
		]
	},
	{
		id: 'species-dwarf',
		name: 'Dwarf',
		traits: [
			Trait.Endurance
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Endurance, 1),
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createDamageResistFeature(DamageType.Poison, 1),
			FeatureHelper.createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Remove endurance condition on self'),
			ActionHelper.createPlaceholder('Remove resolve condition on self')
		]
	},
	{
		id: 'species-elf',
		name: 'Elf',
		traits: [
			Trait.Speed
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Speed, 1),
			FeatureHelper.createSkillFeature(Skill.Perception, 2),
			FeatureHelper.createSkillFeature(Skill.Reactions, 2),
			FeatureHelper.createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			ActionHelper.createPlaceholder('Detect hidden opponents'),
			ActionHelper.createPlaceholder('Elven Step (teleport self)')
		]
	},
	{
		id: 'species-gnome',
		name: 'Gnome',
		traits: [
			Trait.Speed
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Speed, 1),
			FeatureHelper.createSkillFeature(Skill.Reactions, 2),
			FeatureHelper.createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			ActionHelper.createPlaceholder('Trip attack'),
			ActionHelper.createPlaceholder('Disable trap')
		]
	},
	{
		id: 'species-minotaur',
		name: 'Minotaur',
		traits: [
			Trait.Endurance
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Endurance, 1),
			FeatureHelper.createSkillFeature(Skill.Brawl, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Gore attack'),
			ActionHelper.createPlaceholder('Charge attack'),
			ActionHelper.createPlaceholder('Intimidate')
		]
	},
	{
		id: 'species-pixie',
		name: 'Pixie',
		traits: [
			Trait.Speed
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Speed, 1),
			FeatureHelper.createSkillFeature(Skill.Stealth, 2)
			// TODO: Move through occupied spaces
		],
		actions: [
			ActionHelper.createPlaceholder('Confusion (target makes attack)'),
			ActionHelper.createPlaceholder('Lightning speed')
		]
	},
	{
		id: 'species-reptilian',
		name: 'Reptilian',
		traits: [
			Trait.Speed
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Speed, 1),
			FeatureHelper.createSkillFeature(Skill.Brawl, 2),
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 1),
			FeatureHelper.createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Poison bite'),
			ActionHelper.createPlaceholder('Fear snarl'),
			ActionHelper.createPlaceholder('Regeneration')
		]
	},
	{
		id: 'species-shadowborn',
		name: 'Shadowborn',
		traits: [
			Trait.Resolve
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createSkillFeature(Skill.Brawl, 2),
			FeatureHelper.createSkillFeature(Skill.Stealth, 2),
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
			// TODO: Draining aura
		],
		actions: [
			ActionHelper.createPlaceholder('Transfer a condition'),
			ActionHelper.createPlaceholder('Induce fear'),
			ActionHelper.createPlaceholder('Drain energy')
		]
	},
	{
		id: 'species-werewolf',
		name: 'Werewolf',
		traits: [
			Trait.Resolve
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createSkillFeature(Skill.Brawl, 2),
			FeatureHelper.createSkillFeature(Skill.Perception, 2),
			FeatureHelper.createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			ActionHelper.createPlaceholder('Regeneration'),
			ActionHelper.createPlaceholder('Bite attack'),
			ActionHelper.createPlaceholder('Claw attack')
		]
	}
];
