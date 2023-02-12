import { dice, getSeededRNG, randomNumber } from '../utils/random';
import { CampaignMapRegionModel } from './campaign-map';
import { CombatDataModel, CombatDataState, createCombatData } from './combat-data';
import { EncounterMapModel, EncounterMapSquareType, generateEncounterMap } from './encounter-map';
import { addItems, applyCombatantCards, CombatantModel, CombatantType, createCombatant, getTraitValue, incrementCombatantLevel, makeFeatureChoices } from './combatant';
import { draw } from '../utils/collections';
import { getSpeciesDeck } from './species';
import { getRoleDeck } from './role';
import { getBackgroundDeck } from './background';
import { Trait } from './trait';

export enum EncounterState {
	Active,
	Won,
	Defeated
}

export interface EncounterModel {
	regionID: string;
	combatants: CombatantModel[];
	combatData: CombatDataModel[];
	map: EncounterMapModel;
}

export const createEncounter = (region: CampaignMapRegionModel, heroes: CombatantModel[]): EncounterModel => {
	const seed = region.encounters[0];
	const rng = getSeededRNG(seed);

	const monsters: CombatantModel[] = [];
	while (monsters.reduce((value, m) => value + m.level, 0) < heroes.reduce((value, h) => value + h.level, 0)) {
		switch (randomNumber(10, rng)) {
			case 0: {
				// Add a new monster
				const monster = createCombatant(CombatantType.Monster);
				const speciesID = draw(getSpeciesDeck());
				const roleID = draw(getRoleDeck());
				const backgroundID = draw(getBackgroundDeck());
				applyCombatantCards(monster, speciesID, roleID, backgroundID);
				makeFeatureChoices(monster);
				addItems(monster);
				monsters.push(monster);
				break;
			}
			case 1:
			case 2:
			case 3: {
				// Add a monster we already have
				if (monsters.length > 0) {
					const n = randomNumber(monsters.length, rng);
					const original = monsters[n];
					const monster = createCombatant(CombatantType.Monster);
					applyCombatantCards(monster, original.speciesID, original.roleID, original.backgroundID);
					makeFeatureChoices(monster);
					addItems(monster);
					monsters.push(monster);
				}
				break;
			}
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9: {
				// Level up a random monster
				if (monsters.length > 0) {
					const n = randomNumber(monsters.length);
					const monster = monsters[n];
					incrementCombatantLevel(monster);
					makeFeatureChoices(monster);
				}
				break;
			}
		}
	}

	// TODO: Add number suffixes to duplicates

	const encounter: EncounterModel = {
		regionID: region.id,
		combatants: [],
		combatData: [],
		map: generateEncounterMap(rng)
	};

	encounter.combatants.push(...heroes);
	encounter.combatants.push(...monsters);
	encounter.combatants.forEach(c => encounter.combatData.push(createCombatData(c)));

	placeCombatants(encounter, rng);

	return encounter;
}

const placeCombatants = (encounter: EncounterModel, rng: () => number) => {
	encounter.combatData.forEach(cd => {
		const size = getCombatantSize(encounter, cd.id);

		for (let i = 0; i <= 1000; ++i) {
			// Pick a random square
			const n = randomNumber(encounter.map.squares.length, rng);
			const sq = encounter.map.squares[n];

			// Is this square empty?
			let canPlace = true;
			for (let x = sq.x; x <= sq.x + size - 1; ++x) {
				for (let y = sq.y; y <= sq.y + size - 1; ++y) {
					const squareExists = encounter.map.squares.some(s => (s.x === x) && (s.y === y) && (sq.type !== EncounterMapSquareType.Blocked));
					if (!squareExists) {
						canPlace = false;
					}
				}
			}

			if (canPlace) {
				cd.position.x = sq.x;
				cd.position.y = sq.y;
				break;
			}
		}
	});
}

export const rollInitiative = (encounter: EncounterModel) => {
	encounter.combatData.forEach(cd => {
		cd.initiative = Number.MIN_VALUE;

		const combatant = getCombatant(encounter, cd.id);
		if (combatant) {
			const speed = getTraitValue(combatant, Trait.Speed);
			cd.initiative = dice(speed);
		}
	});

	encounter.combatData.sort((a, b) => {
		const combatantA = getCombatant(encounter, a.id);
		const combatantB = getCombatant(encounter, a.id);

		// Sort by Inititive
		let result = b.initiative - a.initiative;

		if (result === 0) {
			// Sort by Speed
			const speedA = getTraitValue(combatantA as CombatantModel, Trait.Speed);
			const speedB = getTraitValue(combatantB as CombatantModel, Trait.Speed);
			result = speedB - speedA;
		}

		if (result === 0) {
			// Sort heroes before monsters
			const valueA = (a.type === CombatantType.Hero ? 1 : 0);
			const valueB = (b.type === CombatantType.Hero ? 1 : 0);
			result = valueB - valueA;
		}

		if (result === 0) {
			// Sort alphabetically
			const nameA = (combatantA as CombatantModel).name;
			const nameB = (combatantB as CombatantModel).name;
			result = (nameA < nameB) ? -1 : +1;
		}

		return result;
	});
}

export const getEncounterState = (encounter: EncounterModel): EncounterState => {
	const allMonstersDead = encounter.combatData
		.filter(cd => cd.type === CombatantType.Monster)
		.every(cd => cd.state === CombatDataState.Dead);
	if (allMonstersDead) {
		return EncounterState.Won;
	}
	const allHeroesDead = encounter.combatData
		.filter(cd => cd.type === CombatantType.Hero)
		.every(cd => cd.state === CombatDataState.Dead);
	if (allHeroesDead) {
		return EncounterState.Defeated;
	}

	return EncounterState.Active;
}

export const getCombatant = (encounter: EncounterModel, id: string): CombatantModel | null => {
	return encounter.combatants.find(c => c.id === id) ?? null;
}

const getCombatData = (encounter: EncounterModel, id: string): CombatDataModel | null => {
	return encounter.combatData.find(c => c.id === id) ?? null;
}

export const getCombatantSize = (encounter: EncounterModel, id: string): number => {
	const combatant = getCombatant(encounter, id);
	if (combatant) {
		return combatant.size;
	}

	return 1;
}

export const getAllHeroesInEncounter = (encounter: EncounterModel): CombatantModel[] => {
	return encounter.combatants.filter(c => c.type === CombatantType.Hero);
}

export const getSurvivingHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id);
		return (combatData != null) && (combatData.state !== CombatDataState.Dead);
	});
}

export const getDeadHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id);
		return (combatData != null) && (combatData.state === CombatDataState.Dead);
	});
}
