import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemLocationType } from '../../enums/item-location-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';

export const magicInAGlass = (): PackModel => ({
	id: 'pack-magic-in-a-glass',
	name: 'Magic in a Glass',
	description: 'These cards add magical potions to the game.',
	species: [
		{
			id: 'species-mutant',
			name: 'Mutant',
			description: 'Someone drank the wrong bottle, and this is what walked away.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('mutant-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('mutant-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('mutant-start-3', DamageType.Acid, 3),
				FeatureLogic.createDamageResistFeature('mutant-start-4', DamageType.Poison, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('mutant-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('mutant-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('mutant-feature-3', DamageType.Acid, 2),
				FeatureLogic.createDamageCategoryResistFeature('mutant-feature-4', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'mutant-action-1',
					name: 'Unstable Lash',
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
								ActionEffects.dealDamage(DamageType.Acid, 2),
								ActionEffects.dealDamage(DamageType.Poison, 2),
								ActionEffects.dealDamage(DamageType.Any, 2)
							]
						})
					]
				},
				{
					id: 'mutant-action-2',
					name: 'Reagent Spray',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Acid, 2),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 3, DamageCategoryType.Corruption))
							]
						})
					]
				},
				{
					id: 'mutant-action-3',
					name: 'Reconstitute',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healDamage(4),
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Endurance, 3, DamageType.Any))
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-homunculus',
			name: 'Homunculus',
			description: 'Knee-high, quick, and seldom encountered alone.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Drone
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('homunculus-start-1', TraitType.Speed, 2),
				FeatureLogic.createSkillFeature('homunculus-start-2', SkillType.Brawl, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('homunculus-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('homunculus-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('homunculus-feature-3', DamageType.Acid, 2)
			],
			actions: [
				{
					id: 'homunculus-action-1',
					name: 'Scurry',
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
					id: 'homunculus-action-2',
					name: 'Nip',
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
								ActionEffects.dealDamage(DamageType.Acid, 1)
							]
						})
					]
				},
				{
					id: 'homunculus-action-3',
					name: 'Underfoot',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Stealth,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.knockDown(),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 3))
							]
						})
					]
				}
			],
			deathActions: []
		}
	],
	roles: [],
	backgrounds: [
		{
			id: 'background-apothecary',
			name: 'Apothecary',
			description: 'The apothecary creates potions.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillCategoryFeature('apothecary-feature-1', SkillCategoryType.Mental, 1)
			],
			actions: [
				{
					id: 'apothecary-action-1',
					name: 'Create Tonic of Aptitude',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-aptitude')
					]
				},
				{
					id: 'apothecary-action-2',
					name: 'Create Tincture of Brilliance',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-brilliance')
					]
				},
				{
					id: 'apothecary-action-3',
					name: 'Create Potion of Health',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-health')
					]
				},
				{
					id: 'apothecary-action-4',
					name: 'Create Philtre of Luck',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-luck')
					]
				},
				{
					id: 'apothecary-action-5',
					name: 'Create Elixir of Might',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-might')
					]
				},
				{
					id: 'apothecary-action-6',
					name: 'Create Potion of Resistance',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-resistance')
					]
				},
				{
					id: 'apothecary-action-7',
					name: 'Create Brew of Strength',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-strength')
					]
				},
				{
					id: 'apothecary-action-8',
					name: 'Create Brew of Will',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-will')
					]
				},
				{
					id: 'apothecary-action-9',
					name: 'Create Brew of Quickness',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-quickness')
					]
				},
				{
					id: 'apothecary-action-10',
					name: 'Create Antidote',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-antidote')
					]
				},
				{
					id: 'apothecary-action-11',
					name: 'Create Draught of Swiftness',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createPotion('potion-swiftness')
					]
				}
			]
		}
	],
	items: [],
	potions: [
		{
			id: 'potion-aptitude',
			name: 'Tonic of Aptitude',
			description: 'A glass vial filled with a viscous orange liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 8, SkillCategoryType.Physical))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-brilliance',
			name: 'Tincture of Brilliance',
			description: 'A glass vial filled with a still purple liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 8, SkillCategoryType.Mental))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-health',
			name: 'Potion of Health',
			description: 'A glass vial filled with a sparkling red liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.healWounds(1)
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-luck',
			name: 'Philtre of Luck',
			description: 'A glass vial filled with a scintillating green liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 3, SkillCategoryType.Mental)),
					ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 3, SkillCategoryType.Physical)),
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 2, TraitType.Endurance)),
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 2, TraitType.Resolve)),
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 2, TraitType.Speed))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-might',
			name: 'Elixir of Might',
			description: 'A glass vial filled with an effervescent blue liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Physical)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Energy)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Corruption))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-resistance',
			name: 'Potion of Resistance',
			description: 'A glass vial filled with an iridescent yellow liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Physical)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Energy)),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Corruption))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-strength',
			name: 'Brew of Strength',
			description: 'A glass vial filled with a vaporous brown liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 5, TraitType.Endurance))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-will',
			name: 'Brew of Will',
			description: 'A glass vial filled with a bubbling black liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 5, TraitType.Resolve))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-quickness',
			name: 'Brew of Quickness',
			description: 'A glass vial filled with a churning pink liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				effects: [
					ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 5, TraitType.Speed))
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-antidote',
			name: 'Antidote',
			description: 'A glass vial filled with a cloudy grey liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				// One removeCondition takes the worst condition off you; an antidote should clear
				// what ails you, so it names each trait in turn
				effects: [
					ActionEffects.removeCondition(TraitType.Endurance),
					ActionEffects.removeCondition(TraitType.Resolve),
					ActionEffects.removeCondition(TraitType.Speed)
				]
			},
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'potion-swiftness',
			name: 'Draught of Swiftness',
			description: 'A glass vial filled with a restless silver liquid.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: {
				// Brew of Quickness raises the Speed trait; this one buys distance on the turn you
				// drink it, which is what you want when you are caught out of position
				effects: [
					ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Resolve, 5)),
					ActionEffects.addMovement()
				]
			},
			scroll: null,
			features: [],
			actions: []
		}
	],
	scrolls: [],
	structures: []
});
