import { CombatantType } from './enums';
import { FeatureModel } from './feature';
import { ItemModel } from './item';

export interface CombatantModel {
	id: string;
	type: CombatantType;
	name: string;

	speciesID: string;
	roleID: string;
	backgroundID: string;

	size: number;
	level: number;
	xp: number;

	features: FeatureModel[];
	items: ItemModel[];
}
