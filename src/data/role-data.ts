import { AuraType } from '../enums/aura-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { FeatureLogic } from '../logic/feature-logic';

import type { ActionModel } from '../models/action';
import type { RoleModel } from '../models/role';

import { Utils } from '../utils/utils';

export class RoleData {
	static createActionPlaceholder = (name: string): ActionModel => {
		return {
			id: Utils.guid(),
			name: name
		};
	};

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
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					RoleData.createActionPlaceholder('Overhead strike'),
					RoleData.createActionPlaceholder('Knockdown strike'),
					RoleData.createActionPlaceholder('Stunning strike'),
					RoleData.createActionPlaceholder('Haymaker strike')
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
					RoleData.createActionPlaceholder('Dual strike (one target)'),
					RoleData.createActionPlaceholder('Dual strike (two targets)'),
					RoleData.createActionPlaceholder('Whirlwind strike'),
					RoleData.createActionPlaceholder('Leaping strike'),
					RoleData.createActionPlaceholder('Dodging stance (adds physical damage resistance)')
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
					RoleData.createActionPlaceholder('Confusion (target makes attack)'),
					RoleData.createActionPlaceholder('Stun (target loses action)'),
					RoleData.createActionPlaceholder('Fear (target loses speed)'),
					RoleData.createActionPlaceholder('Mental shield (add psychic damage resistance)'),
					RoleData.createActionPlaceholder('Weaken (reduce target\'s damage)')
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
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					RoleData.createActionPlaceholder('Roundhouse kick'),
					RoleData.createActionPlaceholder('Flurry (single target)'),
					RoleData.createActionPlaceholder('Leaping kick'),
					RoleData.createActionPlaceholder('Lightning speed (move)'),
					RoleData.createActionPlaceholder('Adrenal boost (adds to attack / damage)')
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
					RoleData.createActionPlaceholder('Deadeye (adds to next attack)'),
					RoleData.createActionPlaceholder('Fire'),
					RoleData.createActionPlaceholder('Pommel strike'),
					RoleData.createActionPlaceholder('Quickfire (two attacks, low accuracy)'),
					RoleData.createActionPlaceholder('Careful shot'),
					RoleData.createActionPlaceholder('Fusilade (area, low damage)')
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
					RoleData.createActionPlaceholder('Quick shot'),
					RoleData.createActionPlaceholder('Sure shot'),
					RoleData.createActionPlaceholder('Pinning shot (slows)'),
					RoleData.createActionPlaceholder('Barrage (area, low damage)'),
					RoleData.createActionPlaceholder('Aim (adds to next attack)')
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
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					RoleData.createActionPlaceholder('Charge attack'),
					RoleData.createActionPlaceholder('Precise attack'),
					RoleData.createActionPlaceholder('Disarming attack'),
					RoleData.createActionPlaceholder('Parrying stance'),
					RoleData.createActionPlaceholder('Shield bash (push)')
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
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Fire, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Cold, 1),
					FeatureLogic.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Electricity, 1)
				],
				actions: [
					RoleData.createActionPlaceholder('Lightning bolt (single target, damage and stuns)'),
					RoleData.createActionPlaceholder('Fireball (area, ongoing fire damage)'),
					RoleData.createActionPlaceholder('Ice storm (area, damage and reduced speed)'),
					RoleData.createActionPlaceholder('Elemental resistance: fire'),
					RoleData.createActionPlaceholder('Elemental resistance: cold'),
					RoleData.createActionPlaceholder('Elemental resistance: electricity')
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
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1)
				],
				actions: [
					RoleData.createActionPlaceholder('Flaming blade (ongoing fire)'),
					RoleData.createActionPlaceholder('Frost blade (slows)'),
					RoleData.createActionPlaceholder('Shocking blade (stuns)'),
					RoleData.createActionPlaceholder('Armor enhancement'),
					RoleData.createActionPlaceholder('XXX (attack at range)')
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
					FeatureLogic.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1)
				],
				actions: [
					RoleData.createActionPlaceholder('XXX (shield self, resist all damage)'),
					RoleData.createActionPlaceholder('XXX (shield other, resist all damage)'),
					RoleData.createActionPlaceholder('XXX (push)'),
					RoleData.createActionPlaceholder('Magic missile'),
					RoleData.createActionPlaceholder('Swap positions')
				]
			}
		];
	};
}
