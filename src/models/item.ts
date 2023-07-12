import type { DamageType } from '../enums/damage-type';
import type { ItemLocationType } from '../enums/item-location-type';
import type { ItemProficiencyType } from '../enums/item-proficiency-type';

import type { ActionEffectModel, ActionModel } from './action';
import type { FeatureModel } from './feature';

export interface WeaponModel {
	damage: {
		type: DamageType;
		rank: number;
	}[];
	range: number;
	unreliable: number;
}

export interface ArmorModel {
	features: FeatureModel[];
}

export interface PotionModel {
	effects: ActionEffectModel[];
}

export interface ItemModel {
	id: string;
	name: string;
	packID: string;
	description: string;
	baseItem: string;
	magic: boolean;
	proficiency: ItemProficiencyType;
	location: ItemLocationType;
	slots: number;
	weapon: WeaponModel | null;
	armor: ArmorModel | null;
	potion: PotionModel | null;
	features: FeatureModel[];
	actions: ActionModel[];
}
