import { ActionTargetType } from '../enums/action-target-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { BackgroundModel } from '../models/background';

export class BackgroundData {
	static getList = (): BackgroundModel[] => {
		return [
			{
				id: 'background-acrobat',
				name: 'Acrobat',
				features: [
					FeatureLogic.createTraitFeature('acrobat-feature-1', TraitType.Speed, 1)
				],
				actions: [
					{
						id: 'acrobat-action-1',
						name: 'Move through occupied spaces',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							// TODO: Move through occupied spaces
						]
					},
					{
						id: 'acrobat-action-2',
						name: 'Burst of Speed',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.grantMovement()
						]
					}
				]
			},
			{
				id: 'background-artificer',
				name: 'Artificer',
				features: [
					FeatureLogic.createSkillFeature('artificer-feature-1', SkillType.Perception, 2),
					FeatureLogic.createProficiencyFeature('artificer-feature-2', ItemProficiencyType.Any)
				],
				actions: [
					{
						id: 'artificer-action-1',
						name: 'Infuse item',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
						],
						effects: [
							// TODO: Infuse item with magic
						]
					},
					{
						id: 'artificer-action-2',
						name: 'Drain item',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							// TODO: Drain item of magic
						]
					}
					// TODO: Convert loot pile to energy?
				]
			},
			{
				id: 'background-bard',
				name: 'Bard',
				features: [
					FeatureLogic.createSkillCategoryFeature('bard-feature-1', SkillCategoryType.Mental, 1),
					FeatureLogic.createProficiencyFeature('bard-feature-2', ItemProficiencyType.Any)
				],
				actions: [
					{
						id: 'bard-action-1',
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
						id: 'bard-action-2',
						name: 'Song of Inspiration',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 5, SkillCategoryType.Physical))
						]
					},
					{
						id: 'bard-action-3',
						name: 'Song of Courage',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 5, SkillCategoryType.Mental))
						]
					}
				]
			},
			{
				id: 'background-commander',
				name: 'Commander',
				features: [
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-1', ConditionType.DamageCategoryBonus, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-2', ConditionType.DamageCategoryBonus, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-3', ConditionType.DamageCategoryBonus, DamageCategoryType.Physical, 1)
				],
				actions: [
					{
						id: 'commander-action-1',
						name: 'Command attack',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, 1, 10)
						],
						effects: [
							// TODO: Selected target makes attack
						]
					},
					{
						id: 'commander-action-2',
						name: 'Command move',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, 1, 10)
						],
						effects: [
							// TODO: Selected target moves
						]
					},
					{
						id: 'commander-action-3',
						name: 'Battlefield instinct',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 10)
						],
						effects: [
							// TODO: Reveal hidden enemies
						]
					}
				]
			},
			{
				id: 'background-mountebank',
				name: 'Mountebank',
				features: [
					FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-1', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-2', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryFeature('mountebank-feature-3', ConditionType.DamageCategoryVulnerability, DamageCategoryType.Physical, 1)
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
						name: 'Expose weakness',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageVulnerabilityCondition(TraitType.Resolve, 5, DamageType.All))
						]
					}
				]
			},
			{
				id: 'background-mystic',
				name: 'Mystic',
				features: [
					FeatureLogic.createSkillFeature('mystic-feature-1', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-2', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-3', DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryResistFeature('mystic-feature-4', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'mystic-action-1',
						name: 'Confusion',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Selected target makes attack
						]
					},
					{
						id: 'mystic-action-2',
						name: 'Stun',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.loseTurn()
						]
					},
					{
						id: 'mystic-action-3',
						name: 'Transfer a condition',
						prerequisites: [
							ActionPrerequisites.implement(),
							ActionPrerequisites.condition(TraitType.Any)
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Transfer selected condition to selected target
						]
					},
					{
						id: 'mystic-action-4',
						name: 'Invert a condition',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, 1, 5)
						],
						effects: [
							// TODO: Invert selected condition
						]
					}
				]
			},
			{
				id: 'background-noble',
				name: 'Noble',
				features: [
					FeatureLogic.createAuraFeature('noble-feature-1', ConditionType.MovementBonus, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-2', ConditionType.TraitBonus, TraitType.Endurance, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-3', ConditionType.TraitBonus, TraitType.Resolve, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-4', ConditionType.TraitBonus, TraitType.Speed, 1)
				],
				actions: [
					{
						id: 'noble-action-1',
						name: 'Morale',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
						],
						effects: [
							// TODO: Add buff condition
						]
					},
					{
						id: 'noble-action-2',
						name: 'Dishearten',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Add debuff condition
						]
					},
					{
						id: 'noble-action-3',
						name: 'Taunt',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Perception,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.loseTurn()
								]
							})
						]
					}
				]
			},
			{
				id: 'background-physician',
				name: 'Physician',
				features: [
					FeatureLogic.createAuraFeature('physician-feature-1', ConditionType.AutoHeal, 1)
				],
				actions: [
					{
						id: 'physician-action-1',
						name: 'Remove affliction',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
						],
						effects: [
							ActionEffects.removeCondition(TraitType.Any)
						]
					},
					{
						id: 'physician-action-2',
						name: 'First aid',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
						],
						effects: [
							ActionEffects.healDamage(3)
						]
					},
					{
						id: 'physician-action-3',
						name: 'Cure wounds',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Allies, 1)
						],
						effects: [
							ActionEffects.healWounds(1)
						]
					}
				]
			},
			{
				id: 'background-reaver',
				name: 'Reaver',
				features: [
					FeatureLogic.createSkillFeature('reaver-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('reaver-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryResistFeature('reaver-feature-3', DamageCategoryType.Any, 1),
					FeatureLogic.createDamageCategoryBonusFeature('reaver-feature-4', DamageCategoryType.Physical, 1),
					FeatureLogic.createAuraDamageFeature('reaver-feature-5', ConditionType.AutoDamage, DamageType.Edged, 1),
					FeatureLogic.createAuraDamageFeature('reaver-feature-6', ConditionType.AutoDamage, DamageType.Impact, 1),
					FeatureLogic.createAuraDamageFeature('reaver-feature-7', ConditionType.AutoDamage, DamageType.Piercing, 1)
				],
				actions: [
					{
						id: 'reaver-action-1',
						name: 'Frenzy',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Physical))
						]
					},
					{
						id: 'reaver-action-2',
						name: 'Adrenaline',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 5)),
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Speed))
						]
					},
					{
						id: 'reaver-action-3',
						name: 'Fortitude',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Endurance)),
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Resolve))
						]
					}
				]
			},
			{
				id: 'background-sentinel',
				name: 'Sentinel',
				features: [
					FeatureLogic.createTraitFeature('sentinel-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature('sentinel-feature-2', TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature('sentinel-feature-3', DamageType.All, 1),
					FeatureLogic.createAuraFeature('sentinel-feature-4', ConditionType.MovementPenalty, 1)
				],
				actions: [
					{
						id: 'sentinel-action-1',
						name: 'Mark enemy',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							// TODO: Mark selected target
						]
					},
					{
						id: 'sentinel-action-2',
						name: 'Imposing stance',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Endurance)),
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Resolve))
						]
					},
					{
						id: 'sentinel-action-3',
						name: 'Keep close',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Move selected target adjacent
						]
					}
				]
			},
			{
				id: 'background-thief',
				name: 'Thief',
				features: [
					FeatureLogic.createSkillFeature('thief-feature-1', SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature('thief-feature-2', SkillType.Stealth, 2)
				],
				actions: [
					{
						id: 'thief-action-1',
						name: 'Steal item',
						prerequisites: [
							ActionPrerequisites.carryingCapacity()
						],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							// TODO: Take item from selected target
						]
					}
				]
			}
		];
	};
}