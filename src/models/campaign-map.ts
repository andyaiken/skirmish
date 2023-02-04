import { generateName } from '../utils/name-generator';
import { randomNumber } from '../utils/random';
import { guid } from '../utils/utils';
import { BoonType, getRandomBoon } from './boon';

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
	boon: BoonType;
}

export interface CampaignMap {
	squares: CampaignMapSquare[];
	regions: CampaignMapRegion[];
}

export const createMap = (): CampaignMap => {
	const map: CampaignMap = {
		squares: [{
			id: guid(),
			x: 0,
			y: 0,
			regionID: ''
		}],
		regions: []
	};

	while (map.squares.length < 1000) {
		const index = randomNumber(map.squares.length);
		const parent = map.squares[index];

		let x = parent.x;
		let y = parent.y;
		const dir = randomNumber(4);
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
				id: guid(),
				x: x,
				y: y,
				regionID: ''
			});
		}
	}

	const regionCount = map.squares.length / 20;
	while (map.regions.length !== regionCount) {
		const r = randomNumber(256);
		const g = randomNumber(256);
		const b = randomNumber(256);

		map.regions.push({
			id: guid(),
			name: generateName(),
			color: `rgb(${r}, ${g}, ${b})`,
			boon: getRandomBoon()
		});
	}

	map.regions.forEach(region => {
		const unclaimed = map.squares.filter(sq => sq.regionID === '');
		const index = randomNumber(unclaimed.length);
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
					getAdjacentSquares(map, sq.x, sq.y)
						.filter(s => s.regionID === '')
						.forEach(s => candidates.push(s));
				});

			// Pick a square and claim it
			if (candidates.length > 0) {
				const index = randomNumber(candidates.length);
				const square = candidates[index];
				square.regionID = region.id;
			}
		});
	} while (map.squares.filter(sq => sq.regionID === '').length !== 0);

	return map;
}

export const getDimensions = (map: CampaignMap) => {
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

export const getAdjacentSquares = (map: CampaignMap, x: number, y: number) => {
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

export const removeRegion = (map: CampaignMap, region: CampaignMapRegion) => {
	map.squares.forEach(sq => {
		if (sq.regionID === region.id) {
			sq.regionID = '';
		}
	});
}

export const isConquered = (map: CampaignMap) => {
	return map.squares.every(sq => sq.regionID === '');
}
