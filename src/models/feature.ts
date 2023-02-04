import { guid } from '../utils/utils';
import { DamageCategory, DamageType } from './damage';
import { Proficiency } from './proficiency';
import { Skill, SkillCategory } from './skill';
import { Trait } from './trait';

export enum FeatureType {
	// TODO: Aura
	DamageBonus = 'Damage bonus',
	DamageCategoryBonus = 'Damage category bonus',
	DamageResist = 'Damage resistance',
	DamageCategoryResist = 'Damage category resistance',
	Proficiency = 'Proficiency',
	Skill = 'Skill',
	SkillCategory = 'Skill category',
	Trait = 'Trait'
}

export interface Feature {
	id: string;
	type: FeatureType;
	damage: DamageType;
	damageCategory: DamageCategory;
	proficiency: Proficiency;
	skill: Skill;
	skillCategory: SkillCategory;
	trait: Trait;
	rank: number;
}

export const getFeatureName = (feature: Feature) => {
	switch (feature.type) {
		case FeatureType.DamageBonus:
			return `${feature.damage} ${feature.rank}`;
		case FeatureType.DamageCategoryBonus:
			return `${feature.damageCategory} ${feature.rank}`;
		case FeatureType.DamageResist:
			return `${feature.damage} resistance ${feature.rank}`;
		case FeatureType.DamageCategoryResist:
			return `${feature.damageCategory} resistance ${feature.rank}`;
		case FeatureType.Proficiency:
			return `${feature.proficiency}`;
		case FeatureType.Skill:
			return `${feature.skill} ${feature.rank}`;
		case FeatureType.SkillCategory:
			return `${feature.skillCategory} skills ${feature.rank}`;
		case FeatureType.Trait:
			return `${feature.trait} ${feature.rank}`;
	}
}

export const hasChoice = (feature: Feature) => {
	switch (feature.type) {
		case FeatureType.DamageBonus:
		case FeatureType.DamageResist:
			return feature.damage === DamageType.Any;
		case FeatureType.DamageCategoryBonus:
		case FeatureType.DamageCategoryResist:
			return feature.damageCategory === DamageCategory.Any;
		case FeatureType.Proficiency:
			return feature.proficiency === Proficiency.Any;
		case FeatureType.Skill:
			return feature.skill === Skill.Any;
		case FeatureType.SkillCategory:
			return feature.skillCategory === SkillCategory.Any;
		case FeatureType.Trait:
			return feature.trait === Trait.Any;
	}
}

export const createDamageBonusFeature = (damage: DamageType, rank: number): Feature => {
	return {
		id: guid(),
		type: FeatureType.DamageBonus,
		damage: damage,
		damageCategory: DamageCategory.None,
		proficiency: Proficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		rank: rank
	};
}

export const createDamageCategoryBonusFeature = (category: DamageCategory, rank: number): Feature => {
	return {
		id: guid(),
		type: FeatureType.DamageCategoryBonus,
		damage: DamageType.None,
		damageCategory: category,
		proficiency: Proficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		rank: rank
	};
}

export const createDamageResistFeature = (damage: DamageType, rank: number): Feature => {
	return {
		id: guid(),
		type: FeatureType.DamageResist,
		damage: damage,
		damageCategory: DamageCategory.None,
		proficiency: Proficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		rank: rank
	};
}

export const createDamageCategoryResistFeature = (category: DamageCategory, rank: number): Feature => {
	return {
		id: guid(),
		type: FeatureType.DamageCategoryResist,
		damage: DamageType.None,
		damageCategory: category,
		proficiency: Proficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		rank: rank
	};
}

export const createProficiencyFeature = (proficiency: Proficiency): Feature => {
	return {
		id: guid(),
		type: FeatureType.Proficiency,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: proficiency,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		rank: 0
	};
}

export const createSkillFeature = (skill: Skill, rank: number): Feature => {
	return {
		id: guid(),
		type: FeatureType.Skill,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: Proficiency.None,
		skill: skill,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		rank: rank
	};
}

export const createSkillCategoryFeature = (category: SkillCategory, rank: number): Feature => {
	return {
		id: guid(),
		type: FeatureType.SkillCategory,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: Proficiency.None,
		skill: Skill.None,
		skillCategory: category,
		trait: Trait.None,
		rank: rank
	};
}

export const createTraitFeature = (trait: Trait, rank: number): Feature => {
	return {
		id: guid(),
		type: FeatureType.Trait,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: Proficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: trait,
		rank: rank
	};
}

export const universalFeatures: Feature[] = [
	createTraitFeature(Trait.Any, 1),
	createSkillFeature(Skill.Any, 1),
	createProficiencyFeature(Proficiency.Any)
];
