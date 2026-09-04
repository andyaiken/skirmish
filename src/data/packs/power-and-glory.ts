import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action/action-logic';
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
import { TraitType } from '../../enums/trait-type';

export const powerAndGlory = (): PackModel => ({
	id: 'pack-power-and-glory',
	name: 'Power and Glory',
	description: 'These cards bring the majesty of the divine to your game.',
	species: [
		{
			id: 'species-deva',
			name: 'Deva',
			description: 'A humanoid with angelic ancestry.',
			type: CombatantType.Hero,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('deva-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('deva-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('deva-start-3', DamageCategoryType.Corruption, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('deva-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('deva-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('deva-feature-3', DamageCategoryType.Corruption, 1),
				FeatureLogic.createAuraDamageFeature('deva-feature-4', ConditionType.AutoDamage, DamageType.Light, 1)
			],
			actions: [
				{
					id: 'deva-action-1',
					name: 'Divine Radiance',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'deva-action-2',
					name: 'Divine Light',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Light, 2)
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-apostate',
			name: 'Apostate',
			description: 'A fallen deva that lost everything that made it holy.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('apostate-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('apostate-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('apostate-start-3', DamageType.Light, 2),
				FeatureLogic.createDamageBonusFeature('apostate-start-4', DamageType.Decay, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('apostate-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('apostate-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageResistFeature('apostate-feature-3', DamageType.Light, 3),
				FeatureLogic.createAuraDamageFeature('apostate-feature-4', ConditionType.AutoDamage, DamageType.Decay, 1)
			],
			actions: [
				{
					id: 'apostate-action-1',
					name: 'Withering Radiance',
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
								ActionEffects.dealDamage(DamageType.Light, 3),
								ActionEffects.dealDamage(DamageType.Decay, 3)
							]
						})
					]
				},
				{
					id: 'apostate-action-2',
					name: 'Judgement',
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
								ActionEffects.dealDamage(DamageType.Light, 2),
								ActionEffects.inflictWounds(1)
							]
						})
					]
				},
				{
					id: 'apostate-action-3',
					name: 'Unmake The Blessing',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.removeCondition(TraitType.Any),
								ActionEffects.addCondition(ConditionLogic.createDamageVulnerabilityCondition(TraitType.Resolve, 4, DamageType.Decay))
							]
						})
					]
				},
				{
					id: 'apostate-action-4',
					name: 'Fall With Me',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
					],
					effects: [
						ActionEffects.forceMovement(MovementType.Pull, 3),
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Decay, 2),
								ActionEffects.knockDown()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-inquisitor',
			name: 'Inquisitor',
			description: 'Sent to ask questions, and satisfied with only one answer.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('inquisitor-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('inquisitor-start-2', SkillType.Presence, 3),
				FeatureLogic.createDamageBonusFeature('inquisitor-start-3', DamageType.Light, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('inquisitor-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('inquisitor-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('inquisitor-feature-3', DamageType.Light, 2),
				FeatureLogic.createAuraTraitFeature('inquisitor-feature-4', ConditionType.TraitPenalty, TraitType.Resolve, 1)
			],
			actions: [
				{
					id: 'inquisitor-action-1',
					name: 'Interrogate',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 6)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Psychic, 2),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Resolve)),
								ActionEffects.reveal()
							]
						})
					]
				},
				{
					id: 'inquisitor-action-2',
					name: 'Absolution',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Any),
						ActionEffects.healDamage(3)
					]
				},
				{
					id: 'inquisitor-action-3',
					name: 'Rally The Faithful',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Resolve)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 2, DamageCategoryType.Physical)),
						ActionEffects.commandAction()
					]
				},
				{
					id: 'inquisitor-action-4',
					name: 'Cleansing Fire',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 2, 8)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Fire, 2),
								ActionEffects.dealDamage(DamageType.Light, 2)
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
			id: 'role-cleric',
			name: 'Cleric',
			description: 'Clerics devote their lives to the gods, and receive power in return.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('cleric-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('cleric-start-2', SkillType.Presence, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('cleric-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('cleric-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('cleric-feature-3', DamageType.Light, 2)
			],
			actions: [
				{
					id: 'cleric-action-1',
					name: 'Lay On Hands',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
					],
					effects: [
						ActionEffects.healDamage(5),
						ActionEffects.healWounds(1)
					]
				},
				{
					id: 'cleric-action-2',
					name: 'Sacrament',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Allies, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Any),
						ActionEffects.healDamage(1),
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 3, DamageType.All))
					]
				},
				{
					id: 'cleric-action-3',
					name: 'Holy Light',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 3, DamageType.All))
					]
				},
				{
					id: 'cleric-action-4',
					name: 'Bless',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Endurance)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Resolve)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Speed))
					]
				},
				{
					id: 'cleric-action-5',
					name: 'Divine Retribution',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Light, 3),
								ActionEffects.dealDamage(DamageType.Fire, 3)
							]
						})
					]
				}
			]
		},
		{
			id: 'role-paladin',
			name: 'Paladin',
			description: 'A holy warrior, driven by unwavering faith.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('paladin-start-1', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('paladin-start-2', SkillType.Weapon, 2),
				FeatureLogic.createProficiencyFeature('paladin-start-3', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('paladin-start-4', ItemProficiencyType.HeavyArmor),
				FeatureLogic.createProficiencyFeature('paladin-start-5', ItemProficiencyType.Shields)
			],
			features: [
				FeatureLogic.createSkillFeature('paladin-feature-1', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('paladin-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createAuraDamageCategoryFeature('paladin-feature-3', ConditionType.DamageCategoryResistance, DamageCategoryType.Physical, 3),
				FeatureLogic.createAuraDamageCategoryFeature('paladin-feature-4', ConditionType.DamageCategoryResistance, DamageCategoryType.Energy, 3),
				FeatureLogic.createAuraDamageCategoryFeature('paladin-feature-5', ConditionType.DamageCategoryResistance, DamageCategoryType.Corruption, 3)
			],
			actions: [
				{
					id: 'paladin-action-1',
					name: 'Radiant Smite',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(),
								ActionEffects.dealDamage(DamageType.Light, 2)
							]
						})
					]
				},
				{
					id: 'paladin-action-2',
					name: 'Flame of Valor',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Light, 2)
							]
						})
					]
				},
				{
					id: 'paladin-action-3',
					name: 'Shield of Justice',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 3, DamageType.All))
					]
				},
				{
					id: 'paladin-action-4',
					name: 'Templar\'s Strength',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.healDamage(1),
						ActionEffects.healWounds(1)
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-zealot',
			name: 'Zealot',
			description: 'A religious fanatic, empowered by the strength of their convictions.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillFeature('zealot-feature-1', SkillType.Brawl, 2),
				FeatureLogic.createSkillFeature('zealot-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createDamageCategoryBonusFeature('zealot-feature-3', DamageCategoryType.Any, 1)
			],
			actions: [
				{
					id: 'zealot-action-1',
					name: 'Fanatic\'s Strength',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 2, DamageCategoryType.Physical)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 2, DamageCategoryType.Energy)),
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 2, DamageCategoryType.Corruption))
					]
				},
				{
					id: 'zealot-action-2',
					name: 'Fanatic\'s Speed',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 2)),
						ActionEffects.takeAnotherAction()
					]
				},
				{
					id: 'zealot-action-3',
					name: 'Righteous Will',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.invertConditions(false),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 2, TraitType.Endurance)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 2, TraitType.Resolve)),
						ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 2, TraitType.Resolve))
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
			id: 'structure-temple',
			type: StructureType.Temple,
			name: 'Temple',
			description: 'A place for heroes to pray to their gods for good fortune.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
