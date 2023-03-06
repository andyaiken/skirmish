import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';

export interface ActionPrerequisiteModel {
	id: string;
	description: string;
	data: unknown;
}

export interface ActionParameterModel {
	name: string;
	candidates: unknown[];
	value: unknown | null;
}

export interface ActionWeaponParameterModel extends ActionParameterModel {
	name: 'weapon';
	type: 'melee' | 'ranged';
}

export interface ActionOriginParameterModel extends ActionParameterModel {
	name: 'origin';
	distance: number | 'weapon';
}

export interface ActionTargetParameterModel extends ActionParameterModel {
	name: 'targets';
	range: { type: ActionRangeType, radius: number };
	targets: { type: ActionTargetType, count: number } | null;
}

export interface ActionEffectModel {
	id: string;
	description: string;
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
