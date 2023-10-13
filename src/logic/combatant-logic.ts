import { BaseData } from '../data/base-data';

import { CardType } from '../enums/card-type';
import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { FeatureType } from '../enums/feature-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { QuirkType } from '../enums/quirk-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { MagicItemGenerator } from '../generators/magic-item-generator';

import type { ActionModel } from '../models/action';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { FeatureModel } from '../models/feature';
import type { ItemModel } from '../models/item';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { Factory } from './factory';
import { GameLogic } from './game-logic';

export class CombatantLogic {
	static CARRY_CAPACITY = 4;

	static applyCombatantCards = (combatant: CombatantModel, speciesID: string, roleID: string, backgroundID: string) => {
		const species = GameLogic.getSpecies(speciesID);
		if (species) {
			combatant.speciesID = species.id;
			combatant.type = species.type;
			combatant.faction = species.type;
			combatant.size = species.size;
			species.quirks.forEach(q => combatant.quirks.push(q));
			species.startingFeatures.forEach(f => combatant.features.push(JSON.parse(JSON.stringify(f)) as FeatureModel));

			if (combatant.faction === CombatantType.Monster) {
				combatant.name = species.name;
			}
		}

		if (combatant.quirks.includes(QuirkType.Beast) || combatant.quirks.includes(QuirkType.Mindless)) {
			// Beasts / Mindless monsters don't have a role or background
		} else {
			const role = GameLogic.getRole(roleID);
			if (role) {
				combatant.roleID = role.id;
				role.startingFeatures.forEach(f => combatant.features.push(JSON.parse(JSON.stringify(f)) as FeatureModel));

				if (combatant.faction === CombatantType.Monster) {
					combatant.name += ` ${role.name}`;
				}
			}

			const background = GameLogic.getBackground(backgroundID);
			if (background) {
				combatant.backgroundID = background.id;
				background.startingFeatures.forEach(f => combatant.features.push(JSON.parse(JSON.stringify(f)) as FeatureModel));
			}
		}
	};

	static incrementCombatantLevel = (combatant: CombatantModel, feature: FeatureModel, packIDs: string[]) => {
		// Increment level, remove XP
		combatant.level += 1;
		combatant.xp = Math.max(combatant.xp - combatant.level, 0);

		// Add the new feature
		combatant.features.push(feature);

		// Make magic items more powerful
		for (let n = 0; n !== combatant.items.length; ++n) {
			const item = combatant.items[n];
			if (item.magic) {
				if (Random.randomNumber(5) === 0) {
					combatant.items[n] = MagicItemGenerator.generateMagicItem(item, packIDs);
				}
			}
		}
	};

	static makeFeatureChoices = (combatant: CombatantModel) => {
		combatant.features.forEach(feature => {
			if (feature.trait === TraitType.Any) {
				const options = [
					TraitType.Endurance,
					TraitType.Resolve,
					TraitType.Speed
				];
				feature.trait = Collections.draw(options);
			}

			if (feature.skill === SkillType.Any) {
				const options = [
					SkillType.Brawl,
					SkillType.Perception,
					SkillType.Presence,
					SkillType.Reactions,
					SkillType.Spellcasting,
					SkillType.Stealth,
					SkillType.Weapon
				];
				feature.skill = Collections.draw(options);
			}

			if (feature.skillCategory === SkillCategoryType.Any) {
				const options = [
					SkillCategoryType.Physical,
					SkillCategoryType.Mental
				];
				feature.skillCategory = Collections.draw(options);
			}

			if (feature.proficiency === ItemProficiencyType.Any) {
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
				feature.proficiency = Collections.draw(options.filter(o => !CombatantLogic.getProficiencies(combatant).includes(o)));
			}

			if (feature.damage === DamageType.Any) {
				const options = [
					DamageType.Acid,
					DamageType.Cold,
					DamageType.Decay,
					DamageType.Edged,
					DamageType.Electricity,
					DamageType.Fire,
					DamageType.Impact,
					DamageType.Light,
					DamageType.Piercing,
					DamageType.Poison,
					DamageType.Psychic,
					DamageType.Sonic
				];
				feature.damage = Collections.draw(options);
			}

			if (feature.damageCategory === DamageCategoryType.Any) {
				const options = [
					DamageCategoryType.Physical,
					DamageCategoryType.Energy,
					DamageCategoryType.Corruption
				];
				feature.damageCategory = Collections.draw(options);
			}
		});
	};

	static addItems = (combatant: CombatantModel, packIDs: string[]) => {
		if (combatant.quirks.includes(QuirkType.Beast)) {
			// Beasts can't use items
			return;
		}

		CombatantLogic.getProficiencies(combatant).forEach(prof => {
			const items = GameLogic.getItemsForProficiency(prof, packIDs);
			const item = JSON.parse(JSON.stringify(Collections.draw(items))) as ItemModel;
			item.id = Utils.guid();
			combatant.items.push(item);
		});
	};

	static canEquip = (combatant: CombatantModel, item: ItemModel) => {
		if (combatant.quirks.includes(QuirkType.Beast)) {
			// Beasts can't use items
			return false;
		}

		if (item.location === ItemLocationType.None) {
			return false;
		}

		let slotsTotal = 1;
		switch (item.location) {
			case ItemLocationType.Hand:
			case ItemLocationType.Ring:
				slotsTotal = 2;
				break;
		}

		const slotsUsed = Collections.sum(combatant.items.filter(i => i.location === item.location), i => i.slots);
		const slotsAvailable = slotsTotal - slotsUsed;

		if (item.slots > slotsAvailable) {
			return false;
		}

		const profOK = (item.proficiency === ItemProficiencyType.None) || (CombatantLogic.getProficiencies(combatant).includes(item.proficiency));
		return profOK;
	};

	static getFeatureDeck = (combatant: CombatantModel) => {
		const s = GameLogic.getSpecies(combatant.speciesID);
		const r = GameLogic.getRole(combatant.roleID);
		const b = GameLogic.getBackground(combatant.backgroundID);

		return ([] as FeatureModel[])
			.concat(s ? s.features : [])
			.concat(r ? r.features : [])
			.concat(b ? b.features : []);
	};

	static getActionDeck = (combatant: CombatantModel) => {
		const s = GameLogic.getSpecies(combatant.speciesID);
		const r = GameLogic.getRole(combatant.roleID);
		const b = GameLogic.getBackground(combatant.backgroundID);

		let list = ([] as ActionModel[])
			.concat(s ? s.actions : [])
			.concat(r ? r.actions : [])
			.concat(b ? b.actions : []);

		combatant.items.forEach(i => {
			list = list.concat(i.actions);
		});

		return list;
	};

	static getFeatureSource = (combatant: CombatantModel, cardID: string) => {
		if (BaseData.getBaseFeatures().find(f => f.id === cardID)) {
			return 'Standard';
		}

		const s = GameLogic.getSpecies(combatant.speciesID);
		if (!!s && s.features.find(c => c.id === cardID)) {
			return s.name;
		}

		const r = GameLogic.getRole(combatant.roleID);
		if (!!r && r.features.find(c => c.id === cardID)) {
			return r.name;
		}

		const b = GameLogic.getBackground(combatant.backgroundID);
		if (!!b && b.features.find(c => c.id === cardID)) {
			return b.name;
		}

		let itemName = '';
		combatant.items.forEach(item => {
			if (item.armor) {
				if (item.armor.features.find(f => f.id === cardID)) {
					itemName = item.name;
				}
			}
			if (item.features.find(f => f.id === cardID)) {
				itemName = item.name;
			}
		});
		if (itemName !== '') {
			return itemName;
		}

		return '';
	};

	static getFeatureSourceType = (combatant: CombatantModel, cardID: string) => {
		if (BaseData.getBaseFeatures().find(f => f.id === cardID)) {
			return CardType.Base;
		}

		const s = GameLogic.getSpecies(combatant.speciesID);
		if (!!s && s.features.find(c => c.id === cardID)) {
			return CardType.Species;
		}

		const r = GameLogic.getRole(combatant.roleID);
		if (!!r && r.features.find(c => c.id === cardID)) {
			return CardType.Role;
		}

		const b = GameLogic.getBackground(combatant.backgroundID);
		if (!!b && b.features.find(c => c.id === cardID)) {
			return CardType.Background;
		}

		let isItem = false;
		combatant.items.forEach(item => {
			if (item.armor) {
				if (item.armor.features.find(f => f.id === cardID)) {
					isItem = true;
				}
			}
			if (item.features.find(f => f.id === cardID)) {
				isItem = true;
			}
		});
		if (isItem) {
			return CardType.Item;
		}

		return CardType.Default;
	};

	static getActionSource = (combatant: CombatantModel, cardID: string) => {
		if (BaseData.getBaseActions().find(a => a.id === cardID)) {
			return 'Standard';
		}

		const s = GameLogic.getSpecies(combatant.speciesID);
		if (!!s && s.actions.find(c => c.id === cardID)) {
			return s.name;
		}

		const r = GameLogic.getRole(combatant.roleID);
		if (!!r && r.actions.find(c => c.id === cardID)) {
			return r.name;
		}

		const b = GameLogic.getBackground(combatant.backgroundID);
		if (!!b && b.actions.find(c => c.id === cardID)) {
			return b.name;
		}

		let itemName = '';
		combatant.items.forEach(item => {
			if (item.actions.find(a => a.id === cardID)) {
				itemName = item.name;
			}
		});
		if (itemName !== '') {
			return itemName;
		}

		return '';
	};

	static getActionSourceType = (combatant: CombatantModel, cardID: string) => {
		if (BaseData.getBaseActions().find(a => a.id === cardID)) {
			return CardType.Base;
		}

		const s = GameLogic.getSpecies(combatant.speciesID);
		if (!!s && s.actions.find(c => c.id === cardID)) {
			return CardType.Species;
		}

		const r = GameLogic.getRole(combatant.roleID);
		if (!!r && r.actions.find(c => c.id === cardID)) {
			return CardType.Role;
		}

		const b = GameLogic.getBackground(combatant.backgroundID);
		if (!!b && b.actions.find(c => c.id === cardID)) {
			return CardType.Background;
		}

		let isItem = false;
		combatant.items.forEach(item => {
			if (item.actions.find(a => a.id === cardID)) {
				isItem = true;
			}
		});
		if (isItem) {
			return CardType.Item;
		}

		return CardType.Default;
	};

	static resetCombatant = (combatant: CombatantModel) => {
		combatant.combat.current = false;
		combatant.combat.stunned = false;
		combatant.combat.state = CombatantState.Standing;
		combatant.combat.position = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
		combatant.combat.trail = [];
		combatant.combat.damage = 0;
		combatant.combat.wounds = 0;
		combatant.combat.initiative = Number.MIN_VALUE;
		combatant.combat.movement = 0;
		combatant.combat.senses = 0;
		combatant.combat.hidden = 0;
		combatant.combat.conditions = [];
		combatant.combat.actions = [];
		combatant.combat.selectedAction = null;
		combatant.combat.intents = null;
	};

	static getFeatures = (combatant: CombatantModel) => {
		let list = ([] as FeatureModel[]).concat(combatant.features);
		combatant.items.forEach(i => {
			if (i.armor) {
				list = list.concat(i.armor.features);
			}
			list = list.concat(i.features);
		});

		return list;
	};

	static getTraitRank = (combatant: CombatantModel, conditions: ConditionModel[], trait: TraitType) => {
		let value = 1;

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Trait)
			.filter(f => (f.trait === trait) || (f.trait === TraitType.All))
			.forEach(f => value += f.rank);

		conditions.filter(c => c.type === ConditionType.TraitBonus)
			.filter(c => (c.details.trait === trait) || (c.details.trait === TraitType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.TraitPenalty)
			.filter(c => (c.details.trait === trait) || (c.details.trait === TraitType.All))
			.forEach(c => value -= c.rank);

		// Minimum 0
		return Math.max(value, 0);
	};

	static getSkillRank = (combatant: CombatantModel, conditions: ConditionModel[], skill: SkillType) => {
		let value = 0;

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Skill)
			.filter(f => (f.skill === skill) || (f.skill === SkillType.All))
			.forEach(f => value += f.rank);
		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.SkillCategory)
			.filter(f => (f.skillCategory === GameLogic.getSkillCategory(skill)) || (f.skillCategory === SkillCategoryType.All))
			.forEach(f => value += f.rank);

		conditions.filter(c => c.type === ConditionType.SkillBonus)
			.filter(c => (c.details.skill === skill) || (c.details.skill === SkillType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.SkillCategoryBonus)
			.filter(c => (c.details.skillCategory === GameLogic.getSkillCategory(skill)) || (c.details.skillCategory === SkillCategoryType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.SkillPenalty)
			.filter(c => (c.details.skill === skill) || (c.details.trait === TraitType.All))
			.forEach(c => value -= c.rank);
		conditions.filter(c => c.type === ConditionType.SkillCategoryPenalty)
			.filter(c => (c.details.skillCategory === GameLogic.getSkillCategory(skill)) || (c.details.skillCategory === SkillCategoryType.All))
			.forEach(c => value -= c.rank);

		if (combatant.combat.state === CombatantState.Prone) {
			value = Math.floor(value / 2);
		}
		// Minimum 0
		return Math.max(value, 0);
	};

	static getDamageBonus = (combatant: CombatantModel, conditions: ConditionModel[], damage: DamageType) => {
		let value = 0;

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageBonus)
			.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
			.forEach(f => value += f.rank);
		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageCategoryBonus)
			.filter(f => (f.damageCategory === GameLogic.getDamageCategory(damage)) || (f.damageCategory === DamageCategoryType.All))
			.forEach(f => value += f.rank);

		conditions.filter(c => c.type === ConditionType.DamageBonus)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryBonus)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategory(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamagePenalty)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value -= c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryPenalty)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategory(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value -= c.rank);

		// No minimum value
		return value;
	};

	static getDamageResistance = (combatant: CombatantModel, conditions: ConditionModel[], damage: DamageType) => {
		let value = 0;

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageResist)
			.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
			.forEach(f => value += f.rank);
		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageCategoryResist)
			.filter(f => (f.damageCategory === GameLogic.getDamageCategory(damage)) || (f.damageCategory === DamageCategoryType.All))
			.forEach(f => value += f.rank);

		conditions.filter(c => c.type === ConditionType.DamageResistance)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryResistance)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategory(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamageVulnerability)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value -= c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryVulnerability)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategory(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value -= c.rank);

		// No minimum value
		return value;
	};

	static getProficiencies = (combatant: CombatantModel) => {
		const profs: ItemProficiencyType[] = [];

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Proficiency)
			.forEach(f => profs.push(f.proficiency));

		return Collections.distinct(profs, p => p.toString());
	};

	static getAuras = (combatant: CombatantModel) => {
		const auras: ConditionModel[] = [];

		if ((combatant.combat.state === CombatantState.Standing) || (combatant.combat.state === CombatantState.Prone)) {
			CombatantLogic.getFeatures(combatant)
				.filter(f => f.type === FeatureType.Aura)
				.forEach(f => {
					const original = auras.find(a => (a.type === f.aura)
						&& (a.details.trait === f.trait)
						&& (a.details.skill === f.skill)
						&& (a.details.skillCategory === f.skillCategory)
						&& (a.details.damage === f.damage)
						&& (a.details.damageCategory === f.damageCategory));
					if (original) {
						original.rank += 1;
					} else {
						const aura = Factory.createCondition(f.aura, TraitType.None, f.rank);
						aura.details.trait = f.trait;
						aura.details.skill = f.skill;
						aura.details.skillCategory = f.skillCategory;
						aura.details.damage = f.damage;
						aura.details.damageCategory = f.damageCategory;
						auras.push(aura);
					}
				});
		}

		return auras;
	};
}
