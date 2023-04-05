import type { CampaignMapModel, CampaignMapSquareModel } from '../models/campaign-map';
import type { RegionModel } from '../models/region';

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

	static canAttackRegion = (map: CampaignMapModel, region: RegionModel) => {
		const squares = CampaignMapLogic.getSquares(map, region);
		const coastal = squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).length !== 4);
		const bordering = squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).some(a => a.regionID === ''));
		return coastal || bordering;
	};

	static removeRegion = (map: CampaignMapModel, region: RegionModel) => {
		map.squares.forEach(sq => {
			if (sq.regionID === region.id) {
				sq.regionID = '';
			}
		});
	};

	static isConquered = (map: CampaignMapModel) => {
		return map.squares.every(sq => sq.regionID === '');
	};
}
