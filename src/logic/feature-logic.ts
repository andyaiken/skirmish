import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { FeatureType } from '../enums/feature-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { FeatureModel } from '../models/feature';

import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { Factory } from './factory';
import { GameLogic } from './game-logic';

export class FeatureLogic {
	static createDamageBonusFeature = (damage: DamageType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageBonus,
			damage: damage,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: rank
		};
	};

	static createDamageCategoryTypeBonusFeature = (category: DamageCategoryType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageCategoryTypeBonus,
			damage: DamageType.None,
			damageCategory: category,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: rank
		};
	};

	static createDamageResistFeature = (damage: DamageType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageResist,
			damage: damage,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: rank
		};
	};

	static createDamageCategoryTypeResistFeature = (category: DamageCategoryType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.DamageCategoryTypeResist,
			damage: DamageType.None,
			damageCategory: category,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: rank
		};
	};

	static createProficiencyFeature = (proficiency: ItemProficiencyType): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Proficiency,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: proficiency,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: 0
		};
	};

	static createSkillFeature = (skill: SkillType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Skill,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: skill,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: rank
		};
	};

	static createSkillCategoryFeature = (category: SkillCategoryType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.SkillCategory,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: category,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: rank
		};
	};

	static createTraitFeature = (trait: TraitType, rank: number): FeatureModel => {
		return {
			id: Utils.guid(),
			type: FeatureType.Trait,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: trait,
			aura: ConditionType.None,
			rank: rank
		};
	};

	static createAuraFeature = (aura: ConditionType, rank: number): FeatureModel => {
		const types = [
			ConditionType.AutoHeal,
			ConditionType.MovementBonus,
			ConditionType.MovementPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: aura,
			rank: rank
		};
	};

	static createAuraTraitFeature = (aura: ConditionType, trait: TraitType, rank: number): FeatureModel => {
		const types = [
			ConditionType.TraitBonus,
			ConditionType.TraitPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: trait,
			aura: aura,
			rank: rank
		};
	};

	static createAuraSkillFeature = (aura: ConditionType, skill: SkillType, rank: number): FeatureModel => {
		const types = [
			ConditionType.SkillBonus,
			ConditionType.SkillPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: skill,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: aura,
			rank: rank
		};
	};

	static createAuraSkillCategoryFeature = (aura: ConditionType, category: SkillCategoryType, rank: number): FeatureModel => {
		const types = [
			ConditionType.SkillCategoryBonus,
			ConditionType.SkillCategoryPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: category,
			trait: TraitType.None,
			aura: aura,
			rank: rank
		};
	};

	static createAuraDamageFeature = (aura: ConditionType, damage: DamageType, rank: number): FeatureModel => {
		const types = [
			ConditionType.AutoDamage,
			ConditionType.DamageBonus,
			ConditionType.DamagePenalty,
			ConditionType.DamageResistance,
			ConditionType.DamageVulnerability
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: damage,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: aura,
			rank: rank
		};
	};

	static createAuraDamageCategoryFeature = (aura: ConditionType, category: DamageCategoryType, rank: number): FeatureModel => {
		const types = [
			ConditionType.DamageCategoryBonus,
			ConditionType.DamageCategoryPenalty,
			ConditionType.DamageCategoryResistance,
			ConditionType.DamageCategoryVulnerability
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		return {
			id: Utils.guid(),
			type: FeatureType.Aura,
			damage: DamageType.None,
			damageCategory: category,
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
				return FeatureLogic.createDamageBonusFeature(GameLogic.getRandomDamageType(), Random.randomBonus());
			case 1:
				return FeatureLogic.createDamageCategoryTypeBonusFeature(GameLogic.getRandomDamageCategoryType(), Random.randomBonus());
			case 2:
				return FeatureLogic.createDamageResistFeature(GameLogic.getRandomDamageType(), Random.randomBonus());
			case 3:
				return FeatureLogic.createDamageCategoryTypeResistFeature(GameLogic.getRandomDamageCategoryType(), Random.randomBonus());
			case 4:
				return FeatureLogic.createProficiencyFeature(GameLogic.getRandomItemProficiency());
			case 5:
				return FeatureLogic.createTraitFeature(GameLogic.getRandomTrait(), Random.randomBonus());
			case 6:
				return FeatureLogic.createSkillFeature(GameLogic.getRandomSkill(), Random.randomBonus());
			default:
				return FeatureLogic.createSkillCategoryFeature(GameLogic.getRandomSkillCategory(), Random.randomBonus());
		}
	};

	static getFeatureTitle = (feature: FeatureModel) => {
		switch (feature.type) {
			case FeatureType.Trait:
				return 'Trait bonus';
			case FeatureType.Skill:
			case FeatureType.SkillCategory:
				return 'Skill bonus';
			case FeatureType.Proficiency:
				return 'Proficiency';
			case FeatureType.DamageBonus:
			case FeatureType.DamageCategoryTypeBonus:
				return 'Damage Bonus';
			case FeatureType.DamageResist:
			case FeatureType.DamageCategoryTypeResist:
				return 'Damage Resistance';
			case FeatureType.Aura:
				return 'Aura';
		}
	};

	static getFeatureInformation = (feature: FeatureModel) => {
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
			case FeatureType.DamageCategoryTypeBonus:
				return `All ${feature.damageCategory} types ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
			case FeatureType.DamageResist:
				return `${feature.damage} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
			case FeatureType.DamageCategoryTypeResist:
				return `All ${feature.damageCategory} types ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
			case FeatureType.Aura: {
				const aura = Factory.createCondition();
				aura.type = feature.aura;
				aura.trait = TraitType.None;
				aura.rank = feature.rank;
				aura.details.trait = feature.trait;
				aura.details.skill = feature.skill;
				aura.details.skillCategory = feature.skillCategory;
				aura.details.damage = feature.damage;
				aura.details.damageCategory = feature.damageCategory;
				return `${GameLogic.getConditionDescription(aura)} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
			}
		}
	};

	static hasChoice = (feature: FeatureModel) => {
		switch (feature.type) {
			case FeatureType.Trait:
				return feature.trait === TraitType.Any;
			case FeatureType.Skill:
				return feature.skill === SkillType.Any;
			case FeatureType.SkillCategory:
				return feature.skillCategory === SkillCategoryType.Any;
			case FeatureType.Proficiency:
				return feature.proficiency === ItemProficiencyType.Any;
			case FeatureType.DamageBonus:
			case FeatureType.DamageResist:
				return feature.damage === DamageType.Any;
			case FeatureType.DamageCategoryTypeBonus:
			case FeatureType.DamageCategoryTypeResist:
				return feature.damageCategory === DamageCategoryType.Any;
		}

		return false;
	};
}
