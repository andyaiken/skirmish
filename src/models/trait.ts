import { randomNumber } from '../utils/random';

export enum TraitType {
	None = 'None',
	Any = '[choose one trait]',
	All = 'All traits',
	Endurance = 'Endurance',
	Resolve = 'Resolve',
	Speed = 'Speed'
}

export const getRandomTrait = () => {
	const options = [
		TraitType.Endurance,
		TraitType.Resolve,
		TraitType.Speed
	];

	const n = randomNumber(options.length);
	return options[n];
};
