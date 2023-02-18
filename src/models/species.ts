import type { ActionModel } from './action';
import type { TraitType } from '../enums/trait-type';
import type { FeatureModel } from './feature';

export interface SpeciesModel {
	id: string;
	name: string;
	size: number;
	traits: TraitType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
