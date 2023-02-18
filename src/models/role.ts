import type { ActionModel } from './action';
import type { ItemProficiencyType, SkillType, TraitType } from '../enums/enums';
import type { FeatureModel } from './feature';

export interface RoleModel {
	id: string;
	name: string;
	traits: TraitType[];
	skills: SkillType[];
	proficiencies: ItemProficiencyType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
