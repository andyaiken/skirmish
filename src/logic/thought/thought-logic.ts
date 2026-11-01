import { PersonalityType } from '../../enums/personality-type';
import { ThoughtCategory } from '../../enums/thought-category';

import type { ThoughtBindings, ThoughtContext, ThoughtModel, ThoughtTemplate } from '../../models/thought';
import type { CombatantModel } from '../../models/combatant';
import type { GameModel } from '../../models/game';

import { allThoughts } from '../../data/thoughts/index';
import { personalityVoices } from '../../data/thoughts/personality-voices';
import { withArticle } from '../../data/thoughts/thought-builder';

import { CampaignMapLogic } from '../campaign-map/campaign-map-logic';
import { CombatantLogic } from '../combatant/combatant-logic';
import { GameLogic } from '../game/game-logic';
import { MindLogic } from '../mind/mind-logic';
import { StrongholdLogic } from '../stronghold/stronghold-logic';

interface Recent {
	ids: string[];
	phrases: string[];
	categories: ThoughtCategory[];
}

interface StableThought {
	context: string;
	expiresAt: number;
	seed: number;
	thought: ThoughtModel;
}

export class ThoughtLogic {
	static maxRecentIDs = 40;
	static maxRecentTexts = 40;
	static maxRecentCategories = 5;
	static voiceChance = 0.6;
	static categoryRecencyPenalty = 0.65;
	static stabilityWindowMs = 5 * 60 * 1000;

	// What each hero has said lately, so that the same thought doesn't come round twice in a row.
	// This is deliberately not saved: it only has to last for a session.
	private static recent = new Map<string, Recent>();
	private static stable = new Map<string, StableThought>();

	static resetRecent = () => {
		ThoughtLogic.recent.clear();
		ThoughtLogic.stable.clear();
	};

	static buildContext = (game: GameModel, hero: CombatantModel, packIDs: string[], rng: () => number = Math.random): ThoughtContext => {
		MindLogic.ensure(hero);
		const mind = hero.mind;

		const speciesName = (h: CombatantModel) => GameLogic.getSpecies(h.speciesID)?.name ?? 'person';
		const roleName = (h: CombatantModel) => GameLogic.getRole(h.roleID)?.name ?? 'adventurer';

		const comrades = game.heroes.filter(h => h.id !== hero.id);

		const roleNames = GameLogic.getRoleDeck(packIDs).map(r => r.name);
		const have = new Set(game.heroes.map(h => roleName(h)));
		const missingRoles = roleNames.filter(r => !have.has(r));

		const built = new Set(game.stronghold.map(s => s.type));
		const unbuilt = GameLogic.getStructureDeck(packIDs).filter(s => StrongholdLogic.canBuild(s) && !built.has(s.type));
		const drained = game.stronghold.filter(s => StrongholdLogic.canCharge(s) && (s.charges === 0));

		const squares = game.map.squares;
		const conquered = squares.length > 0 ? squares.filter(sq => sq.regionID === '').length / squares.length : 0;
		const regions = game.map.regions;
		const targets = regions.filter(r => CampaignMapLogic.canAttackRegion(game, r));

		const all = [ ...hero.items, ...hero.carried ];
		const wanted = game.items.find(i => CombatantLogic.canEquip(hero, i)) ?? null;

		return {
			rng: rng,
			game: game,
			hero: hero,
			mind: mind,

			species: speciesName(hero),
			role: roleName(hero),
			background: GameLogic.getBackground(hero.backgroundID)?.name ?? 'nowhere in particular',
			level: hero.level,
			readyToLevel: !game.encounter && (hero.xp >= hero.level),
			battles: mind.history.encounters,

			traitLevel: p => MindLogic.getPersonalityLevel(mind.personality, p),
			has: p => MindLogic.getPersonalityLevel(mind.personality, p) >= MindLogic.personalityThoughtLevel,
			recall: (type, maxAge) => mind.memories.find(m => (m.type === type) && ((maxAge === undefined) || (m.age <= maxAge))) ?? null,
			pick: options => options[Math.floor(rng() * options.length)],

			comrades: comrades,
			roleOf: roleName,
			speciesOf: speciesName,
			canRecruit: GameLogic.canRecruitHero(game) && (game.heroSlots > 0),
			partyFull: !GameLogic.canRecruitHero(game),
			missingRoles: missingRoles,

			structures: game.stronghold,
			unbuilt: unbuilt,
			drained: drained,
			hasStructure: type => built.has(type),
			storesFill: game.items.length / GameLogic.maxItems,
			money: game.money,

			conquered: conquered,
			regionsLeft: regions.length,
			targets: targets,
			regions: regions,

			weapons: all.filter(i => !!i.weapon),
			armor: all.filter(i => !!i.armor),
			magicItems: all.filter(i => i.magic),
			carried: hero.carried,
			potions: all.filter(i => !!i.potion),
			scrolls: all.filter(i => !!i.scroll),
			wanted: wanted
		};
	};

	static expand = (text: string, bindings: ThoughtBindings) => {
		return text.replace(/\{(a )?(\w+)\}/g, (match, article: string | undefined, key: string) => {
			const capital = key[0] !== key[0].toLowerCase();
			const lowered = key[0].toLowerCase() + key.slice(1);
			const value = bindings[key] ?? bindings[lowered];
			if (value === undefined) {
				return match;
			}
			let result = article ? withArticle(value) : value;
			if (capital) {
				result = result[0].toUpperCase() + result.slice(1);
			}
			return result;
		});
	};

	// Colours a thought with one of the hero's personality traits, some of the time
	static applyVoice = (text: string, ctx: ThoughtContext) => {
		if (ctx.rng() >= ThoughtLogic.voiceChance) {
			return text;
		}

		const traits = Object.values(PersonalityType)
			.map(personality => ({ voice: personalityVoices[personality], weight: ctx.traitLevel(personality) }))
			.filter(trait => trait.weight > 0);
		const total = traits.reduce((sum, trait) => sum + trait.weight, 0);
		if (total === 0) {
			return text;
		}

		let roll = ctx.rng() * total;
		let voice = traits[traits.length - 1].voice;
		for (const trait of traits) {
			roll -= trait.weight;
			if (roll <= 0) {
				voice = trait.voice;
				break;
			}
		}

		if (!voice) {
			return text;
		}

		let result = voice.transform ? voice.transform(text) : text;
		const style = ctx.rng();
		if (style < 0.8 * voice.beforeRatio) {
			result = `${ctx.pick(voice.before)} ${result}`;
		} else if (style < 0.8) {
			result = `${result} ${ctx.pick(voice.after)}`;
		}
		return result;
	};

	static getCandidates = (ctx: ThoughtContext, templates: ThoughtTemplate[] = allThoughts) => {
		const candidates: { template: ThoughtTemplate; bindings: ThoughtBindings; weight: number }[] = [];
		templates.forEach(template => {
			const bindings = template.when(ctx);
			if (bindings) {
				const weight = typeof template.weight === 'function' ? template.weight(ctx) : template.weight;
				if (weight > 0) {
					candidates.push({ template: template, bindings: bindings, weight: weight });
				}
			}
		});
		return candidates;
	};

	private static getThoughtCandidates = (ctx: ThoughtContext, templates: ThoughtTemplate[]) => {
		return ThoughtLogic.getCandidates(ctx, templates).map(candidate => ({
			...candidate,
			phrases: candidate.template.say.map(s => ThoughtLogic.expand(s, candidate.bindings))
		}));
	};

	private static chooseThought = (
		ctx: ThoughtContext,
		hero: CombatantModel,
		all: ReturnType<typeof ThoughtLogic.getThoughtCandidates>
	): ThoughtModel => {
		if (all.length === 0) {
			return { id: 'none', category: ThoughtCategory.Musing, text: '…' };
		}

		const memory = ThoughtLogic.recent.get(hero.id) ?? { ids: [], phrases: [], categories: [] };

		let pool = all.filter(c => !memory.ids.includes(c.template.id));
		if (pool.length === 0) {
			pool = all;
		}

		let fresh = pool.filter(c => c.phrases.some(p => !memory.phrases.includes(p)));
		if (fresh.length === 0) {
			fresh = all.filter(c => c.phrases.some(p => !memory.phrases.includes(p)));
		}
		if (fresh.length > 0) {
			pool = fresh;
		}

		const categoryWeight = (category: ThoughtCategory) => {
			const index = memory.categories.lastIndexOf(category);
			if (index < 0) {
				return 1;
			}
			const age = memory.categories.length - index;
			return Math.pow(ThoughtLogic.categoryRecencyPenalty, 1 / age);
		};

		const total = pool.reduce((sum, c) => sum + c.weight * categoryWeight(c.template.category), 0);
		let roll = ctx.rng() * total;
		let chosen = pool[pool.length - 1];
		for (const c of pool) {
			roll -= c.weight * categoryWeight(c.template.category);
			if (roll <= 0) {
				chosen = c;
				break;
			}
		}

		const freshPhrases = chosen.phrases.filter(p => !memory.phrases.includes(p));
		const options = freshPhrases.length > 0 ? freshPhrases : chosen.phrases;
		const base = options[Math.floor(ctx.rng() * options.length)];
		// Personality thoughts are already in the hero's voice
		const text = chosen.template.category === ThoughtCategory.Personality ? base : ThoughtLogic.applyVoice(base, ctx);

		memory.ids.push(chosen.template.id);
		memory.phrases.push(base);
		memory.categories.push(chosen.template.category);
		memory.ids = memory.ids.slice(-ThoughtLogic.maxRecentIDs);
		memory.phrases = memory.phrases.slice(-ThoughtLogic.maxRecentTexts);
		memory.categories = memory.categories.slice(-ThoughtLogic.maxRecentCategories);
		ThoughtLogic.recent.set(hero.id, memory);

		return {
			id: chosen.template.id,
			category: chosen.template.category,
			text: text
		};
	};

	static getThought = (
		game: GameModel,
		hero: CombatantModel,
		packIDs: string[],
		rng: () => number = Math.random,
		templates: ThoughtTemplate[] = allThoughts
	): ThoughtModel => {
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs, rng);
		return ThoughtLogic.chooseThought(ctx, hero, ThoughtLogic.getThoughtCandidates(ctx, templates));
	};

	static getStableThought = (
		game: GameModel,
		hero: CombatantModel,
		packIDs: string[],
		rng: () => number = Math.random,
		templates: ThoughtTemplate[] = allThoughts
	): ThoughtModel => {
		const now = Date.now();
		const cached = ThoughtLogic.stable.get(hero.id);
		const hasValidCache = !!cached && (cached.expiresAt > now);
		const seed = hasValidCache ? cached.seed : Math.floor(rng() * 0x100000000);
		let state = seed;
		const stableRng = () => {
			state = (state * 1664525 + 1013904223) >>> 0;
			return state / 0x100000000;
		};
		const ctx = ThoughtLogic.buildContext(game, hero, packIDs, stableRng);
		const all = ThoughtLogic.getThoughtCandidates(ctx, templates);
		const context = JSON.stringify(all.map(candidate => [
			candidate.template.id,
			candidate.template.category,
			candidate.weight,
			candidate.bindings,
			candidate.phrases
		]));
		if (hasValidCache && (cached.context === context)) {
			return { ...cached.thought };
		}

		const thought = ThoughtLogic.chooseThought(ctx, hero, all);
		ThoughtLogic.stable.set(hero.id, {
			context: context,
			expiresAt: now + ThoughtLogic.stabilityWindowMs,
			seed: seed,
			thought: thought
		});
		return thought;
	};
}
