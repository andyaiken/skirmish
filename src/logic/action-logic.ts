import type { ActionModel } from '../models/action';

import { Factory } from './factory';

export class ActionLogic {
	static createActionPlaceholder = (id: string, name: string): ActionModel => {
		const action = Factory.createAction(id);
		action.name = name;
		return action;
	};
}
