import { createMap, EncounterMap } from './encounter-map';
import { Monster } from './monster';

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

export const createEncounter = (): Encounter => {
	return {
		heroIDs: [],
		monsters: [],
		map: createMap()
	};
}

export const getState = (encounter: Encounter): EncounterState => {
	// TODO
	return EncounterState.Active;
}
