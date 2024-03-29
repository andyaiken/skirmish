import { CombatantType } from '../enums/combatant-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { FeatureType } from '../enums/feature-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { QuirkType } from '../enums/quirk-type';
import { TraitType } from '../enums/trait-type';

import { EncounterMapGenerator } from './encounter-map-generator';
import { MagicItemGenerator } from './magic-item-generator';
import { NameGenerator } from './name-generator';

import { CampaignMapLogic } from '../logic/campaign-map-logic';
import { CombatantLogic } from '../logic/combatant-logic';
import { EncounterLogic } from '../logic/encounter-logic';
import { Factory } from '../logic/factory';
import { FeatureLogic } from '../logic/feature-logic';
import { GameLogic } from '../logic/game-logic';

import type { EncounterModel, LootPileModel } from '../models/encounter';
import type { CombatantModel } from '../models/combatant';
import type { ItemModel } from '../models/item';
import type { RegionModel } from '../models/region';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

export class EncounterGenerator {
	static createEncounter = (region: RegionModel, heroes: CombatantModel[], packIDs: string[]): EncounterModel => {
		const seed = region.encounters[0];
		const rng = Random.getSeededRNG(seed);

		const encounter: EncounterModel = {
			regionID: region.id,
			round: 0,
			combatants: [ ...heroes ],
			loot: [],
			mapSquares: EncounterMapGenerator.generateEncounterMap(rng),
			log: []
		};

		let hasBoss = false;

		const monsters: CombatantModel[] = [];
		const addMonster = (speciesID: string, roleID: string, backgroundID: string) => {
			const isDrone = Random.dice(2, rng) > 10;
			const isBoss = !isDrone && !hasBoss && (Random.dice(2, rng) > 10);
			const count = isDrone ? 4 : 1;
			for (let n = 0; n < count; ++n) {
				const monster = Factory.createCombatant(CombatantType.Monster);
				if (isDrone) {
					monster.quirks.push(QuirkType.Drone);
				}
				CombatantLogic.applyCombatantCards(monster, speciesID, roleID, backgroundID);
				CombatantLogic.makeFeatureChoices(monster);
				CombatantLogic.addItems(monster, packIDs);
				if (isBoss) {
					monster.quirks.push(QuirkType.Boss);
					hasBoss = true;
				}
				monsters.push(monster);
			}
		};

		while (Collections.sum(monsters, m => m.level) < Collections.sum(heroes, h => h.level)) {
			switch (Random.randomNumber(10, rng)) {
				case 0: {
					// Add a random monster
					if (monsters.length < (heroes.length * 2)) {
						const speciesIDs = CampaignMapLogic.getMonsters(region, packIDs).map(s => s.id);
						const speciesID = Collections.draw(speciesIDs, rng);
						const roleID = Collections.draw(GameLogic.getRoleDeck(packIDs).map(r => r.id), rng);
						const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(packIDs).map(b => b.id), rng);
						addMonster(speciesID, roleID, backgroundID);
					}
					break;
				}
				case 1: {
					// Add a monster we already have, keeping the species only
					if ((monsters.length > 0) && (monsters.length < (heroes.length * 2))) {
						const original = Collections.draw(monsters, rng);
						const speciesID = original.speciesID;
						const roleID = Collections.draw(GameLogic.getRoleDeck(packIDs).map(r => r.id), rng);
						const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(packIDs).map(b => b.id), rng);
						addMonster(speciesID, roleID, backgroundID);
					}
					break;
				}
				case 2:
				case 3: {
					// Add a monster we already have, keeping the species and role
					if ((monsters.length > 0) && (monsters.length < (heroes.length * 2))) {
						const original = Collections.draw(monsters, rng);
						const speciesID = original.speciesID;
						const roleID = original.roleID;
						const backgroundID = Collections.draw(GameLogic.getBackgroundDeck(packIDs).map(b => b.id), rng);
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
						CombatantLogic.incrementCombatantLevel(monster, Collections.draw(featureDeck, rng), packIDs);
						CombatantLogic.makeFeatureChoices(monster);
					}
					break;
				}
			}
		}

		monsters
			.filter(monster => monster.quirks.includes(QuirkType.Boss))
			.forEach(monster => {
				// Give this monster a name
				monster.name = NameGenerator.generateName(rng);

				// Boost traits
				monster.features.push(FeatureLogic.createTraitFeature('boss-1', TraitType.Endurance, 2));
				monster.features.push(FeatureLogic.createTraitFeature('boss-2', TraitType.Resolve, 2));
				monster.features.push(FeatureLogic.createTraitFeature('boss-3', TraitType.Speed, 2));

				// Add 5 levels
				for (let n = 0; n <= 5; ++n) {
					const featureDeck = CombatantLogic.getFeatureDeck(monster).filter(f => f.type !== FeatureType.Proficiency);
					CombatantLogic.incrementCombatantLevel(monster, Collections.draw(featureDeck, rng), packIDs);
					CombatantLogic.makeFeatureChoices(monster);
				}

				// Give it a magic item
				let item: ItemModel | null = null;
				if (monster.items.length > 0) {
					item = Collections.draw(monster.items, rng);
					monster.items = monster.items.filter(i => i.id !== (item as ItemModel).id);
				} else {
					const items = GameLogic.getItemDeck(packIDs).filter(i => i.proficiency === ItemProficiencyType.None);
					item = Collections.draw(items, rng);
				}
				if (item) {
					const magicItem = MagicItemGenerator.generateMagicItem(item, packIDs, rng);
					monster.items.push(magicItem);
				}
			});

		monsters.forEach(monster => {
			const duplicates = monsters.filter(m => m.name === monster.name);
			if (duplicates.length > 1) {
				duplicates.forEach((m, n) => {
					m.name = `${m.name} ${n + 1}`;
				});
			}
		});

		monsters.forEach(m => CombatantLogic.resetCombatant(m));
		encounter.combatants.push(...monsters);

		EncounterGenerator.placeCombatants(encounter, rng);

		const loot: LootPileModel[] = [];
		if (Random.randomNumber(5, rng) === 0) {
			const lp = Factory.createLootPile();
			if (Random.randomNumber(3, rng) === 0) {
				lp.items.push(MagicItemGenerator.generateRandomMagicItem(packIDs, rng));
			} else {
				const potions = GameLogic.getPotionDeck(packIDs);
				const item = Collections.draw(potions, rng);
				item.id = Utils.guid();
				lp.items.push(item);
			}

			const square = Collections.draw(encounter.mapSquares.filter(c => c.type === EncounterMapSquareType.Clear), rng);
			lp.position.x = square.x;
			lp.position.y = square.y;

			loot.push(lp);
		}
		encounter.loot.push(...loot);

		return encounter;
	};

	static placeCombatants = (encounter: EncounterModel, rng: () => number) => {
		encounter.combatants.forEach(combatant => {
			if ((combatant.combat.position.x !== Number.MIN_VALUE) && (combatant.combat.position.y !== Number.MIN_VALUE)) {
				// Already on the map
			} else {
				for (let i = 0; i < 1000; ++i) {
					const square = Collections.draw(encounter.mapSquares, rng);

					const squares = [];
					for (let x = square.x; x <= square.x + combatant.size - 1; ++x) {
						for (let y = square.y; y <= square.y + combatant.size - 1; ++y) {
							squares.push({ x: x, y: y });
						}
					}

					const canPlace = squares.every(sq => EncounterGenerator.canPlaceHere(encounter, sq));
					if (canPlace) {
						combatant.combat.position.x = square.x;
						combatant.combat.position.y = square.y;
						break;
					}
				}
			}
		});

		// If any combatants could not be not placed on the map, remove them from the encounter
		encounter.combatants = encounter.combatants.filter(c => (c.combat.position.x !== Number.MIN_VALUE) && (c.combat.position.y !== Number.MIN_VALUE));
	};

	static placeLoot = (encounter: EncounterModel, rng: () => number) => {
		encounter.loot.forEach(lp => {
			if ((lp.position.x !== Number.MIN_VALUE) && (lp.position.y !== Number.MIN_VALUE)) {
				// Already on the map
			} else {
				for (let i = 0; i < 1000; ++i) {
					const square = Collections.draw(encounter.mapSquares, rng);
					if (EncounterGenerator.canPlaceHere(encounter, square)) {
						lp.position.x = square.x;
						lp.position.y = square.y;
						break;
					}
				}
			}
		});

		// If any combatants could not be not placed on the map, remove them from the encounter
		encounter.combatants = encounter.combatants.filter(c => (c.combat.position.x !== Number.MIN_VALUE) && (c.combat.position.y !== Number.MIN_VALUE));
	};

	static canPlaceHere = (encounter: EncounterModel, square: { x: number, y: number }) => {
		const mapSquare = encounter.mapSquares.find(ms => (ms.x === square.x) && (ms.y === square.y));

		if (!mapSquare) {
			// Off the map
			return false;
		}

		if (mapSquare.type !== EncounterMapSquareType.Clear) {
			// Not a clear square
			return false;
		}

		const occupiedSquares: { x: number; y: number }[] = [];
		encounter.combatants.forEach(combatant => occupiedSquares.push(...EncounterLogic.getCombatantSquares(encounter, combatant)));
		encounter.loot.forEach(lp => occupiedSquares.push(lp.position));

		if (occupiedSquares.find(os => (os.x === square.x) && (os.y === square.y))) {
			// Someone else is here
			return false;
		}

		return true;
	};
}
