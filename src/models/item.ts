import { ItemList } from '../data/item-list';
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

export class ItemHelper {
	public static getItem(id: string) {
		return ItemList.find(b => b.id === id);
	}

	public static getItems(proficiency: Proficiency) {
		return ItemList.filter(i => i.proficiency === proficiency);
	}
}
