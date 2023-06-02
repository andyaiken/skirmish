import type { BoonModel } from './boon';
import type { EncounterModel } from './encounter';

export interface RegionModel {
	id: string;
	name: string;
	color: string;
	encounters: string[];
	pausedEncounter: EncounterModel | null;
	boon: BoonModel;
	demographics: {
		size: number;
		population: number;
		speciesIDs: string[];
		terrain: string;
	};
}
