import { guid } from '../utils/utils';
import { ActionModel, universalActions } from './action';
import { AuraModel, createAura } from './aura';
import { getBackground } from './background';
import { DamageCategory, DamageType, getDamageCategory } from './damage';
import { FeatureModel, FeatureType, universalFeatures } from './feature';
import { ItemModel } from './item';
import { ItemProficiency } from './item-proficiency';
import { getRole } from './role';
import { getSkillCategory, Skill, SkillCategory } from './skill';
import { getSpecies } from './species';
import { Trait } from './trait';

export interface HeroModel {
	id: string;
	name: string;

	speciesID: string;
	roleID: string;
	backgroundID: string;

	level: number;
	xp: number;

	features: FeatureModel[];
	items: ItemModel[];
}

export const createHero = (): HeroModel => {
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

export const getFeatureDeck = (hero: HeroModel) => {
	const s = getSpecies(hero.speciesID);
	const r = getRole(hero.roleID);
	const b = getBackground(hero.backgroundID);
	return universalFeatures
		.concat(s ? s.features : [])
		.concat(r ? r.features : [])
		.concat(b ? b.features : []);
}

export const getActionDeck = (hero: HeroModel) => {
	let list = ([] as ActionModel[]).concat(universalActions);

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

export const getFeatures = (hero: HeroModel) => {
	let list = ([] as FeatureModel[]).concat(hero.features);
	hero.items.forEach(i => {
		list = list.concat(i.features);
	});

	return list;
}

export const getTraitValue = (hero: HeroModel, trait: Trait) => {
	let value = 1;

	getFeatures(hero)
		.filter(f => f.type === FeatureType.Trait)
		.filter(f => (f.trait === trait) || (f.trait === Trait.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
}

export const getSkillValue = (hero: HeroModel, skill: Skill) => {
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

export const getDamageBonusValue = (hero: HeroModel, damage: DamageType) => {
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

export const getDamageResistanceValue = (hero: HeroModel, damage: DamageType) => {
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

export const getProficiencies = (hero: HeroModel) => {
	const profs: ItemProficiency[] = [];

	getFeatures(hero)
		.filter(f => f.type === FeatureType.Proficiency)
		.forEach(f => profs.push(f.proficiency));

	return profs;
}

export const getAuras = (hero: HeroModel) => {
	const auras: AuraModel[] = [];

	getFeatures(hero)
		.filter(f => f.type === FeatureType.Aura)
		.forEach(f => {
			const original = auras.find(a => (a.type === f.aura) && (a.damage === f.damage) && (a.damageCategory === f.damageCategory));
			if (original) {
				original.rank += 1;
			} else {
				const aura = createAura(f);
				auras.push(aura);
			}
		});

	return auras;
}
