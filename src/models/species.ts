import { ActionModel, createActionPlaceholder } from './action';
import { AuraType } from './aura';
import { DamageType, DamageCategory } from './damage';
import {
	createAuraDamageFeature,
	createDamageBonusFeature,
	createDamageCategoryBonusFeature,
	createDamageCategoryResistFeature,
	createDamageResistFeature,
	createSkillFeature,
	createTraitFeature,
	FeatureModel
} from './feature';
import { GameModel } from './game';
import { Skill } from './skill';
import { Trait } from './trait';

export interface SpeciesModel {
	id: string;
	name: string;
	size: number;
	traits: Trait[];
	features: FeatureModel[];
	actions: ActionModel[];
}

export const HeroSpeciesList: SpeciesModel[] = [
	{
		id: 'species-human',
		name: 'Human',
		size: 1,
		traits: [
			Trait.All
		],
		features: [
			createSkillFeature(Skill.Any, 2),
			createDamageBonusFeature(DamageType.Any, 1),
			createDamageResistFeature(DamageType.Any, 1)
		],
		actions: [
			createActionPlaceholder('Resilient (remove condition on self)')
		]
	},
	{
		id: 'species-construct',
		name: 'Construct',
		size: 1,
		traits: [
			Trait.Endurance
		],
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createDamageResistFeature(DamageType.Poison, 1),
			createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			createActionPlaceholder('Knockdown attack'),
			createActionPlaceholder('Repair (heal self damage)')
		]
	},
	{
		id: 'species-deva',
		name: 'Deva',
		size: 1,
		traits: [
			Trait.Resolve
		],
		features: [
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Spellcasting, 2),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1),
			createDamageCategoryResistFeature(DamageCategory.Energy, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Light, 1)
		],
		actions: [
			createActionPlaceholder('Insight (see opponent stats)'),
			createActionPlaceholder('Divine light (spell vs resolve, stuns)')
		]
	},
	{
		id: 'species-dwarf',
		name: 'Dwarf',
		size: 1,
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
			createActionPlaceholder('Remove endurance condition on self'),
			createActionPlaceholder('Remove resolve condition on self')
		]
	},
	{
		id: 'species-elf',
		name: 'Elf',
		size: 1,
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
			createActionPlaceholder('Detect hidden opponents'),
			createActionPlaceholder('Elven Step (teleport self)')
		]
	},
	{
		id: 'species-gnome',
		name: 'Gnome',
		size: 1,
		traits: [
			Trait.Speed
		],
		features: [
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Reactions, 2),
			createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			createActionPlaceholder('Trip attack'),
			createActionPlaceholder('Disable trap')
		]
	},
	{
		id: 'species-minotaur',
		name: 'Minotaur',
		size: 1,
		traits: [
			Trait.Endurance
		],
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createSkillFeature(Skill.Brawl, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Gore attack'),
			createActionPlaceholder('Charge attack'),
			createActionPlaceholder('Intimidate')
		]
	},
	{
		id: 'species-pixie',
		name: 'Pixie',
		size: 1,
		traits: [
			Trait.Speed
		],
		features: [
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Stealth, 2),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
		],
		actions: [
			createActionPlaceholder('Confusion (target makes attack)'),
			createActionPlaceholder('Teleport'),
			createActionPlaceholder('Teleport attack')
		]
	},
	{
		id: 'species-reptilian',
		name: 'Reptilian',
		size: 1,
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
			createActionPlaceholder('Poison bite'),
			createActionPlaceholder('Fear snarl'),
			createActionPlaceholder('Regeneration')
		]
	},
	{
		id: 'species-shadowborn',
		name: 'Shadowborn',
		size: 1,
		traits: [
			Trait.Resolve
		],
		features: [
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Brawl, 2),
			createSkillFeature(Skill.Stealth, 2),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Decay, 1)
		],
		actions: [
			createActionPlaceholder('Transfer a condition'),
			createActionPlaceholder('Induce fear'),
			createActionPlaceholder('Drain energy')
		]
	},
	{
		id: 'species-werewolf',
		name: 'Werewolf',
		size: 1,
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
			createActionPlaceholder('Regeneration'),
			createActionPlaceholder('Bite attack'),
			createActionPlaceholder('Claw attack')
		]
	}
];

export const MonsterSpeciesList: SpeciesModel[] = [
	{
		id: 'species-orc',
		name: 'Orc',
		size: 1,
		traits: [
			Trait.All
		],
		features: [
			createTraitFeature(Trait.Any, 1),
			createDamageResistFeature(DamageType.All, 1),
			createSkillFeature(Skill.Brawl, 2),
			createSkillFeature(Skill.Weapon, 2),
		],
		actions: [
			createActionPlaceholder('Fury'),
			createActionPlaceholder('Ignore damage')
		]
	},
	{
		id: 'species-goblin',
		name: 'Goblin',
		size: 1,
		traits: [
			Trait.Speed
		],
		features: [
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Reactions, 1),
			createSkillFeature(Skill.Stealth, 1)
		],
		actions: [
			createActionPlaceholder('Sneak attack')
		]
	},
	{
		id: 'species-troll',
		name: 'Troll',
		size: 2,
		traits: [
			Trait.Endurance,
			Trait.Resolve
		],
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createTraitFeature(Trait.Resolve, 1),
			createDamageCategoryResistFeature(DamageCategory.Physical, 1),
			createDamageCategoryResistFeature(DamageCategory.Energy, 1),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
		],
		actions: [
			createActionPlaceholder('Slam'),
			createActionPlaceholder('Regeneration')
		]
	},
];

export const getSpecies = (id: string) => {
	const all = ([] as SpeciesModel[]).concat(HeroSpeciesList).concat(MonsterSpeciesList);
	return all.find(s => s.id === id);
}

export const getSpeciesDeck = (game: GameModel | null = null) => {
	if (game) {
		const used = game.heroes.map(h => h.speciesID);

		const deck = HeroSpeciesList
			.filter(species => !used.includes(species.id))
			.map(species => species.id);

		if (deck.length >= 3) {
			return deck;
		}

		return HeroSpeciesList.map(species => species.id);
	}

	return MonsterSpeciesList.map(species => species.id);
}
