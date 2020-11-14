export enum Trait {
	None = 'None',
	Any = 'Any trait',
	All = 'All traits',
	Endurance = 'Endurance',
	Resolve = 'Resolve',
	Speed = 'Speed'
}

export class TraitHelper {
	public static toText(trait: Trait) {
		return trait;
	}
}
