import { SpeciesList } from '../data/species-list';
import { Action } from './action';
import { Feature } from './feature';
import { Game } from './game';
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

export const getSpeciesDeck = (game: Game) => {
	const used = game.heroes.map(h => h.speciesID);

	const deck = SpeciesList
		.filter(species => !used.includes(species.id))
		.map(species => species.id);

	if (deck.length >= 3) {
		return deck;
	}

	return SpeciesList.map(species => species.id);
}
