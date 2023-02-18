import { EncounterMapSquareType } from './enums';

export interface EncounterMapSquareModel {
	x: number;
	y: number;
	type: EncounterMapSquareType;
}

export interface EncounterMapModel {
	squares: EncounterMapSquareModel[];
}
