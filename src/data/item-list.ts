import { DamageCategory, DamageType } from '../models/damage';
import { FeatureHelper } from '../models/feature';
import { Item } from '../models/item';
import { Location } from '../models/location';
import { Proficiency } from '../models/proficiency';
import { SkillCategory } from '../models/skill';
import { Trait } from '../models/trait';

export const ItemList: Item[] = [
	{
		id: 'item-punch',
		name: 'Punch',
		proficiency: Proficiency.None,
		location: Location.None,
		weapon: {
			damage: {
				type: DamageType.Impact,
				rank: 0
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-longsword',
		name: 'Longsword',
		proficiency: Proficiency.MilitaryWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Edged,
				rank: 3
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-handaxe',
		name: 'Handaxe',
		proficiency: Proficiency.MilitaryWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Edged,
				rank: 3
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-mace',
		name: 'Mace',
		proficiency: Proficiency.MilitaryWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Impact,
				rank: 3
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-morningstar',
		name: 'Morningstar',
		proficiency: Proficiency.MilitaryWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Impact,
				rank: 4
			},
			range: 0,
			unreliable: 1
		},
		features: [],
		actions: []
	},
	{
		id: 'item-spear',
		name: 'Spear',
		proficiency: Proficiency.MilitaryWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 2
			},
			range: 1,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-mattock',
		name: 'Mattock',
		proficiency: Proficiency.MilitaryWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 3
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-rapier',
		name: 'Rapier',
		proficiency: Proficiency.MilitaryWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 3
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-greatsword',
		name: 'Greatsword',
		proficiency: Proficiency.LargeWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Edged,
				rank: 5
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-battleaxe',
		name: 'Battleaxe',
		proficiency: Proficiency.LargeWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Edged,
				rank: 5
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-glaive',
		name: 'Glaive',
		proficiency: Proficiency.LargeWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Edged,
				rank: 4
			},
			range: 1,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-warhammer',
		name: 'Warhammer',
		proficiency: Proficiency.LargeWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Impact,
				rank: 5
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-quarterstaff',
		name: 'Quarterstaff',
		proficiency: Proficiency.LargeWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Impact,
				rank: 5
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-pike',
		name: 'Pike',
		proficiency: Proficiency.LargeWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 4
			},
			range: 1,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-trident',
		name: 'Trident',
		proficiency: Proficiency.LargeWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 5
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-dagger',
		name: 'Dagger',
		proficiency: Proficiency.PairedWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Edged,
				rank: 2
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-sai',
		name: 'Sai',
		proficiency: Proficiency.PairedWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 2
			},
			range: 0,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-longbow',
		name: 'Longbow',
		proficiency: Proficiency.RangedWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 3
			},
			range: 10,
			unreliable: 0
		},
		features: [],
		actions: []
	},
	{
		id: 'item-crossbow',
		name: 'Crossbow',
		proficiency: Proficiency.RangedWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 3
			},
			range: 15,
			unreliable: 1
		},
		features: [],
		actions: []
	},
	{
		id: 'item-rifle',
		name: 'Rifle',
		proficiency: Proficiency.PowderWeapons,
		location: Location.TwoHands,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 5
			},
			range: 15,
			unreliable: 2
		},
		features: [],
		actions: []
	},
	{
		id: 'item-pistol',
		name: 'Pistol',
		proficiency: Proficiency.PowderWeapons,
		location: Location.Hand,
		weapon: {
			damage: {
				type: DamageType.Piercing,
				rank: 4
			},
			range: 10,
			unreliable: 2
		},
		features: [],
		actions: []
	},
	{
		id: 'item-orb',
		name: 'Orb',
		proficiency: Proficiency.Implements,
		location: Location.Hand,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-wand',
		name: 'Wand',
		proficiency: Proficiency.Implements,
		location: Location.Hand,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-tome',
		name: 'Tome',
		proficiency: Proficiency.Implements,
		location: Location.Hand,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-amulet',
		name: 'Amulet',
		proficiency: Proficiency.Implements,
		location: Location.Neck,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-leather-armor',
		name: 'Leather Armor',
		proficiency: Proficiency.LightArmor,
		location: Location.Body,
		weapon: null,
		features: [
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 1)
		],
		actions: []
	},
	{
		id: 'item-hide-armor',
		name: 'Hide Armor',
		proficiency: Proficiency.LightArmor,
		location: Location.Body,
		weapon: null,
		features: [
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 2),
			FeatureHelper.createSkillCategoryFeature(SkillCategory.Physical, -1)
		],
		actions: []
	},
	{
		id: 'item-brigandine-armor',
		name: 'Brigandine Armor',
		proficiency: Proficiency.LightArmor,
		location: Location.Body,
		weapon: null,
		features: [
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 3),
			FeatureHelper.createSkillCategoryFeature(SkillCategory.Physical, -1),
			FeatureHelper.createTraitFeature(Trait.Speed, -1)
		],
		actions: []
	},
	{
		id: 'item-chain-armor',
		name: 'Chain Armor',
		proficiency: Proficiency.HeavyArmor,
		location: Location.Body,
		weapon: null,
		features: [
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 4),
			FeatureHelper.createSkillCategoryFeature(SkillCategory.Physical, -2),
			FeatureHelper.createTraitFeature(Trait.Speed, -1)
		],
		actions: []
	},
	{
		id: 'item-plate-armor',
		name: 'Plate Armor',
		proficiency: Proficiency.HeavyArmor,
		location: Location.Body,
		weapon: null,
		features: [
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 5),
			FeatureHelper.createSkillCategoryFeature(SkillCategory.Physical, -3),
			FeatureHelper.createTraitFeature(Trait.Speed, -2)
		],
		actions: []
	},
	{
		id: 'item-shield',
		name: 'Shield',
		proficiency: Proficiency.Shields,
		location: Location.Hand,
		weapon: null,
		features: [
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 1),
			FeatureHelper.createSkillCategoryFeature(SkillCategory.Physical, -1)
		],
		actions: []
	},
	{
		id: 'item-tower-shield',
		name: 'Tower shield',
		proficiency: Proficiency.Shields,
		location: Location.Hand,
		weapon: null,
		features: [
			FeatureHelper.createDamageCategoryResistFeature(DamageCategory.Physical, 2),
			FeatureHelper.createSkillCategoryFeature(SkillCategory.Physical, -2)
		],
		actions: []
	}
];
