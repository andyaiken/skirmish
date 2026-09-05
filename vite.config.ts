import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	base: '/skirmish/',
	plugins: [ react() ],
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
