import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action/action-logic';
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

export const overgrowth = (): PackModel => ({
	id: 'pack-overgrowth',
	name: 'Overgrowth',
	description: 'Bring the wonders of the natural world to your game with this pack.',
	species: [
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
