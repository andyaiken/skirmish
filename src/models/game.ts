import type { BoonModel } from './boon';
import type { CampaignMapModel } from './campaign-map';
import type { EncounterModel } from './encounter';
import type { CombatantModel } from './combatant';
import type { ItemModel } from './item';

export interface GameModel {
	heroes: CombatantModel[];
	items: ItemModel[];
	boons: BoonModel[];
	map: CampaignMapModel;
	encounter: EncounterModel | null;
}
