import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { PackModel } from '../../models/pack';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TraitType } from '../../enums/trait-type';

export const guileAndCunning = (): PackModel => ({
	id: 'pack-guile-and-cunning',
	name: 'Guile and Cunning',
	description: 'A collection of cards for those who fight with skullduggery rather than valor.',
	species: [
		{
			id: 'species-doppelganger',
			name: 'Doppelganger',
			description: 'It wears the face of someone you trust, and it wants what they have.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createSkillFeature('doppelganger-start-1', SkillType.Stealth, 3),
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
			id: 'species-cutthroat',
			name: 'Cutthroat',
			description: 'A killer for hire, paid up front and in no hurry to be seen.',
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
								ActionEffects.dealDamage(DamageType.Poison, 2)
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
				}
			]
		}
	],
	items: [],
	potions: [],
	structures: [
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
