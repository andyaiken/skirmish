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

export class FeatureHelper {
	public static universalFeatures: Feature[] = [
		FeatureHelper.createTraitFeature(Trait.Any, 1),
		FeatureHelper.createSkillFeature(Skill.Any, 1),
		FeatureHelper.createProficiencyFeature(Proficiency.Any)
	];

	public static getName(feature: Feature) {
		switch (feature.type) {
			case FeatureType.DamageBonus:
				return feature.damage + ' ' + feature.rank;
			case FeatureType.DamageCategoryBonus:
				return feature.damageCategory + ' ' + feature.rank;
			case FeatureType.DamageResist:
				return feature.damage + ' resistance ' + feature.rank;
			case FeatureType.DamageCategoryResist:
				return feature.damageCategory + ' resistance ' + feature.rank;
			case FeatureType.Proficiency:
				return feature.proficiency;
			case FeatureType.Skill:
				return feature.skill + ' ' + feature.rank;
			case FeatureType.SkillCategory:
				return feature.skillCategory + ' skills ' + feature.rank;
			case FeatureType.Trait:
				return feature.trait + ' ' + feature.rank;
		}
	}

	public static hasChoice(feature: Feature) {
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

	public static createDamageBonusFeature(damage: DamageType, rank: number): Feature {
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

	public static createDamageCategoryBonusFeature(category: DamageCategory, rank: number): Feature {
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

	public static createDamageResistFeature(damage: DamageType, rank: number): Feature {
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

	public static createDamageCategoryResistFeature(category: DamageCategory, rank: number): Feature {
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

	public static createProficiencyFeature(proficiency: Proficiency): Feature {
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

	public static createSkillFeature(skill: Skill, rank: number): Feature {
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

	public static createSkillCategoryFeature(category: SkillCategory, rank: number): Feature {
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

	public static createTraitFeature(trait: Trait, rank: number): Feature {
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
}
