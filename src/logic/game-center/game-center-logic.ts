import { CombatantType } from '../../enums/combatant-type';

import type { CombatantModel } from '../../models/combatant';
import type { GameModel } from '../../models/game';
import type { OptionsModel } from '../../models/options';

export interface AchievementProgress {
	id: string;
	percent: number;
}

export interface LeaderboardScore {
	id: string;
	score: number;
}

export class GameCenterLogic {
	// These must match the identifiers created in App Store Connect
	static achievements = {
		firstVictory: 'com.andyaiken.skirmish.achievement.first_victory',
		veteran: 'com.andyaiken.skirmish.achievement.veteran',
		seasonedHero: 'com.andyaiken.skirmish.achievement.seasoned_hero',
		islandConquered: 'com.andyaiken.skirmish.achievement.island_conquered',
		buildingBuilt: 'com.andyaiken.skirmish.achievement.building_built',
		buildingUpgraded: 'com.andyaiken.skirmish.achievement.building_upgraded',
		bossKilled: 'com.andyaiken.skirmish.achievement.boss_killed',
		fullHealthEncounter: 'com.andyaiken.skirmish.achievement.full_health_encounter',
		outnumberedEncounterWon: 'com.andyaiken.skirmish.achievement.outnumbered_encounter_won',
		magicItemBought: 'com.andyaiken.skirmish.achievement.magic_item_bought',
		itemEnchanted: 'com.andyaiken.skirmish.achievement.item_enchanted',
		heroLevel10: 'com.andyaiken.skirmish.achievement.hero_level_10',
		heroLevel15: 'com.andyaiken.skirmish.achievement.hero_level_15',
		heroLevel20: 'com.andyaiken.skirmish.achievement.hero_level_20',
		regionBought: 'com.andyaiken.skirmish.achievement.region_bought',
		regionConquered: 'com.andyaiken.skirmish.achievement.region_conquered',
		rich: 'com.andyaiken.skirmish.achievement.rich',
		oneHeroArmy: 'com.andyaiken.skirmish.achievement.one_hero_army',
		noOneLeftBehind: 'com.andyaiken.skirmish.achievement.no_one_left_behind',
		treasureHaul: 'com.andyaiken.skirmish.achievement.treasure_haul',
		wellEquipped: 'com.andyaiken.skirmish.achievement.well_equipped',
		grandArchitect: 'com.andyaiken.skirmish.achievement.grand_architect',
		campaignVeteran: 'com.andyaiken.skirmish.achievement.campaign_veteran',
		legendaryCompany: 'com.andyaiken.skirmish.achievement.legendary_company',
		deepPockets: 'com.andyaiken.skirmish.achievement.deep_pockets',
		packRat: 'com.andyaiken.skirmish.achievement.pack_rat'
	};

	static leaderboards = {
		encountersWon: 'com.andyaiken.skirmish.leaderboard.encounters_won',
		highestHeroLevel: 'com.andyaiken.skirmish.leaderboard.highest_hero_level'
	};

	static veteranVictories = 25;
	static veteranRegions = 10;
	static seasonedHeroLevel = 5;
	static heroLevel10 = 10;
	static heroLevel15 = 15;
	static heroLevel20 = 20;
	static richMoney = 1000;
	static deepPocketsMoney = 5000;
	static architectBuildings = 10;
	static magicItemsForPackRat = 5;
	static magicItemsForWellEquipped = 10;
	static heroesForLegendaryCompany = 5;
	static legendaryHeroLevel = 20;

	static getPlayerHeroes = (game: GameModel | null): CombatantModel[] => {
		const heroes = [
			...(game?.heroes ?? []),
			...(game?.encounter?.combatants.filter(c => (c.type === CombatantType.Hero) && (c.faction === CombatantType.Hero)) ?? [])
		];
		return [ ...new Map(heroes.map(hero => [ hero.id, hero ])).values() ];
	};

	static getOwnedMagicItemCount = (game: GameModel | null) => {
		const inventory = [
			...(game?.items ?? []),
			...GameCenterLogic.getPlayerHeroes(game).flatMap(hero => [ ...hero.items, ...hero.carried ])
		];
		return inventory.filter(item => item.magic).length;
	};

	static hasPackRat = (game: GameModel | null) => {
		return GameCenterLogic.getPlayerHeroes(game)
			.some(hero => [ ...hero.items, ...hero.carried ].filter(item => item.magic).length >= GameCenterLogic.magicItemsForPackRat);
	};

	static hasLegendaryCompany = (game: GameModel | null) => {
		return GameCenterLogic.getPlayerHeroes(game)
			.filter(hero => hero.level >= GameCenterLogic.legendaryHeroLevel).length >= GameCenterLogic.heroesForLegendaryCompany;
	};

	static getHighestHeroLevel = (game: GameModel | null) => {
		return Math.max(0, ...(game?.heroes ?? []).map(h => h.level));
	};

	// Progress as it stands right now. Game Center keeps the best it has seen, so there is no
	// need to work out what changed.
	static getAchievementProgress = (game: GameModel | null, options: OptionsModel): AchievementProgress[] => {
		const percent = (value: number, target: number) => Math.min(100, Math.floor((value / target) * 100));
		const highestHeroLevel = Math.max(GameCenterLogic.getHighestHeroLevel(game), options.gameCenter.highestHeroLevel);
		const hasProgress = (value: boolean) => value ? 100 : 0;

		return [
			{ id: GameCenterLogic.achievements.firstVictory, percent: percent(options.gameCenter.encountersWon, 1) },
			{ id: GameCenterLogic.achievements.veteran, percent: percent(options.gameCenter.encountersWon, GameCenterLogic.veteranVictories) },
			{ id: GameCenterLogic.achievements.seasonedHero, percent: percent(highestHeroLevel, GameCenterLogic.seasonedHeroLevel) },
			{ id: GameCenterLogic.achievements.islandConquered, percent: percent(options.gameCenter.islandsConquered, 1) },
			{ id: GameCenterLogic.achievements.buildingBuilt, percent: percent(options.gameCenter.buildingsBuilt, 1) },
			{ id: GameCenterLogic.achievements.grandArchitect, percent: percent(options.gameCenter.buildingsBuilt, GameCenterLogic.architectBuildings) },
			{ id: GameCenterLogic.achievements.buildingUpgraded, percent: percent(options.gameCenter.buildingsUpgraded, 1) },
			{ id: GameCenterLogic.achievements.bossKilled, percent: percent(options.gameCenter.bossesKilled, 1) },
			{ id: GameCenterLogic.achievements.fullHealthEncounter, percent: percent(options.gameCenter.fullHealthEncounters, 1) },
			{ id: GameCenterLogic.achievements.outnumberedEncounterWon, percent: percent(options.gameCenter.outnumberedEncountersWon, 1) },
			{ id: GameCenterLogic.achievements.magicItemBought, percent: percent(options.gameCenter.magicItemsBought, 1) },
			{ id: GameCenterLogic.achievements.itemEnchanted, percent: percent(options.gameCenter.itemsEnchanted, 1) },
			{ id: GameCenterLogic.achievements.heroLevel10, percent: percent(highestHeroLevel, GameCenterLogic.heroLevel10) },
			{ id: GameCenterLogic.achievements.heroLevel15, percent: percent(highestHeroLevel, GameCenterLogic.heroLevel15) },
			{ id: GameCenterLogic.achievements.heroLevel20, percent: percent(highestHeroLevel, GameCenterLogic.heroLevel20) },
			{ id: GameCenterLogic.achievements.regionBought, percent: percent(options.gameCenter.regionsBought, 1) },
			{ id: GameCenterLogic.achievements.regionConquered, percent: percent(options.gameCenter.regionsConquered, 1) },
			{ id: GameCenterLogic.achievements.campaignVeteran, percent: percent(options.gameCenter.regionsConquered, GameCenterLogic.veteranRegions) },
			{ id: GameCenterLogic.achievements.rich, percent: percent(options.gameCenter.highestMoney, GameCenterLogic.richMoney) },
			{ id: GameCenterLogic.achievements.deepPockets, percent: percent(options.gameCenter.highestMoney, GameCenterLogic.deepPocketsMoney) },
			{ id: GameCenterLogic.achievements.oneHeroArmy, percent: hasProgress(options.gameCenter.oneHeroArmy) },
			{ id: GameCenterLogic.achievements.noOneLeftBehind, percent: hasProgress(options.gameCenter.noOneLeftBehind) },
			{ id: GameCenterLogic.achievements.treasureHaul, percent: hasProgress(options.gameCenter.treasureHaul) },
			{ id: GameCenterLogic.achievements.wellEquipped, percent: hasProgress(options.gameCenter.wellEquipped) },
			{ id: GameCenterLogic.achievements.legendaryCompany, percent: hasProgress(options.gameCenter.legendaryCompany) },
			{ id: GameCenterLogic.achievements.packRat, percent: hasProgress(options.gameCenter.packRat) }
		].filter(a => a.percent > 0);
	};

	static getScores = (game: GameModel | null, options: OptionsModel): LeaderboardScore[] => {
		return [
			{ id: GameCenterLogic.leaderboards.encountersWon, score: options.gameCenter.encountersWon },
			{ id: GameCenterLogic.leaderboards.highestHeroLevel, score: GameCenterLogic.getHighestHeroLevel(game) }
		].filter(s => s.score > 0);
	};
}
