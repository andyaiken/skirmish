import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { CombatantModel } from './combatant';
import type { EncounterModel } from './encounter';

export interface ActionPrerequisiteModel {
	name: string;
	satisfied: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => boolean;
}

export interface ActionTargetModel {
	range: { type: ActionRangeType, radius: number, distance: number };
	targets: { type: ActionTargetType, count: number } | null;
}

export interface ActionAttackModel {
	skill: SkillType;
	skillBonus: number;
	trait: TraitType;
	traitBonus: number;
}

export interface ActionEffectModel {
	name: string;
	execute: (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => void;
}

export interface ActionModel {
	id: string;
	name: string;
	prerequisites: ActionPrerequisiteModel[];
	target: ActionTargetModel;
	prologue: ActionEffectModel[];
	attack: {
		roll: ActionAttackModel;
		hit: ActionEffectModel[];
		miss: ActionEffectModel[];
	} | null;
	epilogue: ActionEffectModel[];
}
