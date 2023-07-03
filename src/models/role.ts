import type { ActionModel } from './action';
import type { FeatureModel } from './feature';
import type { ItemProficiencyType } from '../enums/item-proficiency-type';
import type { SkillType } from '../enums/skill-type';
import type { TraitType } from '../enums/trait-type';

export interface RoleModel {
	id: string;
	name: string;
	pack: string;
	description: string;
	traits: TraitType[];
	skills: SkillType[];
	proficiencies: ItemProficiencyType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
