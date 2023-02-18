import { ActionModel } from '../models/action';
import { TraitType, SkillType, ItemProficiencyType, ItemLocationType, DamageType } from '../models/enums';
import { FeatureModel } from '../models/feature';
import { ItemModel } from '../models/item';
import { FeatureUtils } from '../logic/feature-utils';
import { Utils } from '../utils/utils';

export const universalFeatures: FeatureModel[] = [
	FeatureUtils.createTraitFeature(TraitType.Any, 1),
	FeatureUtils.createSkillFeature(SkillType.Any, 1),
	FeatureUtils.createProficiencyFeature(ItemProficiencyType.Any)
];

export const universalActions: ActionModel[] = [
	{
		id: Utils.guid(),
		name: 'Unarmed Attack'
	}
];

export const unarmedAttack: ItemModel = {
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
