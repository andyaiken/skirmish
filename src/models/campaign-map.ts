import { NameGenerator } from '../utils/name-generator';
import { Utils } from '../utils/utils';

export interface CampaignMapSquare {
	id: string;
	x: number;
	y: number;
	regionID: string;
}

export interface CampaignMapRegion {
	id: string;
	name: string;
	color: string;
}

export interface CampaignMap {
	squares: CampaignMapSquare[];
	regions: CampaignMapRegion[];
}

export class CampaignMapHelper {
	public static createMap(): CampaignMap {
		const map: CampaignMap = {
			squares: [{
				id: Utils.guid(),
				x: 0,
				y: 0,
				regionID: ''
			}],
			regions: []
		};

		while (map.squares.length < 1000) {
			const index = Utils.randomNumber(map.squares.length);
			const parent = map.squares[index];

			let x = parent.x;
			let y = parent.y;
			const dir = Utils.randomNumber(4);
			switch (dir) {
				case 0:
					y -= 1;
					break;
				case 1:
					x += 1;
					break;
				case 2:
					y += 1;
					break;
				case 3:
					x -= 1;
					break;
			}

			const exists = map.squares.find(sq => (sq.x === x) && (sq.y === y));
			if (!exists) {
				map.squares.push({
					id: Utils.guid(),
					x: x,
					y: y,
					regionID: ''
				});
			}
		}

		const regionCount = map.squares.length / 20;
		while (map.regions.length !== regionCount) {
			const r = Utils.randomNumber(256);
			const g = Utils.randomNumber(256);
			const b = Utils.randomNumber(256);

			map.regions.push({
				id: Utils.guid(),
				name: NameGenerator.generateName(),
				color: 'rgb(' + r + ',' + g + ',' + b + ')'
			});
		}

		map.regions.forEach(region => {
			const unclaimed = map.squares.filter(sq => sq.regionID === '');
			const index = Utils.randomNumber(unclaimed.length);
			const square = map.squares[index];
			square.regionID = region.id;
		});

		do {
			// Pick a region
			map.regions.forEach(region => {
				// Find all adjacent squares
				const candidates: CampaignMapSquare[] = [];
				map.squares
					.filter(sq => sq.regionID === region.id)
					.forEach(sq => {
						CampaignMapHelper.getAdjacentSquares(map, sq.x, sq.y)
							.filter(s => s.regionID === '')
							.forEach(s => candidates.push(s));
					});

				// Pick a square and claim it
				if (candidates.length > 0) {
					const index = Utils.randomNumber(candidates.length);
					const square = candidates[index];
					square.regionID = region.id;
				}
			});
		} while (map.squares.filter(sq => sq.regionID === '').length !== 0);

		return map;
	}

	public static getDimensions(map: CampaignMap) {
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
	}

	public static getAdjacentSquares(map: CampaignMap, x: number, y: number) {
		const adj: CampaignMapSquare[] = [];

		const left = map.squares.find(sq => (sq.x === x - 1) && (sq.y === y));
		if (left) {
			adj.push(left);
		}
		const top = map.squares.find(sq => (sq.x === x) && (sq.y === y - 1));
		if (top) {
			adj.push(top);
		}
		const right = map.squares.find(sq => (sq.x === x + 1) && (sq.y === y));
		if (right) {
			adj.push(right);
		}
		const bottom = map.squares.find(sq => (sq.x === x) && (sq.y === y + 1));
		if (bottom) {
			adj.push(bottom);
		}

		return adj;
	}

	public static removeRegion(map: CampaignMap, region: CampaignMapRegion) {
		map.squares.forEach(sq => {
			if (sq.regionID === region.id) {
				sq.regionID = '';
			}
		});
	}

	public static isConquered(map: CampaignMap) {
		return map.squares.every(sq => sq.regionID === '');
	}
}
