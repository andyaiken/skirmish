export enum AuraType {
	None = 'None',
	EaseMovement = 'Ease movement',
	PreventMovement = 'Prevent movement',
	AutomaticDamage = 'Automatic damage',
	AutomaticHealing = 'Automatic healing',
	DamageVulnerability = 'Damage vulnerability',
	DamageResistance = 'Damage resistance'
}

export enum BoonType {
	ExtraHero = 'Extra hero',
	ExtraXP = 'Extra XP',
	LevelUp = 'Level up',
	MagicItem = 'Magic item'
}

export enum CombatDataState {
	Standing = 'Stand',
	Prone = 'Prone',
	Unconscious = 'Unconscious',
	Dead = 'Dead'
}

export enum CombatantType {
	Hero = 'Hero',
	Monster = 'Monster'
}

export enum ConditionType {
	Health = 'Auto Damage',
	Damage = 'Damage Modifier',
	Movement = 'Movement',
	Skill = 'Skill',
	Trait = 'Trait'
}

export enum DamageCategoryType {
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

export enum EncounterMapSquareType {
	Clear = 'Clear',
	Obstructed = 'Obstructed'
}

export enum EncounterState {
	Active = 'Active',
	Won = 'Won',
	Defeated = 'Defeated'
}

export enum FeatureType {
	Trait = 'Trait',
	Skill = 'Skill',
	SkillCategory = 'Skill category',
	Proficiency = 'Proficiency',
	DamageBonus = 'Damage bonus',
	DamageCategoryTypeBonus = 'Damage category bonus',
	DamageResist = 'Damage resistance',
	DamageCategoryTypeResist = 'Damage category resistance',
	Aura = 'Aura'
}

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

export enum ItemLocationType {
	None = 'None',
	Head = 'Head',
	Neck = 'Neck',
	Body = 'Body',
	Feet = 'Feet',
	Hand = 'Hand',
	Ring = 'Ring'
}

export enum SkillCategoryType {
	None = 'None',
	Any = '[choose one skill category]',
	All = 'All skill categories',
	Physical = 'Physical',
	Mental = 'Mental'
}

export enum SkillType {
	None = 'None',
	Any = '[choose one skill]',
	All = 'All skills',
	Brawl = 'Brawl',
	Perception = 'Perception',
	Reactions = 'Reactions',
	Spellcasting = 'Spellcasting',
	Stealth = 'Stealth',
	Weapon = 'Weapon'
}

export enum TraitType {
	None = 'None',
	Any = '[choose one trait]',
	All = 'All traits',
	Endurance = 'Endurance',
	Resolve = 'Resolve',
	Speed = 'Speed'
}
