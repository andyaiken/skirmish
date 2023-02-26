import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionLogic } from '../logic/action-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { RoleModel } from '../models/role';

export class RoleData {
	static getList = (): RoleModel[] => {
		return [
			{
				id: 'role-barbarian',
				name: 'Barbarian',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.LargeWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('barbarian-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('barbarian-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature('barbarian-feature-3', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryResistFeature('barbarian-feature-4', DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('barbarian-action-1', 'Overhead strike'),
					ActionLogic.createActionPlaceholder('barbarian-action-2', 'Knockdown strike'),
					ActionLogic.createActionPlaceholder('barbarian-action-3', 'Stunning strike'),
					ActionLogic.createActionPlaceholder('barbarian-action-4', 'Haymaker strike')
				]
			},
			{
				id: 'role-dervish',
				name: 'Dervish',
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.PairedWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('dervish-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('dervish-feature-2', SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('dervish-action-1', 'Dual strike (one target)'),
					ActionLogic.createActionPlaceholder('dervish-action-2', 'Dual strike (two targets)'),
					ActionLogic.createActionPlaceholder('dervish-action-3', 'Whirlwind strike'),
					ActionLogic.createActionPlaceholder('dervish-action-4', 'Leaping strike'),
					ActionLogic.createActionPlaceholder('dervish-action-5', 'Dodging stance (adds physical damage resistance)')
				]
			},
			{
				id: 'role-enchanter',
				name: 'Enchanter',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('enchanter-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('enchanter-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageBonusFeature('enchanter-feature-3', DamageType.Psychic, 1),
					FeatureLogic.createDamageResistFeature('enchanter-feature-4', DamageType.Psychic, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('enchanter-action-1', 'Confusion (target makes attack)'),
					ActionLogic.createActionPlaceholder('enchanter-action-2', 'Stun (target loses action)'),
					ActionLogic.createActionPlaceholder('enchanter-action-3', 'Fear (target loses speed)'),
					ActionLogic.createActionPlaceholder('enchanter-action-4', 'Mental shield (add psychic damage resistance)'),
					ActionLogic.createActionPlaceholder('enchanter-action-5', 'Weaken (reduce target\'s damage)')
				]
			},
			{
				id: 'role-geomancer',
				name: 'Geomancer',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('geomancer-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('geomancer-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createAuraFeature('geomancer-feature-3', ConditionType.MovementBonus, 1),
					FeatureLogic.createAuraFeature('geomancer-feature-4', ConditionType.MovementPenalty, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('geomancer-action-1', 'Create difficult terrain'),
					ActionLogic.createActionPlaceholder('geomancer-action-2', 'Create clear terrain'),
					ActionLogic.createActionPlaceholder('geomancer-action-3', 'Destroy ground'),
					ActionLogic.createActionPlaceholder('geomancer-action-4', 'Create ground'),
					ActionLogic.createActionPlaceholder('geomancer-action-5', 'Earthbind (reduce target\'s speed)')
				]
			},
			{
				id: 'role-ninja',
				name: 'Ninja',
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Brawl,
					SkillType.Stealth
				],
				proficiencies: [
					// None
				],
				features: [
					FeatureLogic.createTraitFeature('ninja-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('ninja-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('ninja-feature-3', SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryBonusFeature('ninja-feature-4', DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('ninja-action-1', 'Roundhouse kick'),
					ActionLogic.createActionPlaceholder('ninja-action-2', 'Flurry (single target)'),
					ActionLogic.createActionPlaceholder('ninja-action-3', 'Leaping kick'),
					ActionLogic.createActionPlaceholder('ninja-action-4', 'Lightning speed (move)'),
					ActionLogic.createActionPlaceholder('ninja-action-5', 'Adrenal boost (adds to attack / damage)')
				]
			},
			{
				id: 'role-gunslinger',
				name: 'Gunslinger',
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.PowderWeapons
				],
				features: [
					FeatureLogic.createTraitFeature('gunslinger-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('gunslinger-feature-2', SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('gunslinger-action-1', 'Deadeye (adds to next attack)'),
					ActionLogic.createActionPlaceholder('gunslinger-action-2', 'Fire'),
					ActionLogic.createActionPlaceholder('gunslinger-action-3', 'Pommel strike'),
					ActionLogic.createActionPlaceholder('gunslinger-action-4', 'Quickfire (two attacks, low accuracy)'),
					ActionLogic.createActionPlaceholder('gunslinger-action-5', 'Careful shot'),
					ActionLogic.createActionPlaceholder('gunslinger-action-6', 'Fusilade (area, low damage)')
				]
			},
			{
				id: 'role-ranger',
				name: 'Ranger',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.RangedWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('ranger-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('ranger-feature-2', SkillType.Perception, 2),
					FeatureLogic.createSkillFeature('ranger-feature-3', SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('ranger-action-1', 'Quick shot'),
					ActionLogic.createActionPlaceholder('ranger-action-2', 'Sure shot'),
					ActionLogic.createActionPlaceholder('ranger-action-3', 'Pinning shot (slows)'),
					ActionLogic.createActionPlaceholder('ranger-action-4', 'Barrage (area, low damage)'),
					ActionLogic.createActionPlaceholder('ranger-action-5', 'Aim (adds to next attack)')
				]
			},
			{
				id: 'role-soldier',
				name: 'Soldier',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.MilitaryWeapons,
					ItemProficiencyType.HeavyArmor,
					ItemProficiencyType.Shields
				],
				features: [
					FeatureLogic.createTraitFeature('soldier-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('soldier-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature('soldier-feature-3', DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('soldier-action-1', 'Charge attack'),
					ActionLogic.createActionPlaceholder('soldier-action-2', 'Precise attack'),
					ActionLogic.createActionPlaceholder('soldier-action-3', 'Disarming attack'),
					ActionLogic.createActionPlaceholder('soldier-action-4', 'Parrying stance'),
					ActionLogic.createActionPlaceholder('soldier-action-5', 'Shield bash (push)')
				]
			},
			{
				id: 'role-sorcerer',
				name: 'Sorcerer',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('sorcerer-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('sorcerer-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature('sorcerer-feature-3', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature('sorcerer-feature-4', DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageFeature('sorcerer-feature-5', ConditionType.AutoDamage, DamageType.Fire, 1),
					FeatureLogic.createAuraDamageFeature('sorcerer-feature-6', ConditionType.AutoDamage, DamageType.Cold, 1),
					FeatureLogic.createAuraDamageFeature('sorcerer-feature-7', ConditionType.AutoDamage, DamageType.Electricity, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('sorcerer-action-1', 'Lightning bolt (single target, damage and stuns)'),
					ActionLogic.createActionPlaceholder('sorcerer-action-2', 'Fireball (area, ongoing fire damage)'),
					ActionLogic.createActionPlaceholder('sorcerer-action-3', 'Ice storm (area, damage and reduced speed)'),
					ActionLogic.createActionPlaceholder('sorcerer-action-4', 'Elemental resistance: fire'),
					ActionLogic.createActionPlaceholder('sorcerer-action-5', 'Elemental resistance: cold'),
					ActionLogic.createActionPlaceholder('sorcerer-action-6', 'Elemental resistance: electricity')
				]
			},
			{
				id: 'role-warmage',
				name: 'Warmage',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.MilitaryWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('warmage-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('warmage-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-3', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-4', DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('warmage-action-1', 'Flaming blade (ongoing fire)'),
					ActionLogic.createActionPlaceholder('warmage-action-2', 'Frost blade (slows)'),
					ActionLogic.createActionPlaceholder('warmage-action-3', 'Shocking blade (stuns)'),
					ActionLogic.createActionPlaceholder('warmage-action-4', 'Armor enhancement'),
					ActionLogic.createActionPlaceholder('warmage-action-5', 'XXX (attack at range)')
				]
			},
			{
				id: 'role-wizard',
				name: 'Wizard',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('wizard-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('wizard-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature('wizard-feature-3', DamageCategoryType.Energy, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('wizard-action-1', 'XXX (shield self, resist all damage)'),
					ActionLogic.createActionPlaceholder('wizard-action-2', 'XXX (shield other, resist all damage)'),
					ActionLogic.createActionPlaceholder('wizard-action-3', 'XXX (push)'),
					ActionLogic.createActionPlaceholder('wizard-action-4', 'Magic missile'),
					ActionLogic.createActionPlaceholder('wizard-action-5', 'Swap positions')
				]
			}
		];
	};
}
