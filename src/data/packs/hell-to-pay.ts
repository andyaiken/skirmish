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
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';

export const hellToPay = (): PackModel => ({
	id: 'pack-hell-to-pay',
	name: 'Hell to Pay',
	description: 'Power is available ... on generous terms.',
	species: [
		{
			id: 'species-cambion',
			name: 'Cambion',
			description: 'The child of a demonic bargain.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('cambion-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('cambion-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryBonusFeature('cambion-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('cambion-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('cambion-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageResistFeature('cambion-feature-3', DamageType.Fire, 1),
				FeatureLogic.createDamageCategoryResistFeature('cambion-feature-4', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'cambion-action-1',
					name: 'Hellfire',
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
								ActionEffects.dealDamage(DamageType.Fire, 3)
							]
						})
					]
				},
				{
					id: 'cambion-action-2',
					name: 'Baleful Glare',
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
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Resolve))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-fiend',
			name: 'Fiend',
			description: 'A greater devil, and entirely aware of its rank.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('fiend-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('fiend-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('fiend-start-3', DamageType.Fire, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('fiend-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('fiend-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('fiend-feature-3', DamageType.Fire, 2),
				FeatureLogic.createDamageCategoryResistFeature('fiend-feature-4', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'fiend-action-1',
					name: 'Rend',
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
								ActionEffects.dealDamage(DamageType.Edged, 3),
								ActionEffects.dealDamage(DamageType.Fire, 1)
							]
						})
					]
				},
				{
					id: 'fiend-action-2',
					name: 'Breath of the Pit',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Fire, 3)
							]
						})
					]
				},
				{
					id: 'fiend-action-3',
					name: 'Terms of the Contract',
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
								ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 4, SkillCategoryType.Mental))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-hellhound',
			name: 'Hellhound',
			description: 'It was a dog once, in the way that ash was once wood.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Beast
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('hellhound-start-1', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('hellhound-start-2', TraitType.Speed, 1),
				FeatureLogic.createDamageBonusFeature('hellhound-start-3', DamageType.Fire, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('hellhound-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('hellhound-feature-2', TraitType.Speed, 1),
				FeatureLogic.createDamageResistFeature('hellhound-feature-3', DamageType.Fire, 2)
			],
			actions: [
				{
					id: 'hellhound-action-1',
					name: 'Searing Bite',
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
								ActionEffects.dealDamage(DamageType.Piercing, 3),
								ActionEffects.dealDamage(DamageType.Fire, 1)
							]
						})
					]
				},
				{
					id: 'hellhound-action-2',
					name: 'Run It Down',
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
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.knockDown()
							]
						}),
						ActionEffects.addMovement()
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-imp-swarm',
			name: 'Imp Swarm',
			description: 'Individually negligible, but never encountered individually.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [
				QuirkType.Swarm
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('imp-swarm-start-1', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('imp-swarm-start-2', TraitType.Speed, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('imp-swarm-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('imp-swarm-feature-2', TraitType.Speed, 1),
				FeatureLogic.createDamageBonusFeature('imp-swarm-feature-3', DamageType.Decay, 1)
			],
			actions: [
				{
					id: 'imp-swarm-action-1',
					name: 'Claw and Bite',
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
								ActionEffects.dealDamage(DamageType.Piercing, 2),
								ActionEffects.dealDamage(DamageType.Decay, 1)
							]
						})
					]
				},
				{
					id: 'imp-swarm-action-2',
					name: 'Petty Torment',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 4))
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
			id: 'role-lifestealer',
			name: 'Lifestealer',
			description: 'Lifestealers take what other people have, and wear it for as long as it lasts.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('lifestealer-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('lifestealer-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('lifestealer-start-3', ItemProficiencyType.Implements),
				FeatureLogic.createDamageBonusFeature('lifestealer-start-4', DamageType.Decay, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('lifestealer-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('lifestealer-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createTraitFeature('lifestealer-feature-3', TraitType.Endurance, 1),
				FeatureLogic.createDamageCategoryResistFeature('lifestealer-feature-4', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'lifestealer-action-1',
					name: 'Siphon',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Decay, 3),
								ActionEffects.toSelf([
									ActionEffects.healDamage(4)
								])
							]
						})
					]
				},
				{
					id: 'lifestealer-action-2',
					name: 'Sap Will',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Resolve)),
								ActionEffects.toSelf([
									ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 4, TraitType.Resolve))
								])
							]
						})
					]
				},
				{
					id: 'lifestealer-action-3',
					name: 'Drain Vigour',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Endurance)),
								ActionEffects.toSelf([
									ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 4, TraitType.Endurance)),
									ActionEffects.healDamage(3)
								])
							]
						})
					]
				},
				{
					id: 'lifestealer-action-4',
					name: 'Rot',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 4, DamageType.Decay)))
							]
						})
					]
				},
				{
					id: 'lifestealer-action-5',
					name: 'Feast',
					prerequisites: [
						ActionPrerequisites.implement(),
						ActionPrerequisites.wound()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Decay, 4),
								ActionEffects.toSelf([
									ActionEffects.healWounds(1)
								])
							]
						})
					]
				}
			]
		},
		{
			id: 'role-tormentor',
			name: 'Tormentor',
			description: 'Tormentors drag their debtors close, and make sure that nobody leaves early.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('tormentor-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('tormentor-start-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('tormentor-start-3', SkillType.Presence, 2),
				FeatureLogic.createProficiencyFeature('tormentor-start-4', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('tormentor-start-5', ItemProficiencyType.HeavyArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('tormentor-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('tormentor-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('tormentor-feature-3', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryBonusFeature('tormentor-feature-4', DamageCategoryType.Corruption, 1),
				FeatureLogic.createAuraFeature('tormentor-feature-5', ConditionType.MovementPenalty, 1)
			],
			actions: [
				{
					id: 'tormentor-action-1',
					name: 'Hooked Chain',
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
								ActionEffects.forceMovement(MovementType.Pull, 2)
							]
						})
					]
				},
				{
					id: 'tormentor-action-2',
					name: 'Bind in Chains',
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
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Resolve, 5))
							]
						})
					]
				},
				{
					id: 'tormentor-action-3',
					name: 'Break Their Grip',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
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
								ActionEffects.disarm()
							]
						})
					]
				},
				{
					id: 'tormentor-action-4',
					name: 'Make an Example',
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
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Resolve))
							]
						})
					]
				},
				{
					id: 'tormentor-action-5',
					name: 'The Reckoning',
					prerequisites: [
						ActionPrerequisites.meleeWeapon(),
						ActionPrerequisites.damage()
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
							skillBonus: 2,
							hit: [
								ActionEffects.dealWeaponDamage(1)
							]
						})
					]
				}
			]
		},
		{
			id: 'role-warlock',
			name: 'Warlock',
			description: 'Warlocks, having made a bargain they cannot break, pay for every casting in their own blood.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('warlock-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('warlock-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('warlock-start-3', ItemProficiencyType.Implements),
				FeatureLogic.createDamageCategoryBonusFeature('warlock-start-4', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('warlock-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('warlock-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('warlock-feature-3', DamageType.Decay, 1),
				FeatureLogic.createDamageCategoryResistFeature('warlock-feature-4', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'warlock-action-1',
					name: 'Eldritch Lash',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Decay, 3)
							]
						})
					]
				},
				{
					id: 'warlock-action-2',
					name: 'Strike the Bargain',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.inflictWounds(1),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 6, DamageCategoryType.Corruption))
					]
				},
				{
					id: 'warlock-action-3',
					name: 'Withering Hex',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Endurance)),
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Resolve, 3, DamageType.Decay)))
							]
						})
					]
				},
				{
					id: 'warlock-action-4',
					name: 'Blood Price',
					prerequisites: [
						ActionPrerequisites.implement(),
						ActionPrerequisites.damage()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.transferCondition()
					]
				},
				{
					id: 'warlock-action-5',
					name: 'Dread Aspect',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: -2,
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
			id: 'background-cultist',
			name: 'Cultist',
			description: 'A devotee of something that should not be named, much less worshipped.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('cultist-start-1', TraitType.Resolve, 1),
				FeatureLogic.createDamageCategoryResistFeature('cultist-start-2', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('cultist-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createDamageCategoryResistFeature('cultist-feature-2', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'cultist-action-1',
					name: 'Fervent Chant',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 3)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 4, DamageCategoryType.Corruption))
					]
				},
				{
					id: 'cultist-action-2',
					name: 'Willing Sacrifice',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
					],
					effects: [
						ActionEffects.toSelf([
							ActionEffects.inflictWounds(1)
						]),
						ActionEffects.healDamage(4)
					]
				},
				{
					id: 'cultist-action-3',
					name: 'Whispered Doubt',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 4)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 4, SkillCategoryType.Mental))
							]
						})
					]
				}
			]
		}
	],
	items: [],
	potions: [],
	scrolls: [],
	structures: []
});
