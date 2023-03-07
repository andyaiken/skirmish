import { ActionTargetType } from '../enums/action-target-type';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
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
						name: 'Resilient',
						prerequisites: [
							ActionPrerequisites.condition(TraitType.Any)
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.removeCondition(TraitType.Any)
						]
					},
					{
						id: 'human-action-2',
						name: 'Resourceful',
						prerequisites: [],
						parameters: [],
						effects: [
							// TODO: Draw action cards again
						]
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
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'construct-action-2',
						name: 'Repair (heal self damage)',
						prerequisites: [
							ActionPrerequisites.damage()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.healDamage(1)
						]
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
						name: 'Insight',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: See opponent stats
						]
					},
					{
						id: 'deva-action-2',
						name: 'Divine light',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.loseTurn()
								]
							})
						]
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
						prerequisites: [
							ActionPrerequisites.condition(TraitType.Endurance)
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.removeCondition(TraitType.Endurance)
						]
					},
					{
						id: 'dwarf-action-2',
						name: 'Remove resolve condition on self',
						prerequisites: [
							ActionPrerequisites.condition(TraitType.Resolve)
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.removeCondition(TraitType.Resolve)
						]
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
						name: 'Elfsight',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 10)
						],
						effects: [
							// TODO: Reveal hidden
						]
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
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.knockDown()
								]
							})
						]
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
						name: 'Gore',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 3)
								]
							})
						]
					},
					{
						id: 'minotaur-action-2',
						name: 'Bull rush',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Move up to selected target
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 2)
								]
							})
						]
					},
					{
						id: 'minotaur-action-3',
						name: 'Bellow',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
						],
						effects: [
							// TODO: Intimidate
						]
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
						name: 'Confusion',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Target makes attack
						]
					},
					{
						id: 'pixie-action-2',
						name: 'Teleport',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
						],
						effects: [
							// TODO: Move to selected square
						]
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
						name: 'Venomous Bite',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 1),
									ActionEffects.dealDamage(DamageType.Poison, 2)
								]
							})
						]
					},
					{
						id: 'reptilian-action-2',
						name: 'Snarl',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
						],
						effects: [
							// TODO: Intimidate
						]
					},
					{
						id: 'reptilian-action-3',
						name: 'Regeneration',
						prerequisites: [
							ActionPrerequisites.damage()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.healDamage(2)
						]
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
						prerequisites: [
							ActionPrerequisites.condition(TraitType.Any)
						],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							// TODO: Transfer a condition to the selected target
						]
					},
					{
						id: 'shadowborn-action-2',
						name: 'Induce fear',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
						],
						effects: [
							// TODO: Intimidate
						]
					},
					{
						id: 'shadowborn-action-3',
						name: 'Drain energy',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Resolve, 5)),
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 2, TraitType.All)),
									ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 2, SkillType.All))
								]
							})
						]
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
						prerequisites: [
							ActionPrerequisites.damage()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.healDamage(3)
						]
					},
					{
						id: 'werewolf-action-2',
						name: 'Bite',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 3)
								]
							})
						]
					},
					{
						id: 'werewolf-action-3',
						name: 'Rending Claws',
						prerequisites: [
							ActionPrerequisites.emptyHand()
						],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Edged, 3)
								]
							})
						]
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
						name: 'Bloodlust',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 5, SkillType.Brawl)),
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 5, SkillType.Weapon)),
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 5, DamageCategoryType.Physical))
						]
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
						prerequisites: [
							ActionPrerequisites.hidden()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 2,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							})
						]
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
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2),
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'troll-action-2',
						name: 'Regeneration',
						prerequisites: [
							ActionPrerequisites.wound()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.healWounds(1)
						]
					}
				]
			}
		];
	};
}