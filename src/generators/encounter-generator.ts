import { CombatantType } from '../enums/combatant-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { FeatureType } from '../enums/feature-type';
import { QuirkType } from '../enums/quirk-type';

import type { CombatantModel } from '../models/combatant';
import type { EncounterModel } from '../models/encounter';
import type { RegionModel } from '../models/region';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

import { CombatantLogic } from '../logic/combatant-logic';
import { EncounterLogic } from '../logic/encounter-logic';
import { EncounterMapLogic } from '../logic/encounter-map-logic';
import { Factory } from '../logic/factory';
import { GameLogic } from '../logic/game-logic';
import { MagicItemGenerator } from './magic-item-generator';

export class EncounterGenerator {
	static createEncounter = (region: RegionModel, heroes: CombatantModel[]): EncounterModel => {
		const seed = region.encounters[0];
		const rng = Random.getSeededRNG(seed);

		const addMonster = (speciesID: string, roleID: string, backgroundID: string) => {
			const isDrone = Random.dice(2, rng) > 10;
			const count = isDrone ? 3 : 1;
			for (let n = 0; n < count; ++n) {
				const monster = Factory.createCombatant(CombatantType.Monster);
				if (isDrone) {
					monster.quirks.push(QuirkType.Drone);
				}
				CombatantLogic.applyCombatantCards(monster, speciesID, roleID, backgroundID);
				CombatantLogic.makeFeatureChoices(monster);
				CombatantLogic.addItems(monster);
				monsters.push(monster);
			}
		};

		const monsters: CombatantModel[] = [];
		while (Collections.sum(monsters, m => m.level) < Collections.sum(heroes, h => h.level)) {
			switch (Random.randomNumber(10, rng)) {
				case 0: {
					// Add a random monster
					const speciesID = Collections.draw(region.demographics.speciesIDs, rng);
					const roleID = Collections.draw(GameLogic.getRoleDeck(), rng);
					const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(), rng);
					addMonster(speciesID, roleID, backgroundID);
					break;
				}
				case 1: {
					// Add a monster we already have, keeping the species only
					if (monsters.length > 0) {
						const original = Collections.draw(monsters, rng);
						const speciesID = original.speciesID;
						const roleID = Collections.draw(GameLogic.getRoleDeck(), rng);
						const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(), rng);
						addMonster(speciesID, roleID, backgroundID);
					}
					break;
				}
				case 2:
				case 3: {
					// Add a monster we already have, keeping the species and role
					if (monsters.length > 0) {
						const original = Collections.draw(monsters, rng);
						const speciesID = original.speciesID;
						const roleID = original.roleID;
						const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(), rng);
						addMonster(speciesID, roleID, backgroundID);
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
						const monster = Collections.draw(monsters, rng);
						const featureDeck = CombatantLogic.getFeatureDeck(monster).filter(f => f.type !== FeatureType.Proficiency);
						CombatantLogic.incrementCombatantLevel(monster, Collections.draw(featureDeck));
						CombatantLogic.makeFeatureChoices(monster);
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
			round: 0,
			combatants: [],
			loot: [],
			mapSquares: EncounterMapLogic.generateEncounterMap(rng)
		};

		if (Random.randomNumber(10, rng) === 0) {
			const lp = Factory.createLootPile();
			lp.items.push(MagicItemGenerator.generateMagicItem());

			const square = Collections.draw(encounter.mapSquares.filter(c => c.type === EncounterMapSquareType.Clear), rng);
			lp.position.x = square.x;
			lp.position.y = square.y;

			encounter.loot.push(lp);
		}

		encounter.combatants.push(...heroes);
		encounter.combatants.push(...monsters);
		encounter.combatants.forEach(c => CombatantLogic.resetCombatant(c));

		EncounterGenerator.placeCombatants(encounter, rng);

		// If any combatants could not be not placed on the map, remove them from the encounter
		encounter.combatants = encounter.combatants.filter(c => (c.combat.position.x !== Number.MIN_VALUE) && (c.combat.position.y !== Number.MIN_VALUE));

		return encounter;
	};

	static placeCombatants = (encounter: EncounterModel, rng: () => number) => {
		encounter.combatants.forEach(combatant => {
			for (let i = 0; i <= 1000; ++i) {
				const square = Collections.draw(encounter.mapSquares, rng);

				const squares = [];
				for (let x = square.x; x <= square.x + combatant.size - 1; ++x) {
					for (let y = square.y; y <= square.y + combatant.size - 1; ++y) {
						squares.push({ x: x, y: y });
					}
				}

				const occupiedSquares: { x: number; y: number }[] = [];
				encounter.combatants.forEach(combatant => occupiedSquares.push(...EncounterLogic.getCombatantSquares(encounter, combatant)));
				encounter.loot.forEach(lp => occupiedSquares.push(lp.position));

				const canPlace = squares.every(sq => {
					const mapSquare = encounter.mapSquares.find(ms => (ms.x === sq.x) && (ms.y === sq.y));
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
					combatant.combat.position.x = square.x;
					combatant.combat.position.y = square.y;
					break;
				}
			}
		});
	};
}