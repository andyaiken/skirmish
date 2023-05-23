import type { ActionModel } from '../models/action';
import type { IntentModel } from '../models/intent';

export class IntentsData {
	static inspire = (): IntentModel => {
		return {
			id: 'inspire',
			data: null
		};
	};

	static hide = (): IntentModel => {
		return {
			id: 'hide',
			data: null
		};
	};

	static move = (dir: string): IntentModel => {
		return {
			id: 'move',
			data: dir
		};
	};

	static action = (action: ActionModel): IntentModel => {
		return {
			id: 'action',
			data: action
		};
	};
}
