import { DamageType } from './damage';
import { SkillType } from './skill';
import { TraitType } from './trait';

export enum ConditionType {
	Health = 'Auto Damage',
	Damage = 'Damage Modifier',
	Movement = 'Movement',
	Skill = 'Skill',
	Trait = 'Trait'
}

export interface ConditionModel {
	type: ConditionType;
	rank: number;
	beneficial: boolean;
	damageType: DamageType;
	skill: SkillType;
	trait: TraitType;
}
