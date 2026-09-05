import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemLocationType } from '../../enums/item-location-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillType } from '../../enums/skill-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';

export const longDarkWinter = (): PackModel => ({
	id: 'pack-long-dark-winter',
	name: 'The Long, Dark Winter',
	description: 'Cold is patient. It only has to win once.',
	species: [
		{
			id: 'species-frostkin',
			name: 'Frostkin',
			description: 'Cold-adapted, unhurried, and entirely untroubled by the ground.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [
				QuirkType.SureFooted
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('frostkin-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('frostkin-start-2', SkillType.Perception, 2),
				FeatureLogic.createDamageResistFeature('frostkin-start-3', DamageType.Cold, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('frostkin-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('frostkin-feature-2', SkillType.Perception, 2),
				FeatureLogic.createDamageResistFeature('frostkin-feature-3', DamageType.Cold, 1),
				FeatureLogic.createDamageBonusFeature('frostkin-feature-4', DamageType.Cold, 1)
			],
			actions: [
				{
					id: 'frostkin-action-1',
					name: 'Numbing Touch',
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
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.delay(3)
							]
						})
					]
				},
				{
					id: 'frostkin-action-2',
					name: 'Break Trail',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 3)
					],
					effects: [
						// The Frostkin ignores the ground by quirk; this is it clearing a path for
						// everyone who cannot
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 3))
					]
				},
				{
					id: 'frostkin-action-3',
					name: 'Still the Blood',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Perception,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 4, TraitType.Speed))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-frost-giant',
			name: 'Frost Giant',
			description: 'Being hit by something that cold is a thing you spend a while recovering from.',
			type: CombatantType.Monster,
			size: 3,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('frostgiant-start-1', TraitType.Endurance, 2),
				FeatureLogic.createSkillFeature('frostgiant-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('frostgiant-start-3', DamageType.Cold, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('frostgiant-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('frostgiant-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('frostgiant-feature-3', DamageType.Impact, 1)
			],
			actions: [
				{
					id: 'frostgiant-action-1',
					name: 'Hammerblow',
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
								ActionEffects.dealDamage(DamageType.Impact, 4),
								// Colossus hurls, Troll regrows, this one costs you your turn
								ActionEffects.delay(4)
							]
						})
					]
				},
				{
					id: 'frostgiant-action-2',
					name: 'Killing Frost',
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
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 3))
							]
						})
					]
				},
				{
					id: 'frostgiant-action-3',
					name: 'Backhand',
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
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.knockDown()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-rimewight',
			name: 'Rimewight',
			description: 'A corpse that froze before it could finish dying.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Undead
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('rimewight-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('rimewight-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('rimewight-start-3', DamageType.Cold, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('rimewight-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageBonusFeature('rimewight-feature-2', DamageType.Cold, 1),
				// The cold coming off it is what slows you, not the blow
				FeatureLogic.createAuraTraitFeature('rimewight-feature-3', ConditionType.TraitPenalty, TraitType.Speed, 1)
			],
			actions: [
				{
					id: 'rimewight-action-1',
					name: 'Frozen Grasp',
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
								ActionEffects.dealDamage(DamageType.Cold, 3),
								ActionEffects.delay(2)
							]
						})
					]
				},
				{
					id: 'rimewight-action-2',
					name: 'Deepening Chill',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 3))
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-ice-sheet',
			name: 'Ice Sheet',
			description: 'A monster only in the sense that it is alive. Mostly it is the floor.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [
				QuirkType.Mindless,
				QuirkType.Amorphous,
				QuirkType.SureFooted
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('icesheet-start-1', TraitType.Endurance, 2),
				FeatureLogic.createDamageResistFeature('icesheet-start-2', DamageType.Cold, 4)
			],
			features: [
				FeatureLogic.createTraitFeature('icesheet-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('icesheet-feature-2', DamageType.Cold, 2),
				FeatureLogic.createAuraDamageFeature('icesheet-feature-3', ConditionType.AutoDamage, DamageType.Cold, 1)
			],
			actions: [
				{
					id: 'icesheet-action-1',
					name: 'Freeze Over',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 3)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Ice, { radius: 1 })
					]
				},
				{
					id: 'icesheet-action-2',
					name: 'Engulf',
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
								ActionEffects.dealDamage(DamageType.Cold, 3),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 4))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-wendigo',
			name: 'Wendigo',
			description: 'It has been following the party for two days. It was waiting for one of them to bleed.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('wendigo-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('wendigo-start-2', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('wendigo-start-3', SkillType.Perception, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('wendigo-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('wendigo-feature-2', SkillType.Stealth, 2),
				FeatureLogic.createDamageBonusFeature('wendigo-feature-3', DamageType.Cold, 1)
			],
			actions: [
				{
					id: 'wendigo-action-1',
					name: 'Run Down the Weak',
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
								// It hunts the wounded, and it is much worse once you are
								ActionEffects.ifTarget(TargetStateType.Wounded, [
									ActionEffects.dealDamage(DamageType.Piercing, 4),
									ActionEffects.delay(3)
								])
							]
						})
					]
				},
				{
					id: 'wendigo-action-2',
					name: 'Stalk',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.hide()
					]
				},
				{
					id: 'wendigo-action-3',
					name: 'Killing Cold',
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
								ActionEffects.dealDamage(DamageType.Cold, 3),
								ActionEffects.inflictWounds(1)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-winter-wolf',
			name: 'Winter Wolf',
			description: 'They hunt in numbers, and they are not in a hurry either.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Beast,
				QuirkType.SureFooted
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('winterwolf-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('winterwolf-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('winterwolf-start-3', DamageType.Cold, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('winterwolf-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('winterwolf-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('winterwolf-feature-3', DamageType.Cold, 1)
			],
			actions: [
				{
					id: 'winterwolf-action-1',
					name: 'Freezing Bite',
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
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.dealDamage(DamageType.Piercing, 2)
							]
						})
					]
				},
				{
					id: 'winterwolf-action-2',
					name: 'Hamstring',
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
			id: 'role-rimecaller',
			name: 'Rimecaller',
			description: 'Its whole argument is that going second is worse than taking three damage.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('rimecaller-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('rimecaller-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('rimecaller-start-3', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('rimecaller-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('rimecaller-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('rimecaller-feature-3', DamageType.Cold, 1),
				FeatureLogic.createDamageCategoryResistFeature('rimecaller-feature-4', DamageCategoryType.Energy, 1)
			],
			actions: [
				{
					id: 'rimecaller-action-1',
					name: 'Hoarfrost',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						// The card the pack exists for: the first time anything in the game has made
						// ice on purpose
						ActionEffects.createTerrain(EncounterMapSquareType.Ice, { radius: 2 })
					]
				},
				{
					id: 'rimecaller-action-2',
					name: 'Slow',
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
								// No damage at all. That is the point of the card
								ActionEffects.delay(5),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Resolve, 4))
							]
						})
					]
				},
				{
					id: 'rimecaller-action-3',
					name: 'Cold Snap',
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
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 2, TraitType.Speed))
							]
						})
					]
				},
				{
					id: 'rimecaller-action-4',
					name: 'Black Ice',
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
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.knockDown(),
								ActionEffects.ifTarget(TargetStateType.Prone, [
									ActionEffects.dealDamage(DamageType.Impact, 4)
								])
							]
						})
					]
				},
				{
					id: 'rimecaller-action-5',
					name: 'Thaw',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						// Undoing someone else's ground: only ice converts, and it goes back to the
						// water it was made from - which is difficult terrain again, and conducts
						ActionEffects.createTerrain(EncounterMapSquareType.Water, { radius: 1, from: EncounterMapSquareType.Ice })
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-wintertouched',
			name: 'Wintertouched',
			description: 'They have been cold before, and for longer than this.',
			startingFeatures: [],
			features: [
				FeatureLogic.createTraitFeature('wintertouched-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('wintertouched-feature-2', DamageType.Cold, 2),
				FeatureLogic.createSkillFeature('wintertouched-feature-3', SkillType.Perception, 2)
			],
			actions: [
				{
					id: 'wintertouched-action-1',
					name: 'Weather It',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.toSelf([
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 3, DamageCategoryType.Energy)),
							ActionEffects.addCondition(ConditionLogic.createAutoHealCondition(TraitType.Endurance, 3))
						])
					]
				},
				{
					id: 'wintertouched-action-2',
					name: 'Keep Moving',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 3))
					]
				},
				{
					id: 'wintertouched-action-3',
					name: 'Read the Weather',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.scan(),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 3, SkillType.Perception))
					]
				}
			]
		}
	],
	items: [
		{
			id: 'item-furs',
			name: 'Furs',
			description: 'Heavy, unlovely, and the difference between a cold night and a last one.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.LightArmor,
			location: ItemLocationType.Body,
			slots: 1,
			weapon: null,
			armor: {
				features: [
					FeatureLogic.createDamageCategoryResistFeature('furs-1', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageResistFeature('furs-2', DamageType.Cold, 3)
				]
			},
			potion: null,
			scroll: null,
			features: [],
			actions: []
		}
	],
	potions: [],
	scrolls: [],
	structures: []
});
