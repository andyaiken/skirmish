import { draw } from '../utils/collections';
import { randomNumber } from '../utils/random';
import { guid } from '../utils/utils';
import { universalActions } from './action';
import { AuraModel, createAura } from './aura';
import { getBackground } from './background';
import { DamageCategory, DamageType, getDamageCategory } from './damage';
import { createProficiencyFeature, createSkillFeature, createTraitFeature, FeatureModel, FeatureType, universalFeatures } from './feature';
import { getItems, ItemModel } from './item';
import { ItemProficiencyType } from './item-proficiency';
import { getRole } from './role';
import { getSkillCategory, SkillType, SkillCategoryType } from './skill';
import { getSpecies } from './species';
import { TraitType } from './trait';

export enum CombatantType {
	Hero = 'Hero',
	Monster = 'Monster'
}

export interface CombatantModel {
	id: string;
	type: CombatantType;
	name: string;

	speciesID: string;
	roleID: string;
	backgroundID: string;

	size: number;
	level: number;
	xp: number;

	features: FeatureModel[];
	items: ItemModel[];
}

export const createCombatant = (type: CombatantType): CombatantModel => {
	return {
		id: guid(),
		type: type,
		name: '',
		speciesID: '',
		roleID: '',
		backgroundID: '',
		size: 1,
		level: 1,
		xp: 0,
		features: [],
		items: []
	};
};

export const applyCombatantCards = (combatant: CombatantModel, speciesID: string, roleID: string, backgroundID: string) => {
	const species = getSpecies(speciesID);
	if (species) {
		combatant.speciesID = species.id;
		combatant.size = species.size;
		species.traits.forEach(t => combatant.features.push(createTraitFeature(t, 1)));
	}

	const role = getRole(roleID);
	if (role) {
		combatant.roleID = role.id;
		role.traits.forEach(t => combatant.features.push(createTraitFeature(t, 1)));
		role.skills.forEach(s => combatant.features.push(createSkillFeature(s, 2)));
		role.proficiencies.forEach(p => combatant.features.push(createProficiencyFeature(p)));
	}

	const background = getBackground(backgroundID);
	if (background) {
		combatant.backgroundID = background.id;
	}

	if (combatant.type === CombatantType.Monster) {
		combatant.name = `${species?.name ?? ''} ${role?.name ?? ''}`;
	}
};

export const incrementCombatantLevel = (combatant: CombatantModel) => {
	const deck = getFeatureDeck(combatant);
	const n = randomNumber(deck.length);
	const feature = JSON.parse(JSON.stringify(deck[n])) as FeatureModel;

	combatant.features.push(feature);
	combatant.level += 1;
};

export const makeFeatureChoices = (combatant: CombatantModel) => {
	combatant.features.forEach(feature => {
		if (feature.trait === TraitType.Any) {
			const options = [
				TraitType.Endurance,
				TraitType.Resolve,
				TraitType.Speed
			];
			feature.trait = draw(options);
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
			feature.skill = draw(options);
		}

		if (feature.skillCategory === SkillCategoryType.Any) {
			const options = [
				SkillCategoryType.Physical,
				SkillCategoryType.Mental
			];
			feature.skillCategory = draw(options);
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
			feature.proficiency = draw(options);
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
			feature.damage = draw(options);
		}

		if (feature.damageCategory === DamageCategory.Any) {
			const options = [
				DamageCategory.Physical,
				DamageCategory.Energy,
				DamageCategory.Corruption
			];
			feature.damageCategory = draw(options);
		}
	});
};

export const addItems = (combatant: CombatantModel) => {
	getProficiencies(combatant).forEach(prof => {
		const items = getItems(prof);
		const n = randomNumber(items.length);
		const item = JSON.parse(JSON.stringify(items[n])) as ItemModel;
		combatant.items.push(item);
	});
};

export const getFeatureDeck = (combatant: CombatantModel) => {
	const s = getSpecies(combatant.speciesID);
	const r = getRole(combatant.roleID);
	const b = getBackground(combatant.backgroundID);

	return universalFeatures
		.concat(s ? s.features : [])
		.concat(r ? r.features : [])
		.concat(b ? b.features : []);
};

export const getActionDeck = (combatant: CombatantModel) => {
	const s = getSpecies(combatant.speciesID);
	const r = getRole(combatant.roleID);
	const b = getBackground(combatant.backgroundID);

	let list = universalActions
		.concat(s ? s.actions : [])
		.concat(r ? r.actions : [])
		.concat(b ? b.actions : []);

	combatant.items.forEach(i => {
		list = list.concat(i.actions);
	});

	return list;
};

export const getCardSource = (combatant: CombatantModel, cardID: string, cardType: 'action' | 'feature') => {
	switch (cardType) {
		case 'action': {
			if (universalActions.find(a => a.id === cardID)) {
				return 'Universal';
			}

			const s = getSpecies(combatant.speciesID);
			if (!!s && s.actions.find(c => c.id === cardID)) {
				return s.name;
			}

			const r = getRole(combatant.roleID);
			if (!!r && r.actions.find(c => c.id === cardID)) {
				return r.name;
			}

			const b = getBackground(combatant.backgroundID);
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
			if (universalFeatures.find(f => f.id === cardID)) {
				return 'Universal';
			}

			const s = getSpecies(combatant.speciesID);
			if (!!s && s.features.find(c => c.id === cardID)) {
				return s.name;
			}

			const r = getRole(combatant.roleID);
			if (!!r && r.features.find(c => c.id === cardID)) {
				return r.name;
			}

			const b = getBackground(combatant.backgroundID);
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

	return null;
};

export const getFeatures = (combatant: CombatantModel) => {
	let list = ([] as FeatureModel[]).concat(combatant.features);
	combatant.items.forEach(i => {
		list = list.concat(i.features);
	});

	return list;
};

export const getTraitValue = (combatant: CombatantModel, trait: TraitType) => {
	let value = 1;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Trait)
		.filter(f => (f.trait === trait) || (f.trait === TraitType.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getSkillValue = (combatant: CombatantModel, skill: SkillType) => {
	let value = 0;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Skill)
		.filter(f => (f.skill === skill) || (f.skill === SkillType.All))
		.forEach(f => value += f.rank);
	getFeatures(combatant)
		.filter(f => f.type === FeatureType.SkillCategory)
		.filter(f => (f.skillCategory === getSkillCategory(skill)) || (f.skillCategory === SkillCategoryType.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getDamageBonusValue = (combatant: CombatantModel, damage: DamageType) => {
	let value = 0;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageBonus)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageCategoryBonus)
		.filter(f => (f.damageCategory === getDamageCategory(damage)) || (f.damageCategory === DamageCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getDamageResistanceValue = (combatant: CombatantModel, damage: DamageType) => {
	let value = 0;

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageResist)
		.filter(f => (f.damage === damage) || (f.damage === DamageType.All))
		.forEach(f => value += f.rank);
	getFeatures(combatant)
		.filter(f => f.type === FeatureType.DamageCategoryResist)
		.filter(f => (f.damageCategory === getDamageCategory(damage)) || (f.damageCategory === DamageCategory.All))
		.forEach(f => value += f.rank);

	return Math.max(value, 0);
};

export const getProficiencies = (combatant: CombatantModel) => {
	const profs: ItemProficiencyType[] = [];

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Proficiency)
		.forEach(f => profs.push(f.proficiency));

	return profs;
};

export const getAuras = (combatant: CombatantModel) => {
	const auras: AuraModel[] = [];

	getFeatures(combatant)
		.filter(f => f.type === FeatureType.Aura)
		.forEach(f => {
			const original = auras.find(a => (a.type === f.aura) && (a.damage === f.damage) && (a.damageCategory === f.damageCategory));
			if (original) {
				original.rank += 1;
			} else {
				const aura = createAura(f);
				auras.push(aura);
			}
		});

	return auras;
};
