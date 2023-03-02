import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import type { CombatantModel } from '../models/combatant';
import type { EncounterModel } from '../models/encounter';
import type { RegionModel } from '../models/campaign-map';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

import { CombatantLogic } from './combatant-logic';
import { EncounterLogic } from './encounter-logic';
import { EncounterMapLogic } from './encounter-map-logic';
import { Factory } from './factory';
import { GameLogic } from './game-logic';
import { MagicItemGenerator } from './magic-item-generator';

export class EncounterGenerator {
	static createEncounter = (region: RegionModel, heroes: CombatantModel[]): EncounterModel => {
		const seed = region.encounters[0];
		const rng = Random.getSeededRNG(seed);

		const monsters: CombatantModel[] = [];
		while (monsters.reduce((value, m) => value + m.level, 0) < heroes.reduce((value, h) => value + h.level, 0)) {
			switch (Random.randomNumber(10, rng)) {
				case 0: {
					// Add a random monster
					const speciesID = Collections.draw(GameLogic.getSpeciesDeck(CombatantType.Monster), rng);
					const roleID = Collections.draw(GameLogic.getRoleDeck(), rng);
					const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(), rng);
					const monster = Factory.createCombatant(CombatantType.Monster);
					CombatantLogic.applyCombatantCards(monster, speciesID, roleID, backgroundID);
					CombatantLogic.makeFeatureChoices(monster);
					CombatantLogic.addItems(monster);
					monsters.push(monster);
					break;
				}
				case 1: {
					// Add a monster we already have, keeping the species only
					if (monsters.length > 0) {
						const original = Collections.draw(monsters, rng);
						const speciesID = original.speciesID;
						const roleID = Collections.draw(GameLogic.getRoleDeck(), rng);
						const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(), rng);
						const monster = Factory.createCombatant(CombatantType.Monster);
						CombatantLogic.applyCombatantCards(monster, speciesID, roleID, backgroundID);
						CombatantLogic.makeFeatureChoices(monster);
						CombatantLogic.addItems(monster);
						monsters.push(monster);
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
						const monster = Factory.createCombatant(CombatantType.Monster);
						CombatantLogic.applyCombatantCards(monster, speciesID, roleID, backgroundID);
						CombatantLogic.makeFeatureChoices(monster);
						CombatantLogic.addItems(monster);
						monsters.push(monster);
					}
					break;
				}
				case 4:
				case 5:
				case 6:
				case 7:
				case 8: {
					// Level up a random monster
					if (monsters.length > 0) {
						const monster = Collections.draw(monsters, rng);
						CombatantLogic.incrementCombatantLevel(monster);
						CombatantLogic.makeFeatureChoices(monster);
					}
					break;
				}
				case 9: {
					// Add a magic item
					if (monsters.length > 0) {
						const monster = Collections.draw(monsters, rng);
						if (monster.items.length > 0) {
							const item = Collections.draw(monster.items, rng);
							MagicItemGenerator.addMagicItemFeature(item);
						}
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

		if (Random.randomNumber(10, rng) !== 0) {
			const lp = Factory.createLootPile();
			lp.items.push(MagicItemGenerator.generateMagicItem());

			const square = Collections.draw(encounter.mapSquares.filter(c => c.type === EncounterMapSquareType.Clear), rng);
			lp.position.x = square.x;
			lp.position.y = square.y;

			encounter.loot.push(lp);
		}

		encounter.combatants.push(...heroes);
		encounter.combatants.push(...monsters);
		encounter.combatants.forEach(c => {
			// Reset combat data
			c.combat.current = false;
			c.combat.state = CombatantState.Standing;
			c.combat.position = { x: 0, y: 0 };
			c.combat.damage = 0;
			c.combat.wounds = 0;
			c.combat.initiative = Number.MIN_VALUE;
			c.combat.movement = 0;
			c.combat.senses = 0;
			c.combat.hidden = 0;
			c.combat.conditions = [];
			c.combat.actions = [];
		});

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
