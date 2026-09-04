import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillType } from '../../enums/skill-type';
import { SummonType } from '../../enums/summon-type';
import { TraitType } from '../../enums/trait-type';

export const elements = (): PackModel => ({
	id: 'pack-elements',
	name: 'The Elements',
	description: 'Become the master of the four elements with this pack.',
	species: [
		{
			id: 'species-elemental-air',
			name: 'Air Elemental',
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
				FeatureLogic.createTraitFeature('elemental-air-feature-1', TraitType.Resolve, 1),
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
			],
			deathActions: []
		},
		{
			id: 'species-elemental-earth',
			name: 'Earth Elemental',
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
			],
			deathActions: []
		},
		{
			id: 'species-elemental-fire',
			name: 'Fire Elemental',
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
			],
			deathActions: []
		},
		{
			id: 'species-elemental-water',
			name: 'Water Elemental',
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
			],
			deathActions: []
		}
	],
	roles: [
		{
			id: 'role-elementalist',
			name: 'Elementalist',
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
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 2, DamageType.Fire)))
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
		},
		{
			id: 'role-sorcerer',
			name: 'Sorcerer',
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
		}
	],
	backgrounds: [],
	items: [],
	potions: [],
	scrolls: [],
	structures: []
});
