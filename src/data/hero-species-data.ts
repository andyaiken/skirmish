import { AuraType } from '../enums/aura-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { FeatureLogic } from '../logic/feature-logic';

import type { ActionModel } from '../models/action';
import type { SpeciesModel } from '../models/species';

import { Utils } from '../utils/utils';

export class HeroSpeciesData {
	static createActionPlaceholder = (name: string): ActionModel => {
		return {
			id: Utils.guid(),
			name: name
		};
	};

	static getList = (): SpeciesModel[] => {
		return [
			{
				id: 'species-human',
				name: 'Human',
				size: 1,
				traits: [
					TraitType.All
				],
				features: [
					FeatureLogic.createSkillFeature(SkillType.Any, 2),
					FeatureLogic.createDamageBonusFeature(DamageType.Any, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Any, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Resilient (remove condition on self)')
				]
			},
			{
				id: 'species-construct',
				name: 'Construct',
				size: 1,
				traits: [
					TraitType.Endurance
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Poison, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Psychic, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Knockdown attack'),
					HeroSpeciesData.createActionPlaceholder('Repair (heal self damage)')
				]
			},
			{
				id: 'species-deva',
				name: 'Deva',
				size: 1,
				traits: [
					TraitType.Resolve
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Light, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Insight (see opponent stats)'),
					HeroSpeciesData.createActionPlaceholder('Divine light (spell vs resolve, stuns)')
				]
			},
			{
				id: 'species-dwarf',
				name: 'Dwarf',
				size: 1,
				traits: [
					TraitType.Endurance
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Poison, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Psychic, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Remove endurance condition on self'),
					HeroSpeciesData.createActionPlaceholder('Remove resolve condition on self')
				]
			},
			{
				id: 'species-elf',
				name: 'Elf',
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Perception, 2),
					FeatureLogic.createSkillFeature(SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Detect hidden opponents'),
					HeroSpeciesData.createActionPlaceholder('Elven Step (teleport self)')
				]
			},
			{
				id: 'species-gnome',
				name: 'Gnome',
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Trip attack'),
					HeroSpeciesData.createActionPlaceholder('Disable trap')
				]
			},
			{
				id: 'species-minotaur',
				name: 'Minotaur',
				size: 1,
				traits: [
					TraitType.Endurance
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Gore attack'),
					HeroSpeciesData.createActionPlaceholder('Charge attack'),
					HeroSpeciesData.createActionPlaceholder('Intimidate')
				]
			},
			{
				id: 'species-pixie',
				name: 'Pixie',
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Corruption, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Confusion (target makes attack)'),
					HeroSpeciesData.createActionPlaceholder('Teleport'),
					HeroSpeciesData.createActionPlaceholder('Teleport attack')
				]
			},
			{
				id: 'species-reptilian',
				name: 'Reptilian',
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Psychic, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Poison bite'),
					HeroSpeciesData.createActionPlaceholder('Fear snarl'),
					HeroSpeciesData.createActionPlaceholder('Regeneration')
				]
			},
			{
				id: 'species-shadowborn',
				name: 'Shadowborn',
				size: 1,
				traits: [
					TraitType.Resolve
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Decay, 1)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Transfer a condition'),
					HeroSpeciesData.createActionPlaceholder('Induce fear'),
					HeroSpeciesData.createActionPlaceholder('Drain energy')
				]
			},
			{
				id: 'species-werewolf',
				name: 'Werewolf',
				size: 1,
				traits: [
					TraitType.Resolve
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Perception, 2),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2)
				],
				actions: [
					HeroSpeciesData.createActionPlaceholder('Regeneration'),
					HeroSpeciesData.createActionPlaceholder('Bite attack'),
					HeroSpeciesData.createActionPlaceholder('Claw attack')
				]
			}
		];
	};
}
