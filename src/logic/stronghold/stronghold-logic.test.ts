import { describe, expect, it } from 'vitest';

import { StructureType } from '../../enums/structure-type';

import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';
import type { RegionModel } from '../../models/region';
import type { StructureModel } from '../../models/structure';

import { Collections } from '../../utils/collections/collections';

import { GameLogic } from '../game/game-logic';
import { StrongholdLogic } from './stronghold-logic';

const createStructure = (type: StructureType, charges = 1): StructureModel => ({
	id: type,
	type: type,
	name: type,
	description: '',
	position: { x: 0, y: 0 },
	level: 1,
	charges: charges
});

const createGame = (stronghold: StructureModel[] = []): GameModel => ({
	heroSlots: 0,
	heroes: [],
	items: [],
	boons: [],
	money: 0,
	map: { squares: [], regions: [] },
	stronghold: stronghold,
	encounter: null
});

const createRegion = (population: number): RegionModel => ({
	id: 'r',
	name: 'r',
	color: '',
	encounters: [],
	boon: null as unknown as RegionModel['boon'],
	demographics: { size: 3, population: population, terrain: '' }
});

const item = (kind: 'mundane' | 'potion' | 'magic') => ({
	magic: kind === 'magic',
	potion: kind === 'potion' ? {} : null
} as unknown as ItemModel);

describe('StrongholdLogic.canCharge', () => {
	it('treats the permanent structures as uncharged', () => {
		// An uncharged structure gets no demolish button on the stronghold page, which is what
		// stops a Monument's hero slot being banked and the structure sold back
		[ StructureType.Barracks, StructureType.Warehouse, StructureType.Monument, StructureType.CountingHouse ]
			.forEach(type => expect(StrongholdLogic.canCharge(createStructure(type)), type).toBe(false));
	});

	it('leaves the rest chargeable', () => {
		[ StructureType.Bazaar, StructureType.Guildhall, StructureType.Tavern, StructureType.Shipyard ]
			.forEach(type => expect(StrongholdLogic.canCharge(createStructure(type)), type).toBe(true));
	});
});

describe('StrongholdLogic.canBuild', () => {
	it('never offers the two structures the campaign starts you with', () => {
		[ StructureType.Barracks, StructureType.Warehouse ]
			.forEach(type => expect(StrongholdLogic.canBuild(createStructure(type)), type).toBe(false));
	});

	it('offers the permanent structures, which are uncharged but still worth buying', () => {
		// canBuild used to be inferred from canCharge, which made these two unbuyable
		[ StructureType.Monument, StructureType.CountingHouse ]
			.forEach(type => expect(StrongholdLogic.canBuild(createStructure(type)), type).toBe(true));
	});

	it('offers the charged structures too', () => {
		[ StructureType.Bazaar, StructureType.Tavern, StructureType.Guildhall, StructureType.Shipyard ]
			.forEach(type => expect(StrongholdLogic.canBuild(createStructure(type)), type).toBe(true));
	});
});

describe('StrongholdLogic.getPrice', () => {
	it('charges list price with no Bazaar', () => {
		const game = createGame();
		expect(StrongholdLogic.getPrice(game, 'mundane')).toBe(2);
		expect(StrongholdLogic.getPrice(game, 'potion')).toBe(20);
		expect(StrongholdLogic.getPrice(game, 'magic')).toBe(100);
		expect(StrongholdLogic.getPrice(game, 'structure')).toBe(50);
	});

	it('takes a quarter off everything with a Bazaar', () => {
		const game = createGame([ createStructure(StructureType.Bazaar) ]);
		expect(StrongholdLogic.getPrice(game, 'potion')).toBe(15);
		expect(StrongholdLogic.getPrice(game, 'magic')).toBe(75);
		expect(StrongholdLogic.getPrice(game, 'structure')).toBe(37);
	});

	it('never drops a price below 1', () => {
		const game = createGame([ createStructure(StructureType.Bazaar) ]);
		expect(StrongholdLogic.getPrice(game, 'mundane')).toBe(1);
	});

	it('does not stack two Bazaars', () => {
		const one = createGame([ createStructure(StructureType.Bazaar) ]);
		const two = createGame([ createStructure(StructureType.Bazaar), createStructure(StructureType.Bazaar) ]);
		expect(StrongholdLogic.getPrice(two, 'magic')).toBe(StrongholdLogic.getPrice(one, 'magic'));
	});

	it('discounts regardless of charges, because the Bazaar has none', () => {
		const game = createGame([ createStructure(StructureType.Bazaar, 0) ]);
		expect(StrongholdLogic.getPrice(game, 'magic')).toBe(75);
	});
});

describe('StrongholdLogic.getItemPrice', () => {
	it('prices an item by what it is', () => {
		const game = createGame();
		expect(StrongholdLogic.getItemPrice(game, item('mundane'))).toBe(2);
		expect(StrongholdLogic.getItemPrice(game, item('potion'))).toBe(20);
		expect(StrongholdLogic.getItemPrice(game, item('magic'))).toBe(100);
	});
});

describe('StrongholdLogic.addStructure', () => {
	it('adds a hero slot for a Monument', () => {
		const game = createGame();
		StrongholdLogic.addStructure(game, createStructure(StructureType.Monument));
		expect(game.heroSlots).toBe(1);
	});

	it('adds no hero slot for anything else', () => {
		const game = createGame();
		StrongholdLogic.addStructure(game, createStructure(StructureType.Bazaar));
		expect(game.heroSlots).toBe(0);
	});

	it('gives a chargeable structure its charges, and a permanent one none', () => {
		const game = createGame();
		StrongholdLogic.addStructure(game, createStructure(StructureType.Tavern, 0));
		StrongholdLogic.addStructure(game, createStructure(StructureType.Monument, 0));

		const tavern = game.stronghold.find(s => s.type === StructureType.Tavern) as StructureModel;
		const monument = game.stronghold.find(s => s.type === StructureType.Monument) as StructureModel;
		expect(tavern.charges).toBe(1);
		expect(monument.charges).toBe(0);
	});
});

describe('StrongholdLogic.getConquestIncome', () => {
	it('pays nothing without a Counting House', () => {
		expect(StrongholdLogic.getConquestIncome(createGame(), createRegion(12))).toBe(0);
	});

	it('pays out by the region\'s population', () => {
		const game = createGame([ createStructure(StructureType.CountingHouse) ]);
		expect(StrongholdLogic.getConquestIncome(game, createRegion(12))).toBe(120);
		expect(StrongholdLogic.getConquestIncome(game, createRegion(5))).toBe(50);
	});

	it('pays regardless of charges, because the Counting House has none', () => {
		const game = createGame([ createStructure(StructureType.CountingHouse, 0) ]);
		expect(StrongholdLogic.getConquestIncome(game, createRegion(10))).toBe(100);
	});
});

describe('the buildable structure deck', () => {
	const buildable = (packIDs: string[]) =>
		GameLogic.getStructureDeck(packIDs).filter(s => StrongholdLogic.canBuild(s)).map(s => s.type);

	it('offers every The Going Rate structure', () => {
		const deck = buildable([ 'pack-the-going-rate' ]);
		[ StructureType.Bazaar, StructureType.CountingHouse, StructureType.Guildhall, StructureType.Monument, StructureType.Tavern ]
			.forEach(type => expect(deck, type).toContain(type));
	});

	it('never offers the starting structures', () => {
		const deck = buildable([]);
		expect(deck).not.toContain(StructureType.Barracks);
		expect(deck).not.toContain(StructureType.Warehouse);
	});
});

describe('drawing structures for sale', () => {
	it('can offer every buildable structure, including the permanent ones', () => {
		// Mirrors what the buy-structure modal does, to prove nothing in the deck is unreachable
		const deck = GameLogic.getStructureDeck([ 'pack-deep-water', 'pack-the-going-rate' ])
			.filter(s => StrongholdLogic.canBuild(s));

		const drawn = new Set<string>();
		for (let n = 0; n < 2000; ++n) {
			drawn.add(Collections.draw(deck).type);
		}

		deck.forEach(s => expect([ ...drawn ], s.name).toContain(s.type));
	});
});
