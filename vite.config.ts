import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	base: '/skirmish/',
	plugins: [
		react(),
		VitePWA({
			// The app asks before it updates rather than swapping the bundle out underneath
			// a campaign in progress; main.tsx handles the prompt.
			registerType: 'prompt',
			manifest: {
				name: 'Skirmish',
				short_name: 'Skirmish',
				// Pinned rather than left to default to start_url, so that changing the
				// start page later does not read as a different app to an installed client.
				id: '/skirmish/',
				description: 'A single-player skirmish wargame and campaign manager.',
				// Both of these have to match the base above; on a project page the app
				// lives under a subpath, and a scope of '/' would not contain it.
				start_url: '/skirmish/',
				scope: '/skirmish/',
				display: 'standalone',
				orientation: 'any',
				background_color: '#ffffff',
				theme_color: '#3caaff',
				// Only a wide screenshot, because the app does not lay out at phone sizes yet.
				// Offering this iPad shot as the mobile one would advertise an experience
				// that is not there; DevTools will keep warning about the missing narrow
				// screenshot until the app supports those sizes.
				screenshots: [
					{
						src: 'island.png',
						sizes: '2732x2047',
						type: 'image/png',
						form_factor: 'wide',
						label: 'The island map, where a campaign is fought region by region'
					}
				],
				icons: [
					{ src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
					{ src: 'favicon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
					{ src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				]
			},
			workbox: {
				// The rules documents and the sound effect are emitted as separate assets and
				// fetched at runtime, so they have to be named here; the default globs cover
				// only the code, styles and images, which would leave both broken offline.
				globPatterns: [ '**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,md,mp3}' ],
				// The screenshot is only ever read by the browser's install prompt, so keeping
				// it out of the precache saves every player 1.3MB of storage they never use.
				globIgnores: [ 'island.png' ],
				// The battle maps and pack data make for a large bundle; the default 2MB cap
				// would silently drop the main chunk from the precache.
				maximumFileSizeToCacheInBytes: 8 * 1024 * 1024
			}
		})
	],
	// The rules documents are imported as URLs and fetched at runtime; Vite does
	// not treat .md as an asset by default, so opt it in to keep that behaviour.
	assetsInclude: [ '**/*.md' ],
	build: {
		outDir: 'build',
		// Keep the rules documents as separate files rather than inlining the
		// smaller ones into the bundle, so they are only fetched when opened.
		assetsInlineLimit: (filePath: string) => filePath.endsWith('.md') ? false : undefined
	},
	server: {
		open: true
	},
	test: {
		// The logic classes are static functions over plain data, so the default
		// node environment is enough; nothing under test touches the DOM.
		environment: 'node',
		include: [ 'src/**/*.test.ts' ],
		// The encounter and map generators build a whole encounter per assertion. That is fast now
		// that the pack data is built once rather than per lookup, but they are still the slowest
		// tests here and they run in parallel with everything else, so the default 5s was tight
		// enough to fail intermittently on a loaded machine rather than on anything being wrong.
		testTimeout: 15000
	}
});
