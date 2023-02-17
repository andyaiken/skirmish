import { draw } from '../utils/collections';
import { generateName } from '../utils/name-generator';
import { randomBonus, randomBoolean, randomNumber } from '../utils/random';
import { guid } from '../utils/utils';
import { ActionModel, getRandomAction } from './action';
import { DamageCategory, DamageType, getRandomDamageType } from './damage';
import {
	createDamageCategoryBonusFeature,
	createDamageCategoryResistFeature,
	createRandomFeature,
	createSkillCategoryFeature,
	createSkillFeature,
	createTraitFeature,
	FeatureModel,
	FeatureType
} from './feature';
import { ItemLocationType } from './item-location';
import { ItemProficiencyType } from './item-proficiency';
import { getRandomSkill, SkillCategoryType, SkillType } from './skill';
import { TraitType } from './trait';

interface WeaponModel {
	damage: {
		type: DamageType;
		rank: number;
	};
	range: number;
	unreliable: number;
}

export interface ItemModel {
	id: string;
	name: string;
	baseItem: string;
	magic: boolean;
	proficiency: ItemProficiencyType;
	location: ItemLocationType;
	slots: number;
	weapon: WeaponModel | null;
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

	return addMagicItemFeature(item);
};

const addMagicItemFeature = (item: ItemModel) => {
	const options: ItemModel[] = [];

	if (item.weapon) {
		// Increase damage rank
		const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
		const wpn1 = copy1.weapon as WeaponModel;
		wpn1.damage.rank += randomBonus();
		options.push(copy1);

		// Increase range
		const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
		const wpn2 = copy2.weapon as WeaponModel;
		if (wpn2.range === 0) {
			wpn2.range = 1;
		} else {
			wpn2.range += Math.floor(wpn2.range * randomBonus() / 10);
		}
		options.push(copy2);

		// Change damage type
		const copy3 = JSON.parse(JSON.stringify(item)) as ItemModel;
		const wpn3 = copy3.weapon as WeaponModel;
		wpn3.damage.type = getRandomDamageType(randomBoolean() ? DamageCategory.Energy : DamageCategory.Corruption);
		options.push(copy3);

		// Increase Weapon skill
		const copy4 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy4.features.push(createSkillFeature(SkillType.Weapon, randomBonus()));
		options.push(copy4);

		// Negate unreliability
		if (item.weapon.unreliable > 0) {
			const copy5 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn5 = copy5.weapon as WeaponModel;
			wpn5.unreliable = 0;
			options.push(copy5);
		}
	}

	if (item.proficiency === ItemProficiencyType.Implements) {
		// Increase Spellcasting skill
		const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy1.features.push(createSkillFeature(SkillType.Spellcasting, randomBonus()));
		options.push(copy1);

		// Increase Energy damage
		const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy2.features.push(createDamageCategoryBonusFeature(DamageCategory.Energy, randomBonus()));
		options.push(copy2);

		// Increase Corruption damage
		const copy3 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy3.features.push(createDamageCategoryBonusFeature(DamageCategory.Corruption, randomBonus()));
		options.push(copy3);
	}

	if ((item.proficiency === ItemProficiencyType.LightArmor) || (item.proficiency === ItemProficiencyType.HeavyArmor) || (item.proficiency === ItemProficiencyType.Shields)) {
		// Increase damage resistance rank
		const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
		const feature = copy.features.find(f => f.type === FeatureType.DamageCategoryResist);
		if (feature) {
			feature.rank += randomBonus();
			options.push(copy);
		}
	}

	item.features.filter(f => f.rank < 0).forEach(penalty => {
		// Negate the penalty
		const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy.features = copy.features.filter(f => f.id !== penalty.id);
		options.push(copy);
	});

	if (item.location === ItemLocationType.Head) {
		// Increase a mental skill
		const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy1.features.push(createSkillFeature(getRandomSkill(SkillCategoryType.Mental), randomBonus()));
		options.push(copy1);

		// Increase all physical or mental skills
		const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy2.features.push(createSkillCategoryFeature(randomBoolean() ? SkillCategoryType.Physical : SkillCategoryType.Mental, randomBonus()));
		options.push(copy2);

		// Increase Resolve
		const copy3 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy3.features.push(createTraitFeature(TraitType.Resolve, randomBonus()));
		options.push(copy3);
	}

	if (item.location === ItemLocationType.Feet) {
		// Increase Speed
		const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy.features.push(createTraitFeature(TraitType.Speed, randomBonus()));
		options.push(copy);
	}

	if (item.location === ItemLocationType.Neck) {
		// Increase Endurance
		const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy1.features.push(createTraitFeature(TraitType.Speed, randomBonus()));
		options.push(copy1);

		// Increase Resolve
		const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
		copy2.features.push(createTraitFeature(TraitType.Resolve, randomBonus()));
		options.push(copy2);
	}

	// A random feature
	const copyFeature = JSON.parse(JSON.stringify(item)) as ItemModel;
	copyFeature.features.push(createRandomFeature());
	options.push(copyFeature);

	// a random action
	const copyAction = JSON.parse(JSON.stringify(item)) as ItemModel;
	copyAction.actions.push(getRandomAction());
	options.push(copyFeature);

	const n = randomNumber(options.length);
	return options[n];
};
