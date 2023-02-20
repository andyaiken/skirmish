import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { FeatureLogic } from '../logic/feature-logic';

import type { ActionModel } from '../models/action';
import type { SpeciesModel } from '../models/species';

import { Utils } from '../utils/utils';

export class MonsterSpeciesData {
	static createActionPlaceholder = (name: string): ActionModel => {
		return {
			id: Utils.guid(),
			name: name
		};
	};

	static getList = (): SpeciesModel[] => {
		return [
			{
				id: 'species-orc',
				name: 'Orc',
				size: 1,
				traits: [
					TraitType.All
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Any, 1),
					FeatureLogic.createDamageResistFeature(DamageType.All, 1),
					FeatureLogic.createSkillFeature(SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature(SkillType.Weapon, 2)
				],
				actions: [
					MonsterSpeciesData.createActionPlaceholder('Fury'),
					MonsterSpeciesData.createActionPlaceholder('Ignore damage')
				]
			},
			{
				id: 'species-goblin',
				name: 'Goblin',
				size: 1,
				traits: [
					TraitType.Speed
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Speed, 1),
					FeatureLogic.createSkillFeature(SkillType.Reactions, 1),
					FeatureLogic.createSkillFeature(SkillType.Stealth, 1)
				],
				actions: [
					MonsterSpeciesData.createActionPlaceholder('Sneak attack')
				]
			},
			{
				id: 'species-troll',
				name: 'Troll',
				size: 2,
				traits: [
					TraitType.Endurance,
					TraitType.Resolve
				],
				features: [
					FeatureLogic.createTraitFeature(TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature(TraitType.Resolve, 1),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryTypeResistFeature(DamageCategoryType.Corruption, 1)
				],
				actions: [
					MonsterSpeciesData.createActionPlaceholder('Slam'),
					MonsterSpeciesData.createActionPlaceholder('Regeneration')
				]
			}
		];
	};
}
