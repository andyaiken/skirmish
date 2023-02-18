import { ActionModel } from './action';
import { FeatureModel } from './feature';

export interface BackgroundModel {
	id: string;
	name: string;
	features: FeatureModel[];
	actions: ActionModel[];
}
