import { CampaignMapRegionModel } from './campaign-map';
import { CombatantModel, CombatantState, createHeroCombatant, createMonsterCombatant } from './combatant';
import { EncounterMapModel, generateEncounterMap } from './encounter-map';
import { GameModel } from './game';
import { HeroModel } from './hero';
import { MonsterModel } from './monster';

export enum EncounterState {
	Active,
	Won,
	Defeated
}

export interface EncounterModel {
	regionID: string;
	heroIDs: string[];
	monsters: MonsterModel[];
	combatants: CombatantModel[];
	map: EncounterMapModel;
}

export const createEncounter = (region: CampaignMapRegionModel, heroes: HeroModel[]): EncounterModel => {
	// TODO: Create an appropriate number of monsters
	const monsters: MonsterModel[] = [];

	const combatants: CombatantModel[] = [];
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

export const getEncounterState = (encounter: EncounterModel): EncounterState => {
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

const getCombatant = (encounter: EncounterModel, id: string): CombatantModel | null => {
	return encounter.combatants.find(c => c.id === id) ?? null;
}

export const getAllHeroesInEncounter = (encounter: EncounterModel, game: GameModel): HeroModel[] => {
	return game.heroes.filter(h => encounter.heroIDs.includes(h.id));
}

export const getSurvivingHeroes = (encounter: EncounterModel, game: GameModel): HeroModel[] => {
	return getAllHeroesInEncounter(encounter, game).filter(h => {
		const combatant = getCombatant(encounter, h.id);
		return (combatant != null) && (combatant.state !== CombatantState.Dead);
	});
}

export const getDeadHeroes = (encounter: EncounterModel, game: GameModel): HeroModel[] => {
	return getAllHeroesInEncounter(encounter, game).filter(h => {
		const combatant = getCombatant(encounter, h.id);
		return (combatant != null) && (combatant.state === CombatantState.Dead);
	});
}
