import type { CombatantType } from '../enums/combatant-type';
import type { QuirkType } from '../enums/quirk-type';

import type { ActionModel } from './action';
import type { FeatureModel } from './feature';

export interface SpeciesModel {
	id: string;
	name: string;
	packID: string;
	description: string;
	type: CombatantType
	size: number;
	quirks: QuirkType[];
	startingFeatures: FeatureModel[];
	features: FeatureModel[];
	actions: ActionModel[];
}
