import { dice, getSeededRNG, randomNumber } from '../utils/random';
import { CampaignMapRegionModel } from './campaign-map';
import { CombatDataModel, CombatDataState, createCombatData } from './combat-data';
import { EncounterMapModel, EncounterMapSquareModel, EncounterMapSquareType, generateEncounterMap, getEncounterMapAdjacentSquares } from './encounter-map';
import { addItems, applyCombatantCards, CombatantModel, CombatantType, createCombatant, getActionDeck, getSkillValue, getTraitValue, incrementCombatantLevel, makeFeatureChoices } from './combatant';
import { draw, shuffle } from '../utils/collections';
import { getSpeciesDeck } from './species';
import { getRoleDeck } from './role';
import { getBackgroundDeck } from './background';
import { Trait } from './trait';
import { Skill } from './skill';
import { ConditionType } from './condition';

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

	const checkedIDs: string[] = [];
	monsters.forEach(monster => {
		if (!checkedIDs.includes(monster.id)) {
			const duplicates = monsters.filter(m => m.name = monster.name);
			if (duplicates.length > 1) {
				let n = 1;
				duplicates.forEach(m => {
					m.name = `${m.name} ${n}`;
					n += 1;
				});
			}
			checkedIDs.push(...duplicates.map(m => m.id));
		}
	});

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
			const n = randomNumber(encounter.map.squares.length, rng);
			const square = encounter.map.squares[n];

			const squares = [];
			for (let x = square.x; x <= square.x + size - 1; ++x) {
				for (let y = square.y; y <= square.y + size - 1; ++y) {
					squares.push({ x: x, y: y });
				}
			}

			const occupiedSquares: { x: number, y: number }[] = [];
			encounter.combatData.forEach(cd => {
				const squares = getCombatantSquares(encounter, cd);
				occupiedSquares.push(...squares);
			});

			const canPlace = squares.every(sq => {
				const mapSquare = encounter.map.squares.find(ms => (ms.x === sq.x) && (ms.y === sq.y));
				if (!mapSquare) {
					// Off the map
					return false;
				} else if (mapSquare.type !== EncounterMapSquareType.Clear) {
					// Not a clear square
					return false;
				} else if (occupiedSquares.find(os => (os.x === sq.x) && (os.y === sq.y))) {
					// Someone else is here
					return false;
				}
		
				return true;
			});

			if (canPlace) {
				cd.position.x = square.x;
				cd.position.y = square.y;
				break;
			}
		}
	});
}

const getCombatantSquares = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const squares = [];

	for (let x = combatData.position.x; x <= combatData.position.x + combatData.size - 1; ++x) {
		for (let y = combatData.position.y; y <= combatData.position.y + combatData.size - 1; ++y) {
			squares.push({ x: x, y: y });
		}
	}

	return squares;
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

export const startOfTurn = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = encounter.combatants.find(c => c.id === combatData.id) as CombatantModel;

	combatData.hidden = 0;
	combatData.senses = 0;
	combatData.movement = 0;

	if (combatData.state === CombatDataState.Unconscious) {
		const result = dice(getTraitValue(combatant, Trait.Resolve));
		if (result < 8) {
			combatData.state = CombatDataState.Dead;
		}
	}

	combatData.conditions
		.filter(condition => condition.type === ConditionType.Health)
		.forEach(condition => {
			// TODO: Apply this auto-heal / auto-damage condition
		});

	// TODO: Apply 'auto-healing' effects from auras
	// TODO: Apply 'auto-damage' effects from auras

	if ((combatData.state === CombatDataState.Standing) || (combatData.state === CombatDataState.Prone)) {
		combatData.senses = dice(getSkillValue(combatant, Skill.Perception));
		combatData.movement = dice(getTraitValue(combatant, Trait.Speed));
		// TODO: Apply movement conditions

		combatData.actions = shuffle(getActionDeck(combatant)).splice(0, 3);
	}
}

export const endOfTurn = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = encounter.combatants.find(c => c.id === combatData.id) as CombatantModel;

	combatData.initiative = Number.MIN_VALUE;
	combatData.senses = 0;
	combatData.movement = 0;

	combatData.conditions.forEach(condition => {
		if (condition.beneficial) {
			condition.rank -= 1;
		} else {
			const trait = getTraitValue(combatant, condition.trait);
			if (dice(trait) >= dice(condition.rank)) {
				condition.rank = 0;
			} else {
				condition.rank -= 1;
			}
		}
	});
	combatData.conditions = combatData.conditions.filter(c => c.rank > 0);
}

export const getMoveCost = (encounter: EncounterModel, combatData: CombatDataModel, dir: string) => {
	const combatant = getCombatant(encounter, combatData.id) as CombatantModel;

	const movingFrom = getCombatantSquares(encounter, combatData);
	const movingTo = movingFrom.map(sq => {
		const dest = { x: sq.x, y: sq.y };
		switch (dir) {
			case 'n':
				dest.y -= 1;
				break;
			case 'ne':
				dest.x += 1;
				dest.y -= 1;
				break;
			case 'e':
				dest.x += 1;
				break;
			case 'se':
				dest.x += 1;
				dest.y += 1;
				break;
			case 's':
				dest.y += 1;
				break;
			case 'sw':
				dest.x -= 1;
				dest.y += 1;
				break;
			case 'w':
				dest.x -= 1;
				break;
			case 'nw':
				dest.x -= 1;
				dest.y -= 1;
				break;
		}
		return dest;
	});

	const destinationMapSquares = movingTo
		.map(sq => encounter.map.squares.find(ms => (ms.x === sq.x) && (ms.y === sq.y)) ?? null)
		.filter(ms => ms !== null) as EncounterMapSquareModel[];

	// Can't move off the map
	if (destinationMapSquares.length !== movingTo.length) {
		return Number.MAX_VALUE;
	}

	// Can't move into a blocked square
	if (destinationMapSquares.some(ms => ms.type === EncounterMapSquareType.Blocked)) {
		return Number.MAX_VALUE;
	}

	// Can't move into an occupied square
	const occupied: { x: number, y: number }[] = [];
	encounter.combatData.forEach(cd => {
		const squares = getCombatantSquares(encounter, cd);
		occupied.push(...squares);
	});
	if (movingTo.some(sq => occupied.find(os => (os.x === sq.x) && (os.y === sq.y)))) {
		return Number.MAX_VALUE;
	}

	let cost = 1;

	// Obstructed: +1
	if (destinationMapSquares.some(ms => ms.type === EncounterMapSquareType.Obstructed)) {
		cost += 1;
	}

	// Moving out of a space adjacent to standing opponent: +4
	const adjacent: { x: number, y: number }[] = [];
	encounter.combatData
		.filter(cd => cd.type !== combatant.type)
		.filter(cd => cd.state === CombatDataState.Standing)
		.forEach(cd => {
			const squares = getEncounterMapAdjacentSquares(encounter.map, cd.position.x, cd.position.y);
			adjacent.push(...squares);
		});
	if (movingFrom.some(sq => adjacent.find(os => (os.x === sq.x) && (os.y === sq.y)))) {
		cost += 4;
	}

	// TODO: Apply ease movement effects from auras
	// TODO: Apply prevent movement effects from auras

	// Prone or hidden: x2
	if ((combatData.state === CombatDataState.Prone) || (combatData.hidden > 0)) {
		cost *= 2;
	}

	return cost;
}

export const move = (combatData: CombatDataModel, dir: string, cost: number) => {
	combatData.movement -= cost;

	switch (dir) {
		case 'n':
			combatData.position.y -= 1;
			break;
		case 'ne':
			combatData.position.x += 1;
			combatData.position.y -= 1;
			break;
		case 'e':
			combatData.position.x += 1;
			break;
		case 'se':
			combatData.position.x += 1;
			combatData.position.y += 1;
			break;
		case 's':
			combatData.position.y += 1;
			break;
		case 'sw':
			combatData.position.x -= 1;
			combatData.position.y += 1;
			break;
		case 'w':
			combatData.position.x -= 1;
			break;
		case 'nw':
			combatData.position.x -= 1;
			combatData.position.y -= 1;
			break;
	}
}

export const standUpSitDown = (combatData: CombatDataModel) => {
	switch (combatData.state) {
		case CombatDataState.Standing:
			combatData.movement -= 1;
			combatData.state = CombatDataState.Prone;
			break;
		case CombatDataState.Prone:
			combatData.movement -= 8;
			combatData.state = CombatDataState.Standing;
			break;
	}
}

export const scan = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = getCombatant(encounter, combatData.id) as CombatantModel;
	let perception = getSkillValue(combatant, Skill.Perception);
	if (combatData.state === CombatDataState.Prone) {
		perception = Math.floor(perception / 2);
	}

	combatData.movement -= 4;
	combatData.senses = dice(perception);
}

export const hide = (encounter: EncounterModel, combatData: CombatDataModel) => {
	const combatant = getCombatant(encounter, combatData.id) as CombatantModel;
	let stealth = getSkillValue(combatant, Skill.Stealth);
	if (combatData.state === CombatDataState.Prone) {
		stealth = Math.floor(stealth / 2);
	}

	combatData.movement -= 4;
	combatData.hidden = dice(stealth);
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

export const getCombatData = (encounter: EncounterModel, id: string): CombatDataModel | null => {
	return encounter.combatData.find(c => c.id === id) ?? null;
}

export const getCombatantSize = (encounter: EncounterModel, id: string): number => {
	const combatant = getCombatant(encounter, id);
	if (combatant) {
		return combatant.size;
	}

	return 1;
}

export const getActiveCombatants = (encounter: EncounterModel) => {
	return encounter.combatData
		.filter(cd => cd.state !== CombatDataState.Dead)
		.filter(cd => cd.initiative !== Number.MIN_VALUE);
}

export const getAllHeroesInEncounter = (encounter: EncounterModel): CombatantModel[] => {
	return encounter.combatants.filter(c => c.type === CombatantType.Hero);
}

export const getSurvivingHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id) as CombatDataModel;
		return (combatData.state !== CombatDataState.Dead) && (combatData.state !== CombatDataState.Unconscious);
	});
}

export const getFallenHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id) as CombatDataModel;
		return (combatData.state === CombatDataState.Dead) || (combatData.state === CombatDataState.Unconscious);
	});
}

export const getDeadHeroes = (encounter: EncounterModel): CombatantModel[] => {
	return getAllHeroesInEncounter(encounter).filter(h => {
		const combatData = getCombatData(encounter, h.id) as CombatDataModel;
		return (combatData.state === CombatDataState.Dead);
	});
}
