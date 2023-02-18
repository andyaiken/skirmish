import { ConditionType, DamageType, SkillType, TraitType } from './enums';

export interface ConditionModel {
	type: ConditionType;
	rank: number;
	beneficial: boolean;
	damageType: DamageType;
	skill: SkillType;
	trait: TraitType;
}
