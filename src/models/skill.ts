export enum SkillCategory {
	None = 'None',
	Any = 'Any skill category',
	All = 'All skill categories',
	Physical = 'Physical',
	Mental = 'Mental'
}

export enum Skill {
	None = 'None',
	Any = 'Any skill',
	All = 'All skills',
	Athletics = 'Athletics',
	Brawl = 'Brawl',
	Perception = 'Perception',
	Reactions = 'Reactions',
	Spellcasting = 'Spellcasting',
	Stealth = 'Stealth',
	Weapon = 'Weapon'
}

export class SkillHelper {
	public static getCategory(skill: Skill) {
		switch (skill) {
			case Skill.All:
				return SkillCategory.All;
			case Skill.Athletics:
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
	}
}
