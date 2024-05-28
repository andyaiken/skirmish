import { PackData } from './pack-data';

import { ActionTargetType } from '../enums/action-target-type';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { MovementType } from '../enums/movement-type';
import { QuirkType } from '../enums/quirk-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { SpeciesModel } from '../models/species';

import { Collections } from '../utils/collections';

export class MonsterSpeciesData {
	static colossus = (): SpeciesModel => ({
		id: 'species-colossus',
		name: 'Colossus',
		packID: '',
		description: 'A huge, monstrously strong creature.',
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
		]
	});

	static gnoll = (): SpeciesModel => ({
		id: 'species-gnoll',
		name: 'Gnoll',
		packID: '',
		description: 'A humanoid with the head and claws of a hyena.',
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
		]
	});

	static goblin = (): SpeciesModel => ({
		id: 'species-goblin',
		name: 'Goblin',
		packID: '',
		description: 'A fleet-footed creature, difficult to pin down.',
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
		]
	});

	static medusa = (): SpeciesModel => ({
		id: 'species-medusa',
		name: 'Medusa',
		packID: '',
		description: 'A humanoid with snakes for hair and a petrifying gaze.',
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
		]
	});

	static orc = (): SpeciesModel => ({
		id: 'species-orc',
		name: 'Orc',
		packID: '',
		description: 'An evil creature bred for war.',
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
		]
	});

	static ratfolk = (): SpeciesModel => ({
		id: 'species-ratfolk',
		name: 'Ratfolk',
		packID: '',
		description: 'Nimble humanoid vermin.',
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
		]
	});

	static scarab = (): SpeciesModel => ({
		id: 'species-scarab',
		name: 'Scarab',
		packID: '',
		description: 'Beetles with an acidic bite.',
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
		]
	});

	static shadowborn = (): SpeciesModel => ({
		id: 'species-shadowborn',
		name: 'Shadowborn',
		packID: '',
		description: 'A humanoid with demonic heritage.',
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
		]
	});

	static troll = (): SpeciesModel => ({
		id: 'species-troll',
		name: 'Troll',
		packID: '',
		description: 'A huge brute of a humanoid.',
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
		]
	});

	// Elementals

	static airElemental = (): SpeciesModel => ({
		id: 'species-elemental-air',
		name: 'Air Elemental',
		packID: PackData.elements().id,
		description: 'Air elementals are as changeable as the weather, either calm or tempestuous.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Amorphous
		],
		startingFeatures: [
			FeatureLogic.createTraitFeature('elemental-air-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('elemental-air-start-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-air-start-3', DamageType.Cold, 2),
			FeatureLogic.createDamageResistFeature('elemental-air-start-4', DamageType.Cold, 5)
		],
		features: [
			FeatureLogic.createTraitFeature('elemental-air-start-1', TraitType.Resolve, 1),
			FeatureLogic.createSkillFeature('elemental-air-feature-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-air-feature-3', DamageType.Cold, 2),
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
	});

	static earthElemental = (): SpeciesModel => ({
		id: 'species-elemental-earth',
		name: 'Earth Elemental',
		packID: PackData.elements().id,
		description: 'Earth elementals are slow but unstoppable.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('elemental-earth-start-1', TraitType.Endurance, 2),
			FeatureLogic.createSkillFeature('elemental-earth-start-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-earth-start-3', DamageType.Impact, 2),
			FeatureLogic.createTraitFeature('elemental-earth-start-4', TraitType.Speed, -1),
			FeatureLogic.createDamageResistFeature('elemental-earth-start-5', DamageType.Impact, 5)
		],
		features: [
			FeatureLogic.createTraitFeature('elemental-earth-feature-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('elemental-earth-feature-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-earth-feature-3', DamageType.Impact, 2),
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
						skill: SkillType.Brawl,
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
							ActionEffects.dealDamage(DamageType.Impact, 3),
							ActionEffects.knockDown()
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
	});

	static fireElemental = (): SpeciesModel => ({
		id: 'species-elemental-fire',
		name: 'Fire Elemental',
		packID: PackData.elements().id,
		description: 'Hot blooded and quick to anger, these humanoids are made of living fire.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Amorphous
		],
		startingFeatures: [
			FeatureLogic.createTraitFeature('elemental-fire-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('elemental-fire-start-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-fire-start-3', DamageType.Fire, 2),
			FeatureLogic.createDamageResistFeature('elemental-fire-start-4', DamageType.Fire, 5)
		],
		features: [
			FeatureLogic.createTraitFeature('elemental-fire-feature-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('elemental-fire-feature-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-fire-feature-3', DamageType.Fire, 2),
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
	});

	static waterElemental = (): SpeciesModel => ({
		id: 'species-elemental-water',
		name: 'Water Elemental',
		packID: PackData.elements().id,
		description: 'Humanoids made of flowing, living water.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Amorphous
		],
		startingFeatures: [
			FeatureLogic.createTraitFeature('elemental-water-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('elemental-water-start-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-water-start-3', DamageType.Impact, 2),
			FeatureLogic.createDamageResistFeature('elemental-water-start-4', DamageType.Impact, 5)
		],
		features: [
			FeatureLogic.createTraitFeature('elemental-water-feature-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('elemental-water-feature-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('elemental-water-feature-3', DamageType.Impact, 2)
		],
		actions: [
			{
				id: 'elemental-water-action-1',
				name: 'Tsunami',
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
							ActionEffects.dealDamage(DamageType.Impact, 2),
							ActionEffects.forceMovement(MovementType.Push, 1),
							ActionEffects.knockDown()
						]
					})
				]
			},
			{
				id: 'elemental-water-action-2',
				name: 'Waterspout',
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
							ActionEffects.dealDamage(DamageType.Impact, 2),
							ActionEffects.knockDown()
						]
					})
				]
			}
		]
	});

	// Beasts

	static bear = (): SpeciesModel => ({
		id: 'species-bear',
		name: 'Bear',
		packID: PackData.beasts().id,
		description: 'A huge, powerful mammal.',
		type: CombatantType.Monster,
		size: 2,
		quirks: [
			QuirkType.Beast
		],
		startingFeatures: [
			FeatureLogic.createTraitFeature('bear-start-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('bear-start-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageCategoryBonusFeature('bear-start-3', DamageCategoryType.Physical, 1)
		],
		features: [
			FeatureLogic.createTraitFeature('bear-feature-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('bear-feature-2', SkillType.Brawl, 2),
			FeatureLogic.createDamageCategoryBonusFeature('bear-feature-3', DamageCategoryType.Physical, 1)
		],
		actions: [
			{
				id: 'bear-action-1',
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
				id: 'bear-action-2',
				name: 'Swipe',
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
							ActionEffects.dealDamage(DamageType.Edged, 4)
						]
					})
				]
			},
			{
				id: 'bear-action-3',
				name: 'Hug',
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
							ActionEffects.dealDamage(DamageType.Impact, 4)
						]
					})
				]
			}
		]
	});

	static giantSpider = (): SpeciesModel => ({
		id: 'species-giant-spider',
		name: 'Giant Spider',
		packID: PackData.beasts().id,
		description: 'Venomous insects with eight legs.',
		type: CombatantType.Monster,
		size: 2,
		quirks: [
			QuirkType.Beast
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('giant-spider-start-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('giant-spider-start-2', DamageType.Poison, 2)
		],
		features: [
			FeatureLogic.createSkillFeature('giant-spider-feature-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageBonusFeature('giant-spider-feature-2', DamageType.Poison, 2)
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
							ActionEffects.dealDamage(DamageType.Poison, 3)
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
			},
			{
				id: 'giant-spider-action-3',
				name: 'Cocoon',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
				],
				effects: [
					ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 3, TraitType.Speed)),
					ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 5))
				]
			}
		]
	});

	static ratSwarm = (): SpeciesModel => ({
		id: 'species-rat-swarm',
		name: 'Rat Swarm',
		packID: PackData.beasts().id,
		description: 'A swarm of large rodents.',
		type: CombatantType.Monster,
		size: 2,
		quirks: [
			QuirkType.Beast,
			QuirkType.Swarm
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('rat-swarm-start-1', SkillType.Brawl, 2),
			FeatureLogic.createTraitFeature('rat-swarm-start-2', TraitType.Endurance, 1)
		],
		features: [
			FeatureLogic.createSkillFeature('rat-swarm-feature-1', SkillType.Brawl, 2),
			FeatureLogic.createTraitFeature('rat-swarm-feature-2', TraitType.Endurance, 1)
		],
		actions: [
			{
				id: 'rat-swarm-action-1',
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
							ActionEffects.dealDamage(DamageType.Poison, 1)
						]
					})
				]
			}
		]
	});

	static vespineSwarm = (): SpeciesModel => ({
		id: 'species-vespine-swarm',
		name: 'Vespine Swarm',
		packID: PackData.beasts().id,
		description: 'A swarm of fast-moving flying insects.',
		type: CombatantType.Monster,
		size: 2,
		quirks: [
			QuirkType.Beast,
			QuirkType.Swarm
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('vespine-swarm-start-1', SkillType.Brawl, 2),
			FeatureLogic.createTraitFeature('vespine-swarm-start-2', TraitType.Speed, 1),
			FeatureLogic.createDamageBonusFeature('vespine-swarm-start-3', DamageType.Poison, 1)
		],
		features: [
			FeatureLogic.createSkillFeature('vespine-swarm-feature-1', SkillType.Brawl, 2),
			FeatureLogic.createTraitFeature('vespine-swarm-feature-2', TraitType.Speed, 1),
			FeatureLogic.createDamageBonusFeature('vespine-swarm-feature-3', DamageType.Poison, 1)
		],
		actions: [
			{
				id: 'vespine-swarm-action-1',
				name: 'Follow Scent',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 3)
				],
				effects: [
					ActionEffects.forceMovement(MovementType.BesideTarget, 1),
					ActionEffects.takeAnotherAction()
				]
			},
			{
				id: 'vespine-swarm-action-2',
				name: 'Sting',
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
							ActionEffects.dealDamage(DamageType.Poison, 1)
						]
					})
				]
			}
		]
	});

	static wolf = (): SpeciesModel => ({
		id: 'species-wolf',
		name: 'Wolf',
		packID: PackData.beasts().id,
		description: 'A large canine that hunts in packs.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Beast
		],
		startingFeatures: [
			FeatureLogic.createTraitFeature('wolf-start-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('wolf-start-2', SkillType.Brawl, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('wolf-feature-1', TraitType.Endurance, 1),
			FeatureLogic.createSkillFeature('wolf-feature-2', SkillType.Brawl, 2)
		],
		actions: [
			{
				id: 'wolf-action-1',
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
				id: 'wolf-action-2',
				name: 'Pounce',
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
							ActionEffects.dealDamage(DamageType.Piercing, 2),
							ActionEffects.knockDown()
						]
					})
				]
			},
			{
				id: 'wolf-action-3',
				name: 'Pack Tactics',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
				],
				effects: [
					ActionEffects.commandMove(),
					ActionEffects.takeAnotherAction()
				]
			}
		]
	});

	// Undead

	static skeleton = (): SpeciesModel => ({
		id: 'species-skeleton',
		name: 'Skeleton',
		packID: PackData.undead().id,
		description: 'Re-animated bones.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Undead
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('skeleton-start-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageResistFeature('skeleton-start-2', DamageType.Piercing, 2),
			FeatureLogic.createDamageCategoryResistFeature('skeleton-start-3', DamageCategoryType.Corruption, 1)
		],
		features: [
			FeatureLogic.createSkillFeature('skeleton-feature-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageResistFeature('skeleton-feature-2', DamageType.Piercing, 2),
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
							ActionEffects.dealDamage(DamageType.Impact, 3),
							ActionEffects.dealDamage(DamageType.Decay, 2)
						]
					})
				]
			},
			{
				id: 'skeleton-action-2',
				name: 'Reassemble',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.self()
				],
				effects: [
					ActionEffects.healDamage(3),
					ActionEffects.healWounds(1)
				]
			},
			{
				id: 'skeleton-action-3',
				name: 'Boneshard',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Brawl,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Piercing, 3),
							ActionEffects.dealDamage(DamageType.Decay, 2)
						]
					})
				]
			}
		]
	});

	static vampire = (): SpeciesModel => ({
		id: 'species-vampire',
		name: 'Vampire',
		packID: PackData.undead().id,
		description: 'The blood is the life.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Undead
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('vampire-start-1', SkillType.Brawl, 2),
			FeatureLogic.createSkillFeature('vampire-start-2', SkillType.Presence, 2),
			FeatureLogic.createDamageCategoryResistFeature('vampire-start-3', DamageCategoryType.Corruption, 1)
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
							ActionEffects.toSelf([
								ActionEffects.healDamage(1),
								ActionEffects.healWounds(1)
							])
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
	});

	static wraith = (): SpeciesModel => ({
		id: 'species-wraith',
		name: 'Wraith',
		packID: PackData.undead().id,
		description: 'A floating, spectral apparition.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Undead,
			QuirkType.Amorphous
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('wraith-start-1', SkillType.Presence, 2),
			FeatureLogic.createDamageCategoryResistFeature('wraith-start-2', DamageCategoryType.Corruption, 1),
			FeatureLogic.createTraitFeature('wraith-start-3', TraitType.Resolve, 1)
		],
		features: [
			FeatureLogic.createSkillFeature('wraith-feature-1', SkillType.Presence, 2),
			FeatureLogic.createDamageCategoryResistFeature('wraith-feature-2', DamageCategoryType.Corruption, 1),
			FeatureLogic.createTraitFeature('wraith-feature-3', TraitType.Resolve, 1)
		],
		actions: [
			{
				id: 'wraith-action-1',
				name: 'Spectral Visage',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
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
			},
			{
				id: 'wraith-action-2',
				name: 'Life Drain',
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
							ActionEffects.dealDamage(DamageType.Decay, 2),
							ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 3, SkillCategoryType.Mental)),
							ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 3, SkillCategoryType.Physical))
						]
					})
				]
			}
		]
	});

	static zombie = (): SpeciesModel => ({
		id: 'species-zombie',
		name: 'Zombie',
		packID: PackData.undead().id,
		description: 'A re-animated corpse.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Mindless,
			QuirkType.Undead
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('zombie-start-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageCategoryResistFeature('zombie-start-2', DamageCategoryType.Corruption, 1),
			FeatureLogic.createTraitFeature('zombie-start-3', TraitType.Endurance, 1)
		],
		features: [
			FeatureLogic.createSkillFeature('zombie-feature-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageCategoryResistFeature('zombie-feature-2', DamageCategoryType.Corruption, 1),
			FeatureLogic.createTraitFeature('zombie-feature-3', TraitType.Endurance, 1)
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
							ActionEffects.dealDamage(DamageType.Piercing, 2),
							ActionEffects.dealDamage(DamageType.Decay, 2)
						]
					})
				]
			},
			{
				id: 'zombie-action-2',
				name: 'Grave Rot',
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
							ActionEffects.dealDamage(DamageType.Decay, 3),
							ActionEffects.toSelf([
								ActionEffects.healDamage(1)
							])
						]
					})
				]
			}
		]
	});

	// Fae

	static banshee = (): SpeciesModel => ({
		id: 'species-banshee',
		name: 'Banshee',
		packID: PackData.fae().id,
		description: 'A fae spirit whose unearthly wail presages death.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [
			QuirkType.Undead
		],
		startingFeatures: [
			FeatureLogic.createSkillFeature('banshee-start-1', SkillType.Presence, 2),
			FeatureLogic.createDamageBonusFeature('banshee-start-2', DamageType.Sonic, 1),
			FeatureLogic.createTraitFeature('banshee-start-3', TraitType.Resolve, 1)
		],
		features: [
			FeatureLogic.createSkillFeature('banshee-feature-1', SkillType.Presence, 2),
			FeatureLogic.createDamageBonusFeature('banshee-feature-2', DamageType.Sonic, 1),
			FeatureLogic.createTraitFeature('banshee-feature-3', TraitType.Resolve, 1)
		],
		actions: [
			{
				id: 'banshee-action-1',
				name: 'Deathly Scream',
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
							ActionEffects.dealDamage(DamageType.Sonic, 4),
							ActionEffects.forceMovement(MovementType.Push, 1),
							ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Resolve, 3))
						]
					})
				]
			},
			{
				id: 'banshee-action-2',
				name: 'Keening Wail',
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
							ActionEffects.dealDamage(DamageType.Sonic, 3)
						]
					})
				]
			},
			{
				id: 'banshee-action-3',
				name: 'Siren Call',
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
							ActionEffects.commandAction(),
							ActionEffects.stun()
						]
					})
				]
			}
		]
	});

	// Cold blood

	static crocodilian = (): SpeciesModel => ({
		id: 'species-crocodilian',
		name: 'Crocodilian',
		packID: PackData.coldBlood().id,
		description: 'An ancient species of humanoid crocodiles with armored skin.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createSkillFeature('crocodilian-start-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageCategoryResistFeature('crocodilian-start-2', DamageCategoryType.Physical, 2),
			FeatureLogic.createDamageCategoryResistFeature('crocodilian-start-3', DamageCategoryType.Energy, 2)
		],
		features: [
			FeatureLogic.createSkillFeature('crocodilian-feature-1', SkillType.Brawl, 2),
			FeatureLogic.createDamageCategoryResistFeature('crocodilian-feature-2', DamageCategoryType.Physical, 2),
			FeatureLogic.createDamageCategoryResistFeature('crocodilian-feature-3', DamageCategoryType.Energy, 2)
		],
		actions: [
			{
				id: 'crocodilian-action-1',
				name: 'Snapjaw',
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
				id: 'crocodilian-action-2',
				name: 'Tail Swipe',
				prerequisites: [],
				parameters: [
					ActionTargetParameters.adjacent(ActionTargetType.Combatants, Number.MAX_VALUE)
				],
				effects: [
					ActionEffects.attack({
						weapon: false,
						skill: SkillType.Brawl,
						trait: TraitType.Speed,
						skillBonus: 0,
						hit: [
							ActionEffects.dealDamage(DamageType.Impact, 3),
							ActionEffects.forceMovement(MovementType.Push, 1),
							ActionEffects.knockDown()
						]
					})
				]
			}
		]
	});

	static naga = (): SpeciesModel => ({
		id: 'species-naga',
		name: 'Naga',
		packID: PackData.coldBlood().id,
		description: 'A serpentine humanoid.',
		type: CombatantType.Monster,
		size: 1,
		quirks: [],
		startingFeatures: [
			FeatureLogic.createTraitFeature('naga-start-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('naga-start-2', SkillType.Brawl, 2),
			FeatureLogic.createSkillFeature('naga-start-3', SkillType.Presence, 2)
		],
		features: [
			FeatureLogic.createTraitFeature('naga-feature-1', TraitType.Speed, 1),
			FeatureLogic.createSkillFeature('naga-feature-2', SkillType.Brawl, 2),
			FeatureLogic.createSkillFeature('naga-feature-3', SkillType.Presence, 2),
			FeatureLogic.createDamageBonusFeature('naga-feature-4', DamageType.Poison, 2),
			FeatureLogic.createDamageResistFeature('naga-feature-5', DamageType.Poison, 2)
		],
		actions: [
			{
				id: 'naga-action-1',
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
							ActionEffects.dealDamage(DamageType.Poison, 4)
						]
					})
				]
			},
			{
				id: 'naga-action-2',
				name: 'Constrict',
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
							ActionEffects.dealDamage(DamageType.Impact, 4)
						]
					})
				]
			},
			{
				id: 'naga-action-3',
				name: 'Beguiling Gaze',
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
							ActionEffects.commandAction()
						]
					})
				]
			}
		]
	});

	static getList = (): SpeciesModel[] => {
		const list = [
			MonsterSpeciesData.colossus(),
			MonsterSpeciesData.gnoll(),
			MonsterSpeciesData.goblin(),
			MonsterSpeciesData.medusa(),
			MonsterSpeciesData.orc(),
			MonsterSpeciesData.ratfolk(),
			MonsterSpeciesData.shadowborn(),
			MonsterSpeciesData.troll(),
			// Elementals
			MonsterSpeciesData.airElemental(),
			MonsterSpeciesData.earthElemental(),
			MonsterSpeciesData.fireElemental(),
			MonsterSpeciesData.waterElemental(),
			// Beasts
			MonsterSpeciesData.bear(),
			MonsterSpeciesData.giantSpider(),
			MonsterSpeciesData.ratSwarm(),
			MonsterSpeciesData.scarab(),
			MonsterSpeciesData.vespineSwarm(),
			MonsterSpeciesData.wolf(),
			// Undead
			MonsterSpeciesData.skeleton(),
			MonsterSpeciesData.vampire(),
			MonsterSpeciesData.wraith(),
			MonsterSpeciesData.zombie(),
			// Fae
			MonsterSpeciesData.banshee(),
			// Cold blood
			MonsterSpeciesData.crocodilian(),
			MonsterSpeciesData.naga()
		];

		list.forEach(n => {
			n.startingFeatures = Collections.sort(n.startingFeatures, f => FeatureLogic.getFeatureTitle(f));
			n.features = Collections.sort(n.features, f => FeatureLogic.getFeatureTitle(f));
			n.actions = Collections.sort(n.actions, a => a.name);
		});
		return Collections.sort(list, n => n.name);
	};
}
