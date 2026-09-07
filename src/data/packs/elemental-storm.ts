import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
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
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { SummonType } from '../../enums/summon-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';

export const elementalStorm = (): PackModel => ({
	id: 'pack-elemental-storm',
	name: 'The Elemental Storm',
	description: 'Air, water, stone and cold - and the things that live where those things win.',
	species: [
		{
			id: 'species-elemental-air',
			name: 'Air Elemental',
			description: 'Air elementals are as changeable as the weather, either calm or tempestuous.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Amorphous,
				QuirkType.Elemental
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
			quirks: [
				QuirkType.Elemental
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('elemental-earth-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('elemental-earth-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('elemental-earth-start-3', DamageType.Impact, 2),
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
				QuirkType.Amorphous,
				QuirkType.Elemental
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
			id: 'species-kelpie',
			name: 'Kelpie',
			description: 'It waits at the water\'s edge in the shape of a horse.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Beast,
				QuirkType.Aquatic
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('kelpie-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('kelpie-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('kelpie-start-3', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('kelpie-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('kelpie-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('kelpie-feature-3', SkillType.Stealth, 2)
			],
			actions: [
				{
					id: 'kelpie-action-1',
					name: 'Trample',
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
								ActionEffects.dealDamage(DamageType.Impact, 3)
							]
						})
					]
				},
				{
					id: 'kelpie-action-2',
					name: 'Lure to the Water',
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
								ActionEffects.commandMove()
							]
						})
					]
				},
				{
					id: 'kelpie-action-3',
					name: 'Hold Under',
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
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 4))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-merrow',
			name: 'Merrow',
			description: 'A heavy-shouldered thing of the deep water, all teeth and patience.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [
				QuirkType.Aquatic
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('merrow-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('merrow-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryBonusFeature('merrow-start-3', DamageCategoryType.Physical, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('merrow-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('merrow-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryBonusFeature('merrow-feature-3', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'merrow-action-1',
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
					id: 'merrow-action-2',
					name: 'Drag Under',
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
								ActionEffects.forceMovement(MovementType.Pull, 2),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'merrow-action-3',
					name: 'Thrash',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 3, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: -2,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 2)
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
			id: 'species-selkie',
			name: 'Selkie',
			description: 'A coastal creature of two shapes.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [
				QuirkType.Aquatic
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('selkie-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('selkie-start-2', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('selkie-start-3', SkillType.Perception, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('selkie-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('selkie-feature-2', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('selkie-feature-3', SkillType.Perception, 2)
			],
			actions: [
				{
					id: 'selkie-action-1',
					name: 'Slip the Skin',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Speed, 4)),
						ActionEffects.hide(),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'selkie-action-2',
					name: 'Sleek Form',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Speed, 4, TraitType.Speed)),
						ActionEffects.takeAnotherAction()
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
				QuirkType.Amorphous,
				QuirkType.Elemental
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
			id: 'role-corsair',
			name: 'Corsair',
			description: 'A boarder, who fights best in the moment after everyone else has lost track of the plan.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('corsair-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('corsair-start-2', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('corsair-start-3', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('corsair-start-4', ItemProficiencyType.PairedWeapons),
				FeatureLogic.createProficiencyFeature('corsair-start-5', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('corsair-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('corsair-feature-2', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('corsair-feature-3', SkillType.Weapon, 2),
				FeatureLogic.createDamageBonusFeature('corsair-feature-4', DamageType.Edged, 1)
			],
			actions: [
				{
					id: 'corsair-action-1',
					name: 'Boarding Action',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
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
								ActionEffects.forceMovement(MovementType.Swap, 0)
							]
						})
					]
				},
				{
					id: 'corsair-action-2',
					name: 'Cut and Thrust',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -1,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Reactions,
							trait: TraitType.Speed,
							skillBonus: -1,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'corsair-action-3',
					name: 'Grapple',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Reactions,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.forceMovement(MovementType.Pull, 2)
							]
						})
					]
				},
				{
					id: 'corsair-action-4',
					name: 'Press the Advantage',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Reactions,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.takeAnotherAction()
							]
						})
					]
				},
				{
					id: 'corsair-action-5',
					name: 'Turn the Blade',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Reactions,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.disarm()
							]
						})
					]
				},
				{
					id: 'corsair-action-6',
					name: 'Harpoon',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Reactions,
							trait: TraitType.Speed,
							skillBonus: -1,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 3),
								ActionEffects.forceMovement(MovementType.Pull, 3),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 4))
							]
						})
					]
				}
			]
		},
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
		},
		{
			id: 'role-stormcaller',
			name: 'Stormcaller',
			description: 'Weather, brought indoors and pointed at someone.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('stormcaller-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('stormcaller-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('stormcaller-start-3', ItemProficiencyType.LargeWeapons),
				FeatureLogic.createProficiencyFeature('stormcaller-start-4', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('stormcaller-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('stormcaller-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('stormcaller-feature-3', DamageType.Impact, 1),
				FeatureLogic.createDamageBonusFeature('stormcaller-feature-4', DamageType.Electricity, 1)
			],
			actions: [
				{
					id: 'stormcaller-action-1',
					name: 'Downburst',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'stormcaller-action-2',
					name: 'Lightning Strike',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 6)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Electricity, 5)
							]
						})
					]
				},
				{
					id: 'stormcaller-action-3',
					name: 'Forked Bolt',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 3, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: -1,
							hit: [
								ActionEffects.dealDamage(DamageType.Electricity, 2)
							]
						})
					]
				},
				{
					id: 'stormcaller-action-4',
					name: 'Storm Hammer',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.forceMovement(MovementType.Push, 2),
								// Downburst puts them on the ground; this is what the ground is for
								ActionEffects.ifTarget(TargetStateType.Prone, [
									ActionEffects.dealDamage(DamageType.Impact, 4)
								])
							]
						})
					]
				},
				{
					id: 'stormcaller-action-5',
					name: 'Gathering Front',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageBonusCondition(TraitType.Endurance, 4, DamageType.Impact)),
						ActionEffects.addCondition(ConditionLogic.createDamageBonusCondition(TraitType.Endurance, 4, DamageType.Electricity))
					]
				}
			]
		},
		{
			id: 'role-tidecaller',
			name: 'Tidecaller',
			description: 'Water goes where it is told, and then it is told to stop being water.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('tidecaller-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('tidecaller-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createSkillFeature('tidecaller-start-3', SkillType.Perception, 2),
				FeatureLogic.createProficiencyFeature('tidecaller-start-4', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('tidecaller-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('tidecaller-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('tidecaller-feature-3', DamageType.Cold, 1),
				FeatureLogic.createDamageResistFeature('tidecaller-feature-4', DamageType.Cold, 2)
			],
			actions: [
				{
					id: 'tidecaller-action-1',
					name: 'Flood',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Water)
					]
				},
				{
					id: 'tidecaller-action-2',
					name: 'Hoarfrost',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Cold, 4)
							]
						})
					]
				},
				{
					id: 'tidecaller-action-3',
					name: 'Hard Freeze',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 3, 4)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: -2,
							hit: [
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Resolve, 3))
							]
						})
					]
				},
				{
					id: 'tidecaller-action-4',
					name: 'Undertow',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 6)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.forceMovement(MovementType.Pull, 3),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'tidecaller-action-5',
					name: 'Still Water',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 2, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 4, DamageType.Fire))
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
	structures: [
		{
			id: 'structure-shipyard',
			type: StructureType.Shipyard,
			name: 'Shipyard',
			description: 'Ships built here can carry your heroes to any coast on the island.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
