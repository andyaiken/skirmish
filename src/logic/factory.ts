import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { FeatureType } from '../enums/feature-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { FeatureModel } from '../models/feature';
import type { GameModel } from '../models/game';
import type { LootPileModel } from '../models/encounter';

import { Utils } from '../utils/utils';

import { CampaignMapLogic } from './campaign-map-logic';

export class Factory {
	static createCombatant = (type: CombatantType): CombatantModel => {
		return {
			id: Utils.guid(),
			type: type,
			name: '',
			speciesID: '',
			roleID: '',
			backgroundID: '',
			size: 1,
			level: 1,
			xp: 0,
			features: [],
			items: [],
			carried: [],
			combat: {
				current: false,
				state: CombatantState.Standing,
				stunned: false,
				position: {
					x: 0,
					y: 0
				},
				trail: [],
				damage: 0,
				wounds: 0,
				initiative: Number.MIN_VALUE,
				movement: 0,
				senses: 0,
				hidden: 0,
				conditions: [],
				actions: []
			}
		};
	};

	static createGame = (): GameModel => {
		return {
			heroes: [
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero)
			],
			items: [],
			boons: [],
			money: 0,
			map: CampaignMapLogic.generateCampaignMap(),
			encounter: null
		};
	};

	static createCondition = (type: ConditionType, trait: TraitType, rank: number): ConditionModel => {
		return {
			id: Utils.guid(),
			type: type,
			trait: trait,
			rank: rank,
			details: {
				trait: TraitType.None,
				skill: SkillType.None,
				skillCategory: SkillCategoryType.None,
				damage: DamageType.None,
				damageCategory: DamageCategoryType.None
			}
		};
	};

	static createFeature = (id: string): FeatureModel => {
		return {
			id: id,
			type: FeatureType.Trait,
			damage: DamageType.None,
			damageCategory: DamageCategoryType.None,
			proficiency: ItemProficiencyType.None,
			skill: SkillType.None,
			skillCategory: SkillCategoryType.None,
			trait: TraitType.None,
			aura: ConditionType.None,
			rank: 1
		};
	};

	static createLootPile = (): LootPileModel => {
		return {
			id: Utils.guid(),
			items: [],
			position: { x: 0, y: 0 }
		};
	};
}
