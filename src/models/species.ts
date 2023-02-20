import type { ActionModel } from './action';
import type { FeatureModel } from './feature';
import type { TraitType } from '../enums/trait-type';

export interface SpeciesModel {
	id: string;
	name: string;
	size: number;
	traits: TraitType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
