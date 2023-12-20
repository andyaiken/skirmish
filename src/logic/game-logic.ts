import { BackgroundData } from '../data/background-data';
import { HeroSpeciesData } from '../data/hero-species-data';
import { ItemData } from '../data/item-data';
import { MonsterSpeciesData } from '../data/monster-species-data';
import { PackData } from '../data/pack-data';
import { PotionData } from '../data/potion-data';
import { RoleData } from '../data/role-data';
import { StructureData } from '../data/structure-data';

import { ActionTargetType } from '../enums/action-target-type';
import { BoonType } from '../enums/boon-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { FeatureType } from '../enums/feature-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionEffectModel, ActionModel, ActionTargetParameterModel } from '../models/action';
import type { BackgroundModel } from '../models/background';
import type { BoonModel } from '../models/boon';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { FeatureModel } from '../models/feature';
import type { GameModel } from '../models/game';
import type { ItemModel } from '../models/item';
import type { RoleModel } from '../models/role';
import type { SpeciesModel } from '../models/species';

import { Collections } from '../utils/collections';
import { Utils } from '../utils/utils';

import { ActionLogic } from './action-logic';

export class GameLogic {
	static getHeroSpeciesDeck = (packIDs: string[]) => {
		return HeroSpeciesData.getList().filter(s => (s.packID === '') || packIDs.includes(s.packID));
	};

	static getMonsterSpeciesDeck = (packIDs: string[]) => {
		return MonsterSpeciesData.getList().filter(s => (s.packID === '') || packIDs.includes(s.packID));
	};

	static getRoleDeck = (packIDs: string[]) => {
		return RoleData.getList().filter(r => (r.packID === '') || packIDs.includes(r.packID));
	};

	static getBackgroundDeck = (packIDs: string[]) => {
		return BackgroundData.getList().filter(b => (b.packID === '') || packIDs.includes(b.packID));
	};

	static getItemDeck = (packIDs: string[]) => {
		return ItemData.getList().filter(i => (i.packID === '') || packIDs.includes(i.packID));
	};

	static getPotionDeck = (packIDs: string[]) => {
		return PotionData.getList().filter(i => (i.packID === '') || packIDs.includes(i.packID));
	};

	static getStructureDeck = (packIDs: string[]) => {
		return StructureData.getList().filter(s => (s.packID === '') || packIDs.includes(s.packID));
	};

	///////////////////////////////////////////////////////////////////////////

	static getSpecies = (id: string) => {
		const allSpecies = ([] as SpeciesModel[])
			.concat(HeroSpeciesData.getList())
			.concat(MonsterSpeciesData.getList());

		return allSpecies.find(s => s.id === id) || null;
	};

	static getRole = (id: string) => {
		return RoleData.getList().find(r => r.id === id) || null;
	};

	static getBackground = (id: string) => {
		return BackgroundData.getList().find(b => b.id === id) || null;
	};

	static getItem = (id: string) => {
		return ItemData.getList().find(i => i.id === id) || null;
	};

	static getPotion = (id: string) => {
		return PotionData.getList().find(i => i.id === id) || null;
	};

	static getStructure = (id: string) => {
		return StructureData.getList().find(s => s.id === id) || null;
	};

	static getPack = (id: string) => {
		return PackData.getList().find(p => p.id === id) || null;
	};

	///////////////////////////////////////////////////////////////////////////

	static getAllActions = (packIDs: string[]) => {
		const actions: ActionModel[] = [];

		GameLogic.getHeroSpeciesDeck(packIDs).forEach(s => actions.push(...s.actions));
		GameLogic.getMonsterSpeciesDeck(packIDs).forEach(s => actions.push(...s.actions));
		GameLogic.getRoleDeck(packIDs).forEach(r => actions.push(...r.actions));
		GameLogic.getBackgroundDeck(packIDs).forEach(b => actions.push(...b.actions));

		return actions;
	};

	static getRandomAction = (item: ItemModel, packIDs: string[]) => {
		const actions = GameLogic.getAllActions(packIDs).filter(a => {
			// Ignore actions that require a different sort of item
			const prerequisite = a.prerequisites.find(p => p.id === 'item');
			if (prerequisite) {
				const types = prerequisite.data as ItemProficiencyType[];
				if (!types.includes(item.proficiency)) {
					return false;
				}
			}

			return true;
		});

		const action = Collections.draw(actions);
		const copy = JSON.parse(JSON.stringify(action)) as ActionModel;
		copy.id = Utils.guid();

		return copy;
	};

	static getRandomDamageType = (category: DamageCategoryType = DamageCategoryType.Any) => {
		const options = [];

		switch (category) {
			case DamageCategoryType.Any:
				options.push(DamageType.Acid);
				options.push(DamageType.Cold);
				options.push(DamageType.Decay);
				options.push(DamageType.Edged);
				options.push(DamageType.Electricity);
				options.push(DamageType.Fire);
				options.push(DamageType.Impact);
				options.push(DamageType.Light);
				options.push(DamageType.Piercing);
				options.push(DamageType.Poison);
				options.push(DamageType.Psychic);
				options.push(DamageType.Sonic);
				break;
			case DamageCategoryType.Physical:
				options.push(DamageType.Edged);
				options.push(DamageType.Impact);
				options.push(DamageType.Piercing);
				break;
			case DamageCategoryType.Energy:
				options.push(DamageType.Cold);
				options.push(DamageType.Electricity);
				options.push(DamageType.Fire);
				options.push(DamageType.Light);
				options.push(DamageType.Sonic);
				break;
			case DamageCategoryType.Corruption:
				options.push(DamageType.Acid);
				options.push(DamageType.Decay);
				options.push(DamageType.Poison);
				options.push(DamageType.Psychic);
				break;
		}

		return Collections.draw(options);
	};

	static getRandomDamageCategoryType = () => {
		const options = [
			DamageCategoryType.Physical,
			DamageCategoryType.Energy,
			DamageCategoryType.Corruption
		];

		return Collections.draw(options);
	};

	static getRandomItemProficiency = () => {
		const options = [
			ItemProficiencyType.MilitaryWeapons,
			ItemProficiencyType.LargeWeapons,
			ItemProficiencyType.PairedWeapons,
			ItemProficiencyType.RangedWeapons,
			ItemProficiencyType.PowderWeapons,
			ItemProficiencyType.Implements,
			ItemProficiencyType.LightArmor,
			ItemProficiencyType.HeavyArmor,
			ItemProficiencyType.Shields
		];

		return Collections.draw(options);
	};

	static getRandomSkill = (category: SkillCategoryType = SkillCategoryType.Any) => {
		const options = [];

		switch (category) {
			case SkillCategoryType.Any:
				options.push(SkillType.Brawl);
				options.push(SkillType.Perception);
				options.push(SkillType.Presence);
				options.push(SkillType.Reactions);
				options.push(SkillType.Spellcasting);
				options.push(SkillType.Stealth);
				options.push(SkillType.Weapon);
				break;
			case SkillCategoryType.Physical:
				options.push(SkillType.Brawl);
				options.push(SkillType.Stealth);
				options.push(SkillType.Weapon);
				break;
			case SkillCategoryType.Mental:
				options.push(SkillType.Perception);
				options.push(SkillType.Presence);
				options.push(SkillType.Reactions);
				options.push(SkillType.Spellcasting);
				break;
		}

		return Collections.draw(options);
	};

	static getRandomSkillCategory = () => {
		const options = [
			SkillCategoryType.Physical,
			SkillCategoryType.Mental
		];

		return Collections.draw(options);
	};

	static getRandomTrait = () => {
		const options = [
			TraitType.Endurance,
			TraitType.Resolve,
			TraitType.Speed
		];

		return Collections.draw(options);
	};

	///////////////////////////////////////////////////////////////////////////

	static getBoonIsHeroType = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.ExtraHero:
			case BoonType.ExtraXP:
			case BoonType.LevelUp:
				return true;
		}

		return false;
	};

	static getBoonIsItemType = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.EnchantItem:
			case BoonType.MagicItem:
			case BoonType.Money:
				return true;
		}

		return false;
	};

	static getBoonIsStrongholdType = (boon: BoonModel) => {
		switch (boon.type) {
			case BoonType.Structure:
				return true;
		}

		return false;
	};

	static getDamageCategory = (type: DamageType) => {
		switch (type) {
			case DamageType.All:
				return DamageCategoryType.All;
			case DamageType.Edged:
			case DamageType.Impact:
			case DamageType.Piercing:
				return DamageCategoryType.Physical;
			case DamageType.Cold:
			case DamageType.Electricity:
			case DamageType.Fire:
			case DamageType.Light:
			case DamageType.Sonic:
				return DamageCategoryType.Energy;
			case DamageType.Acid:
			case DamageType.Decay:
			case DamageType.Poison:
			case DamageType.Psychic:
				return DamageCategoryType.Corruption;
		}

		return DamageCategoryType.None;
	};

	static getSkillCategory = (skill: SkillType) => {
		switch (skill) {
			case SkillType.All:
				return SkillCategoryType.All;
			case SkillType.Brawl:
			case SkillType.Stealth:
			case SkillType.Weapon:
				return SkillCategoryType.Physical;
			case SkillType.Perception:
			case SkillType.Presence:
			case SkillType.Reactions:
			case SkillType.Spellcasting:
				return SkillCategoryType.Mental;
		}

		return SkillCategoryType.None;
	};

	static getItemsForProficiency = (proficiency: ItemProficiencyType, packIDs: string[]) => {
		return GameLogic.getItemDeck(packIDs).filter(i => i.proficiency === proficiency);
	};

	static addHeroToGame = (game: GameModel, hero: CombatantModel) => {
		game.heroSlots = Math.max(game.heroSlots - 1, 0);
		game.heroes.push(hero);
		game.heroes = Collections.sort(game.heroes, n => n.name);
	};

	///////////////////////////////////////////////////////////////////////////

	static getSpeciesStrength = (species: SpeciesModel) => {
		let value = 0;

		value += Collections.sum(species.startingFeatures, feature => GameLogic.getFeatureStrength(feature)) + species.startingFeatures.length;
		value += Collections.mean(species.features, feature => GameLogic.getFeatureStrength(feature)) + species.features.length;
		value += Collections.mean(species.actions, action => GameLogic.getActionStrength(action)) + species.actions.length;

		return Math.round(value / 5);
	};

	static getRoleStrength = (role: RoleModel) => {
		let value = 0;

		value += Collections.sum(role.startingFeatures, feature => GameLogic.getFeatureStrength(feature)) + role.startingFeatures.length;
		value += Collections.mean(role.features, feature => GameLogic.getFeatureStrength(feature)) + role.features.length;
		value += Collections.mean(role.actions, action => GameLogic.getActionStrength(action)) + role.actions.length;

		return Math.round(value / 5);
	};

	static getBackgroundStrength = (background: BackgroundModel) => {
		let value = 0;

		value += Collections.sum(background.startingFeatures, feature => GameLogic.getFeatureStrength(feature)) + background.startingFeatures.length;
		value += Collections.mean(background.features, feature => GameLogic.getFeatureStrength(feature)) + background.features.length;
		value += Collections.mean(background.actions, action => GameLogic.getActionStrength(action)) + background.actions.length;

		return Math.round(value / 5);
	};

	static getFeatureStrength = (feature: FeatureModel) => {
		let factor = 1;

		switch (feature.type) {
			case FeatureType.Aura:
				factor = 3;
				break;
			case FeatureType.DamageBonus:
			case FeatureType.DamageResist:
				factor = (feature.damage === DamageType.Any) ? 3 : 1;
				break;
			case FeatureType.DamageCategoryBonus:
			case FeatureType.DamageCategoryResist:
				factor = (feature.damageCategory === DamageCategoryType.Any) ? 5 : 3;
				break;
			case FeatureType.Skill:
				factor = (feature.skill === SkillType.Any) ? 3 : 1;
				break;
			case FeatureType.SkillCategory:
				factor = (feature.skillCategory === SkillCategoryType.Any) ? 5 : 3;
				break;
			case FeatureType.Trait:
				factor = (feature.trait === TraitType.Any) ? 8 : 5;
				break;
			case FeatureType.Proficiency:
				factor = 0;
				break;
		}

		return feature.rank * factor;
	};

	static getActionStrength = (action: ActionModel) => {
		const targetParam = action.parameters.find(a => a.id === 'targets') as ActionTargetParameterModel;
		const targetStrength = targetParam ? GameLogic.getActionTargetStrength(targetParam, action) : 1;

		const effectStrength = Collections.sum(action.effects, e => GameLogic.getActionEffectStrength(e));

		let strength = Math.round(targetStrength * effectStrength);
		if (ActionLogic.getActionSpeed(action) === 'Quick') {
			strength += 4;
		}

		return strength;
	};

	static getActionTargetStrength = (targetParam: ActionTargetParameterModel, action: ActionModel) => {
		// Calculate the likely number of useful targets
		if (targetParam.targets) {
			const mockCombatant = { items: [] as ItemModel[] } as CombatantModel;
			const range = Math.max(ActionLogic.getActionRange(action, mockCombatant), 1);

			let targetsInRange = 1;
			switch (range) {
				case 1:
				case 2:
				case 3:
					targetsInRange = 2;
					break;
				case 4:
				case 5:
				case 6:
					targetsInRange = 3;
					break;
				default:
					targetsInRange = 4;
					break;
			}

			let targets = Math.min(targetParam.targets.count, targetsInRange);

			if (targetParam.targets.type === ActionTargetType.Combatants) {
				targets = Math.max(targets - 1, 1);
			}

			return targets;
		}

		// Targets self
		return 1;
	};

	static getActionEffectStrength = (effect: ActionEffectModel): number => {
		switch (effect.id) {
			case 'attack':
				return Collections.sum(effect.children, e => GameLogic.getActionEffectStrength(e)) / 2;
			case 'toSelf':
				return Collections.sum(effect.children, e => GameLogic.getActionEffectStrength(e));
			case 'damage':
				return (effect.data as { type: DamageType, rank: number }).rank;
			case 'weapondamage':
				return 3 + (effect.data as number);
			case 'wound':
				return 5 * (effect.data as number);
			case 'addcondition' :
				return (effect.data as ConditionModel).rank;
			case 'stun':
				return 5;
			case 'knockdown':
				return 2;
			case 'disarm':
			case 'steal':
				return 10;
			case 'createPotion':
				return 7;
			case 'commandAction':
				return 5;
			case 'healdamage':
				return 2;
			case 'healwounds':
				return 5 * (effect.data as number);
			case 'summon':
				return 5;
			case 'takeAnotherAction':
				return 0;
		}

		return 1;
	};
}
