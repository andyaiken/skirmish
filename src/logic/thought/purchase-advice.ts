import { PersonalityType } from '../../enums/personality-type';
import { StructureType } from '../../enums/structure-type';

import type { CombatantModel } from '../../models/combatant';
import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';
import type { StructureModel } from '../../models/structure';

import { CombatantLogic } from '../combatant/combatant-logic';
import { MindLogic } from '../mind/mind-logic';

interface AdviceProfile {
	personality: PersonalityType;
	reason: string;
}

export interface PurchaseAdviceModel {
	hero: CombatantModel;
	choice: string;
	message: string;
}

const structureAdvice: Record<StructureType, AdviceProfile> = {
	[StructureType.Barracks]: { personality: PersonalityType.Loyal, reason: 'we could make room for more people.' },
	[StructureType.Warehouse]: { personality: PersonalityType.Greedy, reason: 'we could keep better track of what we have.' },
	[StructureType.Academy]: { personality: PersonalityType.Curious, reason: 'we could all learn something useful.' },
	[StructureType.Bazaar]: { personality: PersonalityType.Greedy, reason: 'better prices would stretch our coin.' },
	[StructureType.CountingHouse]: { personality: PersonalityType.Greedy, reason: 'our territory could help pay our way.' },
	[StructureType.Forge]: { personality: PersonalityType.Curious, reason: 'we could have better options for what to build.' },
	[StructureType.Guildhall]: { personality: PersonalityType.Greedy, reason: 'a discount could make our next purchase go further.' },
	[StructureType.Hall]: { personality: PersonalityType.Loyal, reason: 'we could find the right people to join us.' },
	[StructureType.Intelligencer]: { personality: PersonalityType.Cautious, reason: 'knowing more about our enemies could keep us safe.' },
	[StructureType.Monument]: { personality: PersonalityType.Proud, reason: 'it would show the island what we have built.' },
	[StructureType.Observatory]: { personality: PersonalityType.Curious, reason: 'a closer look at our choices could turn a fight.' },
	[StructureType.Quartermaster]: { personality: PersonalityType.Generous, reason: 'we could send new companions out better equipped.' },
	[StructureType.Sanatorium]: { personality: PersonalityType.Cautious, reason: 'we could tend to our wounds before they worsen.' },
	[StructureType.Scriptorium]: { personality: PersonalityType.Curious, reason: 'we could have more choices when magic matters.' },
	[StructureType.Shipyard]: { personality: PersonalityType.Bold, reason: 'the sea should be a road, not a wall.' },
	[StructureType.Tavern]: { personality: PersonalityType.Generous, reason: 'a place to recover would help the whole company.' },
	[StructureType.Temple]: { personality: PersonalityType.Devout, reason: 'a blessing might see us through the next fight.' },
	[StructureType.ThievesGuild]: { personality: PersonalityType.Bold, reason: 'one quick move at the right moment could change a fight.' },
	[StructureType.TrainingGround]: { personality: PersonalityType.Proud, reason: 'we could choose how we grow stronger.' },
	[StructureType.WarRoom]: { personality: PersonalityType.Loyal, reason: 'we could bring more of our company into a fight.' },
	[StructureType.WizardTower]: { personality: PersonalityType.Curious, reason: 'we could find magic suited to what lies ahead.' }
};

const itemPreference = (item: ItemModel) => {
	if (item.potion || item.armor) {
		return PersonalityType.Cautious;
	}
	if (item.weapon) {
		return PersonalityType.Bold;
	}
	if (item.scroll || item.magic) {
		return PersonalityType.Curious;
	}
	return PersonalityType.Generous;
};

const bestHero = (game: GameModel, personality: PersonalityType, item?: ItemModel): CombatantModel | null => {
	const eligible = game.heroes.filter(hero => {
		if (!item || item.potion || item.scroll) {
			return true;
		}
		if (!CombatantLogic.canEquip(hero, item)) {
			return false;
		}
		return !item.magic || !hero.items.some(equipped => equipped.location === item.location);
	});

	return eligible.reduce<CombatantModel | null>((best, hero) => {
		if (!best) {
			return hero;
		}
		return MindLogic.getPersonalityLevel(hero.mind.personality, personality) >
			MindLogic.getPersonalityLevel(best.mind.personality, personality) ? hero : best;
	}, null);
};

const variant = (hero: CombatantModel, choice: string, count: number) => {
	let hash = 2166136261;
	for (const character of `${hero.id}:${choice}`) {
		hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
	}
	return (hash >>> 0) % count;
};

const recommendation = (hero: CombatantModel, choice: string, reason: string, definiteArticle = true) => {
	const namedChoice = definiteArticle ? `the ${choice}` : choice;
	const subject = definiteArticle ? `The ${choice}` : choice;
	const options = [
		`I’d choose ${namedChoice}; ${reason}`,
		`Let’s go for ${namedChoice} — ${reason}`,
		`My vote goes to ${namedChoice}: ${reason}`,
		`${subject} looks like our best bet; ${reason}`
	];
	return options[variant(hero, choice, options.length)];
};

const magicItemReasons = [
	'its enchantment could give me an edge.',
	'I can put that magic to good use.',
	'it could make a real difference when we need it.',
	'that would be a useful bit of magic to have on our side.'
];

const magicItemReason = (hero: CombatantModel, item: ItemModel) => {
	return magicItemReasons[variant(hero, item.name, magicItemReasons.length)];
};

const permanentStructureTypes = new Set([ StructureType.Bazaar, StructureType.CountingHouse ]);

export class PurchaseAdviceLogic {
	static getStructureAdvice = (game: GameModel, structures: StructureModel[]): PurchaseAdviceModel | null => {
		if ((game.heroes.length === 0) || (structures.length === 0)) {
			return null;
		}

		const ownedTypes = new Set(game.stronghold.map(structure => structure.type));
		let best: { hero: CombatantModel; structure: StructureModel; score: number; reason: string } | null = null;
		for (const structure of structures) {
			const profile = structureAdvice[structure.type];
			const hero = bestHero(game, profile.personality);
			if (!hero) {
				continue;
			}
			const alreadyOwned = ownedTypes.has(structure.type);
			const duplicatePermanent = alreadyOwned && permanentStructureTypes.has(structure.type);
			const score = MindLogic.getPersonalityLevel(hero.mind.personality, profile.personality) +
				(alreadyOwned ? (duplicatePermanent ? -3 : 0) : 1);
			if (!best || (score > best.score)) {
				best = { hero: hero, structure: structure, score: score, reason: profile.reason };
			}
		}

		if (!best) {
			return null;
		}

		const redundantOption = structures.find(structure =>
			permanentStructureTypes.has(structure.type) && ownedTypes.has(structure.type)
		);
		const message = redundantOption && (redundantOption.id !== best.structure.id)
			? `I’d skip another ${redundantOption.name}; we already have one. Let’s go for the ${best.structure.name} instead — ${best.reason}`
			: recommendation(best.hero, best.structure.name, best.reason);

		return {
			hero: best.hero,
			choice: best.structure.name,
			message: message
		};
	};

	static getItemAdvice = (game: GameModel, items: ItemModel[]): PurchaseAdviceModel | null => {
		if ((game.heroes.length === 0) || (items.length === 0)) {
			return null;
		}

		let best: { hero: CombatantModel; item: ItemModel; score: number } | null = null;
		for (const item of items) {
			const personality = itemPreference(item);
			const hero = bestHero(game, personality, item);
			if (!hero) {
				continue;
			}
			const score = MindLogic.getPersonalityLevel(hero.mind.personality, personality);
			if (!best || (score > best.score)) {
				best = { hero: hero, item: item, score: score };
			}
		}

		if (!best) {
			return null;
		}

		const canUse = !best.item.potion && !best.item.scroll && CombatantLogic.canEquip(best.hero, best.item);
		return {
			hero: best.hero,
			choice: best.item.name,
			message: recommendation(
				best.hero,
				best.item.name,
				best.item.magic
					? magicItemReason(best.hero, best.item)
					: canUse ? 'I could make good use of it.' : 'it could come in handy for the company.',
				!best.item.magic
			)
		};
	};
}
