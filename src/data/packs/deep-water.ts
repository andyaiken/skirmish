import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TraitType } from '../../enums/trait-type';

export const deepWater = (): PackModel => ({
	id: 'pack-deep-water',
	name: 'Deep Water',
	description: 'There are uncountable things that live in the depths.',
	species: [
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
			id: 'species-draugr',
			name: 'Draugr',
			description: 'Drowned, but disinclined to stay dead.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Undead,
				QuirkType.Aquatic
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('draugr-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('draugr-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('draugr-start-3', DamageType.Decay, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('draugr-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('draugr-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('draugr-feature-3', DamageType.Cold, 1)
			],
			actions: [
				{
					id: 'draugr-action-1',
					name: 'Grave-Cold Grip',
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
								ActionEffects.dealDamage(DamageType.Cold, 3)
							]
						})
					]
				},
				{
					id: 'draugr-action-2',
					name: 'Rotting Touch',
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
								ActionEffects.dealDamage(DamageType.Decay, 3)
							]
						})
					]
				},
				{
					id: 'draugr-action-3',
					name: 'Drag Them Down',
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
								ActionEffects.forceMovement(MovementType.Pull, 2),
								ActionEffects.knockDown()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-giant-crab',
			name: 'Giant Crab',
			description: 'A slab of shell with a temper and two enormous claws.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [
				QuirkType.Beast,
				QuirkType.Aquatic
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('giant-crab-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('giant-crab-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('giant-crab-start-3', DamageCategoryType.Physical, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('giant-crab-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('giant-crab-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('giant-crab-feature-3', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'giant-crab-action-1',
					name: 'Claw',
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
								ActionEffects.dealDamage(DamageType.Edged, 3)
							]
						})
					]
				},
				{
					id: 'giant-crab-action-2',
					name: 'Crush',
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
					id: 'giant-crab-action-3',
					name: 'Seize and Hold',
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
								ActionEffects.disarm(),
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 3))
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
	backgrounds: [],
	items: [],
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
