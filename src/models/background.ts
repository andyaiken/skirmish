import { ActionModel, createActionPlaceholder } from './action';
import { AuraType } from './aura';
import { DamageCategory, DamageType } from './damage';
import {
	createAuraDamageCategoryFeature,
	createAuraDamageFeature,
	createAuraFeature,
	createDamageCategoryBonusFeature,
	createDamageCategoryResistFeature,
	createDamageResistFeature,
	createSkillFeature,
	createTraitFeature,
	FeatureModel
} from './feature';
import { GameModel } from './game';
import { Skill } from './skill';
import { Trait } from './trait';

export interface BackgroundModel {
	id: string;
	name: string;
	features: FeatureModel[];
	actions: ActionModel[];
}

export const BackgroundList: BackgroundModel[] = [
	{
		id: 'background-acrobat',
		name: 'Acrobat',
		features: [
			createTraitFeature(Trait.Speed, 1)
		],
		actions: [
			createActionPlaceholder('Move through occupied spaces'),
			createActionPlaceholder('Burst of speed (roll speed again and add)')
		]
	},
	{
		id: 'background-commander',
		name: 'Commander',
		features: [
			createAuraDamageCategoryFeature(AuraType.DamageResistance, DamageCategory.Corruption, 1),
			createAuraDamageCategoryFeature(AuraType.DamageResistance, DamageCategory.Energy, 1),
			createAuraDamageCategoryFeature(AuraType.DamageResistance, DamageCategory.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Knock prone'),
			createActionPlaceholder('Extra move')
		]
	},
	{
		id: 'background-mountebank',
		name: 'Mountebank',
		features: [
			createAuraDamageCategoryFeature(AuraType.DamageVulnerability, DamageCategory.Corruption, 1),
			createAuraDamageCategoryFeature(AuraType.DamageVulnerability, DamageCategory.Energy, 1),
			createAuraDamageCategoryFeature(AuraType.DamageVulnerability, DamageCategory.Physical, 1)
		],
		actions: [
			createActionPlaceholder('Command attack'),
			createActionPlaceholder('Command move'),
			createActionPlaceholder('Buff ally')
		]
	},
	{
		id: 'background-mystic',
		name: 'Mystic',
		features: [
			createSkillFeature(Skill.Spellcasting, 2),
			createDamageCategoryBonusFeature(DamageCategory.Energy, 1),
			createDamageCategoryBonusFeature(DamageCategory.Corruption, 1),
			createDamageCategoryResistFeature(DamageCategory.Corruption, 1)
		],
		actions: [
			createActionPlaceholder('Confusion (target makes attack)'),
			createActionPlaceholder('Stun (target loses action)'),
			createActionPlaceholder('Transfer a condition'),
			createActionPlaceholder('Invert a condition')
		]
	},
	{
		id: 'background-noble',
		name: 'Noble',
		features: [
			createAuraFeature(AuraType.EaseMovement, 1)
		],
		actions: [
			createActionPlaceholder('Buff ally'),
			createActionPlaceholder('Debuff enemy'),
			createActionPlaceholder('Taunt')
		]
	},
	{
		id: 'background-physician',
		name: 'Physician',
		features: [
			createAuraFeature(AuraType.AutomaticHealing, 1)
		],
		actions: [
			createActionPlaceholder('Remove condition (ally)'),
			createActionPlaceholder('Healing (damage)'),
			createActionPlaceholder('Healing (wounds)')
		]
	},
	{
		id: 'background-reaver',
		name: 'Reaver',
		features: [
			createSkillFeature(Skill.Brawl, 2),
			createSkillFeature(Skill.Weapon, 2),
			createDamageCategoryResistFeature(DamageCategory.Any, 1),
			createDamageCategoryBonusFeature(DamageCategory.Physical, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Edged, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Impact, 1),
			createAuraDamageFeature(AuraType.AutomaticDamage, DamageType.Piercing, 1)
		],
		actions: [
			createActionPlaceholder('Frenzy (adds to damage)'),
			createActionPlaceholder('Speed boost'),
			createActionPlaceholder('Endurance boost')
		]
	},
	{
		id: 'background-sentinel',
		name: 'Sentinel',
		features: [
			createTraitFeature(Trait.Endurance, 1),
			createTraitFeature(Trait.Resolve, 1),
			createDamageResistFeature(DamageType.All, 1),
			createAuraFeature(AuraType.PreventMovement, 1)
		],
		actions: [
			createActionPlaceholder('Mark enemy'),
			createActionPlaceholder('Interposing stance')
		]
	},
	{
		id: 'background-thief',
		name: 'Thief',
		features: [
			createSkillFeature(Skill.Reactions, 2),
			createSkillFeature(Skill.Stealth, 2)
		],
		actions: [
			createActionPlaceholder('Disable trap'),
			createActionPlaceholder('Set trap')
		]
	}
];

export const getBackground = (id: string) => {
	return BackgroundList.find(b => b.id === id);
}

export const getBackgroundDeck = (game: GameModel | null = null) => {
	if (game) {
		const used = game.heroes.map(h => h.backgroundID);

		const deck = BackgroundList
			.filter(background => !used.includes(background.id))
			.map(background => background.id);

		if (deck.length >= 3) {
			return deck;
		}
	}

	return BackgroundList.map(background => background.id);
}
