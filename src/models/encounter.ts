import { EncounterMap, EncounterMapHelper } from './encounter-map';
import { Monster } from './hero';

export enum EncounterState {
	Active,
	Won,
	Defeated
}

export interface Encounter {
	heroIDs: string[];
	monsters: Monster[];
	map: EncounterMap;
}

export class EncounterHelper {
	public static createEncounter(): Encounter {
		return {
			heroIDs: [],
			monsters: [],
			map: EncounterMapHelper.createMap()
		};
	}

	public static getState(encounter: Encounter): EncounterState {
		// TODO
		return EncounterState.Active;
	}
}
