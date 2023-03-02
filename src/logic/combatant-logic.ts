import { UniversalData } from '../data/universal-data';

import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { FeatureType } from '../enums/feature-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { FeatureModel } from '../models/feature';
import type { ItemModel } from '../models/item';

import { Collections } from '../utils/collections';
import { Utils } from '../utils/utils';

import { Factory } from './factory';
import { FeatureLogic } from './feature-logic';
import { GameLogic } from './game-logic';

export class CombatantLogic {
	static applyCombatantCards = (combatant: CombatantModel, speciesID: string, roleID: string, backgroundID: string) => {
		const species = GameLogic.getSpecies(speciesID);
		if (species) {
			combatant.speciesID = species.id;
			combatant.size = species.size;
			species.traits.forEach(t => combatant.features.push(FeatureLogic.createTraitFeature(Utils.guid(), t, 1)));
		}

		const role = GameLogic.getRole(roleID);
		if (role) {
			combatant.roleID = role.id;
			role.traits.forEach(t => combatant.features.push(FeatureLogic.createTraitFeature(Utils.guid(), t, 1)));
			role.skills.forEach(s => combatant.features.push(FeatureLogic.createSkillFeature(Utils.guid(), s, 2)));
			role.proficiencies.forEach(p => combatant.features.push(FeatureLogic.createProficiencyFeature(Utils.guid(), p)));
		}

		const background = GameLogic.getBackground(backgroundID);
		if (background) {
			combatant.backgroundID = background.id;
		}

		if (combatant.type === CombatantType.Monster) {
			combatant.name = `${species?.name ?? ''} ${role?.name ?? ''}`;
		}
	};

	static incrementCombatantLevel = (combatant: CombatantModel) => {
		const deck = CombatantLogic.getFeatureDeck(combatant).filter(f => f.type !== FeatureType.Proficiency);
		combatant.features.push(Collections.draw(deck));
		combatant.level += 1;
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

	static addItems = (combatant: CombatantModel) => {
		CombatantLogic.getProficiencies(combatant).forEach(prof => {
			const items = GameLogic.getItemsForProficiency(prof);
			const item = JSON.parse(JSON.stringify(Collections.draw(items))) as ItemModel;
			item.id = Utils.guid();
			combatant.items.push(item);
		});
	};

	static canEquip = (combatant: CombatantModel, item: ItemModel) => {
		if (item.location !== ItemLocationType.None) {
			let slotsTotal = 1;
			switch (item.location) {
				case ItemLocationType.Hand:
				case ItemLocationType.Ring:
					slotsTotal = 2;
					break;
			}

			const slotsUsed = combatant.items
				.filter(i => i.location === item.location)
				.map(i => i.slots)
				.reduce((sum, value) => sum + value, 0);

			const slotsAvailable = slotsTotal - slotsUsed;

			if (item.slots > slotsAvailable) {
				return false;
			}
		} else {
			// We can only carry 6 items
			if (combatant.carried.length >= 6) {
				return false;
			}
		}

		const profOK = (item.proficiency === ItemProficiencyType.None) || (CombatantLogic.getProficiencies(combatant).includes(item.proficiency));
		return profOK;
	};

	static getFeatureDeck = (combatant: CombatantModel) => {
		const s = GameLogic.getSpecies(combatant.speciesID);
		const r = GameLogic.getRole(combatant.roleID);
		const b = GameLogic.getBackground(combatant.backgroundID);

		return UniversalData
			.getUniversalFeatures()
			.concat(s ? s.features : [])
			.concat(r ? r.features : [])
			.concat(b ? b.features : []);
	};

	static getActionDeck = (combatant: CombatantModel) => {
		const s = GameLogic.getSpecies(combatant.speciesID);
		const r = GameLogic.getRole(combatant.roleID);
		const b = GameLogic.getBackground(combatant.backgroundID);

		let list = UniversalData
			.getUniversalActions()
			.concat(s ? s.actions : [])
			.concat(r ? r.actions : [])
			.concat(b ? b.actions : []);

		combatant.items.forEach(i => {
			list = list.concat(i.actions);
		});

		return list;
	};

	static getCardSource = (combatant: CombatantModel, cardID: string, cardType: 'action' | 'feature') => {
		switch (cardType) {
			case 'action': {
				if (UniversalData.getUniversalActions().find(a => a.id === cardID)) {
					return 'Universal';
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

				combatant.items.forEach(item => {
					if (item.actions.find(a => a.id === cardID)) {
						return item.name;
					}
				});

				break;
			}
			case 'feature': {
				if (UniversalData.getUniversalFeatures().find(f => f.id === cardID)) {
					return 'Universal';
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

				combatant.items.forEach(item => {
					if (item.features.find(f => f.id === cardID)) {
						return item.name;
					}
				});

				break;
			}
		}

		return '';
	};

	static getCardSourceType = (combatant: CombatantModel, cardID: string, cardType: 'action' | 'feature') => {
		switch (cardType) {
			case 'action': {
				if (UniversalData.getUniversalActions().find(a => a.id === cardID)) {
					return 'universal';
				}

				const s = GameLogic.getSpecies(combatant.speciesID);
				if (!!s && s.actions.find(c => c.id === cardID)) {
					return 'species';
				}

				const r = GameLogic.getRole(combatant.roleID);
				if (!!r && r.actions.find(c => c.id === cardID)) {
					return 'role';
				}

				const b = GameLogic.getBackground(combatant.backgroundID);
				if (!!b && b.actions.find(c => c.id === cardID)) {
					return 'background';
				}

				combatant.items.forEach(item => {
					if (item.actions.find(a => a.id === cardID)) {
						return 'item';
					}
				});

				break;
			}
			case 'feature': {
				if (UniversalData.getUniversalFeatures().find(f => f.id === cardID)) {
					return 'universal';
				}

				const s = GameLogic.getSpecies(combatant.speciesID);
				if (!!s && s.features.find(c => c.id === cardID)) {
					return 'species';
				}

				const r = GameLogic.getRole(combatant.roleID);
				if (!!r && r.features.find(c => c.id === cardID)) {
					return 'role';
				}

				const b = GameLogic.getBackground(combatant.backgroundID);
				if (!!b && b.features.find(c => c.id === cardID)) {
					return 'background';
				}

				combatant.items.forEach(item => {
					if (item.features.find(f => f.id === cardID)) {
						return 'item';
					}
				});

				break;
			}
		}

		return 'default';
	};

	static getFeatures = (combatant: CombatantModel) => {
		let list = ([] as FeatureModel[]).concat(combatant.features);
		combatant.items.forEach(i => {
			list = list.concat(i.features);
		});

		return list;
	};

	static getTraitValue = (combatant: CombatantModel, conditions: ConditionModel[], trait: TraitType) => {
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

	static getSkillValue = (combatant: CombatantModel, conditions: ConditionModel[], skill: SkillType) => {
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

	static getDamageBonusValue = (combatant: CombatantModel, conditions: ConditionModel[], damage: DamageType) => {
		let value = 0;

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageBonus)
			.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
			.forEach(f => value += f.rank);
		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageCategoryBonus)
			.filter(f => (f.damageCategory === GameLogic.getDamageCategoryType(damage)) || (f.damageCategory === DamageCategoryType.All))
			.forEach(f => value += f.rank);

		conditions.filter(c => c.type === ConditionType.DamageBonus)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryBonus)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategoryType(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamagePenalty)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value -= c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryPenalty)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategoryType(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value -= c.rank);

		// No minimum value
		return value;
	};

	static getDamageResistanceValue = (combatant: CombatantModel, conditions: ConditionModel[], damage: DamageType) => {
		let value = 0;

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageResist)
			.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
			.forEach(f => value += f.rank);
		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageCategoryResist)
			.filter(f => (f.damageCategory === GameLogic.getDamageCategoryType(damage)) || (f.damageCategory === DamageCategoryType.All))
			.forEach(f => value += f.rank);

		conditions.filter(c => c.type === ConditionType.DamageResistance)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryResistance)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategoryType(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value += c.rank);
		conditions.filter(c => c.type === ConditionType.DamageVulnerability)
			.filter(c => (c.details.damage === damage) || (c.details.damage === DamageType.All))
			.forEach(c => value -= c.rank);
		conditions.filter(c => c.type === ConditionType.DamageCategoryVulnerability)
			.filter(c => (c.details.damageCategory === GameLogic.getDamageCategoryType(damage)) || (c.details.damageCategory === DamageCategoryType.All))
			.forEach(c => value -= c.rank);

		// No minimum value
		return value;
	};

	static getProficiencies = (combatant: CombatantModel) => {
		const profs: ItemProficiencyType[] = [];

		CombatantLogic.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Proficiency)
			.forEach(f => profs.push(f.proficiency));

		return profs;
	};

	static getAuras = (combatant: CombatantModel) => {
		const auras: ConditionModel[] = [];

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

		return auras;
	};
}
