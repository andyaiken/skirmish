import { CampaignMapRegionModel } from '../models/campaign-map';
import { CombatantModel } from '../models/combatant';
import { EncounterModel } from '../models/encounter';
import { CombatantType, EncounterMapSquareType } from '../models/enums';
import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { CombatantUtils } from './combatant-utils';
import { EncounterMapUtils } from './encounter-map-utils';
import { EncounterUtils } from './encounter-utils';
import { Factory } from './factory';
import { getSpeciesDeck, getRoleDeck, getBackgroundDeck } from './game-logic';

export class EncounterGenerator {
	static createEncounter = (region: CampaignMapRegionModel, heroes: CombatantModel[]): EncounterModel => {
		const seed = region.encounters[0];
		const rng = Random.getSeededRNG(seed);

		const monsters: CombatantModel[] = [];
		while (monsters.reduce((value, m) => value + m.level, 0) < heroes.reduce((value, h) => value + h.level, 0)) {
			switch (Random.randomNumber(10, rng)) {
				case 0: {
					// Add a new monster
					const monster = Factory.createCombatant(CombatantType.Monster);
					const speciesID = Collections.draw(getSpeciesDeck());
					const roleID = Collections.draw(getRoleDeck());
					const backgroundID = Collections.draw(getBackgroundDeck());
					CombatantUtils.applyCombatantCards(monster, speciesID, roleID, backgroundID);
					CombatantUtils.makeFeatureChoices(monster);
					CombatantUtils.addItems(monster);
					monsters.push(monster);
					break;
				}
				case 1:
				case 2:
				case 3: {
					// Add a monster we already have
					if (monsters.length > 0) {
						const n = Random.randomNumber(monsters.length, rng);
						const original = monsters[n];
						const monster = Factory.createCombatant(CombatantType.Monster);
						CombatantUtils.applyCombatantCards(monster, original.speciesID, original.roleID, original.backgroundID);
						CombatantUtils.makeFeatureChoices(monster);
						CombatantUtils.addItems(monster);
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
						const n = Random.randomNumber(monsters.length);
						const monster = monsters[n];
						CombatantUtils.incrementCombatantLevel(monster);
						CombatantUtils.makeFeatureChoices(monster);
					}
					break;
				}
			}
		}

		const checkedIDs: string[] = [];
		monsters.forEach(monster => {
			if (!checkedIDs.includes(monster.id)) {
				const duplicates = monsters.filter(m => m.name === monster.name);
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
			map: EncounterMapUtils.generateEncounterMap(rng)
		};

		encounter.combatants.push(...heroes);
		encounter.combatants.push(...monsters);
		encounter.combatants.forEach(c => encounter.combatData.push(Factory.createCombatData(c)));

		EncounterGenerator.placeCombatants(encounter, rng);

		// If any monsters are not placed, remove them from the encounter
		const notPlacedIDs = encounter.combatData.filter(cd => (cd.position.x === Number.MIN_VALUE) || (cd.position.y === Number.MIN_VALUE)).map(cd => cd.id);
		encounter.combatants = encounter.combatants.filter(c => !notPlacedIDs.includes(c.id));
		encounter.combatData = encounter.combatData.filter(cd => !notPlacedIDs.includes(cd.id));

		return encounter;
	};

	static placeCombatants = (encounter: EncounterModel, rng: () => number) => {
		encounter.combatData.forEach(cd => {
			const size = EncounterUtils.getCombatantSize(encounter, cd.id);

			for (let i = 0; i <= 1000; ++i) {
				const n = Random.randomNumber(encounter.map.squares.length, rng);
				const square = encounter.map.squares[n];

				const squares = [];
				for (let x = square.x; x <= square.x + size - 1; ++x) {
					for (let y = square.y; y <= square.y + size - 1; ++y) {
						squares.push({ x: x, y: y });
					}
				}

				const occupiedSquares: { x: number; y: number }[] = [];
				encounter.combatData.forEach(data => occupiedSquares.push(...EncounterUtils.getCombatantSquares(encounter, data)));

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
	};
}
