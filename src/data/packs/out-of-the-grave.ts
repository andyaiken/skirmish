import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ConditionType } from '../../enums/condition-type';
import { ContagionType } from '../../enums/contagion-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { SummonType } from '../../enums/summon-type';
import { TargetStateType } from '../../enums/target-state-type';
import { TraitType } from '../../enums/trait-type';

export const outOfTheGrave = (): PackModel => ({
	id: 'pack_out_of_the_grave',
	name: 'Out of the Grave',
	description: 'Add a touch of gothic horror to your game with this pack.',
	species: [
		{
			id: 'species-draugr',
			name: 'Draugr',
			description: 'The undead corpse of someone who drowned.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Undead,
				QuirkType.Aquatic
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('draugr-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('draugr-start-2', SkillType.Brawl, 3),
				FeatureLogic.createDamageResistFeature('draugr-start-3', DamageType.Decay, 3)
			],
			features: [
				FeatureLogic.createTraitFeature('draugr-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('draugr-feature-2', SkillType.Brawl, 3),
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
			id: 'species-ghoul',
			name: 'Ghoul',
			description: 'An undead creature that feeds on corpses.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Undead
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('ghoul-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('ghoul-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('ghoul-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('ghoul-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('ghoul-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('ghoul-feature-3', DamageType.Decay, 1)
			],
			actions: [
				{
					// The paralysis is the card: a high-rank movement penalty leaves you where the
					// ghoul left you, which is where it comes back to
					id: 'ghoul-action-1',
					name: 'Paralysing Claws',
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
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 8))
							]
						})
					]
				},
				{
					id: 'ghoul-action-2',
					name: 'Fall Upon',
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
								ActionEffects.dealDamage(DamageType.Decay, 3),
								ActionEffects.ifTarget(TargetStateType.Prone, [
									ActionEffects.dealDamage(DamageType.Decay, 3)
								])
							]
						})
					]
				},
				{
					id: 'ghoul-action-3',
					name: 'Carrion Stink',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
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
			id: 'species-grub-swarm',
			name: 'Grub Swarm',
			description: 'A seething mass of pale grubs.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [
				QuirkType.Beast,
				QuirkType.Swarm
			],
			startingFeatures: [
				FeatureLogic.createSkillFeature('grub-start-1', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('grub-start-2', TraitType.Endurance, 1),
				FeatureLogic.createDamageBonusFeature('grub-start-3', DamageType.Decay, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('grub-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createTraitFeature('grub-feature-2', TraitType.Endurance, 1),
				FeatureLogic.createDamageResistFeature('grub-feature-3', DamageType.Decay, 2)
			],
			actions: [
				{
					id: 'grub-action-1',
					name: 'Burrow',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Piercing, 1),
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Decay)))
							]
						})
					]
				},
				{
					id: 'grub-swarm-action-2',
					name: 'Churn The Earth',
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
								ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 3))
							]
						})
					]
				},
				{
					id: 'grub-swarm-action-3',
					name: 'Surface',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.BesideTarget, 0),
						ActionEffects.takeAnotherAction()
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-ooze',
			name: 'Ooze',
			description: 'A mindless blob of acidic slime.',
			type: CombatantType.Monster,
			size: 2,
			quirks: [
				QuirkType.Amorphous,
				QuirkType.Mindless
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('ooze-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('ooze-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('ooze-start-3', DamageType.Acid, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('ooze-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('ooze-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('ooze-feature-3', DamageType.Acid, 3),
				FeatureLogic.createDamageCategoryResistFeature('ooze-feature-4', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'ooze-action-1',
					name: 'Engulf',
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
								ActionEffects.dealDamage(DamageType.Acid, 4)
							]
						})
					]
				},
				{
					id: 'ooze-action-2',
					name: 'Corrode',
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
								ActionEffects.dealDamage(DamageType.Acid, 2),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 4, DamageCategoryType.Physical))
							]
						})
					]
				},
				{
					id: 'ooze-action-3',
					name: 'Flow Through',
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
								ActionEffects.dealDamage(DamageType.Acid, 2),
								ActionEffects.disarm()
							]
						})
					]
				}
			],
			deathActions: [
				{
					id: 'ooze-death-1',
					name: 'Split',
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
								ActionEffects.dealDamage(DamageType.Acid, 4),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 3, DamageCategoryType.Corruption))
							]
						})
					]
				}
			]
		},
		{
			id: 'species-revenant',
			name: 'Revenant',
			description: 'A person who has returned from the dead, driven by unfinished business.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [
				QuirkType.Undead
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('revenant-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('revenant-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('revenant-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('revenant-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createTraitFeature('revenant-feature-2', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('revenant-feature-3', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('revenant-feature-4', DamageCategoryType.Corruption, 1),
				FeatureLogic.createDamageBonusFeature('revenant-feature-5', DamageType.Decay, 1)
			],
			actions: [
				{
					id: 'revenant-action-1',
					name: 'Hands That Remember',
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
								ActionEffects.dealDamage(DamageType.Decay, 2),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 3, TraitType.Endurance))
							]
						})
					]
				},
				{
					id: 'revenant-action-2',
					name: 'Play Dead',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						// Lying still among the bodies is the one thing a corpse is already good at
						ActionEffects.hide(),
						ActionEffects.healDamage(2)
					]
				},
				{
					id: 'revenant-action-3',
					name: 'Unfinished Business',
					prerequisites: [
						ActionPrerequisites.wound()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						// Worse off means further along, not closer to stopping - so this is only
						// available once something has actually been taken off it
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 4, TraitType.Endurance)),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 4, SkillType.Brawl))
					]
				}
			],
			deathActions: []
		},
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
			description: 'An undead creature that drinks the blood of the living.',
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
				},
				{
					id: 'wraith-action-3',
					name: 'Pass Through The Wall',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Squares, 1, 8)
					],
					effects: [
						ActionEffects.moveToTargetSquare(),
						ActionEffects.hide()
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
				},
				{
					id: 'zombie-action-3',
					name: 'Shamble Forward',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addMovement(),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 3, DamageCategoryType.Physical))
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
		},
		{
			id: 'role-plaguebearer',
			name: 'Plaguebearer',
			description: 'A spellcaster who spreads disease and poison.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('plaguebearer-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('plaguebearer-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('plaguebearer-start-3', ItemProficiencyType.Implements),
				FeatureLogic.createDamageCategoryResistFeature('plaguebearer-start-4', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('plaguebearer-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('plaguebearer-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('plaguebearer-feature-3', DamageType.Decay, 1),
				FeatureLogic.createDamageBonusFeature('plaguebearer-feature-4', DamageType.Poison, 1),
				FeatureLogic.createAuraDamageFeature('plaguebearer-feature-5', ConditionType.AutoDamage, DamageType.Poison, 1)
			],
			actions: [
				{
					id: 'plaguebearer-action-1',
					name: 'Miasma',
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
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Poison)))
							]
						})
					]
				},
				{
					id: 'plaguebearer-action-2',
					name: 'Wasting Touch',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Resolve, 4, DamageType.Decay)),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 4, TraitType.Endurance))
							]
						})
					]
				},
				{
					id: 'plaguebearer-action-3',
					name: 'Fever',
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
								ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 4, SkillCategoryType.Mental))
							]
						})
					]
				},
				{
					id: 'plaguebearer-action-4',
					name: 'Weeping Sores',
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
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 4, DamageCategoryType.Corruption))
							]
						})
					]
				},
				{
					id: 'plaguebearer-action-5',
					name: 'Carrier',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 5, DamageCategoryType.Corruption)),
						// You take the sickness into yourself; the resistance above is what lets you
						// live with it, and it only ever passes to the people standing against you
						ActionEffects.addCondition(ConditionLogic.makeContagious(
							ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Decay), ContagionType.Enemies
						))
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-physician',
			name: 'Physician',
			description: 'A doctor who treats wounds and ailments.',
			startingFeatures: [
			],
			features: [
				FeatureLogic.createAuraFeature('physician-feature-1', ConditionType.AutoHeal, 1)
			],
			actions: [
				{
					id: 'physician-action-1',
					name: 'Remove Affliction',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Any),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'physician-action-2',
					name: 'First Aid',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
					],
					effects: [
						ActionEffects.healDamage(5),
						ActionEffects.healWounds(2)
					]
				},
				{
					id: 'physician-action-4',
					name: 'Bleed the Patient',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
					],
					effects: [
						ActionEffects.healWounds(1),
						ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 2, TraitType.Endurance))
					]
				},
				{
					id: 'physician-action-5',
					name: 'Draw Off the Humour',
					prerequisites: [
						ActionPrerequisites.condition(TraitType.Any)
					],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.transferCondition(),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'physician-action-6',
					name: 'Prescribe',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.healDamage(3),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 4, DamageCategoryType.Corruption))
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
			id: 'structure-sanatorium',
			type: StructureType.Sanatorium,
			name: 'Sanatorium',
			description: 'A quiet place to be put back together.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
