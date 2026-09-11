import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { ContagionType } from '../../enums/contagion-type';
import { DamageCategoryType } from '../../enums/damage-category-type';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemLocationType } from '../../enums/item-location-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { MovementType } from '../../enums/movement-type';
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TraitType } from '../../enums/trait-type';

export const workshop = (): PackModel => ({
	id: 'pack_workshop',
	name: 'The Workshop',
	description: 'The cards in this pack showcase marvels of engineering and ingenuity.',
	species: [
		{
			id: 'species-automaton',
			name: 'Automaton',
			description: 'A clockwork soldier of brass, built to use firearms.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('automaton-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('automaton-start-2', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('automaton-start-3', ItemProficiencyType.PowderWeapons),
				FeatureLogic.createDamageCategoryResistFeature('automaton-start-4', DamageCategoryType.Physical, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('automaton-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('automaton-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageBonusFeature('automaton-feature-3', DamageType.Impact, 2),
				FeatureLogic.createDamageResistFeature('automaton-feature-4', DamageType.Poison, 5),
				FeatureLogic.createSkillFeature('automaton-feature-5', SkillType.Brawl, 2)
			],
			actions: [
				{
					id: 'automaton-action-1',
					name: 'Piston Strike',
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
								ActionEffects.forceMovement(MovementType.Push, 2)
							]
						})
					]
				},
				{
					id: 'automaton-action-2',
					name: 'Recalibrate',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.scan(),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 4, SkillType.Weapon)),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'automaton-action-3',
					name: 'Volley',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 2, 0)
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
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-construct',
			name: 'Construct',
			description: 'A living automaton.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('construct-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('construct-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('construct-start-3', DamageType.Poison, 2),
				FeatureLogic.createDamageResistFeature('construct-start-4', DamageType.Psychic, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('construct-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('construct-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('construct-feature-3', DamageType.Poison, 2),
				FeatureLogic.createDamageResistFeature('construct-feature-4', DamageType.Psychic, 2)
			],
			actions: [
				{
					id: 'construct-action-1',
					name: 'Knockdown',
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
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'construct-action-2',
					name: 'Repair',
					prerequisites: [
						ActionPrerequisites.damage()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healDamage(1),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'construct-action-3',
					name: 'Piston Drive',
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
								ActionEffects.dealDamage(DamageType.Impact, 3),
								ActionEffects.forceMovement(MovementType.Push, 2)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-mutant',
			name: 'Mutant',
			description: 'An unstable creature grown in an alchemist\'s vat.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('mutant-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('mutant-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('mutant-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('mutant-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('mutant-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('mutant-feature-3', DamageType.Acid, 2),
				FeatureLogic.createDamageCategoryResistFeature('mutant-feature-4', DamageCategoryType.Corruption, 2),
				FeatureLogic.createDamageCategoryBonusFeature('mutant-feature-5', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'mutant-action-1',
					name: 'Unstable Lash',
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
								ActionEffects.dealDamage(DamageType.Poison, 2),
								ActionEffects.dealDamage(DamageType.Any, 2)
							]
						})
					]
				},
				{
					id: 'mutant-action-2',
					name: 'Reagent Spray',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Acid, 2),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 3, DamageCategoryType.Corruption))
							]
						})
					]
				},
				{
					id: 'mutant-action-3',
					name: 'Reconstitute',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healDamage(4),
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Endurance, 3, DamageType.Any))
					]
				},
				{
					id: 'mutant-action-4',
					name: 'Spread the Blight',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 4)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Brawl,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(
									ConditionLogic.makeContagious(
										ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 4, DamageCategoryType.Corruption),
										ContagionType.Allies
									)
								)
							]
						})
					]
				}
			],
			deathActions: [
				{
					id: 'mutant-death-1',
					name: 'Burst',
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
								ActionEffects.dealDamage(DamageType.Decay, 2),
								ActionEffects.addCondition(ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Poison)))
							]
						})
					]
				}
			]
		},
		{
			id: 'species-tinderjack',
			name: 'Tinderjack',
			description: 'A mindless construct packed with gunpowder, which explodes when destroyed.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Mindless
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('tinderjack-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('tinderjack-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageResistFeature('tinderjack-start-3', DamageType.Fire, 5)
			],
			features: [
				FeatureLogic.createTraitFeature('tinderjack-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('tinderjack-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageBonusFeature('tinderjack-feature-3', DamageType.Fire, 2)
			],
			actions: [
				{
					id: 'tinderjack-action-1',
					name: 'Rush',
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
					id: 'tinderjack-action-2',
					name: 'Smoulder',
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
								ActionEffects.dealDamage(DamageType.Fire, 2)
							]
						})
					]
				},
				{
					id: 'tinderjack-action-3',
					name: 'Shed Sparks',
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
								ActionEffects.dealDamage(DamageType.Fire, 1),
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 2, DamageType.Fire))
							]
						})
					]
				}
			],
			deathActions: [
				{
					id: 'tinderjack-death-1',
					name: 'Detonate',
					prerequisites: [],
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
								ActionEffects.dealDamage(DamageType.Fire, 4),
								ActionEffects.dealDamage(DamageType.Impact, 2),
								ActionEffects.knockDown()
							]
						})
					]
				}
			]
		}
	],
	roles: [
		{
			id: 'role-alchemist',
			name: 'Alchemist',
			description: 'An expert in chemistry who throws flasks of acid, fire and other volatile mixtures.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('alchemist-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('alchemist-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('alchemist-start-3', ItemProficiencyType.Implements),
				FeatureLogic.createDamageBonusFeature('alchemist-start-4', DamageType.Acid, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('alchemist-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('alchemist-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('alchemist-feature-3', DamageType.Acid, 1),
				FeatureLogic.createDamageBonusFeature('alchemist-feature-4', DamageType.Fire, 1)
			],
			actions: [
				{
					id: 'alchemist-action-1',
					name: 'Acid Flask',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Acid, 3)
							]
						})
					]
				},
				{
					id: 'alchemist-action-2',
					name: 'Volatile Mixture',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 4)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: -2,
							hit: [
								ActionEffects.dealDamage(DamageType.Fire, 4)
							]
						}),
						ActionEffects.toSelf([
							ActionEffects.dealDamage(DamageType.Fire, 2)
						])
					]
				},
				{
					id: 'alchemist-action-3',
					name: 'Solvent',
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
								ActionEffects.dealDamage(DamageType.Acid, 2),
								ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 5, DamageCategoryType.Physical))
							]
						})
					]
				},
				{
					id: 'alchemist-action-4',
					name: 'Smoke',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Endurance, 4, SkillType.Perception))
							]
						})
					]
				},
				{
					id: 'alchemist-action-5',
					name: 'Restorative',
					prerequisites: [
						ActionPrerequisites.implement()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.healDamage(4)
					]
				}
			]
		},
		{
			id: 'role-artificer',
			name: 'Artificer',
			description: 'A creator of magically-powered inventions.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('artificer-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('artificer-start-2', SkillType.Spellcasting, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('artificer-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('artificer-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageCategoryBonusFeature('artificer-feature-3', DamageCategoryType.Energy, 1)
			],
			actions: [
				{
					id: 'artificer-action-1',
					name: 'Aetheric Gauntlet',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Electricity, 3)
							]
						})
					]
				},
				{
					id: 'artificer-action-2',
					name: 'Voltaic Flux',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Electricity, 3)
							]
						})
					]
				},
				{
					id: 'artificer-action-3',
					name: 'Supercharge',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 3, DamageCategoryType.Corruption)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 3, DamageCategoryType.Energy)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 3, DamageCategoryType.Physical))
					]
				},
				{
					id: 'artificer-action-4',
					name: 'Gravity Bomb',
					prerequisites: [],
					parameters: [
						ActionOriginParameters.distance(8),
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.forceMovement(MovementType.Pull, 3),
								ActionEffects.knockDown()
							]
						})
					]
				},
				{
					id: 'artificer-action-5',
					name: 'Vitriolic Jet',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Acid, 3)
							]
						})
					]
				}
			]
		},
		{
			id: 'role-gunslinger',
			name: 'Gunslinger',
			description: 'A fighter who uses gunpowder weapons.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('gunslinger-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('gunslinger-start-2', SkillType.Weapon, 3),
				FeatureLogic.createProficiencyFeature('gunslinger-start-3', ItemProficiencyType.PowderWeapons),
				FeatureLogic.createDamageBonusFeature('gunslinger-start-4', DamageType.Piercing, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('gunslinger-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('gunslinger-feature-2', SkillType.Weapon, 3)
			],
			actions: [
				{
					id: 'gunslinger-action-1',
					name: 'Fusilade',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionOriginParameters.weapon(),
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(-2)
							]
						})
					]
				},
				{
					id: 'gunslinger-action-2',
					name: 'Overcharged Round',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -1,
							hit: [
								ActionEffects.dealWeaponDamage(2)
							]
						})
					]
				},
				{
					id: 'gunslinger-action-3',
					name: 'Pommel Strike',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
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
								ActionEffects.dealDamage(DamageType.Impact, 2)
							]
						}),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'gunslinger-action-4',
					name: 'Quickfire',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -2,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: -2,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				},
				{
					id: 'gunslinger-action-5',
					name: 'Sharpshooter',
					prerequisites: [
						ActionPrerequisites.rangedWeapon()
					],
					parameters: [
						ActionWeaponParameters.ranged(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 2,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						})
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-grenadier',
			name: 'Grenadier',
			description: 'Grenadiers use explosives, which are dangerous and difficult to master.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillFeature('grenadier-feature-1', SkillType.Perception, 2)
			],
			actions: [
				{
					id: 'grenadier-action-1',
					name: 'Demolitions',
					prerequisites: [
						ActionPrerequisites.emptyHand()
					],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Walls, 1, 10)
					],
					effects: [
						ActionEffects.addSquares()
					]
				},
				{
					id: 'grenadier-action-2',
					name: 'Grenade',
					prerequisites: [
						ActionPrerequisites.emptyHand()
					],
					parameters: [
						ActionOriginParameters.distance(8),
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 4)
					],
					effects: [
						ActionEffects.dealDamage(DamageType.Impact, 3),
						ActionEffects.knockDown()
					]
				},
				{
					id: 'grenadier-action-3',
					name: 'Molotov',
					prerequisites: [
						ActionPrerequisites.emptyHand()
					],
					parameters: [
						ActionOriginParameters.distance(8),
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 4)
					],
					effects: [
						ActionEffects.dealDamage(DamageType.Fire, 3),
						ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 1, DamageType.Fire))
					]
				},
				{
					id: 'grenadier-action-4',
					name: 'Flashbang',
					prerequisites: [
						ActionPrerequisites.emptyHand()
					],
					parameters: [
						ActionOriginParameters.distance(8),
						ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 4)
					],
					effects: [
						ActionEffects.stun()
					]
				}
			]
		}
	],
	items: [
		{
			id: 'item-carbine',
			name: 'Carbine',
			description: 'A two-handed gun, smaller than a rifle.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PowderWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 7
					}
				],
				range: 15,
				unreliable: 2
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-pistol',
			name: 'Pistol',
			description: 'A one-handed gun.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PowderWeapons,
			location: ItemLocationType.Hand,
			slots: 1,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 6
					}
				],
				range: 10,
				unreliable: 2
			},
			armor: null,
			potion: null,
			scroll: null,
			features: [],
			actions: []
		},
		{
			id: 'item-rifle',
			name: 'Rifle',
			description: 'A large, long-range gun that needs two hands to use.',
			baseItem: '',
			magic: false,
			proficiency: ItemProficiencyType.PowderWeapons,
			location: ItemLocationType.Hand,
			slots: 2,
			weapon: {
				damage: [
					{
						type: DamageType.Piercing,
						rank: 8
					}
				],
				range: 20,
				unreliable: 2
			},
			armor: null,
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
			id: 'structure-forge',
			type: StructureType.Forge,
			name: 'Forge',
			description: 'Forges contain materials for building strongholds.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
