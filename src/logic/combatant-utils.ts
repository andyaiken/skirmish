import { UniversalData } from '../data/universal-data';
import { CombatantType } from '../enums/combatant-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { FeatureType } from '../enums/feature-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';
import type { AuraModel } from '../models/aura';
import type { CombatantModel } from '../models/combatant';
import type { FeatureModel } from '../models/feature';
import type { ItemModel } from '../models/item';
import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Factory } from './factory';
import { FeatureUtils } from './feature-utils';
import { GameLogic } from './game-logic';

export class CombatantUtils {
	static applyCombatantCards = (combatant: CombatantModel, speciesID: string, roleID: string, backgroundID: string) => {
		const species = GameLogic.getSpecies(speciesID);
		if (species) {
			combatant.speciesID = species.id;
			combatant.size = species.size;
			species.traits.forEach(t => combatant.features.push(FeatureUtils.createTraitFeature(t, 1)));
		}

		const role = GameLogic.getRole(roleID);
		if (role) {
			combatant.roleID = role.id;
			role.traits.forEach(t => combatant.features.push(FeatureUtils.createTraitFeature(t, 1)));
			role.skills.forEach(s => combatant.features.push(FeatureUtils.createSkillFeature(s, 2)));
			role.proficiencies.forEach(p => combatant.features.push(FeatureUtils.createProficiencyFeature(p)));
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
		const deck = CombatantUtils.getFeatureDeck(combatant);
		const n = Random.randomNumber(deck.length);
		const feature = JSON.parse(JSON.stringify(deck[n])) as FeatureModel;

		combatant.features.push(feature);
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
				feature.proficiency = Collections.draw(options);
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

			if (feature.DamageCategoryType === DamageCategoryType.Any) {
				const options = [
					DamageCategoryType.Physical,
					DamageCategoryType.Energy,
					DamageCategoryType.Corruption
				];
				feature.DamageCategoryType = Collections.draw(options);
			}
		});
	};

	static addItems = (combatant: CombatantModel) => {
		CombatantUtils.getProficiencies(combatant).forEach(prof => {
			const items = GameLogic.getItemsForProficiency(prof);
			const n = Random.randomNumber(items.length);
			const item = JSON.parse(JSON.stringify(items[n])) as ItemModel;
			combatant.items.push(item);
		});
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

	static getFeatures = (combatant: CombatantModel) => {
		let list = ([] as FeatureModel[]).concat(combatant.features);
		combatant.items.forEach(i => {
			list = list.concat(i.features);
		});

		return list;
	};

	static getTraitValue = (combatant: CombatantModel, trait: TraitType) => {
		let value = 1;

		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Trait)
			.filter(f => (f.trait === trait) || (f.trait === TraitType.All))
			.forEach(f => value += f.rank);

		return Math.max(value, 0);
	};

	static getSkillValue = (combatant: CombatantModel, skill: SkillType) => {
		let value = 0;

		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Skill)
			.filter(f => (f.skill === skill) || (f.skill === SkillType.All))
			.forEach(f => value += f.rank);
		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.SkillCategory)
			.filter(f => (f.skillCategory === GameLogic.getSkillCategory(skill)) || (f.skillCategory === SkillCategoryType.All))
			.forEach(f => value += f.rank);

		return Math.max(value, 0);
	};

	static getDamageBonusValue = (combatant: CombatantModel, damage: DamageType) => {
		let value = 0;

		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageBonus)
			.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
			.forEach(f => value += f.rank);
		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageCategoryTypeBonus)
			.filter(f => (f.DamageCategoryType === GameLogic.getDamageCategoryType(damage)) || (f.DamageCategoryType === DamageCategoryType.All))
			.forEach(f => value += f.rank);

		return Math.max(value, 0);
	};

	static getDamageResistanceValue = (combatant: CombatantModel, damage: DamageType) => {
		let value = 0;

		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageResist)
			.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
			.forEach(f => value += f.rank);
		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.DamageCategoryTypeResist)
			.filter(f => (f.DamageCategoryType === GameLogic.getDamageCategoryType(damage)) || (f.DamageCategoryType === DamageCategoryType.All))
			.forEach(f => value += f.rank);

		return Math.max(value, 0);
	};

	static getProficiencies = (combatant: CombatantModel) => {
		const profs: ItemProficiencyType[] = [];

		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Proficiency)
			.forEach(f => profs.push(f.proficiency));

		return profs;
	};

	static getAuras = (combatant: CombatantModel) => {
		const auras: AuraModel[] = [];

		CombatantUtils.getFeatures(combatant)
			.filter(f => f.type === FeatureType.Aura)
			.forEach(f => {
				const original = auras.find(a => (a.type === f.aura) && (a.damage === f.damage) && (a.DamageCategoryType === f.DamageCategoryType));
				if (original) {
					original.rank += 1;
				} else {
					const aura = Factory.createAura(f);
					auras.push(aura);
				}
			});

		return auras;
	};
}
