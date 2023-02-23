import type { ActionModel } from '../models/action';

import { Utils } from '../utils/utils';

export class ActionLogic {
	static createActionPlaceholder = (name: string): ActionModel => {
		return {
			id: Utils.guid(),
			name: name
		};
	};
}
