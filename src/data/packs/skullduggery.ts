import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';
import { TrapType } from '../../enums/trap-type';

export const skullduggery = (): PackModel => ({
	id: 'pack_skullduggery',
	name: 'Skullduggery',
	description: 'A collection of cards for those who fight with guile rather than valor.',
	species: [
		{
			id: 'species-doppelganger',
			name: 'Doppelganger',
			description: 'A shapeshifter that can take on the appearance of others.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('doppelganger-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('doppelganger-start-2', SkillType.Presence, 3),
				FeatureLogic.createSkillFeature('doppelganger-start-3', SkillType.Stealth, 3),
				FeatureLogic.createDamageResistFeature('doppelganger-start-4', DamageType.Psychic, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('doppelganger-feature-1', TraitType.Speed, 1),
				FeatureLogic.createTraitFeature('doppelganger-feature-2', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('doppelganger-feature-3', SkillType.Presence, 3),
				FeatureLogic.createSkillFeature('doppelganger-feature-4', SkillType.Stealth, 3),
				FeatureLogic.createSkillFeature('doppelganger-feature-5', SkillType.Reactions, 2),
				FeatureLogic.createDamageBonusFeature('doppelganger-feature-6', DamageType.Psychic, 2)
			],
			actions: [
				{
					id: 'doppelganger-action-1',
					name: 'Wear Your Face',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.hide(),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Speed, 4, SkillType.Stealth)),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'doppelganger-action-2',
					name: 'Not the One You Want',
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
								ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 4, SkillType.Perception))
							]
						})
					]
				},
				{
					id: 'doppelganger-action-3',
					name: 'Give It Back',
					prerequisites: [
						ActionPrerequisites.condition(TraitType.Any)
					],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.transferCondition()
					]
				},
				{
					id: 'doppelganger-action-4',
					name: 'Light Fingers',
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
								ActionEffects.steal()
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
			id: 'role-assassin',
			name: 'Assassin',
			description: 'Assassins operate from the shadows, using poison to kill.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('assassin-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('assassin-start-2', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('assassin-start-3', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('assassin-start-4', ItemProficiencyType.PairedWeapons),
				FeatureLogic.createProficiencyFeature('assassin-start-5', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('assassin-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('assassin-feature-2', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('assassin-feature-3', SkillType.Weapon, 2),
				FeatureLogic.createDamageBonusFeature('assassin-feature-4', DamageType.Poison, 2),
				FeatureLogic.createDamageBonusFeature('assassin-feature-5', DamageType.Piercing, 2),
				FeatureLogic.createDamageResistFeature('assassin-feature-6', DamageType.Poison, 3)
			],
			actions: [
				{
					id: 'assassin-action-1',
					name: 'Poison Strike',
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
								ActionEffects.dealDamage(DamageType.Poison, 2),
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Poison))
							]
						})
					]
				},
				{
					id: 'assassin-action-2',
					name: 'Into the Shadows',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.hide(),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'assassin-action-3',
					name: 'Sneak Attack',
					prerequisites: [
						ActionPrerequisites.meleeWeapon(),
						ActionPrerequisites.hidden()
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
								ActionEffects.dealWeaponDamage(2),
								ActionEffects.dealDamage(DamageType.Poison, 2),
								// The whole point of the trade
								ActionEffects.ifTarget(TargetStateType.Wounded, [
									ActionEffects.dealWeaponDamage(3)
								])
							]
						})
					]
				},
				{
					id: 'assassin-action-4',
					name: 'Garrotte',
					prerequisites: [
						ActionPrerequisites.hidden()
					],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Stealth,
							trait: TraitType.Speed,
							skillBonus: 2,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'assassin-action-5',
					name: 'Coat The Blade',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageBonusCondition(TraitType.Speed, 4, DamageType.Poison)),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'assassin-action-6',
					name: 'Cut and Run',
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
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.addMovement()
					]
				},
				{
					id: 'assassin-action-7',
					name: 'Rifle Their Pockets',
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
								ActionEffects.steal()
							]
						})
					]
				}
			]
		},
		{
			id: 'role-corsair',
			name: 'Corsair',
			description: 'A swashbuckling fighter who fights with a blade in each hand.',
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
						}),
						ActionEffects.takeAnotherAction()
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
			id: 'role-ninja',
			name: 'Ninja',
			description: 'A martial artist who hones their abilities with extreme training and self-discipline.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('ninja-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('ninja-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('ninja-start-3', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('ninja-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('ninja-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('ninja-feature-3', SkillType.Stealth, 2),
				FeatureLogic.createDamageCategoryBonusFeature('ninja-feature-4', DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'ninja-action-1',
					name: 'Roundhouse kick',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 2,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 3)
							]
						})
					]
				},
				{
					id: 'ninja-action-2',
					name: 'Flurry',
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
								ActionEffects.dealDamage(DamageType.Impact, 1)
							]
						}),
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 1)
							]
						}),
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Impact, 1)
							]
						})
					]
				},
				{
					id: 'ninja-action-3',
					name: 'Split Kick',
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
								ActionEffects.dealDamage(DamageType.Impact, 3)
							]
						})
					]
				},
				{
					id: 'ninja-action-4',
					name: 'Adrenal Boost',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 2, TraitType.Speed)),
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 2)),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 2, SkillType.Brawl)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 2, DamageCategoryType.Physical))
					]
				},
				{
					id: 'ninja-action-5',
					name: 'Smoke Bomb',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Stealth,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Endurance, 4, SkillType.Perception))
							]
						}),
						ActionEffects.toSelf([
							ActionEffects.hide()
						])
					]
				}
			]
		},
		{
			// The game has no money inside an encounter, so the Sellsword's "fights better when
			// paid" is expressed as opportunism instead: it wants targets that are already in
			// trouble, and it wants to be paid in loot
			id: 'role-sellsword',
			name: 'Sellsword',
			description: 'A mercenary soldier who fights for pay.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('sellsword-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('sellsword-start-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('sellsword-start-3', SkillType.Presence, 2),
				FeatureLogic.createProficiencyFeature('sellsword-start-4', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('sellsword-start-5', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('sellsword-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('sellsword-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('sellsword-feature-3', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('sellsword-feature-4', DamageType.Edged, 1),
				FeatureLogic.createTraitFeature('sellsword-feature-5', TraitType.Resolve, 1)
			],
			actions: [
				{
					id: 'sellsword-action-1',
					name: 'Cut Your Losses',
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
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.addMovement()
					]
				},
				{
					// A prerequisite is checked against the acting combatant before any target is
					// chosen, so "the target is wounded" can't be stated. The finisher is priced
					// with a to-hit penalty instead: heavy, and easy to waste
					id: 'sellsword-action-2',
					name: 'Finish the Job',
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
							skillBonus: -2,
							hit: [
								ActionEffects.dealWeaponDamage(2)
							]
						})
					]
				},
				{
					id: 'sellsword-action-3',
					name: 'Terms of Engagement',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 3, 4)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 4, SkillType.Weapon))
							]
						})
					]
				},
				{
					id: 'sellsword-action-4',
					name: 'Hired Steel',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 5, SkillType.Weapon))
					]
				},
				{
					id: 'sellsword-action-5',
					name: 'Take the Purse',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.steal()
							]
						})
					]
				},
				{
					id: 'sellsword-action-6',
					name: 'Form Up',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 3, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 4, SkillType.Weapon))
					]
				},
				{
					id: 'sellsword-action-7',
					name: 'Break Their Nerve',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 2, 4)
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
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-mountebank',
			name: 'Mountebank',
			description: 'Tricksters and con artists, mountebanks make valuable allies and frustrating foes.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('mountebank-start-1', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('mountebank-start-2', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('mountebank-feature-1', SkillType.Presence, 2),
				FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-2', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Corruption, 1),
				FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-3', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Energy, 1),
				FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-4', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Physical, 1)
			],
			actions: [
				{
					id: 'mountebank-action-1',
					name: 'Jinx',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 5, SkillType.All))
					]
				},
				{
					id: 'mountebank-action-2',
					name: 'Expose Weakness',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageVulnerabilityCondition(TraitType.Resolve, 5, DamageType.All))
					]
				},
				{
					id: 'mountebank-action-3',
					name: 'Roll the Dice',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.invertConditions(true),
						ActionEffects.takeAnotherAction()
					]
				}
			]
		},
		{
			id: 'background-thief',
			name: 'Thief',
			description: 'A sneak who steals, hides and disarms traps.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('thief-start-1', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('thief-start-2', SkillType.Reactions, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('thief-feature-1', SkillType.Reactions, 2),
				FeatureLogic.createSkillFeature('thief-feature-2', SkillType.Stealth, 2),
				FeatureLogic.createTraitFeature('thief-feature-3', TraitType.Speed, 1)
			],
			actions: [
				{
					id: 'thief-action-1',
					name: 'Steal',
					prerequisites: [
						ActionPrerequisites.carryingCapacity()
					],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Reactions,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.steal()
							]
						})
					]
				},
				{
					id: 'thief-action-2',
					name: 'Stake Out',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageVulnerabilityCondition(TraitType.Resolve, 5, DamageType.All))
					]
				},
				{
					id: 'thief-action-3',
					name: 'Hide',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.hide(),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'thief-action-4',
					name: 'Disarm Trap',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Traps, 1)
					],
					effects: [
						ActionEffects.disarmTrap()
					]
				}
			]
		},
		{
			id: 'background-trapper',
			name: 'Trapper',
			description: 'A hunter who sets traps and snares.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('trapper-start-1', SkillType.Perception, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('trapper-feature-1', SkillType.Perception, 2)
			],
			actions: [
				{
					id: 'trapper-action-1',
					name: 'Set Snare',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.Snare),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'trapper-action-5',
					name: 'Dig a Pit',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.Spike),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'trapper-action-6',
					name: 'Set Alarm',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.Alarm),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'trapper-action-7',
					name: 'Rig a Dart Trap',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.AcidDart),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'trapper-action-8',
					name: 'Rig a Flame Jet',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.Fire)
					]
				},
				{
					id: 'trapper-action-9',
					name: 'Open a Gas Vent',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.PoisonGas)
					]
				},
				{
					id: 'trapper-action-10',
					name: 'Cut a Frost Glyph',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.Frost)
					]
				},
				{
					id: 'trapper-action-11',
					name: 'Wire a Shock Plate',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Squares, 1)
					],
					effects: [
						ActionEffects.placeTrap(TrapType.Shock)
					]
				},
				{
					id: 'trapper-action-2',
					name: 'Spring the Trap',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Traps, 1, 5)
					],
					effects: [
						ActionEffects.springTrap()
					]
				},
				{
					id: 'trapper-action-3',
					name: 'Disarm Trap',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Traps, 1)
					],
					effects: [
						ActionEffects.disarmTrap()
					]
				},
				{
					id: 'trapper-action-4',
					name: 'Concealed Position',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 4, SkillType.Stealth)),
						ActionEffects.hide()
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
			id: 'structure-bazaar',
			type: StructureType.Bazaar,
			name: 'Bazaar',
			description: 'Every stall here remembers what you paid last season.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-counting-house',
			type: StructureType.CountingHouse,
			name: 'Counting House',
			description: 'Every region you take starts paying its dues.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-guildhall',
			type: StructureType.Guildhall,
			name: 'Guildhall',
			description: 'The guilds keep a ledger of favours owed in every port on the coast.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-intelligencer',
			type: StructureType.Intelligencer,
			name: 'Intelligencer',
			description: 'In this building, a spymaster devises schemes to undermine the enemy.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-monument',
			type: StructureType.Monument,
			name: 'Monument',
			description: 'A company with a monument is a company worth joining.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-tavern',
			type: StructureType.Tavern,
			name: 'Tavern',
			description: 'Rest, rumour and recruitment - everyone ends up here eventually.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-thief',
			type: StructureType.ThievesGuild,
			name: 'Thieves\' Guild',
			description: 'This nondescript structure houses those who utilize every possible advantage.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
