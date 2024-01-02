import type { BoonModel } from './boon';
import type { CampaignMapModel } from './campaign-map';
import type { CombatantModel } from './combatant';
import type { EncounterModel } from './encounter';
import type { ItemModel } from './item';
import type { StructureModel } from './structure';

export interface GameModel {
	heroSlots: number;
	heroes: CombatantModel[];
	items: ItemModel[];
	boons: BoonModel[];
	money: number;
	map: CampaignMapModel;
	stronghold: StructureModel[];
	encounter: EncounterModel | null;
}
