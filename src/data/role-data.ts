import { PackData } from './pack-data';

import { ActionTargetType } from '../enums/action-target-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { MovementType } from '../enums/movement-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { SummonType } from '../enums/summon-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { RoleModel } from '../models/role';

import { Collections } from '../utils/collections';

export class RoleData {
	static arcanist = (): RoleModel => ({
		id: 'role-arcanist',
		name: 'Arcanist',
		packID: '',
		description: 'Arcanists are magical generalists, able to create a wide range of effects.',
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
	});

	static artificer = (): RoleModel => ({
		id: 'role-artificer',
		name: 'Artificer',
		packID: PackData.technology().id,
		description: 'A creator of magically-powered inventions.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('artificer-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('artificer-start-2', SkillType.Spellcasting, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('artificer-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('artificer-feature-2', SkillType.Spellcasting, 2),
			FeatureLogic.createDamageCategoryBonusFeature('artificer-feature-3', DamageCategoryType.Energy, 1)
		],
		actions: [
			{
				id: 'artificer-action-1',
				name: 'Aetheric Gauntlet',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Electricity, 3)
						]
					})
				]
			},
			{
				id: 'artificer-action-2',
				name: 'Voltaic Flux',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Electricity, 3)
						]
					})
				]
			},
			{
				id: 'artificer-action-3',
				name: 'Supercharge',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 3, DamageCategoryType.Corruption)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 3, DamageCategoryType.Energy)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 3, DamageCategoryType.Physical))
				]
			},
			{
				id: 'artificer-action-4',
				name: 'Gravity Bomb',
				prerequisites: [],
				parameters: [
					ActionOriginParameters.distance(8),
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Endurance,
						skillBonus: 0,
						hit: [
							ActionEffects.forceMovement(MovementType.Pull, 3),
							ActionEffects.knockDown()
						]
					})
				]
			},
			{
				id: 'artificer-action-5',
				name: 'Vitriolic Jet',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 3)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Endurance,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Acid, 3)
						]
					})
				]
			}
		]
	});

	static assassin = (): RoleModel => ({
		id: 'role-assassin',
		name: 'Assassin',
		packID: PackData.skullduggery().id,
		description: 'Assassins operate from the shadows, using poison to kill.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('assassin-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('assassin-start-2', SkillType.Stealth, 2),
			FeatureLogic.createSkillFeature('assassin-start-3', SkillType.Weapon, 2),
			FeatureLogic.createProficiencyFeature('assassin-start-4', ItemProficiencyType.PairedWeapons)
		],
		features: [
			FeatureLogic.createTraitFeature('assassin-feature-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('assassin-feature-2', SkillType.Stealth, 2),
			FeatureLogic.createSkillFeature('assassin-feature-3', SkillType.Weapon, 2),
			FeatureLogic.createDamageBonusFeature('assassin-feature-4', DamageType.Poison, 2)
		],
		actions: [
			{
				id: 'assassin-action-1',
				name: 'Poison Strike',
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
							ActionEffects.dealDamage(DamageType.Poison, 2),
							ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Poison))
						]
					})
				]
			},
			{
				id: 'assassin-action-2',
				name: 'Vanish',
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
				id: 'assassin-action-3',
				name: 'Sneak Attack',
				prerequisites: [
					ActionPrerequisites.meleeWeapon(),
					ActionPrerequisites.hidden()
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
							ActionEffects.dealWeaponDamage(2),
							ActionEffects.dealDamage(DamageType.Poison, 2)
						]
					})
				]
			}
		]
	});

	static barbarian = (): RoleModel => ({
		id: 'role-barbarian',
		name: 'Barbarian',
		packID: '',
		description: 'Barbarians are warriors who attack recklessly, with no sense of self-preservation.',
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
	});

	static centurion = (): RoleModel => ({
		id: 'role-centurion',
		name: 'Centurion',
		packID: '',
		description: 'A master of the battlefield.',
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
					ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Endurance, 5, DamageType.All))
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
	});

	static cleric = (): RoleModel => ({
		id: 'role-cleric',
		name: 'Cleric',
		packID: PackData.faith().id,
		description: 'Clerics devote their lives to the gods, and receive power in return.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('cleric-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('cleric-start-2', SkillType.Presence, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('cleric-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('cleric-feature-2', SkillType.Presence, 2),
			FeatureLogic.createDamageBonusFeature('cleric-feature-3', DamageType.Light, 2)
		],
		actions: [
			{
				id: 'cleric-action-1',
				name: 'Lay On Hands',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
				],
				effects: [
					ActionEffects.healDamage(5),
					ActionEffects.healWounds(1)
				]
			},
			{
				id: 'cleric-action-2',
				name: 'Sacrament',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Allies, Number.MAX_VALUE)
				],
				effects: [
					ActionEffects.removeCondition(TraitType.Any),
					ActionEffects.healDamage(1),
					ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 3, DamageType.All))
				]
			},
			{
				id: 'cleric-action-3',
				name: 'Holy Light',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 3, DamageType.All))
				]
			},
			{
				id: 'cleric-action-4',
				name: 'Bless',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Endurance)),
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Resolve)),
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Speed))
				]
			},
			{
				id: 'cleric-action-5',
				name: 'Divine Retribution',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Presence,
						trait: TraitType.Endurance,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Light, 3),
							ActionEffects.dealDamage(DamageType.Fire, 3)
						]
					})
				]
			}
		]
	});

	static dervish = (): RoleModel => ({
		id: 'role-dervish',
		name: 'Dervish',
		packID: '',
		description: 'Acrobatic warriors who leap and spin around the battlefield.',
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
	});

	static druid = (): RoleModel => ({
		id: 'role-druid',
		name: 'Druid',
		packID: PackData.fae().id,
		description: 'A wielder of the magic of the natural world.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('druid-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('druid-start-2', SkillType.Spellcasting, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('druid-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('druid-feature-2', SkillType.Spellcasting, 2)
		],
		actions: [
			{
				id: 'druid-action-1',
				name: 'Animal Companion',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.summon(SummonType.Beast)
				]
			},
			{
				id: 'druid-action-2',
				name: 'Stone to Dust',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Walls, 1, 10)
				],
				effects: [
					ActionEffects.addSquares()
				]
			},
			{
				id: 'druid-action-3',
				name: 'Sunlight',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 5)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Endurance,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Light, 2),
							ActionEffects.stun()
						]
					})
				]
			},
			{
				id: 'druid-action-4',
				name: 'Nature\'s Balm',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
				],
				effects: [
					ActionEffects.healDamage(1),
					ActionEffects.removeCondition(TraitType.Any)
				]
			}
		]
	});

	static elementalist = (): RoleModel => ({
		id: 'role-elementalist',
		name: 'Elementalist',
		packID: PackData.elements().id,
		description: 'A master of manipulating the four elements.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('elementalist-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('elementalist-start-2', SkillType.Spellcasting, 2),
			FeatureLogic.createProficiencyFeature('elementalist-start-3', ItemProficiencyType.Implements)
		],
		features: [
			FeatureLogic.createTraitFeature('elementalist-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('elementalist-feature-2', SkillType.Spellcasting, 2),
			FeatureLogic.createDamageCategoryBonusFeature('elementalist-feature-3', DamageCategoryType.Energy, 1),
			FeatureLogic.createDamageCategoryResistFeature('elementalist-feature-4', DamageCategoryType.Energy, 1)
		],
		actions: [
			{
				id: 'elementalist-action-1',
				name: 'Summon Elemental',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.summon(SummonType.Elemental)
				]
			},
			{
				id: 'elementalist-action-2',
				name: 'Ember',
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
							ActionEffects.dealDamage(DamageType.Fire, 3),
							ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 2, DamageType.Fire))
						]
					})
				]
			},
			{
				id: 'elementalist-action-3',
				name: 'Rime',
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
							ActionEffects.dealDamage(DamageType.Cold, 3),
							ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 3))
						]
					})
				]
			},
			{
				id: 'elementalist-action-4',
				name: 'Thunderbolt',
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
							ActionEffects.dealDamage(DamageType.Electricity, 3),
							ActionEffects.stun()
						]
					})
				]
			},
			{
				id: 'elementalist-action-5',
				name: 'Elemental Resistance',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Energy))
				]
			}
		]
	});

	static enchanter = (): RoleModel => ({
		id: 'role-enchanter',
		name: 'Enchanter',
		packID: PackData.arcana().id,
		description: 'Spellcasters who specialize in magic that confuses the senses.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('enchanter-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('enchanter-start-2', SkillType.Spellcasting, 2),
			FeatureLogic.createProficiencyFeature('enchanter-start-3', ItemProficiencyType.Implements)
		],
		features: [
			FeatureLogic.createTraitFeature('enchanter-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('enchanter-feature-2', SkillType.Spellcasting, 2),
			FeatureLogic.createDamageBonusFeature('enchanter-feature-3', DamageType.Psychic, 2),
			FeatureLogic.createDamageResistFeature('enchanter-feature-4', DamageType.Psychic, 2)
		],
		actions: [
			{
				id: 'enchanter-action-1',
				name: 'Hypnotic Suggestion',
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
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.commandAction()
						]
					})
				]
			},
			{
				id: 'enchanter-action-2',
				name: 'Bewilder',
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
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.stun()
						]
					})
				]
			},
			{
				id: 'enchanter-action-3',
				name: 'Induce Fear',
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
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 5, TraitType.Speed))
						]
					})
				]
			},
			{
				id: 'enchanter-action-4',
				name: 'Intellect Shield',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Corruption))
				]
			},
			{
				id: 'enchanter-action-5',
				name: 'Weaken',
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
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.addCondition(ConditionLogic.createDamagePenaltyCondition(TraitType.Endurance, 5, DamageType.All))
						]
					})
				]
			},
			{
				id: 'enchanter-action-6',
				name: 'Cloak',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
				],
				effects: [
					ActionEffects.hide()
				]
			}
		]
	});

	static geomancer = (): RoleModel => ({
		id: 'role-geomancer',
		name: 'Geomancer',
		packID: PackData.arcana().id,
		description: 'Spellcasters whose magic affects the battlefield itself.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('geomancer-start-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('geomancer-start-2', SkillType.Spellcasting, 2),
			FeatureLogic.createProficiencyFeature('geomancer-start-3', ItemProficiencyType.Implements)
		],
		features: [
			FeatureLogic.createTraitFeature('geomancer-feature-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('geomancer-feature-2', SkillType.Spellcasting, 2),
			FeatureLogic.createAuraFeature('geomancer-feature-3', ConditionType.MovementBonus, 1),
			FeatureLogic.createAuraFeature('geomancer-feature-4', ConditionType.MovementPenalty, 1)
		],
		actions: [
			{
				id: 'geomancer-action-1',
				name: 'Obstruct Terrain',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
				],
				effects: [
					ActionEffects.createTerrain(EncounterMapSquareType.Obstructed)
				]
			},
			{
				id: 'geomancer-action-2',
				name: 'Clear Terrain',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
				],
				effects: [
					ActionEffects.createTerrain(EncounterMapSquareType.Clear)
				]
			},
			{
				id: 'geomancer-action-3',
				name: 'Destroy Ground',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
				],
				effects: [
					ActionEffects.removeSquares()
				]
			},
			{
				id: 'geomancer-action-4',
				name: 'Raze',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Walls, Number.MAX_VALUE, 3)
				],
				effects: [
					ActionEffects.addSquares()
				]
			},
			{
				id: 'geomancer-action-5',
				name: 'Earthbind',
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
				id: 'geomancer-action-6',
				name: 'Rockblast',
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
							ActionEffects.dealDamage(DamageType.Impact, 3),
							ActionEffects.knockDown()
						]
					})
				]
			}
		]
	});

	static gunslinger = (): RoleModel => ({
		id: 'role-gunslinger',
		name: 'Gunslinger',
		packID: PackData.technology().id,
		description: 'A fighter who uses gunpowder weapons.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('gunslinger-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('gunslinger-start-2', SkillType.Weapon, 2),
			FeatureLogic.createProficiencyFeature('gunslinger-start-3', ItemProficiencyType.PowderWeapons)
		],
		features: [
			FeatureLogic.createTraitFeature('gunslinger-feature-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('gunslinger-feature-2', SkillType.Weapon, 2)
		],
		actions: [
			{
				id: 'gunslinger-action-1',
				name: 'Fusilade',
				prerequisites: [
					ActionPrerequisites.rangedWeapon()
				],
				parameters: [
					ActionWeaponParameters.ranged(),
					ActionOriginParameters.weapon(),
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
				],
				effects: [
					ActionEffects.attack({
						weapon: true,
						skill: SkillType.Weapon,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealWeaponDamage(-2)
						]
					})
				]
			},
			{
				id: 'gunslinger-action-2',
				name: 'Overcharged Round',
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
							ActionEffects.dealWeaponDamage(2)
						]
					})
				]
			},
			{
				id: 'gunslinger-action-3',
				name: 'Pommel Strike',
				prerequisites: [
					ActionPrerequisites.rangedWeapon()
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
							ActionEffects.dealDamage(DamageType.Impact, 2)
						]
					})
				]
			},
			{
				id: 'gunslinger-action-4',
				name: 'Quickfire',
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
							ActionEffects.dealWeaponDamage()
						]
					}),
					ActionEffects.attack({
						weapon: true,
						skill: SkillType.Weapon,
						trait: TraitType.Speed,
						skillBonus: -2,
						hit: [
							ActionEffects.dealWeaponDamage()
						]
					})
				]
			},
			{
				id: 'gunslinger-action-5',
				name: 'Sharpshooter',
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
			}
		]
	});

	static luckweaver = (): RoleModel => ({
		id: 'role-luckweaver',
		name: 'Luckweaver',
		packID: PackData.fae().id,
		description: 'One who can manipulate the laws of chance.',
		startingFeatures: [
			FeatureLogic.createSkillFeature('luckweaver-start-1', SkillType.Spellcasting, 2)
		],
		features: [
			FeatureLogic.createSkillFeature('luckweaver-feature-1', SkillType.Spellcasting, 2),
			FeatureLogic.createSkillCategoryFeature('luckweaver-feature-2', SkillCategoryType.Any, 1),
			FeatureLogic.createDamageCategoryBonusFeature('luckweaver-feature-3', DamageCategoryType.Any, 1),
			FeatureLogic.createDamageCategoryResistFeature('luckweaver-feature-4', DamageCategoryType.Any, 1)
		],
		actions: [
			{
				id: 'luckweaver-action-1',
				name: 'Chaos Bolt',
				prerequisites: [],
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
							ActionEffects.dealDamage(DamageType.Any, 3)
						]
					})
				]
			},
			{
				id: 'luckweaver-action-2',
				name: 'Warp Space',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 10)
				],
				effects: [
					ActionEffects.forceMovement(MovementType.Random, 3)
				]
			},
			{
				id: 'luckweaver-action-3',
				name: 'Probability Wave',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 10)
				],
				effects: [
					ActionEffects.invertConditions(true)
				]
			},
			{
				id: 'luckweaver-action-4',
				name: 'Banish',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Combatants, 1, 5)
				],
				effects: [
					ActionEffects.forceMovement(MovementType.Random, 20),
					ActionEffects.stun()
				]
			}
		]
	});

	static necromancer = (): RoleModel => ({
		id: 'role-necromancer',
		name: 'Necromancer',
		packID: PackData.undead().id,
		description: 'A spellcaster whose magic deals with life and death.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('necromancer-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('necromancer-start-2', SkillType.Spellcasting, 2),
			FeatureLogic.createProficiencyFeature('necromancer-start-3', ItemProficiencyType.Implements)
		],
		features: [
			FeatureLogic.createTraitFeature('necromancer-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('necromancer-feature-2', SkillType.Spellcasting, 2),
			FeatureLogic.createAuraDamageFeature('necromancer-feature-3', ConditionType.AutoDamage, DamageType.Decay, 1),
			FeatureLogic.createDamageBonusFeature('necromancer-feature-4', DamageType.Decay, 2)
		],
		actions: [
			{
				id: 'necromancer-action-1',
				name: 'Transfer Damage',
				prerequisites: [
					ActionPrerequisites.implement(),
					ActionPrerequisites.damage()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
				],
				effects: [
					ActionEffects.dealDamage(DamageType.Decay, 3),
					ActionEffects.toSelf([
						ActionEffects.healDamage(3)
					])
				]
			},
			{
				id: 'necromancer-action-2',
				name: 'Transfer Wounds',
				prerequisites: [
					ActionPrerequisites.implement(),
					ActionPrerequisites.wound()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
				],
				effects: [
					ActionEffects.inflictWounds(1),
					ActionEffects.toSelf([
						ActionEffects.healWounds(1)
					])
				]
			},
			{
				id: 'necromancer-action-3',
				name: 'Accept Damage',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
				],
				effects: [
					ActionEffects.healDamage(3),
					ActionEffects.toSelf([
						ActionEffects.dealDamage(DamageType.Decay, 3)
					])
				]
			},
			{
				id: 'necromancer-action-4',
				name: 'Accept Wounds',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
				],
				effects: [
					ActionEffects.healWounds(1),
					ActionEffects.toSelf([
						ActionEffects.inflictWounds(1)
					])
				]
			},
			{
				id: 'necromancer-action-5',
				name: 'Strength from Pain',
				prerequisites: [
					ActionPrerequisites.implement(),
					ActionPrerequisites.damage()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
				],
				effects: [
					ActionEffects.healDamage(3),
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Endurance)),
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Resolve))
				]
			},
			{
				id: 'necromancer-action-6',
				name: 'Grave Bolt',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Decay, 3),
							ActionEffects.toSelf([
								ActionEffects.healWounds(1)
							])
						]
					})
				]
			},
			{
				id: 'necromancer-action-7',
				name: 'Raise the Dead',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.summon(SummonType.Undead)
				]
			}
		]
	});

	static ninja = (): RoleModel => ({
		id: 'role-ninja',
		name: 'Ninja',
		packID: PackData.skullduggery().id,
		description: 'A martial artist who hones their abilities with extreme training and self-discipline.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('ninja-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('ninja-start-2', SkillType.Brawl, 2),
			FeatureLogic.createSkillFeature('ninja-start-3', SkillType.Stealth, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('ninja-feature-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('ninja-feature-2', SkillType.Brawl, 2),
			FeatureLogic.createSkillFeature('ninja-feature-3', SkillType.Stealth, 2),
			FeatureLogic.createDamageCategoryBonusFeature('ninja-feature-4', DamageCategoryType.Physical, 1)
		],
		actions: [
			{
				id: 'ninja-action-1',
				name: 'Roundhouse kick',
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
			},
			{
				id: 'ninja-action-2',
				name: 'Flurry',
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
					}),
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Brawl,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Impact, 1)
						]
					}),
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
			},
			{
				id: 'ninja-action-3',
				name: 'Split Kick',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Enemies, 2)
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
				id: 'ninja-action-4',
				name: 'Adrenal Boost',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 2, TraitType.Speed)),
					ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 2)),
					ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 2, SkillType.Brawl)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 2, DamageCategoryType.Physical))
				]
			}
		]
	});

	static paladin = (): RoleModel => ({
		id: 'role-paladin',
		name: 'Paladin',
		packID: PackData.faith().id,
		description: 'A holy warrior, driven by unwavering faith.',
		startingFeatures: [
			FeatureLogic.createSkillFeature('paladin-start-1', SkillType.Presence, 2),
			FeatureLogic.createSkillFeature('paladin-start-2', SkillType.Weapon, 2),
			FeatureLogic.createProficiencyFeature('paladin-start-3', ItemProficiencyType.MilitaryWeapons),
			FeatureLogic.createProficiencyFeature('paladin-start-4', ItemProficiencyType.HeavyArmor),
			FeatureLogic.createProficiencyFeature('paladin-start-5', ItemProficiencyType.Shields)
		],
		features: [
			FeatureLogic.createSkillFeature('paladin-feature-1', SkillType.Presence, 2),
			FeatureLogic.createSkillFeature('paladin-feature-2', SkillType.Weapon, 2),
			FeatureLogic.createAuraDamageCategoryFeature('paladin-feature-3', ConditionType.DamageCategoryResistance, DamageCategoryType.Physical, 3),
			FeatureLogic.createAuraDamageCategoryFeature('paladin-feature-4', ConditionType.DamageCategoryResistance, DamageCategoryType.Energy, 3),
			FeatureLogic.createAuraDamageCategoryFeature('paladin-feature-5', ConditionType.DamageCategoryResistance, DamageCategoryType.Corruption, 3)
		],
		actions: [
			{
				id: 'paladin-action-1',
				name: 'Radiant Smite',
				prerequisites: [
					ActionPrerequisites.meleeWeapon()
				],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
				],
				effects: [
					ActionEffects.attack({
						weapon: true,
						skill: SkillType.Weapon,
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.dealWeaponDamage(),
							ActionEffects.dealDamage(DamageType.Light, 2)
						]
					})
				]
			},
			{
				id: 'paladin-action-2',
				name: 'Flame of Valor',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Presence,
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Light, 2)
						]
					})
				]
			},
			{
				id: 'paladin-action-3',
				name: 'Shield of Justice',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 3)
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 3, DamageType.All))
				]
			},
			{
				id: 'paladin-action-4',
				name: 'Templar\'s Strength',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.healDamage(1),
					ActionEffects.healWounds(1)
				]
			}
		]
	});

	static psion = (): RoleModel => ({
		id: 'role-psion',
		name: 'Psion',
		packID: PackData.arcana().id,
		description: 'A master of the power of the mind.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('psion-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('psion-start-2', SkillType.Presence, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('psion-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('psion-feature-2', SkillType.Presence, 2),
			FeatureLogic.createDamageBonusFeature('psion-feature-3', DamageType.Psychic, 2),
			FeatureLogic.createDamageResistFeature('psion-feature-4', DamageType.Psychic, 2)
		],
		actions: [
			{
				id: 'psion-action-1',
				name: 'Bend Allegiance',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
				],
				effects: [
					ActionEffects.commandAction()
				]
			},
			{
				id: 'psion-action-2',
				name: 'Psychic Feedback',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Combatants, Number.MAX_VALUE)
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
				id: 'psion-action-3',
				name: 'Psychic Barrage',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 5)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Presence,
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Psychic, 4)
						]
					})
				]
			},
			{
				id: 'psion-action-4',
				name: 'Dishearten',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Presence,
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.addCondition(ConditionLogic.createDamagePenaltyCondition(TraitType.Resolve, 6, DamageType.All))
						]
					})
				]
			},
			{
				id: 'psion-action-5',
				name: 'Mental Assault',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Presence,
						trait: TraitType.Resolve,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Psychic, 5)
						]
					})
				]
			},
			{
				id: 'psion-action-6',
				name: 'Mind Over Body',
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
	});

	static ranger = (): RoleModel => ({
		id: 'role-ranger',
		name: 'Ranger',
		packID: '',
		description: 'A fighter who specializes in ranged weaponry.',
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
	});

	static sensei = (): RoleModel => ({
		id: 'role-sensei',
		name: 'Sensei',
		packID: '',
		description: 'A martial artist who uses magically-enhanced fighting techniques.',
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
	});

	static sorcerer = (): RoleModel => ({
		id: 'role-sorcerer',
		name: 'Sorcerer',
		packID: PackData.elements().id,
		description: 'A magic-user whose spells are elemental and destructive.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('sorcerer-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('sorcerer-start-2', SkillType.Spellcasting, 2),
			FeatureLogic.createProficiencyFeature('sorcerer-start-3', ItemProficiencyType.Implements)
		],
		features: [
			FeatureLogic.createTraitFeature('sorcerer-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('sorcerer-feature-2', SkillType.Spellcasting, 2),
			FeatureLogic.createDamageCategoryBonusFeature('sorcerer-feature-3', DamageCategoryType.Energy, 1),
			FeatureLogic.createDamageCategoryResistFeature('sorcerer-feature-4', DamageCategoryType.Energy, 1),
			FeatureLogic.createAuraDamageFeature('sorcerer-feature-5', ConditionType.AutoDamage, DamageType.Fire, 1),
			FeatureLogic.createAuraDamageFeature('sorcerer-feature-6', ConditionType.AutoDamage, DamageType.Cold, 1),
			FeatureLogic.createAuraDamageFeature('sorcerer-feature-7', ConditionType.AutoDamage, DamageType.Electricity, 1)
		],
		actions: [
			{
				id: 'sorcerer-action-1',
				name: 'Thunderstorm',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionOriginParameters.distance(10),
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Electricity, 3),
							ActionEffects.stun()
						]
					})
				]
			},
			{
				id: 'sorcerer-action-2',
				name: 'Inferno',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionOriginParameters.distance(10),
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Fire, 3),
							ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 5, DamageType.Fire))
						]
					})
				]
			},
			{
				id: 'sorcerer-action-3',
				name: 'Ice Storm',
				prerequisites: [
					ActionPrerequisites.implement()
				],
				parameters: [
					ActionOriginParameters.distance(10),
					ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Spellcasting,
						trait: TraitType.Endurance,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Cold, 3),
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
						]
					})
				]
			}
		]
	});

	static warmage = (): RoleModel => ({
		id: 'role-warmage',
		name: 'Warmage',
		packID: PackData.arcana().id,
		description: 'A warrior who bridges martial discipline and arcane power.',
		startingFeatures: [
			FeatureLogic.createTraitFeature('warmage-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('warmage-start-2', SkillType.Weapon, 2),
			FeatureLogic.createProficiencyFeature('warmage-start-3', ItemProficiencyType.MilitaryWeapons),
			FeatureLogic.createProficiencyFeature('warmage-start-4', ItemProficiencyType.LightArmor)
		],
		features: [
			FeatureLogic.createTraitFeature('warmage-feature-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('warmage-feature-2', SkillType.Weapon, 2),
			FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-3', DamageCategoryType.Energy, 1),
			FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-4', DamageCategoryType.Physical, 1)
		],
		actions: [
			{
				id: 'warmage-action-1',
				name: 'Flaming Blade',
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
							ActionEffects.dealDamage(DamageType.Fire, 2),
							ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 5, DamageType.Fire))
						]
					})
				]
			},
			{
				id: 'warmage-action-2',
				name: 'Frost Blade',
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
							ActionEffects.dealDamage(DamageType.Cold, 2),
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
						]
					})
				]
			},
			{
				id: 'warmage-action-3',
				name: 'Shocking Blade',
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
							ActionEffects.dealDamage(DamageType.Electricity, 2),
							ActionEffects.stun()
						]
					})
				]
			},
			{
				id: 'warmage-action-4',
				name: 'Armor Enhancement',
				prerequisites: [
					ActionPrerequisites.armor()
				],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Physical)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Energy))
				]
			},
			{
				id: 'warmage-action-5',
				name: 'Arcane Whip',
				prerequisites: [
					ActionPrerequisites.meleeWeapon()
				],
				parameters: [
					ActionWeaponParameters.melee(),
					ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 2)
				],
				effects: [
					ActionEffects.attack({
						weapon: true,
						skill: SkillType.Weapon,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealWeaponDamage(),
							ActionEffects.forceMovement(MovementType.Pull, 3)
						]
					})
				]
			}
		]
	});

	static valkyrie = (): RoleModel => ({
		id: 'role-valkyrie',
		name: 'Valkyrie',
		packID: '',
		description: 'Heavily armed and armored, valkyries are a force to be reckoned with.',
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
					ActionEffects.moveToTargetSquare(),
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
	});

	static getList = (): RoleModel[] => {
		const list = [
			RoleData.arcanist(),
			RoleData.artificer(),
			RoleData.assassin(),
			RoleData.barbarian(),
			RoleData.centurion(),
			RoleData.cleric(),
			RoleData.dervish(),
			RoleData.druid(),
			RoleData.elementalist(),
			RoleData.enchanter(),
			RoleData.geomancer(),
			RoleData.gunslinger(),
			RoleData.luckweaver(),
			RoleData.necromancer(),
			RoleData.ninja(),
			RoleData.paladin(),
			RoleData.psion(),
			RoleData.ranger(),
			RoleData.sensei(),
			RoleData.sorcerer(),
			RoleData.warmage(),
			RoleData.valkyrie()
		];

		list.forEach(n => {
			n.startingFeatures = Collections.sort(n.startingFeatures, f => FeatureLogic.getFeatureTitle(f));
			n.features = Collections.sort(n.features, f => FeatureLogic.getFeatureTitle(f));
			n.actions = Collections.sort(n.actions, a => a.name);
		});
		return Collections.sort(list, n => n.name);
	};
}
