import type { RegionModel } from './region';

export interface CampaignMapSquareModel {
	x: number;
	y: number;
	regionID: string;
	terrain: string;
	height: number;
	// A road is a conquered square on the path between a conquered settlement and the rest of
	// the player's land. A settlement is the one square of a region where its label goes, and stays on its square after
	// the region is conquered. 'lake' only exists while a map is being generated; finished maps leave lakes out entirely
	feature?: 'peak' | 'lake' | 'settlement' | 'road';
}

export interface CampaignMapModel {
	squares: CampaignMapSquareModel[];
	regions: RegionModel[];
	seed: string;
	history: { regionID: string, name: string, x: number, y: number }[];
}
