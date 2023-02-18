import { DamageType, FeatureType, DamageCategoryType, ItemProficiencyType, SkillType, SkillCategoryType, TraitType, AuraType } from '../models/enums';
import { FeatureModel } from '../models/feature';
import { getRandomDamageType, getRandomDamageCategoryType, getRandomItemProficiency, getRandomTrait, getRandomSkill, getRandomSkillCategory } from './game-logic';
import { Random } from './random';
import { Utils } from './utils';

export class FeatureUtils {
	static createDamageBonusFeature = (damage: DamageType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageBonus,
			damage: damage,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: AuraType.None,
			rank: rank
		};
	};

	static createDamageCategoryTypeBonusFeature = (category: DamageCategoryType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageCategoryTypeBonus,
			damage: DamageType.None,
			DamageCategoryType: category,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: AuraType.None,
			rank: rank
		};
	};

	static createDamageResistFeature = (damage: DamageType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageResist,
			damage: damage,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: AuraType.None,
			rank: rank
		};
	};

	static createDamageCategoryTypeResistFeature = (category: DamageCategoryType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageCategoryTypeResist,
			damage: DamageType.None,
			DamageCategoryType: category,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: AuraType.None,
			rank: rank
		};
	};

	static createProficiencyFeature = (proficiency: ItemProficiencyType): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Proficiency,
			damage: DamageType.None,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: proficiency,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: AuraType.None,
			rank: 0
		};
	};

	static createSkillFeature = (skill: SkillType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Skill,
			damage: DamageType.None,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: skill,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: AuraType.None,
			rank: rank
		};
	};

	static createSkillCategoryFeature = (category: SkillCategoryType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.SkillCategory,
			damage: DamageType.None,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: category,
			trait: TraitType.None,
			aura: AuraType.None,
			rank: rank
		};
	};

	static createTraitFeature = (trait: TraitType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Trait,
			damage: DamageType.None,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: trait,
			aura: AuraType.None,
			rank: rank
		};
	};

	static createAuraFeature = (aura: AuraType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: DamageType.None,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: aura,
			rank: rank
		};
	};

	static createAuraDamageFeature = (aura: AuraType, damage: DamageType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: damage,
			DamageCategoryType: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: aura,
			rank: rank
		};
	};

	static createAuraDamageCategoryTypeFeature = (aura: AuraType, category: DamageCategoryType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: DamageType.None,
			DamageCategoryType: category,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: aura,
			rank: rank
		};
	};

	static createRandomFeature = () => {
		switch (Random.randomNumber(8)) {
			case 0:
				return FeatureUtils.createDamageBonusFeature(getRandomDamageType(), Random.randomBonus());
			case 1:
				return FeatureUtils.createDamageCategoryTypeBonusFeature(getRandomDamageCategoryType(), Random.randomBonus());
			case 2:
				return FeatureUtils.createDamageResistFeature(getRandomDamageType(), Random.randomBonus());
			case 3:
				return FeatureUtils.createDamageCategoryTypeResistFeature(getRandomDamageCategoryType(), Random.randomBonus());
			case 4:
				return FeatureUtils.createProficiencyFeature(getRandomItemProficiency());
			case 5:
				return FeatureUtils.createTraitFeature(getRandomTrait(), Random.randomBonus());
			case 6:
				return FeatureUtils.createSkillFeature(getRandomSkill(), Random.randomBonus());
			default:
				return FeatureUtils.createSkillCategoryFeature(getRandomSkillCategory(), Random.randomBonus());
		}
	};
}
