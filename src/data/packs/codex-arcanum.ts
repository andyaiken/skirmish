import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
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
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { SummonType } from '../../enums/summon-type';
import { TraitType } from '../../enums/trait-type';
import { TrapType } from '../../enums/trap-type';

export const codexArcanum = (): PackModel => ({
	id: 'pack_codex_arcanum',
	name: 'Codex Arcanum',
	description: 'Discover new ways to channel and manipulate magic with the cards in this pack.',
	species: [
		{
			id: 'species-golem',
			name: 'Golem',
			description: 'Stone and baked clay in the shape of a man, with nothing behind the eyes.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Mindless
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('golem-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('golem-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('golem-start-3', DamageCategoryType.Physical, 1),
				FeatureLogic.createDamageResistFeature('golem-start-4', DamageType.Psychic, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('golem-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('golem-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('golem-feature-3', DamageType.Impact, 2),
				FeatureLogic.createDamageCategoryResistFeature('golem-feature-4', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'golem-action-1',
					name: 'Slam',
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
								ActionEffects.forceMovement(MovementType.Push, 1)
							]
						})
					]
				},
				{
					id: 'golem-action-2',
					name: 'Topple',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'golem-action-3',
					name: 'Grind Onward',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 4, DamageCategoryType.Physical)),
						ActionEffects.addMovement()
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
				QuirkType.Drone,
				QuirkType.Small
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('homunculus-start-1', TraitType.Speed, 2),
				FeatureLogic.createSkillFeature('homunculus-start-2', SkillType.Brawl, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('homunculus-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('homunculus-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('homunculus-feature-3', DamageType.Acid, 2),
				FeatureLogic.createSkillFeature('homunculus-feature-4', SkillType.Stealth, 2)
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
		},
		{
			id: 'species-living-spell',
			name: 'Living Spell',
			description: 'A spell that went wrong and gained sentience.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('living-spell-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('living-spell-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('living-spell-start-3', DamageType.Psychic, 2),
				FeatureLogic.createDamageResistFeature('living-spell-start-4', DamageType.Psychic, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('living-spell-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('living-spell-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('living-spell-feature-3', DamageType.Psychic, 2),
				FeatureLogic.createAuraDamageFeature('living-spell-feature-4', ConditionType.AutoDamage, DamageType.Psychic, 1)
			],
			actions: [
				{
					id: 'living-spell-action-1',
					name: 'Mind Flense',
					prerequisites: [],
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
								ActionEffects.dealDamage(DamageType.Psychic, 4)
							]
						})
					]
				},
				{
					id: 'living-spell-action-2',
					name: 'Unravel',
					prerequisites: [],
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
								ActionEffects.dealDamage(DamageType.Psychic, 2),
								ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 4, SkillCategoryType.Mental)),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 3, TraitType.Resolve))
							]
						})
					]
				},
				{
					id: 'living-spell-action-3',
					name: 'Sympathetic Wound',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 2, 6)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Psychic, 1),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Resolve, 4, DamageCategoryType.Energy))
							]
						})
					]
				},
				{
					id: 'living-spell-action-4',
					name: 'Turn Inward',
					prerequisites: [],
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
								ActionEffects.invertConditions(false)
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
			id: 'role-enchanter',
			name: 'Enchanter',
			description: 'Spellcasters who specialize in magic that confuses the senses.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('enchanter-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('enchanter-start-2', SkillType.Spellcasting, 3),
				FeatureLogic.createProficiencyFeature('enchanter-start-3', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('enchanter-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('enchanter-feature-2', SkillType.Spellcasting, 3),
				FeatureLogic.createDamageBonusFeature('enchanter-feature-3', DamageType.Psychic, 2),
				FeatureLogic.createDamageResistFeature('enchanter-feature-4', DamageType.Psychic, 2)
			],
			actions: [
				{
					id: 'enchanter-action-1',
					name: 'Hypnotic Suggestion',
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
								ActionEffects.commandAction()
							]
						})
					]
				},
				{
					id: 'enchanter-action-2',
					name: 'Bewilder',
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
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'enchanter-action-3',
					name: 'Induce Fear',
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
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 5, TraitType.Speed))
							]
						})
					]
				},
				{
					id: 'enchanter-action-4',
					name: 'Intellect Shield',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Corruption))
					]
				},
				{
					id: 'enchanter-action-5',
					name: 'Weaken',
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
								ActionEffects.addCondition(ConditionLogic.createDamagePenaltyCondition(TraitType.Endurance, 5, DamageType.All))
							]
						})
					]
				},
				{
					id: 'enchanter-action-6',
					name: 'Cloak',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.hide()
					]
				},
				{
					id: 'enchanter-action-7',
					name: 'Sympathetic Affliction',
					prerequisites: [
						ActionPrerequisites.condition(TraitType.Any)
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.transferCondition(),
						ActionEffects.takeAnotherAction()
					]
				}
			]
		},
		{
			id: 'role-geomancer',
			name: 'Geomancer',
			description: 'Spellcasters whose magic affects the battlefield itself.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('geomancer-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('geomancer-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('geomancer-start-3', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('geomancer-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('geomancer-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createAuraFeature('geomancer-feature-3', ConditionType.MovementBonus, 1),
				FeatureLogic.createAuraFeature('geomancer-feature-4', ConditionType.MovementPenalty, 1)
			],
			actions: [
				{
					id: 'geomancer-action-1',
					name: 'Obstruct Terrain',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Obstructed),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'geomancer-action-2',
					name: 'Clear Terrain',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.createTerrain(EncounterMapSquareType.Clear),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'geomancer-action-3',
					name: 'Destroy Ground',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 10)
					],
					effects: [
						ActionEffects.removeSquares(),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'geomancer-action-4',
					name: 'Raze',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Walls, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.addSquares()
					]
				},
				{
					id: 'geomancer-action-5',
					name: 'Quagmire',
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
					id: 'geomancer-action-6',
					name: 'Hurl Stone',
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
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.knockDown()
							]
						})
					]
				}
			]
		},
		{
			id: 'role-psion',
			name: 'Psion',
			description: 'A master of the power of the mind.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('psion-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('psion-start-2', SkillType.Presence, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('psion-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('psion-feature-2', SkillType.Presence, 3),
				FeatureLogic.createDamageBonusFeature('psion-feature-3', DamageType.Psychic, 2),
				FeatureLogic.createDamageResistFeature('psion-feature-4', DamageType.Psychic, 2)
			],
			actions: [
				{
					id: 'psion-action-1',
					name: 'Bend Allegiance',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
					],
					effects: [
						ActionEffects.commandAction()
					]
				},
				{
					id: 'psion-action-2',
					name: 'Psychic Feedback',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Combatants, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'psion-action-3',
					name: 'Psychic Barrage',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Psychic, 4)
							]
						})
					]
				},
				{
					id: 'psion-action-4',
					name: 'Enervate',
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
								ActionEffects.addCondition(ConditionLogic.createDamagePenaltyCondition(TraitType.Resolve, 6, DamageType.All))
							]
						})
					]
				},
				{
					id: 'psion-action-5',
					name: 'Mental Assault',
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
								ActionEffects.dealDamage(DamageType.Psychic, 5)
							]
						})
					]
				},
				{
					id: 'psion-action-6',
					name: 'Mind Over Body',
					prerequisites: [
						ActionPrerequisites.wound()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healWounds(1)
					]
				}
			]
		},
		{
			id: 'role-warmage',
			name: 'Warmage',
			description: 'A warrior who bridges martial discipline and arcane power.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('warmage-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('warmage-start-2', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('warmage-start-3', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('warmage-start-4', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('warmage-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('warmage-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-3', DamageCategoryType.Energy, 1),
				FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-4', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'warmage-action-1',
					name: 'Flaming Blade',
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
								ActionEffects.dealDamage(DamageType.Fire, 2),
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 5, DamageType.Fire))
							]
						})
					]
				},
				{
					id: 'warmage-action-2',
					name: 'Frost Blade',
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
								ActionEffects.dealDamage(DamageType.Cold, 2),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
							]
						})
					]
				},
				{
					id: 'warmage-action-3',
					name: 'Shocking Blade',
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
								ActionEffects.dealDamage(DamageType.Electricity, 2),
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'warmage-action-4',
					name: 'Armor Enhancement',
					prerequisites: [
						ActionPrerequisites.armor()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Physical)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Energy))
					]
				},
				{
					id: 'warmage-action-5',
					name: 'Arcane Whip',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.forceMovement(MovementType.Pull, 3)
							]
						})
					]
				}
			]
		}
	],
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
		},
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
					name: 'Scribe a Scroll of Compulsion',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-compulsion')
					]
				},
				{
					id: 'scribe-action-4',
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
					id: 'scribe-action-5',
					name: 'Scribe a Scroll of Frost',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-frost')
					]
				},
				{
					id: 'scribe-action-6',
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
					id: 'scribe-action-7',
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
					id: 'scribe-action-8',
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
					id: 'scribe-action-9',
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
					id: 'scribe-action-10',
					name: 'Scribe a Scroll of Snares',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-snares')
					]
				},
				{
					id: 'scribe-action-11',
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
					id: 'scribe-action-12',
					name: 'Scribe a Scroll of Thunder',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.createScroll('scroll-thunder')
					]
				},
				{
					id: 'scribe-action-13',
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
	potions: [
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
		}
	],
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
			id: 'scroll-compulsion',
			name: 'Scroll of Compulsion',
			description: 'A page written in the second person, in a hand you half recognise.',
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
					id: 'scroll-action-compulsion',
					name: 'Scroll of Compulsion',
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
								ActionEffects.commandMove()
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
			id: 'scroll-frost',
			name: 'Scroll of Frost',
			description: 'A stiff sheet of vellum that never quite thaws.',
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
					id: 'scroll-action-frost',
					name: 'Scroll of Frost',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.dealDamage(DamageType.Cold, 3),
						ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Speed))
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
			description: 'It names one place, in the confident expectation that you are standing in it.',
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
			id: 'scroll-snares',
			name: 'Scroll of Snares',
			description: 'A page of knotwork that is unpleasant to follow with the eye.',
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
					id: 'scroll-action-snares',
					name: 'Scroll of Snares',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 3, 4)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.Snare)
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
			id: 'scroll-thunder',
			name: 'Scroll of Thunder',
			description: 'A sheet of vellum that rattles in a still room.',
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
					id: 'scroll-action-thunder',
					name: 'Scroll of Thunder',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.dealDamage(DamageType.Sonic, 3),
						ActionEffects.forceMovement(MovementType.Push, 3),
						ActionEffects.knockDown()
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
			id: 'structure-observatory',
			type: StructureType.Observatory,
			name: 'Observatory',
			description: 'By observing the stars, an astrologer can sometimes manipulate the fates.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
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
