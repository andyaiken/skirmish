import { ThoughtCategory as C } from '../../enums/thought-category';
import { PersonalityType as P } from '../../enums/personality-type';
import { StructureType as S } from '../../enums/structure-type';

import type { ThoughtContext, ThoughtTemplate } from '../../models/thought';

import { createThoughtBuilder, lower } from './thought-builder';

const make = createThoughtBuilder('island');

const target = (ctx: ThoughtContext) => {
	if (ctx.targets.length === 0) {
		return null;
	}
	const region = ctx.pick(ctx.targets);
	return { region: region.name, terrain: lower(region.demographics.terrain), population: String(region.demographics.population) };
};

const terrainLines: Record<string, string[]> = {
	forest: [
		'Forests hide everything. Friends, enemies, lost socks.',
		'I’d rather fight in a forest than a field. There’s cover.',
		'The forest goes quiet when something is listening.'
	],
	jungle: [
		'Jungles are all noise and damp. I can’t decide if I like them.',
		'Everything in a jungle wants to eat you, and not all of it has teeth.',
		'I’ve never been dry for long in the jungle.'
	],
	mountains: [
		'The mountains are close. I can feel them in my knees.',
		'Anything that lives in the mountains is tougher than it looks.',
		'Every path up there feels steeper on the way back.'
	],
	marshland: [
		'Marsh fights are the worst. You can never get your boots dry.',
		'The marshes make everything slow. Including me.',
		'I don’t trust ground that makes a noise when you step on it.'
	],
	desert: [
		'A desert is mostly an argument about water.',
		'Sand gets into everything. Everything.',
		'There’s nowhere to hide from the sun in the desert.'
	],
	plains: [
		'Open plains: nowhere to hide, nowhere to be surprised.',
		'A flat fight is an honest fight.',
		'The wind carries every sound across the plains.'
	],
	volcanic: [
		'Volcanic ground. I’d rather not be standing on it when it changes its mind.',
		'The ground there is warm. It shouldn’t be.',
		'I keep wondering how long the stones have been glowing.'
	],
	taiga: [
		'Taiga is cold, quiet and long. I like it. I think.',
		'The pines go on forever up there.',
		'Snow makes the whole world sound far away.'
	],
	steppe: [
		'The steppe is all sky. It makes a person feel small.',
		'You can see an enemy coming for miles on the steppe. That cuts both ways.',
		'I’ve never seen so much sky in one place.'
	],
	fens: [
		'The fens always look like something is watching.',
		'Fog and water. I do not trust the fens.',
		'Every path in the fens seems to lead somewhere else.'
	],
	wetlands: [
		'Wetlands are all mud and mosquitos.',
		'I’d fight anywhere before the wetlands.',
		'The wetland mud has claimed another boot. I’m keeping count.'
	],
	lakes: [
		'A lake country. Lots of water, lots of room for surprises.',
		'The lakes up there look peaceful. That’s what worries me.',
		'I wonder what lives beneath all that still water.'
	]
};

export const islandThoughts: ThoughtTemplate[] = [
	// Where next
	make(C.Island, target, [
		'We should attack {region} next.',
		'I think {region} is the one to take next.',
		'{Region} is next. I can feel it.',
		'Our next move has to be {region}.',
		'When do we march on {region}?',
		'I keep finding my way back to {region} on the map.'
	], 3),
	make(C.Island, ctx => (ctx.targets.length > 0 && ctx.has(P.Bold)) ? target(ctx) : null, [
		'Let’s go to {region} right now. What are we waiting for?',
		'{Region} won’t take itself. We’d better hurry.',
		'I’d take {region} with half a company and a sharp stick.',
		'Point me at {region}. I’m ready.'
	], 2),
	make(C.Island, ctx => (ctx.targets.length > 0 && ctx.has(P.Cautious)) ? target(ctx) : null, [
		'{Region} is a worry. We should know more before we go.',
		'If we go to {region}, we need to be ready. Properly ready.',
		'I’d feel better about {region} with a spare healing potion or two.',
		'Let’s learn what we can about {region} before we commit.'
	], 2),
	make(C.Island, ctx => (ctx.targets.length > 1) ? { a: ctx.targets[0].name, b: ctx.targets[1].name } : null, [
		'{A} or {B}? I can’t decide which we should take first.',
		'We could go to {a}, or we could go to {b}. I keep changing my mind.',
		'Both {a} and {b} are calling. I wish one would be more specific.'
	]),
	make(C.Island, ctx => (ctx.targets.length > 0 && ctx.money >= 150) ? target(ctx) : null, [
		'We could buy {region} outright if we wanted to. I’m not sure we should.',
		'There’s enough in the coffers to buy {region} and skip the fighting.',
		'Buying {region} would be a different sort of victory.'
	]),
	make(C.Island, ctx => ctx.targets.length === 1 ? target(ctx) : null, [
		'Only {region} left to try. Choice is not a problem right now.',
		'There’s only one road ahead of us, and it leads to {region}.',
		'No need to debate it: {region} is waiting.'
	]),

	// The land
	make(C.Island, ctx => {
		const t = target(ctx);
		return (t && terrainLines[t.terrain]) ? { ...t, line: ctx.pick(terrainLines[t.terrain]) } : null;
	}, [
		'{Region} is {terrain} country. {Line}',
		'They say {region} is all {terrain}. {Line}',
		'I picture {region} as {terrain} country. {Line}'
	], 2),
	make(C.Island, target, [
		'{Region} is {terrain} country, they say.',
		'I’ve never seen {terrain} country, but I’ve heard stories about {region}.',
		'I’ve been looking at the map. {Region} is {terrain}. It matters.',
		'{Region} sounds unlike anywhere I’ve been before.'
	]),
	make(C.Island, ctx => {
		const t = target(ctx);
		return (t && Number(t.population) > 0) ? t : null;
	}, [
		'Do you think anyone lives in {region}? I think people live there.',
		'There are people in {region}, and they’re waiting for someone to help.',
		'I’d like to think about the people in {region}, and what we’d find there.',
		'We should remember that {region} is someone’s home.'
	]),
	make(C.Island, ctx => ctx.regions.length > 0 ? { region: ctx.pick(ctx.regions).name } : null, [
		'I’ve been studying the map. {Region} is a strange name for a place.',
		'Someone should go to {region} and write a book about it.',
		'I wonder what the people of {region} think of us.',
		'What’s in {region}? Nobody’s told me.',
		'There must be a reason people stay in {region}. I’d like to know it.'
	]),

	// Progress
	make(C.Island, ctx => (ctx.conquered > 0 && ctx.conquered < 0.15) ? {} : null, [
		'We’ve barely scratched the island. A long road lies ahead.',
		'There’s so much of the island still out there. It’s a little daunting.',
		'We’ve only just started. I’ve got a good feeling.',
		'The map is still mostly a promise.'
	]),
	make(C.Island, ctx => (ctx.conquered >= 0.15 && ctx.conquered < 0.5) ? {} : null, [
		'We’re a good way into this. The island is starting to feel like ours.',
		'It’s starting to feel like home, this island.',
		'A fair bit of the island has fallen to us. I like the sound of that.',
		'We’re making our mark on this place, one region at a time.'
	]),
	make(C.Island, ctx => (ctx.conquered >= 0.5 && ctx.conquered < 0.85) ? {} : null, [
		'More than half of the island is ours. I can hardly believe it.',
		'We’ve done so much. There’s no turning back now.',
		'When I look at the map, it’s mostly our colour now.',
		'I remember when all of this was unknown to us.'
	], 1.5),
	make(C.Island, ctx => (ctx.conquered >= 0.85 && ctx.regionsLeft > 0) ? { count: String(ctx.regionsLeft) } : null, [
		'Nearly done. Just {count} more to go.',
		'It’s almost over. Only {count} more regions.',
		'The end is in sight. I don’t know what I’ll do without a war.',
		'We should make these last {count} regions count.'
	], 2),
	make(C.Island, ctx => ctx.regionsLeft > 0 ? { count: String(ctx.regionsLeft) } : null, [
		'There are still {count} regions out there to deal with.',
		'{Count} regions to go. That’s a lot of mud.',
		'I’ve counted {count} regions on the map, and that’s plenty.',
		'{Count} places still have their own stories to tell.'
	]),
	make(C.Island, ctx => ctx.conquered === 0 ? {} : null, [
		'This is only the beginning. We haven’t taken a single acre.',
		'We haven’t won anything yet. But we will.',
		'The first step is the hardest. Let’s take it.'
	], 2),

	// The sea
	make(C.Island, ctx => !ctx.hasStructure(S.Shipyard) ? {} : null, [
		'I’ve been looking out to sea. We can only reach what’s next door.',
		'Without ships, we’re tied to the coast we have.',
		'You can’t sail on a hope. We’d need a Shipyard.',
		'I’d like to see what’s beyond the coast we know.'
	]),
	make(C.Island, ctx => ctx.hasStructure(S.Shipyard) ? {} : null, [
		'With the Shipyard, anywhere on the coast is within reach.',
		'I’ve never sailed before. I’m looking forward to the Shipyard’s first voyage.',
		'The ships are ready. Now I just need to learn which end is the front.',
		'The sea looks less like a boundary now and more like a road.'
	]),

	// Personality about the island
	make(C.Island, ctx => ctx.has(P.Curious) ? {} : null, [
		'What’s on the far side of the island? Nobody ever says.',
		'I’d like to see every part of this island before we’re done.',
		'I’m making a map of my own, with the bits we haven’t been to left blank.',
		'I want to know what every corner of this island feels like.'
	], 1.5),
	make(C.Island, ctx => ctx.has(P.Gloomy) ? {} : null, [
		'This island has seen a lot of bad days. I suspect it will see more.',
		'I don’t trust a place that looks this peaceful.',
		'Even the quiet parts of this island seem to be waiting for something.'
	]),
	make(C.Island, ctx => ctx.has(P.Cheerful) ? {} : null, [
		'It’s a lovely island, really. Apart from all the monsters.',
		'What a view! Pity about the fighting.',
		'I’m going to remember this view when the day gets difficult.'
	]),
	make(C.Island, ctx => ctx.has(P.Devout) ? {} : null, [
		'The gods put us on this island for a reason. I mean to find it.',
		'I pray every night for the people we haven’t freed yet.',
		'May our victories bring peace to the places we pass through.'
	]),
	make(C.Island, ctx => ctx.has(P.Greedy) ? {} : null, [
		'An island full of treasure, and we’ve hardly begun.',
		'Every region is another chest waiting to be opened.',
		'There’s profit in every mile, if we know where to look.'
	]),
	make(C.Island, ctx => ctx.has(P.Proud) ? {} : null, [
		'In time they’ll name this island after us.',
		'The bards will have a lot to say about what we’ve done here.',
		'We’re writing our names across the map.'
	])
];
