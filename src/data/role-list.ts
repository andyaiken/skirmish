import { ActionHelper } from '../models/action';
import { DamageCategory, DamageType } from '../models/damage';
import { FeatureHelper } from '../models/feature';
import { Proficiency } from '../models/proficiency';
import { Role } from '../models/role';
import { Skill } from '../models/skill';
import { Trait } from '../models/trait';

export const RoleList: Role[] = [
	{
		id: 'role-barbarian',
		name: 'Barbarian',
		traits: [
			Trait.Endurance
		],
		skills: [
			Skill.Weapon
		],
		proficiencies: [
			Proficiency.LargeWeapons,
			Proficiency.LightArmor
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Endurance, 1),
			FeatureHelper.createSkillFeature(Skill.Weapon, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Physical, 1),
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Overhead strike'),
			ActionHelper.createPlaceholder('Knockdown strike'),
			ActionHelper.createPlaceholder('Stunning strike'),
			ActionHelper.createPlaceholder('Haymaker strike')
		]
	},
	{
		id: 'role-dervish',
		name: 'Dervish',
		traits: [
			Trait.Speed
		],
		skills: [
			Skill.Weapon
		],
		proficiencies: [
			Proficiency.PairedWeapons,
			Proficiency.LightArmor
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Speed, 1),
			FeatureHelper.createSkillFeature(Skill.Weapon, 2)
		],
		actions: [
			ActionHelper.createPlaceholder('Dual strike (one target)'),
			ActionHelper.createPlaceholder('Dual strike (two targets)'),
			ActionHelper.createPlaceholder('Whirlwind strike'),
			ActionHelper.createPlaceholder('Leaping strike'),
			ActionHelper.createPlaceholder('Dodging stance (adds physical damage resistance)')
		]
	},
	{
		id: 'role-enchanter',
		name: 'Enchanter',
		traits: [
			Trait.Resolve
		],
		skills: [
			Skill.Spellcasting
		],
		proficiencies: [
			Proficiency.Implements
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createSkillFeature(Skill.Spellcasting, 2),
			FeatureHelper.createDamageBonusFeature(DamageType.Psychic, 1),
			FeatureHelper.createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Confusion (target makes attack)'),
			ActionHelper.createPlaceholder('Stun (target loses action)'),
			ActionHelper.createPlaceholder('Fear (target loses speed)'),
			ActionHelper.createPlaceholder('Mental shield (add psychic damage resistance)'),
			ActionHelper.createPlaceholder('Weaken (reduce target\'s damage)')
		]
	},
	{
		id: 'role-ninja',
		name: 'Ninja',
		traits: [
			Trait.Speed
		],
		skills: [
			Skill.Brawl,
			Skill.Stealth
		],
		proficiencies: [
			// None
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Speed, 1),
			FeatureHelper.createSkillFeature(Skill.Brawl, 2),
			FeatureHelper.createSkillFeature(Skill.Stealth, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Roundhouse kick'),
			ActionHelper.createPlaceholder('Flurry (single target)'),
			ActionHelper.createPlaceholder('Leaping kick'),
			ActionHelper.createPlaceholder('Lightning speed (move)'),
			ActionHelper.createPlaceholder('Adrenal boost (adds to attack / damage)')
		]
	},
	{
		id: 'role-gunslinger',
		name: 'Gunslinger',
		traits: [
			Trait.Speed
		],
		skills: [
			Skill.Weapon
		],
		proficiencies: [
			Proficiency.PowderWeapons
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Speed, 1),
			FeatureHelper.createSkillFeature(Skill.Weapon, 2)
		],
		actions: [
			ActionHelper.createPlaceholder('Deadeye (adds to next attack)'),
			ActionHelper.createPlaceholder('Fire'),
			ActionHelper.createPlaceholder('Pommel strike'),
			ActionHelper.createPlaceholder('Quickfire (two attacks, low accuracy)'),
			ActionHelper.createPlaceholder('Careful shot'),
			ActionHelper.createPlaceholder('Fusilade (area, low damage)')
		]
	},
	{
		id: 'role-ranger',
		name: 'Ranger',
		traits: [
			Trait.Endurance
		],
		skills: [
			Skill.Weapon
		],
		proficiencies: [
			Proficiency.RangedWeapons,
			Proficiency.LightArmor
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Endurance, 1),
			FeatureHelper.createSkillFeature(Skill.Perception, 2),
			FeatureHelper.createSkillFeature(Skill.Weapon, 2)
		],
		actions: [
			ActionHelper.createPlaceholder('Quick shot'),
			ActionHelper.createPlaceholder('Sure shot'),
			ActionHelper.createPlaceholder('Pinning shot (slows)'),
			ActionHelper.createPlaceholder('Barrage (area, low damage)'),
			ActionHelper.createPlaceholder('Aim (adds to next attack)')
		]
	},
	{
		id: 'role-soldier',
		name: 'Soldier',
		traits: [
			Trait.Endurance
		],
		skills: [
			Skill.Weapon
		],
		proficiencies: [
			Proficiency.MilitaryWeapons,
			Proficiency.HeavyArmor,
			Proficiency.Shields
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Endurance, 1),
			FeatureHelper.createSkillFeature(Skill.Weapon, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Charge attack'),
			ActionHelper.createPlaceholder('Precise attack'),
			ActionHelper.createPlaceholder('Disarming attack'),
			ActionHelper.createPlaceholder('Parrying stance'),
			ActionHelper.createPlaceholder('Shield bash (push)')
		]
	},
	{
		id: 'role-sorcerer',
		name: 'Sorcerer',
		traits: [
			Trait.Resolve
		],
		skills: [
			Skill.Spellcasting
		],
		proficiencies: [
			Proficiency.Implements
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createSkillFeature(Skill.Spellcasting, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Energy, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Lightning bolt (single target, damage and stuns)'),
			ActionHelper.createPlaceholder('Fireball (area, ongoing fire damage)'),
			ActionHelper.createPlaceholder('Ice storm (area, damage and reduced speed)'),
			ActionHelper.createPlaceholder('Elemental resistance'),
			ActionHelper.createPlaceholder('Elemental aura (damage to nearby enemies)')
		]
	},
	{
		id: 'role-warmage',
		name: 'Warmage',
		traits: [
			Trait.Resolve
		],
		skills: [
			Skill.Weapon
		],
		proficiencies: [
			Proficiency.MilitaryWeapons,
			Proficiency.LightArmor
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createSkillFeature(Skill.Weapon, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Energy, 1),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('Flaming blade (ongoing fire)'),
			ActionHelper.createPlaceholder('Frost blade (slows)'),
			ActionHelper.createPlaceholder('Shocking blade (stuns)'),
			ActionHelper.createPlaceholder('Armor enhancement'),
			ActionHelper.createPlaceholder('XXX (attack at range)')
		]
	},
	{
		id: 'role-wizard',
		name: 'Wizard',
		traits: [
			Trait.Resolve
		],
		skills: [
			Skill.Spellcasting
		],
		proficiencies: [
			Proficiency.Implements
		],
		features: [
			FeatureHelper.createTraitFeature(Trait.Resolve, 1),
			FeatureHelper.createSkillFeature(Skill.Spellcasting, 2),
			FeatureHelper.createDamageCategoryBonusFeature(DamageCategory.Energy, 1)
		],
		actions: [
			ActionHelper.createPlaceholder('XXX (shield self, resist all damage)'),
			ActionHelper.createPlaceholder('XXX (shield other, resist all damage)'),
			ActionHelper.createPlaceholder('XXX (push)'),
			ActionHelper.createPlaceholder('Magic missile'),
			ActionHelper.createPlaceholder('Swap positions')
		]
	}
];
