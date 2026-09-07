import { CombatantType } from '../enums/combatant-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { LogPartType } from '../enums/log-part-type';
import { TrapType } from '../enums/trap-type';

import type { ActionEffectModel } from './action';
import type { CombatantModel } from './combatant';
import type { ItemModel } from './item';

export interface LootPileModel {
	id: string;
	items: ItemModel[];
	money: number;
	position: { x: number, y: number };
}

export interface TrapModel {
	id: string;
	name: string;
	type: TrapType;
	// Whoever laid the trap knows where it is; anyone else has to spot it
	setBy: CombatantType;
	position: { x: number, y: number };
	hidden: number;
	effects: ActionEffectModel[];
	armed: boolean;
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
	// The packs the encounter was generated from. A summon during the fight draws from these, so it
	// cannot produce a monster from a pack the player does not own - and the pool stays fixed for
	// the duration of the fight even if a pack is bought part-way through a campaign.
	packIDs: string[];
	round: number;
	combatants: CombatantModel[];
	loot: LootPileModel[];
	traps: TrapModel[];
	mapSquares: EncounterMapSquareModel[];
	log: LogMessageModel[];
}

export interface EncounterMapEdgeModel {
	horizontal: { start: number, end: number, y: number }[];
	vertical: { start: number, end: number, x: number }[];
}
