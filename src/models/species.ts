import type { CombatantType } from '../enums/combatant-type';
import type { TraitType } from '../enums/trait-type';

import type { ActionModel } from './action';
import type { FeatureModel } from './feature';

export interface SpeciesModel {
	id: string;
	name: string;
	type: CombatantType
	size: number;
	traits: TraitType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
