import { guid } from '../utils/utils';
import { DamageCategory, DamageType } from './damage';
import { Proficiency } from './proficiency';
import { Skill, SkillCategory } from './skill';
import { Trait } from './trait';

export enum FeatureType {
	Trait = 'Trait',
	Skill = 'Skill',
	SkillCategory = 'Skill category',
	Proficiency = 'Proficiency',
	DamageBonus = 'Damage bonus',
	DamageCategoryBonus = 'Damage category bonus',
	DamageResist = 'Damage resistance',
	DamageCategoryResist = 'Damage category resistance'
	// TODO: Aura
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

export const getFeatureTitle = (feature: Feature) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return 'Trait bonus';
		case FeatureType.Skill:
		case FeatureType.SkillCategory:
			return 'Skill bonus';
		case FeatureType.Proficiency:
			return 'Proficiency';
		case FeatureType.DamageBonus:
		case FeatureType.DamageCategoryBonus:
			return 'Damage Bonus';
		case FeatureType.DamageResist:
		case FeatureType.DamageCategoryResist:
			return 'Resistance';
	}
}

export const getFeatureDescription = (feature: Feature) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return `${feature.trait} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Skill:
			return `${feature.skill} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.SkillCategory:
			return `All ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Proficiency:
			return `${feature.proficiency}`;
		case FeatureType.DamageBonus:
			return `${feature.damage} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageCategoryBonus:
			return `All ${feature.damageCategory} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageResist:
			return `${feature.damage} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageCategoryResist:
			return `All ${feature.damageCategory} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
	}
}

export const hasChoice = (feature: Feature) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return feature.trait === Trait.Any;
		case FeatureType.Skill:
			return feature.skill === Skill.Any;
		case FeatureType.SkillCategory:
			return feature.skillCategory === SkillCategory.Any;
		case FeatureType.Proficiency:
			return feature.proficiency === Proficiency.Any;
		case FeatureType.DamageBonus:
		case FeatureType.DamageResist:
			return feature.damage === DamageType.Any;
		case FeatureType.DamageCategoryBonus:
		case FeatureType.DamageCategoryResist:
			return feature.damageCategory === DamageCategory.Any;
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
