import { ActionModel } from './action';
import { TraitType } from './enums';
import { FeatureModel } from './feature';

export interface SpeciesModel {
	id: string;
	name: string;
	size: number;
	traits: TraitType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
