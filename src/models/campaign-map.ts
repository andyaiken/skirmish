import type { BoonModel } from './boon';

export interface CampaignMapSquareModel {
	x: number;
	y: number;
	regionID: string;
}

export interface CampaignMapRegionModel {
	id: string;
	name: string;
	color: string;
	encounters: string[];
	boon: BoonModel;
}

export interface CampaignMapModel {
	squares: CampaignMapSquareModel[];
	regions: CampaignMapRegionModel[];
}
