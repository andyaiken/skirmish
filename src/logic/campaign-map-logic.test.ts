import { describe, expect, it } from 'vitest';

import type { CampaignMapModel } from '../models/campaign-map';
import type { RegionModel } from '../models/region';

import { CampaignMapLogic } from './campaign-map-logic';

const createRegion = (id: string): RegionModel => ({
	id: id,
	name: id,
	color: '',
	encounters: [],
	boon: null as unknown as RegionModel['boon'],
	demographics: { size: 1, population: 1, terrain: '' }
});

// Builds a map from a grid of characters, one per square. A '.' is unclaimed
// (regionID ''), any other character is the ID of the region owning it.
const createMap = (rows: string[]): CampaignMapModel => {
	const squares = rows.flatMap((row, y) =>
		[ ...row ].map((ch, x) => ({ x: x, y: y, regionID: ch === '.' ? '' : ch })));

	const ids = [ ...new Set(squares.map(sq => sq.regionID)) ].filter(id => id !== '');

	return { squares: squares, regions: ids.map(createRegion) };
};

const region = (map: CampaignMapModel, id: string) => map.regions.find(r => r.id === id) as RegionModel;

describe('CampaignMapLogic.getAdjacentSquares', () => {
	// The campaign map is a hex grid stored in offset columns, so which
	// diagonals are neighbours depends on whether x is even or odd.
	it('finds six neighbours for a square in an even column', () => {
		const map = createMap([ 'aaaa', 'aaaa', 'aaaa' ]);
		const adj = CampaignMapLogic.getAdjacentSquares(map, 2, 1).map(sq => `${sq.x},${sq.y}`);
		expect(adj.sort()).toEqual([ '1,1', '1,2', '2,0', '2,2', '3,1', '3,2' ].sort());
	});

	it('finds six neighbours for a square in an odd column', () => {
		const map = createMap([ 'aaa', 'aaa', 'aaa' ]);
		const adj = CampaignMapLogic.getAdjacentSquares(map, 1, 1).map(sq => `${sq.x},${sq.y}`);
		expect(adj.sort()).toEqual([ '0,0', '0,1', '1,0', '1,2', '2,0', '2,1' ].sort());
	});

	it('omits neighbours that are not on the map', () => {
		const map = createMap([ 'aa', 'aa' ]);
		expect(CampaignMapLogic.getAdjacentSquares(map, 0, 0)).toHaveLength(3);
	});
});

describe('CampaignMapLogic.canAttackRegion', () => {
	it('allows attacking a region that borders conquered ground', () => {
		const map = createMap([
			'ab',
			'a.'
		]);
		expect(CampaignMapLogic.canAttackRegion(map, region(map, 'b'))).toBe(true);
	});

	it('refuses a region entirely enclosed by other regions', () => {
		// 'b' sits at (1,1); all six of its neighbours belong to 'a', and 'a'
		// itself has no unclaimed neighbour either.
		const map = createMap([
			'aaa',
			'aba',
			'aaa'
		]);
		expect(CampaignMapLogic.canAttackRegion(map, region(map, 'b'))).toBe(false);
		expect(CampaignMapLogic.canAttackRegion(map, region(map, 'a'))).toBe(false);
	});

	it('allows attacking only the region that borders the unclaimed square', () => {
		// (2,2) is unclaimed, and is not one of the six neighbours of 'b'.
		const map = createMap([
			'aaa',
			'aba',
			'aa.'
		]);
		expect(CampaignMapLogic.canAttackRegion(map, region(map, 'a'))).toBe(true);
		expect(CampaignMapLogic.canAttackRegion(map, region(map, 'b'))).toBe(false);
	});
});

describe('CampaignMapLogic.conquerRegion', () => {
	it('clears the region and removes it from the map', () => {
		const map = createMap([
			'ab',
			'a.'
		]);
		CampaignMapLogic.conquerRegion(map, region(map, 'b'));

		expect(map.squares.filter(sq => sq.regionID === 'b')).toHaveLength(0);
		expect(map.regions.map(r => r.id)).toEqual([ 'a' ]);
	});

	it('opens up a newly landlocked region for attack', () => {
		const map = createMap([
			'.ab',
			'.ab'
		]);
		expect(CampaignMapLogic.canAttackRegion(map, region(map, 'b'))).toBe(false);
		CampaignMapLogic.conquerRegion(map, region(map, 'a'));
		expect(CampaignMapLogic.canAttackRegion(map, region(map, 'b'))).toBe(true);
	});
});

describe('CampaignMapLogic.isConquered', () => {
	it('is false while any square belongs to a region', () => {
		expect(CampaignMapLogic.isConquered(createMap([ 'a.' ]))).toBe(false);
	});

	it('is true once every square is unclaimed', () => {
		expect(CampaignMapLogic.isConquered(createMap([ '..' ]))).toBe(true);
	});
});
