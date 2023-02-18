import { AuraType, DamageCategoryType, DamageType, FeatureType, ItemProficiencyType, SkillCategoryType, SkillType, TraitType } from './enums';

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
