import type { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import type { ItemModel } from './item';

export interface EncounterMapSquareModel {
	x: number;
	y: number;
	type: EncounterMapSquareType;
}

export interface LootPileModel {
	id: string;
	items: ItemModel[];
	position: { x: number, y: number };
}

export interface EncounterMapModel {
	squares: EncounterMapSquareModel[];
	loot: LootPileModel[];
}
