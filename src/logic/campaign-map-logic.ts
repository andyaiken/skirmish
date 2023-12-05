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
		const e = map.squares.find(sq => (sq.x === x + 1) && (sq.y === y));
		if (e) {
			adj.push(e);
		}
		const s = map.squares.find(sq => (sq.x === x) && (sq.y === y + 1));
		if (s) {
			adj.push(s);
		}
		const w = map.squares.find(sq => (sq.x === x - 1) && (sq.y === y));
		if (w) {
			adj.push(w);
		}

		return adj;
	};

	static getDimensions = (map: CampaignMapModel) => {
		const dims = {
			left: Number.MAX_VALUE,
			top: Number.MAX_VALUE,
			right: Number.MIN_VALUE,
			bottom: Number.MIN_VALUE
		};

		map.squares.forEach(sq => {
			dims.left = Math.min(dims.left, sq.x);
			dims.top = Math.min(dims.top, sq.y);
			dims.right = Math.max(dims.right, sq.x);
			dims.bottom = Math.max(dims.bottom, sq.y);
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
