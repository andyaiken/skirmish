import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';
import { CombatantModel } from './combatant';

import type { EncounterModel } from './encounter';

export interface ActionPrerequisiteModel {
	description: string;
	isSatisfied: (encounter: EncounterModel) => boolean;
}

export interface ActionParameterModel {
	name: string;
}

export interface ActionTargetParameterModel extends ActionParameterModel {
	name: 'targets';
	range: { type: ActionRangeType, radius: number, distance: number };
	targets: { type: ActionTargetType, count: number } | null;
}

export interface ActionWeaponParameterModel extends ActionParameterModel {
	name: 'weapon';
	type: 'melee' | 'ranged';
}

export interface ActionParameterValueModel {
	name: string;
	candidates: unknown[];
	value: unknown | null;
}

export interface ActionEffectModel {
	description: string;
	children: ActionEffectModel[];
	run: (encounter: EncounterModel, combatant: CombatantModel, parameters: ActionParameterValueModel[]) => void;
}

export interface ActionModel {
	id: string;
	name: string;
	prerequisites: ActionPrerequisiteModel[];
	parameters: ActionParameterModel[];
	effects: ActionEffectModel[];
}
