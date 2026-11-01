import { describe, expect, it } from 'vitest';

import { PersonalityAxis, PersonalityType, personalityAxes } from '../../enums/personality-type';

import { CombatantType } from '../../enums/combatant-type';
import { MemoryType } from '../../enums/memory-type';

import { Factory } from '../factory/factory';
import { MindLogic } from './mind-logic';

describe('MindLogic', () => {
	it('pairs every personality pole with exactly one opposite', () => {
		const poles = Object.values(personalityAxes).flatMap(axis => [ axis.left, axis.right ]);

		expect(poles).toHaveLength(Object.values(PersonalityType).length);
		expect(new Set(poles).size).toBe(poles.length);
		expect(new Set(poles)).toEqual(new Set(Object.values(PersonalityType)));
	});

	it('generates each personality dimension independently', () => {
		const levels = [ 0, 0.25, 0.5, 0.75, 0.1, 0.3, 0.6, 0.9 ];
		let calls = 0;
		const profile = MindLogic.createPersonality(() => levels[calls++]);

		expect(calls).toBe(Object.values(PersonalityAxis).length);
		expect(Object.values(profile)).toEqual([ 0, 1, 3, 5, 0, 2, 4, 6 ]);
	});

	it('does not constrain opposite ends of one axis as separate traits', () => {
		const profile = MindLogic.createPersonality(() => 0);
		expect(MindLogic.getPersonalityLevel(profile, PersonalityType.Bold)).toBe(3);
		expect(MindLogic.getPersonalityLevel(profile, PersonalityType.Cautious)).toBe(0);

		MindLogic.setPersonalityLevel(profile, PersonalityType.Cautious, 3);
		expect(MindLogic.getPersonalityLevel(profile, PersonalityType.Cautious)).toBe(3);
		expect(MindLogic.getPersonalityLevel(profile, PersonalityType.Bold)).toBe(0);
		expect(profile[PersonalityAxis.BoldCautious]).toBe(6);

		MindLogic.setPersonalityLevel(profile, PersonalityType.Bold, 0);
		expect(MindLogic.getPersonalityLevel(profile, PersonalityType.Cautious)).toBe(0);
		expect(profile[PersonalityAxis.BoldCautious]).toBe(MindLogic.neutralPersonalityAxisValue);
	});

	it('generates the same personality profile from the same random sequence', () => {
		const seededRng = (seed: number) => () => {
			seed = (seed * 1664525 + 1013904223) >>> 0;
			return seed / 0x100000000;
		};

		expect(MindLogic.createPersonality(seededRng(42))).toEqual(MindLogic.createPersonality(seededRng(42)));
	});

	it('migrates the former binary personality list to personality axes', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		Object.assign(hero.mind, { personality: [ PersonalityType.Bold, PersonalityType.Cautious ] });

		MindLogic.ensure(hero);

		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Bold)).toBe(3);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Cautious)).toBe(0);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Curious)).toBe(0);
		expect(hero.mind.personality[PersonalityAxis.BoldCautious]).toBe(0);
	});

	it('migrates the previous graded profile without inverting independent traits', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		Object.assign(hero.mind, {
			personality: {
				[PersonalityAxis.BoldCautious]: 1,
				[PersonalityAxis.CheerfulGloomy]: 5,
				[PersonalityAxis.GreedyGenerous]: 3,
				[PersonalityAxis.ProudHumble]: 2,
				Curious: 2,
				Loyal: 1,
				Wry: 3,
				Devout: 0
			}
		});

		MindLogic.ensure(hero);

		expect(hero.mind.personality[PersonalityAxis.BoldCautious]).toBe(1);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Cheerful)).toBe(0);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Gloomy)).toBe(2);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Curious)).toBe(2);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Content)).toBe(0);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Wry)).toBe(3);
		expect(MindLogic.getPersonalityLevel(hero.mind.personality, PersonalityType.Sincere)).toBe(0);
	});

	it('clamps personality levels to the supported range', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.mind.personality[PersonalityAxis.BoldCautious] = 8;
		hero.mind.personality[PersonalityAxis.CheerfulGloomy] = -2;

		MindLogic.ensure(hero);

		expect(hero.mind.personality[PersonalityAxis.BoldCautious]).toBe(MindLogic.maxPersonalityAxisValue);
		expect(hero.mind.personality[PersonalityAxis.CheerfulGloomy]).toBe(0);
	});

	it('remembers the newest thing first and does not duplicate', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		MindLogic.remember(hero, MemoryType.AllyFell, 'Anna');
		MindLogic.remember(hero, MemoryType.Wounded);
		MindLogic.remember(hero, MemoryType.AllyFell, 'Anna');
		expect(hero.mind.memories.map(m => m.type)).toEqual([ MemoryType.AllyFell, MemoryType.Wounded ]);
	});

	it('shapes personality gradually after significant experiences', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		Object.values(PersonalityAxis).forEach(axis => hero.mind.personality[axis] = MindLogic.neutralPersonalityAxisValue);

		MindLogic.remember(hero, MemoryType.SlewBoss, 'The Brute');
		MindLogic.remember(hero, MemoryType.KnockedOut, 'North');
		MindLogic.remember(hero, MemoryType.AllyFell, 'Anna');
		MindLogic.remember(hero, MemoryType.RegionConquered, 'The Marsh');

		expect(hero.mind.memories.find(memory => memory.type === MemoryType.SlewBoss)?.personalityChange).toBeDefined();
		expect(hero.mind.personality[PersonalityAxis.BoldCautious]).toBe(3);
		expect(hero.mind.personality[PersonalityAxis.CheerfulGloomy]).toBe(4);
		expect(hero.mind.personality[PersonalityAxis.ProudHumble]).toBe(2);
		expect(hero.mind.memories.map(memory => memory.personalityChange?.trait)).toEqual([
			PersonalityType.Proud,
			PersonalityType.Gloomy,
			PersonalityType.Cautious,
			PersonalityType.Bold
		]);
		expect(hero.mind.memories[0].personalityChange).toEqual({
			trait: PersonalityType.Proud,
			from: 3,
			to: 2,
			experience: 'conquering The Marsh'
		});
	});

	it('does not reapply personality changes when the same milestone is remembered again', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.mind.personality[PersonalityAxis.BoldCautious] = MindLogic.neutralPersonalityAxisValue;

		MindLogic.remember(hero, MemoryType.SlewBoss, 'The Brute');
		MindLogic.remember(hero, MemoryType.SlewBoss, 'The Brute');

		expect(hero.mind.personality[PersonalityAxis.BoldCautious]).toBe(2);
		expect(hero.mind.memories).toHaveLength(1);
		expect(hero.mind.memories[0].personalityChange?.from).toBe(3);
	});

	it('bounds repeated milestone changes and leaves routine events unchanged', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.mind.personality[PersonalityAxis.BoldCautious] = MindLogic.neutralPersonalityAxisValue;
		hero.mind.personality[PersonalityAxis.CheerfulGloomy] = MindLogic.neutralPersonalityAxisValue;

		for (let n = 0; n < 6; ++n) {
			MindLogic.remember(hero, MemoryType.SlewBoss, `Boss ${n}`);
		}
		MindLogic.remember(hero, MemoryType.Victory, 'North');
		MindLogic.remember(hero, MemoryType.Victory, 'South');

		expect(hero.mind.personality[PersonalityAxis.BoldCautious]).toBe(0);
		expect(hero.mind.personality[PersonalityAxis.CheerfulGloomy]).toBe(MindLogic.neutralPersonalityAxisValue);
		expect(hero.mind.memories.filter(memory => memory.type === MemoryType.Victory).every(memory => !memory.personalityChange)).toBe(true);
	});

	it('forgets the oldest memories beyond the cap', () => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		for (let n = 0; n < MindLogic.maxMemories + 5; ++n) {
			MindLogic.remember(hero, MemoryType.AllyFell, `Ally ${n}`);
		}
		expect(hero.mind.memories).toHaveLength(MindLogic.maxMemories);
		expect(hero.mind.memories[0].subject).toBe(`Ally ${MindLogic.maxMemories + 4}`);
	});

	it('does not give monsters memories', () => {
		const monster = Factory.createCombatant(CombatantType.Monster);
		MindLogic.remember(monster, MemoryType.Wounded);
		expect(monster.mind.memories).toHaveLength(0);
	});
});
