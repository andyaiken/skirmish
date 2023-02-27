import type { BoonModel } from './boon';

export interface CampaignMapSquareModel {
	x: number;
	y: number;
	regionID: string;
}

export interface RegionModel {
	id: string;
	name: string;
	color: string;
	encounters: string[];
	boon: BoonModel;
	demographics: {
		size: number;
		population: number;
		terrain: string;
	};
}

export interface CampaignMapModel {
	squares: CampaignMapSquareModel[];
	regions: RegionModel[];
}
