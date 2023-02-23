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
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Overhead strike'),
					ActionLogic.createActionPlaceholder('Knockdown strike'),
					ActionLogic.createActionPlaceholder('Stunning strike'),
					ActionLogic.createActionPlaceholder('Haymaker strike')
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
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Dual strike (one target)'),
					ActionLogic.createActionPlaceholder('Dual strike (two targets)'),
					ActionLogic.createActionPlaceholder('Whirlwind strike'),
					ActionLogic.createActionPlaceholder('Leaping strike'),
					ActionLogic.createActionPlaceholder('Dodging stance (adds physical damage resistance)')
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
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Spellcasting, 2),
					FeatureLogic.createDamageBonusFeature(DamageType.Psychic, 1),
					FeatureLogic.createDamageResistFeature(DamageType.Psychic, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Confusion (target makes attack)'),
					ActionLogic.createActionPlaceholder('Stun (target loses action)'),
					ActionLogic.createActionPlaceholder('Fear (target loses speed)'),
					ActionLogic.createActionPlaceholder('Mental shield (add psychic damage resistance)'),
					ActionLogic.createActionPlaceholder('Weaken (reduce target\'s damage)')
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
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Roundhouse kick'),
					ActionLogic.createActionPlaceholder('Flurry (single target)'),
					ActionLogic.createActionPlaceholder('Leaping kick'),
					ActionLogic.createActionPlaceholder('Lightning speed (move)'),
					ActionLogic.createActionPlaceholder('Adrenal boost (adds to attack / damage)')
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
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Deadeye (adds to next attack)'),
					ActionLogic.createActionPlaceholder('Fire'),
					ActionLogic.createActionPlaceholder('Pommel strike'),
					ActionLogic.createActionPlaceholder('Quickfire (two attacks, low accuracy)'),
					ActionLogic.createActionPlaceholder('Careful shot'),
					ActionLogic.createActionPlaceholder('Fusilade (area, low damage)')
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
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature(SkillType.Perception, 2),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Quick shot'),
					ActionLogic.createActionPlaceholder('Sure shot'),
					ActionLogic.createActionPlaceholder('Pinning shot (slows)'),
					ActionLogic.createActionPlaceholder('Barrage (area, low damage)'),
					ActionLogic.createActionPlaceholder('Aim (adds to next attack)')
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
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Charge attack'),
					ActionLogic.createActionPlaceholder('Precise attack'),
					ActionLogic.createActionPlaceholder('Disarming attack'),
					ActionLogic.createActionPlaceholder('Parrying stance'),
					ActionLogic.createActionPlaceholder('Shield bash (push)')
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
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Fire, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Cold, 1),
					FeatureLogic.createAuraDamageFeature(ConditionType.AutoDamage, DamageType.Electricity, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Lightning bolt (single target, damage and stuns)'),
					ActionLogic.createActionPlaceholder('Fireball (area, ongoing fire damage)'),
					ActionLogic.createActionPlaceholder('Ice storm (area, damage and reduced speed)'),
					ActionLogic.createActionPlaceholder('Elemental resistance: fire'),
					ActionLogic.createActionPlaceholder('Elemental resistance: cold'),
					ActionLogic.createActionPlaceholder('Elemental resistance: electricity')
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
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('Flaming blade (ongoing fire)'),
					ActionLogic.createActionPlaceholder('Frost blade (slows)'),
					ActionLogic.createActionPlaceholder('Shocking blade (stuns)'),
					ActionLogic.createActionPlaceholder('Armor enhancement'),
					ActionLogic.createActionPlaceholder('XXX (attack at range)')
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
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature(SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature(DamageCategoryType.Energy, 1)
				],
				actions: [
					ActionLogic.createActionPlaceholder('XXX (shield self, resist all damage)'),
					ActionLogic.createActionPlaceholder('XXX (shield other, resist all damage)'),
					ActionLogic.createActionPlaceholder('XXX (push)'),
					ActionLogic.createActionPlaceholder('Magic missile'),
					ActionLogic.createActionPlaceholder('Swap positions')
				]
			}
		];
	};
}
