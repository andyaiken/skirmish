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
import { PackModel } from '../../models/pack';
import { QuirkType } from '../../enums/quirk-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TraitType } from '../../enums/trait-type';

export const illHumours = (): PackModel => ({
	id: 'pack-ill-humours',
	name: 'Ill Humours',
	description: 'Curing and infecting are two sides of the same coin.',
	species: [
		{
			id: 'species-ooze',
			name: 'Ooze',
			description: 'It has no shape of its own, and takes the shape of whatever it is dissolving.',
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
				}
			],
			deathActions: []
		},
		{
			id: 'species-blightspawn',
			name: 'Blightspawn',
			description: 'Something that was grown rather than born, and grown wrong.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('blightspawn-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('blightspawn-start-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryBonusFeature('blightspawn-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('blightspawn-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('blightspawn-feature-2', SkillType.Brawl, 2),
				FeatureLogic.createDamageCategoryResistFeature('blightspawn-feature-3', DamageCategoryType.Corruption, 2)
			],
			actions: [
				{
					id: 'blightspawn-action-1',
					name: 'Blighted Claws',
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
								ActionEffects.dealDamage(DamageType.Acid, 3)
							]
						})
					]
				},
				{
					id: 'blightspawn-action-2',
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
					id: 'blightspawn-death-1',
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
			id: 'species-plague-doctor',
			name: 'Plague Doctor',
			description: 'The beaked mask keeps the bad air out.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('plague-doctor-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('plague-doctor-start-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageBonusFeature('plague-doctor-start-3', DamageType.Poison, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('plague-doctor-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('plague-doctor-feature-2', SkillType.Spellcasting, 2),
				FeatureLogic.createDamageCategoryResistFeature('plague-doctor-feature-3', DamageCategoryType.Corruption, 2)
			],
			actions: [
				{
					id: 'plague-doctor-action-1',
					name: 'Bad Air',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Spellcasting,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Poison, 2),
								// Engineered to stay in the ward it was meant for
								ActionEffects.addCondition(ConditionLogic.makeContagious(
									ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Poison), ContagionType.Allies
								))
							]
						})
					]
				},
				{
					id: 'plague-doctor-action-2',
					name: 'Prescribe',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.healDamage(3),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Endurance, 4, DamageCategoryType.Corruption))
					]
				},
				{
					id: 'plague-doctor-action-3',
					name: 'Bleed Them',
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
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 4, TraitType.Endurance)),
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 3, DamageType.Decay))
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
			id: 'role-alchemist',
			name: 'Alchemist',
			description: 'Alchemists throw the things that other people refuse to even carry.',
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
			id: 'role-plaguebearer',
			name: 'Plaguebearer',
			description: 'Plaguebearers rarely kill anyone quickly.',
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
							ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 4, DamageType.Decay), ContagionType.Enemies
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
			description: 'For many groups, a physician is the difference between life and death.',
			startingFeatures: [],
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
						ActionEffects.removeCondition(TraitType.Any)
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
					id: 'physician-action-3',
					name: 'Heal Thyself',
					prerequisites: [
						ActionPrerequisites.wound()
					],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healWounds(2)
					]
				}
			]
		},
		{
			id: 'background-leech',
			name: 'Leech',
			description: 'A physician of the old school, for whom most complaints call for the same remedy.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('leech-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillCategoryFeature('leech-start-2', SkillCategoryType.Mental, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('leech-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createDamageCategoryResistFeature('leech-feature-2', DamageCategoryType.Corruption, 1)
			],
			actions: [
				{
					id: 'leech-action-1',
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
					id: 'leech-action-2',
					name: 'Draw Off the Humour',
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
					id: 'leech-action-3',
					name: 'Poultice',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
					],
					effects: [
						ActionEffects.healDamage(4)
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
