import { BackgroundData } from '../data/background-data';
import { ItemData } from '../data/item-data';
import { RoleData } from '../data/role-data';
import { SpeciesData } from '../data/species-data';

import { BoonType } from '../enums/boon-type';
import { CombatantType } from '../enums/combatant-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionModel } from '../models/action';
import type { BoonModel } from '../models/boon';
import type { CombatantModel } from '../models/combatant';
import type { GameModel } from '../models/game';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { MagicItemGenerator } from './magic-item-generator';

export class GameLogic {
	static getRandomAction = () => {
		const actions: ActionModel[] = [];

		SpeciesData.getList().forEach(s => actions.push(...s.actions));
		RoleData.getList().forEach(r => actions.push(...r.actions));
		BackgroundData.getList().forEach(b => actions.push(...b.actions));

		const copy = JSON.parse(JSON.stringify(Collections.draw(actions))) as ActionModel;
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

	///////////////////////////////////////////////////////////////////////////////

	static generateBoon = (): BoonModel => {
		let type = BoonType.ExtraHero;
		switch (Random.randomNumber(13)) {
			case 0:
			case 1:
			case 2:
				type = BoonType.ExtraHero;
				break;
			case 3:
			case 4:
			case 5:
				type = BoonType.ExtraXP;
				break;
			case 6:
			case 7:
			case 8:
				type = BoonType.LevelUp;
				break;
			case 9:
			case 10:
			case 11:
				type = BoonType.Money;
				break;
			case 12:
				type = BoonType.MagicItem;
				break;
		}

		let data = null;
		switch (type) {
			case BoonType.MagicItem:
				data = MagicItemGenerator.generateMagicItem();
				break;
			case BoonType.ExtraXP:
				data = Random.dice(5);
				break;
			case BoonType.Money:
				data = Random.dice(5) * 5;
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

	static getSpeciesDeck = (type: CombatantType) => {
		return SpeciesData
			.getList()
			.filter(s => s.type === type)
			.map(species => species.id);
	};

	static getRoleDeck = () => {
		return RoleData
			.getList()
			.map(role => role.id);
	};

	static getBackgroundDeck = () => {
		return BackgroundData
			.getList()
			.map(background => background.id);
	};

	static getSpecies = (id: string) => {
		return SpeciesData.getList().find(s => s.id === id);
	};

	static getRole = (id: string) => {
		return RoleData.getList().find(r => r.id === id);
	};

	static getBackground = (id: string) => {
		return BackgroundData.getList().find(b => b.id === id);
	};

	static getItem = (id: string) => {
		return ItemData.getList().find(b => b.id === id);
	};

	static getItemsForProficiency = (proficiency: ItemProficiencyType) => {
		return ItemData.getList().filter(i => i.proficiency === proficiency);
	};
}
