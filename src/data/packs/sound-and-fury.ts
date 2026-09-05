import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
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

export const soundAndFury = (): PackModel => ({
	id: 'pack-sound-and-fury',
	name: 'Sound and Fury',
	description: 'Noise travels where a blade cannot.',
	species: [
		{
			id: 'species-screamer',
			name: 'Screamer',
			description: 'A thin, wide-mouthed thing that does its work with noise.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('screamer-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('screamer-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('screamer-start-3', DamageType.Sonic, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('screamer-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('screamer-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageResistFeature('screamer-feature-3', DamageType.Sonic, 3)
			],
			actions: [
				{
					id: 'screamer-action-1',
					name: 'Shriek',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Sonic, 1),
								ActionEffects.stun()
							]
						})
					]
				},
				{
					id: 'screamer-action-2',
					name: 'Wail',
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
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Resolve)),
								ActionEffects.reveal()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-echo',
			name: 'Echo',
			description: 'A sound that outlived the thing that made it.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [
				QuirkType.Amorphous
			],
			startingFeatures: [
				FeatureLogic.createTraitFeature('echo-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('echo-start-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('echo-start-3', DamageType.Sonic, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('echo-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('echo-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageCategoryResistFeature('echo-feature-3', DamageCategoryType.Physical, 2),
				FeatureLogic.createDamageResistFeature('echo-feature-4', DamageType.Sonic, 2)
			],
			actions: [
				{
					id: 'echo-action-1',
					name: 'Reverberate',
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
								ActionEffects.dealDamage(DamageType.Sonic, 3)
							]
						})
					]
				},
				{
					id: 'echo-action-2',
					name: 'Repeat the Wound',
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
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 4, DamageType.Sonic))
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-siren',
			name: 'Siren',
			description: 'Getting closer sounds like the only good idea you have ever had.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('siren-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('siren-start-2', SkillType.Presence, 3),
				FeatureLogic.createDamageBonusFeature('siren-start-3', DamageType.Sonic, 1)
			],
			features: [
				FeatureLogic.createTraitFeature('siren-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('siren-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageResistFeature('siren-feature-3', DamageType.Sonic, 3)
			],
			actions: [
				{
					id: 'siren-action-1',
					name: 'Siren Song',
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
								ActionEffects.forceMovement(MovementType.Pull, 3),
								// You walk towards the singing, and everything else waits
								ActionEffects.delay(4)
							]
						})
					]
				},
				{
					id: 'siren-action-2',
					name: 'Enthrall',
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
								ActionEffects.commandAction()
							]
						})
					]
				},
				{
					id: 'siren-action-3',
					name: 'Dashed on the Rocks',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Endurance,
							skillBonus: 0,
							hit: [
								ActionEffects.dealDamage(DamageType.Sonic, 3),
								ActionEffects.knockDown()
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
			id: 'role-bard',
			name: 'Bard',
			description: 'Bards carry the song into the line, where it is not always a comfort.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('bard-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('bard-start-2', SkillType.Presence, 2),
				FeatureLogic.createSkillFeature('bard-start-3', SkillType.Spellcasting, 2),
				FeatureLogic.createProficiencyFeature('bard-start-4', ItemProficiencyType.Implements)
			],
			features: [
				FeatureLogic.createTraitFeature('bard-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('bard-feature-2', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('bard-feature-3', DamageType.Sonic, 1),
				FeatureLogic.createDamageCategoryResistFeature('bard-feature-4', DamageCategoryType.Energy, 1)
			],
			actions: [
				{
					id: 'bard-action-1',
					name: 'Battle Hymn',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 4, DamageCategoryType.Physical))
					]
				},
				{
					id: 'bard-action-2',
					name: 'Shattering Note',
					prerequisites: [
						ActionPrerequisites.implement()
					],
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
								ActionEffects.dealDamage(DamageType.Sonic, 3)
							]
						})
					]
				},
				{
					id: 'bard-action-3',
					name: 'Dirge',
					prerequisites: [
						ActionPrerequisites.implement()
					],
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
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Resolve)),
								ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Resolve, 3, DamageType.Sonic))
							]
						})
					]
				},
				{
					id: 'bard-action-4',
					name: 'Rallying Cry',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 3)
					],
					effects: [
						ActionEffects.stand(),
						ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Resolve, 4)),
						// Hastening yourself does nothing - you are already taking your turn - so
						// this only reads on the allies the cry reaches
						ActionEffects.hasten(3)
					]
				},
				{
					id: 'bard-action-5',
					name: 'Deafening Shout',
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
								ActionEffects.stun(),
								ActionEffects.reveal()
							]
						})
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-minstrel',
			name: 'Minstrel',
			description: 'The charismatic minstrel inspires their allies to greatness.',
			startingFeatures: [],
			features: [
				FeatureLogic.createSkillFeature('minstrel-feature-1', SkillType.Presence, 2),
				FeatureLogic.createSkillCategoryFeature('minstrel-feature-2', SkillCategoryType.Mental, 1),
				FeatureLogic.createProficiencyFeature('minstrel-feature-3', ItemProficiencyType.Any)
			],
			actions: [
				{
					id: 'minstrel-action-1',
					name: 'Song of Health',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
					],
					effects: [
						ActionEffects.healDamage(3)
					]
				},
				{
					id: 'minstrel-action-2',
					name: 'Anthem of Inspiration',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 3, SkillCategoryType.Physical))
					]
				},
				{
					id: 'minstrel-action-3',
					name: 'Melody of Courage',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 3, SkillCategoryType.Mental))
					]
				},
				{
					id: 'minstrel-action-4',
					name: 'Threnody of Lamentation',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 10)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 2, TraitType.Endurance)),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 2, TraitType.Resolve)),
								ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 2, TraitType.Speed))
							]
						})
					]
				}
			]
		},
		{
			id: 'background-crier',
			name: 'Crier',
			description: 'Criers are trained to be heard at the back of a crowd.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('crier-start-1', SkillType.Presence, 2),
				FeatureLogic.createTraitFeature('crier-start-2', TraitType.Resolve, 1)
			],
			features: [
				FeatureLogic.createSkillFeature('crier-feature-1', SkillType.Presence, 2),
				FeatureLogic.createTraitFeature('crier-feature-2', TraitType.Resolve, 1),
				FeatureLogic.createDamageResistFeature('crier-feature-3', DamageType.Sonic, 1)
			],
			actions: [
				{
					id: 'crier-action-1',
					name: 'Call Out',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
					],
					effects: [
						ActionEffects.reveal()
					]
				},
				{
					id: 'crier-action-2',
					name: 'Drown Out',
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
								ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 4, SkillType.Spellcasting))
							]
						})
					]
				},
				{
					id: 'crier-action-3',
					name: 'Carry the Word',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 10)
					],
					effects: [
						ActionEffects.commandMove()
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
