export interface EncounterMapSquareModel {
	id: string;
	x: number;
	y: number;
}

export interface EncounterMapModel {
	squares: EncounterMapSquareModel[];
}

export const generateEncounterMap = (): EncounterMapModel => {
	// TODO: Generate an encounter map
	return {
		squares: []
	};
}
