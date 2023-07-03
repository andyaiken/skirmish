import type { CombatantType } from '../enums/combatant-type';
import type { QuirkType } from '../enums/quirk-type';
import type { SkillType } from '../enums/skill-type';
import type { TraitType } from '../enums/trait-type';

import type { ActionModel } from './action';
import type { FeatureModel } from './feature';

export interface SpeciesModel {
	id: string;
	name: string;
	pack: string;
	description: string;
	type: CombatantType
	size: number;
	quirks: QuirkType[];
	traits: TraitType[];
	skills: SkillType[];
	features: FeatureModel[];
	actions: ActionModel[];
}
