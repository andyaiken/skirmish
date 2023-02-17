import { randomNumber } from '../utils/random';

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

export const getRandomSkill = (category: SkillCategoryType = SkillCategoryType.Any) => {
	const options = [];

	switch (category) {
		case SkillCategoryType.Any:
			options.push(SkillType.Brawl);
			options.push(SkillType.Perception);
			options.push(SkillType.Reactions);
			options.push(SkillType.Spellcasting);
			options.push(SkillType.Stealth);
			options.push(SkillType.Weapon);
			break;
		case SkillCategoryType.Physical:
			options.push(SkillType.Brawl);
			options.push(SkillType.Stealth);
			options.push(SkillType.Weapon);
			break;
		case SkillCategoryType.Mental:
			options.push(SkillType.Perception);
			options.push(SkillType.Reactions);
			options.push(SkillType.Spellcasting);
			break;
	}

	const n = randomNumber(options.length);
	return options[n];
};

export const getRandomSkillCategory = () => {
	const options = [
		SkillCategoryType.Physical,
		SkillCategoryType.Mental
	];

	const n = randomNumber(options.length);
	return options[n];
};
