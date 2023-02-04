import { CampaignMap, createMap } from './campaign-map';
import { Encounter } from './encounter';
import { createHero, Hero } from './hero';
import { Item } from './item';

export interface Game {
	heroes: Hero[];
	items: Item[];
	map: CampaignMap | null;
	encounter: Encounter | null;
}

export const createGame = (): Game => {
	return {
		heroes: [
			createHero(),
			createHero(),
			createHero(),
			createHero(),
			createHero()
		],
		items: [],
		map: createMap(),
		encounter: null
	};
}
