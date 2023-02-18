import type { ActionModel } from '../models/action';
import type { RoleModel } from '../models/role';
import { FeatureUtils } from '../logic/feature-utils';
import { Utils } from '../utils/utils';
import { AuraType } from '../enums/aura-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

const createActionPlaceholder = (name: string): ActionModel => {
	return {
		id: Utils.guid(),
		name: name
	};
};

export const RoleList: RoleModel[] = [
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
			FeatureUtils.createTraitFeature(TraitType.Endurance, 1),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1),
			FeatureUtils.createDamageCategoryTypeResistFeature(DamageCategoryType.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Overhead strike'),
			createActionPlaceholder('Knockdown strike'),
			createActionPlaceholder('Stunning strike'),
			createActionPlaceholder('Haymaker strike')
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
			FeatureUtils.createTraitFeature(TraitType.Speed, 1),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2)
		],
		actions: [
			createActionPlaceholder('Dual strike (one target)'),
			createActionPlaceholder('Dual strike (two targets)'),
			createActionPlaceholder('Whirlwind strike'),
			createActionPlaceholder('Leaping strike'),
			createActionPlaceholder('Dodging stance (adds physical damage resistance)')
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
			FeatureUtils.createTraitFeature(TraitType.Resolve, 1),
			FeatureUtils.createSkillFeature(SkillType.Spellcasting, 2),
			FeatureUtils.createDamageBonusFeature(DamageType.Psychic, 1),
			FeatureUtils.createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			createActionPlaceholder('Confusion (target makes attack)'),
			createActionPlaceholder('Stun (target loses action)'),
			createActionPlaceholder('Fear (target loses speed)'),
			createActionPlaceholder('Mental shield (add psychic damage resistance)'),
			createActionPlaceholder('Weaken (reduce target\'s damage)')
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
			FeatureUtils.createTraitFeature(TraitType.Speed, 1),
			FeatureUtils.createSkillFeature(SkillType.Brawl, 2),
			FeatureUtils.createSkillFeature(SkillType.Stealth, 2),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Roundhouse kick'),
			createActionPlaceholder('Flurry (single target)'),
			createActionPlaceholder('Leaping kick'),
			createActionPlaceholder('Lightning speed (move)'),
			createActionPlaceholder('Adrenal boost (adds to attack / damage)')
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
			FeatureUtils.createTraitFeature(TraitType.Speed, 1),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2)
		],
		actions: [
			createActionPlaceholder('Deadeye (adds to next attack)'),
			createActionPlaceholder('Fire'),
			createActionPlaceholder('Pommel strike'),
			createActionPlaceholder('Quickfire (two attacks, low accuracy)'),
			createActionPlaceholder('Careful shot'),
			createActionPlaceholder('Fusilade (area, low damage)')
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
			FeatureUtils.createTraitFeature(TraitType.Endurance, 1),
			FeatureUtils.createSkillFeature(SkillType.Perception, 2),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2)
		],
		actions: [
			createActionPlaceholder('Quick shot'),
			createActionPlaceholder('Sure shot'),
			createActionPlaceholder('Pinning shot (slows)'),
			createActionPlaceholder('Barrage (area, low damage)'),
			createActionPlaceholder('Aim (adds to next attack)')
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
			FeatureUtils.createTraitFeature(TraitType.Endurance, 1),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Charge attack'),
			createActionPlaceholder('Precise attack'),
			createActionPlaceholder('Disarming attack'),
			createActionPlaceholder('Parrying stance'),
			createActionPlaceholder('Shield bash (push)')
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
			FeatureUtils.createTraitFeature(TraitType.Resolve, 1),
			FeatureUtils.createSkillFeature(SkillType.Spellcasting, 2),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1),
			FeatureUtils.createDamageCategoryTypeResistFeature(DamageCategoryType.Energy, 1),
			FeatureUtils.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Fire, 1),
			FeatureUtils.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Cold, 1),
			FeatureUtils.createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Electricity, 1)
		],
		actions: [
			createActionPlaceholder('Lightning bolt (single target, damage and stuns)'),
			createActionPlaceholder('Fireball (area, ongoing fire damage)'),
			createActionPlaceholder('Ice storm (area, damage and reduced speed)'),
			createActionPlaceholder('Elemental resistance: fire'),
			createActionPlaceholder('Elemental resistance: cold'),
			createActionPlaceholder('Elemental resistance: electricity')
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
			FeatureUtils.createTraitFeature(TraitType.Resolve, 1),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Flaming blade (ongoing fire)'),
			createActionPlaceholder('Frost blade (slows)'),
			createActionPlaceholder('Shocking blade (stuns)'),
			createActionPlaceholder('Armor enhancement'),
			createActionPlaceholder('XXX (attack at range)')
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
			FeatureUtils.createTraitFeature(TraitType.Resolve, 1),
			FeatureUtils.createSkillFeature(SkillType.Spellcasting, 2),
			FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, 1)
		],
		actions: [
			createActionPlaceholder('XXX (shield self, resist all damage)'),
			createActionPlaceholder('XXX (shield other, resist all damage)'),
			createActionPlaceholder('XXX (push)'),
			createActionPlaceholder('Magic missile'),
			createActionPlaceholder('Swap positions')
		]
	}
];
