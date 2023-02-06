import { BackgroundList } from '../data/background-list';
import { Action } from './action';
import { Feature } from './feature';
import { Game } from './game';

export interface Background {
	id: string;
	name: string;
	features: Feature[];
	actions: Action[];
}

export const getBackground = (id: string) => {
	return BackgroundList.find(b => b.id === id);
}

export const getBackgroundDeck = (game: Game) => {
	const used = game.heroes.map(h => h.backgroundID);

	const deck = BackgroundList
		.filter(background => !used.includes(background.id))
		.map(background => background.id);

	if (deck.length >= 3) {
		return deck;
	}

	return BackgroundList.map(background => background.id);
}
