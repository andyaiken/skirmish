import { createPlaceholder } from '../models/action';
import { DamageCategory, DamageType } from '../models/damage';
import { createDamageBonusFeature, createDamageCategoryBonusFeature, createDamageCategoryResistFeature, createDamageResistFeature, createSkillFeature, createTraitFeature } from '../models/feature';
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
			createTraitFeature(Trait.Endurance, 1),
			createSkillFeature(Skill.Weapon, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1),
			createDamageCategoryResistFeature(DamageCategory.Physical, 1)
		],
		actions: [
			createPlaceholder('Overhead strike'),
			createPlaceholder('Knockdown strike'),
			createPlaceholder('Stunning strike'),
			createPlaceholder('Haymaker strike')
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
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Weapon, 2)
		],
		actions: [
			createPlaceholder('Dual strike (one target)'),
			createPlaceholder('Dual strike (two targets)'),
			createPlaceholder('Whirlwind strike'),
			createPlaceholder('Leaping strike'),
			createPlaceholder('Dodging stance (adds physical damage resistance)')
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
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Spellcasting, 2),
			createDamageBonusFeature(DamageType.Psychic, 1),
			createDamageResistFeature(DamageType.Psychic, 1)
		],
		actions: [
			createPlaceholder('Confusion (target makes attack)'),
			createPlaceholder('Stun (target loses action)'),
			createPlaceholder('Fear (target loses speed)'),
			createPlaceholder('Mental shield (add psychic damage resistance)'),
			createPlaceholder('Weaken (reduce target\'s damage)')
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
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Brawl, 2),
			createSkillFeature(Skill.Stealth, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			createPlaceholder('Roundhouse kick'),
			createPlaceholder('Flurry (single target)'),
			createPlaceholder('Leaping kick'),
			createPlaceholder('Lightning speed (move)'),
			createPlaceholder('Adrenal boost (adds to attack / damage)')
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
			createTraitFeature(Trait.Speed, 1),
			createSkillFeature(Skill.Weapon, 2)
		],
		actions: [
			createPlaceholder('Deadeye (adds to next attack)'),
			createPlaceholder('Fire'),
			createPlaceholder('Pommel strike'),
			createPlaceholder('Quickfire (two attacks, low accuracy)'),
			createPlaceholder('Careful shot'),
			createPlaceholder('Fusilade (area, low damage)')
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
			createTraitFeature(Trait.Endurance, 1),
			createSkillFeature(Skill.Perception, 2),
			createSkillFeature(Skill.Weapon, 2)
		],
		actions: [
			createPlaceholder('Quick shot'),
			createPlaceholder('Sure shot'),
			createPlaceholder('Pinning shot (slows)'),
			createPlaceholder('Barrage (area, low damage)'),
			createPlaceholder('Aim (adds to next attack)')
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
			createTraitFeature(Trait.Endurance, 1),
			createSkillFeature(Skill.Weapon, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			createPlaceholder('Charge attack'),
			createPlaceholder('Precise attack'),
			createPlaceholder('Disarming attack'),
			createPlaceholder('Parrying stance'),
			createPlaceholder('Shield bash (push)')
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
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Spellcasting, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1)
		],
		actions: [
			createPlaceholder('Lightning bolt (single target, damage and stuns)'),
			createPlaceholder('Fireball (area, ongoing fire damage)'),
			createPlaceholder('Ice storm (area, damage and reduced speed)'),
			createPlaceholder('Elemental resistance'),
			createPlaceholder('Elemental aura (damage to nearby enemies)')
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
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Weapon, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
		],
		actions: [
			createPlaceholder('Flaming blade (ongoing fire)'),
			createPlaceholder('Frost blade (slows)'),
			createPlaceholder('Shocking blade (stuns)'),
			createPlaceholder('Armor enhancement'),
			createPlaceholder('XXX (attack at range)')
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
			createTraitFeature(Trait.Resolve, 1),
			createSkillFeature(Skill.Spellcasting, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1)
		],
		actions: [
			createPlaceholder('XXX (shield self, resist all damage)'),
			createPlaceholder('XXX (shield other, resist all damage)'),
			createPlaceholder('XXX (push)'),
			createPlaceholder('Magic missile'),
			createPlaceholder('Swap positions')
		]
	}
];
