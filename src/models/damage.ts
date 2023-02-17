import { randomNumber } from '../utils/random';

export enum DamageCategory {
	None = 'None',
	Any = '[choose one damage category]',
	All = 'All damage categories',
	Physical = 'Physical',
	Energy = 'Energy',
	Corruption = 'Corruption'
}

export enum DamageType {
	None = 'None',
	Any = '[choose one damage type]',
	All = 'All damage types',
	Acid = 'Acid',
	Edged = 'Edged',
	Impact = 'Impact',
	Piercing = 'Piercing',
	Cold = 'Cold',
	Electricity = 'Electricity',
	Fire = 'Fire',
	Light = 'Light',
	Sonic = 'Sonic',
	Decay = 'Decay',
	Poison = 'Poison',
	Psychic = 'Psychic'
}

export const getDamageCategory = (type: DamageType) => {
	switch (type) {
		case DamageType.All:
			return DamageCategory.All;
		case DamageType.Acid:
		case DamageType.Edged:
		case DamageType.Impact:
		case DamageType.Piercing:
			return DamageCategory.Physical;
		case DamageType.Cold:
		case DamageType.Electricity:
		case DamageType.Fire:
		case DamageType.Light:
		case DamageType.Sonic:
			return DamageCategory.Energy;
		case DamageType.Decay:
		case DamageType.Poison:
		case DamageType.Psychic:
			return DamageCategory.Corruption;
	}

	return DamageCategory.None;
};

export const getRandomDamageType = (category: DamageCategory = DamageCategory.Any) => {
	const options = [];

	switch (category) {
		case DamageCategory.Any:
			options.push(DamageType.Acid);
			options.push(DamageType.Cold);
			options.push(DamageType.Decay);
			options.push(DamageType.Edged);
			options.push(DamageType.Electricity);
			options.push(DamageType.Fire);
			options.push(DamageType.Impact);
			options.push(DamageType.Light);
			options.push(DamageType.Piercing);
			options.push(DamageType.Poison);
			options.push(DamageType.Psychic);
			options.push(DamageType.Sonic);
			break;
		case DamageCategory.Physical:
			options.push(DamageType.Acid);
			options.push(DamageType.Edged);
			options.push(DamageType.Impact);
			options.push(DamageType.Piercing);
			break;
		case DamageCategory.Energy:
			options.push(DamageType.Cold);
			options.push(DamageType.Electricity);
			options.push(DamageType.Fire);
			options.push(DamageType.Light);
			options.push(DamageType.Sonic);
			break;
		case DamageCategory.Corruption:
			options.push(DamageType.Decay);
			options.push(DamageType.Poison);
			options.push(DamageType.Psychic);
			break;
	}

	const n = randomNumber(options.length);
	return options[n];
};

export const getRandomDamageCategory = () => {
	const options = [
		DamageCategory.Physical,
		DamageCategory.Energy,
		DamageCategory.Corruption
	];

	const n = randomNumber(options.length);
	return options[n];
};
