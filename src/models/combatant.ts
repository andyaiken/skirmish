import type { CombatantState } from '../enums/combatant-state';
import type { CombatantType } from '../enums/combatant-type';

import type { ActionModel } from './action';
import type { ConditionModel } from './condition';
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
	carried: ItemModel[];

	combat: {
		current: boolean;
		state: CombatantState;
		stunned: boolean;
		position: {
			x: number;
			y: number;
		};
		trail: {
			x: number;
			y: number;
		}[];
		damage: number;
		wounds: number;
		initiative: number;
		movement: number;
		senses: number;
		hidden: number;
		conditions: ConditionModel[];
		actions: ActionModel[];
		actionLog: string[];
	}
}
