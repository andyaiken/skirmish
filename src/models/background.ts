import { BackgroundList } from '../data/background-list';
import { Action } from './action';
import { Feature } from './feature';

export interface Background {
	id: string;
	name: string;
	features: Feature[];
	actions: Action[];
}

export const getBackground = (id: string) => {
	return BackgroundList.find(b => b.id === id);
}

export const getBackgroundDeck = () => {
	const deck: string[] = [];

	BackgroundList.forEach(b => {
		deck.push(b.id);
	});

	return deck;
}
