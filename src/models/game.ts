import { BoonModel } from './boon';
import { CampaignMapModel, generateCampaignMap } from './campaign-map';
import { EncounterModel } from './encounter';
import { createHero, HeroModel } from './hero';
import { ItemModel } from './item';

export interface GameModel {
	heroes: HeroModel[];
	items: ItemModel[];
	boons: BoonModel[];
	map: CampaignMapModel;
	encounter: EncounterModel | null;
}

export const createGame = (): GameModel => {
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

export const addHeroToGame = (game: GameModel, hero: HeroModel) => {
	const index = game.heroes.findIndex(h => h.id === hero.id);
	if (index === -1) {
		game.heroes.push(hero);
	} else {
		game.heroes[index] = hero;
	}
	game.heroes.sort((a, b) => a.name > b.name ? 1 : -1);
}
