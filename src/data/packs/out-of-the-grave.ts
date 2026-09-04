import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition-logic';
import { ConditionType } from '../../enums/condition-type';
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

export const outOfTheGrave = (): PackModel => ({
	id: 'pack-out-of-the-grave',
	name: 'Out of the Grave',
	description: 'Add a touch of gothic horror to your game with this pack.',
	species: [
		{
			id: 'species-skeleton',
			name: 'Skeleton',
			description: 'Re-animated bones.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Undead
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('skeleton-start-1', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('skeleton-start-2', DamageType.Piercing, 2),
				FeatureLogic.createDamageCategoryResistFeature('skeleton-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('skeleton-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('skeleton-feature-2', DamageType.Piercing, 2),
				FeatureLogic.createDamageCategoryResistFeature('skeleton-feature-3', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'skeleton-action-1',
					name: 'Bash',
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
								ActionEffects.dealDamage(DamageType.Decay, 2)
							]
						})
					]
				},
				{
					id: 'skeleton-action-2',
					name: 'Reassemble',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healDamage(3),
						ActionEffects.healWounds(1)
					]
				},
				{
					id: 'skeleton-action-3',
					name: 'Boneshard',
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
								ActionEffects.dealDamage(DamageType.Decay, 2)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-vampire',
			name: 'Vampire',
			description: 'The blood is the life.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Undead
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('vampire-start-1', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('vampire-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('vampire-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('vampire-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('vampire-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('vampire-feature-3', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'vampire-action-1',
					name: 'Speed Of The Grave',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.BesideTarget, 0),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'vampire-action-2',
					name: 'Vampiric Bite',
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
								ActionEffects.dealDamage(DamageType.Piercing, 1),
								ActionEffects.dealDamage(DamageType.Decay, 1),
								ActionEffects.toSelf([
									ActionEffects.healDamage(1),
									ActionEffects.healWounds(1)
								])
							]
						})
					]
				},
				{
					id: 'vampire-action-3',
					name: 'Mesmerize',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
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
		},
		{
			id: 'species-wraith',
			name: 'Wraith',
			description: 'A floating, spectral apparition.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Undead,
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('wraith-start-1', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('wraith-start-2', DamageCategoryType.Corruption, 1),
				FeatureLogic.createTraitFeature('wraith-start-3', TraitType.Resolve, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('wraith-feature-1', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('wraith-feature-2', DamageCategoryType.Corruption, 1),
				FeatureLogic.createTraitFeature('wraith-feature-3', TraitType.Resolve, 1)
			],
			actions: [
				{
					id: 'wraith-action-1',
					name: 'Spectral Visage',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.forceMovement(MovementType.Push, 1),
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'wraith-action-2',
					name: 'Life Drain',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Decay, 2),
								ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 3, SkillCategoryType.Mental)),
								ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 3, SkillCategoryType.Physical))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-zombie',
			name: 'Zombie',
			description: 'A re-animated corpse.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Mindless,
				QuirkType.Undead
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('zombie-start-1', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('zombie-start-2', DamageCategoryType.Corruption, 1),
				FeatureLogic.createTraitFeature('zombie-start-3', TraitType.Endurance, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('zombie-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('zombie-feature-2', DamageCategoryType.Corruption, 1),
				FeatureLogic.createTraitFeature('zombie-feature-3', TraitType.Endurance, 1)
			],
			actions: [
				{
					id: 'zombie-action-1',
					name: 'Rend',
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
								ActionEffects.dealDamage(DamageType.Piercing, 2),
								ActionEffects.dealDamage(DamageType.Decay, 2)
							]
						})
					]
				},
				{
					id: 'zombie-action-2',
					name: 'Grave Rot',
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
								ActionEffects.dealDamage(DamageType.Decay, 3),
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Decay))),
								ActionEffects.toSelf([
									ActionEffects.healDamage(1)
								])
							]
						})
					]
				}
			],
			deathActions: [
				{
					id: 'zombie-action-3',
					name: 'Rot Burst',
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
								ActionEffects.dealDamage(DamageType.Decay, 3),
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Decay)))
							]
						})
					]
				}
			]
		}
	],
	roles: [
		{
			id: 'role-necromancer',
			name: 'Necromancer',
			description: 'A spellcaster whose magic deals with life and death.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('necromancer-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('necromancer-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('necromancer-start-3', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('necromancer-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('necromancer-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createAuraDamageFeature('necromancer-feature-3', ConditionType.AutoDamage, DamageType.Decay, 1),
				FeatureLogic.createDamageBonusFeature('necromancer-feature-4', DamageType.Decay, 2)
			],
			actions: [
				{
					id: 'necromancer-action-1',
					name: 'Transfer Damage',
					prerequisites: [
						ActionPrerequisites.implement(),
						ActionPrerequisites.damage()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.dealDamage(DamageType.Decay, 3),
						ActionEffects.toSelf([
							ActionEffects.healDamage(3)
						])
					]
				},
				{
					id: 'necromancer-action-2',
					name: 'Transfer Wounds',
					prerequisites: [
						ActionPrerequisites.implement(),
						ActionPrerequisites.wound()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.inflictWounds(1),
						ActionEffects.toSelf([
							ActionEffects.healWounds(1)
						])
					]
				},
				{
					id: 'necromancer-action-3',
					name: 'Accept Damage',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.healDamage(3),
						ActionEffects.toSelf([
							ActionEffects.dealDamage(DamageType.Decay, 3)
						])
					]
				},
				{
					id: 'necromancer-action-4',
					name: 'Accept Wounds',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.healWounds(1),
						ActionEffects.toSelf([
							ActionEffects.inflictWounds(1)
						])
					]
				},
				{
					id: 'necromancer-action-5',
					name: 'Strength from Pain',
					prerequisites: [
						ActionPrerequisites.implement(),
						ActionPrerequisites.damage()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.healDamage(3),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Endurance)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Resolve))
					]
				},
				{
					id: 'necromancer-action-6',
					name: 'Grave Bolt',
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
								ActionEffects.dealDamage(DamageType.Decay, 3),
								ActionEffects.toSelf([
									ActionEffects.healWounds(1)
								])
							]
						})
					]
				},
				{
					id: 'necromancer-action-7',
					name: 'Raise the Dead',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.summon(SummonType.Undead)
					]
				}
			]
		}
	],
	backgrounds: [],
	items: [],
	potions: [],
	scrolls: [],
	structures: []
});
