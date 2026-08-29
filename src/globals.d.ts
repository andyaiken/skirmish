// Vite's client types cover .scss, .mp3 and images, but not .md; these are
// imported as URLs (see assetsInclude in vite.config.ts) and fetched at runtime.
declare module '*.md' {
	const src: string;
	export default src;
}
