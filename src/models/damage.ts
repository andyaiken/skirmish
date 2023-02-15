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
