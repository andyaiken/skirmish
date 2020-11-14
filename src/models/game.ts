import { CampaignMap, CampaignMapHelper } from './campaign-map';
import { Encounter } from './encounter';
import { Hero, HeroHelper } from './hero';
import { Item } from './item';

export interface Game {
	heroes: Hero[];
	items: Item[];
	map: CampaignMap | null;
	encounter: Encounter | null;
}

export class GameHelper {
	public static createGame(): Game {
		return {
			heroes: [
				HeroHelper.createHero(),
				HeroHelper.createHero(),
				HeroHelper.createHero(),
				HeroHelper.createHero(),
				HeroHelper.createHero()
			],
			items: [],
			map: CampaignMapHelper.createMap(),
			encounter: null
		};
	}
}
