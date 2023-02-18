import type { EncounterMapSquareType } from '../enums/encounter-map-square-type';

export interface EncounterMapSquareModel {
	x: number;
	y: number;
	type: EncounterMapSquareType;
}

export interface EncounterMapModel {
	squares: EncounterMapSquareModel[];
}
