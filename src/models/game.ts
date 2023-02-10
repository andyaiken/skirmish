import { BoonModel } from './boon';
import { CampaignMapModel, generateCampaignMap } from './campaign-map';
import { EncounterModel } from './encounter';
import { CombatantModel, CombatantType, createCombatant } from './combatant';
import { ItemModel } from './item';

export interface GameModel {
	heroes: CombatantModel[];
	items: ItemModel[];
	boons: BoonModel[];
	map: CampaignMapModel;
	encounter: EncounterModel | null;
}

export const createGame = (): GameModel => {
	return {
		heroes: [
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero),
			createCombatant(CombatantType.Hero)
		],
		items: [],
		boons: [],
		map: generateCampaignMap(),
		encounter: null
	};
}

export const addHeroToGame = (game: GameModel, hero: CombatantModel) => {
	const index = game.heroes.findIndex(h => h.id === hero.id);
	if (index === -1) {
		game.heroes.push(hero);
	} else {
		game.heroes[index] = hero;
	}
	game.heroes.sort((a, b) => a.name > b.name ? 1 : -1);
}
