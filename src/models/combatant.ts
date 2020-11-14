import { CombatantState } from './combatant-state';
import { Condition } from './condition';

export interface Combatant {
	state: CombatantState;
	damage: number;
	wounds: number;
	initiative: number;
	movement: number;
	stealth: number;
	conditions: Condition[];
}
