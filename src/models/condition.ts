import { DamageType } from './damage';
import { Skill } from './skill';
import { Trait } from './trait';

export enum ConditionType {
	Damage = 'Automatic damage',
	DamageMod = 'Damage modifier',
	Movement = 'Movement',
	Skill = 'Skill',
	Trait = 'Trait'
}

export interface ConditionModel {
	type: ConditionType;
	rank: number;
	damageType: DamageType;
	skill: Skill;
	trait: Trait;
}
