import { CampaignMapRegion } from './campaign-map';
import { Combatant, createHeroCombatant, createMonsterCombatant } from './combatant';
import { CombatantState } from './combatant-state';
import { EncounterMap, generateEncounterMap } from './encounter-map';
import { Game } from './game';
import { Hero } from './hero';
import { Monster } from './monster';

export enum EncounterState {
	Active,
	Won,
	Defeated
}

export interface Encounter {
	regionID: string;
	heroIDs: string[];
	monsters: Monster[];
	combatants: Combatant[];
	map: EncounterMap;
}

export const createEncounter = (region: CampaignMapRegion, heroes: Hero[]): Encounter => {
	// TODO: Create an appropriate number of monsters
	const monsters: Monster[] = [];

	const combatants: Combatant[] = [];
	heroes.forEach(h => combatants.push(createHeroCombatant(h)));
	monsters.forEach(m => combatants.push(createMonsterCombatant(m)));

	// TODO: Place combatants on the map

	return {
		regionID: region.id,
		heroIDs: heroes.map(h => h.id),
		monsters: monsters,
		combatants: combatants,
		map: generateEncounterMap()
	};
}

export const getEncounterState = (encounter: Encounter): EncounterState => {
	const allMonstersDead = encounter.monsters.every(m => {
		const combatant = getCombatant(encounter, m.id);
		return (combatant != null) && (combatant.state === CombatantState.Dead);
	});
	if (allMonstersDead) {
		return EncounterState.Won;
	}
	const allHeroesDead = encounter.heroIDs.every(id => {
		const combatant = getCombatant(encounter, id);
		return (combatant != null) && (combatant.state === CombatantState.Dead);
	});
	if (allHeroesDead) {
		return EncounterState.Defeated;
	}
	return EncounterState.Active;
}

const getCombatant = (encounter: Encounter, id: string): Combatant | null => {
	return encounter.combatants.find(c => c.id === id) ?? null;
}

export const getAllHeroesInEncounter = (encounter: Encounter, game: Game): Hero[] => {
	return game.heroes.filter(h => encounter.heroIDs.includes(h.id));
}

export const getSurvivingHeroes = (encounter: Encounter, game: Game): Hero[] => {
	return getAllHeroesInEncounter(encounter, game).filter(h => {
		const combatant = getCombatant(encounter, h.id);
		return (combatant != null) && (combatant.state !== CombatantState.Dead);
	});
}

export const getDeadHeroes = (encounter: Encounter, game: Game): Hero[] => {
	return getAllHeroesInEncounter(encounter, game).filter(h => {
		const combatant = getCombatant(encounter, h.id);
		return (combatant != null) && (combatant.state === CombatantState.Dead);
	});
}
