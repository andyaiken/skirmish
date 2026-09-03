import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition-logic';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { SummonType } from '../../enums/summon-type';
import { TraitType } from '../../enums/trait-type';

export const faeRealm = (): PackModel => ({
	id: 'pack-fae-realm',
	name: 'The Fae Realm',
	description: 'Bring the beguiling wonder of the fae into your game with this pack.',
	species: [
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
		}
	],
	backgrounds: [],
	items: [],
	potions: [],
	structures: []
});
