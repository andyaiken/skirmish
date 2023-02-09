import { guid } from '../utils/utils';
import { ActionModel, universalActions } from './action';
import { DamageCategory, DamageType, getDamageCategory } from './damage';
import { FeatureModel, FeatureType } from './feature';
import { ItemModel } from './item';
import { ItemProficiency } from './item-proficiency';
import { getSkillCategory, Skill, SkillCategory } from './skill';
import { Trait } from './trait';

export interface MonsterModel {
	id: string;
	name: string;

	level: number;
	size: number;

	features: FeatureModel[];
	actions: ActionModel[];
	items: ItemModel[];
}

export const createMonster = (): MonsterModel => {
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

export const getActionDeck = (monster: MonsterModel) => {
	let list = ([] as ActionModel[]).concat(universalActions);

	list = list.concat(monster.actions);

	monster.items.forEach(i => {
		list = list.concat(i.actions);
	});

	return list;
}

export const getFeatures = (monster: MonsterModel) => {
	let list = ([] as FeatureModel[]).concat(monster.features);
	monster.items.forEach(i => {
		list = list.concat(i.features);
	});

	return list;
}

export const getTraitValue = (monster: MonsterModel, trait: Trait) => {
	let value = 1;

	getFeatures(monster)
		.filter(f => f.type === FeatureType.Trait)
		.filter(f => (f.trait === trait) || (f.trait === Trait.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getSkillValue = (monster: MonsterModel, skill: Skill) => {
	let value = 0;

	getFeatures(monster)
		.filter(f => f.type === FeatureType.Skill)
		.filter(f => (f.skill === skill) || (f.skill === Skill.All))
		.forEach(f => value += f.rank);
	getFeatures(monster)
		.filter(f => f.type === FeatureType.SkillCategory)
		.filter(f => (f.skillCategory === getSkillCategory(skill)) || (f.skillCategory === SkillCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getDamageBonusValue = (monster: MonsterModel, damage: DamageType) => {
	let value = 0;

	getFeatures(monster)
		.filter(f => f.type === FeatureType.DamageBonus)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(monster)
		.filter(f => f.type === FeatureType.DamageCategoryBonus)
		.filter(f => (f.damageCategory === getDamageCategory(damage)) || (f.damageCategory === DamageCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getDamageResistanceValue = (monster: MonsterModel, damage: DamageType) => {
	let value = 0;

	getFeatures(monster)
		.filter(f => f.type === FeatureType.DamageResist)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(monster)
		.filter(f => f.type === FeatureType.DamageCategoryResist)
		.filter(f => (f.damageCategory === getDamageCategory(damage)) || (f.damageCategory === DamageCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getProficiencies = (monster: MonsterModel) => {
	const profs: ItemProficiency[] = [];

	getFeatures(monster)
		.filter(f => f.type === FeatureType.Proficiency)
		.forEach(f => profs.push(f.proficiency));

	return profs;
}
