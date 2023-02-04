import { guid } from '../utils/utils';

export interface Action {
	id: string;
	name: string;
}

export const createPlaceholder = (name: string): Action => {
	return {
		id: guid(),
		name: name
	};
}

export const universalActions: Action[] = [
	createPlaceholder('Unarmed attack')
];
