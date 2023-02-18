import type { AuraType } from '../enums/aura-type';
import type { DamageCategoryType } from '../enums/damage-category-type';
import type { DamageType } from '../enums/damage-type';
import type { FeatureType } from '../enums/feature-type';
import type { ItemProficiencyType } from '../enums/item-proficiency-type';
import type { SkillCategoryType } from '../enums/skill-category-type';
import type { SkillType } from '../enums/skill-type';
import type { TraitType } from '../enums/trait-type';

export interface FeatureModel {
	id: string;
	type: FeatureType;
	damage: DamageType;
	DamageCategoryType: DamageCategoryType;
	proficiency: ItemProficiencyType;
	skill: SkillType;
	skillCategory: SkillCategoryType;
	trait: TraitType;
	aura: AuraType;
	rank: number;
}
