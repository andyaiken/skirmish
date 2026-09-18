import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.andyaiken.skirmish',
	appName: 'Skirmish',
	// Matches the Vite outDir; `npx cap copy` reads the built app from here.
	webDir: 'build',
	ios: {
		// The Xcode target and scheme are named after the game; Capacitor assumes 'App' unless told.
		// The project, workspace and ios/App folders keep that name, which the CLI hardcodes.
		scheme: 'Skirmish',
		// Matches --control in index.scss. The webview is white until the app's own
		// stylesheet applies, which shows as a flash between the launch screen and the
		// board on a cold start; painting the webview itself removes the gap.
		backgroundColor: '#f0f0f0',
		// The app manages its own scrolling inside .skirmish, so the webview's
		// scroll view only contributes rubber-banding when a drag runs past a card
		// list or the map edge.
		scrollEnabled: false,
		// The layout handles the safe area itself (see #root in index.scss), so the
		// webview must not also shift content around under the status bar.
		contentInset: 'never',
		// The game is wholly offline; nothing should be loading over the network.
		limitsNavigationsToAppBoundDomains: true
	},
	plugins: {
		SystemBars: {
			// The game fills the screen: no clock or battery across the top, and the home
			// indicator fades out while playing. UIStatusBarHidden in Info.plist does the same
			// for the launch screen, before this takes effect.
			hidden: true
		}
	}
};

export default config;
