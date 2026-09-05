import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

export interface ActionPrerequisiteModel {
	id: string;
	description: string;
	data: unknown;
}

export interface ActionParameterModel {
	id: 'weapon' | 'origin' | 'targets';
	candidates: unknown[];
	value: unknown | null;
}

export interface ActionWeaponParameterModel extends ActionParameterModel {
	id: 'weapon';
	type: 'melee' | 'ranged';
}

export interface ActionOriginParameterModel extends ActionParameterModel {
	id: 'origin';
	distance: number | 'weapon';
}

export interface ActionTargetParameterModel extends ActionParameterModel {
	id: 'targets';
	range: { type: ActionRangeType, radius: number };
	targets: { type: ActionTargetType, count: number } | null;
}

export interface ActionEffectModel {
	id: string;
	data: unknown;
	children: ActionEffectModel[];
}

export interface ActionModel {
	id: string;
	name: string;
	prerequisites: ActionPrerequisiteModel[];
	parameters: ActionParameterModel[];
	effects: ActionEffectModel[];
}

export interface CreateTerrainOptions {
	radius?: number;
	from?: EncounterMapSquareType;
}

export interface CreateTerrainData {
	type: EncounterMapSquareType;
	radius: number | null;
	from: EncounterMapSquareType | null;
}
