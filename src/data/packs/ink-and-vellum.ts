import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { ConditionLogic } from '../../logic/condition-logic';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature-logic';
import { ItemLocationType } from '../../enums/item-location-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { PackModel } from '../../models/pack';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { SummonType } from '../../enums/summon-type';
import { TraitType } from '../../enums/trait-type';

export const inkAndVellum = (): PackModel => ({
	id: 'pack-ink-and-vellum',
	name: 'Ink and Vellum',
	description: 'Scrolls are a power that anyone can use - once.',
	species: [],
	roles: [],
	backgrounds: [
		{
			id: 'background-scribe',
			name: 'Scribe',
			description: 'The scribe copies out spells for other people to cast.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillCategoryFeature('scribe-feature-1', SkillCategoryType.Mental, 1)
			],
			actions: [
				{
					id: 'scribe-action-1',
					name: 'Scribe a Scroll of Binding',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-binding')
					]
				},
				{
					id: 'scribe-action-2',
					name: 'Scribe a Scroll of Blinding',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-blinding')
					]
				},
				{
					id: 'scribe-action-3',
					name: 'Scribe a Scroll of Flame',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-flame')
					]
				},
				{
					id: 'scribe-action-4',
					name: 'Scribe a Scroll of Haste',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-haste')
					]
				},
				{
					id: 'scribe-action-5',
					name: 'Scribe a Scroll of Mending',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-mending')
					]
				},
				{
					id: 'scribe-action-6',
					name: 'Scribe a Scroll of Passage',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-passage')
					]
				},
				{
					id: 'scribe-action-7',
					name: 'Scribe a Scroll of Recall',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-recall')
					]
				},
				{
					id: 'scribe-action-8',
					name: 'Scribe a Scroll of Summoning',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-summoning')
					]
				},
				{
					id: 'scribe-action-9',
					name: 'Scribe a Scroll of Warding',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-warding')
					]
				}
			]
		}
	],
	items: [],
	potions: [],
	scrolls: [
		{
			id: 'scroll-binding',
			name: 'Scroll of Binding',
			description: 'A tight roll of vellum, the ink still wet enough to smudge.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-binding',
					name: 'Scroll of Binding',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 3,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Resolve, 5))
							]
						})
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-blinding',
			name: 'Scroll of Blinding',
			description: 'A page of glyphs that are painful to read by daylight.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-blinding',
					name: 'Scroll of Blinding',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 3,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 4, SkillType.Perception))
							]
						})
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-flame',
			name: 'Scroll of Flame',
			description: 'A scorched sheet of vellum that is warm to the touch.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-flame',
					name: 'Scroll of Flame',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.dealDamage(DamageType.Fire, 4)
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-haste',
			name: 'Scroll of Haste',
			description: 'A short scroll, written in a hurried hand.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-haste',
					name: 'Scroll of Haste',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Resolve, 5)),
						ActionEffects.addMovement()
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-mending',
			name: 'Scroll of Mending',
			description: 'A prayer written out in a careful, steady hand.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-mending',
					name: 'Scroll of Mending',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
					],
					effects: [
						ActionEffects.healWounds(1),
						ActionEffects.healDamage(5)
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-passage',
			name: 'Scroll of Passage',
			description: 'A diagram of a doorway that is not anywhere in particular.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-passage',
					name: 'Scroll of Passage',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Walls, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.destroyWalls()
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-recall',
			name: 'Scroll of Recall',
			description: 'A scroll that names a place, and expects you to be standing in it.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-recall',
					name: 'Scroll of Recall',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.moveToTargetSquare()
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-summoning',
			name: 'Scroll of Summoning',
			description: 'A long scroll, bound with a cord that nobody wants to untie.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-summoning',
					name: 'Scroll of Summoning',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.summon(SummonType.Elemental)
					]
				}
			},
			features: [],
			actions: []
		},
		{
			id: 'scroll-warding',
			name: 'Scroll of Warding',
			description: 'A sheet of vellum covered edge to edge in protective sigils.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.None,
			location: ItemLocationType.None,
			slots: 1,
			weapon: null,
			armor: null,
			potion: null,
			scroll: {
				action: {
					id: 'scroll-action-warding',
					name: 'Scroll of Warding',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Any))
					]
				}
			},
			features: [],
			actions: []
		}
	],
	structures: [
		{
			id: 'structure-scriptorium',
			type: StructureType.Scriptorium,
			name: 'Scriptorium',
			description: 'A long room of sloped desks, where scribes copy out spells for people who cannot cast them.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
