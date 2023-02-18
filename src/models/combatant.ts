import type { CombatantType } from '../enums/combatant-type';
import type { FeatureModel } from './feature';
import type { ItemModel } from './item';

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
