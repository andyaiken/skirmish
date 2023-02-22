import type { ConditionType } from '../enums/condition-type';
import type { DamageCategoryType } from '../enums/damage-category-type';
import type { DamageType } from '../enums/damage-type';
import type { SkillCategoryType } from '../enums/skill-category-type';
import type { SkillType } from '../enums/skill-type';
import type { TraitType } from '../enums/trait-type';

export interface ConditionModel {
	id: string;
	type: ConditionType;
	trait: TraitType;
	rank: number;
	details: {
		trait: TraitType;
		skill: SkillType;
		skillCategory: SkillCategoryType;
		damage: DamageType;
		damageCategory: DamageCategoryType;
	}
}
