import { describe, expect, it } from 'vitest';

import { BoonType } from '../../enums/boon-type';
import { CombatantType } from '../../enums/combatant-type';
import { StructureType } from '../../enums/structure-type';

import type { CampaignMapModel } from '../../models/campaign-map';
import type { CombatantModel } from '../../models/combatant';
import type { EncounterModel } from '../../models/encounter';
import type { GameModel } from '../../models/game';
import type { RegionModel } from '../../models/region';
import type { StructureModel } from '../../models/structure';

import { CampaignLogic } from './campaign-logic';
import { Factory } from '../factory/factory';

const createRegion = (encounters: string[] = []): RegionModel => ({
	id: 'region',
	name: 'Region',
	color: '',
	encounters: encounters,
	boon: { id: 'boon', type: BoonType.Money, data: 1 },
	demographics: { size: 1, population: 5, terrain: '' }
});

const createMap = (region: RegionModel): CampaignMapModel => ({
	squares: [
		{ x: 0, y: 0, regionID: '' },
		{ x: 1, y: 0, regionID: region.id }
	],
	regions: [ region ]
});

const createStructure = (type: StructureType, charges: number): StructureModel => ({
	id: type,
	type: type,
	name: type,
	description: '',
	position: { x: 0, y: 0 },
	level: 1,
	charges: charges
});

const createGame = (region: RegionModel, heroes: CombatantModel[] = [], money = 0): GameModel => ({
	heroSlots: 0,
	heroes: heroes,
	items: [],
	boons: [],
	money: money,
	map: createMap(region),
	stronghold: [],
	encounter: null
});

const createEncounter = (heroes: CombatantModel[] = []): EncounterModel => ({
	regionID: 'region',
	packIDs: [],
	round: 0,
	combatants: heroes,
	loot: [],
	traps: [],
	mapSquares: [],
	log: []
});

describe('CampaignLogic.startEncounter', () => {
	it('removes selected heroes from the campaign roster, resets them, and starts the encounter', () => {
		const region = createRegion();
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.combat.damage = 4;
		const game = createGame(region, [ hero ]);
		let generatedWith: CombatantModel[] = [];

		CampaignLogic.startEncounter(game, region, [ hero ], 0, 0, [ 'core' ], true, (_region, heroes) => {
			generatedWith = heroes;
			return createEncounter(heroes);
		});

		expect(game.heroes).toEqual([]);
		expect(generatedWith[0].combat.damage).toBe(0);
		expect(game.encounter?.combatants).toEqual(generatedWith);
	});

	it('spends a Shipyard charge only for non-adjacent travel outside developer mode', () => {
		const region = createRegion();
		const game = createGame(region);
		game.map.squares[0].regionID = 'other';
		game.stronghold.push(createStructure(StructureType.Shipyard, 1));

		CampaignLogic.startEncounter(game, region, [], 0, 0, [], false, () => createEncounter());

		expect(game.stronghold[0].charges).toBe(0);
	});

	it('applies and spends encounter benefits and detriments', () => {
		const region = createRegion();
		const hero = Factory.createCombatant(CombatantType.Hero);
		const monster = Factory.createCombatant(CombatantType.Monster);
		const game = createGame(region, [ hero ]);
		game.stronghold.push(createStructure(StructureType.Temple, 1));
		game.stronghold.push(createStructure(StructureType.Intelligencer, 1));

		CampaignLogic.startEncounter(game, region, [ hero ], 1, 1, [], false, () => createEncounter([ hero, monster ]));

		expect(hero.combat.conditions).toHaveLength(1);
		expect(monster.combat.conditions).toHaveLength(1);
		expect(game.stronghold.map(structure => structure.charges)).toEqual([ 0, 0 ]);
	});
});

describe('CampaignLogic.conquerRegion', () => {
	it('resolves every encounter, collects their loot, and awards conquest benefits', () => {
		const region = createRegion([ 'one', 'two' ]);
		const hero = Factory.createCombatant(CombatantType.Hero);
		const game = createGame(region, [ hero ]);
		game.stronghold.push(createStructure(StructureType.CountingHouse, 0));
		let generatedEncounters = 0;

		CampaignLogic.conquerRegion(game, region, [], () => {
			generatedEncounters += 1;
			const encounter = createEncounter();
			encounter.loot.push({
				id: `loot-${generatedEncounters}`,
				items: [],
				money: 10,
				position: { x: 0, y: 0 }
			});
			return encounter;
		});

		expect(generatedEncounters).toBe(2);
		expect(region.encounters).toEqual([]);
		expect(game.money).toBe(70);
		expect(hero.xp).toBe(2);
		expect(game.heroSlots).toBe(1);
		expect(game.boons).toContain(region.boon);
		expect(game.map.squares.every(square => square.regionID === '')).toBe(true);
	});
});

describe('CampaignLogic.purchaseRegion', () => {
	it('purchases a region and grants a slot, boon, and income without combat XP', () => {
		const region = createRegion([ 'one' ]);
		const game = createGame(region, [ Factory.createCombatant(CombatantType.Hero) ], 1000);
		const otherRegion = createRegion();
		otherRegion.id = 'other';
		game.map.squares.push({ x: 2, y: 0, regionID: otherRegion.id });
		game.map.regions.push(otherRegion);
		game.stronghold.push(createStructure(StructureType.CountingHouse, 0));
		game.stronghold.push(createStructure(StructureType.Guildhall, 1));

		const victory = CampaignLogic.purchaseRegion(game, region, false);

		expect(victory).toBe(false);
		expect(game.money).toBe(995);
		expect(game.heroSlots).toBe(1);
		expect(game.boons).toContain(region.boon);
		expect(game.heroes[0].xp).toBe(0);
		expect(game.stronghold.find(s => s.type === StructureType.Guildhall)?.charges).toBe(0);
	});

	it('reports when the purchased region completes the campaign', () => {
		const region = createRegion();
		const game = createGame(region, [], 1000);

		const victory = CampaignLogic.purchaseRegion(game, region, false);

		expect(victory).toBe(true);
		expect(game.heroSlots).toBe(0);
		expect(game.boons).toHaveLength(0);
	});
});
