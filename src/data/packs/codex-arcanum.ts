import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TraitType } from '../../enums/trait-type';

export const codexArcanum = (): PackModel => ({
	id: 'pack-codex-arcanum',
	name: 'Codex Arcanum',
	description: 'Discover new ways to channel magic with the cards in this pack.',
	species: [
		{
			id: 'species-animated-object',
			name: 'Animated Object',
			description: 'A walking statue, or a suit of armour with no-one inside it.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Mindless,
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('animated-object-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('animated-object-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('animated-object-start-3', DamageCategoryType.Physical, 1),
				FeatureLogic.createDamageResistFeature('animated-object-start-4', DamageType.Psychic, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('animated-object-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('animated-object-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('animated-object-feature-3', DamageType.Impact, 2),
				FeatureLogic.createDamageCategoryResistFeature('animated-object-feature-4', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'animated-object-action-1',
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
					id: 'animated-object-action-2',
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
					id: 'animated-object-action-3',
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
			id: 'species-arcane-aberration',
			name: 'Arcane Aberration',
			description: 'A spell that went wrong and never stopped.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('arcane-aberration-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('arcane-aberration-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('arcane-aberration-start-3', DamageType.Psychic, 2),
				FeatureLogic.createDamageResistFeature('arcane-aberration-start-4', DamageType.Psychic, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('arcane-aberration-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('arcane-aberration-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('arcane-aberration-feature-3', DamageType.Psychic, 2),
				FeatureLogic.createAuraDamageFeature('arcane-aberration-feature-4', ConditionType.AutoDamage, DamageType.Psychic, 1)
			],
			actions: [
				{
					id: 'arcane-aberration-action-1',
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
					id: 'arcane-aberration-action-2',
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
					id: 'arcane-aberration-action-3',
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
					id: 'arcane-aberration-action-4',
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
				FeatureLogic.createSkillFeature('enchanter-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('enchanter-start-3', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('enchanter-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('enchanter-feature-2', SkillType.Spellcasting, 2),
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
						ActionEffects.createTerrain(EncounterMapSquareType.Obstructed)
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
						ActionEffects.createTerrain(EncounterMapSquareType.Clear)
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
						ActionEffects.removeSquares()
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
					name: 'Earthbind',
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
					name: 'Rockblast',
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
				FeatureLogic.createSkillFeature('psion-start-2', SkillType.Presence, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('psion-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('psion-feature-2', SkillType.Presence, 2),
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
					name: 'Dishearten',
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
			id: 'background-mystic',
			name: 'Mystic',
			description: 'Mystics are the masters of the arcane arts.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillFeature('mystic-feature-1', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-2', DamageCategoryType.Energy, 1),
				FeatureLogic.createDamageCategoryResistFeature('mystic-feature-3', DamageCategoryType.Energy, 1),
				FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-4', DamageCategoryType.Corruption, 1),
				FeatureLogic.createDamageCategoryResistFeature('mystic-feature-5', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'mystic-action-1',
					name: 'Confusion',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.commandAction()
					]
				},
				{
					id: 'mystic-action-2',
					name: 'Sympathetic Affliction',
					prerequisites: [
						ActionPrerequisites.condition(TraitType.Any)
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.transferCondition()
					]
				},
				{
					id: 'mystic-action-3',
					name: 'Eldritch Reversal',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Combatants, 1, 5)
					],
					effects: [
						ActionEffects.invertConditions(false)
					]
				}
			]
		}
	],
	items: [],
	potions: [],
	scrolls: [],
	structures: [
		{
			id: 'structure-observatory',
			type: StructureType.Observatory,
			name: 'Observatory',
			description: 'By observing the stars, an astrologer can sometimes manipulate the fates.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
