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
					FeatureLogic.createSkillFeature('human-feature-1', SkillType.Any, 2)
				],
				actions: [
					{
						id: 'human-action-1',
						name: 'Resilient (remove condition on self)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'construct-action-1',
						name: 'Knockdown attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'construct-action-2',
						name: 'Repair (heal self damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'deva-action-1',
						name: 'Insight (see opponent stats)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'deva-action-2',
						name: 'Divine light (spell vs resolve, stuns)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'dwarf-action-1',
						name: 'Remove endurance condition on self',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'dwarf-action-2',
						name: 'Remove resolve condition on self',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'elf-action-1',
						name: 'Detect hidden opponents',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'elf-action-2',
						name: 'Elven Step (teleport self)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'gnome-action-1',
						name: 'Trip attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'gnome-action-2',
						name: 'Disable trap',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'minotaur-action-1',
						name: 'Gore attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'minotaur-action-2',
						name: 'Charge attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'minotaur-action-3',
						name: 'Intimidate',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'pixie-action-1',
						name: 'Confusion (target makes attack)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'pixie-action-2',
						name: 'Teleport',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'pixie-action-3',
						name: 'Teleport attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'reptilian-action-1',
						name: 'Poison bite',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'reptilian-action-2',
						name: 'Fear snarl',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'reptilian-action-3',
						name: 'Regeneration',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'shadowborn-action-1',
						name: 'Transfer a condition',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'shadowborn-action-2',
						name: 'Induce fear',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'shadowborn-action-3',
						name: 'Drain energy',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'werewolf-action-1',
						name: 'Regeneration',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'werewolf-action-2',
						name: 'Bite attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'werewolf-action-3',
						name: 'Claw attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'orc-action-1',
						name: 'Fury',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'orc-action-2',
						name: 'Ignore damage',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'goblin-action-1',
						name: 'Sneak attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
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
					{
						id: 'troll-action-1',
						name: 'Slam',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'troll-action-2',
						name: 'Regeneration',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
				]
			}
		];
	};
}
