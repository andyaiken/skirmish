import { Boon } from './boon';
import { CampaignMap, generateCampaignMap } from './campaign-map';
import { Encounter } from './encounter';
import { createHero, Hero } from './hero';
import { Item } from './item';

export interface Game {
	heroes: Hero[];
	items: Item[];
	boons: Boon[];
	map: CampaignMap;
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
		boons: [],
		map: generateCampaignMap(),
		encounter: null
	};
}
