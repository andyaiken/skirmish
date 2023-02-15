import { draw } from '../utils/collections';
import { generateName } from '../utils/name-generator';
import { guid } from '../utils/utils';
import { ActionModel } from './action';
import { DamageCategory, DamageType } from './damage';
import { createDamageCategoryResistFeature, createSkillCategoryFeature, createTraitFeature, FeatureModel } from './feature';
import { ItemLocationType } from './item-location';
import { ItemProficiencyType } from './item-proficiency';
import { SkillCategoryType } from './skill';
import { TraitType } from './trait';

export interface ItemModel {
	id: string;
	name: string;
	baseItem: string;
	magic: boolean;
	proficiency: ItemProficiencyType;
	location: ItemLocationType;
	slots: number;
	weapon: {
		damage: {
			type: DamageType;
			rank: number;
		};
		range: number;
		unreliable: number;
	} | null;
	features: FeatureModel[];
	actions: ActionModel[];
}

export const unarmedAttack: ItemModel = {
	id: 'item-punch',
	name: 'Punch',
	baseItem: '',
	magic: false,
	proficiency: ItemProficiencyType.None,
	location: ItemLocationType.None,
	slots: 1,
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
};

export const ItemList: ItemModel[] = [
	{
		id: 'item-longsword',
		name: 'Longsword',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.MilitaryWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.MilitaryWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.MilitaryWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.MilitaryWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.MilitaryWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.MilitaryWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.MilitaryWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LargeWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LargeWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LargeWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LargeWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LargeWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LargeWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LargeWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		name: 'Daggers',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.PairedWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		name: 'Sais',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.PairedWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.RangedWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.RangedWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.PowderWeapons,
		location: ItemLocationType.Hand,
		slots: 2,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.PowderWeapons,
		location: ItemLocationType.Hand,
		slots: 1,
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
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.Implements,
		location: ItemLocationType.Hand,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-wand',
		name: 'Wand',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.Implements,
		location: ItemLocationType.Hand,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-tome',
		name: 'Tome',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.Implements,
		location: ItemLocationType.Hand,
		slots: 2,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-amulet',
		name: 'Amulet',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.Implements,
		location: ItemLocationType.Neck,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-leather-armor',
		name: 'Leather Armor',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LightArmor,
		location: ItemLocationType.Body,
		slots: 1,
		weapon: null,
		features: [
			createDamageCategoryResistFeature(DamageCategory.Physical, 1)
		],
		actions: []
	},
	{
		id: 'item-hide-armor',
		name: 'Hide Armor',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LightArmor,
		location: ItemLocationType.Body,
		slots: 1,
		weapon: null,
		features: [
			createDamageCategoryResistFeature(DamageCategory.Physical, 2),
			createSkillCategoryFeature(SkillCategoryType.Physical, -1)
		],
		actions: []
	},
	{
		id: 'item-brigandine-armor',
		name: 'Brigandine Armor',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.LightArmor,
		location: ItemLocationType.Body,
		slots: 1,
		weapon: null,
		features: [
			createDamageCategoryResistFeature(DamageCategory.Physical, 3),
			createSkillCategoryFeature(SkillCategoryType.Physical, -1),
			createTraitFeature(TraitType.Speed, -1)
		],
		actions: []
	},
	{
		id: 'item-chain-armor',
		name: 'Chain Armor',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.HeavyArmor,
		location: ItemLocationType.Body,
		slots: 1,
		weapon: null,
		features: [
			createDamageCategoryResistFeature(DamageCategory.Physical, 4),
			createSkillCategoryFeature(SkillCategoryType.Physical, -2),
			createTraitFeature(TraitType.Speed, -1)
		],
		actions: []
	},
	{
		id: 'item-plate-armor',
		name: 'Plate Armor',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.HeavyArmor,
		location: ItemLocationType.Body,
		slots: 1,
		weapon: null,
		features: [
			createDamageCategoryResistFeature(DamageCategory.Physical, 5),
			createSkillCategoryFeature(SkillCategoryType.Physical, -2),
			createTraitFeature(TraitType.Speed, -2)
		],
		actions: []
	},
	{
		id: 'item-shield',
		name: 'Shield',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.Shields,
		location: ItemLocationType.Hand,
		slots: 1,
		weapon: null,
		features: [
			createDamageCategoryResistFeature(DamageCategory.Physical, 1)
		],
		actions: []
	},
	{
		id: 'item-tower-shield',
		name: 'Tower shield',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.Shields,
		location: ItemLocationType.Hand,
		slots: 1,
		weapon: null,
		features: [
			createDamageCategoryResistFeature(DamageCategory.Physical, 2),
			createSkillCategoryFeature(SkillCategoryType.Physical, -1)
		],
		actions: []
	},
	{
		id: 'item-helm',
		name: 'Helm',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Head,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-circlet',
		name: 'Circlet',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Head,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-crown',
		name: 'Crown',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Head,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-tiara',
		name: 'Tiara',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Head,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-cloak',
		name: 'Cloak',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Neck,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-torc',
		name: 'Torc',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Neck,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-necklace',
		name: 'Necklace',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Neck,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-ring',
		name: 'Ring',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Ring,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	},
	{
		id: 'item-boots',
		name: 'Boots',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.Feet,
		slots: 1,
		weapon: null,
		features: [],
		actions: []
	}
];

export const getItem = (id: string) => {
	return ItemList.find(b => b.id === id);
};

export const getItems = (proficiency: ItemProficiencyType) => {
	return ItemList.filter(i => i.proficiency === proficiency);
};

export const generateMagicItem = (): ItemModel => {
	// Pick a random item from the item list
	const baseItem = draw(ItemList);

	const item = JSON.parse(JSON.stringify(baseItem)) as ItemModel;
	item.id = guid();
	item.baseItem = item.name;
	item.name = generateName();
	item.magic = true;

	// TODO: Add features or actions

	return item;
};
