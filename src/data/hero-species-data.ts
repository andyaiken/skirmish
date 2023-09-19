import { PackData } from './pack-data';

import { ActionTargetType } from '../enums/action-target-type';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { MovementType } from '../enums/movement-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { SpeciesModel } from '../models/species';

export class HeroSpeciesData {
	static human: SpeciesModel = {
		id: 'species-human',
		name: 'Human',
		packID: '',
		description: 'Humans are resourceful and adaptable.',
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
				parameters: [],
				effects: [
					ActionEffects.takeAnotherAction(true)
				]
			}
		]
	};

	static construct: SpeciesModel = {
		id: 'species-construct',
		name: 'Construct',
		packID: PackData.technology.id,
		description: 'A living automaton.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('construct-start-1', TraitType.Endurance, 1),
			FeatureLogic.createTraitFeature('construct-start-2', TraitType.Resolve, 1),
			FeatureLogic.createDamageResistFeature('construct-start-3', DamageType.Poison, 2),
			FeatureLogic.createDamageResistFeature('construct-start-4', DamageType.Psychic, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('construct-feature-1', TraitType.Endurance, 1),
			FeatureLogic.createTraitFeature('construct-feature-2', TraitType.Resolve, 1),
			FeatureLogic.createDamageResistFeature('construct-feature-3', DamageType.Poison, 2),
			FeatureLogic.createDamageResistFeature('construct-feature-4', DamageType.Psychic, 2)
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
							ActionEffects.dealDamage(DamageType.Impact, 2),
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
					ActionEffects.healDamage(1),
					ActionEffects.takeAnotherAction()
				]
			}
		]
	};

	static deva: SpeciesModel = {
		id: 'species-deva',
		name: 'Deva',
		packID: 'pack-7',
		description: 'A humanoid with angelic ancestry.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('deva-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('deva-start-2', SkillType.Presence, 2)
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
					ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
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
					ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
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
	};

	static dwarf: SpeciesModel = {
		id: 'species-dwarf',
		name: 'Dwarf',
		packID: '',
		description: 'A short, sturdy creature, fond of drink and industry.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('dwarf-start-1', TraitType.Endurance, 2)
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
		]
	};

	static elf: SpeciesModel = {
		id: 'species-elf',
		name: 'Elf',
		packID: '',
		description: 'An elegant forest-dwelling creature.',
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
		]
	};

	static gnome: SpeciesModel = {
		id: 'species-gnome',
		name: 'Gnome',
		packID: '',
		description: 'A short creature who often prefers to be unseen.',
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
			}
		]
	};

	static minotaur: SpeciesModel = {
		id: 'species-minotaur',
		name: 'Minotaur',
		packID: PackData.beasts.id,
		description: 'A muscular humanoid with the head of a bull.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('minotaur-start-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('minotaur-start-2', SkillType.Brawl, 2)
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
	};

	static pixie: SpeciesModel = {
		id: 'species-pixie',
		name: 'Pixie',
		packID: '',
		description: 'A tiny fairy-like creature.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('pixie-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('pixie-start-2', SkillType.Stealth, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('pixie-feature-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('pixie-feature-2', SkillType.Stealth, 2),
			FeatureLogic.createDamageCategoryResistFeature('pixie-feature-3', DamageCategoryType.Corruption, 1)
		],
		actions: [
			{
				id: 'pixie-action-1',
				name: 'Confound',
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
	};

	static reptilian: SpeciesModel = {
		id: 'species-reptilian',
		name: 'Reptilian',
		packID: '',
		description: 'A scaly humanoid with draconic ancestry.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('reptilian-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('reptilian-start-2', SkillType.Brawl, 2)
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
				name: 'Breathe Fire',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 3)
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
				name: 'Intimidating Presence',
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
							ActionEffects.forceMovement(MovementType.Push, 1),
							ActionEffects.stun()
						]
					})
				]
			}
		]
	};

	static shadowborn: SpeciesModel = {
		id: 'species-shadowborn',
		name: 'Shadowborn',
		packID: '',
		description: 'A humanoid with demonic heritage.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('shadowborn-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('shadowborn-start-2', SkillType.Brawl, 2),
			FeatureLogic.createSkillFeature('shadowborn-start-3', SkillType.Stealth, 2)
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
	};

	static werewolf: SpeciesModel = {
		id: 'species-werewolf',
		name: 'Werewolf',
		packID: PackData.beasts.id,
		description: 'A creature cursed with a wolf form.',
		type: CombatantType.Hero,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('werewolf-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('werewolf-start-2', SkillType.Brawl, 2),
			FeatureLogic.createSkillFeature('werewolf-start-3', SkillType.Perception, 2),
			FeatureLogic.createSkillFeature('werewolf-start-4', SkillType.Stealth, 2)
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
	};

	static getList = (): SpeciesModel[] => {
		const list = [
			HeroSpeciesData.human,
			HeroSpeciesData.construct,
			HeroSpeciesData.deva,
			HeroSpeciesData.dwarf,
			HeroSpeciesData.elf,
			HeroSpeciesData.gnome,
			HeroSpeciesData.minotaur,
			HeroSpeciesData.pixie,
			HeroSpeciesData.reptilian,
			HeroSpeciesData.shadowborn,
			HeroSpeciesData.werewolf
		];

		list.forEach(n => {
			n.actions.sort((a, b) => a.name.localeCompare(b.name));
		});
		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	};
}
