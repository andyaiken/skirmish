import type { CombatDataModel } from '../models/combat-data';
import type { CombatantModel } from '../models/combatant';
import type { EncounterModel } from '../models/encounter';
import type { EncounterMapSquareModel } from '../models/encounter-map';
import { TraitType, CombatantType, CombatDataState, ConditionType, SkillType, EncounterMapSquareType, EncounterState } from '../enums/enums';
import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { CombatantUtils } from './combatant-utils';
import { EncounterMapUtils } from './encounter-map-utils';

export class EncounterUtils {
	static getCombatantSquares = (encounter: EncounterModel, combatData: CombatDataModel) => {
		const squares = [];

		for (let x = combatData.position.x; x <= combatData.position.x + combatData.size - 1; ++x) {
			for (let y = combatData.position.y; y <= combatData.position.y + combatData.size - 1; ++y) {
				squares.push({ x: x, y: y });
			}
		}

		return squares;
	};

	static rollInitiative = (encounter: EncounterModel) => {
		encounter.combatData.forEach(cd => {
			cd.initiative = Number.MIN_VALUE;

			const combatant = EncounterUtils.getCombatant(encounter, cd.id);
			if (combatant) {
				const speed = CombatantUtils.getTraitValue(combatant, TraitType.Speed);
				cd.initiative = Random.dice(speed);
			}
		});

		encounter.combatData.sort((a, b) => {
			const combatantA = EncounterUtils.getCombatant(encounter, a.id);
			const combatantB = EncounterUtils.getCombatant(encounter, a.id);

			// Sort by Inititive
			let result: number = b.initiative - a.initiative;

			if (result === 0) {
				// Sort by Speed
				const speedA = CombatantUtils.getTraitValue(combatantA as CombatantModel, TraitType.Speed);
				const speedB = CombatantUtils.getTraitValue(combatantB as CombatantModel, TraitType.Speed);
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
	};

	static startOfTurn = (encounter: EncounterModel, combatData: CombatDataModel) => {
		const combatant = encounter.combatants.find(c => c.id === combatData.id) as CombatantModel;

		combatData.hidden = 0;
		combatData.senses = 0;
		combatData.movement = 0;

		if (combatData.state === CombatDataState.Unconscious) {
			const result = Random.dice(CombatantUtils.getTraitValue(combatant, TraitType.Resolve));
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
			combatData.senses = Random.dice(CombatantUtils.getSkillValue(combatant, SkillType.Perception));
			combatData.movement = Random.dice(CombatantUtils.getTraitValue(combatant, TraitType.Speed));
			// TODO: Apply movement conditions

			combatData.actions = Collections.shuffle(CombatantUtils.getActionDeck(combatant)).splice(0, 3);
		}
	};

	static endOfTurn = (encounter: EncounterModel, combatData: CombatDataModel) => {
		const combatant = encounter.combatants.find(c => c.id === combatData.id) as CombatantModel;

		combatData.initiative = Number.MIN_VALUE;
		combatData.senses = 0;
		combatData.movement = 0;

		combatData.conditions.forEach(condition => {
			if (condition.beneficial) {
				condition.rank -= 1;
			} else {
				const trait = CombatantUtils.getTraitValue(combatant, condition.trait);
				if (Random.dice(trait) >= Random.dice(condition.rank)) {
					condition.rank = 0;
				} else {
					condition.rank -= 1;
				}
			}
		});
		combatData.conditions = combatData.conditions.filter(c => c.rank > 0);
	};

	static getMoveCost = (encounter: EncounterModel, combatData: CombatDataModel, dir: string) => {
		const combatant = EncounterUtils.getCombatant(encounter, combatData.id) as CombatantModel;

		const movingFrom = EncounterUtils.getCombatantSquares(encounter, combatData);
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

		// Can't move into an occupied square
		const occupied: { x: number; y: number }[] = [];
		encounter.combatData.forEach(cd => {
			const squares = EncounterUtils.getCombatantSquares(encounter, cd);
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
		const adjacent: { x: number; y: number }[] = [];
		encounter.combatData
			.filter(cd => cd.type !== combatant.type)
			.filter(cd => cd.state === CombatDataState.Standing)
			.forEach(cd => {
				const current = EncounterUtils.getCombatantSquares(encounter, cd);
				const squares = EncounterMapUtils.getEncounterMapAdjacentSquares(encounter.map, current);
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
	};

	static move = (combatData: CombatDataModel, dir: string, cost: number) => {
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
	};

	static standUpSitDown = (combatData: CombatDataModel) => {
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
	};

	static scan = (encounter: EncounterModel, combatData: CombatDataModel) => {
		const combatant = EncounterUtils.getCombatant(encounter, combatData.id) as CombatantModel;
		let perception = CombatantUtils.getSkillValue(combatant, SkillType.Perception);
		if (combatData.state === CombatDataState.Prone) {
			perception = Math.floor(perception / 2);
		}

		combatData.movement -= 4;
		combatData.senses = Random.dice(perception);
	};

	static hide = (encounter: EncounterModel, combatData: CombatDataModel) => {
		const combatant = EncounterUtils.getCombatant(encounter, combatData.id) as CombatantModel;
		let stealth = CombatantUtils.getSkillValue(combatant, SkillType.Stealth);
		if (combatData.state === CombatDataState.Prone) {
			stealth = Math.floor(stealth / 2);
		}

		combatData.movement -= 4;
		combatData.hidden = Random.dice(stealth);
	};

	static getEncounterState = (encounter: EncounterModel): EncounterState => {
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
	};

	static getCombatant = (encounter: EncounterModel, id: string): CombatantModel | null => {
		return encounter.combatants.find(c => c.id === id) ?? null;
	};

	static getCombatData = (encounter: EncounterModel, id: string): CombatDataModel | null => {
		return encounter.combatData.find(c => c.id === id) ?? null;
	};

	static getCombatantSize = (encounter: EncounterModel, id: string): number => {
		const combatant = EncounterUtils.getCombatant(encounter, id);
		if (combatant) {
			return combatant.size;
		}

		return 1;
	};

	static getActiveCombatants = (encounter: EncounterModel) => {
		return encounter.combatData
			.filter(cd => cd.state !== CombatDataState.Dead)
			.filter(cd => cd.initiative !== Number.MIN_VALUE);
	};

	static getAllHeroesInEncounter = (encounter: EncounterModel): CombatantModel[] => {
		return encounter.combatants.filter(c => c.type === CombatantType.Hero);
	};

	static getSurvivingHeroes = (encounter: EncounterModel): CombatantModel[] => {
		return EncounterUtils.getAllHeroesInEncounter(encounter).filter(h => {
			const combatData = EncounterUtils.getCombatData(encounter, h.id) as CombatDataModel;
			return (combatData.state !== CombatDataState.Dead) && (combatData.state !== CombatDataState.Unconscious);
		});
	};

	static getFallenHeroes = (encounter: EncounterModel): CombatantModel[] => {
		return EncounterUtils.getAllHeroesInEncounter(encounter).filter(h => {
			const combatData = EncounterUtils.getCombatData(encounter, h.id) as CombatDataModel;
			return (combatData.state === CombatDataState.Dead) || (combatData.state === CombatDataState.Unconscious);
		});
	};

	static getDeadHeroes = (encounter: EncounterModel): CombatantModel[] => {
		return EncounterUtils.getAllHeroesInEncounter(encounter).filter(h => {
			const combatData = EncounterUtils.getCombatData(encounter, h.id) as CombatDataModel;
			return (combatData.state === CombatDataState.Dead);
		});
	};
}
