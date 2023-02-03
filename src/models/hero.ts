import { guid } from '../utils/utils';
import { Action, ActionHelper } from './action';
import { BackgroundHelper } from './background';
import { Feature, FeatureHelper, FeatureType } from './feature';
import { Item } from './item';
import { Proficiency } from './proficiency';
import { RoleHelper } from './role';
import { Skill, SkillCategory, SkillHelper } from './skill';
import { SpeciesHelper } from './species';
import { Trait } from './trait';

export interface Hero {
	id: string;
	name: string;

	speciesID: string;
	roleID: string;
	backgroundID: string;

	level: number;
	xp: number;

	features: Feature[];
	items: Item[];
}

export interface Monster {
	id: string;
	name: string;

	level: number;
	size: number;

	features: Feature[];
	actions: Action[];
	items: Item[];
}

export class HeroHelper {
	public static createHero(): Hero {
		return {
			id: guid(),
			name: '',
			speciesID: '',
			roleID: '',
			backgroundID: '',
			level: 1,
			xp: 0,
			features: [],
			items: []
		};
	}

	public static createMonster(): Monster {
		return {
			id: guid(),
			name: '',
			level: 1,
			size: 1,
			features: [],
			actions: [],
			items: []
		};
	}

	public static featureDeck(hero: Hero) {
		const s = SpeciesHelper.getSpecies(hero.speciesID);
		const r = RoleHelper.getRole(hero.roleID);
		const b = BackgroundHelper.getBackground(hero.backgroundID);
		return FeatureHelper.universalFeatures
			.concat(s ? s.features : [])
			.concat(r ? r.features : [])
			.concat(b ? b.features : []);
	}

	public static actionDeck(hero: Hero | Monster) {
		let list: Action[] = ([] as Action[]).concat(ActionHelper.universalActions);

		if ((hero as Hero).roleID) {
			// This is a hero; get actions from the species, role, and background
			const s = SpeciesHelper.getSpecies((hero as Hero).speciesID);
			list = list.concat(s ? s.actions : []);
			const r = RoleHelper.getRole((hero as Hero).roleID);
			list = list.concat(r ? r.actions : []);
			const b = BackgroundHelper.getBackground((hero as Hero).backgroundID);
			list = list.concat(b ? b.actions : []);
		}

		if ((hero as Monster).actions) {
			// This is a monster; get actions from the monster
			list = list.concat((hero as Monster).actions);
		}

		hero.items.forEach(i => {
			list = list.concat(i.actions);
		});

		return list;
	}

	public static activeFeatures(hero: Hero | Monster) {
		let list = ([] as Feature[]).concat(hero.features);
		hero.items.forEach(i => {
			list = list.concat(i.features);
		});

		return list;
	}

	public static trait(hero: Hero | Monster, trait: Trait) {
		let value = 1;

		if ((hero as Hero).speciesID) {
			// This is a hero; get traits from the species
			const s = SpeciesHelper.getSpecies((hero as Hero).speciesID);
			if (s) {
				const bonuses = s.traits.filter(t => (t === trait) || (t === Trait.All));
				value += bonuses.length;
			}
		}

		if ((hero as Hero).roleID) {
			// This is a hero; get traits from the role
			const r = RoleHelper.getRole((hero as Hero).roleID);
			if (r) {
				const bonuses = r.traits.filter(t => (t === trait) || (t === Trait.All));
				value += bonuses.length;
			}
		}

		HeroHelper.activeFeatures(hero)
			.filter(f => f.type === FeatureType.Trait)
			.filter(f => (f.trait === trait) || (f.trait === Trait.All))
			.forEach(f => value += f.rank);

		return Math.max(value, 0);
	}

	public static skill(hero: Hero | Monster, skill: Skill) {
		let value = 0;

		if ((hero as Hero).roleID) {
			// This is a hero; get skills from the role
			const r = RoleHelper.getRole((hero as Hero).roleID);
			if (r) {
				const bonuses = r.skills.filter(s => (s === skill) || (s === Skill.All));
				value += bonuses.length * 2;
			}
		}

		HeroHelper.activeFeatures(hero)
			.filter(f => f.type === FeatureType.Skill)
			.filter(f => (f.skill === skill) || (f.skill === Skill.All))
			.forEach(f => value += f.rank);
		HeroHelper.activeFeatures(hero)
			.filter(f => f.type === FeatureType.SkillCategory)
			.filter(f => (f.skillCategory === SkillHelper.getCategory(skill)) || (f.skillCategory === SkillCategory.All))
			.forEach(f => value += f.rank);

		return Math.max(value, 0);
	}

	public static proficiencies(hero: Hero | Monster) {
		let profs: Proficiency[] = [];

		// From role, if this is a hero
		const r = RoleHelper.getRole((hero as Hero).roleID);
		profs = profs.concat(r ? r.proficiencies : []);

		// From active features
		HeroHelper.activeFeatures(hero)
			.filter(f => f.type === FeatureType.Proficiency)
			.forEach(f => profs.push(f.proficiency));

		if (profs.includes(Proficiency.All)) {
			return [Proficiency.All];
		}

		return profs;
	}
}
