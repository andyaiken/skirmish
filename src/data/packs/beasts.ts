import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition-logic';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature-logic';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';

export const beasts = (): PackModel => ({
	id: 'pack-04',
	name: 'The Menagerie',
	description: 'This beast-themed collection contains dangerous new species.',
	heroSpecies: [
		{
			id: 'species-minotaur',
			name: 'Minotaur',
			description: 'A muscular humanoid with the head of a bull.',
			type: CombatantType.Hero,
			size: 2,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('minotaur-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('minotaur-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('minotaur-start-3', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryBonusFeature('minotaur-start-4', DamageCategoryType.Physical, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('minotaur-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('minotaur-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('minotaur-feature-3', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryBonusFeature('minotaur-feature-4', DamageCategoryType.Physical, 1)
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
			],
			deathActions: []
		},
		{
			id: 'species-werewolf',
			name: 'Werewolf',
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
					name: 'Maul',
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
			],
			deathActions: []
		}
	],
	monsterSpecies: [
		{
			id: 'species-bear',
			name: 'Bear',
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
			],
			deathActions: []
		},
		{
			id: 'species-giant-spider',
			name: 'Giant Spider',
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
			],
			deathActions: []
		},
		{
			id: 'species-rat-swarm',
			name: 'Rat Swarm',
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
			],
			deathActions: []
		},
		{
			id: 'species-vespine-swarm',
			name: 'Vespine Swarm',
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
			],
			deathActions: []
		},
		{
			id: 'species-wolf',
			name: 'Wolf',
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
