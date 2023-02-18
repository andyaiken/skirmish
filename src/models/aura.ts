import { AuraType, DamageType, DamageCategoryType } from './enums';

export interface AuraModel {
	id: string;
	type: AuraType;
	damage: DamageType;
	DamageCategoryType: DamageCategoryType;
	rank: number;
}
