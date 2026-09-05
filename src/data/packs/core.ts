import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemLocationType } from '../../enums/item-location-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';

export const core = (): PackModel => ({
	id: 'core',
	name: 'Skirmish',
	description: 'The core cards for the game, available to all.',
	species: [
		{
			id: 'species-human',
			name: 'Human',
			description: 'Whatever the work is, somebody here has already learned it.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('human-start-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('human-start-2', TraitType.Resolve, 1),
				FeatureLogic.createTraitFeature('human-start-3', TraitType.Speed, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('human-feature-1', TraitType.Any, 1),
				FeatureLogic.createSkillFeature('human-feature-2', SkillType.Any, 2)
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
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.takeAnotherAction(true)
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-dwarf',
			name: 'Dwarf',
			description: 'A short, sturdy creature, fond of drink and industry.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('dwarf-start-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('dwarf-start-2', TraitType.Resolve, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('dwarf-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('dwarf-feature-2', TraitType.Resolve, 1),
				FeatureLogic.createDamageResistFeature('dwarf-feature-3', DamageType.Poison, 2),
				FeatureLogic.createDamageResistFeature('dwarf-feature-4', DamageType.Psychic, 2)
			],
			actions: [
				{
					id: 'dwarf-action-1',
					name: 'Dwarven Constitution',
					prerequisites: [
						ActionPrerequisites.condition(TraitType.Endurance)
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Endurance),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'dwarf-action-2',
					name: 'Dwarven Discipline',
					prerequisites: [
						ActionPrerequisites.condition(TraitType.Resolve)
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Resolve),
						ActionEffects.takeAnotherAction()
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-elf',
			name: 'Elf',
			description: 'Grew up under trees old enough to have names.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('elf-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('elf-start-2', SkillType.Perception, 2),
				FeatureLogic.createSkillFeature('elf-start-3', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('elf-start-4', SkillType.Stealth, 2)
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
					name: 'Seelie Step',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.moveToTargetSquare()
					]
				},
				{
					id: 'elf-action-2',
					name: 'Elven Senses',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.scan(),
						ActionEffects.takeAnotherAction()
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-gnome',
			name: 'Gnome',
			description: 'Waist-high, quiet enough to be somewhere else already.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('gnome-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('gnome-start-2', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('gnome-start-3', SkillType.Stealth, 2)
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
				},
				{
					id: 'gnome-action-3',
					name: 'Disarm Trap',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Traps, 1)
					],
					effects: [
						ActionEffects.disarmTrap()
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-colossus',
			name: 'Colossus',
			description: 'It has to duck to come through the gate.',
			type: CombatantType.Monster,
			size: 3,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('colossus-start-1', TraitType.Endurance, 2),
				FeatureLogic.createSkillFeature('colossus-start-2', SkillType.Brawl, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('colossus-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('colossus-feature-2', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('colossus-feature-3', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('colossus-feature-4', DamageType.All, 1)
			],
			actions: [
				{
					id: 'colossus-action-1',
					name: 'Hurl Object',
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
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'colossus-action-2',
					name: 'Sweep',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'colossus-action-3',
					name: 'Thwack',
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
								ActionEffects.dealDamage(DamageType.Impact, 4),
								ActionEffects.forceMovement(MovementType.Push, 2),
								ActionEffects.knockDown()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-gnoll',
			name: 'Gnoll',
			description: 'You hear the hyena laugh well before you see the shoulders it sits on.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('gnoll-start-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('gnoll-start-2', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('gnoll-start-3', SkillType.Brawl, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('gnoll-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('gnoll-feature-2', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('gnoll-feature-3', SkillType.Brawl, 2)
			],
			actions: [
				{
					id: 'gnoll-action-1',
					name: 'Frenzied Bite',
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
					id: 'gnoll-action-2',
					name: 'Raking Claws',
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
								ActionEffects.dealDamage(DamageType.Edged, 3)
							]
						}),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'gnoll-action-3',
					name: 'Rending Claws',
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
								ActionEffects.dealDamage(DamageType.Edged, 3)
							]
						})
					]
				},
				{
					id: 'gnoll-action-4',
					name: 'Maniacal Cackle',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 3, SkillCategoryType.Mental))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-goblin',
			name: 'Goblin',
			description: 'Never stands still long enough to be worth aiming at.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('goblin-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('goblin-start-2', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('goblin-start-3', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('goblin-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('goblin-feature-2', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('goblin-feature-3', SkillType.Stealth, 2)
			],
			actions: [
				{
					id: 'goblin-action-1',
					name: 'Backstab',
					prerequisites: [
						ActionPrerequisites.meleeWeapon(),
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
			],
			deathActions: []
		},
		{
			id: 'species-medusa',
			name: 'Medusa',
			description: 'Snake-haired; nobody in the room looks directly at it.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createSkillFeature('medusa-start-1', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('medusa-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('medusa-start-3', DamageType.Poison, 2),
				FeatureLogic.createDamageResistFeature('medusa-start-4', DamageType.Poison, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('medusa-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('medusa-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('medusa-feature-3', DamageType.Poison, 2),
				FeatureLogic.createDamageResistFeature('medusa-feature-4', DamageType.Poison, 2)
			],
			actions: [
				{
					id: 'medusa-action-1',
					name: 'Spit Venom',
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
								ActionEffects.dealDamage(DamageType.Poison, 3)
							]
						})
					]
				},
				{
					id: 'medusa-action-2',
					name: 'Petrifying Gaze',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 6)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 5, TraitType.All)),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Resolve, 3))
							]
						})
					]
				},
				{
					id: 'medusa-action-3',
					name: 'Weakening Gaze',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 6)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryPenaltyCondition(TraitType.Resolve, 4, DamageCategoryType.Physical)),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryPenaltyCondition(TraitType.Resolve, 4, DamageCategoryType.Energy)),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryPenaltyCondition(TraitType.Resolve, 4, DamageCategoryType.Corruption))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-orc',
			name: 'Orc',
			description: 'Bred for war by someone who has since lost control of them.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('orc-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('orc-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('orc-start-3', SkillType.Weapon, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('orc-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('orc-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('orc-feature-3', SkillType.Weapon, 2),
				FeatureLogic.createDamageResistFeature('orc-feature-4', DamageType.All, 1)
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
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 3, SkillType.Brawl)),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 3, SkillType.Weapon)),
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
						}),
						ActionEffects.takeAnotherAction()
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-ratfolk',
			name: 'Ratfolk',
			description: 'Rat-faced and quick, coming up through the drains in numbers.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('ratfolk-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('ratfolk-start-2', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('ratfolk-start-3', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('ratfolk-start-4', DamageType.Decay, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('ratfolk-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('ratfolk-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('ratfolk-feature-3', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('ratfolk-feature-4', DamageType.Decay, 2)
			],
			actions: [
				{
					id: 'ratfolk-action-1',
					name: 'Bite',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 3),
								ActionEffects.dealDamage(DamageType.Decay, 1)
							]
						})
					]
				},
				{
					id: 'ratfolk-action-2',
					name: 'Scurry',
					prerequisites: [
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addMovement(),
						ActionEffects.takeAnotherAction()
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-scarab',
			name: 'Scarab',
			description: 'A beetle the size of a dog, whose bite leaves a hole in whatever it closes on.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Beast
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('scarab-start-1', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('scarab-start-2', DamageType.Acid, 2),
				FeatureLogic.createTraitFeature('scarab-start-3', TraitType.Endurance, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('scarab-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('scarab-feature-2', DamageType.Acid, 2),
				FeatureLogic.createTraitFeature('scarab-feature-3', TraitType.Endurance, 1)
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
					name: 'Tail Lash',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 2)
							]
						})
					]
				},
				{
					id: 'scarab-action-3',
					name: 'Tail Stinger',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 2),
								ActionEffects.dealDamage(DamageType.Acid, 2)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-shadowborn',
			name: 'Shadowborn',
			description: 'Demon blood a long way back, still showing in the horns and the eyes.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('shadowborn-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('shadowborn-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('shadowborn-start-3', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('shadowborn-start-4', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('shadowborn-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('shadowborn-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('shadowborn-feature-3', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('shadowborn-feature-4', SkillType.Stealth, 2),
				FeatureLogic.createDamageCategoryResistFeature('shadowborn-feature-5', DamageCategoryType.Corruption, 1),
				FeatureLogic.createAuraDamageFeature('shadowborn-feature-6', ConditionType.AutoDamage, DamageType.Decay, 1)
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
							skill: SkillType.Presence,
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
			],
			deathActions: []
		},
		{
			id: 'species-troll',
			name: 'Troll',
			description: 'Whatever you cut off the great grey brute is back by morning.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [
				QuirkType.Mindless
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('troll-start-1', TraitType.Endurance, 2),
				FeatureLogic.createProficiencyFeature('troll-start-2', ItemProficiencyType.LargeWeapons),
				FeatureLogic.createSkillFeature('troll-start-3', SkillType.Brawl, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('troll-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('troll-feature-2', SkillType.Brawl, 2),
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
			],
			deathActions: []
		}
	],
	roles: [
		{
			id: 'role-arcanist',
			name: 'Arcanist',
			description: 'Knows a little of every school, specialising in none.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('arcanist-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('arcanist-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('arcanist-start-3', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('arcanist-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('arcanist-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageCategoryBonusFeature('arcanist-feature-3', DamageCategoryType.Energy, 1)
			],
			actions: [
				{
					id: 'arcanist-action-1',
					name: 'Arcane Shield',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 5, DamageType.All))
					]
				},
				{
					id: 'arcanist-action-2',
					name: 'Arcane Armor',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 10)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 5, DamageType.All))
					]
				},
				{
					id: 'arcanist-action-3',
					name: 'Arcane Force',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.forceMovement(MovementType.Push, 3)
							]
						})
					]
				},
				{
					id: 'arcanist-action-4',
					name: 'Arcane Arrow',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Electricity, 2),
								ActionEffects.dealDamage(DamageType.Piercing, 2)
							]
						})
					]
				},
				{
					id: 'arcanist-action-5',
					name: 'Arcane Displacement',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Combatants, 1, 10)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.Swap, 0),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'arcanist-action-6',
					name: 'Arcane Escape',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.forceMovement(MovementType.Random, 10),
						ActionEffects.takeAnotherAction()
					]
				}
			]
		},
		{
			id: 'role-barbarian',
			name: 'Barbarian',
			description: 'Fights as though the return blow were somebody else\'s problem.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('barbarian-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('barbarian-start-2', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('barbarian-start-3', ItemProficiencyType.LargeWeapons),
				FeatureLogic.createProficiencyFeature('barbarian-start-4', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('barbarian-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('barbarian-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageCategoryBonusFeature('barbarian-feature-3', DamageCategoryType.Physical, 1),
				FeatureLogic.createDamageCategoryResistFeature('barbarian-feature-4', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'barbarian-action-1',
					name: 'Overhead Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'barbarian-action-2',
					name: 'Knockdown Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'barbarian-action-3',
					name: 'Stunning Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'barbarian-action-4',
					name: 'Haymaker',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, Number.MAX_VALUE, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'barbarian-action-5',
					name: 'Burst Through',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Walls, Number.MAX_VALUE, 0)
					],
					effects: [
						ActionEffects.destroyWalls()
					]
				},
				{
					id: 'barbarian-action-6',
					name: 'Fury',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 6, DamageCategoryType.Physical)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 6, DamageCategoryType.Physical))
					]
				}
			]
		},
		{
			id: 'role-centurion',
			name: 'Centurion',
			description: 'Holds the line by standing in it.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('centurion-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('centurion-start-2', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('centurion-start-3', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('centurion-start-4', ItemProficiencyType.HeavyArmor),
				FeatureLogic.createProficiencyFeature('centurion-start-5', ItemProficiencyType.Shields)
			],
			features: [
				FeatureLogic.createTraitFeature('centurion-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('centurion-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageCategoryBonusFeature('centurion-feature-3', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'centurion-action-1',
					name: 'Charge',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.TowardsTarget, 2),
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'centurion-action-2',
					name: 'Precise Attack',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
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
					id: 'centurion-action-3',
					name: 'Disarm',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.disarm()
							]
						})
					]
				},
				{
					id: 'centurion-action-4',
					name: 'Parrying Stance',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 5, DamageCategoryType.Physical))
					]
				},
				{
					id: 'centurion-action-5',
					name: 'Shield Bash',
					prerequisites: [
						ActionPrerequisites.shield()
					],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.forceMovement(MovementType.Push, 1)
							]
						})
					]
				},
				{
					id: 'centurion-action-6',
					name: 'Sweeping Attack',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, Number.MAX_VALUE, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				}
			]
		},
		{
			id: 'role-dervish',
			name: 'Dervish',
			description: 'Never in the same square for two blows running.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('dervish-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('dervish-start-2', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('dervish-start-3', ItemProficiencyType.PairedWeapons),
				FeatureLogic.createProficiencyFeature('dervish-start-4', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('dervish-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('dervish-feature-2', SkillType.Weapon, 2)
			],
			actions: [
				{
					id: 'dervish-action-1',
					name: 'Dual Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'dervish-action-2',
					name: 'Twin Attack',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 2, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'dervish-action-3',
					name: 'Whirlwind Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, Number.MAX_VALUE, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'dervish-action-4',
					name: 'Leaping Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 2)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.TowardsTarget, 1),
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'dervish-action-5',
					name: 'Dodging Stance',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 5, TraitType.Speed)),
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Endurance, 5, DamageType.All))
					]
				},
				{
					id: 'dervish-action-6',
					name: 'Off-Hand Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -2,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.takeAnotherAction()
					]
				}
			]
		},
		{
			id: 'role-gladiator',
			name: 'Gladiator',
			description: 'Fought for a crowd long enough to know what one wants to see.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('gladiator-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('gladiator-start-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('gladiator-start-3', SkillType.Presence, 2),
				FeatureLogic.createProficiencyFeature('gladiator-start-4', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('gladiator-start-5', ItemProficiencyType.Shields)
			],
			features: [
				FeatureLogic.createTraitFeature('gladiator-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('gladiator-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('gladiator-feature-3', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('gladiator-feature-4', DamageType.Edged, 1)
			],
			actions: [
				{
					// Stun has two dozen uses across the game and nothing has ever read one back;
					// this sets the opening that Killing Blow takes
					id: 'gladiator-action-1',
					name: 'Play to the Gallery',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 4)
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
				},
				{
					id: 'gladiator-action-2',
					name: 'Killing Blow',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.ifTarget(TargetStateType.Stunned, [
									ActionEffects.dealWeaponDamage(3)
								])
							]
						})
					]
				},
				{
					// Only the Centurion's Shield Bash has ever cared whether you took the shield
					id: 'gladiator-action-3',
					name: 'Shield Rush',
					prerequisites: [
						ActionPrerequisites.shield()
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
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.forceMovement(MovementType.Push, 2),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'gladiator-action-4',
					name: 'Crowd-Pleaser',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.toSelf([
									ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 3, DamageCategoryType.Physical))
								])
							]
						})
					]
				},
				{
					id: 'gladiator-action-5',
					name: 'Second Wind',
					prerequisites: [
						ActionPrerequisites.damage()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healDamage(4),
						ActionEffects.stand()
					]
				}
			]
		},
		{
			id: 'role-ranger',
			name: 'Ranger',
			description: 'Prefers to settle matters at a hundred paces.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('ranger-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('ranger-start-2', SkillType.Perception, 2),
				FeatureLogic.createSkillFeature('ranger-start-3', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('ranger-start-4', ItemProficiencyType.RangedWeapons),
				FeatureLogic.createProficiencyFeature('ranger-start-5', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('ranger-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('ranger-feature-2', SkillType.Perception, 2),
				FeatureLogic.createSkillFeature('ranger-feature-3', SkillType.Weapon, 2)
			],
			actions: [
				{
					id: 'ranger-action-1',
					name: 'Deadeye',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 5, SkillType.Weapon))
					]
				},
				{
					id: 'ranger-action-2',
					name: 'Sure Shot',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
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
					id: 'ranger-action-3',
					name: 'Pinning Shot',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
							]
						})
					]
				},
				{
					id: 'ranger-action-4',
					name: 'Barrage',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionOriginParameters.weapon(),
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -1,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'ranger-action-5',
					name: 'Quick Shot',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -1,
							hit: [
								ActionEffects.dealWeaponDamage(-1)
							]
						}),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'ranger-action-7',
					name: 'Disarm Trap',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Traps, 1)
					],
					effects: [
						ActionEffects.disarmTrap()
					]
				},
				{
					id: 'ranger-action-6',
					name: 'Called Shot',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -2,
							hit: [
								ActionEffects.dealWeaponDamage(2)
							]
						})
					]
				}
			]
		},
		{
			id: 'role-sensei',
			name: 'Sensei',
			description: 'Fights bare-handed, with forms drilled so long they stopped being practice.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('sensei-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('sensei-start-2', SkillType.Brawl, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('sensei-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('sensei-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryBonusFeature('sensei-feature-4', DamageCategoryType.Energy, 1)
			],
			actions: [
				{
					id: 'sensei-action-1',
					name: 'Typhoon Step',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Endurance,
							skillBonus: 2,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 1),
								ActionEffects.forceMovement(MovementType.Push, 1),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'sensei-action-2',
					name: 'Dragon Palm Technique',
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
								ActionEffects.dealDamage(DamageType.Fire, 3)
							]
						})
					]
				},
				{
					id: 'sensei-action-3',
					name: 'Kinetic Flow',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.forceMovement(MovementType.Swap, 0)
							]
						})
					]
				},
				{
					id: 'sensei-action-4',
					name: 'Lightning Speed',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addMovement()
					]
				},
				{
					id: 'sensei-action-5',
					name: 'Focus Chi',
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
					id: 'sensei-action-6',
					name: 'Chi Punch',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 2,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 3)
							]
						})
					]
				}
			]
		},
		{
			id: 'role-skirmisher',
			name: 'Skirmisher',
			description: 'The reply always lands where the skirmisher was standing.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('skirmisher-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('skirmisher-start-2', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('skirmisher-start-3', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('skirmisher-start-4', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('skirmisher-start-5', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('skirmisher-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('skirmisher-feature-2', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('skirmisher-feature-3', SkillType.Weapon, 2),
				FeatureLogic.createDamageBonusFeature('skirmisher-feature-4', DamageType.Piercing, 1)
			],
			actions: [
				{
					id: 'skirmisher-action-1',
					name: 'Opening Move',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.addMovement()
					]
				},
				{
					id: 'skirmisher-action-2',
					name: 'Harrying Strike',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.forceMovement(MovementType.Push, 2),
								// What harrying is actually for
								ActionEffects.delay(3)
							]
						})
					]
				},
				{
					id: 'skirmisher-action-3',
					name: 'Reflexive Cut',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Reactions,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(1)
							]
						})
					]
				},
				{
					id: 'skirmisher-action-4',
					name: 'Fall Back',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addMovement(),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Speed, 4, TraitType.Speed))
					]
				},
				{
					id: 'skirmisher-action-5',
					name: 'Seize the Initiative',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Speed, 5, SkillType.Reactions)),
						ActionEffects.takeAnotherAction(true)
					]
				},
				{
					id: 'skirmisher-action-6',
					name: 'Running Skirmish',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 2, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -2,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.addMovement()
					]
				}
			]
		},
		{
			id: 'role-valkyrie',
			name: 'Valkyrie',
			description: 'Comes down the line in full plate, choosing who is worth carrying off the field.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('valkyrie-start-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('valkyrie-start-2', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('valkyrie-start-3', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('valkyrie-start-4', ItemProficiencyType.LargeWeapons),
				FeatureLogic.createProficiencyFeature('valkyrie-start-5', ItemProficiencyType.HeavyArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('valkyrie-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('valkyrie-feature-2', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('valkyrie-feature-3', SkillType.Weapon, 2)
			],
			actions: [
				{
					id: 'valkyrie-action-1',
					name: 'Valhalla Charge',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.BesideTarget, 1),
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(2)
							]
						})
					]
				},
				{
					id: 'valkyrie-action-2',
					name: 'Onslaught',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'valkyrie-action-3',
					name: 'Weakening Thrust',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(-1),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryPenaltyCondition(TraitType.Endurance, 3, DamageCategoryType.Physical)),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryPenaltyCondition(TraitType.Endurance, 3, DamageCategoryType.Energy)),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryPenaltyCondition(TraitType.Endurance, 3, DamageCategoryType.Corruption))
							]
						})
					]
				},
				{
					id: 'valkyrie-action-4',
					name: 'Swirling Storm',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, Number.MAX_VALUE, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.dealDamage(DamageType.Electricity, 1)
							]
						})
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-acrobat',
			name: 'Acrobat',
			description: 'Spent years learning how to fall properly.',
			startingFeatures: [],
			features: [
				FeatureLogic.createTraitFeature('acrobat-feature-2', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('acrobat-feature-3', SkillType.Reactions, 2)
			],
			actions: [
				{
					id: 'acrobat-action-1',
					name: 'Jump Up',
					prerequisites: [
						ActionPrerequisites.prone()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.stand(),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'acrobat-action-2',
					name: 'Burst of Speed',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addMovement(),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'acrobat-action-3',
					name: 'Quickness',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 3)),
						ActionEffects.takeAnotherAction()
					]
				}
			]
		},
		{
			id: 'background-commander',
			name: 'Commander',
			description: 'Sees the shape of the field a round before anyone else.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillFeature('commander-feature-1', SkillType.Presence, 2),
				FeatureLogic.createAuraDamageCategoryFeature('commander-feature-2', ConditionType.DamageCategoryBonus, DamageCategoryType.Corruption, 1),
				FeatureLogic.createAuraDamageCategoryFeature('commander-feature-3', ConditionType.DamageCategoryBonus, DamageCategoryType.Energy, 1),
				FeatureLogic.createAuraDamageCategoryFeature('commander-feature-4', ConditionType.DamageCategoryBonus, DamageCategoryType.Physical, 1),
				FeatureLogic.createAuraSkillCategoryFeature('commander-feature-5', ConditionType.SkillCategoryBonus, SkillCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'commander-action-1',
					name: 'Direct the Attack',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 10)
					],
					effects: [
						ActionEffects.commandAction()
					]
				},
				{
					id: 'commander-action-2',
					name: 'Tactical Positioning',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
					],
					effects: [
						ActionEffects.commandMove()
					]
				},
				{
					id: 'commander-action-3',
					name: 'Rally',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
					],
					effects: [
						ActionEffects.healDamage(3),
						ActionEffects.stand()
					]
				},
				{
					id: 'commander-action-4',
					name: 'Battlefield Sense',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 10)
					],
					effects: [
						ActionEffects.toSelf([
							ActionEffects.scan()
						]),
						ActionEffects.reveal(),
						ActionEffects.takeAnotherAction()
					]
				}
			]
		},
		{
			id: 'background-noble',
			name: 'Noble',
			description: 'Has never had to raise their voice to be obeyed.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillFeature('noble-feature-1', SkillType.Presence, 2),
				FeatureLogic.createAuraFeature('noble-feature-2', ConditionType.MovementBonus, 1),
				FeatureLogic.createAuraTraitFeature('noble-feature-3', ConditionType.TraitBonus, TraitType.Endurance, 1),
				FeatureLogic.createAuraTraitFeature('noble-feature-4', ConditionType.TraitBonus, TraitType.Resolve, 1),
				FeatureLogic.createAuraTraitFeature('noble-feature-5', ConditionType.TraitBonus, TraitType.Speed, 1)
			],
			actions: [
				{
					id: 'noble-action-1',
					name: 'Boost Morale',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 3, SkillType.All))
					]
				},
				{
					id: 'noble-action-2',
					name: 'Dishearten',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 3, SkillType.All))
					]
				},
				{
					id: 'noble-action-3',
					name: 'Taunt',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
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
		},
		{
			id: 'background-outrider',
			name: 'Outrider',
			description: 'Rides ahead, finds the ground, and comes back for the rest of you.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('outrider-start-1', SkillType.Perception, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('outrider-feature-1', SkillType.Perception, 2),
				FeatureLogic.createTraitFeature('outrider-feature-2', TraitType.Speed, 1)
			],
			actions: [
				{
					// One ally, not a burst: Rallying Cry is a multi-target hasten and sits on the
					// per-action ceiling with nothing left
					id: 'outrider-action-1',
					name: 'Set the Pace',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Speed, 4)),
						ActionEffects.hasten(3)
					]
				},
				{
					id: 'outrider-action-2',
					name: 'Break Trail',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.addMovement()
					]
				},
				{
					id: 'outrider-action-3',
					name: 'Ride Ahead',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Speed, 4, SkillType.Perception)),
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Speed, 4))
					]
				}
			]
		},
		{
			id: 'background-reaver',
			name: 'Reaver',
			description: 'Came for the sack, not the siege.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillFeature('reaver-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('reaver-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageCategoryResistFeature('reaver-feature-3', DamageCategoryType.Any, 1),
				FeatureLogic.createDamageCategoryBonusFeature('reaver-feature-4', DamageCategoryType.Physical, 1),
				FeatureLogic.createAuraDamageFeature('reaver-feature-5', ConditionType.AutoDamage, DamageType.Edged, 1),
				FeatureLogic.createAuraDamageFeature('reaver-feature-6', ConditionType.AutoDamage, DamageType.Impact, 1),
				FeatureLogic.createAuraDamageFeature('reaver-feature-7', ConditionType.AutoDamage, DamageType.Piercing, 1)
			],
			actions: [
				{
					id: 'reaver-action-1',
					name: 'Frenzy',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Physical))
					]
				},
				{
					id: 'reaver-action-2',
					name: 'Adrenaline',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 5)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Speed))
					]
				},
				{
					id: 'reaver-action-3',
					name: 'Fortitude',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Endurance)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Resolve))
					]
				}
			]
		},
		{
			id: 'background-sentinel',
			name: 'Sentinel',
			description: 'Nothing gets past a sentinel unless they allow it.',
			startingFeatures: [],
			features: [
				FeatureLogic.createTraitFeature('sentinel-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createTraitFeature('sentinel-feature-2', TraitType.Resolve, 1),
				FeatureLogic.createDamageResistFeature('sentinel-feature-3', DamageType.All, 1),
				FeatureLogic.createAuraFeature('sentinel-feature-4', ConditionType.MovementPenalty, 1),
				FeatureLogic.createAuraDamageCategoryFeature('sentinel-feature-5', ConditionType.DamageCategoryResistance, DamageCategoryType.Physical, 3),
				FeatureLogic.createAuraDamageCategoryFeature('sentinel-feature-6', ConditionType.DamageCategoryResistance, DamageCategoryType.Energy, 3),
				FeatureLogic.createAuraDamageCategoryFeature('sentinel-feature-7', ConditionType.DamageCategoryResistance, DamageCategoryType.Corruption, 3)
			],
			actions: [
				{
					id: 'sentinel-action-1',
					name: 'Mark Enemy',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 4)),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'sentinel-action-2',
					name: 'Unyielding Stance',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Endurance)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Resolve))
					]
				},
				{
					id: 'sentinel-action-3',
					name: 'Keep Close',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.Pull, 3)
					]
				}
			]
		}
	],
	items: [
		{
			id: 'item-sword',
			name: 'Sword',
			description: 'Three feet long and sharp on both sides.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-katana',
			name: 'Katana',
			description: 'An elegant single-edged blade with a slight curve.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-scimitar',
			name: 'Scimitar',
			description: 'The curve does the work on the draw.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-handaxe',
			name: 'Handaxe',
			description: 'A chopping blade at the end of a wooden haft.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-khopesh',
			name: 'Khopesh',
			description: 'The hook at the tip is for dragging a shield aside.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-mace',
			name: 'Mace',
			description: 'A weighted head on a short shaft, for going through armour.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-flail',
			name: 'Flail',
			description: 'A length of metal chain at the end of a wooden haft.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 4
					}
				],
				range: 1,
				unreliable: 1
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-spear',
			name: 'Spear',
			description: 'A long haft, topped with a sharp metal point.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 2
					}
				],
				range: 2,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-mattock',
			name: 'Mattock',
			description: 'Half pick, half hammer, sized for one hand.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-rapier',
			name: 'Rapier',
			description: 'A sword with a thin, pointed blade.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.MilitaryWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 3
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-greatsword',
			name: 'Greatsword',
			description: 'Four feet of blade that needs both hands on the grip.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 5
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-battleaxe',
			name: 'Battleaxe',
			description: 'Head-heavy, slow to bring round, final when it arrives.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 5
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-glaive',
			name: 'Glaive',
			description: 'A sword blade mounted at the end of a long haft.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 4
					}
				],
				range: 2,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-warhammer',
			name: 'Warhammer',
			description: 'Blunt on one face, spiked on the other.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 5
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-quarterstaff',
			name: 'Quarterstaff',
			description: 'A sturdy wooden stick, as tall as a person.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 5
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-pike',
			name: 'Pike',
			description: 'A spear point mounted at the end of a long haft.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 4
					}
				],
				range: 2,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-halberd',
			name: 'Halberd',
			description: 'An axe blade mounted at the end of a long haft.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 4
					}
				],
				range: 2,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-trident',
			name: 'Trident',
			description: 'Three barbed prongs, spaced to catch a blade between them.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LargeWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 5
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-dagger',
			name: 'Daggers',
			description: 'Short blades that go wherever a hand goes.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PairedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 2
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-sai',
			name: 'Sais',
			description: 'Pointed daggers with sharp side-prongs.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PairedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 2
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-tonfas',
			name: 'Tonfas',
			description: 'Wooden batons with a perpendicular handle.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PairedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 2
					}
				],
				range: 1,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-hook-swords',
			name: 'Hook Swords',
			description: 'Curved blades with a crook at the tip, for catching what comes.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PairedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 2
					}
				],
				range: 2,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-katars',
			name: 'Katars',
			description: 'Short blades that punch straight out from a crossbar grip.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PairedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 3
					}
				],
				range: 1,
				unreliable: 1
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-nunchaku',
			name: 'Nunchaku',
			description: 'Two hardwood batons joined by a short chain.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PairedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 3
					}
				],
				range: 1,
				unreliable: 1
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-longbow',
			name: 'Longbow',
			description: 'Taller than the archer, drawn to the ear.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.RangedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 3
					}
				],
				range: 15,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-crossbow',
			name: 'Crossbow',
			description: 'Slow to wind; it does not care how strong you are.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.RangedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 4
					}
				],
				range: 20,
				unreliable: 1
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-catapult',
			name: 'Catapult',
			description: 'A frame, a cord, and a basket of river rock.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.RangedWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 3
					}
				],
				range: 10,
				unreliable: 1
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-sling',
			name: 'Sling',
			description: 'A leather cradle on two cords, and a pouch of river stones.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.RangedWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Impact,
						rank: 2
					}
				],
				range: 10,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-hand-crossbow',
			name: 'Hand Crossbow',
			description: 'Small enough to keep up a sleeve until the moment it is levelled.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.RangedWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 3
					}
				],
				range: 8,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-chakram',
			name: 'Chakram',
			description: 'A flat steel ring, sharpened along its outer edge.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.RangedWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Edged,
						rank: 2
					}
				],
				range: 5,
				unreliable: 0
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-orb',
			name: 'Orb',
			description: 'Glass, cold, heavier than it looks.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Implements,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-wand',
			name: 'Wand',
			description: 'A finger of black wood, worn pale at one end.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Implements,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-tome',
			name: 'Tome',
			description: 'A spellbook too heavy to hold open one-handed for long.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Implements,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-amulet',
			name: 'Amulet',
			description: 'A worked disc on a cord, warm against the breastbone.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Implements,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-staff',
			name: 'Staff',
			description: 'Shoulder-height, with the grain worn smooth where the hand goes.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Implements,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-leather-armor',
			name: 'Leather Armor',
			description: 'Boiled hide, moulded to the chest while it was still soft.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LightArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('leatherarmour-1', DamageCategoryType.Physical, 1)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-hide-armor',
			name: 'Hide Armor',
			description: 'Cut from something large, with the hair left on.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LightArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('hidearmour-1', DamageCategoryType.Physical, 2),
					FeatureLogic.createSkillCategoryFeature('hidearmour-2', SkillCategoryType.Physical, -1)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-brigandine-armor',
			name: 'Brigandine Armor',
			description: 'Small plates riveted between two layers of canvas.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LightArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('brigandinearmour-1', DamageCategoryType.Physical, 3),
					FeatureLogic.createSkillCategoryFeature('brigandinearmour-2', SkillCategoryType.Physical, -1),
					FeatureLogic.createTraitFeature('brigandinearmour-3', TraitType.Speed, -1)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-breastplate',
			name: 'Breastplate',
			description: 'One shaped piece front and back, buckled at the sides.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LightArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('brigandinearmour-1', DamageCategoryType.Physical, 3),
					FeatureLogic.createSkillCategoryFeature('brigandinearmour-2', SkillCategoryType.Physical, -2)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-chain-armor',
			name: 'Chain Armor',
			description: 'Thousands of riveted rings, hanging from the shoulders.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.HeavyArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('chainarmour-1', DamageCategoryType.Physical, 4),
					FeatureLogic.createSkillCategoryFeature('chainarmour-2', SkillCategoryType.Physical, -2),
					FeatureLogic.createTraitFeature('chainarmour-3', TraitType.Speed, -1)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-plate-armor',
			name: 'Plate Armor',
			description: 'Jointed steel, fitted to one body and no other.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.HeavyArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('platearmor-1', DamageCategoryType.Physical, 5),
					FeatureLogic.createSkillCategoryFeature('platearmor-2', SkillCategoryType.Physical, -2),
					FeatureLogic.createTraitFeature('platearmor-3', TraitType.Speed, -2)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-scale-armor',
			name: 'Scale Armor',
			description: 'Overlapping metal scales sewn onto a leather backing.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.HeavyArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('scalearmor-1', DamageCategoryType.Physical, 4),
					FeatureLogic.createSkillCategoryFeature('scalearmor-2', SkillCategoryType.Physical, -1),
					FeatureLogic.createTraitFeature('scalearmor-3', TraitType.Speed, -2)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-splint-armor',
			name: 'Splint Armor',
			description: 'Long metal strips riveted over a padded coat.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.HeavyArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('splintarmor-1', DamageCategoryType.Physical, 5),
					FeatureLogic.createSkillCategoryFeature('splintarmor-2', SkillCategoryType.Physical, -3),
					FeatureLogic.createTraitFeature('splintarmor-3', TraitType.Speed, -2)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-shield',
			name: 'Shield',
			description: 'Boards and hide, strapped along the forearm.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Shields,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('shield-1', DamageCategoryType.Physical, 1)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-tower-shield',
			name: 'Tower shield',
			description: 'Tall enough to kneel behind.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Shields,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('towershield-1', DamageCategoryType.Physical, 2),
					FeatureLogic.createSkillCategoryFeature('towershield-2', SkillCategoryType.Physical, -1)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-buckler',
			name: 'Buckler',
			description: 'A small round shield gripped in the fist, for turning a thrust aside.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.Shields,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageResistFeature('buckler-1', DamageType.Piercing, 2)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-helm',
			name: 'Helm',
			description: 'A close-fitting steel cap with a nose guard.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-circlet',
			name: 'Circlet',
			description: 'A thin band of worked metal, worn across the brow.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-crown',
			name: 'Crown',
			description: 'Heavy, gold, and not subtle.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-tiara',
			name: 'Tiara',
			description: 'A delicate arc of silver and small stones.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-diadem',
			name: 'Diadem',
			description: 'A jewelled band said to mark the favour of something older than kings.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-mask',
			name: 'Mask',
			description: 'Moulded leather with narrow eye slits and no mouth.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-hood',
			name: 'Hood',
			description: 'Deep enough to keep a face in shadow.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-coif',
			name: 'Coif',
			description: 'A hood of fine mail that buckles under the chin.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Head,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-belt',
			name: 'Belt',
			description: 'Thick leather, punched with more holes than it started with.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-sash',
			name: 'Sash',
			description: 'A length of dyed cloth, wound and knotted at the hip.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-bandolier',
			name: 'Bandolier',
			description: 'Loops and pouches, worn across the chest.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-cloak',
			name: 'Cloak',
			description: 'Heavy wool, pinned at the shoulder, long enough to sleep under.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-torc',
			name: 'Torc',
			description: 'A stiff band of twisted gold, worn open at the throat.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-necklace',
			name: 'Necklace',
			description: 'Small links, carrying whatever the wearer thought worth hanging on them.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-pendant',
			name: 'Pendant',
			description: 'A single stone on a long cord, worn under the shirt.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-charm',
			name: 'Charm',
			description: 'A knot of hair, wire and something small that once had a use.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-locket',
			name: 'Locket',
			description: 'A hinged case, closed on whatever the owner could not leave behind.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-scarf',
			name: 'Scarf',
			description: 'Long, dark, and wound twice around the throat.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Neck,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-boots',
			name: 'Boots',
			description: 'Worn leather, resoled more than once.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Feet,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-sabatons',
			name: 'Sabatons',
			description: 'Articulated steel shoes, laced over the boot.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Feet,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-sandals',
			name: 'Sandals',
			description: 'Leather soles and a great deal of open air.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Feet,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-greaves',
			name: 'Greaves',
			description: 'Shaped plates that cover the shin and buckle at the calf.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Feet,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-ring',
			name: 'Ring',
			description: 'A plain band, worn thin on the inside.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Ring,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-signet',
			name: 'Signet',
			description: 'Heavy gold, cut with a device meant to be pressed into wax.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Ring,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-armband',
			name: 'Armband',
			description: 'A broad metal band, worn high on the arm where it will not slip.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Ring,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-bracelet',
			name: 'Bracelet',
			description: 'Fine links that sit loose at the wrist and catch the light.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Ring,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-bracer',
			name: 'Bracer',
			description: 'A stiffened leather guard, laced along the inside of the forearm.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.Ring,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		}
	],
	potions: [],
	scrolls: [],
	structures: [
		{
			id: 'structure-barracks',
			type: StructureType.Barracks,
			name: 'Barracks',
			description: 'Forty bunks under a roof that mostly holds.',
			position: { x: 0, y: 0 },
			level: 0,
			charges: 0
		},
		{
			id: 'structure-warehouse',
			type: StructureType.Warehouse,
			name: 'Warehouse',
			description: 'Everything the company owns and is not currently carrying.',
			position: { x: 0, y: 0 },
			level: 0,
			charges: 0
		},
		{
			id: 'structure-academy',
			type: StructureType.Academy,
			name: 'Academy',
			description: 'Drill yards, lecture halls, and instructors with strong opinions.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-recruitment',
			type: StructureType.Hall,
			name: 'Recruitment Hall',
			description: 'Word goes out; the hall fills by the end of the week.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-quartermaster',
			type: StructureType.Quartermaster,
			name: 'Quartermaster',
			description: 'Nothing leaves this room without going into the ledger first.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-training',
			type: StructureType.TrainingGround,
			name: 'Training Ground',
			description: 'The same drills, in the same mud, from first light.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-war-room',
			type: StructureType.WarRoom,
			name: 'War Room',
			description: 'Maps weighted down at the corners, behind a door that stays shut.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-wizard',
			type: StructureType.WizardTower,
			name: 'Wizard Tower',
			description: 'Full of things nobody has catalogued, on floors nobody visits.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
