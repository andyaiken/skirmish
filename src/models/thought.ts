import type { MemoryType } from '../enums/memory-type';
import type { PersonalityType } from '../enums/personality-type';
import type { StructureType } from '../enums/structure-type';
import type { ThoughtCategory } from '../enums/thought-category';

import type { MemoryModel, MindModel } from './mind';
import type { CombatantModel } from './combatant';
import type { GameModel } from './game';
import type { ItemModel } from './item';
import type { RegionModel } from './region';
import type { StructureModel } from './structure';

// Everything a hero might think about, gathered once so that each template only has to ask
export interface ThoughtContext {
	rng: () => number;
	game: GameModel;
	hero: CombatantModel;
	mind: MindModel;

	species: string;
	role: string;
	background: string;
	level: number;
	// The hero has the experience to level up and is waiting to
	readyToLevel: boolean;
	battles: number;

	traitLevel: (personality: PersonalityType) => number;
	has: (personality: PersonalityType) => boolean;
	recall: (type: MemoryType, maxAge?: number) => MemoryModel | null;
	pick: <T>(options: T[]) => T;

	comrades: CombatantModel[];
	roleOf: (hero: CombatantModel) => string;
	speciesOf: (hero: CombatantModel) => string;
	canRecruit: boolean;
	// No more heroes can be taken on until someone leaves
	partyFull: boolean;
	// Role names that nobody in the company has
	missingRoles: string[];

	structures: StructureModel[];
	// Structures that could be built but haven't been
	unbuilt: StructureModel[];
	drained: StructureModel[];
	hasStructure: (type: StructureType) => boolean;
	storesFill: number;
	money: number;

	// 0 to 1: how much of the island is ours
	conquered: number;
	regionsLeft: number;
	targets: RegionModel[];
	regions: RegionModel[];

	weapons: ItemModel[];
	armor: ItemModel[];
	magicItems: ItemModel[];
	carried: ItemModel[];
	potions: ItemModel[];
	scrolls: ItemModel[];
	// Something in the stores that this hero could pick up and use
	wanted: ItemModel | null;
}

export type ThoughtBindings = Record<string, string>;

export interface ThoughtTemplate {
	id: string;
	category: ThoughtCategory;
	weight: number | ((ctx: ThoughtContext) => number);
	// Returns what to fill the placeholders with if the hero could think this right now
	when: (ctx: ThoughtContext) => ThoughtBindings | null;
	// Different ways of saying the same thing; {key} is replaced from the bindings and
	// {Key} does the same with a capital letter
	say: string[];
}

export interface ThoughtModel {
	id: string;
	category: ThoughtCategory;
	text: string;
}
