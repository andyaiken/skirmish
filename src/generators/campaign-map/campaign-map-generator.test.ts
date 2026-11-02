import { describe, expect, it } from 'vitest';

import type { CampaignMapModel, CampaignMapSquareModel } from '../../models/campaign-map';

import { CampaignMapGenerator } from './campaign-map-generator';
import { CampaignMapLogic } from '../../logic/campaign-map/campaign-map-logic';
import { Random } from '../../utils/random/random';
import { getHexVertices } from '../../utils/hex-grid/hex-grid';

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

const pointKey = (point: { x: number, y: number }) => `${point.x},${point.y}`;
const maxRiverWidth = 0.15;
const maxSectionWidthIncrease = 0.008;

const checkRiverGeometry = (map: CampaignMapModel) => {
	const lakeSquares = (map.lakes ?? []).map(lake => ({ ...lake, feature: 'lake' as const }));
	const rivers = map.rivers ?? [];
	const allSquares = [ ...map.squares, ...lakeSquares ];
	const squareAt = new Map(allSquares.map(square => [ key(square.x, square.y), square ]));
	const verticesBySquare = allSquares.map(square => ({
		square,
		vertices: getHexVertices(square)
	}));
	const isVertexOf = (point: { x: number, y: number }, squares: { x: number, y: number }[]) => squares.some(square =>
		getHexVertices(square).some(vertex => pointKey(vertex) === pointKey(point)));
	const sources = [
		...map.squares.filter(square => square.feature === 'peak'),
		...lakeSquares
	];
	const coastalSquares = allSquares.filter(square =>
		adjacentCoordinates(square.x, square.y).some(point => !squareAt.has(key(point.x, point.y))));
	let hasRiverJoin = false;

	rivers.forEach((river, riverIndex) => {
		const pointIDs = river.points.map(pointKey);
		expect(new Set(pointIDs).size).toBe(pointIDs.length);
		expect(isVertexOf(river.points[0], sources)).toBe(true);
		const endpoint = river.points[river.points.length - 1];
		const joinsRiver = rivers.slice(0, riverIndex).some(existing =>
			existing.points.some(point => pointKey(point) === pointKey(endpoint)));
		hasRiverJoin ||= joinsRiver;
		expect(isVertexOf(endpoint, [ ...lakeSquares, ...coastalSquares ]) || joinsRiver).toBe(true);
		if (joinsRiver) {
			const joinedRiver = rivers.slice(0, riverIndex).find(existing =>
				existing.points.some(point => pointKey(point) === pointKey(endpoint)));
			const joinedPoint = joinedRiver?.points.find(point => pointKey(point) === pointKey(endpoint));
			expect(joinedPoint?.width).toBe(endpoint.width);
			expect(endpoint.width).toBeGreaterThan(river.points[river.points.length - 2].width);
			expect(joinedRiver?.points.some(point => point.width > endpoint.width)).toBe(true);
		}

		river.points.slice(1).forEach((point, index) => {
			const previous = river.points[index];
			const hasFullEdge = verticesBySquare.some(({ vertices }) =>
				vertices.some((vertex, vertexIndex) =>
					(pointKey(vertex) === pointKey(previous)
						&& pointKey(vertices[(vertexIndex + 1) % vertices.length]) === pointKey(point))
					|| (pointKey(vertex) === pointKey(point)
						&& pointKey(vertices[(vertexIndex + 1) % vertices.length]) === pointKey(previous))));
			expect(hasFullEdge).toBe(true);
		});
	});

	rivers.forEach((river, riverIndex) => {
		const riverEdges = new Set(river.points.slice(1).map((point, index) =>
			[ pointKey(river.points[index]), pointKey(point) ].sort().join('|')));
		rivers.slice(0, riverIndex).forEach(existing => {
			const existingEdges = new Set(existing.points.slice(1).map((point, index) =>
				[ pointKey(existing.points[index]), pointKey(point) ].sort().join('|')));
			expect([ ...riverEdges ].some(edge => existingEdges.has(edge))).toBe(false);

			const sharedPoints = river.points
				.map(pointKey)
				.filter(pointID => existing.points.some(point => pointKey(point) === pointID));
			if (sharedPoints.length > 0) {
				expect(sharedPoints).toHaveLength(1);
				const isLakeOutletStart = sharedPoints[0] === pointKey(river.points[0])
					&& isVertexOf(river.points[0], lakeSquares);
				expect(isLakeOutletStart || (sharedPoints[0] === pointKey(river.points[river.points.length - 1]))).toBe(true);
			}
		});
	});

	lakeSquares.forEach(lake => {
		const incomingWidths = rivers
			.filter(river => isVertexOf(river.points[river.points.length - 1], [ lake ]))
			.map(river => river.points[river.points.length - 1].width);
		if (incomingWidths.length === 0) {
			return;
		}
		const incomingWidth = Math.max(...incomingWidths);
		const hasMatchingOutlet = rivers.some(river =>
			isVertexOf(river.points[0], [ lake ])
			&& Math.abs(river.points[0].width - incomingWidth) < 0.000001
			&& Math.abs(river.points[1].width - incomingWidth) < 0.000001);
		const outletStarts = rivers
			.filter(river => isVertexOf(river.points[0], [ lake ]))
			.map(river => `${pointKey(river.points[0])}:${river.points[0].width}/${river.points[1].width}`);
		expect(hasMatchingOutlet, `Lake ${key(lake.x, lake.y)} has no outlet matching width ${incomingWidth}; outlets: ${outletStarts.join(', ')}`).toBe(true);
	});

	return hasRiverJoin;
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
	expect((map.lakes ?? []).length).toBeGreaterThan(0);
	expect((map.rivers ?? []).length).toBeGreaterThan(0);
	expect((map.rivers ?? []).every(river =>
		river.points.length > 1
		&& new Set(river.points.map(pointKey)).size === river.points.length
		&& river.points.every(point => point.width <= maxRiverWidth)
		&& river.points.every((point, index) =>
			(index === 0) || (point.width >= river.points[index - 1].width))
	)).toBe(true);
	(map.rivers ?? []).forEach(river => {
		const maxSectionIncrease = Math.max(...river.points.slice(1).map((point, index) =>
			point.width - river.points[index].width));
		expect(maxSectionIncrease).toBeLessThanOrEqual(maxSectionWidthIncrease + 0.000001);
	});
	const hasRiverJoin = checkRiverGeometry(map);
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
	return hasRiverJoin;
};

describe('CampaignMapGenerator', () => {
	for (let batch = 0; batch < 5; batch++) {
		it(`keeps map properties valid for seeds ${batch * 40}-${(batch + 1) * 40 - 1}`, () => {
			let hasRiverJoin = false;
			for (let i = batch * 40; i < (batch + 1) * 40; i++) {
				const mapHasRiverJoin = checkMap(CampaignMapGenerator.generateCampaignMap([], Random.getSeededRNG(`island ${i}`)));
				hasRiverJoin = hasRiverJoin || mapHasRiverJoin;
			}
			expect(hasRiverJoin).toBe(true);
		});
	}

	it('generates identical maps from identical seeds', () => {
		const first = CampaignMapGenerator.generateCampaignMap([ 'base' ], Random.getSeededRNG('repeatable island'));
		const second = CampaignMapGenerator.generateCampaignMap([ 'base' ], Random.getSeededRNG('repeatable island'));
		expect(first).toEqual(second);
	});
});
