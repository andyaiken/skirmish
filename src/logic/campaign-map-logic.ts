import { GameLogic } from './game-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../models/campaign-map';
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

	static canAttackRegion = (map: CampaignMapModel, region: RegionModel) => {
		const squares = CampaignMapLogic.getSquares(map, region);
		return squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).some(a => a.regionID === ''));
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
