import { BackgroundData } from '../data/background-data';
import { HeroSpeciesData } from '../data/hero-species-data';
import { ItemData } from '../data/item-data';
import { MonsterSpeciesData } from '../data/monster-species-data';
import { RoleData } from '../data/role-data';

import { BoonType } from '../enums/boon-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionModel } from '../models/action';
import type { BoonModel } from '../models/boon';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { FeatureModel } from '../models/feature';
import type { GameModel } from '../models/game';
import type { SpeciesModel } from '../models/species';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { FeatureLogic } from './feature-logic';
import { MagicItemGenerator } from './magic-item-generator';

export class GameLogic {
	static getRandomAction = () => {
		const actions: ActionModel[] = [];

		HeroSpeciesData.getList().forEach(s => actions.push(...s.actions));
		MonsterSpeciesData.getList().forEach(s => actions.push(...s.actions));
		RoleData.getList().forEach(r => actions.push(...r.actions));
		BackgroundData.getList().forEach(b => actions.push(...b.actions));

		const n = Random.randomNumber(actions.length);
		const copy = JSON.parse(JSON.stringify(actions[n])) as ActionModel;
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
				options.push(DamageType.Acid);
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
				options.push(DamageType.Decay);
				options.push(DamageType.Poison);
				options.push(DamageType.Psychic);
				break;
		}

		const n = Random.randomNumber(options.length);
		return options[n];
	};

	static getRandomDamageCategoryType = () => {
		const options = [
			DamageCategoryType.Physical,
			DamageCategoryType.Energy,
			DamageCategoryType.Corruption
		];

		const n = Random.randomNumber(options.length);
		return options[n];
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

		const n = Random.randomNumber(options.length);
		return options[n];
	};

	static getRandomSkill = (category: SkillCategoryType = SkillCategoryType.Any) => {
		const options = [];

		switch (category) {
			case SkillCategoryType.Any:
				options.push(SkillType.Brawl);
				options.push(SkillType.Perception);
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
				options.push(SkillType.Reactions);
				options.push(SkillType.Spellcasting);
				break;
		}

		const n = Random.randomNumber(options.length);
		return options[n];
	};

	static getRandomSkillCategory = () => {
		const options = [
			SkillCategoryType.Physical,
			SkillCategoryType.Mental
		];

		const n = Random.randomNumber(options.length);
		return options[n];
	};

	static getRandomTrait = () => {
		const options = [
			TraitType.Endurance,
			TraitType.Resolve,
			TraitType.Speed
		];

		const n = Random.randomNumber(options.length);
		return options[n];
	};

	///////////////////////////////////////////////////////////////////////////////

	static getFeatureDescription = (feature: FeatureModel) => {
		const title = FeatureLogic.getFeatureTitle(feature).toString();
		const desc = FeatureLogic.getFeatureInformation(feature).toString();
		return `${title}: ${desc}`;
	};

	static getActionDescription = (action: ActionModel) => {
		return action.name;
	};

	static getConditionDescription = (condition: ConditionModel) => {
		switch (condition.type) {
			case ConditionType.AutoHeal:
				return 'Healing';
			case ConditionType.AutoDamage:
				return `${condition.details.damage} damage`;
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

	static generateBoon = (): BoonModel => {
		const list = [
			BoonType.ExtraHero,
			BoonType.ExtraXP,
			BoonType.LevelUp,
			BoonType.MagicItem
		];
		const type = Collections.draw(list);

		let data = null;
		switch (type) {
			case BoonType.MagicItem:
				data = MagicItemGenerator.generateMagicItem();
				break;
			case BoonType.ExtraXP:
				data = Random.dice(1);
				break;
		}

		return {
			id: Utils.guid(),
			type: type,
			data: data
		};
	};

	static getDamageCategoryType = (type: DamageType) => {
		switch (type) {
			case DamageType.All:
				return DamageCategoryType.All;
			case DamageType.Acid:
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
			case DamageType.Decay:
			case DamageType.Poison:
			case DamageType.Psychic:
				return DamageCategoryType.Corruption;
		}

		return DamageCategoryType.None;
	};

	static addHeroToGame = (game: GameModel, hero: CombatantModel) => {
		const index = game.heroes.findIndex(h => h.id === hero.id);
		if (index === -1) {
			game.heroes.push(hero);
		} else {
			game.heroes[index] = hero;
		}
		game.heroes.sort((a, b) => (a.name > b.name ? 1 : -1));
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
			case SkillType.Reactions:
			case SkillType.Spellcasting:
				return SkillCategoryType.Mental;
		}

		return SkillCategoryType.None;
	};

	///////////////////////////////////////////////////////////////////////////////

	static getBackground = (id: string) => {
		return BackgroundData.getList().find(b => b.id === id);
	};

	static getBackgroundDeck = (game: GameModel | null = null) => {
		if (game) {
			const used = game.heroes.map(h => h.backgroundID);

			const deck = BackgroundData
				.getList()
				.filter(background => !used.includes(background.id))
				.map(background => background.id);

			if (deck.length >= 3) {
				return deck;
			}
		}

		return BackgroundData
			.getList()
			.map(background => background.id);
	};

	static getRole = (id: string) => {
		return RoleData.getList().find(r => r.id === id);
	};

	static getRoleDeck = (game: GameModel | null = null) => {
		if (game) {
			const used = game.heroes.map(h => h.roleID);

			const deck = RoleData
				.getList()
				.filter(role => !used.includes(role.id))
				.map(role => role.id);

			if (deck.length >= 3) {
				return deck;
			}
		}

		return RoleData
			.getList()
			.map(role => role.id);
	};

	static getSpecies = (id: string) => {
		const all = ([] as SpeciesModel[]).concat(HeroSpeciesData.getList()).concat(MonsterSpeciesData.getList());
		return all.find(s => s.id === id);
	};

	static getSpeciesDeck = (game: GameModel | null = null) => {
		if (game) {
			const used = game.heroes.map(h => h.speciesID);

			const deck = HeroSpeciesData
				.getList()
				.filter(species => !used.includes(species.id))
				.map(species => species.id);

			if (deck.length >= 3) {
				return deck;
			}

			return HeroSpeciesData
				.getList()
				.map(species => species.id);
		}

		return MonsterSpeciesData
			.getList()
			.map(species => species.id);
	};

	static getItem = (id: string) => {
		return ItemData.getList().find(b => b.id === id);
	};

	static getItemsForProficiency = (proficiency: ItemProficiencyType) => {
		return ItemData.getList().filter(i => i.proficiency === proficiency);
	};
}
