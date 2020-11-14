import { EncounterMap, EncounterMapHelper } from './encounter-map';
import { Monster } from './hero';

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
}
