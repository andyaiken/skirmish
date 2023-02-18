import type { CombatDataState } from '../enums/combat-data-state';
import type { CombatantType } from '../enums/combatant-type';
import type { ActionModel } from './action';
import type { ConditionModel } from './condition';

export interface CombatDataModel {
	id: string;
	type: CombatantType;
	size: number;
	state: CombatDataState;
	position: {
		x: number;
		y: number;
	};
	damage: number;
	wounds: number;
	initiative: number;
	movement: number;
	senses: number;
	hidden: number;
	conditions: ConditionModel[];
	actions: ActionModel[];
}
