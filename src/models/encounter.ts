import type { CombatDataModel } from './combat-data';
import type { CombatantModel } from './combatant';
import type { EncounterMapModel } from './encounter-map';

export interface EncounterModel {
	regionID: string;
	combatants: CombatantModel[];
	combatData: CombatDataModel[];
	map: EncounterMapModel;
}
