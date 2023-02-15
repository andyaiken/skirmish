export enum SkillCategory {
	None = 'None',
	Any = '[choose one skill category]',
	All = 'All skill categories',
	Physical = 'Physical',
	Mental = 'Mental'
}

export enum Skill {
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

export const getSkillCategory = (skill: Skill) => {
	switch (skill) {
		case Skill.All:
			return SkillCategory.All;
		case Skill.Brawl:
		case Skill.Stealth:
		case Skill.Weapon:
			return SkillCategory.Physical;
		case Skill.Perception:
		case Skill.Reactions:
		case Skill.Spellcasting:
			return SkillCategory.Mental;
	}

	return SkillCategory.None;
};
