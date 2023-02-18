import type { CombatDataModel } from './combat-data';
import type { EncounterMapModel } from './encounter-map';
import type { CombatantModel } from './combatant';

export interface EncounterModel {
	regionID: string;
	combatants: CombatantModel[];
	combatData: CombatDataModel[];
	map: EncounterMapModel;
}
