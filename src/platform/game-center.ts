import { Capacitor, registerPlugin } from '@capacitor/core';

import { GameCenterLogic } from '../logic/game-center/game-center-logic';

import type { GameModel } from '../models/game';
import type { OptionsModel } from '../models/options';

interface SkirmishGameCenterPlugin {
	authenticate: () => Promise<void>;
	reportAchievements: (options: { achievements: { id: string, percent: number }[] }) => Promise<void>;
	submitScores: (options: { scores: { id: string, score: number }[] }) => Promise<void>;
	setAccessPointVisible: (options: { visible: boolean }) => Promise<void>;
	showDashboard: () => Promise<void>;
	addListener: (event: 'authenticationChanged', handler: (data: { authenticated: boolean }) => void) => Promise<{ remove: () => Promise<void> }>;
}

// Game Center exists only in the native shell, so every method here does nothing in a browser
export class GameCenter {
	private plugin = Capacitor.isNativePlatform() ? registerPlugin<SkirmishGameCenterPlugin>('SkirmishGameCenter') : null;

	authenticated = false;
	// Assigned by Main once it is mounted
	onAuthenticationChanged: (authenticated: boolean) => void = () => null;

	// What has already been sent, so that finishing an encounter doesn't resend everything
	private reported = new Map<string, number>();

	constructor(private onError: (ex: unknown) => void) {}

	isAvailable = () => this.plugin !== null;

	start = (options: OptionsModel) => {
		const plugin = this.plugin;
		if (!plugin) {
			return;
		}

		plugin.addListener('authenticationChanged', data => {
			this.authenticated = data.authenticated;
			if (!data.authenticated) {
				this.reported.clear();
			}
			this.setAccessPointVisible(options.gameCenter.accessPoint);
			this.onAuthenticationChanged(data.authenticated);
		}).catch(this.onError);

		plugin.authenticate().catch(this.onError);
	};

	setAccessPointVisible = (visible: boolean) => {
		this.plugin?.setAccessPointVisible({ visible: visible }).catch(this.onError);
	};

	showDashboard = () => {
		this.plugin?.showDashboard().catch(this.onError);
	};

	report = (game: GameModel | null, options: OptionsModel) => {
		if (!this.plugin || !this.authenticated) {
			return;
		}

		const achievements = GameCenterLogic.getAchievementProgress(game, options)
			.filter(a => this.reported.get(a.id) !== a.percent);
		if (achievements.length > 0) {
			this.plugin.reportAchievements({ achievements: achievements })
				.then(() => achievements.forEach(a => this.reported.set(a.id, a.percent)))
				.catch(this.onError);
		}

		const scores = GameCenterLogic.getScores(game, options)
			.filter(s => this.reported.get(s.id) !== s.score);
		if (scores.length > 0) {
			this.plugin.submitScores({ scores: scores })
				.then(() => scores.forEach(s => this.reported.set(s.id, s.score)))
				.catch(this.onError);
		}
	};
}
