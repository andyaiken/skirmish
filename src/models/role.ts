import type { ActionModel } from './action';
import type { FeatureModel } from './feature';

export interface RoleModel {
	id: string;
	name: string;
	packID: string;
	description: string;
	startingFeatures: FeatureModel[];
	features: FeatureModel[];
	actions: ActionModel[];
}
