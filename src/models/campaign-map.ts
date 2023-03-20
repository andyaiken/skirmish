import type { RegionModel } from './region';

export interface CampaignMapSquareModel {
	x: number;
	y: number;
	regionID: string;
}

export interface CampaignMapModel {
	squares: CampaignMapSquareModel[];
	regions: RegionModel[];
}
