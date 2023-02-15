import { ActionModel, createActionPlaceholder } from './action';
import { AuraType } from './aura';
import { DamageCategory, DamageType } from './damage';
import {
	createAuraDamageFeature,
	createDamageBonusFeature,
	createDamageCategoryBonusFeature,
	createDamageCategoryResistFeature,
	createDamageResistFeature,
	createSkillFeature,
	createTraitFeature,
	FeatureModel
} from './feature';
import { GameModel } from './game';
import { ItemProficiencyType } from './item-proficiency';
import { SkillType } from './skill';
import { TraitType } from './trait';

export interface RoleModel {
	id: string;
	name: string;
	traits: TraitType[];
	skills: SkillType[];
	proficiencies: ItemProficiencyType[];
	features: FeatureModel[];
	actions: ActionModel[];
}

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
			createTraitFeature(TraitType.Endurance, 1),
			createSkillFeature(SkillType.Weapon, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1),
			createDamageCategoryResistFeature(DamageCategory.Physical, 1)
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
			createTraitFeature(TraitType.Speed, 1),
			createSkillFeature(SkillType.Weapon, 2)
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
			createTraitFeature(TraitType.Resolve, 1),
			createSkillFeature(SkillType.Spellcasting, 2),
			createDamageBonusFeature(DamageType.Psychic, 1),
			createDamageResistFeature(DamageType.Psychic, 1)
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
			createTraitFeature(TraitType.Speed, 1),
			createSkillFeature(SkillType.Brawl, 2),
			createSkillFeature(SkillType.Stealth, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
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
			createTraitFeature(TraitType.Speed, 1),
			createSkillFeature(SkillType.Weapon, 2)
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
			createTraitFeature(TraitType.Endurance, 1),
			createSkillFeature(SkillType.Perception, 2),
			createSkillFeature(SkillType.Weapon, 2)
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
			createTraitFeature(TraitType.Endurance, 1),
			createSkillFeature(SkillType.Weapon, 2),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
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
			createTraitFeature(TraitType.Resolve, 1),
			createSkillFeature(SkillType.Spellcasting, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1),
			createDamageCategoryResistFeature(DamageCategory.Energy, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Fire, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Cold, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Electricity, 1)
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
			createTraitFeature(TraitType.Resolve, 1),
			createSkillFeature(SkillType.Weapon, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1)
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
			createTraitFeature(TraitType.Resolve, 1),
			createSkillFeature(SkillType.Spellcasting, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1)
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

export const getRole = (id: string) => {
	return RoleList.find(r => r.id === id);
};

export const getRoleDeck = (game: GameModel | null = null) => {
	if (game) {
		const used = game.heroes.map(h => h.roleID);

		const deck = RoleList
			.filter(role => !used.includes(role.id))
			.map(role => role.id);

		if (deck.length >= 3) {
			return deck;
		}
	}

	return RoleList.map(role => role.id);
};
