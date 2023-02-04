import { guid } from '../utils/utils';
import { Action, universalActions } from './action';
import { Feature, FeatureType } from './feature';
import { Item } from './item';
import { Proficiency } from './proficiency';
import { getCategory, Skill, SkillCategory } from './skill';
import { Trait } from './trait';

export interface Monster {
	id: string;
	name: string;

	level: number;
	size: number;

	features: Feature[];
	actions: Action[];
	items: Item[];
}

export const createMonster = (): Monster => {
	return {
		id: guid(),
		name: '',
		level: 1,
		size: 1,
		features: [],
		actions: [],
		items: []
	};
}

export const actionDeck = (monster: Monster) => {
	let list: Action[] = ([] as Action[]).concat(universalActions);

	list = list.concat(monster.actions);

	monster.items.forEach(i => {
		list = list.concat(i.actions);
	});

	return list;
}

export const activeFeatures = (monster: Monster) => {
	let list = ([] as Feature[]).concat(monster.features);
	monster.items.forEach(i => {
		list = list.concat(i.features);
	});

	return list;
}

export const trait = (monster: Monster, trait: Trait) => {
	let value = 1;

	activeFeatures(monster)
		.filter(f => f.type === FeatureType.Trait)
		.filter(f => (f.trait === trait) || (f.trait === Trait.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const skill = (monster: Monster, skill: Skill) => {
	let value = 0;

	activeFeatures(monster)
		.filter(f => f.type === FeatureType.Skill)
		.filter(f => (f.skill === skill) || (f.skill === Skill.All))
		.forEach(f => value += f.rank);
	activeFeatures(monster)
		.filter(f => f.type === FeatureType.SkillCategory)
		.filter(f => (f.skillCategory === getCategory(skill)) || (f.skillCategory === SkillCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const proficiencies = (monster: Monster) => {
	const profs: Proficiency[] = [];

	// From active features
	activeFeatures(monster)
		.filter(f => f.type === FeatureType.Proficiency)
		.forEach(f => profs.push(f.proficiency));

	if (profs.includes(Proficiency.All)) {
		return [Proficiency.All];
	}

	return profs;
}
