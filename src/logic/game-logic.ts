import { BackgroundData } from '../data/background-data';
import { HeroSpeciesData } from '../data/hero-species-data';
import { ItemData } from '../data/item-data';
import { MonsterSpeciesData } from '../data/monster-species-data';
import { RoleData } from '../data/role-data';

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
	static getHeroSpeciesDeck = (packs: string[]) => {
		return HeroSpeciesData.getList().filter(s => (s.pack === '') || packs.includes(s.pack));
	};

	static getMonsterSpeciesDeck = (packs: string[]) => {
		return MonsterSpeciesData.getList().filter(s => (s.pack === '') || packs.includes(s.pack));
	};

	static getRoleDeck = (packs: string[]) => {
		return RoleData.getList().filter(r => (r.pack === '') || packs.includes(r.pack));
	};

	static getBackgroundDeck = (packs: string[]) => {
		return BackgroundData.getList().filter(b => (b.pack === '') || packs.includes(b.pack));
	};

	static getItemDeck = (packs: string[]) => {
		return ItemData.getList().filter(i => (i.pack === '') || packs.includes(i.pack));
	};

	///////////////////////////////////////////////////////////////////////////

	static getPacks = () => {
		const packs = ([] as string[])
			.concat(HeroSpeciesData.getList().map(s => s.pack).filter(p => !!p))
			.concat(MonsterSpeciesData.getList().map(s => s.pack).filter(p => !!p))
			.concat(RoleData.getList().map(r => r.pack).filter(p => !!p))
			.concat(BackgroundData.getList().map(b => b.pack).filter(p => !!p))
			.concat(ItemData.getList().map(i => i.pack).filter(p => !!p));

		return Collections.distinct(packs, p => p).sort();
	};

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

	///////////////////////////////////////////////////////////////////////////

	static getRandomAction = (item: ItemModel) => {
		const packs = GameLogic.getPacks();

		const allActions: ActionModel[] = [];
		GameLogic.getHeroSpeciesDeck(packs).forEach(s => allActions.push(...s.actions));
		GameLogic.getMonsterSpeciesDeck(packs).forEach(s => allActions.push(...s.actions));
		GameLogic.getRoleDeck(packs).forEach(r => allActions.push(...r.actions));
		GameLogic.getBackgroundDeck(packs).forEach(b => allActions.push(...b.actions));

		const actions = allActions.filter(a => {
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
		game.heroSlots = Math.max(game.heroSlots - 1, 0);
		game.heroes.push(hero);
		game.heroes.sort((a, b) => a.name.localeCompare(b.name));
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

	static getItemsForProficiency = (proficiency: ItemProficiencyType, packs: string[]) => {
		return GameLogic.getItemDeck(packs).filter(i => i.proficiency === proficiency);
	};

	///////////////////////////////////////////////////////////////////////////

	static getSpeciesStrength = (species: SpeciesModel) => {
		let value = 0;

		species.traits.forEach(t => {
			value += 5;
		});

		species.skills.forEach(s => {
			value += 1;
		});

		value += Collections.mean(species.features, feature => GameLogic.getFeatureStrength(feature)) + species.features.length;
		value += Collections.mean(species.actions, action => GameLogic.getActionStrength(action)) + species.actions.length;

		return Math.round(value);
	};

	static getRoleStrength = (role: RoleModel) => {
		let value = 0;

		role.traits.forEach(t => {
			value += 5;
		});

		role.skills.forEach(s => {
			value += 1;
		});

		value += Collections.mean(role.features, feature => GameLogic.getFeatureStrength(feature)) + role.features.length;
		value += Collections.mean(role.actions, action => GameLogic.getActionStrength(action)) + role.actions.length;

		return Math.round(value);
	};

	static getBackgroundStrength = (background: BackgroundModel) => {
		let value = 0;

		value += Collections.mean(background.features, feature => GameLogic.getFeatureStrength(feature)) + background.features.length;
		value += Collections.mean(background.actions, action => GameLogic.getActionStrength(action)) + background.actions.length;

		return Math.round(value);
	};

	static getFeatureStrength = (feature: FeatureModel) => {
		switch (feature.type) {
			case FeatureType.Aura:
				return feature.rank * 3;
			case FeatureType.DamageBonus:
			case FeatureType.DamageResist:
				return feature.rank;
			case FeatureType.DamageCategoryBonus:
			case FeatureType.DamageCategoryResist:
				return feature.rank * 3;
			case FeatureType.Skill:
				return feature.rank;
			case FeatureType.SkillCategory:
				return feature.rank * 3;
			case FeatureType.Trait:
				return feature.rank * 5;
		}

		return 0;
	};

	static getActionStrength = (action: ActionModel) => {
		let strength = 0;

		const param = action.parameters.find(a => a.id === 'targets');
		if (param) {
			const targetParam = param as ActionTargetParameterModel;
			if (targetParam.targets) {
				switch (targetParam.targets.type) {
					case ActionTargetType.Combatants:
						strength = Math.min(targetParam.targets.count, 3) * 2;
						break;
					case ActionTargetType.Allies:
						strength = Math.min(targetParam.targets.count, 3) * 3;
						break;
					case ActionTargetType.Enemies:
						strength = Math.min(targetParam.targets.count, 3) * 5;
						break;
				}
			}
		}

		const mockCombatant = { items: [] as ItemModel[] } as CombatantModel;
		strength += Math.max(ActionLogic.getActionRange(action, mockCombatant), 1);

		const checkEffects = (effects: ActionEffectModel[]) => {
			let value = 0;

			effects.forEach(e => {
				switch (e.id) {
					case 'attack': {
						value += checkEffects(e.children) / 2;
						break;
					}
					case 'damage': {
						value += (e.data as { type: DamageType, rank: number }).rank;
						break;
					}
					case 'weapondamage': {
						value += 3 + (e.data as number);
						break;
					}
					case 'wound': {
						value += 5 * (e.data as number);
						break;
					}
					case 'addcondition' : {
						value += (e.data as ConditionModel).rank;
						break;
					}
					case 'stun': {
						value += 3;
						break;
					}
					case 'disarm':
					case 'steal': {
						value += 10;
						break;
					}
					default: {
						value += 1;
						break;
					}
				}
			});

			return value;
		};

		strength += checkEffects(action.effects);

		if (ActionLogic.getActionSpeed(action) === 'Quick') {
			strength *= 2;
		}

		return Math.round(strength);
	};
}
