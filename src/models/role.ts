import { ActionModel } from './action';
import { ItemProficiencyType, SkillType, TraitType } from './enums';
import { FeatureModel } from './feature';

export interface RoleModel {
	id: string;
	name: string;
	traits: TraitType[];
	skills: SkillType[];
	proficiencies: ItemProficiencyType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
