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

export const getSpecies = (id: string) => {
	return SpeciesList.find(s => s.id === id);
}

export const getSpeciesDeck = () => {
	const deck: string[] = [];

	SpeciesList.forEach(s => {
		deck.push(s.id);
	});

	return deck;
}
