import { ActionModel } from './action';
import { DamageType, ItemProficiencyType, ItemLocationType } from './enums';
import { FeatureModel } from './feature';

export interface WeaponModel {
	damage: {
		type: DamageType;
		rank: number;
	};
	range: number;
	unreliable: number;
}

export interface ItemModel {
	id: string;
	name: string;
	baseItem: string;
	magic: boolean;
	proficiency: ItemProficiencyType;
	location: ItemLocationType;
	slots: number;
	weapon: WeaponModel | null;
	features: FeatureModel[];
	actions: ActionModel[];
}
