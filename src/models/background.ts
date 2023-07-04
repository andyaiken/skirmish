import type { ActionModel } from './action';
import type { FeatureModel } from './feature';

export interface BackgroundModel {
	id: string;
	name: string;
	packID: string;
	description: string;
	features: FeatureModel[];
	actions: ActionModel[];
}
