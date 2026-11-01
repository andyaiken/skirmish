import { ThoughtCategory as C } from '../../enums/thought-category';
import { PersonalityType as P } from '../../enums/personality-type';

import type { ThoughtTemplate } from '../../models/thought';

import { createThoughtBuilder, lower } from './thought-builder';

const make = createThoughtBuilder('equipment');

export const equipmentThoughts: ThoughtTemplate[] = [
	// Weapons
	make(C.Equipment, ctx => ctx.weapons.length > 0 ? { item: lower(ctx.pick(ctx.weapons).name) } : null, [
		'My {item} and I have been through a lot together.',
		'I sharpened my {item} again. It never hurts.',
		'I’d trust my {item} with my life, and sometimes I have.',
		'There’s nothing like the weight of a good {item} in the hand.',
		'I gave my {item} a polish this morning.',
		'I know the balance of my {item} better than I know my own stride.'
	], 2),
	make(C.Equipment, ctx => ctx.weapons.length === 0 ? {} : null, [
		'I could really use a weapon. Anything with an edge.',
		'I’m not much use with my bare hands. I’d like something to hold.',
		'Do you think anyone would notice if I borrowed a sword?',
		'I’d settle for a sturdy stick at this point.'
	], 2),
	make(C.Equipment, ctx => ctx.weapons.some(w => w.magic) ? { item: lower(ctx.pick(ctx.weapons.filter(w => w.magic)).name) } : null, [
		'My {item} hums sometimes. I try not to listen.',
		'The {item} is more than a weapon. It’s a promise.',
		'Every time I draw the {item}, I feel a little braver.',
		'I wonder if the {item} chose me, or if I just got lucky.'
	], 2),

	// Armour
	make(C.Equipment, ctx => ctx.armor.length > 0 ? { item: lower(ctx.pick(ctx.armor).name) } : null, [
		'My {item} has dents I know by name.',
		'A good {item} is worth more than a lot of courage.',
		'I never take off my {item} without a little sigh.',
		'I oiled my {item} last night. It’s a ritual now.',
		'I feel safer when I hear the buckles on my {item} click into place.'
	], 2),
	make(C.Equipment, ctx => ctx.armor.length === 0 ? {} : null, [
		'I wish I had some armour. I feel very exposed out there.',
		'A bit of armour would make me feel a lot better.',
		'If I’m hit one more time without armour, I’m going to complain loudly.',
		'I’d rather not learn how much a helmet helps by going without one.'
	], 2),

	// Magic
	make(C.Equipment, ctx => ctx.magicItems.length > 0 ? { item: lower(ctx.pick(ctx.magicItems).name) } : null, [
		'I still can’t believe I own a {item}.',
		'The {item} gives me confidence. I’m not sure it’s earned.',
		'I’ve been wondering who made the {item}, and why.',
		'My {item} looks ordinary. It isn’t.',
		'I’m still learning what the {item} can do. It keeps surprising me.'
	], 2),
	make(C.Equipment, ctx => ctx.magicItems.length >= 3 ? { count: String(ctx.magicItems.length) } : null, [
		'I carry {count} enchanted things. I’m beginning to jingle.',
		'With {count} magic items on me, I’m practically a wizard.',
		'I’ve started giving each enchanted thing a little more room in my pack.'
	]),
	make(C.Equipment, ctx => ctx.magicItems.length === 0 ? {} : null, [
		'I’d love a magic item. Just a small one.',
		'Everyone else has something enchanted. I have a good attitude.',
		'One day I’ll find something with a glow.',
		'I’d settle for a trinket that only glows when it’s useful.'
	]),

	// Things in the stores
	make(C.Equipment, ctx => ctx.wanted ? { item: lower(ctx.wanted.name) } : null, [
		'There’s a {item} in the Warehouse that I could use.',
		'I keep thinking about that {item} we’ve got in store. It might suit me.',
		'Is anyone using the {item} in the Warehouse? Because I’d like to.',
		'That {item} is gathering dust. It needs a home. Mine.',
		'I can picture the {item} in my hands already.'
	], 3),
	make(C.Equipment, ctx => (ctx.wanted && ctx.carried.length < 3) ? { item: lower(ctx.wanted.name) } : null, [
		'I’ve got room in my pack for that {item}. I’ll ask nicely.',
		'There’s space in my pack, and a {item} in the Warehouse. It could work.',
		'I’ll make room for the {item}. Somehow.'
	]),
	make(C.Equipment, ctx => ctx.carried.length >= 3 ? {} : null, [
		'My pack is full to bursting. I couldn’t squeeze in a button.',
		'I’m carrying too much. I can feel it in my shoulders.',
		'I need to decide what to leave behind. It’s harder than it sounds.',
		'I keep telling myself I’ll sort this pack out. Soon.'
	]),
	make(C.Equipment, ctx => ctx.carried.length === 0 ? {} : null, [
		'I’ve got room in my pack. We should fill it up.',
		'My pack is empty. It makes me nervous.',
		'I feel underprepared with nothing rattling around in there.'
	]),

	// Potions and scrolls
	make(C.Equipment, ctx => ctx.potions.length > 0 ? { item: lower(ctx.pick(ctx.potions).name) } : null, [
		'I’m saving my {item} for when it matters.',
		'I wonder if the {item} tastes as bad as it looks.',
		'The {item} is in my pocket. I check on it more often than I should.',
		'I like knowing the {item} is there, even if I hope not to need it.'
	], 1.5),
	make(C.Equipment, ctx => ctx.scrolls.length > 0 ? { item: lower(ctx.pick(ctx.scrolls).name) } : null, [
		'Reading the {item} would be easy. Doing it at the right moment, less so.',
		'I’ve got a {item} tucked away. I keep wondering what it would do.',
		'There’s something exciting about owning a {item}.',
		'I’ve read the {item} twice. I’m still not sure I understand it.'
	], 1.5),
	make(C.Equipment, ctx => (ctx.potions.length === 0 && ctx.scrolls.length === 0 && ctx.has(P.Cautious)) ? {} : null, [
		'I’d feel safer with a potion in my pack. Just one.',
		'No potions, no scrolls. I wouldn’t call that careful.',
		'I like to have a remedy for the things I can’t predict.'
	], 2),
	make(C.Equipment, ctx => ctx.has(P.Greedy) ? {} : null, [
		'I’ve been wondering what my gear would fetch. Don’t worry. I won’t sell it. Yet.',
		'Every item is a little fortune if you look at it right.',
		'I never throw anything away before finding out what it’s worth.'
	]),
	make(C.Equipment, ctx => ctx.has(P.Generous) && ctx.comrades.length > 0 ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'{Comrade} could use better gear than I have. I’ve been thinking about it.',
		'If {comrade} needs my spare kit, they only have to ask.',
		'I’d rather see {comrade} well equipped than keep an extra buckle.'
	]),
	make(C.Equipment, ctx => ctx.has(P.Wry) ? {} : null, [
		'My gear has a long and distinguished history of getting me into trouble.',
		'I bought good boots once. They were stolen. Lesson learned.',
		'I’ve got a very impressive collection of things that have broken.'
	]),

	// Progress
	make(C.Progress, ctx => ctx.readyToLevel ? { level: String(ctx.level + 1) } : null, [
		'I think I’m ready to be level {level}. I can feel it.',
		'I’ve earned my next level. I should see to it.',
		'Level {level} is within reach. I’ve got the experience for it.',
		'I’ve learned so much lately. Time to put it to use.',
		'The next level feels close enough to reach.'
	], 6),
	make(C.Progress, ctx => (ctx.level === 1 && !ctx.readyToLevel) ? {} : null, [
		'I’m still new at this. I’ve got a lot to learn.',
		'I’m only just starting out, but I’m eager.',
		'There’s so much more to learn. I’m itching to start.',
		'I’m still finding my feet. At least they’re pointed forward.'
	], 2),
	make(C.Progress, ctx => ctx.level >= 5 ? { level: String(ctx.level) } : null, [
		'Level {level}. I never thought I’d make it this far.',
		'I’m level {level} now. There are people who’d have bet against that.',
		'I’ve climbed to level {level}. What a long way up.',
		'Level {level}. I can see how far I’ve come from here.'
	], 1.5),
	make(C.Progress, ctx => ctx.level >= 10 ? { level: String(ctx.level) } : null, [
		'At level {level}, I’m starting to wonder what’s left to learn.',
		'Level {level}. I’ve made something of myself.',
		'I’ve learned enough to know how much more there is to learn.'
	], 2),
	make(C.Progress, ctx => (ctx.hero.xp > 0) ? { xp: String(ctx.hero.xp) } : null, [
		'I’ve got {xp} experience banked. I can’t wait to spend it.',
		'{Xp} experience, and nothing to show for it yet.',
		'I can feel all that experience waiting to become something.'
	])
];
