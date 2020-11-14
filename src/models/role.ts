import { RoleList } from '../data/role-list';
import { Action } from './action';
import { Feature } from './feature';
import { Proficiency } from './proficiency';
import { Skill } from './skill';
import { Trait } from './trait';

export interface Role {
	id: string;
	name: string;
	traits: Trait[];
	skills: Skill[];
	proficiencies: Proficiency[];
	features: Feature[];
	actions: Action[];
}

export class RoleHelper {
	public static getRole(id: string) {
		return RoleList.find(r => r.id === id);
	}

	public static getDeck() {
		const deck: string[] = [];

		RoleList.forEach(r => {
			deck.push(r.id);
		});

		return deck;
	}
}
