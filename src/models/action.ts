import type { CombatantModel } from './combatant';
import type { EncounterModel } from './encounter';

export interface ActionModel {
	id: string;
	name: string;
	isAvailable: (combatant: CombatantModel, encounter: EncounterModel) => boolean;
}
