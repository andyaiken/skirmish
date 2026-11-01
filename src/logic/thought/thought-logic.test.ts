import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PersonalityAxis, PersonalityType, personalityAxes } from '../../enums/personality-type';

import { CombatantType } from '../../enums/combatant-type';
import { MemoryType } from '../../enums/memory-type';
import { ThoughtCategory } from '../../enums/thought-category';

import type { ThoughtTemplate } from '../../models/thought';

import { allThoughts } from '../../data/thoughts';
import { personalityVoices } from '../../data/thoughts/personality-voices';

import { Factory } from '../factory/factory';
import { GameLogic } from '../game/game-logic';
import { MindLogic } from '../mind/mind-logic';
import { PackLogic } from '../pack/pack-logic';
import { ThoughtLogic } from './thought-logic';

const packIDs = () => PackLogic.getAllPacks().map(p => p.id);

const seededRng = (seed: number) => () => {
	seed = (seed * 1664525 + 1013904223) >>> 0;
	return seed / 0x100000000;
};

const setTraitLevel = (hero: ReturnType<typeof Factory.createCombatant>, trait: PersonalityType, level: number) => {
	MindLogic.setPersonalityLevel(hero.mind.personality, trait, level);
};

const clearTraits = (hero: ReturnType<typeof Factory.createCombatant>) => {
	Object.values(PersonalityAxis).forEach(axis => {
		MindLogic.setPersonalityLevel(hero.mind.personality, personalityAxes[axis].left, 0);
	});
};

const measureSelectionRate = (game: ReturnType<typeof Factory.createGame>, hero: ReturnType<typeof Factory.createCombatant>, target: ThoughtTemplate, alternative: ThoughtTemplate, seed: number) => {
	const rng = seededRng(seed);
	let selected = 0;
	const trials = 500;

	for (let n = 0; n < trials; ++n) {
		ThoughtLogic.resetRecent();
		if (ThoughtLogic.getThought(game, hero, [], rng, [ target, alternative ]).id === target.id) {
			selected += 1;
		}
	}

	return selected / trials;
};

const createFixture = () => {
	const game = Factory.createGame(packIDs());
	const species = PackLogic.getAllPacks().flatMap(p => PackLogic.getHeroSpecies(p.id));
	const roles = GameLogic.getRoleDeck(packIDs());
	const backgrounds = GameLogic.getBackgroundDeck(packIDs());

	for (let n = 0; n < 4; ++n) {
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.name = `Hero ${n}`;
		hero.speciesID = species[n % species.length].id;
		hero.roleID = roles[n % roles.length].id;
		hero.backgroundID = backgrounds[n % backgrounds.length].id;
		game.heroes.push(hero);
	}
	game.money = 120;

	const hero = game.heroes[0];
	hero.xp = hero.level;
	MindLogic.remember(hero, MemoryType.Wounded, 'Hero 1');
	MindLogic.remember(hero, MemoryType.SlewBoss, 'Grub', 0, 'Goblin');
	return { game, hero };
};

describe('thought templates', () => {
	it('have unique ids and several phrasings', () => {
		const ids = allThoughts.map(t => t.id);
		expect(new Set(ids).size).toBe(ids.length);
		allThoughts.forEach(t => expect(t.say.length, t.id).toBeGreaterThanOrEqual(1));
		expect(allThoughts.length).toBeGreaterThan(150);
		expect(allThoughts.reduce((sum, t) => sum + t.say.length, 0)).toBeGreaterThan(500);
	});
});

describe('ThoughtLogic', () => {
	beforeEach(() => ThoughtLogic.resetRecent());

	it('expands placeholders', () => {
		expect(ThoughtLogic.expand('{Region} and {region}, {a item}, {an}', { region: 'north', item: 'axe' })).toBe('North and north, an axe, {an}');
	});

	it('never leaves a placeholder unexpanded', () => {
		const { game, hero } = createFixture();
		for (let n = 0; n < 500; ++n) {
			const thought = ThoughtLogic.getThought(game, hero, packIDs());
			expect(thought.text, thought.id).not.toMatch(/\{\w|\{a /);
			expect(thought.text.length).toBeGreaterThan(0);
		}
	});

	it('every applicable template expands fully', () => {
		const { game, hero } = createFixture();
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		for (let n = 0; n < 50; ++n) {
			ThoughtLogic.getCandidates(ctx).forEach(c => {
				c.template.say.forEach(s => expect(ThoughtLogic.expand(s, c.bindings), c.template.id).not.toMatch(/\{/));
			});
		}
	});

	it('gives plenty of variety', () => {
		const { game, hero } = createFixture();
		const texts = new Set<string>();
		const rng = seededRng(7);
		for (let n = 0; n < 200; ++n) {
			texts.add(ThoughtLogic.getThought(game, hero, packIDs(), rng).text);
		}
		expect(texts.size).toBeGreaterThan(100);
	});

	it('is deterministic with a seeded random number generator', () => {
		const { game, hero } = createFixture();
		const getSequence = () => {
			ThoughtLogic.resetRecent();
			const rng = seededRng(42);
			return Array.from({ length: 30 }, () => ThoughtLogic.getThought(game, hero, packIDs(), rng).text);
		};

		expect(getSequence()).toEqual(getSequence());
	});

	it('keeps hero-sheet thoughts stable within the window but refreshes when context changes', () => {
		const { game, hero } = createFixture();
		const templates: ThoughtTemplate[] = [
			{ id: 'funded', category: ThoughtCategory.Musing, weight: 1, when: ctx => ctx.money > 0 ? {} : null, say: [ 'The coffers are full.' ] },
			{ id: 'empty', category: ThoughtCategory.Musing, weight: 1, when: ctx => ctx.money === 0 ? {} : null, say: [ 'The coffers are empty.' ] }
		];

		const first = ThoughtLogic.getStableThought(game, hero, [], () => 0, templates);
		const repeated = ThoughtLogic.getStableThought(game, hero, [], () => 0.99, templates);
		expect(repeated).toEqual(first);

		game.money = 0;
		const changed = ThoughtLogic.getStableThought(game, hero, [], () => 0, templates);
		expect(changed.id).toBe('empty');
	});

	it('keeps randomized thought bindings stable within the window', () => {
		const { game, hero } = createFixture();
		const templates: ThoughtTemplate[] = [
			{ id: 'comrade', category: ThoughtCategory.Musing, weight: 1, when: ctx => ({ comrade: ctx.pick(ctx.comrades).name }), say: [ 'I should speak with {comrade}.' ] }
		];

		const first = ThoughtLogic.getStableThought(game, hero, [], () => 0, templates);
		const repeated = ThoughtLogic.getStableThought(game, hero, [], () => 0.99, templates);
		expect(repeated).toEqual(first);
	});

	it('chooses a fresh thought after the stability window expires', () => {
		const { game, hero } = createFixture();
		clearTraits(hero);
		const templates: ThoughtTemplate[] = [
			{ id: 'stable', category: ThoughtCategory.Musing, weight: 1, when: () => ({}), say: [ 'First phrasing.', 'Second phrasing.' ] }
		];

		vi.useFakeTimers();
		vi.setSystemTime(new Date(0));
		try {
			const first = ThoughtLogic.getStableThought(game, hero, [], () => 0, templates);
			expect(first.text).toBe('First phrasing.');
			expect(ThoughtLogic.getStableThought(game, hero, [], () => 0.99, templates).text).toBe(first.text);

			vi.advanceTimersByTime(ThoughtLogic.stabilityWindowMs);
			const refreshed = ThoughtLogic.getStableThought(game, hero, [], () => 0.99, templates);
			expect(refreshed.text).toBe('Second phrasing.');
		} finally {
			vi.useRealTimers();
		}
	});

	it('does not repeat itself back to back', () => {
		const { game, hero } = createFixture();
		const rng = seededRng(17);
		let last = '';
		for (let n = 0; n < 100; ++n) {
			const thought = ThoughtLogic.getThought(game, hero, packIDs(), rng);
			expect(thought.text).not.toBe(last);
			last = thought.text;
		}
	});

	it('allows category repetition when that category remains a candidate', () => {
		const { game, hero } = createFixture();
		const templates: ThoughtTemplate[] = [
			{ id: 'memory-a', category: ThoughtCategory.Memory, weight: 1, when: () => ({}), say: [ 'Memory A.' ] },
			{ id: 'memory-b', category: ThoughtCategory.Memory, weight: 1, when: () => ({}), say: [ 'Memory B.' ] },
			{ id: 'island-a', category: ThoughtCategory.Island, weight: 1, when: () => ({}), say: [ 'Island A.' ] }
		];

		const first = ThoughtLogic.getThought(game, hero, [], () => 0, templates);
		const second = ThoughtLogic.getThought(game, hero, [], () => 0, templates);

		expect(first.category).toBe(ThoughtCategory.Memory);
		expect(second.category).toBe(ThoughtCategory.Memory);
	});

	it('avoids a repeated base phrase even when personality voice changes its presentation', () => {
		const { game, hero } = createFixture();
		setTraitLevel(hero, PersonalityType.Cautious, 3);
		const templates: ThoughtTemplate[] = [
			{ id: 'first', category: ThoughtCategory.Musing, weight: 1, when: () => ({}), say: [ 'The road is quiet.' ] },
			{ id: 'repeat', category: ThoughtCategory.Musing, weight: 1, when: () => ({}), say: [ 'The road is quiet.' ] },
			{ id: 'fresh', category: ThoughtCategory.Musing, weight: 1, when: () => ({}), say: [ 'The road bends east.' ] }
		];

		const first = ThoughtLogic.getThought(game, hero, [], () => 0, templates);
		const second = ThoughtLogic.getThought(game, hero, [], () => 0, templates);

		expect(first.text).toContain('The road is quiet.');
		expect(second.id).toBe('fresh');
		expect(second.text).not.toContain('The road is quiet.');
	});

	it('selects ready-to-level thoughts more often than neutral thoughts', () => {
		const { game, hero } = createFixture();
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		const candidates = ThoughtLogic.getCandidates(ctx);
		const readyThought = candidates.find(c => c.template.say.some(s => s.includes('ready to be level')))?.template;
		const neutralThought = candidates.find(c => c.template.category === ThoughtCategory.Musing)?.template;

		expect(ctx.readyToLevel).toBe(true);
		if (!readyThought || !neutralThought) {
			throw new Error('Expected ready-to-level and neutral thoughts to be eligible');
		}

		const selectedRate = measureSelectionRate(game, hero, readyThought, neutralThought, 101);
		expect(selectedRate).toBeGreaterThan(0.75);
	});

	it('surfaces recent memories more often than older memories', () => {
		const { game, hero } = createFixture();
		MindLogic.remember(hero, MemoryType.Victory, 'North');
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		const candidates = ThoughtLogic.getCandidates(ctx);
		const victoryThought = candidates.find(c => c.template.say.some(s => s.includes('I keep turning it over in my head')))?.template;
		const neutralThought = candidates.find(c => c.template.category === ThoughtCategory.Musing)?.template;

		if (!victoryThought || !neutralThought) {
			throw new Error('Expected recent-victory and neutral thoughts to be eligible');
		}

		const recentRate = measureSelectionRate(game, hero, victoryThought, neutralThought, 202);
		hero.mind.memories[0].age = 5;
		const olderRate = measureSelectionRate(game, hero, victoryThought, neutralThought, 202);

		expect(recentRate).toBeGreaterThan(olderRate + 0.15);
	});

	it('filters thoughts through personality', () => {
		const { game, hero } = createFixture();
		clearTraits(hero);
		setTraitLevel(hero, PersonalityType.Gloomy, 3);
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs(), seededRng(10));
		const voice = personalityVoices[PersonalityType.Gloomy];
		const voiced = new Set<string>();
		for (let n = 0; n < 100; ++n) {
			const text = ThoughtLogic.applyVoice('The Forge is warm.', ctx);
			if (text !== 'The Forge is warm.') {
				voiced.add(text);
				expect([ ...voice.before, ...voice.after ].some(s => text.includes(s))).toBe(true);
			}
		}
		expect(voiced.size).toBeGreaterThan(3);
	});

	it('gives each personality a distinct speech cadence', () => {
		const { game, hero } = createFixture();
		const prefixRate = (personality: PersonalityType) => {
			clearTraits(hero);
			setTraitLevel(hero, personality, 3);
			const rng = seededRng(92);
			const ctx = ThoughtLogic.buildContext(game, hero, packIDs(), rng);
			const voice = personalityVoices[personality];
			let prefixed = 0;
			const trials = 500;

			for (let n = 0; n < trials; ++n) {
				const text = ThoughtLogic.applyVoice('The road is quiet.', ctx);
				if (voice.before.some(prefix => text.startsWith(`${prefix} `))) {
					prefixed += 1;
				}
			}

			return prefixed / trials;
		};

		expect(prefixRate(PersonalityType.Bold)).toBeGreaterThan(prefixRate(PersonalityType.Cautious) + 0.15);
	});

	it('lets a stronger trait dominate voice when multiple traits are present', () => {
		const { game, hero } = createFixture();
		clearTraits(hero);
		setTraitLevel(hero, PersonalityType.Bold, 3);
		setTraitLevel(hero, PersonalityType.Curious, 1);
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs(), seededRng(73));
		const boldVoice = personalityVoices[PersonalityType.Bold];
		const cautiousVoice = personalityVoices[PersonalityType.Cautious];
		let bold = 0;
		let cautious = 0;

		for (let n = 0; n < 1000; ++n) {
			const text = ThoughtLogic.applyVoice('The road is quiet.', ctx);
			if ([ ...boldVoice.before, ...boldVoice.after ].some(line => text.includes(line))) {
				bold += 1;
			} else if ([ ...cautiousVoice.before, ...cautiousVoice.after ].some(line => text.includes(line))) {
				cautious += 1;
			}
		}

		expect(bold).toBeGreaterThan(cautious * 2);
	});

	it('uses trait strength to gate and weight personality thoughts', () => {
		const { game, hero } = createFixture();
		setTraitLevel(hero, PersonalityType.Bold, 1);
		let ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ctx.has(PersonalityType.Bold)).toBe(false);

		setTraitLevel(hero, PersonalityType.Bold, 2);
		ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ctx.has(PersonalityType.Bold)).toBe(true);
		expect(ctx.traitLevel(PersonalityType.Bold)).toBe(2);

		const boldThought = ThoughtLogic.getCandidates(ctx).find(c => c.template.say.includes('Nothing worth doing was ever done carefully.'));
		expect(boldThought?.weight).toBe(2);
	});

	it('uses one axis to choose between opposite personality thoughts', () => {
		const { game, hero } = createFixture();
		clearTraits(hero);
		setTraitLevel(hero, PersonalityType.Cheerful, 3);
		let ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ctx.has(PersonalityType.Cheerful)).toBe(true);
		expect(ctx.has(PersonalityType.Gloomy)).toBe(false);

		setTraitLevel(hero, PersonalityType.Gloomy, 3);
		ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ctx.has(PersonalityType.Cheerful)).toBe(false);
		expect(ctx.has(PersonalityType.Gloomy)).toBe(true);
		const candidates = ThoughtLogic.getCandidates(ctx);
		expect(candidates.some(c => c.template.say.includes('I expect it’ll rain. It usually does.'))).toBe(true);
		expect(candidates.some(c => c.template.say.includes('What a lovely day for it!'))).toBe(false);
		expect(hero.mind.personality[PersonalityAxis.CheerfulGloomy]).toBe(MindLogic.maxPersonalityAxisValue);
	});

	it('requires every strong pole for multi-axis personality thoughts', () => {
		const { game, hero } = createFixture();
		clearTraits(hero);
		const combinations: [ PersonalityType, PersonalityType, string ][] = [
			[ PersonalityType.Bold, PersonalityType.Gloomy, 'If doom is coming, I may as well meet it standing.' ],
			[ PersonalityType.Cautious, PersonalityType.Cheerful, 'We will be fine. I have checked every way this could go wrong.' ],
			[ PersonalityType.Curious, PersonalityType.Skeptical, 'A mystery is an invitation. A claim is not evidence.' ],
			[ PersonalityType.Loyal, PersonalityType.Wry, 'I would follow this company anywhere. Preferably somewhere with a bed.' ],
			[ PersonalityType.Greedy, PersonalityType.Proud, 'If we are going to risk our necks, we should get paid and remembered.' ],
			[ PersonalityType.Generous, PersonalityType.Humble, 'I gave what I could. No need to make a story of it.' ],
			[ PersonalityType.Independent, PersonalityType.Sincere, 'I walk my own road, and I will tell you plainly where it leads.' ],
			[ PersonalityType.Devout, PersonalityType.Cautious, 'I trust the gods. I still check the door twice.' ]
		];

		combinations.forEach(([ first, second, phrase ]) => {
			setTraitLevel(hero, first, 2);
			setTraitLevel(hero, second, 2);
			let ctx = ThoughtLogic.buildContext(game, hero, packIDs());
			let candidate = ThoughtLogic.getCandidates(ctx).find(c => c.template.say.includes(phrase));
			expect(candidate, phrase).toBeDefined();
			expect(candidate?.weight).toBe(2);

			setTraitLevel(hero, second, 1);
			ctx = ThoughtLogic.buildContext(game, hero, packIDs());
			candidate = ThoughtLogic.getCandidates(ctx).find(c => c.template.say.includes(phrase));
			expect(candidate, phrase).toBeUndefined();
			setTraitLevel(hero, second, 0);
		});

		setTraitLevel(hero, PersonalityType.Cautious, 3);
		setTraitLevel(hero, PersonalityType.Gloomy, 3);
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ThoughtLogic.getCandidates(ctx).some(c => c.template.say.includes(combinations[0][2]))).toBe(false);
		expect(ThoughtLogic.getCandidates(ctx).some(c => c.template.say.includes(combinations[1][2]))).toBe(false);
	});

	it('generates thoughts from either pole of each personality axis', () => {
		const { game, hero } = createFixture();
		clearTraits(hero);
		setTraitLevel(hero, PersonalityType.Content, 3);
		let ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ctx.has(PersonalityType.Curious)).toBe(false);
		expect(ctx.has(PersonalityType.Content)).toBe(true);
		expect(ThoughtLogic.getCandidates(ctx).some(c => c.template.say.includes('Not everything needs improving. Some things are good as they are.'))).toBe(true);

		setTraitLevel(hero, PersonalityType.Curious, 3);
		ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ctx.has(PersonalityType.Curious)).toBe(true);
		expect(ctx.has(PersonalityType.Content)).toBe(false);
	});

	it('mentions recent experiences', () => {
		const { game, hero } = createFixture();
		const ids = ThoughtLogic.getCandidates(ThoughtLogic.buildContext(game, hero, packIDs())).map(c => c.template.id);
		expect(ids.some(id => id.startsWith('memory'))).toBe(true);
	});

	it('thinks back on recent personality changes and lets old callbacks fade', () => {
		const { game, hero } = createFixture();
		hero.mind.memories = [];
		hero.mind.personality[PersonalityAxis.BoldCautious] = MindLogic.neutralPersonalityAxisValue;
		MindLogic.remember(hero, MemoryType.SlewBoss, 'The Brute');
		let ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		const callback = ThoughtLogic.getCandidates(ctx).find(c => c.template.say.some(s => s.includes('{experience}')));

		expect(callback).toBeDefined();
		expect(ThoughtLogic.expand(callback?.template.say[0] ?? '', callback?.bindings ?? {})).toContain('defeating The Brute');

		for (let n = 0; n < 7; ++n) {
			MindLogic.age([ hero ]);
		}
		ctx = ThoughtLogic.buildContext(game, hero, packIDs());
		expect(ThoughtLogic.getCandidates(ctx).some(c => c.template.say.some(s => s.includes('{experience}')))).toBe(false);
	});

	it('calls back to injuries, enemies, and places while their memories remain recent', () => {
		const { game, hero } = createFixture();
		const callbacks = [
			{ type: MemoryType.Wounded, subject: 'Blackfen', maxAge: 8, phrase: 'The ache takes me back to {region}.' },
			{ type: MemoryType.SlewBoss, subject: 'The Brute', maxAge: 12, phrase: 'I wonder what {boss} was like before we met.' },
			{ type: MemoryType.RegionConquered, subject: 'Ashen Coast', maxAge: 8, phrase: 'I think about {region} sometimes.' }
		];

		callbacks.forEach(({ type, subject, maxAge, phrase }) => {
			hero.mind.memories = [];
			MindLogic.remember(hero, type, subject);

			const findCallback = () => ThoughtLogic.getCandidates(ThoughtLogic.buildContext(game, hero, packIDs()))
				.find(candidate => candidate.template.say[0].startsWith(phrase));
			const recent = findCallback();

			expect(recent).toBeDefined();
			expect(ThoughtLogic.expand(phrase, recent?.bindings ?? {})).toContain(subject);

			const memory = hero.mind.memories[0];
			memory.age = Math.floor(maxAge / 2);
			expect(findCallback()?.weight).toBeLessThan(recent?.weight ?? 0);

			memory.age = maxAge + 1;
			expect(findCallback()).toBeUndefined();
		});
	});
});
