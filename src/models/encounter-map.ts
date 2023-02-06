export interface EncounterMapSquare {
	id: string;
	x: number;
	y: number;
}

export interface EncounterMap {
	squares: { x: number, y: number }[];
}

export const generateEncounterMap = (): EncounterMap => {
	// TODO: Generate an encounter map
	return {
		squares: []
	};
}
