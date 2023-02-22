import type { CombatantModel } from './combatant';
import type { EncounterMapModel } from './encounter-map';

export interface EncounterModel {
	regionID: string;
	combatants: CombatantModel[];
	map: EncounterMapModel;
}
