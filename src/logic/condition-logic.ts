import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ConditionModel } from '../models/condition';
import { Random } from '../utils/random';

import { Factory } from './factory';
import { GameLogic } from './game-logic';

export class ConditionLogic {
	static createAutoHealCondition = (root: TraitType, rank: number) => {
		const condition = Factory.createCondition(ConditionType.AutoHeal, root, rank);
		return condition;
	};

	static createAutoDamageCondition = (root: TraitType, rank: number, damage: DamageType) => {
		const condition = Factory.createCondition(ConditionType.AutoDamage, root, rank);
		condition.details.damage = damage;
		return condition;
	};

	static createTraitBonusCondition = (root: TraitType, rank: number, trait: TraitType) => {
		const condition = Factory.createCondition(ConditionType.TraitBonus, root, rank);
		condition.details.trait = trait;
		return condition;
	};

	static createTraitPenaltyCondition = (root: TraitType, rank: number, trait: TraitType) => {
		const condition = Factory.createCondition(ConditionType.TraitPenalty, root, rank);
		condition.details.trait = trait;
		return condition;
	};

	static createSkillBonusCondition = (root: TraitType, rank: number, skill: SkillType) => {
		const condition = Factory.createCondition(ConditionType.SkillBonus, root, rank);
		condition.details.skill = skill;
		return condition;
	};

	static createSkillPenaltyCondition = (root: TraitType, rank: number, skill: SkillType) => {
		const condition = Factory.createCondition(ConditionType.SkillPenalty, root, rank);
		condition.details.skill = skill;
		return condition;
	};

	static createSkillCategoryBonusCondition = (root: TraitType, rank: number, category: SkillCategoryType) => {
		const condition = Factory.createCondition(ConditionType.SkillCategoryBonus, root, rank);
		condition.details.skillCategory = category;
		return condition;
	};

	static createSkillCategoryPenaltyCondition = (root: TraitType, rank: number, category: SkillCategoryType) => {
		const condition = Factory.createCondition(ConditionType.SkillCategoryPenalty, root, rank);
		condition.details.skillCategory = category;
		return condition;
	};

	static createDamageBonusCondition = (root: TraitType, rank: number, damage: DamageType) => {
		const condition = Factory.createCondition(ConditionType.DamageBonus, root, rank);
		condition.details.damage = damage;
		return condition;
	};

	static createDamagePenaltyCondition = (root: TraitType, rank: number, damage: DamageType) => {
		const condition = Factory.createCondition(ConditionType.DamagePenalty, root, rank);
		condition.details.damage = damage;
		return condition;
	};

	static createDamageCategoryBonusCondition = (root: TraitType, rank: number, category: DamageCategoryType) => {
		const condition = Factory.createCondition(ConditionType.DamageCategoryBonus, root, rank);
		condition.details.damageCategory = category;
		return condition;
	};

	static createDamageCategoryPenaltyCondition = (root: TraitType, rank: number, category: DamageCategoryType) => {
		const condition = Factory.createCondition(ConditionType.DamageCategoryPenalty, root, rank);
		condition.details.damageCategory = category;
		return condition;
	};

	static createDamageResistanceCondition = (root: TraitType, rank: number, damage: DamageType) => {
		const condition = Factory.createCondition(ConditionType.DamageResistance, root, rank);
		condition.details.damage = damage;
		return condition;
	};

	static createDamageVulnerabilityCondition = (root: TraitType, rank: number, damage: DamageType) => {
		const condition = Factory.createCondition(ConditionType.DamageVulnerability, root, rank);
		condition.details.damage = damage;
		return condition;
	};

	static createDamageCategoryResistanceCondition = (root: TraitType, rank: number, category: DamageCategoryType) => {
		const condition = Factory.createCondition(ConditionType.DamageCategoryResistance, root, rank);
		condition.details.damageCategory = category;
		return condition;
	};

	static createDamageCategoryVulnerabilityCondition = (root: TraitType, rank: number, category: DamageCategoryType) => {
		const condition = Factory.createCondition(ConditionType.DamageCategoryVulnerability, root, rank);
		condition.details.damageCategory = category;
		return condition;
	};

	static createMovementBonusCondition = (root: TraitType, rank: number) => {
		const condition = Factory.createCondition(ConditionType.MovementBonus, root, rank);
		return condition;
	};

	static createMovementPenaltyCondition = (root: TraitType, rank: number) => {
		const condition = Factory.createCondition(ConditionType.MovementPenalty, root, rank);
		return condition;
	};

	static getConditionDescription = (condition: ConditionModel) => {
		switch (condition.type) {
			case ConditionType.AutoHeal:
				return 'Automatic healing';
			case ConditionType.AutoDamage:
				return `Automatic damage (${condition.details.damage})`;
			case ConditionType.TraitBonus:
				return `Trait bonus: ${condition.details.trait}`;
			case ConditionType.TraitPenalty:
				return `Trait penalty: ${condition.details.trait}`;
			case ConditionType.SkillBonus:
				return `Skill bonus: ${condition.details.skill}`;
			case ConditionType.SkillPenalty:
				return `Skill penalty: ${condition.details.skill}`;
			case ConditionType.SkillCategoryBonus:
				return `Skill bonus: all ${condition.details.skillCategory} skills`;
			case ConditionType.SkillCategoryPenalty:
				return `Skill penalty: all ${condition.details.skillCategory} skills`;
			case ConditionType.DamageBonus:
				return `Damage bonus: ${condition.details.damage}`;
			case ConditionType.DamagePenalty:
				return `Damage penalty: ${condition.details.damage}`;
			case ConditionType.DamageCategoryBonus:
				return `Damage bonus: all ${condition.details.damageCategory} types`;
			case ConditionType.DamageCategoryPenalty:
				return `Damage penalty: all ${condition.details.damageCategory} types`;
			case ConditionType.DamageResistance:
				return `Damage resistance: ${condition.details.damage}`;
			case ConditionType.DamageVulnerability:
				return `Damage vulnerability: ${condition.details.damage}`;
			case ConditionType.DamageCategoryResistance:
				return `Damage resistance: all ${condition.details.damageCategory} types`;
			case ConditionType.DamageCategoryVulnerability:
				return `Damage vulnerability: all ${condition.details.damageCategory} types`;
			case ConditionType.MovementBonus:
				return 'Movement bonus';
			case ConditionType.MovementPenalty:
				return 'Movement penalty';
		}

		return '';
	};

	static getOppositeType = (type: ConditionType) => {
		const pairs: { a: ConditionType, b: ConditionType }[] = [
			{ a: ConditionType.AutoHeal, b: ConditionType.AutoDamage },
			{ a: ConditionType.TraitBonus, b: ConditionType.TraitPenalty },
			{ a: ConditionType.SkillBonus, b: ConditionType.SkillPenalty },
			{ a: ConditionType.SkillCategoryBonus, b: ConditionType.SkillCategoryPenalty },
			{ a: ConditionType.DamageBonus, b: ConditionType.DamagePenalty },
			{ a: ConditionType.DamageCategoryBonus, b: ConditionType.DamageCategoryPenalty },
			{ a: ConditionType.DamageResistance, b: ConditionType.DamageVulnerability },
			{ a: ConditionType.DamageCategoryResistance, b: ConditionType.DamageCategoryVulnerability },
			{ a: ConditionType.MovementBonus, b: ConditionType.MovementPenalty }
		];

		let opposite = type;
		pairs.forEach(pair => {
			if (type === pair.a) {
				opposite = pair.b;
			}
			if (type === pair.b) {
				opposite = pair.a;
			}
		});

		return opposite;
	};

	static getConditionIsBeneficial = (condition: ConditionModel) => {
		switch (condition.type) {
			case ConditionType.AutoHeal:
			case ConditionType.TraitBonus:
			case ConditionType.SkillBonus:
			case ConditionType.SkillCategoryBonus:
			case ConditionType.DamageBonus:
			case ConditionType.DamageCategoryBonus:
			case ConditionType.DamageResistance:
			case ConditionType.DamageCategoryResistance:
			case ConditionType.MovementBonus:
				return true;
		}

		return false;
	};

	static createRandomBeneficialCondition = () => {
		switch (Random.randomNumber(6)) {
			case 0:
				return ConditionLogic.createAutoHealCondition(GameLogic.getRandomTrait(), Random.randomBonus());
			case 1:
				return ConditionLogic.createTraitBonusCondition(GameLogic.getRandomTrait(), Random.randomBonus(), GameLogic.getRandomTrait());
			case 2:
				return ConditionLogic.createSkillBonusCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 2, GameLogic.getRandomSkill());
			case 3:
				return ConditionLogic.createDamageBonusCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 3, GameLogic.getRandomDamageType());
			case 4:
				return ConditionLogic.createDamageResistanceCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 3, GameLogic.getRandomDamageType());
			case 5:
				return ConditionLogic.createMovementBonusCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 2);
		}

		return null;
	};

	static createRandomDetrimentalCondition = () => {
		switch (Random.randomNumber(6)) {
			case 0:
				return ConditionLogic.createAutoDamageCondition(GameLogic.getRandomTrait(), Random.randomBonus(), GameLogic.getRandomDamageType());
			case 1:
				return ConditionLogic.createTraitPenaltyCondition(GameLogic.getRandomTrait(), Random.randomBonus(), GameLogic.getRandomTrait());
			case 2:
				return ConditionLogic.createSkillPenaltyCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 2, GameLogic.getRandomSkill());
			case 3:
				return ConditionLogic.createDamagePenaltyCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 3, GameLogic.getRandomDamageType());
			case 4:
				return ConditionLogic.createDamageVulnerabilityCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 3, GameLogic.getRandomDamageType());
			case 5:
				return ConditionLogic.createMovementPenaltyCondition(GameLogic.getRandomTrait(), Random.randomBonus() * 2);
		}

		return null;
	};
}
