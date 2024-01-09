import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { LogPartType } from '../enums/log-part-type';

import type { CombatantModel } from './combatant';
import type { ItemModel } from './item';

export interface LootPileModel {
	id: string;
	items: ItemModel[];
	money: number;
	position: { x: number, y: number };
}

export interface EncounterMapSquareModel {
	x: number;
	y: number;
	type: EncounterMapSquareType;
}

export interface LogPartModel {
	type: LogPartType;
	data: string;
}

export interface LogMessageModel {
	id: string;
	timestamp: number;
	parts: LogPartModel[];
}

export interface EncounterModel {
	regionID: string;
	round: number;
	combatants: CombatantModel[];
	loot: LootPileModel[];
	mapSquares: EncounterMapSquareModel[];
	log: LogMessageModel[];
}

export interface EncounterMapEdgeModel {
	horizontal: { start: number, end: number, y: number }[];
	vertical: { start: number, end: number, x: number }[];
}
