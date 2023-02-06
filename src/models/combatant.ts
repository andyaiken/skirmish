import { CombatantState } from './combatant-state';
import { Condition } from './condition';
import { Hero } from './hero';
import { Monster } from './monster';

export enum CombatantType {
	Hero = 'Hero',
	Monster = 'Monster'
}

export interface Combatant {
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
	stealth: number;
	conditions: Condition[];
}

export const createHeroCombatant = (hero: Hero): Combatant => {
	return createCombatant(hero.id, CombatantType.Hero);
}

export const createMonsterCombatant = (monster: Monster): Combatant => {
	return createCombatant(monster.id, CombatantType.Monster);
}

const createCombatant = (id: string, type: CombatantType): Combatant => {
	return {
		id: id,
		type: type,
		state: CombatantState.Standing,
		position: { x: 0, y: 0 },
		damage: 0,
		wounds: 0,
		initiative: 0,
		movement: 0,
		stealth: 0,
		conditions: []
	};
}
