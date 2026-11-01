import { PersonalityAxis, PersonalityType, personalityAxes } from '../../enums/personality-type';

import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { DreamType } from '../../enums/dream-type';
import { EncounterState } from '../../enums/encounter-state';
import { FearType } from '../../enums/fear-type';
import { MemoryType } from '../../enums/memory-type';
import { PastimeType } from '../../enums/pastime-type';
import { QuirkType } from '../../enums/quirk-type';

import type { MemoryModel, MindModel } from '../../models/mind';

import type { CombatantModel } from '../../models/combatant';
import type { EncounterModel } from '../../models/encounter';
import type { GameModel } from '../../models/game';

import { Collections } from '../../utils/collections/collections';

import { GameLogic } from '../game/game-logic';

const personalityExperiences: Partial<Record<MemoryType, { trait: PersonalityType; describe: (subject: string) => string }>> = {
	[MemoryType.SlewBoss]: {
		trait: PersonalityType.Bold,
		describe: subject => `defeating ${subject}`
	},
	[MemoryType.KnockedOut]: {
		trait: PersonalityType.Cautious,
		describe: subject => `being knocked out at ${subject}`
	},
	[MemoryType.AllyFell]: {
		trait: PersonalityType.Gloomy,
		describe: subject => `losing ${subject}`
	},
	[MemoryType.RegionConquered]: {
		trait: PersonalityType.Proud,
		describe: subject => `conquering ${subject}`
	}
};

export class MindLogic {
	static maxMemories = 16;
	static maxComradesLost = 10;
	static maxPersonalityLevel = 3;
	static maxPersonalityAxisValue = MindLogic.maxPersonalityLevel * 2;
	static neutralPersonalityAxisValue = MindLogic.maxPersonalityLevel;
	static personalityThoughtLevel = 2;

	static createPersonality = (rng: () => number = Math.random): Record<PersonalityAxis, number> => {
		return Object.values(PersonalityAxis).reduce((profile, axis) => {
			profile[axis] = Math.floor(rng() * (MindLogic.maxPersonalityAxisValue + 1));
			return profile;
		}, {} as Record<PersonalityAxis, number>);
	};

	static getPersonalityLevel = (profile: Record<PersonalityAxis, number>, trait: PersonalityType) => {
		const axis = Object.values(PersonalityAxis).find(key => {
			const definition = personalityAxes[key];
			return (definition.left === trait) || (definition.right === trait);
		});
		if (!axis) {
			return 0;
		}

		const definition = personalityAxes[axis];
		const level = profile[axis];
		return definition.left === trait
			? Math.max(0, MindLogic.neutralPersonalityAxisValue - level)
			: Math.max(0, level - MindLogic.neutralPersonalityAxisValue);
	};

	static setPersonalityLevel = (profile: Record<PersonalityAxis, number>, trait: PersonalityType, value: number) => {
		const axis = Object.values(PersonalityAxis).find(key => {
			const definition = personalityAxes[key];
			return (definition.left === trait) || (definition.right === trait);
		});
		if (!axis) {
			return;
		}

		const definition = personalityAxes[axis];
		const level = Math.min(MindLogic.maxPersonalityLevel, Math.max(0, Math.trunc(value)));
		if (definition.left === trait) {
			profile[axis] = MindLogic.neutralPersonalityAxisValue - level;
		} else {
			profile[axis] = MindLogic.neutralPersonalityAxisValue + level;
		}
	};

	private static applyPersonalityExperience = (hero: CombatantModel, type: MemoryType, subject: string): MemoryModel['personalityChange'] => {
		const experience = personalityExperiences[type];
		if (!experience) {
			return undefined;
		}

		const axis = Object.values(PersonalityAxis).find(key => {
			const definition = personalityAxes[key];
			return (definition.left === experience.trait) || (definition.right === experience.trait);
		});
		if (!axis) {
			return undefined;
		}

		const definition = personalityAxes[axis];
		const from = hero.mind.personality[axis];
		const direction = definition.left === experience.trait ? -1 : 1;
		const to = Math.min(MindLogic.maxPersonalityAxisValue, Math.max(0, from + direction));
		if (from === to) {
			return undefined;
		}

		hero.mind.personality[axis] = to;
		return {
			trait: experience.trait,
			from: from,
			to: to,
			experience: experience.describe(subject)
		};
	};

	static create = (rng: () => number = Math.random): MindModel => {
		return {
			personality: MindLogic.createPersonality(rng),
			dream: Collections.draw(Object.values(DreamType), rng),
			fear: Collections.draw(Object.values(FearType), rng),
			pastime: Collections.draw(Object.values(PastimeType), rng),
			history: {
				encounters: 0,
				victories: 0,
				retreats: 0,
				knockouts: 0,
				monstersSlain: 0,
				bossesSlain: 0,
				mostSlainAtOnce: 0,
				comradesLost: []
			},
			memories: []
		};
	};

	static createTally = (): CombatantModel['combat']['tally'] => {
		return {
			slain: 0,
			bosses: [],
			mostAtOnce: 0
		};
	};

	// Saves from before heroes had minds have none; give them one rather than leaving them blank
	static ensure = (combatant: CombatantModel) => {
		if (!combatant.mind) {
			combatant.mind = MindLogic.create();
		} else if (Array.isArray(combatant.mind.personality)) {
			const traits = combatant.mind.personality;
			combatant.mind.personality = Object.values(PersonalityAxis).reduce((profile, axis) => {
				const definition = personalityAxes[axis];
				const left = traits.indexOf(definition.left);
				const right = traits.indexOf(definition.right);
				if (left >= 0 && (right < 0 || left < right)) {
					profile[axis] = 0;
				} else if (right >= 0) {
					profile[axis] = MindLogic.maxPersonalityAxisValue;
				} else {
					profile[axis] = MindLogic.neutralPersonalityAxisValue;
				}
				return profile;
			}, {} as Record<PersonalityAxis, number>);
		} else if (!combatant.mind.personality) {
			combatant.mind.personality = MindLogic.createPersonality();
		} else {
			const previous = new Map(Object.entries(combatant.mind.personality));
			const hasCurrentShape = Object.values(PersonalityAxis).every(axis => previous.has(axis));
			if (!hasCurrentShape) {
				combatant.mind.personality = Object.values(PersonalityAxis).reduce((profile, axis) => {
					const definition = personalityAxes[axis];
					const savedAxisValue = previous.get(axis);
					const savedLegacyTrait = definition.legacyIndependent ? previous.get(definition.left) : undefined;
					if (savedAxisValue !== undefined) {
						profile[axis] = Math.min(MindLogic.maxPersonalityAxisValue, Math.max(0, Math.trunc(savedAxisValue)));
					} else if (savedLegacyTrait !== undefined) {
						const strength = Math.min(MindLogic.maxPersonalityLevel, Math.max(0, Math.trunc(savedLegacyTrait)));
						profile[axis] = MindLogic.neutralPersonalityAxisValue - strength;
					} else {
						profile[axis] = MindLogic.neutralPersonalityAxisValue;
					}
					return profile;
				}, {} as Record<PersonalityAxis, number>);
			}
			Object.values(PersonalityAxis).forEach(axis => {
				const level = combatant.mind.personality[axis];
				combatant.mind.personality[axis] = Number.isFinite(level)
					? Math.min(MindLogic.maxPersonalityAxisValue, Math.max(0, Math.trunc(level)))
					: MindLogic.neutralPersonalityAxisValue;
			});
		}
		if (!combatant.combat.tally) {
			combatant.combat.tally = MindLogic.createTally();
		}
	};

	///////////////////////////////////////////////////////////////////////////

	static remember = (hero: CombatantModel, type: MemoryType, subject = '', amount = 0, detail = '') => {
		if (hero.type !== CombatantType.Hero) {
			return;
		}

		MindLogic.ensure(hero);

		const previous = hero.mind.memories.find(m => (m.type === type) && (m.subject === subject));
		const personalityChange = previous
			? previous.personalityChange
			: MindLogic.applyPersonalityExperience(hero, type, subject);

		// Remembering the same thing again refreshes it rather than piling up or repeating its influence
		const memories = hero.mind.memories.filter(m => !((m.type === type) && (m.subject === subject)));
		memories.unshift({
			type: type,
			subject: subject,
			detail: detail,
			amount: amount,
			age: 0,
			...(personalityChange ? { personalityChange: personalityChange } : {})
		});
		hero.mind.memories = memories.slice(0, MindLogic.maxMemories);
	};

	static rememberAll = (heroes: CombatantModel[], type: MemoryType, subject = '', amount = 0, detail = '') => {
		heroes.forEach(h => MindLogic.remember(h, type, subject, amount, detail));
	};

	static age = (heroes: CombatantModel[]) => {
		heroes.forEach(h => {
			MindLogic.ensure(h);
			h.mind.memories.forEach(m => m.age += 1);
		});
	};

	///////////////////////////////////////////////////////////////////////////

	// Taken before an action resolves, so that whoever it brought down can be credited to the actor
	static snapshotOpponents = (encounter: EncounterModel, actor: CombatantModel) => {
		return new Map(encounter.combatants
			.filter(c => c.faction !== actor.faction)
			.map(c => [ c.id, c.combat.state ]));
	};

	static creditAction = (encounter: EncounterModel, actor: CombatantModel, before: Map<string, CombatantState>) => {
		if (actor.type !== CombatantType.Hero) {
			return;
		}

		MindLogic.ensure(actor);

		const standing = [ CombatantState.Standing, CombatantState.Prone ];
		const felled = encounter.combatants
			.filter(c => before.has(c.id))
			.filter(c => standing.includes(before.get(c.id) as CombatantState))
			.filter(c => (c.combat.state === CombatantState.Dead) || (c.combat.state === CombatantState.Unconscious));

		if (felled.length === 0) {
			return;
		}

		const tally = actor.combat.tally;
		tally.slain += felled.length;
		tally.mostAtOnce = Math.max(tally.mostAtOnce, felled.length);
		felled
			.filter(c => c.quirks.includes(QuirkType.Boss))
			.forEach(c => tally.bosses.push({ name: c.name, species: GameLogic.getSpecies(c.speciesID)?.name ?? '' }));
	};

	///////////////////////////////////////////////////////////////////////////

	// Turns what happened in an encounter into history and memories. Call it before the heroes
	// are reset, while their final state and tallies are still intact.
	static recordEncounter = (game: GameModel, encounter: EncounterModel, state: EncounterState, regionName: string) => {
		const fought = encounter.combatants.filter(c => (c.type === CombatantType.Hero) && (c.faction === CombatantType.Hero));
		const stayedHome = game.heroes.filter(h => !fought.includes(h));

		MindLogic.age([ ...fought, ...stayedHome ]);

		if (state === EncounterState.Defeat) {
			// Nobody comes home to remember it
			return;
		}

		const retreated = state === EncounterState.Retreat;
		const lost = (hero: CombatantModel) => (hero.combat.state === CombatantState.Dead) || (retreated && (hero.combat.state === CombatantState.Unconscious));
		const returned = fought.filter(h => !lost(h));

		stayedHome.forEach(h => MindLogic.remember(h, MemoryType.LeftBehind, regionName));

		returned.forEach(hero => {
			const history = hero.mind.history;
			const tally = hero.combat.tally;

			history.encounters += 1;

			if (retreated) {
				history.retreats += 1;
				MindLogic.remember(hero, MemoryType.Retreat, regionName);
			} else {
				history.victories += 1;
				MindLogic.remember(hero, MemoryType.Victory, regionName);
			}

			if (hero.combat.state === CombatantState.Unconscious) {
				history.knockouts += 1;
				MindLogic.remember(hero, MemoryType.KnockedOut, regionName);
			} else if (hero.combat.wounds > 0) {
				MindLogic.remember(hero, MemoryType.Wounded, regionName, hero.combat.wounds);
			} else if (!retreated && (hero.combat.damage === 0)) {
				MindLogic.remember(hero, MemoryType.Unscathed, regionName);
			}

			history.monstersSlain += tally.slain;
			history.mostSlainAtOnce = Math.max(history.mostSlainAtOnce, tally.mostAtOnce);
			if (tally.slain >= 4) {
				MindLogic.remember(hero, MemoryType.SlewMany, regionName, tally.slain);
			}
			if (tally.mostAtOnce >= 2) {
				MindLogic.remember(hero, MemoryType.SlewAtOnce, regionName, tally.mostAtOnce);
			}
			tally.bosses.forEach(boss => {
				history.bossesSlain += 1;
				MindLogic.remember(hero, MemoryType.SlewBoss, boss.name, 0, boss.species);
			});
			if ((tally.slain === 0) && !retreated && (hero.combat.state !== CombatantState.Unconscious)) {
				MindLogic.remember(hero, MemoryType.NoKills, regionName);
			}

			fought.filter(other => (other !== hero) && lost(other)).forEach(other => {
				MindLogic.remember(hero, MemoryType.AllyFell, other.name);
				history.comradesLost = [ ...history.comradesLost.filter(n => n !== other.name), other.name ].slice(-MindLogic.maxComradesLost);
			});
			fought
				.filter(other => (other !== hero) && !lost(other) && (other.combat.state === CombatantState.Unconscious))
				.forEach(other => MindLogic.remember(hero, MemoryType.AllyDown, other.name));
		});
	};
}
