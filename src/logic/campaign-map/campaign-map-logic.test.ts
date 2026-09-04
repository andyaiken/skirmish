import { describe, expect, it } from 'vitest';

import { CombatantType } from '../../enums/combatant-type';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';

import type { CampaignMapModel } from '../../models/campaign-map';
import type { CombatantModel } from '../../models/combatant';
import type { GameModel } from '../../models/game';
import type { RegionModel } from '../../models/region';
import type { StructureModel } from '../../models/structure';

import { CampaignMapLogic } from './campaign-map-logic';
import { Factory } from '../factory/factory';
import { FeatureLogic } from '../feature/feature-logic';

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

const createHero = (presence: number): CombatantModel => {
	const hero = Factory.createCombatant(CombatantType.Hero);
	hero.features.push(FeatureLogic.createSkillFeature('presence', SkillType.Presence, presence));
	return hero;
};

const createShipyard = (charges: number): StructureModel => ({
	id: 'shipyard',
	type: StructureType.Shipyard,
	name: 'Shipyard',
	description: '',
	position: { x: 0, y: 0 },
	level: 1,
	charges: charges
});

const createGame = (map: CampaignMapModel, money: number, heroes: CombatantModel[] = [], stronghold: StructureModel[] = []): GameModel => ({
	heroSlots: 0,
	heroes: heroes,
	items: [],
	boons: [],
	money: money,
	map: map,
	stronghold: stronghold,
	encounter: null
});

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

describe('CampaignMapLogic.isAdjacentToTerritory', () => {
	it('allows attacking a region that borders conquered ground', () => {
		const map = createMap([
			'ab',
			'a.'
		]);
		expect(CampaignMapLogic.isAdjacentToTerritory(map, region(map, 'b'))).toBe(true);
	});

	it('refuses a region entirely enclosed by other regions', () => {
		// 'b' sits at (1,1); all six of its neighbours belong to 'a', and 'a'
		// itself has no unclaimed neighbour either.
		const map = createMap([
			'aaa',
			'aba',
			'aaa'
		]);
		expect(CampaignMapLogic.isAdjacentToTerritory(map, region(map, 'b'))).toBe(false);
		expect(CampaignMapLogic.isAdjacentToTerritory(map, region(map, 'a'))).toBe(false);
	});

	it('allows attacking only the region that borders the unclaimed square', () => {
		// (2,2) is unclaimed, and is not one of the six neighbours of 'b'.
		const map = createMap([
			'aaa',
			'aba',
			'aa.'
		]);
		expect(CampaignMapLogic.isAdjacentToTerritory(map, region(map, 'a'))).toBe(true);
		expect(CampaignMapLogic.isAdjacentToTerritory(map, region(map, 'b'))).toBe(false);
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
		expect(CampaignMapLogic.isAdjacentToTerritory(map, region(map, 'b'))).toBe(false);
		CampaignMapLogic.conquerRegion(map, region(map, 'a'));
		expect(CampaignMapLogic.isAdjacentToTerritory(map, region(map, 'b'))).toBe(true);
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

describe('CampaignMapLogic.getPurchasePrice', () => {
	// price = 50 x remaining encounters x (1 + population / 10), less the Presence discount
	const priceable = (encounters: number, population: number) => {
		const r = createRegion('a');
		r.encounters = new Array(encounters).fill('');
		r.demographics.population = population;
		return r;
	};

	// The price doesn't depend on the map, so any map will do
	const buyer = (heroes: CombatantModel[] = [], stronghold: StructureModel[] = []) =>
		createGame(createMap([ 'a.' ]), 0, heroes, stronghold);

	const createGuildhall = (charges: number): StructureModel => ({
		id: 'guildhall',
		type: StructureType.Guildhall,
		name: 'Guildhall',
		description: '',
		position: { x: 0, y: 0 },
		level: 1,
		charges: charges
	});

	it('scales with the number of encounters left', () => {
		expect(CampaignMapLogic.getPurchasePrice(buyer(), priceable(1, 0))).toBe(50);
		expect(CampaignMapLogic.getPurchasePrice(buyer(), priceable(4, 0))).toBe(200);
	});

	it('scales with the population', () => {
		expect(CampaignMapLogic.getPurchasePrice(buyer(), priceable(1, 10))).toBe(100);
		expect(CampaignMapLogic.getPurchasePrice(buyer(), priceable(1, 20))).toBe(150);
	});

	it('gets cheaper as a region is fought through', () => {
		const full = CampaignMapLogic.getPurchasePrice(buyer(), priceable(6, 10));
		const partly = CampaignMapLogic.getPurchasePrice(buyer(), priceable(2, 10));
		expect(partly).toBeLessThan(full);
	});

	it('discounts 5% per rank of the best hero\'s Presence', () => {
		const r = priceable(4, 10);
		expect(CampaignMapLogic.getPurchasePrice(buyer(), r)).toBe(400);
		expect(CampaignMapLogic.getPurchasePrice(buyer([ createHero(2) ]), r)).toBe(360);
		// Only the most persuasive hero counts, not the sum of the party
		expect(CampaignMapLogic.getPurchasePrice(buyer([ createHero(2), createHero(4), createHero(1) ]), r)).toBe(320);
	});

	it('caps the Presence discount at half price', () => {
		const r = priceable(4, 10);
		expect(CampaignMapLogic.getPurchasePrice(buyer([ createHero(10) ]), r)).toBe(200);
		expect(CampaignMapLogic.getPurchasePrice(buyer([ createHero(30) ]), r)).toBe(200);
	});

	it('takes a quarter off for a charged Guildhall', () => {
		const r = priceable(4, 10);
		expect(CampaignMapLogic.getPurchasePrice(buyer([], [ createGuildhall(1) ]), r)).toBe(300);
	});

	it('ignores a Guildhall with no charges left', () => {
		const r = priceable(4, 10);
		expect(CampaignMapLogic.getPurchasePrice(buyer([], [ createGuildhall(0) ]), r)).toBe(400);
	});

	it('applies the Guildhall to what the negotiator left, not to the list price', () => {
		const r = priceable(4, 10);
		// 400, halved by Presence to 200, then a quarter off that - not 400 less 75%
		expect(CampaignMapLogic.getPurchasePrice(buyer([ createHero(10) ], [ createGuildhall(1) ]), r)).toBe(150);
	});

	it('costs nothing for a region with no encounters left', () => {
		expect(CampaignMapLogic.getPurchasePrice(buyer(), priceable(0, 10))).toBe(0);
	});
});

describe('CampaignMapLogic.canPurchaseRegion', () => {
	const buyable = (map: CampaignMapModel, id: string, encounters: number) => {
		const r = region(map, id);
		r.encounters = new Array(encounters).fill('');
		r.demographics.population = 0;
		return r;
	};

	it('allows buying an adjacent region you can afford', () => {
		const map = createMap([
			'ab',
			'a.'
		]);
		// 'b' borders the unclaimed square, and one encounter at population 0 costs 50
		expect(CampaignMapLogic.canPurchaseRegion(createGame(map, 50), buyable(map, 'b', 1))).toBe(true);
	});

	it('refuses a region you cannot afford', () => {
		const map = createMap([
			'ab',
			'a.'
		]);
		expect(CampaignMapLogic.canPurchaseRegion(createGame(map, 49), buyable(map, 'b', 1))).toBe(false);
	});

	it('refuses a region that does not border your land, however rich you are', () => {
		const map = createMap([
			'aaa',
			'aba',
			'aa.'
		]);
		expect(CampaignMapLogic.canPurchaseRegion(createGame(map, 100000), buyable(map, 'b', 1))).toBe(false);
	});

	it('lets a hero with Presence bring an unaffordable region into reach', () => {
		const map = createMap([
			'ab',
			'a.'
		]);
		const target = buyable(map, 'b', 4);
		expect(CampaignMapLogic.canPurchaseRegion(createGame(map, 180), target)).toBe(false);
		expect(CampaignMapLogic.canPurchaseRegion(createGame(map, 180, [ createHero(4) ]), target)).toBe(true);
	});
});

// On a hex grid stored in offset columns, only a square with all six neighbours present is inland.
// In a 3x3 grid that is the centre square alone, so 'b' below is the one landlocked region.
const landlocked = [
	'aaa',
	'aba',
	'aa.'
];

describe('CampaignMapLogic.isCoastal', () => {
	it('is true for a region on the edge of the island', () => {
		const map = createMap(landlocked);
		expect(CampaignMapLogic.isCoastal(map, region(map, 'a'))).toBe(true);
	});

	it('is false for a region with no square in open water', () => {
		const map = createMap(landlocked);
		expect(CampaignMapLogic.isCoastal(map, region(map, 'b'))).toBe(false);
	});

	it('is true if only part of the region reaches the sea', () => {
		// 'b' spans the centre and the edge; the edge square is enough
		const map = createMap([
			'aaa',
			'abb',
			'aa.'
		]);
		expect(CampaignMapLogic.isCoastal(map, region(map, 'b'))).toBe(true);
	});
});

describe('CampaignMapLogic.hasCoastalTerritory', () => {
	it('is true when your land reaches the sea', () => {
		expect(CampaignMapLogic.hasCoastalTerritory(createMap(landlocked))).toBe(true);
	});

	it('is false when your land is entirely inland', () => {
		expect(CampaignMapLogic.hasCoastalTerritory(createMap([
			'aaa',
			'a.a',
			'aaa'
		]))).toBe(false);
	});
});

describe('CampaignMapLogic.canReachRegionBySea', () => {
	// 'b' is coastal but has no border with the unclaimed squares
	const overseas = [
		'.ab',
		'.ab'
	];

	it('needs a Shipyard', () => {
		const map = createMap(overseas);
		expect(CampaignMapLogic.canReachRegionBySea(createGame(map, 0), region(map, 'b'))).toBe(false);
	});

	it('needs the Shipyard to have a charge', () => {
		const map = createMap(overseas);
		const game = createGame(map, 0, [], [ createShipyard(0) ]);
		expect(CampaignMapLogic.canReachRegionBySea(game, region(map, 'b'))).toBe(false);
	});

	it('carries you to a coastal region when the Shipyard is charged', () => {
		const map = createMap(overseas);
		const game = createGame(map, 0, [], [ createShipyard(1) ]);
		expect(CampaignMapLogic.canReachRegionBySea(game, region(map, 'b'))).toBe(true);
	});

	it('cannot land on a region with no coastline', () => {
		const map = createMap(landlocked);
		const game = createGame(map, 0, [], [ createShipyard(1) ]);
		expect(CampaignMapLogic.canReachRegionBySea(game, region(map, 'b'))).toBe(false);
	});

	it('cannot sail from land that never reaches the sea', () => {
		const map = createMap([
			'aaa',
			'a.a',
			'aaa'
		]);
		const game = createGame(map, 0, [], [ createShipyard(1) ]);
		expect(CampaignMapLogic.canReachRegionBySea(game, region(map, 'a'))).toBe(false);
	});
});

describe('CampaignMapLogic.canAttackRegion', () => {
	it('allows a region that borders your land, with no Shipyard', () => {
		const map = createMap([
			'ab',
			'a.'
		]);
		expect(CampaignMapLogic.canAttackRegion(createGame(map, 0), region(map, 'b'))).toBe(true);
	});

	it('refuses a distant region when you have no Shipyard', () => {
		const map = createMap([
			'.ab',
			'.ab'
		]);
		expect(CampaignMapLogic.canAttackRegion(createGame(map, 0), region(map, 'b'))).toBe(false);
	});

	it('allows a distant coastal region once a Shipyard is charged', () => {
		const map = createMap([
			'.ab',
			'.ab'
		]);
		const game = createGame(map, 0, [], [ createShipyard(1) ]);
		expect(CampaignMapLogic.canAttackRegion(game, region(map, 'b'))).toBe(true);
	});

	it('still refuses a distant region with no coastline, Shipyard or not', () => {
		const map = createMap(landlocked);
		const game = createGame(map, 0, [], [ createShipyard(1) ]);
		expect(CampaignMapLogic.canAttackRegion(game, region(map, 'b'))).toBe(false);
	});
});

describe('CampaignMapLogic.canPurchaseRegion by sea', () => {
	it('lets a Shipyard put an overseas region up for sale', () => {
		const map = createMap([
			'.ab',
			'.ab'
		]);
		const target = region(map, 'b');
		target.encounters = [ '' ];
		target.demographics.population = 0;

		expect(CampaignMapLogic.canPurchaseRegion(createGame(map, 1000), target)).toBe(false);
		expect(CampaignMapLogic.canPurchaseRegion(createGame(map, 1000, [], [ createShipyard(1) ]), target)).toBe(true);
	});
});
