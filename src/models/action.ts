import { guid } from '../utils/utils';

export interface ActionModel {
	id: string;
	name: string;
}

export const createActionPlaceholder = (name: string): ActionModel => {
	return {
		id: guid(),
		name: name
	};
};

export const universalActions: ActionModel[] = [
	createActionPlaceholder('Unarmed attack')
];
