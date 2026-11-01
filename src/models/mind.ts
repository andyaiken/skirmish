import type { PersonalityAxis, PersonalityType } from '../enums/personality-type';

import type { DreamType } from '../enums/dream-type';
import type { FearType } from '../enums/fear-type';
import type { MemoryType } from '../enums/memory-type';
import type { PastimeType } from '../enums/pastime-type';

export interface MemoryModel {
	type: MemoryType;
	// What it was about: a region, an ally, an item, a structure
	subject: string;
	// A second detail, where the subject alone isn't enough (the kind of monster a boss was)
	detail: string;
	amount: number;
	// How many encounters ago it happened; it fades from conversation as this grows
	age: number;
	personalityChange?: {
		trait: PersonalityType;
		from: number;
		to: number;
		experience: string;
	};
}

export interface HistoryModel {
	encounters: number;
	victories: number;
	retreats: number;
	knockouts: number;
	monstersSlain: number;
	bossesSlain: number;
	mostSlainAtOnce: number;
	// The names of allies who didn't come home; they are never forgotten
	comradesLost: string[];
}

// Who a hero is, and what has happened to them. Personality, history, and memories grow as the
// campaign goes on.
export interface MindModel {
	personality: Record<PersonalityAxis, number>;
	dream: DreamType;
	fear: FearType;
	pastime: PastimeType;
	history: HistoryModel;
	// Newest first
	memories: MemoryModel[];
}
