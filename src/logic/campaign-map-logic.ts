import type { CampaignMapModel, CampaignMapRegionModel, CampaignMapSquareModel } from '../models/campaign-map';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { GameLogic } from './game-logic';
import { NameGenerator } from './name-generator';

export class CampaignMapLogic {
	static generateCampaignMap = (): CampaignMapModel => {
		const map: CampaignMapModel = {
			squares: [ {
				x: 0,
				y: 0,
				regionID: ''
			} ],
			regions: []
		};

		while (map.squares.length < 1000) {
			const parent = Collections.draw(map.squares);

			let x = parent.x;
			let y = parent.y;
			const dir = Random.randomNumber(4);
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
					x: x,
					y: y,
					regionID: ''
				});
			}
		}

		const regionCount = map.squares.length / 20;
		while (map.regions.length !== regionCount) {
			const count = Random.dice(1);
			const encounters: string[] = [];
			while (encounters.length < count) {
				encounters.push(Utils.guid());
			}

			// The lightest colour we will allow is rgb(229, 229, 229)
			// This is so that the player (white) stands out
			const max = 230;
			const r = Random.randomNumber(max);
			const g = Random.randomNumber(max);
			const b = Random.randomNumber(max);

			map.regions.push({
				id: Utils.guid(),
				name: NameGenerator.generateName(),
				color: `rgb(${r}, ${g}, ${b})`,
				encounters: encounters,
				boon: GameLogic.generateBoon()
			});
		}

		map.regions.forEach(region => {
			const unclaimed = map.squares.filter(sq => sq.regionID === '');
			const square = Collections.draw(unclaimed);
			square.regionID = region.id;
		});

		do {
			// Pick a region
			map.regions.forEach(region => {
				// Find all adjacent squares
				const candidates: CampaignMapSquareModel[] = [];
				map.squares
					.filter(sq => sq.regionID === region.id)
					.forEach(sq => {
						CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y)
							.filter(s => s.regionID === '')
							.forEach(s => candidates.push(s));
					});

				// Pick a square and claim it
				if (candidates.length > 0) {
					const square = Collections.draw(candidates);
					square.regionID = region.id;
				}
			});
		} while (map.squares.filter(sq => sq.regionID === '').length !== 0);

		return map;
	};

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

	static getSquares = (map: CampaignMapModel, region: CampaignMapRegionModel) => {
		return map.squares.filter(sq => sq.regionID === region.id);
	};

	static canAttackRegion = (map: CampaignMapModel, region: CampaignMapRegionModel) => {
		const squares = CampaignMapLogic.getSquares(map, region);
		const coastal = squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).length !== 4);
		const bordering = squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).some(a => a.regionID === ''));
		return coastal || bordering;
	};

	static removeRegion = (map: CampaignMapModel, region: CampaignMapRegionModel) => {
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
