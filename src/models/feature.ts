import { guid } from '../utils/utils';
import { AuraType, createAura, getAuraDescription } from './aura';
import { DamageCategory, DamageType } from './damage';
import { ItemProficiency } from './item-proficiency';
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
	DamageCategoryResist = 'Damage category resistance',
	Aura = 'Aura'
}

export interface FeatureModel {
	id: string;
	type: FeatureType;
	damage: DamageType;
	damageCategory: DamageCategory;
	proficiency: ItemProficiency;
	skill: Skill;
	skillCategory: SkillCategory;
	trait: Trait;
	aura: AuraType;
	rank: number;
}

export const getFeatureTitle = (feature: FeatureModel) => {
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
		case FeatureType.Aura:
			return 'Aura';
	}
}

export const getFeatureDescription = (feature: FeatureModel) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return `${feature.trait} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Skill:
			return `${feature.skill} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.SkillCategory:
			return `All ${feature.skillCategory} skills ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Proficiency:
			return `${feature.proficiency}`;
		case FeatureType.DamageBonus:
			return `${feature.damage} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageCategoryBonus:
			return `All ${feature.damageCategory} types ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageResist:
			return `${feature.damage} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.DamageCategoryResist:
			return `All ${feature.damageCategory} types ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		case FeatureType.Aura: {
			const aura = createAura(feature);
			return `${getAuraDescription(aura)} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
		}
	}
}

export const hasChoice = (feature: FeatureModel) => {
	switch (feature.type) {
		case FeatureType.Trait:
			return feature.trait === Trait.Any;
		case FeatureType.Skill:
			return feature.skill === Skill.Any;
		case FeatureType.SkillCategory:
			return feature.skillCategory === SkillCategory.Any;
		case FeatureType.Proficiency:
			return feature.proficiency === ItemProficiency.Any;
		case FeatureType.DamageBonus:
		case FeatureType.DamageResist:
			return feature.damage === DamageType.Any;
		case FeatureType.DamageCategoryBonus:
		case FeatureType.DamageCategoryResist:
			return feature.damageCategory === DamageCategory.Any;
	}
}

export const createDamageBonusFeature = (damage: DamageType, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.DamageBonus,
		damage: damage,
		damageCategory: DamageCategory.None,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: AuraType.None,
		rank: rank
	};
}

export const createDamageCategoryBonusFeature = (category: DamageCategory, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.DamageCategoryBonus,
		damage: DamageType.None,
		damageCategory: category,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: AuraType.None,
		rank: rank
	};
}

export const createDamageResistFeature = (damage: DamageType, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.DamageResist,
		damage: damage,
		damageCategory: DamageCategory.None,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: AuraType.None,
		rank: rank
	};
}

export const createDamageCategoryResistFeature = (category: DamageCategory, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.DamageCategoryResist,
		damage: DamageType.None,
		damageCategory: category,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: AuraType.None,
		rank: rank
	};
}

export const createProficiencyFeature = (proficiency: ItemProficiency): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.Proficiency,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: proficiency,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: AuraType.None,
		rank: 0
	};
}

export const createSkillFeature = (skill: Skill, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.Skill,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: ItemProficiency.None,
		skill: skill,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: AuraType.None,
		rank: rank
	};
}

export const createSkillCategoryFeature = (category: SkillCategory, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.SkillCategory,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: category,
		trait: Trait.None,
		aura: AuraType.None,
		rank: rank
	};
}

export const createTraitFeature = (trait: Trait, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.Trait,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: trait,
		aura: AuraType.None,
		rank: rank
	};
}

export const createAuraFeature = (aura: AuraType, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.Aura,
		damage: DamageType.None,
		damageCategory: DamageCategory.None,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: aura,
		rank: rank
	};
}

export const createAuraDamageFeature = (aura: AuraType, damage: DamageType, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.Aura,
		damage: damage,
		damageCategory: DamageCategory.None,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: aura,
		rank: rank
	};
}

export const createAuraDamageCategoryFeature = (aura: AuraType, category: DamageCategory, rank: number): FeatureModel => {
	return {
		id: guid(),
		type: FeatureType.Aura,
		damage: DamageType.None,
		damageCategory: category,
		proficiency: ItemProficiency.None,
		skill: Skill.None,
		skillCategory: SkillCategory.None,
		trait: Trait.None,
		aura: aura,
		rank: rank
	};
}

export const universalFeatures: FeatureModel[] = [
	createTraitFeature(Trait.Any, 1),
	createSkillFeature(Skill.Any, 1),
	createProficiencyFeature(ItemProficiency.Any)
];
