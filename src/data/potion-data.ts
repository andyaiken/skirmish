import { DamageCategoryType } from '../enums/damage-category-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';

import type { ItemModel } from '../models/item';
import { PackData } from './pack-data';

export class PotionData {
	static aptitude: ItemModel = {
		id: 'potion-aptitude',
		name: 'Tonic of Aptitude',
		packID: PackData.potions.id,
		description: 'A glass vial filled with a viscous orange liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 8, SkillCategoryType.Physical))
			]
		},
		features: [],
		actions: []
	};

	static brilliance: ItemModel = {
		id: 'potion-brilliance',
		name: 'Tincture of Brilliance',
		packID: PackData.potions.id,
		description: 'A glass vial filled with a still purple liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 8, SkillCategoryType.Mental))
			]
		},
		features: [],
		actions: []
	};
	static health: ItemModel = {
		id: 'potion-health',
		name: 'Potion of Health',
		packID: PackData.potions.id,
		description: 'A glass vial filled with a sparkling red liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.healWounds(1)
			]
		},
		features: [],
		actions: []
	};

	static luck: ItemModel = {
		id: 'potion-luck',
		name: 'Philtre of Luck',
		packID: PackData.potions.id,
		description: 'A glass vial filled with a scintillating green liquid.',
		baseItem: PackData.potions.id,
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 3, SkillCategoryType.Mental)),
				ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 3, SkillCategoryType.Physical)),
				ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 2, TraitType.Endurance)),
				ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 2, TraitType.Resolve)),
				ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 2, TraitType.Speed))
			]
		},
		features: [],
		actions: []
	};

	static might: ItemModel = {
		id: 'potion-might',
		name: 'Elixir of Might',
		packID: PackData.potions.id,
		description: 'A glass vial filled with an effervescent blue liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Physical)),
				ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Energy)),
				ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 5, DamageCategoryType.Corruption))
			]
		},
		features: [],
		actions: []
	};

	static resistance: ItemModel = {
		id: 'potion-resistance',
		name: 'Potion of Resistance',
		packID: PackData.potions.id,
		description: 'A glass vial filled with an iridescent yellow liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Physical)),
				ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Energy)),
				ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Corruption))
			]
		},
		features: [],
		actions: []
	};

	static strength: ItemModel = {
		id: 'potion-strength',
		name: 'Brew of Strength',
		packID: PackData.potions.id,
		description: 'A glass vial filled with a vaprous brown liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 5, TraitType.Endurance))
			]
		},
		features: [],
		actions: []
	};

	static will: ItemModel = {
		id: 'potion-will',
		name: 'Brew of Will',
		packID: PackData.potions.id,
		description: 'A glass vial filled with a bubbling black liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 5, TraitType.Resolve))
			]
		},
		features: [],
		actions: []
	};

	static quickness: ItemModel = {
		id: 'potion-quickness',
		name: 'Brew of Quickness',
		packID: PackData.potions.id,
		description: 'A glass vial filled with a churning pink liquid.',
		baseItem: '',
		magic: false,
		proficiency: ItemProficiencyType.None,
		location: ItemLocationType.None,
		slots: 1,
		weapon: null,
		armor: null,
		potion: {
			effects: [
				ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 5, TraitType.Speed))
			]
		},
		features: [],
		actions: []
	};

	static getList = (): ItemModel[] => {
		const list: ItemModel[] = [
			PotionData.aptitude,
			PotionData.brilliance,
			PotionData.health,
			PotionData.luck,
			PotionData.might,
			PotionData.resistance,
			PotionData.strength,
			PotionData.will,
			PotionData.quickness
		];

		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	};
}
