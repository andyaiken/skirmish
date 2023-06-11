import type { BoonModel } from './boon';

export interface RegionModel {
	id: string;
	name: string;
	color: string;
	encounters: string[];
	boon: BoonModel;
	demographics: {
		size: number;
		population: number;
		speciesIDs: string[];
		terrain: string;
	};
}
