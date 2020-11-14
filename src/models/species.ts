import { SpeciesList } from '../data/species-list';
import { Action } from './action';
import { Feature } from './feature';
import { Trait } from './trait';

export interface Species {
	id: string;
	name: string;
	traits: Trait[];
	features: Feature[];
	actions: Action[];
}

export class SpeciesHelper {
	public static getSpecies(id: string) {
		return SpeciesList.find(s => s.id === id);
	}

	public static getDeck() {
		const deck: string[] = [];

		SpeciesList.forEach(s => {
			deck.push(s.id);
		});

		return deck;
	}
}
