export interface OptionsModel {
	version: string;
	developer: boolean;
	showTips: boolean;
	reduceMotion: boolean;
	soundEffectsVolume: number;
	haptics: boolean;
	gameCenter: {
		accessPoint: boolean;
		encountersWon: number;
		islandsConquered: number;
		buildingsBuilt: number;
		buildingsUpgraded: number;
		bossesKilled: number;
		fullHealthEncounters: number;
		outnumberedEncountersWon: number;
		magicItemsBought: number;
		itemsEnchanted: number;
		highestHeroLevel: number;
		highestMoney: number;
		regionsBought: number;
		regionsConquered: number;
		oneHeroArmy: boolean;
		noOneLeftBehind: boolean;
		treasureHaul: boolean;
		wellEquipped: boolean;
		legendaryCompany: boolean;
		packRat: boolean;
	};
	packIDs: string[];
	renderer: string;
}
