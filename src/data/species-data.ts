import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionLogic } from '../logic/action-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { SpeciesModel } from '../models/species';

export class SpeciesData {
	static getList = (): SpeciesModel[] => {
		return [
			{
				id: 'species-human',
				name: 'Human',
				type: CombatantType.Hero,
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
					ActionLogic.createActionPlaceholder('Resilient (remove condition on self)')
				]
			},
			{
				id: 'species-construct',
				name: 'Construct',
				type: CombatantType.Hero,
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
					ActionLogic.createActionPlaceholder('Knockdown attack'),
					ActionLogic.createActionPlaceholder('Repair (heal self damage)')
				]
			},
			{
				id: 'species-deva',
				name: 'Deva',
				type: CombatantType.Hero,
				size: 1,
				traits: [
					TraitType.Resolve
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Light, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Insight (see opponent stats)'),
					ActionLogic.createActionPlaceholder('Divine light (spell vs resolve, stuns)')
				]
			},
			{
				id: 'species-dwarf',
				name: 'Dwarf',
				type: CombatantType.Hero,
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
					ActionLogic.createActionPlaceholder('Remove endurance condition on self'),
					ActionLogic.createActionPlaceholder('Remove resolve condition on self')
				]
			},
			{
				id: 'species-elf',
				name: 'Elf',
				type: CombatantType.Hero,
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
					ActionLogic.createActionPlaceholder('Detect hidden opponents'),
					ActionLogic.createActionPlaceholder('Elven Step (teleport self)')
				]
			},
			{
				id: 'species-gnome',
				name: 'Gnome',
				type: CombatantType.Hero,
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
					ActionLogic.createActionPlaceholder('Trip attack'),
					ActionLogic.createActionPlaceholder('Disable trap')
				]
			},
			{
				id: 'species-minotaur',
				name: 'Minotaur',
				type: CombatantType.Hero,
				size: 1,
				traits: [
					TraitType.Endurance
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Gore attack'),
					ActionLogic.createActionPlaceholder('Charge attack'),
					ActionLogic.createActionPlaceholder('Intimidate')
				]
			},
			{
				id: 'species-pixie',
				name: 'Pixie',
				type: CombatantType.Hero,
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Corruption, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Confusion (target makes attack)'),
					ActionLogic.createActionPlaceholder('Teleport'),
					ActionLogic.createActionPlaceholder('Teleport attack')
				]
			},
			{
				id: 'species-reptilian',
				name: 'Reptilian',
				type: CombatantType.Hero,
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Psychic, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Poison bite'),
					ActionLogic.createActionPlaceholder('Fear snarl'),
					ActionLogic.createActionPlaceholder('Regeneration')
				]
			},
			{
				id: 'species-shadowborn',
				name: 'Shadowborn',
				type: CombatantType.Hero,
				size: 1,
				traits: [
					TraitType.Resolve
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Decay, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Transfer a condition'),
					ActionLogic.createActionPlaceholder('Induce fear'),
					ActionLogic.createActionPlaceholder('Drain energy')
				]
			},
			{
				id: 'species-werewolf',
				name: 'Werewolf',
				type: CombatantType.Hero,
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
					ActionLogic.createActionPlaceholder('Regeneration'),
					ActionLogic.createActionPlaceholder('Bite attack'),
					ActionLogic.createActionPlaceholder('Claw attack')
				]
			},
			{
				id: 'species-orc',
				name: 'Orc',
				type: CombatantType.Monster,
				size: 1,
				traits: [
					TraitType.All
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Any, 1),
					FeatureLogic.createDamageResistFeature(DamageType.All, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Fury'),
					ActionLogic.createActionPlaceholder('Ignore damage')
				]
			},
			{
				id: 'species-goblin',
				name: 'Goblin',
				type: CombatantType.Monster,
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Reactions, 1),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Sneak attack')
				]
			},
			{
				id: 'species-troll',
				name: 'Troll',
				type: CombatantType.Monster,
				size: 2,
				traits: [
					TraitType.Endurance,
					TraitType.Resolve
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Corruption, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Slam'),
					ActionLogic.createActionPlaceholder('Regeneration')
				]
			}
		];
	};
}
