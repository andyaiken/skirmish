import type { ActionModel } from '../models/action';
import type { SpeciesModel } from '../models/species';
import { TraitType, SkillType, DamageType, DamageCategoryType } from '../enums/enums';
import { FeatureUtils } from '../logic/feature-utils';
import { Utils } from '../utils/utils';

const createActionPlaceholder = (name: string): ActionModel => {
	return {
		id: Utils.guid(),
		name: name
	};
};

export const MonsterSpeciesList: SpeciesModel[] = [
	{
		id: 'species-orc',
		name: 'Orc',
		size: 1,
		traits: [
			TraitType.All
		],
		features: [
			FeatureUtils.createTraitFeature(TraitType.Any, 1),
			FeatureUtils.createDamageResistFeature(DamageType.All, 1),
			FeatureUtils.createSkillFeature(SkillType.Brawl, 2),
			FeatureUtils.createSkillFeature(SkillType.Weapon, 2)
		],
		actions: [
			createActionPlaceholder('Fury'),
			createActionPlaceholder('Ignore damage')
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
			FeatureUtils.createTraitFeature(TraitType.Speed, 1),
			FeatureUtils.createSkillFeature(SkillType.Reactions, 1),
			FeatureUtils.createSkillFeature(SkillType.Stealth, 1)
		],
		actions: [
			createActionPlaceholder('Sneak attack')
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
			FeatureUtils.createTraitFeature(TraitType.Endurance, 1),
			FeatureUtils.createTraitFeature(TraitType.Resolve, 1),
			FeatureUtils.createDamageCategoryTypeResistFeature(DamageCategoryType.Physical, 1),
			FeatureUtils.createDamageCategoryTypeResistFeature(DamageCategoryType.Energy, 1),
			FeatureUtils.createDamageCategoryTypeResistFeature(DamageCategoryType.Corruption, 1)
		],
		actions: [
			createActionPlaceholder('Slam'),
			createActionPlaceholder('Regeneration')
		]
	}
];
