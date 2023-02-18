import type { ConditionType } from '../enums/condition-type';
import type { DamageType } from '../enums/damage-type';
import type { SkillType } from '../enums/skill-type';
import type { TraitType } from '../enums/trait-type';

export interface ConditionModel {
	type: ConditionType;
	rank: number;
	beneficial: boolean;
	damageType: DamageType;
	skill: SkillType;
	trait: TraitType;
}
