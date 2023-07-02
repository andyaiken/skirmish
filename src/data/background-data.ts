import { ActionTargetType } from '../enums/action-target-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { MovementType } from '../enums/movement-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionOriginParameters, ActionPrerequisites, ActionTargetParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { BackgroundModel } from '../models/background';

export class BackgroundData {
	static getList = (): BackgroundModel[] => {
		return [
			{
				id: 'background-acrobat',
				name: 'Acrobat',
				description: 'Quick and lithe, acrobats are difficult to pin down.',
				features: [
					FeatureLogic.createTraitFeature('acrobat-feature-2', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('acrobat-feature-3', SkillType.Reactions, 2)
				],
				actions: [
					{
						id: 'acrobat-action-1',
						name: 'Jump Up',
						prerequisites: [
							ActionPrerequisites.prone()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.stand(),
							ActionEffects.takeAnotherAction()
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
							ActionEffects.addMovement(),
							ActionEffects.takeAnotherAction()
						]
					}
				]
			},
			{
				id: 'background-bard',
				name: 'Bard',
				description: 'The charismatic bard inspires their allies to greatness.',
				features: [
					FeatureLogic.createSkillFeature('bard-feature-1', SkillType.Presence, 2),
					FeatureLogic.createSkillCategoryFeature('bard-feature-2', SkillCategoryType.Mental, 1),
					FeatureLogic.createProficiencyFeature('bard-feature-3', ItemProficiencyType.Any)
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
							ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 8, SkillCategoryType.Physical))
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
							ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 8, SkillCategoryType.Mental))
						]
					},
					{
						id: 'bard-action-4',
						name: 'Song of Victory',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 10)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 1, TraitType.Endurance)),
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 1, TraitType.Resolve)),
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 1, TraitType.Speed))
						]
					}
				]
			},
			{
				id: 'background-commander',
				name: 'Commander',
				description: 'A commander uses tactical analysis to make the most of any situation.',
				features: [
					FeatureLogic.createSkillFeature('commander-feature-1', SkillType.Presence, 2),
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-2', ConditionType.DamageCategoryBonus, DamageCategoryType.Corruption, 1),
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-3', ConditionType.DamageCategoryBonus, DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageCategoryFeature('commander-feature-4', ConditionType.DamageCategoryBonus, DamageCategoryType.Physical, 1),
					FeatureLogic.createAuraSkillCategoryFeature('commander-feature-5', ConditionType.SkillCategoryBonus, SkillCategoryType.Physical, 1)
				],
				actions: [
					{
						id: 'commander-action-1',
						name: 'Direct the Attack',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, 1, 10)
						],
						effects: [
							ActionEffects.commandAction()
						]
					},
					{
						id: 'commander-action-2',
						name: 'Tactical Positioning',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
						],
						effects: [
							ActionEffects.commandMove()
						]
					},
					{
						id: 'commander-action-3',
						name: 'Rally',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 10)
						],
						effects: [
							ActionEffects.healDamage(3),
							ActionEffects.stand()
						]
					}
				]
			},
			{
				id: 'background-grenadier',
				name: 'Grenadier',
				description: 'Grenadiers use explosives, which are dangerous and difficult to master.',
				features: [
					FeatureLogic.createSkillFeature('grenadier-feature-1', SkillType.Perception, 2),
					FeatureLogic.createSkillFeature('grenadier-feature-2', SkillType.Any, 1)
				],
				actions: [
					{
						id: 'grenadier-action-1',
						name: 'Demolitions',
						prerequisites: [
							ActionPrerequisites.emptyHand()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Walls, 1, 8)
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
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
						],
						effects: [
							ActionEffects.dealDamage(DamageType.Impact, 2),
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
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
						],
						effects: [
							ActionEffects.dealDamage(DamageType.Fire, 2),
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
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
						],
						effects: [
							ActionEffects.dealDamage(DamageType.Light, 1),
							ActionEffects.dealDamage(DamageType.Sonic, 1),
							ActionEffects.stun()
						]
					}
				]
			},
			{
				id: 'background-mountebank',
				name: 'Mountebank',
				description: 'Tricksters and con artists, mountebanks make valuable allies and frustrating foes.',
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
					}
				]
			},
			{
				id: 'background-mystic',
				name: 'Mystic',
				description: 'Mystics are the masters of the arcane arts.',
				features: [
					FeatureLogic.createSkillFeature('mystic-feature-1', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-2', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature('mystic-feature-3', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryBonusFeature('mystic-feature-4', DamageCategoryType.Corruption, 1),
					FeatureLogic.createDamageCategoryResistFeature('mystic-feature-5', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'mystic-action-1',
						name: 'Confusion',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.commandAction()
						]
					},
					{
						id: 'mystic-action-2',
						name: 'Sympathetic Affliction',
						prerequisites: [
							ActionPrerequisites.condition(TraitType.Any)
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.transferCondition()
						]
					},
					{
						id: 'mystic-action-3',
						name: 'Eldritch Reversal',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, 1, 5)
						],
						effects: [
							ActionEffects.invertConditions(false)
						]
					}
				]
			},
			{
				id: 'background-noble',
				name: 'Noble',
				description: 'Though they can be haughty, nobles bring an imposing presence to a battlefield.',
				features: [
					FeatureLogic.createSkillFeature('noble-feature-1', SkillType.Presence, 2),
					FeatureLogic.createAuraFeature('noble-feature-2', ConditionType.MovementBonus, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-3', ConditionType.TraitBonus, TraitType.Endurance, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-4', ConditionType.TraitBonus, TraitType.Resolve, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-5', ConditionType.TraitBonus, TraitType.Speed, 1)
				],
				actions: [
					{
						id: 'noble-action-1',
						name: 'Boost Morale',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 2, SkillType.All))
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
							ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 2, SkillType.All))
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
								skill: SkillType.Presence,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.stun()
								]
							})
						]
					}
				]
			},
			{
				id: 'background-physician',
				name: 'Physician',
				description: 'For many groups, a physician is the difference between life and death.',
				features: [
					FeatureLogic.createAuraFeature('physician-feature-1', ConditionType.AutoHeal, 1)
				],
				actions: [
					{
						id: 'physician-action-1',
						name: 'Remove Affliction',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Allies, Number.MAX_VALUE)
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
							ActionTargetParameters.adjacent(ActionTargetType.Allies, Number.MAX_VALUE)
						],
						effects: [
							ActionEffects.healDamage(5)
						]
					},
					{
						id: 'physician-action-3',
						name: 'Cure Wounds',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Allies, Number.MAX_VALUE)
						],
						effects: [
							ActionEffects.healWounds(1)
						]
					},
					{
						id: 'physician-action-4',
						name: 'Heal Thyself',
						prerequisites: [
							ActionPrerequisites.wound()
						],
						parameters: [
							ActionTargetParameters.self()
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
				description: 'Reavers are rarely satisfied with anything other than carnage.',
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
				description: 'Nothing gets past a sentinel unless they allow it.',
				features: [
					FeatureLogic.createTraitFeature('sentinel-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature('sentinel-feature-2', TraitType.Resolve, 1),
					FeatureLogic.createDamageResistFeature('sentinel-feature-3', DamageType.All, 1),
					FeatureLogic.createAuraFeature('sentinel-feature-4', ConditionType.MovementPenalty, 1)
				],
				actions: [
					{
						id: 'sentinel-action-1',
						name: 'Mark Enemy',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Speed, 10))
						]
					},
					{
						id: 'sentinel-action-2',
						name: 'Unyielding Stance',
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
						name: 'Keep Close',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.forceMovement(MovementType.Pull, 3)
						]
					}
				]
			},
			{
				id: 'background-thief',
				name: 'Thief',
				description: 'Never put your trust in a thief, even when they\'re on your side.',
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
		];
	};
}
