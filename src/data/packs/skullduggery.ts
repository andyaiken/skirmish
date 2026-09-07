import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { PackModel } from '../../models/pack';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';
import { TrapType } from '../../enums/trap-type';

export const skullduggery = (): PackModel => ({
	id: 'pack-skullduggery',
	name: 'Skullduggery',
	description: 'A collection of cards for those who fight with guile rather than valor.',
	species: [
		{
			id: 'species-brigand',
			name: 'Brigand',
			description: 'Someone who decided that other people\'s property was a career.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('brigand-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('brigand-start-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('brigand-start-3', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('brigand-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('brigand-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('brigand-feature-3', SkillType.Stealth, 2)
			],
			actions: [
				{
					id: 'brigand-action-1',
					name: 'Ambush',
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
							skillBonus: 2,
							hit: [
								ActionEffects.dealWeaponDamage(1)
							]
						})
					]
				},
				{
					id: 'brigand-action-2',
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
					id: 'brigand-action-3',
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
			],
			deathActions: []
		},
		{
			id: 'species-changeling',
			name: 'Changeling',
			description: 'Left in a cradle in place of someone else, and never once corrected the mistake.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('changeling-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('changeling-start-2', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('changeling-start-3', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('changeling-feature-1', TraitType.Speed, 1),
				FeatureLogic.createTraitFeature('changeling-feature-2', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('changeling-feature-3', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('changeling-feature-4', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('changeling-feature-5', SkillType.Reactions, 2)
			],
			actions: [
				{
					id: 'changeling-action-1',
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
					id: 'changeling-action-2',
					name: 'Second Face',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						// Becoming someone else sheds whatever was done to the last one
						ActionEffects.removeCondition(TraitType.Any),
						ActionEffects.hide()
					]
				},
				{
					id: 'changeling-action-3',
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
				}
			],
			deathActions: []
		},
		{
			id: 'species-cutthroat',
			name: 'Cutthroat',
			description: 'A killer for hire, paid up front.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createSkillFeature('cutthroat-start-1', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('cutthroat-start-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageBonusFeature('cutthroat-start-3', DamageType.Poison, 2),
				FeatureLogic.createTraitFeature('cutthroat-start-4', TraitType.Speed, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('cutthroat-feature-1', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('cutthroat-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageBonusFeature('cutthroat-feature-3', DamageType.Piercing, 2),
				FeatureLogic.createDamageResistFeature('cutthroat-feature-4', DamageType.Poison, 3)
			],
			actions: [
				{
					id: 'cutthroat-action-1',
					name: 'Coated Blade',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 2),
								ActionEffects.dealDamage(DamageType.Poison, 2),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 3, TraitType.Endurance))
							]
						})
					]
				},
				{
					id: 'cutthroat-action-2',
					name: 'Into The Shadows',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.hide(),
						ActionEffects.addMovement()
					]
				},
				{
					id: 'cutthroat-action-3',
					name: 'From Behind',
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
								ActionEffects.dealDamage(DamageType.Piercing, 5),
								ActionEffects.inflictWounds(1)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-doppelganger',
			name: 'Doppelganger',
			description: 'It wears the face of someone you trust.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createSkillFeature('doppelganger-start-1', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('doppelganger-start-2', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('doppelganger-start-3', TraitType.Speed, 1),
				FeatureLogic.createDamageResistFeature('doppelganger-start-4', DamageType.Psychic, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('doppelganger-feature-1', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('doppelganger-feature-2', SkillType.Presence, 2),
				FeatureLogic.createTraitFeature('doppelganger-feature-3', TraitType.Speed, 1),
				FeatureLogic.createDamageBonusFeature('doppelganger-feature-4', DamageType.Psychic, 2)
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
				},
				{
					id: 'doppelganger-action-3',
					name: 'Turn The Blade',
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
								ActionEffects.disarm(),
								ActionEffects.dealDamage(DamageType.Impact, 1)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-mercenary-captain',
			name: 'Mercenary Captain',
			description: 'Their company has a banner, a paymaster, and a list of work it will not take.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('mercenary-captain-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('mercenary-captain-start-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('mercenary-captain-start-3', SkillType.Presence, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('mercenary-captain-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('mercenary-captain-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('mercenary-captain-feature-3', SkillType.Presence, 2)
			],
			actions: [
				{
					id: 'mercenary-captain-action-1',
					name: 'Veteran\'s Cut',
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
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(1)
							]
						})
					]
				},
				{
					id: 'mercenary-captain-action-2',
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
					id: 'mercenary-captain-action-3',
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
				FeatureLogic.createProficiencyFeature('assassin-start-4', ItemProficiencyType.PairedWeapons)
			],
			features: [
				FeatureLogic.createTraitFeature('assassin-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('assassin-feature-2', SkillType.Stealth, 2),
				FeatureLogic.createSkillFeature('assassin-feature-3', SkillType.Weapon, 2),
				FeatureLogic.createDamageBonusFeature('assassin-feature-4', DamageType.Poison, 2)
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
					name: 'Vanish',
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
				}
			]
		},
		{
			// The game has no money inside an encounter, so the Sellsword's "fights better when
			// paid" is expressed as opportunism instead: it wants targets that are already in
			// trouble, and it wants to be paid in loot
			id: 'role-sellsword',
			name: 'Sellsword',
			description: 'Asks what the work pays before asking what it is.',
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
				FeatureLogic.createDamageBonusFeature('sellsword-feature-4', DamageType.Edged, 1)
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
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-mountebank',
			name: 'Mountebank',
			description: 'Tricksters and con artists, mountebanks make valuable allies and frustrating foes.',
			startingFeatures: [],
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
						ActionEffects.invertConditions(true)
					]
				}
			]
		},
		{
			id: 'background-negotiator',
			name: 'Negotiator',
			description: 'Comes to a battle carrying terms rather than a weapon.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('negotiator-start-1', SkillType.Presence, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('negotiator-feature-1', SkillType.Presence, 2),
				FeatureLogic.createTraitFeature('negotiator-feature-2', TraitType.Resolve, 1)
			],
			actions: [
				{
					id: 'negotiator-action-1',
					name: 'Parley',
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
					id: 'negotiator-action-2',
					name: 'Reassess',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Any)
					]
				},
				{
					id: 'negotiator-action-3',
					name: 'Read the Room',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.scan(),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 4, SkillType.Presence))
					]
				}
			]
		},
		{
			id: 'background-thief',
			name: 'Thief',
			description: 'Never put your trust in a thief, even when they\'re on your side.',
			startingFeatures: [],
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
			description: 'The trapper knows where to put a snare.',
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
