import { randomNumber } from '../utils/random';
import { guid } from '../utils/utils';
import { BackgroundList } from './background';
import { RoleList } from './role';
import { HeroSpeciesList, MonsterSpeciesList } from './species';

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

export const getRandomAction = () => {
	const actions: ActionModel[] = [];

	HeroSpeciesList.forEach(s => actions.push(...s.actions));
	MonsterSpeciesList.forEach(s => actions.push(...s.actions));
	RoleList.forEach(r => actions.push(...r.actions));
	BackgroundList.forEach(b => actions.push(...b.actions));

	const n = randomNumber(actions.length);
	const copy = JSON.parse(JSON.stringify(actions[n])) as ActionModel;
	copy.id = guid();

	return copy;
};

export const universalActions: ActionModel[] = [
	createActionPlaceholder('Unarmed attack')
];
