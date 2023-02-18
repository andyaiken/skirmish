import { BoonModel } from './boon';
import { CampaignMapModel } from './campaign-map';
import { EncounterModel } from './encounter';
import { CombatantModel } from './combatant';
import { ItemModel } from './item';

export interface GameModel {
	heroes: CombatantModel[];
	items: ItemModel[];
	boons: BoonModel[];
	map: CampaignMapModel;
	encounter: EncounterModel | null;
}
