import { ActionTargetType } from '../enums/action-target-type';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { MovementType } from '../enums/movement-type';
import { QuirkType } from '../enums/quirk-type';
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
				description: 'Humans are resourceful and adaptable.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Endurance,
					TraitType.Resolve,
					TraitType.Speed
				],
				skills: [],
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
							ActionEffects.takeAnotherAction(true)
						]
					}
				]
			},
			{
				id: 'species-construct',
				name: 'Construct',
				description: 'A living automaton.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Endurance,
					TraitType.Resolve
				],
				skills: [],
				features: [
					FeatureLogic.createTraitFeature('construct-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createDamageResistFeature('construct-feature-2', DamageType.Poison, 2),
					FeatureLogic.createDamageResistFeature('construct-feature-3', DamageType.Psychic, 2)
				],
				actions: [
					{
						id: 'construct-action-1',
						name: 'Knockdown',
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
									ActionEffects.dealDamage(DamageType.Impact, 1),
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'construct-action-2',
						name: 'Repair',
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
				description: 'A humanoid with angelic ancestry.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Presence
				],
				features: [
					FeatureLogic.createSkillFeature('deva-feature-1', SkillType.Presence, 2),
					FeatureLogic.createDamageCategoryResistFeature('deva-feature-2', DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageFeature('deva-feature-3', ConditionType.AutoDamage, DamageType.Light, 1)
				],
				actions: [
					{
						id: 'deva-action-1',
						name: 'Divine Radiance',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Presence,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.stun()
								]
							})
						]
					},
					{
						id: 'deva-action-2',
						name: 'Divine Light',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Presence,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Light, 2)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-dwarf',
				name: 'Dwarf',
				description: 'A short, sturdy creature, fond of drink and industry.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Endurance,
					TraitType.Endurance
				],
				skills: [],
				features: [
					FeatureLogic.createTraitFeature('dwarf-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature('dwarf-feature-2', TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature('dwarf-feature-3', DamageType.Poison, 2),
					FeatureLogic.createDamageResistFeature('dwarf-feature-4', DamageType.Psychic, 2)
				],
				actions: [
					{
						id: 'dwarf-action-1',
						name: 'Constitution',
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
						name: 'Discipline',
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
				description: 'An elegant forest-dwelling creature.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Perception,
					SkillType.Reactions,
					SkillType.Stealth
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
							ActionEffects.reveal()
						]
					},
					{
						id: 'pixie-action-2',
						name: 'Seelie Step',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
						],
						effects: [
							ActionEffects.moveToTargetSquare()
						]
					}
				]
			},
			{
				id: 'species-gnome',
				name: 'Gnome',
				description: 'A short creature who often prefers to be unseen.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Reactions,
					SkillType.Stealth
				],
				features: [
					FeatureLogic.createTraitFeature('gnome-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('gnome-feature-2', SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature('gnome-feature-3', SkillType.Stealth, 2)
				],
				actions: [
					{
						id: 'gnome-action-1',
						name: 'Trip',
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
						id: 'gnome-action-2',
						name: 'Fade Away',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.hide(),
							ActionEffects.takeAnotherAction()
						]
					}
				]
			},
			{
				id: 'species-minotaur',
				name: 'Minotaur',
				description: 'A muscular humanoid with the head of a bull.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Brawl
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
						name: 'Bull Rush',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.forceMovement(MovementType.TowardsTarget, 2),
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
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Sonic, 1)
								]
							})
						]
					},
					{
						id: 'minotaur-action-4',
						name: 'Intimidate',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Presence,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.forceMovement(MovementType.Push, 1),
									ActionEffects.stun()
								]
							})
						]
					}
				]
			},
			{
				id: 'species-pixie',
				name: 'Pixie',
				description: 'A tiny fairy-like creature.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Stealth
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
							ActionEffects.commandAction()
						]
					},
					{
						id: 'pixie-action-2',
						name: 'Blink',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Squares, 1, 3)
						],
						effects: [
							ActionEffects.moveToTargetSquare(),
							ActionEffects.takeAnotherAction()
						]
					}
				]
			},
			{
				id: 'species-reptilian',
				name: 'Reptilian',
				description: 'A scaly humanoid with serpentine ancestry.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createTraitFeature('reptilian-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('reptilian-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryResistFeature('reptilian-feature-3', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageResistFeature('reptilian-feature-4', DamageType.Psychic, 2)
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
					},
					{
						id: 'reptilian-action-3',
						name: 'Intimidate',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Presence,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.forceMovement(MovementType.Push, 1),
									ActionEffects.stun()
								]
							})
						]
					}
				]
			},
			{
				id: 'species-shadowborn',
				name: 'Shadowborn',
				description: 'A humanoid with demonic heritage.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Brawl,
					SkillType.Stealth
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
						name: 'Transference',
						prerequisites: [
							ActionPrerequisites.condition(TraitType.Any)
						],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.transferCondition()
						]
					},
					{
						id: 'shadowborn-action-2',
						name: 'Drain Energy',
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
					},
					{
						id: 'shadowborn-action-3',
						name: 'Intimidate',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Presence,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.forceMovement(MovementType.Push, 1),
									ActionEffects.stun()
								]
							})
						]
					}
				]
			},
			{
				id: 'species-werewolf',
				name: 'Werewolf',
				description: 'A creature cursed with a wolf form.',
				type: CombatantType.Hero,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Brawl,
					SkillType.Perception,
					SkillType.Stealth
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
							ActionEffects.addCondition(ConditionLogic.createAutoHealCondition(TraitType.Endurance, 2))
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
				description: 'An evil creature bred for war.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Endurance,
					TraitType.Speed
				],
				skills: [
					SkillType.Brawl,
					SkillType.Weapon
				],
				features: [
					FeatureLogic.createDamageResistFeature('orc-feature-1', DamageType.All, 1),
					FeatureLogic.createSkillFeature('orc-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('orc-feature-3', SkillType.Weapon, 2)
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
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 2, SkillType.Brawl)),
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 2, SkillType.Weapon)),
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 2, DamageCategoryType.Physical))
						]
					},
					{
						id: 'orc-action-2',
						name: 'Bloodfury',
						prerequisites: [
							ActionPrerequisites.wound()
						],
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
									ActionEffects.dealDamage(DamageType.Impact, 3)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-goblin',
				name: 'Goblin',
				description: 'A fleet-footed creature, difficult to pin down.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Reactions,
					SkillType.Stealth
				],
				features: [
					FeatureLogic.createTraitFeature('goblin-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('goblin-feature-2', SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature('goblin-feature-3', SkillType.Stealth, 2)
				],
				actions: [
					{
						id: 'goblin-action-1',
						name: 'Sneak Attack',
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
					},
					{
						id: 'goblin-action-2',
						name: 'Skitter',
						prerequisites: [
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.forceMovement(MovementType.Random, 1),
							ActionEffects.takeAnotherAction()
						]
					}
				]
			},
			{
				id: 'species-troll',
				name: 'Troll',
				description: 'A huge brute of a humanoid.',
				type: CombatantType.Monster,
				size: 2,
				quirks: [
					QuirkType.Mindless
				],
				traits: [
					TraitType.Endurance
				],
				skills: [],
				features: [
					FeatureLogic.createTraitFeature('troll-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-2', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-3', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-4', DamageCategoryType.Corruption, 1)
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
			},
			{
				id: 'species-elemental-fire',
				name: 'Fire Elemental',
				description: 'Hot blooded and quick to anger, these humanoids are made of living fire.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('elemental-fire-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('elemental-fire-feature-2', DamageType.Fire, 1),
					FeatureLogic.createDamageResistFeature('elemental-fire-feature-3', DamageType.Fire, 5),
					FeatureLogic.createAuraDamageFeature('elemental-fire-feature-4', ConditionType.AutoDamage, DamageType.Fire, 1)
				],
				actions: [
					{
						id: 'elemental-fire-action-1',
						name: 'Volcanic Flare',
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
									ActionEffects.dealDamage(DamageType.Fire, 1),
									ActionEffects.dealDamage(DamageType.Light, 1)
								]
							})
						]
					},
					{
						id: 'elemental-fire-action-2',
						name: 'Hurl Fire',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 2,
								hit: [
									ActionEffects.dealDamage(DamageType.Fire, 2)
								]
							})
						]
					},
					{
						id: 'elemental-fire-action-3',
						name: 'Immolation',
						prerequisites: [
							ActionPrerequisites.wound()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 2)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Fire, 3)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-elemental-air',
				name: 'Air Elemental',
				description: 'Air elementals are as changeable as the weather, either calm or tempestuous.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('elemental-air-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('elemental-air-feature-2', DamageType.Cold, 1),
					FeatureLogic.createDamageResistFeature('elemental-air-feature-3', DamageType.Cold, 5),
					FeatureLogic.createAuraDamageFeature('elemental-air-feature-4', ConditionType.AutoDamage, DamageType.Cold, 1)
				],
				actions: [
					{
						id: 'elemental-air-action-1',
						name: 'Thunderclap',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Sonic, 1),
									ActionEffects.dealDamage(DamageType.Electricity, 1)
								]
							})
						]
					},
					{
						id: 'elemental-air-action-2',
						name: 'Step Of The Tempest',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.forceMovement(MovementType.BesideTarget, 0),
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Cold, 1),
									ActionEffects.forceMovement(MovementType.Push, 1)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-elemental-earth',
				name: 'Earth Elemental',
				description: 'Earth elementals are slow but unstoppable.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('elemental-earth-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('elemental-earth-feature-2', DamageType.Impact, 1),
					FeatureLogic.createDamageResistFeature('elemental-earth-feature-3', DamageType.Impact, 5),
					FeatureLogic.createAuraDamageFeature('elemental-earth-feature-4', ConditionType.AutoDamage, DamageType.Impact, 1)
				],
				actions: [
					{
						id: 'elemental-earth-action-1',
						name: 'Earthbind',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed)),
									ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 5))
								]
							})
						]
					},
					{
						id: 'elemental-earth-action-2',
						name: 'Rockblast',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 3)
								]
							})
						]
					},
					{
						id: 'elemental-earth-action-3',
						name: 'Earthquake',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Combatants, Number.MAX_VALUE)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 1),
									ActionEffects.forceMovement(MovementType.Push, 1),
									ActionEffects.knockDown()
								]
							})
						]
					}
				]
			},
			{
				id: 'species-scarab',
				name: 'Scarab',
				description: 'Insects with an acidic bite.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Beast
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('scarab-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('scarab-feature-2', DamageType.Acid, 1)
				],
				actions: [
					{
						id: 'scarab-action-1',
						name: 'Mandible',
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
									ActionEffects.dealDamage(DamageType.Edged, 2),
									ActionEffects.dealDamage(DamageType.Acid, 2)
								]
							})
						]
					},
					{
						id: 'scarab-action-2',
						name: 'Stinger',
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
									ActionEffects.dealDamage(DamageType.Piercing, 2),
									ActionEffects.dealDamage(DamageType.Acid, 2)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-giant-spider',
				name: 'Giant Spider',
				description: 'Venomous insects with eight legs.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Beast
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('giant-spider-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('giant-spider-feature-2', DamageType.Poison, 1)
				],
				actions: [
					{
						id: 'giant-spider-action-1',
						name: 'Bite',
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
									ActionEffects.dealDamage(DamageType.Edged, 2),
									ActionEffects.dealDamage(DamageType.Poison, 2)
								]
							})
						]
					},
					{
						id: 'giant-spider-action-2',
						name: 'Web',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 2, TraitType.Speed)),
									ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 5))
								]
							})
						]
					}
				]
			},
			{
				id: 'species-zombie',
				name: 'Zombie',
				description: 'A re-animated corpse.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Mindless,
					QuirkType.Undead
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('zombie-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryResistFeature('zombie-feature-2', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'zombie-action-1',
						name: 'Rend',
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
									ActionEffects.dealDamage(DamageType.Piercing, 1),
									ActionEffects.dealDamage(DamageType.Decay, 1),
									ActionEffects.healDamageSelf(1)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-skeleton',
				name: 'Skeleton',
				description: 'Re-animated bones.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Undead
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('skeleton-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageResistFeature('skeleton-feature-2', DamageType.Piercing, 1),
					FeatureLogic.createDamageCategoryResistFeature('skeleton-feature-3', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'skeleton-action-1',
						name: 'Bash',
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
									ActionEffects.dealDamage(DamageType.Impact, 1)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-vampire',
				name: 'Vampire',
				description: 'The blood is the life.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Undead
				],
				traits: [],
				skills: [
					SkillType.Brawl,
					SkillType.Presence
				],
				features: [
					FeatureLogic.createSkillFeature('vampire-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('vampire-feature-2', SkillType.Presence, 2),
					FeatureLogic.createDamageCategoryResistFeature('vampire-feature-3', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'vampire-action-1',
						name: 'Speed Of The Grave',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.forceMovement(MovementType.BesideTarget, 0),
							ActionEffects.takeAnotherAction()
						]
					},
					{
						id: 'vampire-action-2',
						name: 'Vampiric Bite',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 1),
									ActionEffects.dealDamage(DamageType.Decay, 1),
									ActionEffects.healDamageSelf(1),
									ActionEffects.healWoundsSelf(1)
								]
							})
						]
					},
					{
						id: 'vampire-action-3',
						name: 'Mesmerize',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Presence,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.stun()
								]
							})
						]
					}
				]
			}
		];
	};
}
