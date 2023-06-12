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

import { ConditionLogic } from './condition-logic';
import { Factory } from './factory';
import { GameLogic } from './game-logic';

export class FeatureLogic {
	static createDamageBonusFeature = (id: string, damage: DamageType, rank: number): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.DamageBonus;
		feature.damage = damage;
		feature.rank = rank;
		return feature;
	};

	static createDamageCategoryBonusFeature = (id: string, category: DamageCategoryType, rank: number): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.DamageCategoryBonus;
		feature.damageCategory = category;
		feature.rank = rank;
		return feature;
	};

	static createDamageResistFeature = (id: string, damage: DamageType, rank: number): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.DamageResist;
		feature.damage = damage;
		feature.rank = rank;
		return feature;
	};

	static createDamageCategoryResistFeature = (id: string, category: DamageCategoryType, rank: number): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.DamageCategoryResist;
		feature.damageCategory = category;
		feature.rank = rank;
		return feature;
	};

	static createProficiencyFeature = (id: string, proficiency: ItemProficiencyType): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Proficiency;
		feature.proficiency = proficiency;
		return feature;
	};

	static createSkillFeature = (id: string, skill: SkillType, rank: number): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Skill;
		feature.skill = skill;
		feature.rank = rank;
		return feature;
	};

	static createSkillCategoryFeature = (id: string, category: SkillCategoryType, rank: number): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.SkillCategory;
		feature.skillCategory = category;
		feature.rank = rank;
		return feature;
	};

	static createTraitFeature = (id: string, trait: TraitType, rank: number): FeatureModel => {
		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Trait;
		feature.trait = trait;
		feature.rank = rank;
		return feature;
	};

	static createAuraFeature = (id: string, aura: ConditionType, rank: number): FeatureModel => {
		const types = [
			ConditionType.AutoHeal,
			ConditionType.MovementBonus,
			ConditionType.MovementPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Aura;
		feature.aura = aura;
		feature.rank = rank;
		return feature;
	};

	static createAuraTraitFeature = (id: string, aura: ConditionType, trait: TraitType, rank: number): FeatureModel => {
		const types = [
			ConditionType.TraitBonus,
			ConditionType.TraitPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Aura;
		feature.aura = aura;
		feature.trait = trait;
		feature.rank = rank;
		return feature;
	};

	static createAuraSkillFeature = (id: string, aura: ConditionType, skill: SkillType, rank: number): FeatureModel => {
		const types = [
			ConditionType.SkillBonus,
			ConditionType.SkillPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Aura;
		feature.aura = aura;
		feature.skill = skill;
		feature.rank = rank;
		return feature;
	};

	static createAuraSkillCategoryFeature = (id: string, aura: ConditionType, category: SkillCategoryType, rank: number): FeatureModel => {
		const types = [
			ConditionType.SkillCategoryBonus,
			ConditionType.SkillCategoryPenalty
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Aura;
		feature.aura = aura;
		feature.skillCategory = category;
		feature.rank = rank;
		return feature;
	};

	static createAuraDamageFeature = (id: string, aura: ConditionType, damage: DamageType, rank: number): FeatureModel => {
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

		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Aura;
		feature.aura = aura;
		feature.damage = damage;
		feature.rank = rank;
		return feature;
	};

	static createAuraDamageCategoryFeature = (id: string, aura: ConditionType, category: DamageCategoryType, rank: number): FeatureModel => {
		const types = [
			ConditionType.DamageCategoryBonus,
			ConditionType.DamageCategoryPenalty,
			ConditionType.DamageCategoryResistance,
			ConditionType.DamageCategoryVulnerability
		];
		if (!types.includes(aura)) {
			throw new Error('Incorrect aura parameters');
		}

		const feature = Factory.createFeature(id);
		feature.type = FeatureType.Aura;
		feature.aura = aura;
		feature.damageCategory = category;
		feature.rank = rank;
		return feature;
	};

	static createRandomFeature = () => {
		switch (Random.randomNumber(8)) {
			case 0:
				return FeatureLogic.createDamageBonusFeature(Utils.guid(), GameLogic.getRandomDamageType(), Random.randomBonus());
			case 1:
				return FeatureLogic.createDamageCategoryBonusFeature(Utils.guid(), GameLogic.getRandomDamageCategoryType(), Random.randomBonus());
			case 2:
				return FeatureLogic.createDamageResistFeature(Utils.guid(), GameLogic.getRandomDamageType(), Random.randomBonus());
			case 3:
				return FeatureLogic.createDamageCategoryResistFeature(Utils.guid(), GameLogic.getRandomDamageCategoryType(), Random.randomBonus());
			case 4:
				return FeatureLogic.createProficiencyFeature(Utils.guid(), GameLogic.getRandomItemProficiency());
			case 5:
				return FeatureLogic.createTraitFeature(Utils.guid(), GameLogic.getRandomTrait(), Random.randomBonus());
			case 6:
				return FeatureLogic.createSkillFeature(Utils.guid(), GameLogic.getRandomSkill(), Random.randomBonus());
			default:
				return FeatureLogic.createSkillCategoryFeature(Utils.guid(), GameLogic.getRandomSkillCategory(), Random.randomBonus());
		}
	};

	static getFeatureDescription = (feature: FeatureModel) => {
		const title = FeatureLogic.getFeatureTitle(feature).toString();
		const desc = FeatureLogic.getFeatureInformation(feature).toString();
		return `${title}: ${desc}`;
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
			case FeatureType.DamageCategoryBonus:
				return 'Damage Bonus';
			case FeatureType.DamageResist:
			case FeatureType.DamageCategoryResist:
				return 'Damage Resistance';
			case FeatureType.Aura:
				return 'Aura';
		}
	};

	static getFeatureInformation = (feature: FeatureModel) => {
		switch (feature.type) {
			case FeatureType.Trait:
			case FeatureType.Skill:
			case FeatureType.SkillCategory:
			case FeatureType.DamageBonus:
			case FeatureType.DamageCategoryBonus:
			case FeatureType.DamageResist:
			case FeatureType.DamageCategoryResist:
			case FeatureType.Aura:
				return `${FeatureLogic.getFeatureText(feature)} ${feature.rank > 0 ? '+' : ''}${feature.rank}`;
			case FeatureType.Proficiency:
				return FeatureLogic.getFeatureText(feature);
		}
	};

	static getFeatureText = (feature: FeatureModel) => {
		switch (feature.type) {
			case FeatureType.Trait:
				return `${feature.trait}`;
			case FeatureType.Skill:
				return `${feature.skill}`;
			case FeatureType.SkillCategory:
				return `All ${feature.skillCategory} skills`;
			case FeatureType.Proficiency:
				return `${feature.proficiency}`;
			case FeatureType.DamageBonus:
				return `${feature.damage}`;
			case FeatureType.DamageCategoryBonus:
				return `All ${feature.damageCategory} types`;
			case FeatureType.DamageResist:
				return `${feature.damage}`;
			case FeatureType.DamageCategoryResist:
				return `All ${feature.damageCategory} types`;
			case FeatureType.Aura: {
				const aura = Factory.createCondition(feature.aura, TraitType.None, feature.rank);
				aura.details.trait = feature.trait;
				aura.details.skill = feature.skill;
				aura.details.skillCategory = feature.skillCategory;
				aura.details.damage = feature.damage;
				aura.details.damageCategory = feature.damageCategory;
				const affects = ConditionLogic.getConditionIsBeneficial(aura) ? 'allies' : 'enemies';
				return `${ConditionLogic.getConditionDescription(aura)} (affects ${affects})`;
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
			case FeatureType.DamageCategoryBonus:
			case FeatureType.DamageCategoryResist:
				return feature.damageCategory === DamageCategoryType.Any;
		}

		return false;
	};

	static collateFeatures = (features: FeatureModel[]) => {
		const collated: FeatureModel[] = [];

		features.forEach(feature => {
			const existing = collated.find(f => {
				return (FeatureLogic.getFeatureTitle(f) === FeatureLogic.getFeatureTitle(feature)) && (FeatureLogic.getFeatureText(f) === FeatureLogic.getFeatureText(feature));
			});
			if (existing) {
				existing.rank += feature.rank;
			} else {
				const copy = JSON.parse(JSON.stringify(feature)) as FeatureModel;
				collated.push(copy);
			}
		});

		return collated;
	};
}
