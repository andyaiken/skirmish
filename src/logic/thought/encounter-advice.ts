import { PersonalityType } from '../../enums/personality-type';

import type { CombatantModel } from '../../models/combatant';

import { MindLogic } from '../mind/mind-logic';

export interface EncounterAdviceModel {
	hero: CombatantModel;
	message: string;
}

const level = (hero: CombatantModel, trait: PersonalityType) => {
	return MindLogic.getPersonalityLevel(hero.mind.personality, trait);
};

const eagerness = (hero: CombatantModel) => level(hero, PersonalityType.Bold) + level(hero, PersonalityType.Proud);
const reluctance = (hero: CombatantModel) => level(hero, PersonalityType.Cautious) + level(hero, PersonalityType.Gloomy);

const pick = (hero: CombatantModel, key: string, options: string[]) => {
	let hash = 2166136261;
	for (const character of `${hero.id}:${key}`) {
		hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
	}
	return options[(hash >>> 0) % options.length];
};

const best = (heroes: CombatantModel[], score: (hero: CombatantModel) => number, minimum: number) => {
	return heroes.reduce<CombatantModel | null>((top, hero) => {
		if (score(hero) < minimum) {
			return top;
		}
		return !top || (score(hero) > score(top)) ? hero : top;
	}, null);
};

export class EncounterAdviceLogic {
	// Heroes comment on who is going: one who is keen, one who would rather not, and one who thinks
	// a stronger hero should go in their place
	static getAdvice = (heroes: CombatantModel[], selected: CombatantModel[], partySize: number): EncounterAdviceModel[] => {
		const advice: EncounterAdviceModel[] = [];
		const isSelected = (hero: CombatantModel) => selected.some(s => s.id === hero.id);
		const benched = heroes.filter(h => !isSelected(h));

		const reluctant = best(selected, reluctance, 2);
		if (reluctant) {
			advice.push({
				hero: reluctant,
				message: pick(reluctant, 'reluctant', [
					'I’d rather sit this one out. It feels like a bad idea.',
					'Do we have to go? I’d be happier staying behind.',
					'I’ll go if I must, but I don’t like the look of this.',
					'Something about this feels wrong. Can someone else go?',
					'Are we sure this is worth the risk?',
					'I have a bad feeling about what’s waiting for us.'
				])
			});
		}

		const keenBenched = selected.length < partySize ? best(benched, eagerness, 2) : null;
		const keen = keenBenched ?? best(selected.filter(h => h.id !== reluctant?.id), eagerness, 2);
		if (keen) {
			advice.push({
				hero: keen,
				message: keenBenched
					? pick(keen, 'keen-benched', [
						'Put me in the party! I’m itching for a fight.',
						'I want to go. Don’t leave me behind this time.',
						'Take me with you; I’m ready.',
						'There’s room for one more. Let me come along.',
						'I can handle myself. Bring me with you.',
						'You’ll want me out there. Pick me!'
					])
					: pick(keen, 'keen', [
						'Finally, some action. I’m ready.',
						'Let’s get on with it; I’m looking forward to this.',
						'Bring it on!',
						'Point me at the trouble. I’ll take care of it.',
						'This should be interesting. Let’s go.',
						'Good. I was starting to get restless.'
					])
			});
		}

		if (selected.length > 0) {
			const weakest = [ ...selected ].sort((a, b) => (a.level - b.level) || (a.xp - b.xp))[0];
			const stronger = [ ...benched ]
				.filter(h => h.level > weakest.level)
				.sort((a, b) => (b.level - a.level) || (b.xp - a.xp))[0];
			if (stronger && !advice.some(a => a.hero.id === weakest.id) && (level(weakest, PersonalityType.Humble) >= 1)) {
				advice.push({
					hero: weakest,
					message: pick(weakest, 'swap', [
						`${stronger.name} is stronger than me; they should go in my place.`,
						`Maybe ${stronger.name} should take my place. They’re better suited to this.`,
						`I’d feel better if ${stronger.name} went instead of me.`,
						`${stronger.name} has more experience. They should lead this one.`,
						`Could ${stronger.name} go in my place? We’d have a better chance.`
					])
				});
			}
		}

		return advice;
	};
}
