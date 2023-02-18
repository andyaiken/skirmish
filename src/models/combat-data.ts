import { ActionModel } from './action';
import { ConditionModel } from './condition';
import { CombatantType, CombatDataState } from './enums';

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
