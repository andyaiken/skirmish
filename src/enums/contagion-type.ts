// A contagious condition spreads from whoever is carrying it, so these are read relative to the
// carrier rather than to whoever originally applied the condition
export enum ContagionType {
	None = 'none',
	All = 'all',
	Allies = 'allies',
	Enemies = 'enemies'
}
