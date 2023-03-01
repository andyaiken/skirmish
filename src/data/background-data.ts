import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionLogic } from '../logic/action-logic';
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
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'acrobat-action-2',
						name: 'Burst of speed (roll speed again and add)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'artificer-action-2',
						name: 'Drain item',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
				]
			},
			{
				id: 'background-bard',
				name: 'Bard',
				features: [
					FeatureLogic.createSkillCategoryFeature('bard-feature-1', SkillCategoryType.Mental, 2),
					FeatureLogic.createProficiencyFeature('bard-feature-2', ItemProficiencyType.Any)
				],
				actions: [
					{
						id: 'bard-action-1',
						name: 'Song of health (AOE heal)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'bard-action-1',
						name: 'Song of inspiration (AOE buff)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Ally makes attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'commander-action-1',
						name: 'Ally moves',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'commander-action-1',
						name: 'Reveal hidden enemies',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Buff ally',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Confusion (target makes attack)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'mystic-action-1',
						name: 'Stun (target loses action)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'mystic-action-1',
						name: 'Transfer a condition',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'mystic-action-1',
						name: 'Invert a condition',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
				]
			},
			{
				id: 'background-noble',
				name: 'Noble',
				features: [
					FeatureLogic.createAuraFeature('noble-feature-1', ConditionType.MovementBonus, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-2', ConditionType.TraitBonus, TraitType.Endurance, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-2', ConditionType.TraitBonus, TraitType.Resolve, 1),
					FeatureLogic.createAuraTraitFeature('noble-feature-3', ConditionType.TraitBonus, TraitType.Speed, 1)
				],
				actions: [
					{
						id: 'noble-action-1',
						name: 'Buff ally',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'noble-action-2',
						name: 'Debuff enemy',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'noble-action-3',
						name: 'Taunt',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Remove condition (ally)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'physician-action-2',
						name: 'Healing (damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'physician-action-3',
						name: 'Healing (wounds)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Frenzy (adds to damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'reaver-action-2',
						name: 'Speed boost',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'reaver-action-3',
						name: 'Endurance boost',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'sentinel-action-2',
						name: 'Interposing stance',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'sentinel-action-3',
						name: 'Pull enemy',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'thief-action-1',
						name: 'Disable trap',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'thief-action-1',
						name: 'Set trap',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
				]
			}
		];
	};
}
