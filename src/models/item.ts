import { ItemList } from '../data/item-list';
import { draw } from '../utils/collections';
import { generateName } from '../utils/name-generator';
import { guid } from '../utils/utils';
import { Action } from './action';
import { DamageType } from './damage';
import { Feature } from './feature';
import { ItemLocation } from './item-location';
import { Proficiency } from './proficiency';

export interface Item {
	id: string;
	name: string;

	proficiency: Proficiency;
	location: ItemLocation;
	slots: number;

	weapon: {
		damage: {
			type: DamageType;
			rank: number;
		};
		range: number;
		unreliable: number;
	} | null;

	features: Feature[];
	actions: Action[];
}

export const unarmedAttack = {
	id: 'item-punch',
	name: 'Punch',
	proficiency: Proficiency.None,
	location: ItemLocation.None,
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
}

export const getItem = (id: string) => {
	return ItemList.find(b => b.id === id);
}

export const getItems = (proficiency: Proficiency) => {
	return ItemList.filter(i => i.proficiency === proficiency);
}

export const generateMagicItem = (): Item => {
	// Pick a random item from the item list
	const baseItem = draw(ItemList);
	const item = JSON.parse(JSON.stringify(baseItem)) as Item;

	// Change its ID and name
	item.id = guid();
	item.name = `${item.name}: ${generateName()}`;

	// TODO: Add features or actions

	return item;
}
