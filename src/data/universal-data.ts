import type { ActionModel } from '../models/action';
import type { FeatureModel } from '../models/feature';
import type { ItemModel } from '../models/item';
import { TraitType } from '../enums/trait-type';
import { FeatureUtils } from '../logic/feature-utils';
import { Utils } from '../utils/utils';
import { DamageType } from '../enums/damage-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';

const createActionPlaceholder = (name: string): ActionModel => {
	return {
		id: Utils.guid(),
		name: name
	};
};

export const universalFeatures: FeatureModel[] = [
	FeatureUtils.createTraitFeature(TraitType.Any, 1),
	FeatureUtils.createSkillFeature(SkillType.Any, 1),
	FeatureUtils.createProficiencyFeature(ItemProficiencyType.Any)
];

export const universalActions: ActionModel[] = [
	createActionPlaceholder('Unarmed Attack')
];

export const fist: ItemModel = {
	id: 'item-punch',
	name: 'Punch',
	baseItem: '',
	magic: false,
	proficiency: ItemProficiencyType.None,
	location: ItemLocationType.None,
	slots: 1,
	weapon: {
		damage: {
			type: DamageType.Impact,
			rank: 0
		},
		range: 0,
		unreliable: 0
	},
	features: [],
	actions: []
};
