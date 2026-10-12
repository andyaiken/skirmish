import { BoonType } from '../../enums/boon-type';
import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { EncounterState } from '../../enums/encounter-state';
import { StructureType } from '../../enums/structure-type';

import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';
import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';
import type { RegionModel } from '../../models/region';

import { Collections } from '../../utils/collections/collections';

import { CampaignMapLogic } from '../campaign-map/campaign-map-logic';
import { CombatantLogic } from '../combatant/combatant-logic';
import { ConditionLogic } from '../condition/condition-logic';
import { EncounterLogic } from '../encounter/encounter-logic';
import { EncounterMapLogic } from '../encounter-map/encounter-map-logic';
import { GameLogic } from '../game/game-logic';
import { StrongholdLogic } from '../stronghold/stronghold-logic';

export class CampaignLogic {
	static startEncounter = (
		game: GameModel,
		region: RegionModel,
		heroes: CombatantModel[],
		benefits: number,
		detriments: number,
		packIDs: string[],
		developer: boolean,
		createEncounter: (region: RegionModel, heroes: CombatantModel[], packIDs: string[]) => EncounterModel
	) => {
		if (!CampaignMapLogic.isAdjacentToTerritory(game.map, region) && !developer) {
			StrongholdLogic.spendCharge(game, StructureType.Shipyard, 1);
		}

		heroes.forEach(hero => CombatantLogic.resetCombatant(hero));
		game.heroes = game.heroes.filter(hero => !heroes.includes(hero));
		game.encounter = createEncounter(region, heroes, packIDs);

		for (let n = 0; n < benefits; ++n) {
			const hero = Collections.draw(game.encounter.combatants.filter(c => c.faction === CombatantType.Hero));
			hero.combat.conditions.push(ConditionLogic.createRandomBeneficialCondition() as ConditionModel);
		}
		if (!developer) {
			StrongholdLogic.spendCharge(game, StructureType.Temple, benefits);
		}

		for (let n = 0; n < detriments; ++n) {
			const monster = Collections.draw(game.encounter.combatants.filter(c => c.faction === CombatantType.Monster));
			monster.combat.conditions.push(ConditionLogic.createRandomDetrimentalCondition() as ConditionModel);
		}
		if (!developer) {
			StrongholdLogic.spendCharge(game, StructureType.Intelligencer, detriments);
		}
	};

	static conquerRegion = (
		game: GameModel,
		region: RegionModel,
		packIDs: string[],
		createEncounter: (region: RegionModel, heroes: CombatantModel[], packIDs: string[]) => EncounterModel
	) => {
		const encounterCount = region.encounters.length;

		while (region.encounters.length > 0) {
			// Encounter generation places combatants on its map; copies keep the campaign heroes untouched.
			const heroes = JSON.parse(JSON.stringify(game.heroes)) as CombatantModel[];
			const encounter = createEncounter(region, heroes, packIDs);

			EncounterLogic.defeatStandingMonsters(encounter);

			const spoils = encounter.loot.flatMap(loot => {
				game.money += loot.money;
				return loot.items;
			});
			encounter.combatants
				.filter(c => (c.type === CombatantType.Monster) && (c.faction === CombatantType.Monster))
				.forEach(monster => {
					spoils.push(...monster.items);
					spoils.push(...monster.carried);
				});
			GameLogic.addItemsToGame(game, spoils);

			region.encounters.splice(0, 1);
		}

		game.money += StrongholdLogic.getConquestIncome(game, region);
		CampaignMapLogic.conquerRegion(game.map, region);
		game.heroes.forEach(hero => hero.xp += encounterCount);
		game.heroSlots += 1;
		game.boons.push(region.boon);
	};

	static purchaseRegion = (game: GameModel, region: RegionModel, developer: boolean) => {
		game.money = Math.max(0, game.money - CampaignMapLogic.getPurchasePrice(game, region));
		const income = StrongholdLogic.getConquestIncome(game, region);

		if (!developer) {
			if (!CampaignMapLogic.isAdjacentToTerritory(game.map, region)) {
				StrongholdLogic.spendCharge(game, StructureType.Shipyard, 1);
			}
			StrongholdLogic.spendCharge(game, StructureType.Guildhall, 1);
		}

		CampaignMapLogic.conquerRegion(game.map, region);

		if (CampaignMapLogic.isConquered(game.map)) {
			return true;
		}

		game.heroSlots += 1;
		game.boons.push(region.boon);
		game.money += income;
		return false;
	};

	static equipItem = (game: GameModel, item: ItemModel, combatant: CombatantModel) => {
		if (game.encounter) {
			EncounterLogic.equipItem(game.encounter, combatant, item);
		} else {
			game.items = game.items.filter(i => i.id !== item.id);
			combatant.carried = combatant.carried.filter(i => i.id !== item.id);
			combatant.items.push(item);
		}
	};

	static unequipItem = (game: GameModel, item: ItemModel, combatant: CombatantModel) => {
		if (game.encounter) {
			EncounterLogic.unequipItem(game.encounter, combatant, item);
		} else {
			combatant.items = combatant.items.filter(i => i.id !== item.id);
			combatant.carried.push(item);
		}
	};

	static pickUpItem = (game: GameModel, item: ItemModel, combatant: CombatantModel) => {
		if (game.encounter) {
			EncounterLogic.pickUpItem(game.encounter, combatant, item);
		} else {
			game.items = game.items.filter(i => i.id !== item.id);
			if (CombatantLogic.canEquip(combatant, item)) {
				combatant.items.push(item);
			} else {
				combatant.carried.push(item);
			}
		}
	};

	static dropItem = (game: GameModel, item: ItemModel, combatant: CombatantModel) => {
		if (game.encounter) {
			EncounterLogic.dropItem(game.encounter, combatant, item);
		} else {
			// Between encounters the item goes to the stores, so it stays where it is when
			// there is no room - better held by the hero than lost.
			if (GameLogic.storesAreFull(game)) {
				return;
			}

			combatant.items = combatant.items.filter(i => i.id !== item.id);
			combatant.carried = combatant.carried.filter(i => i.id !== item.id);

			game.items.push(item);
		}
	};

	// Returns what the UI needs to report: the whole island being taken, items that did not fit
	// in the stores, or the loss of the last hero. Returns null if there is nothing to finish.
	static finishEncounter = (game: GameModel, state: EncounterState) => {
		const encounter = game.encounter;
		if (!encounter) {
			return null;
		}

		const region = game.map.regions.find(r => r.id === encounter.regionID);
		if (!region) {
			return null;
		}

		const result = {
			region: region,
			islandConquered: false,
			leftBehind: [] as ItemModel[],
			noHeroesRemain: false
		};

		const survivors = (states: CombatantState[]) => encounter.combatants
			.filter(c => (c.type === CombatantType.Hero) && (c.faction === CombatantType.Hero))
			.filter(h => states.includes(h.combat.state));

		switch (state) {
			case EncounterState.Victory: {
				// Any monster still on its feet means the encounter was conceded rather than
				// fought out, and it has not dropped anything. Doing it here keeps a manual
				// win worth the same as a real one; in an ordinary victory every monster is
				// already down, so this finds nobody.
				EncounterLogic.defeatStandingMonsters(encounter);
				// Get equipment and money from loot piles, add to game items
				const spoils: ItemModel[] = [];
				encounter.loot.forEach(lp => {
					spoils.push(...lp.items);
					game.money += lp.money;
				});
				encounter.combatants
					.filter(c => (c.type === CombatantType.Monster) && (c.faction === CombatantType.Monster))
					.forEach(c => {
						spoils.push(...c.items);
						spoils.push(...c.carried);
					});
				// Coin always comes home; items only as far as there is room for them
				result.leftBehind = GameLogic.addItemsToGame(game, spoils);
				// Increment XP for surviving heroes
				survivors([ CombatantState.Standing, CombatantState.Prone ]).forEach(h => h.xp += 1);
				// Add surviving heroes back into the game
				survivors([ CombatantState.Standing, CombatantState.Prone, CombatantState.Unconscious ]).forEach(h => game.heroes.push(h));
				game.heroes = Collections.sort(game.heroes, n => n.name);
				// Remove the first encounter for this region
				region.encounters.splice(0, 1);
				if (region.encounters.length === 0) {
					// Read the income while the region is still on the map
					const income = StrongholdLogic.getConquestIncome(game, region);
					// Conquer the region
					CampaignMapLogic.conquerRegion(game.map, region);
					if (CampaignMapLogic.isConquered(game.map)) {
						result.islandConquered = true;
					} else {
						// Add a new hero slot
						game.heroSlots += 1;
						// Add the region's boon
						game.boons.push(region.boon);
						// A Counting House starts collecting from the region
						game.money += income;
					}
				}
				break;
			}
			case EncounterState.Defeat: {
				const heroes = game.heroes.length + game.heroSlots + game.boons.filter(b => b.type === BoonType.ExtraHero).length;
				result.noHeroesRemain = heroes === 0;
				break;
			}
			case EncounterState.Retreat: {
				// Add conscious heroes back into the game
				survivors([ CombatantState.Standing, CombatantState.Prone ]).forEach(h => game.heroes.push(h));
				game.heroes = Collections.sort(game.heroes, n => n.name);
				break;
			}
		}

		// Clear the current encounter
		game.encounter = null;

		game.heroes.forEach(h => CombatantLogic.resetCombatant(h));
		EncounterMapLogic.visibilityCache.reset();

		return result;
	};
}
