import { createPlaceholder } from '../models/action';
import { DamageCategory, DamageType } from '../models/damage';
import { createDamageBonusFeature, createDamageCategoryBonusFeature, createDamageCategoryResistFeature, createDamageResistFeature, createSkillFeature, createTraitFeature } from '../models/feature';
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
			createSkillFeature(Skill.Any, 2),
			createDamageBonusFeature(DamageType.Any, 1),
			createDamageResistFeature(DamageType.Any, 1)
		],
		actions: [
			createPlaceholder('Resilient (remove condition on self)')
		]
	},
	{
		id: 'species-construct',
		name: 'Construct',
		traits: [
			Trait.Endurance
		],
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createDamageResistFeature(DamageType.Poison, 1),
			createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			createPlaceholder('Knockdown attack'),
			createPlaceholder('Repair (heal self damage)')
		]
	},
	{
		id: 'species-deva',
		name: 'Deva',
		traits: [
			Trait.Resolve
		],
		features: [
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Spellcasting, 2),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1),
			createDamageCategoryResistFeature(DamageCategory.Energy, 1)
		],
		actions: [
			createPlaceholder('Insight (see opponent stats)'),
			createPlaceholder('Divine light (spell vs resolve, stuns)')
		]
	},
	{
		id: 'species-dwarf',
		name: 'Dwarf',
		traits: [
			Trait.Endurance
		],
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createTraitFeature(Trait.Resolve, 1),
			createDamageResistFeature(DamageType.Poison, 1),
			createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			createPlaceholder('Remove endurance condition on self'),
			createPlaceholder('Remove resolve condition on self')
		]
	},
	{
		id: 'species-elf',
		name: 'Elf',
		traits: [
			Trait.Speed
		],
		features: [
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Perception, 2),
			createSkillFeature(Skill.Reactions, 2),
			createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			createPlaceholder('Detect hidden opponents'),
			createPlaceholder('Elven Step (teleport self)')
		]
	},
	{
		id: 'species-gnome',
		name: 'Gnome',
		traits: [
			Trait.Speed
		],
		features: [
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Reactions, 2),
			createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			createPlaceholder('Trip attack'),
			createPlaceholder('Disable trap')
		]
	},
	{
		id: 'species-minotaur',
		name: 'Minotaur',
		traits: [
			Trait.Endurance
		],
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createSkillFeature(Skill.Brawl, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			createPlaceholder('Gore attack'),
			createPlaceholder('Charge attack'),
			createPlaceholder('Intimidate')
		]
	},
	{
		id: 'species-pixie',
		name: 'Pixie',
		traits: [
			Trait.Speed
		],
		features: [
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Stealth, 2),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
		],
		actions: [
			createPlaceholder('Confusion (target makes attack)'),
			createPlaceholder('Lightning speed'),
			createPlaceholder('Move through occupied spaces')
		]
	},
	{
		id: 'species-reptilian',
		name: 'Reptilian',
		traits: [
			Trait.Speed
		],
		features: [
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Brawl, 2),
			createDamageCategoryResistFeature(DamageCategory.Physical, 1),
			createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			createPlaceholder('Poison bite'),
			createPlaceholder('Fear snarl'),
			createPlaceholder('Regeneration')
		]
	},
	{
		id: 'species-shadowborn',
		name: 'Shadowborn',
		traits: [
			Trait.Resolve
		],
		features: [
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Brawl, 2),
			createSkillFeature(Skill.Stealth, 2),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
			// TODO: Energy draining aura
		],
		actions: [
			createPlaceholder('Transfer a condition'),
			createPlaceholder('Induce fear'),
			createPlaceholder('Drain energy')
		]
	},
	{
		id: 'species-werewolf',
		name: 'Werewolf',
		traits: [
			Trait.Resolve
		],
		features: [
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Brawl, 2),
			createSkillFeature(Skill.Perception, 2),
			createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			createPlaceholder('Regeneration'),
			createPlaceholder('Bite attack'),
			createPlaceholder('Claw attack')
		]
	}
];
