import { DamageCategoryType } from '../enums/damage-category-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';

import type { ItemModel } from '../models/item';

export class PotionData {
	static getList = (): ItemModel[] => {
		const list: ItemModel[] = [
			{
				id: 'potion-health',
				name: 'Potion of Health',
				packID: '',
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
			},
			{
				id: 'potion-luck',
				name: 'Potion of Luck',
				packID: '',
				description: 'A glass vial filled with a scintillating green liquid.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.None,
				slots: 1,
				weapon: null,
				armor: null,
				potion: {
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 5, SkillCategoryType.Mental)),
						ActionEffects.addCondition(ConditionLogic.createSkillCategoryBonusCondition(TraitType.Resolve, 5, SkillCategoryType.Physical))
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'potion-might',
				name: 'Potion of Might',
				packID: '',
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
			},
			{
				id: 'potion-resistance',
				name: 'Potion of Resistance',
				packID: '',
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
			}
		];

		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	};
}
