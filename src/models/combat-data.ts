import { ActionModel } from './action';
import { CombatantModel, CombatantType } from './combatant';
import { ConditionModel } from './condition';

export enum CombatDataState {
	Standing = 'Stand',
	Prone = 'Prone',
	Unconscious = 'Unconscious',
	Dead = 'Dead'
}

export interface CombatDataModel {
	id: string;
	type: CombatantType;
	size: number;
	state: CombatDataState;
	position: {
		x: number,
		y: number
	},
	damage: number;
	wounds: number;
	initiative: number;
	movement: number;
	senses: number;
	hidden: number;
	conditions: ConditionModel[];
	actions: ActionModel[];
}

export const createCombatData = (combatant: CombatantModel): CombatDataModel => {
	return {
		id: combatant.id,
		type: combatant.type,
		size: combatant.size,
		state: CombatDataState.Standing,
		position: {
			x: 0,
			y: 0
		},
		damage: 0,
		wounds: 0,
		initiative: Number.MIN_VALUE,
		movement: 0,
		senses: 0,
		hidden: 0,
		conditions: [],
		actions: []
	};
}
