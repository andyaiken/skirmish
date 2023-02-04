export enum Trait {
	None = 'None',
	Any = 'Any trait',
	All = 'All traits',
	Endurance = 'Endurance',
	Resolve = 'Resolve',
	Speed = 'Speed'
}

export const toText = (trait: Trait) => {
	return trait;
}
