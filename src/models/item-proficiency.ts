import { randomNumber } from '../utils/random';

export enum ItemProficiencyType {
	None = 'None',
	Any = '[choose one proficiency]',
	MilitaryWeapons = 'Military weapons',
	LargeWeapons = 'Large weapons',
	PairedWeapons = 'Paired weapons',
	RangedWeapons = 'Ranged weapons',
	PowderWeapons = 'Powder weapons',
	Implements = 'Implements',
	LightArmor = 'Light armor',
	HeavyArmor = 'Heavy armor',
	Shields = 'Shields'
}

export const getRandomProficiency = () => {
	const options = [
		ItemProficiencyType.MilitaryWeapons,
		ItemProficiencyType.LargeWeapons,
		ItemProficiencyType.PairedWeapons,
		ItemProficiencyType.RangedWeapons,
		ItemProficiencyType.PowderWeapons,
		ItemProficiencyType.Implements,
		ItemProficiencyType.LightArmor,
		ItemProficiencyType.HeavyArmor,
		ItemProficiencyType.Shields
	];

	const n = randomNumber(options.length);
	return options[n];
};
