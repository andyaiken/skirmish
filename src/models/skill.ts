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

export const getSkillCategory = (skill: SkillType) => {
	switch (skill) {
		case SkillType.All:
			return SkillCategoryType.All;
		case SkillType.Brawl:
		case SkillType.Stealth:
		case SkillType.Weapon:
			return SkillCategoryType.Physical;
		case SkillType.Perception:
		case SkillType.Reactions:
		case SkillType.Spellcasting:
			return SkillCategoryType.Mental;
	}

	return SkillCategoryType.None;
};
