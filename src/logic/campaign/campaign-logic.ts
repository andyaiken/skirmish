import { CombatantType } from '../../enums/combatant-type';
import { StructureType } from '../../enums/structure-type';

import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';
import type { GameModel } from '../../models/game';
import type { RegionModel } from '../../models/region';

import { Collections } from '../../utils/collections/collections';

import { CampaignMapLogic } from '../campaign-map/campaign-map-logic';
import { CombatantLogic } from '../combatant/combatant-logic';
import { ConditionLogic } from '../condition/condition-logic';
import { EncounterLogic } from '../encounter/encounter-logic';
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
}
