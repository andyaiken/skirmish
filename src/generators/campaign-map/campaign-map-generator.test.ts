import { describe, expect, it } from 'vitest';

import type { CampaignMapModel, CampaignMapSquareModel } from '../../models/campaign-map';

import { CampaignMapGenerator } from './campaign-map-generator';
import { CampaignMapLogic } from '../../logic/campaign-map/campaign-map-logic';
import { Random } from '../../utils/random/random';

const key = (x: number, y: number) => `${x},${y}`;

const adjacentCoordinates = (x: number, y: number) => {
	if (x % 2 === 0) {
		return [
			{ x: x, y: y - 1 },
			{ x: x + 1, y: y },
			{ x: x + 1, y: y + 1 },
			{ x: x, y: y + 1 },
			{ x: x - 1, y: y + 1 },
			{ x: x - 1, y: y }
		];
	}

	return [
		{ x: x, y: y - 1 },
		{ x: x + 1, y: y - 1 },
		{ x: x + 1, y: y },
		{ x: x, y: y + 1 },
		{ x: x - 1, y: y },
		{ x: x - 1, y: y - 1 }
	];
};

const getReachableSquares = (
	map: CampaignMapModel,
	start: CampaignMapSquareModel,
	squareAt: Map<string, CampaignMapSquareModel>
) => {
	const visited = new Set([ key(start.x, start.y) ]);
	const queue = [ start ];
	for (let i = 0; i < queue.length; i++) {
		const current = queue[i];
		adjacentCoordinates(current.x, current.y)
			.map(pt => squareAt.get(key(pt.x, pt.y)))
			.filter((square): square is CampaignMapSquareModel => !!square && CampaignMapLogic.isClaimable(square))
			.forEach(square => {
				const squareKey = key(square.x, square.y);
				if (!visited.has(squareKey)) {
					visited.add(squareKey);
					queue.push(square);
				}
			});
	}
	return visited;
};

const checkMap = (map: CampaignMapModel) => {
	const squareAt = new Map(map.squares.map(square => [ key(square.x, square.y), square ]));
	const claimable = map.squares.filter(CampaignMapLogic.isClaimable);
	const start = claimable.find(CampaignMapLogic.isOwned) as CampaignMapSquareModel;
	const reachable = getReachableSquares(map, start, squareAt);
	const startingRegionID = map.history[0].regionID;

	// 1000 hexes of island, less the lakes that were cut out of it
	expect(map.squares.length).toBeLessThan(1000);
	expect(map.squares.length).toBeGreaterThan(900);
	expect(map.regions.length).toBeGreaterThan(1);
	expect(map.history).toHaveLength(1);
	expect(map.regions.every(region => region.demographics.size >= 8 && region.demographics.size <= 40)).toBe(true);
	expect(claimable.every(square =>
		CampaignMapLogic.isOwned(square) || map.regions.some(region => region.id === square.regionID)
	)).toBe(true);
	expect(map.squares.filter(square => square.feature === 'peak').every(square => square.regionID === '')).toBe(true);
	expect(map.regions.every(region =>
		map.squares.filter(square => square.regionID === region.id && square.feature === 'settlement').length === 1
	)).toBe(true);
	expect(map.squares.filter(square => square.feature === 'settlement').length).toBe(map.regions.length + 1);
	expect(map.squares.filter(square => square.feature === 'peak').length).toBeGreaterThan(0);
	expect(map.squares.some(square => square.feature === 'lake')).toBe(false);
	expect(map.squares.every(square => square.terrain.length > 0 && square.height >= 0 && square.height <= 9)).toBe(true);
	expect(new Set(map.squares.map(square => square.height < 3 ? 'low' : (square.height < 7 ? 'middle' : 'high'))).size).toBe(3);
	expect(map.regions.some(region => region.id === startingRegionID)).toBe(false);
	expect(map.squares.some(square =>
		CampaignMapLogic.isOwned(square)
		&& adjacentCoordinates(square.x, square.y).some(pt => !squareAt.has(key(pt.x, pt.y)))
	)).toBe(true);
	expect(map.squares
		.filter(square => square.regionID)
		.every(square => reachable.has(key(square.x, square.y)))).toBe(true);

	map.regions.forEach(region => {
		const counts = new Map<string, number>();
		map.squares
			.filter(square => square.regionID === region.id)
			.forEach(square => counts.set(square.terrain, (counts.get(square.terrain) ?? 0) + 1));
		const commonTerrain = [ ...counts.entries() ].sort((a, b) => b[1] - a[1])[0][0];
		expect(region.demographics.terrain).toBe(commonTerrain);
	});

	const riverKeys = new Set(map.squares.filter(square => square.river).map(square => key(square.x, square.y)));
	expect(riverKeys.size).toBeGreaterThan(0);
	while (riverKeys.size > 0) {
		const startKey = riverKeys.values().next().value as string;
		const [ x, y ] = startKey.split(',').map(Number);
		const queue = [ squareAt.get(key(x, y)) as CampaignMapSquareModel ];
		const component = new Set([ startKey ]);
		riverKeys.delete(startKey);
		let reachesWater = false;
		for (let i = 0; i < queue.length; i++) {
			const current = queue[i];
			const adjacent = adjacentCoordinates(current.x, current.y).map(pt => squareAt.get(key(pt.x, pt.y)));
			if (adjacent.some(square => !square)) {
				reachesWater = true;
			}
			adjacent
				.filter((square): square is CampaignMapSquareModel => !!square && !!square.river)
				.forEach(square => {
					const squareKey = key(square.x, square.y);
					if (!component.has(squareKey)) {
						component.add(squareKey);
						riverKeys.delete(squareKey);
						queue.push(square);
					}
				});
		}
		expect(reachesWater).toBe(true);
	}
};

describe('CampaignMapGenerator', () => {
	for (let batch = 0; batch < 5; batch++) {
		it(`keeps map properties valid for seeds ${batch * 40}-${(batch + 1) * 40 - 1}`, () => {
			for (let i = batch * 40; i < (batch + 1) * 40; i++) {
				checkMap(CampaignMapGenerator.generateCampaignMap([], Random.getSeededRNG(`island ${i}`)));
			}
		});
	}

	it('generates identical maps from identical seeds', () => {
		const first = CampaignMapGenerator.generateCampaignMap([ 'base' ], Random.getSeededRNG('repeatable island'));
		const second = CampaignMapGenerator.generateCampaignMap([ 'base' ], Random.getSeededRNG('repeatable island'));
		expect(first).toEqual(second);
	});
});
