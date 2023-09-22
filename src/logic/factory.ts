import { StructureData } from '../data/structure-data';

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

import { CampaignMapGenerator } from '../generators/campaign-map-generator';

import { StrongholdLogic } from './stronghold-logic';

import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { FeatureModel } from '../models/feature';
import type { GameModel } from '../models/game';
import type { LootPileModel } from '../models/encounter';

import { Utils } from '../utils/utils';

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
			color: 'rgb(15, 15, 15)',
			quirks: [],
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
				actions: [],
				selectedAction: null,
				intents: null
			}
		};
	};

	static createGame = (packIDs: string[]): GameModel => {
		const game = {
			heroSlots: 5,
			heroes: [],
			items: [],
			boons: [],
			money: 0,
			map: CampaignMapGenerator.generateCampaignMap(packIDs),
			stronghold: [],
			encounter: null
		};

		StrongholdLogic.addStructure(game.stronghold, StructureData.barracks);
		StrongholdLogic.addStructure(game.stronghold, StructureData.barracks);

		return game;
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
			money: 0,
			position: { x: 0, y: 0 }
		};
	};
}
