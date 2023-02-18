import type { AuraType } from '../enums/aura-type';
import type { DamageCategoryType } from '../enums/damage-category-type';
import type { DamageType } from '../enums/damage-type';

export interface AuraModel {
	id: string;
	type: AuraType;
	damage: DamageType;
	DamageCategoryType: DamageCategoryType;
	rank: number;
}
