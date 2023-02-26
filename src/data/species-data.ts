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
					FeatureLogic.createSkillFeature('human-feature-1', SkillType.Any, 2),
					FeatureLogic.createDamageBonusFeature('human-feature-2', DamageType.Any, 1),
					FeatureLogic.createDamageResistFeature('human-feature-3', DamageType.Any, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('human-action-1', 'Resilient (remove condition on self)')
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
					FeatureLogic.createTraitFeature('construct-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createDamageResistFeature('construct-feature-2', DamageType.Poison, 1),
					FeatureLogic.createDamageResistFeature('construct-feature-3', DamageType.Psychic, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('construct-action-1', 'Knockdown attack'),
					ActionLogic.createActionPlaceholder('construct-action-2', 'Repair (heal self damage)')
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
					FeatureLogic.createTraitFeature('deva-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('deva-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryResistFeature('deva-feature-3', DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryResistFeature('deva-feature-4', DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageFeature('deva-feature-5', ConditionType.AutoDamage, DamageType.Light, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('deva-action-1', 'Insight (see opponent stats)'),
					ActionLogic.createActionPlaceholder('deva-action-2', 'Divine light (spell vs resolve, stuns)')
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
					FeatureLogic.createTraitFeature('dwarf-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature('dwarf-feature-2', TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature('dwarf-feature-3', DamageType.Poison, 1),
					FeatureLogic.createDamageResistFeature('dwarf-feature-4', DamageType.Psychic, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('dwarf-action-1', 'Remove endurance condition on self'),
					ActionLogic.createActionPlaceholder('dwarf-action-5', 'Remove resolve condition on self')
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
					FeatureLogic.createTraitFeature('elf-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('elf-feature-2', SkillType.Perception, 2),
					FeatureLogic.createSkillFeature('elf-feature-3', SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature('elf-feature-4', SkillType.Stealth, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('elf-action-1', 'Detect hidden opponents'),
					ActionLogic.createActionPlaceholder('elf-action-2', 'Elven Step (teleport self)')
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
					FeatureLogic.createTraitFeature('gnome-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('gnome-feature-2', SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature('gnome-feature-3', SkillType.Stealth, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('gnome-action-1', 'Trip attack'),
					ActionLogic.createActionPlaceholder('gnome-action-2', 'Disable trap')
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
					FeatureLogic.createTraitFeature('minotaur-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('minotaur-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryBonusFeature('minotaur-feature-3', DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('minotaur-action-1', 'Gore attack'),
					ActionLogic.createActionPlaceholder('minotaur-action-2', 'Charge attack'),
					ActionLogic.createActionPlaceholder('minotaur-action-3', 'Intimidate')
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
					FeatureLogic.createTraitFeature('pixie-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('pixie-feature-2', SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryResistFeature('pixie-feature-3', DamageCategoryType.Corruption, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('pixie-action-1', 'Confusion (target makes attack)'),
					ActionLogic.createActionPlaceholder('pixie-action-2', 'Teleport'),
					ActionLogic.createActionPlaceholder('pixie-action-3', 'Teleport attack')
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
					FeatureLogic.createTraitFeature('reptilian-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('reptilian-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryResistFeature('reptilian-feature-3', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageResistFeature('reptilian-feature-4', DamageType.Psychic, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('reptilian-action-1', 'Poison bite'),
					ActionLogic.createActionPlaceholder('reptilian-action-2', 'Fear snarl'),
					ActionLogic.createActionPlaceholder('reptilian-action-3', 'Regeneration')
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
					FeatureLogic.createTraitFeature('shadowborn-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('shadowborn-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('shadowborn-feature-3', SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryResistFeature('shadowborn-feature-4', DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageFeature('shadowborn-feature-5', ConditionType.AutoDamage, DamageType.Decay, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('shadowborn-action-1', 'Transfer a condition'),
					ActionLogic.createActionPlaceholder('shadowborn-action-2', 'Induce fear'),
					ActionLogic.createActionPlaceholder('shadowborn-action-3', 'Drain energy')
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
					FeatureLogic.createTraitFeature('werewolf-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('werewolf-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('werewolf-feature-3', SkillType.Perception, 2),
					FeatureLogic.createSkillFeature('werewolf-feature-4', SkillType.Stealth, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('werewolf-action-1', 'Regeneration'),
					ActionLogic.createActionPlaceholder('werewolf-action-2', 'Bite attack'),
					ActionLogic.createActionPlaceholder('werewolf-action-3', 'Claw attack')
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
					FeatureLogic.createTraitFeature('orc-feature-1', TraitType.Any, 1),
					FeatureLogic.createDamageResistFeature('orc-feature-2', DamageType.All, 1),
					FeatureLogic.createSkillFeature('orc-feature-3', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('orc-feature-4', SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('human-action-1', 'Fury'),
					ActionLogic.createActionPlaceholder('human-action-2', 'Ignore damage')
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
					FeatureLogic.createTraitFeature('goblin-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('goblin-feature-2', SkillType.Reactions, 1),
					FeatureLogic.createSkillFeature('goblin-feature-3', SkillType.Stealth, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('goblin-action-1', 'Sneak attack')
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
					FeatureLogic.createTraitFeature('troll-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature('troll-feature-2', TraitType.Resolve, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-3', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-4', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-5', DamageCategoryType.Corruption, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('troll-action-1', 'Slam'),
					ActionLogic.createActionPlaceholder('troll-action-2', 'Regeneration')
				]
			}
		];
	};
}
