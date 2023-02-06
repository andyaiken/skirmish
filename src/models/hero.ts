import { guid } from '../utils/utils';
import { Action, universalActions } from './action';
import { getBackground } from './background';
import { DamageCategory, DamageType, getDamageCategory } from './damage';
import { Feature, FeatureType, universalFeatures } from './feature';
import { Item } from './item';
import { Proficiency } from './proficiency';
import { getRole } from './role';
import { getSkillCategory, Skill, SkillCategory } from './skill';
import { getSpecies } from './species';
import { Trait } from './trait';

export interface Hero {
	id: string;
	name: string;

	speciesID: string;
	roleID: string;
	backgroundID: string;

	level: number;
	xp: number;

	features: Feature[];
	items: Item[];
}

export const createHero = (): Hero => {
	return {
		id: guid(),
		name: '',
		speciesID: '',
		roleID: '',
		backgroundID: '',
		level: 1,
		xp: 0,
		features: [],
		items: []
	};
}

export const getFeatureDeck = (hero: Hero) => {
	const s = getSpecies(hero.speciesID);
	const r = getRole(hero.roleID);
	const b = getBackground(hero.backgroundID);
	return universalFeatures
		.concat(s ? s.features : [])
		.concat(r ? r.features : [])
		.concat(b ? b.features : []);
}

export const getActionDeck = (hero: Hero) => {
	let list: Action[] = ([] as Action[]).concat(universalActions);

	const s = getSpecies(hero.speciesID);
	list = list.concat(s ? s.actions : []);
	const r = getRole(hero.roleID);
	list = list.concat(r ? r.actions : []);
	const b = getBackground(hero.backgroundID);
	list = list.concat(b ? b.actions : []);

	hero.items.forEach(i => {
		list = list.concat(i.actions);
	});

	return list;
}

export const getFeatures = (hero: Hero) => {
	let list = ([] as Feature[]).concat(hero.features);
	hero.items.forEach(i => {
		list = list.concat(i.features);
	});

	return list;
}

export const getTraitValue = (hero: Hero, trait: Trait) => {
	let value = 1;

	getFeatures(hero)
		.filter(f => f.type === FeatureType.Trait)
		.filter(f => (f.trait === trait) || (f.trait === Trait.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getSkillValue = (hero: Hero, skill: Skill) => {
	let value = 0;

	getFeatures(hero)
		.filter(f => f.type === FeatureType.Skill)
		.filter(f => (f.skill === skill) || (f.skill === Skill.All))
		.forEach(f => value += f.rank);
	getFeatures(hero)
		.filter(f => f.type === FeatureType.SkillCategory)
		.filter(f => (f.skillCategory === getSkillCategory(skill)) || (f.skillCategory === SkillCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getDamageBonusValue = (hero: Hero, damage: DamageType) => {
	let value = 0;

	getFeatures(hero)
		.filter(f => f.type === FeatureType.DamageBonus)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(hero)
		.filter(f => f.type === FeatureType.DamageCategoryBonus)
		.filter(f => (f.damageCategory === getDamageCategory(damage)) || (f.damageCategory === DamageCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getDamageResistanceValue = (hero: Hero, damage: DamageType) => {
	let value = 0;

	getFeatures(hero)
		.filter(f => f.type === FeatureType.DamageResist)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(hero)
		.filter(f => f.type === FeatureType.DamageCategoryResist)
		.filter(f => (f.damageCategory === getDamageCategory(damage)) || (f.damageCategory === DamageCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getProficiencies = (hero: Hero) => {
	const profs: Proficiency[] = [];

	getFeatures(hero)
		.filter(f => f.type === FeatureType.Proficiency)
		.forEach(f => profs.push(f.proficiency));

	if (profs.includes(Proficiency.All)) {
		return [Proficiency.All];
	}

	return profs;
}
