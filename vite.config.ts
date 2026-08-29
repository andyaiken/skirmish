import { defineConfig } from 'vite';
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
	}
});
