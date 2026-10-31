import { describe, expect, it } from 'vitest';

import { GameCenterLogic } from './game-center-logic';

import type { GameModel } from '../../models/game';
import type { OptionsModel } from '../../models/options';

const options = (encountersWon: number, islandsConquered = 0, progress = {}) => ({
	gameCenter: {
		accessPoint: false,
		encountersWon,
		islandsConquered,
		buildingsBuilt: 0,
		buildingsUpgraded: 0,
		bossesKilled: 0,
		fullHealthEncounters: 0,
		outnumberedEncountersWon: 0,
		magicItemsBought: 0,
		itemsEnchanted: 0,
		highestHeroLevel: 0,
		highestMoney: 0,
		regionsBought: 0,
		regionsConquered: 0,
		oneHeroArmy: false,
		noOneLeftBehind: false,
		treasureHaul: false,
		wellEquipped: false,
		legendaryCompany: false,
		packRat: false,
		...progress
	}
}) as OptionsModel;
const game = (...levels: number[]) => ({ heroes: levels.map(level => ({ level })) }) as unknown as GameModel;
const percentFor = (id: string, g: GameModel | null, o: OptionsModel) => GameCenterLogic.getAchievementProgress(g, o).find(a => a.id === id)?.percent;

describe('GameCenterLogic', () => {
	it('reports nothing for a fresh player', () => {
		expect(GameCenterLogic.getAchievementProgress(null, options(0))).toEqual([]);
		expect(GameCenterLogic.getScores(null, options(0))).toEqual([]);
	});

	it('completes the first victory achievement on one win', () => {
		expect(percentFor(GameCenterLogic.achievements.firstVictory, null, options(1))).toBe(100);
	});

	it('tracks veteran progress and caps it at 100', () => {
		expect(percentFor(GameCenterLogic.achievements.veteran, null, options(5))).toBe(20);
		expect(percentFor(GameCenterLogic.achievements.veteran, null, options(80))).toBe(100);
	});

	it('uses the highest hero level', () => {
		expect(percentFor(GameCenterLogic.achievements.seasonedHero, game(1, 3), options(0))).toBe(60);
		expect(GameCenterLogic.getScores(game(1, 3), options(0))).toEqual([ { id: GameCenterLogic.leaderboards.highestHeroLevel, score: 3 } ]);
	});

	it('completes the island achievement once an island is conquered', () => {
		expect(percentFor(GameCenterLogic.achievements.islandConquered, null, options(0, 1))).toBe(100);
	});

	it('reports progress for all new event achievements', () => {
		const playerOptions = options(0, 0, {
			buildingsBuilt: 1,
			buildingsUpgraded: 1,
			bossesKilled: 1,
			fullHealthEncounters: 1,
			outnumberedEncountersWon: 1,
			magicItemsBought: 1,
			itemsEnchanted: 1,
			regionsBought: 1,
			regionsConquered: 1
		});
		const eventAchievements = [
			GameCenterLogic.achievements.buildingBuilt,
			GameCenterLogic.achievements.buildingUpgraded,
			GameCenterLogic.achievements.bossKilled,
			GameCenterLogic.achievements.fullHealthEncounter,
			GameCenterLogic.achievements.outnumberedEncounterWon,
			GameCenterLogic.achievements.magicItemBought,
			GameCenterLogic.achievements.itemEnchanted,
			GameCenterLogic.achievements.regionBought,
			GameCenterLogic.achievements.regionConquered
		];

		eventAchievements.forEach(id => expect(percentFor(id, null, playerOptions)).toBe(100));
	});

	it('reports each hero level milestone from the highest saved level', () => {
		const playerOptions = options(0, 0, { highestHeroLevel: 17 });

		expect(percentFor(GameCenterLogic.achievements.seasonedHero, null, playerOptions)).toBe(100);
		expect(percentFor(GameCenterLogic.achievements.heroLevel10, null, playerOptions)).toBe(100);
		expect(percentFor(GameCenterLogic.achievements.heroLevel15, null, playerOptions)).toBe(100);
		expect(percentFor(GameCenterLogic.achievements.heroLevel20, null, playerOptions)).toBe(85);
	});

	it('tracks progress toward Rich from the highest saved balance', () => {
		expect(percentFor(GameCenterLogic.achievements.rich, null, options(0, 0, { highestMoney: 500 }))).toBe(50);
		expect(percentFor(GameCenterLogic.achievements.rich, null, options(0, 0, { highestMoney: 1000 }))).toBe(100);
		expect(percentFor(GameCenterLogic.achievements.deepPockets, null, options(0, 0, { highestMoney: 2500 }))).toBe(50);
	});

	it('tracks progress toward Grand Architect and Campaign Veteran', () => {
		const playerOptions = options(0, 0, { buildingsBuilt: 3, regionsConquered: 2 });

		expect(percentFor(GameCenterLogic.achievements.grandArchitect, null, playerOptions)).toBe(60);
		expect(percentFor(GameCenterLogic.achievements.campaignVeteran, null, playerOptions)).toBe(40);
	});

	it('reports completed one-time achievements', () => {
		const playerOptions = options(0, 0, {
			oneHeroArmy: true,
			noOneLeftBehind: true,
			treasureHaul: true,
			wellEquipped: true,
			legendaryCompany: true,
			packRat: true
		});

		[
			GameCenterLogic.achievements.oneHeroArmy,
			GameCenterLogic.achievements.noOneLeftBehind,
			GameCenterLogic.achievements.treasureHaul,
			GameCenterLogic.achievements.wellEquipped,
			GameCenterLogic.achievements.legendaryCompany,
			GameCenterLogic.achievements.packRat
		].forEach(id => expect(percentFor(id, null, playerOptions)).toBe(100));
	});

	it('counts magic items across hero inventory and campaign stores', () => {
		const magicItem = { magic: true };
		const mundaneItem = { magic: false };
		const playerGame = {
			heroes: [
				{ id: 'hero-1', level: 5, items: [ magicItem, magicItem ], carried: [ magicItem ] },
				{ id: 'hero-2', level: 5, items: [ magicItem ], carried: [] },
				{ id: 'hero-3', level: 5, items: [], carried: [] },
				{ id: 'hero-4', level: 5, items: [], carried: [ mundaneItem ] }
			],
			items: [ magicItem ]
		} as unknown as GameModel;

		expect(GameCenterLogic.getOwnedMagicItemCount(playerGame)).toBe(5);
		expect(GameCenterLogic.hasPackRat(playerGame)).toBe(false);
		expect(GameCenterLogic.hasLegendaryCompany(playerGame)).toBe(true);
	});

	it('counts carried and equipped magic items for Pack Rat', () => {
		const magicItem = { magic: true };
		const playerGame = {
			heroes: [
				{ id: 'hero-1', items: [ magicItem, magicItem ], carried: [ magicItem, magicItem, magicItem ] }
			],
			items: []
		} as unknown as GameModel;

		expect(GameCenterLogic.hasPackRat(playerGame)).toBe(true);
	});
});
