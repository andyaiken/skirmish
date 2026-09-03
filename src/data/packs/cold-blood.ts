import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature-logic';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';

export const coldBlood = (): PackModel => ({
	id: 'pack-10',
	name: 'Cold Blood',
	description: 'Sinister cold-blooded creatures stalk this pack.',
	heroSpecies: [
		{
			id: 'species-reptilian',
			name: 'Reptilian',
			description: 'A scaly humanoid with draconic ancestry.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('reptilian-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('reptilian-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('reptilian-start-3', SkillType.Presence, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('reptilian-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('reptilian-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('reptilian-feature-3', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('reptilian-feature-4', DamageCategoryType.Physical, 1),
				FeatureLogic.createDamageResistFeature('reptilian-feature-5', DamageType.Psychic, 2)
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
			],
			deathActions: []
		}
	],
	monsterSpecies: [
		{
			id: 'species-crocodilian',
			name: 'Crocodilian',
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
			],
			deathActions: []
		},
		{
			id: 'species-naga',
			name: 'Naga',
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
			],
			deathActions: []
		}
	],
	roles: [],
	backgrounds: [],
	items: [],
	potions: [],
	structures: []
});
