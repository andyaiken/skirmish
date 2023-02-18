import { CombatDataModel } from './combat-data';
import { EncounterMapModel } from './encounter-map';
import { CombatantModel } from './combatant';

export interface EncounterModel {
	regionID: string;
	combatants: CombatantModel[];
	combatData: CombatDataModel[];
	map: EncounterMapModel;
}
