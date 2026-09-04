import { SkillType } from '../enums/skill-type';
import { StructureType } from '../enums/structure-type';

import { CombatantLogic } from './combatant-logic';
import { GameLogic } from './game-logic';
import { StrongholdLogic } from './stronghold-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../models/campaign-map';
import type { GameModel } from '../models/game';
import type { RegionModel } from '../models/region';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

export class CampaignMapLogic {
	static getAdjacentSquares = (map: CampaignMapModel, x: number, y: number) => {
		const adj: CampaignMapSquareModel[] = [];

		const n = map.squares.find(sq => (sq.x === x) && (sq.y === y - 1));
		if (n) {
			adj.push(n);
		}
		if (x % 2 === 0) {
			const ne = map.squares.find(sq => (sq.x === x + 1) && (sq.y === y));
			if (ne) {
				adj.push(ne);
			}
			const se = map.squares.find(sq => (sq.x === x + 1) && (sq.y === y + 1));
			if (se) {
				adj.push(se);
			}
		} else {
			const ne = map.squares.find(sq => (sq.x === x + 1) && (sq.y === y - 1));
			if (ne) {
				adj.push(ne);
			}
			const se = map.squares.find(sq => (sq.x === x + 1) && (sq.y === y));
			if (se) {
				adj.push(se);
			}
		}
		const s = map.squares.find(sq => (sq.x === x) && (sq.y === y + 1));
		if (s) {
			adj.push(s);
		}
		if (x % 2 === 0) {
			const sw = map.squares.find(sq => (sq.x === x - 1) && (sq.y === y + 1));
			if (sw) {
				adj.push(sw);
			}
			const nw = map.squares.find(sq => (sq.x === x - 1) && (sq.y === y));
			if (nw) {
				adj.push(nw);
			}
		} else {
			const sw = map.squares.find(sq => (sq.x === x - 1) && (sq.y === y));
			if (sw) {
				adj.push(sw);
			}
			const nw = map.squares.find(sq => (sq.x === x - 1) && (sq.y === y - 1));
			if (nw) {
				adj.push(nw);
			}
		}

		return adj;
	};

	static getDimensions = (squares: CampaignMapSquareModel[]) => {
		const dims = {
			left: Number.MIN_VALUE,
			top: Number.MIN_VALUE,
			right: Number.MIN_VALUE,
			bottom: Number.MIN_VALUE
		};

		squares.forEach(sq => {
			dims.left = dims.left === Number.MIN_VALUE ? sq.x : Math.min(dims.left, sq.x);
			dims.top = dims.top === Number.MIN_VALUE ? sq.y : Math.min(dims.top, sq.y);
			dims.right = dims.right === Number.MIN_VALUE ? sq.x : Math.max(dims.right, sq.x);
			dims.bottom = dims.bottom === Number.MIN_VALUE ? sq.y : Math.max(dims.bottom, sq.y);
		});

		return dims;
	};

	static getSquares = (map: CampaignMapModel, region: RegionModel) => {
		return map.squares.filter(sq => sq.regionID === region.id);
	};

	static getCentralSquare = (map: CampaignMapModel, region: RegionModel) => {
		const squares = CampaignMapLogic.getSquares(map, region);
		const x = Collections.mean(squares, s => s.x);
		const y = Collections.mean(squares, s => s.y);
		return Collections.min(squares, s => {
			const x2 = Math.pow(s.x - x, 2);
			const y2 = Math.pow(s.y - y, 2);
			return Math.sqrt(x2 + y2);
		});
	};

	static isAdjacentToTerritory = (map: CampaignMapModel, region: RegionModel) => {
		const squares = CampaignMapLogic.getSquares(map, region);
		return squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).some(a => a.regionID === ''));
	};

	// The island is a hex grid, so a square in open water has fewer than six neighbours on the map.
	// Nothing is stored for this - it's derived, so it costs nothing in the save file.
	static isCoastal = (map: CampaignMapModel, region: RegionModel) => {
		const squares = CampaignMapLogic.getSquares(map, region);
		return squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).length < 6);
	};

	// Your own land reaches the sea. The campaign starts you in a coastal region and you only ever
	// gain ground, so in practice this holds from the first turn - but the rule is stated in full
	// so it stays correct if the map generator ever changes.
	static hasCoastalTerritory = (map: CampaignMapModel) => {
		return map.squares
			.filter(sq => sq.regionID === '')
			.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).length < 6);
	};

	static canReachRegionBySea = (game: GameModel, region: RegionModel) => {
		if (StrongholdLogic.getStructureCharges(game, StructureType.Shipyard) === 0) {
			return false;
		}

		return CampaignMapLogic.hasCoastalTerritory(game.map) && CampaignMapLogic.isCoastal(game.map, region);
	};

	static canAttackRegion = (game: GameModel, region: RegionModel) => {
		return CampaignMapLogic.isAdjacentToTerritory(game.map, region) || CampaignMapLogic.canReachRegionBySea(game, region);
	};

	// Buying a region should cost more than clearing it is worth, so that it reads as a release
	// valve for a region you can't beat rather than a way to skip the game. A structure costs 50
	// and a magic item 100; an encounter yields perhaps 50 in loot, so a base of 50 per remaining
	// encounter keeps even a one-encounter region above a single encounter's takings.
	static purchaseBasePrice = 50;

	static getPurchasePrice = (game: GameModel, region: RegionModel) => {
		let price = CampaignMapLogic.purchaseBasePrice
			* region.encounters.length
			* (1 + (region.demographics.population / 10));

		// The party's best negotiator knocks 5% off per rank of Presence, down to half price.
		// There's no encounter in progress, so there are no conditions to apply.
		const negotiator = Collections.max(game.heroes, h => CombatantLogic.getSkillRank(h, [], SkillType.Presence));
		const presence = negotiator ? CombatantLogic.getSkillRank(negotiator, [], SkillType.Presence) : 0;
		price *= 1 - (Math.min(presence * 5, 50) / 100);

		// Then the guilds take a quarter off whatever's left. Applying it to the remainder rather
		// than adding percentages means a Guildhall is always worth the same proportion, even to a
		// party that can already talk a region down to half price.
		if (StrongholdLogic.getStructureCharges(game, StructureType.Guildhall) > 0) {
			price *= 0.75;
		}

		// Round to the nearest 5 so the discounts don't produce awkward prices
		return Math.round(price / 5) * 5;
	};

	static canPurchaseRegion = (game: GameModel, region: RegionModel) => {
		// Same reachability requirement as attacking - you can't buy land you can't get to, by land
		// or by sea - but no requirement to have any heroes, since buying is also how a wiped-out
		// party recovers.
		if (!CampaignMapLogic.canAttackRegion(game, region)) {
			return false;
		}

		return game.money >= CampaignMapLogic.getPurchasePrice(game, region);
	};

	static conquerRegion = (map: CampaignMapModel, region: RegionModel) => {
		map.squares.forEach(sq => {
			if (sq.regionID === region.id) {
				sq.regionID = '';
			}
		});

		map.regions = map.regions.filter(r => map.squares.some(sq => sq.regionID === r.id));
	};

	static isConquered = (map: CampaignMapModel) => {
		return map.squares.every(sq => sq.regionID === '');
	};

	static getMonsters = (region: RegionModel, packIDs: string[]) => {
		const monsterIDs = GameLogic.getMonsterSpeciesDeck(packIDs);

		const rng = Random.getSeededRNG(region.id);
		const count = Random.randomNumber(2, rng) + 2;
		return Collections.shuffle(monsterIDs, rng).slice(0, count);
	};
}
