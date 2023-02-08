import { ConditionModel } from './condition';
import { HeroModel } from './hero';
import { MonsterModel } from './monster';

export enum CombatantType {
	Hero = 'Hero',
	Monster = 'Monster'
}

export enum CombatantState {
	Standing = 'Standing',
	Prone = 'Prone',
	Unconscious = 'Unconscious',
	Dead = 'Dead'
}

export interface CombatantModel {
	id: string;
	type: CombatantType;
	state: CombatantState;
	position: {
		x: number,
		y: number
	},
	damage: number;
	wounds: number;
	initiative: number;
	movement: number;
	senses: number;
	hidden: number;
	conditions: ConditionModel[];
}

export const createHeroCombatant = (hero: HeroModel): CombatantModel => {
	return createCombatant(hero.id, CombatantType.Hero);
}

export const createMonsterCombatant = (monster: MonsterModel): CombatantModel => {
	return createCombatant(monster.id, CombatantType.Monster);
}

const createCombatant = (id: string, type: CombatantType): CombatantModel => {
	return {
		id: id,
		type: type,
		state: CombatantState.Standing,
		position: { x: 0, y: 0 },
		damage: 0,
		wounds: 0,
		initiative: 0,
		movement: 0,
		senses: 0,
		hidden: 0,
		conditions: []
	};
}
