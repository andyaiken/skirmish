import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { ContagionType } from '../../enums/contagion-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { SummonType } from '../../enums/summon-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';

export const faeRealm = (): PackModel => ({
	id: 'pack-fae-realm',
	name: 'The Fae Realm',
	description: 'Bring the beguiling wonder of the fae into your game with this pack.',
	species: [
		{
			id: 'species-banshee',
			name: 'Banshee',
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
			],
			deathActions: [
				{
					id: 'banshee-death-1',
					name: 'Final Wail',
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
								ActionEffects.dealDamage(DamageType.Sonic, 3),
								ActionEffects.stun()
							]
						})
					]
				}
			]
		},
		{
			id: 'species-bramblewight',
			name: 'Bramblewight',
			description: 'A knot of thorns in the rough shape of a man, and rooted where it stands.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [
				QuirkType.Plant
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('bramblewight-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('bramblewight-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('bramblewight-start-3', DamageType.Piercing, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('bramblewight-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('bramblewight-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createAuraDamageFeature('bramblewight-feature-3', ConditionType.AutoDamage, DamageType.Piercing, 1)
			],
			actions: [
				{
					id: 'bramblewight-action-1',
					name: 'Thrash',
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
								ActionEffects.dealDamage(DamageType.Piercing, 2)
							]
						})
					]
				},
				{
					id: 'bramblewight-action-2',
					name: 'Snare',
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
								ActionEffects.dealDamage(DamageType.Piercing, 2),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 3))
							]
						})
					]
				},
				{
					id: 'bramblewight-action-3',
					name: 'Dig In',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.toSelf([
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 4, DamageCategoryType.Physical))
						])
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-echo',
			name: 'Echo',
			description: 'A sound that outlived the thing that made it.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('echo-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('echo-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('echo-start-3', DamageType.Sonic, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('echo-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('echo-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('echo-feature-3', DamageCategoryType.Physical, 2),
				FeatureLogic.createDamageResistFeature('echo-feature-4', DamageType.Sonic, 2)
			],
			actions: [
				{
					id: 'echo-action-1',
					name: 'Reverberate',
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
								ActionEffects.dealDamage(DamageType.Sonic, 3)
							]
						})
					]
				},
				{
					id: 'echo-action-2',
					name: 'Repeat the Wound',
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
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 4, DamageType.Sonic))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-faun',
			name: 'Faun',
			description: 'A humanoid with powerful goat-like legs.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('faun-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('faun-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('faun-start-3', SkillType.Reactions, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('faun-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('faun-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('faun-feature-3', SkillType.Reactions, 2)
			],
			actions: [
				{
					id: 'faun-action-1',
					name: 'Quick Leap',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 4)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.BesideTarget, 1),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'faun-action-2',
					name: 'Knockdown Jump',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 4)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.BesideTarget, 1),
						ActionEffects.knockDown()
					]
				},
				{
					id: 'faun-action-3',
					name: 'Powerful Kick',
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
								ActionEffects.forceMovement(MovementType.Push, 1)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-fungal-bloom',
			name: 'Fungal Bloom',
			description: 'A pale, swollen cap that does very little until it is broken open.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Plant,
				QuirkType.Mindless
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('fungalbloom-start-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('fungalbloom-start-2', DamageType.Decay, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('fungalbloom-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('fungalbloom-feature-2', DamageType.Poison, 2)
			],
			actions: [
				{
					id: 'fungalbloom-action-1',
					name: 'Puffball',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.makeContagious(
									ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Endurance, 2, SkillCategoryType.Physical),
									ContagionType.All
								))
							]
						})
					]
				},
				{
					id: 'fungalbloom-action-2',
					name: 'Settle',
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
								ActionEffects.dealDamage(DamageType.Decay, 2)
							]
						})
					]
				}
			],
			deathActions: [
				{
					id: 'fungalbloom-death-1',
					name: 'Burst',
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
								ActionEffects.dealDamage(DamageType.Decay, 2),
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Decay), ContagionType.All))
							]
						})
					]
				}
			]
		},
		{
			id: 'species-heartwood',
			name: 'Heartwood',
			description: 'The oldest thing in the wood, and the reason the rest of it is awake.',
			type: CombatantType.Monster,
			size: 3,
			quirks: [
				QuirkType.Plant
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('heartwood-start-1', TraitType.Endurance, 2),
				FeatureLogic.createSkillFeature('heartwood-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('heartwood-start-3', DamageCategoryType.Physical, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('heartwood-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('heartwood-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('heartwood-feature-3', DamageType.Decay, 1)
			],
			actions: [
				{
					id: 'heartwood-action-1',
					name: 'Call the Wood',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.summon(SummonType.Plant)
					]
				},
				{
					id: 'heartwood-action-2',
					name: 'Bough',
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
								ActionEffects.dealDamage(DamageType.Impact, 5),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'heartwood-action-3',
					name: 'Deep Wood',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 5)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Obstructed, { radius: 2 })
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-pixie',
			name: 'Pixie',
			description: 'A tiny fairy-like creature.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('pixie-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('pixie-start-2', SkillType.Stealth, 2),
				FeatureLogic.createDamageCategoryResistFeature('pixie-start-3', DamageCategoryType.Corruption, 1)
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
			],
			deathActions: []
		},
		{
			id: 'species-rotcap',
			name: 'Rotcap',
			description: 'Where it has been standing, nothing else will.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Plant,
				QuirkType.Mindless
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('rotcap-start-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageBonusFeature('rotcap-start-2', DamageType.Decay, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('rotcap-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createAuraDamageFeature('rotcap-feature-2', ConditionType.AutoDamage, DamageType.Decay, 1)
			],
			actions: [
				{
					id: 'rotcap-action-1',
					name: 'Spread',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 5)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Obstructed, { radius: 1 })
					]
				},
				{
					id: 'rotcap-action-2',
					name: 'Rot',
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
								ActionEffects.dealDamage(DamageType.Decay, 4)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-screamer',
			name: 'Screamer',
			description: 'A thin, wide-mouthed thing that does its work with noise.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('screamer-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('screamer-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('screamer-start-3', DamageType.Sonic, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('screamer-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('screamer-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageResistFeature('screamer-feature-3', DamageType.Sonic, 3)
			],
			actions: [
				{
					id: 'screamer-action-1',
					name: 'Shriek',
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
								ActionEffects.dealDamage(DamageType.Sonic, 1),
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'screamer-action-2',
					name: 'Wail',
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
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Resolve)),
								ActionEffects.reveal()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-siren',
			name: 'Siren',
			description: 'Getting closer sounds like the only good idea you have ever had.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('siren-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('siren-start-2', SkillType.Presence, 3),
				FeatureLogic.createDamageBonusFeature('siren-start-3', DamageType.Sonic, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('siren-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('siren-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageResistFeature('siren-feature-3', DamageType.Sonic, 3)
			],
			actions: [
				{
					id: 'siren-action-1',
					name: 'Siren Song',
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
								ActionEffects.forceMovement(MovementType.Pull, 3),
								// You walk towards the singing, and everything else waits
								ActionEffects.delay(4)
							]
						})
					]
				},
				{
					id: 'siren-action-2',
					name: 'Enthrall',
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
								ActionEffects.commandAction()
							]
						})
					]
				},
				{
					id: 'siren-action-3',
					name: 'Dashed on the Rocks',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Sonic, 3),
								ActionEffects.knockDown()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-strangler',
			name: 'Strangler',
			description: 'It does not come to you. It has other ways of closing the distance.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Plant,
				QuirkType.Mindless
			],
			startingFeatures: [
				// It stays put because Coil drags its prey into reach, not because anything stops it
				// moving - no species in the game carries a stat penalty
				FeatureLogic.createTraitFeature('strangler-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('strangler-start-2', SkillType.Brawl, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('strangler-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('strangler-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('strangler-feature-3', DamageType.Impact, 1)
			],
			actions: [
				{
					id: 'strangler-action-1',
					name: 'Coil',
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
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.forceMovement(MovementType.TowardsTarget, 2)
							]
						})
					]
				},
				{
					id: 'strangler-action-2',
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
								ActionEffects.dealDamage(DamageType.Impact, 4),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 4))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-sylvan',
			name: 'Sylvan',
			description: 'Plant-kin, grown rather than born.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [
				QuirkType.Plant
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('sylvan-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('sylvan-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('sylvan-start-3', DamageType.Decay, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('sylvan-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('sylvan-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('sylvan-feature-3', DamageType.Poison, 1),
				FeatureLogic.createDamageResistFeature('sylvan-feature-4', DamageType.Impact, 1)
			],
			actions: [
				{
					id: 'sylvan-action-1',
					name: 'Take Root',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.toSelf([
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 4, DamageCategoryType.Physical)),
							ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 4))
						])
					]
				},
				{
					id: 'sylvan-action-2',
					name: 'Reach',
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
								ActionEffects.dealDamage(DamageType.Piercing, 3)
							]
						})
					]
				},
				{
					id: 'sylvan-action-3',
					name: 'Regrow',
					prerequisites: [
						ActionPrerequisites.damage()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healDamage(3)
					]
				}
			],
			deathActions: []
		}
	],
	roles: [
		{
			id: 'role-druid',
			name: 'Druid',
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
					name: 'Choking Roots',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 2),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 3))
							]
						})
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
		},
		{
			id: 'role-hexbow',
			name: 'Hexbow',
			description: 'One who melds deadly aim with raw magical power.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('hexbow-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('hexbow-start-2', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('hexbow-start-3', ItemProficiencyType.RangedWeapons),
				FeatureLogic.createProficiencyFeature('hexbow-start-4', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('hexbow-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('hexbow-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageCategoryBonusFeature('hexbow-feature-3', DamageCategoryType.Energy, 1)
			],
			actions: [
				{
					id: 'hexbow-action-1',
					name: 'Fire Shot',
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
								ActionEffects.dealDamage(DamageType.Fire, 2),
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 5, DamageType.Fire))
							]
						})
					]
				},
				{
					id: 'hexbow-action-2',
					name: 'Charged Shot',
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
							trait: TraitType.Endurance,
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
					id: 'hexbow-action-3',
					name: 'Freezing Shot',
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
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
							]
						})
					]
				},
				{
					id: 'hexbow-action-4',
					name: 'Web Shot',
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
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 5)),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
							]
						})
					]
				},
				{
					id: 'hexbow-action-5',
					name: 'Storm Shot',
					prerequisites: [],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionOriginParameters.weapon(),
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.dealDamage(DamageType.Electricity, 1),
								ActionEffects.forceMovement(MovementType.Push, 5),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'hexbow-action-6',
					name: 'Ringing Shot',
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
								ActionEffects.dealDamage(DamageType.Sonic, 2),
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'hexbow-action-7',
					name: 'Lasso Shot',
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
								ActionEffects.forceMovement(MovementType.BesideTarget, 1)
							]
						})
					]
				}
			]
		},
		{
			id: 'role-luckweaver',
			name: 'Luckweaver',
			description: 'One who can manipulate the laws of chance.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('luckweaver-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('luckweaver-start-2', SkillType.Spellcasting, 2)
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
				},
				{
					// Both of these spread to the carrier's own side, so both are Allies: put ill
					// fortune on an enemy and it works through their line, put good fortune on an
					// ally and it works through yours
					id: 'luckweaver-action-5',
					name: 'Ill Fortune',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.makeContagious(
							ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 4, SkillType.All),
							ContagionType.Allies
						))
					]
				},
				{
					id: 'luckweaver-action-6',
					name: 'Good Fortune',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 8)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.makeContagious(
							ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 4, SkillType.All),
							ContagionType.Allies
						))
					]
				}
			]
		},
		{
			id: 'role-thornwright',
			name: 'Thornwright',
			description: 'Where the geomancer moves rock, the thornwright grows things in the way.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('thornwright-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('thornwright-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('thornwright-start-3', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('thornwright-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('thornwright-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('thornwright-feature-3', DamageType.Piercing, 1),
				FeatureLogic.createDamageBonusFeature('thornwright-feature-4', DamageType.Decay, 1)
			],
			actions: [
				{
					id: 'thornwright-action-1',
					name: 'Briar',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Obstructed, { radius: 2 })
					]
				},
				{
					id: 'thornwright-action-2',
					name: 'Clear Cut',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Clear, { radius: 2, from: EncounterMapSquareType.Obstructed })
					]
				},
				{
					id: 'thornwright-action-3',
					name: 'Barbs',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 2),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 3))
							]
						})
					]
				},
				{
					id: 'thornwright-action-4',
					name: 'Strangle',
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
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 3),
								// Briars catch the fallen
								ActionEffects.ifTarget(TargetStateType.Prone, [
									ActionEffects.dealDamage(DamageType.Piercing, 4)
								])
							]
						})
					]
				},
				{
					id: 'thornwright-action-5',
					name: 'Deep Roots',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.toSelf([
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 3, DamageCategoryType.Physical)),
							ActionEffects.addCondition(ConditionLogic.createAutoHealCondition(TraitType.Endurance, 3))
						])
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-sporeborn',
			name: 'Sporeborn',
			description: 'Something took root in them once, and it has been generous ever since.',
			startingFeatures: [],
			features: [
				FeatureLogic.createTraitFeature('sporeborn-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('sporeborn-feature-2', DamageType.Decay, 1),
				FeatureLogic.createDamageResistFeature('sporeborn-feature-3', DamageType.Poison, 1)
			],
			actions: [
				{
					id: 'sporeborn-action-1',
					name: 'Bloom',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 3)
					],
					effects: [
						// The pack's signature: a contagious condition that is worth catching, passed
						// through a party standing close enough together
						ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoHealCondition(TraitType.Endurance, 2), ContagionType.Allies))
					]
				},
				{
					id: 'sporeborn-action-2',
					name: 'Blight Spores',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 2), ContagionType.Enemies))
					]
				},
				{
					id: 'sporeborn-action-3',
					name: 'Shed',
					prerequisites: [
						ActionPrerequisites.condition(TraitType.Any)
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Any)
					]
				}
			]
		}
	],
	items: [],
	potions: [],
	scrolls: [],
	structures: []
});
