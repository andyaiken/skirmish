import { RoleList } from '../data/role-list';
import { Action } from './action';
import { Feature } from './feature';
import { Game } from './game';
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

export const getRole = (id: string) => {
	return RoleList.find(r => r.id === id);
}

export const getRoleDeck = (game: Game) => {
	const used = game.heroes.map(h => h.roleID);

	const deck = RoleList
		.filter(role => !used.includes(role.id))
		.map(role => role.id);

	if (deck.length >= 3) {
		return deck;
	}

	return RoleList.map(role => role.id);
}
