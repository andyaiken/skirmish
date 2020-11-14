import { Utils } from '../utils/utils';

export interface Action {
	id: string;
	name: string;
}

export class ActionHelper {
	public static universalActions: Action[] = [
		// TODO: Unarmed attack
	];

	public static createPlaceholder(name: string): Action {
		return {
			id: Utils.guid(),
			name: name
		};
	}
}
