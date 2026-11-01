import { ThoughtCategory as C } from '../../enums/thought-category';
import { PersonalityType as P } from '../../enums/personality-type';

import type { ThoughtTemplate } from '../../models/thought';

import { createThoughtBuilder, lower } from './thought-builder';

const make = createThoughtBuilder('comrades');

export const comradeThoughts: ThoughtTemplate[] = [
	// The strongest of them
	make(C.Comrades, ctx => {
		const strongest = [ ...ctx.comrades ].sort((a, b) => b.level - a.level)[0];
		return (strongest && (strongest.level > ctx.level)) ? { comrade: strongest.name, level: String(strongest.level), role: lower(ctx.roleOf(strongest)) } : null;
	}, [
		'{Comrade} is level {level} already. I’d like to know their secret.',
		'I watch how {comrade} fights. That’s how you get to level {level}.',
		'One day I’ll be as good a {role} as {comrade}.',
		'{Comrade} makes it look easy. It can’t be.',
		'I’m going to ask {comrade} how they got so good.'
	]),
	make(C.Comrades, ctx => {
		const strongest = [ ...ctx.comrades ].sort((a, b) => b.level - a.level)[0];
		return (strongest && (strongest.level > ctx.level) && ctx.has(P.Proud)) ? { comrade: strongest.name } : null;
	}, [
		'{Comrade} may be ahead of me now. It won’t last.',
		'I’m not jealous of {comrade}. I’m motivated.',
		'Give me a season and {comrade} will be watching me.',
		'I’m keeping an eye on {comrade}. Purely for professional reasons.'
	], 1.5),

	// The youngest of them
	make(C.Comrades, ctx => {
		const newest = [ ...ctx.comrades ].sort((a, b) => a.level - b.level)[0];
		return (newest && (newest.level < ctx.level)) ? { comrade: newest.name } : null;
	}, [
		'{Comrade} is still learning. I try to remember what that was like.',
		'I should show {comrade} how I do that. They’d pick it up fast.',
		'Somebody should keep an eye on {comrade} in the next fight. Maybe me.',
		'{Comrade} reminds me of myself, not so long ago.',
		'There’s a lot of promise in {comrade}. I hope someone tells them.'
	]),
	make(C.Comrades, ctx => {
		const newest = [ ...ctx.comrades ].sort((a, b) => a.level - b.level)[0];
		return (newest && (newest.level < ctx.level) && ctx.has(P.Generous)) ? { comrade: newest.name } : null;
	}, [
		'I’ve a spare few hours. I’ll take {comrade} through some drills.',
		'If {comrade} wants to learn, I’ll gladly teach. It’s the only way anyone learns.',
		'I’ll make sure {comrade} knows they can ask me anything.'
	], 1.5),

	// Shared species
	make(C.Comrades, ctx => {
		const kin = ctx.comrades.find(c => c.speciesID === ctx.hero.speciesID);
		return kin ? { comrade: kin.name, species: lower(ctx.species) } : null;
	}, [
		'It’s good to have another {species} around. {Comrade} understands.',
		'{Comrade} and I are both {species}. We don’t need to explain ourselves.',
		'Two {species}s in the same company. {Comrade} and I should pick a rival.',
		'{Comrade} makes this place feel a little less unfamiliar.'
	]),

	// Shared role
	make(C.Comrades, ctx => {
		const peer = ctx.comrades.find(c => c.roleID === ctx.hero.roleID);
		return peer ? { comrade: peer.name, role: lower(ctx.role) } : null;
	}, [
		'{Comrade} and I are both {role}s. I wouldn’t say who’s better, but I could.',
		'Sharing the trade with {comrade}. We compare notes when no one’s listening.',
		'Two {role}s in one company is either clever or wasteful. I’m not sure which.',
		'{Comrade} and I can trade advice. Or argue about whose advice is better.'
	]),

	// Someone carrying something nice
	make(C.Comrades, ctx => {
		const rich = ctx.comrades.find(c => c.items.some(i => i.magic));
		const item = rich?.items.find(i => i.magic);
		return (rich && item) ? { comrade: rich.name, item: item.name } : null;
	}, [
		'{Comrade} has the {item}. I wonder what it’s like to carry that.',
		'I’ve been looking at {comrade}’s {item} when they’re not looking.',
		'The {item} suits {comrade} well. I’ll say that.',
		'I wonder if {comrade} knows how lucky they are to have the {item}.'
	]),
	make(C.Comrades, ctx => {
		const rich = ctx.comrades.find(c => c.items.some(i => i.magic));
		const item = rich?.items.find(i => i.magic);
		return (rich && item && ctx.has(P.Greedy)) ? { comrade: rich.name, item: item.name } : null;
	}, [
		'{Comrade} doesn’t deserve the {item}. Not as much as I would.',
		'I could make better use of the {item} than {comrade} does.',
		'If {comrade} ever puts down the {item}, I’ll be right there.',
		'I could borrow the {item} from {comrade}. They’d barely notice.'
	], 1.5),

	// A friend by temperament
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Loyal) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'I’d follow {comrade} through anything. Don’t tell them.',
		'We look after our own. {Comrade} is one of ours.',
		'No matter how bad it gets, I’ll stand beside {comrade}.',
		'Everyone’s got to have someone. I’ve got {comrade}.',
		'If {comrade} calls, I’ll come. No questions asked.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Wry) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'{Comrade} thinks I’m joking. I’m mostly joking.',
		'I’ve decided {comrade} is my favourite. I keep that to myself, so they don’t get ideas.',
		'{Comrade} laughed at my joke. I’m worried.',
		'Somebody should tell {comrade} to stop sharpening that blade at dinner. Not me, obviously.',
		'I’ve learned which of {comrade}’s silences mean trouble.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Cheerful) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'{Comrade} smiled at me today. That’s going to keep me going all week.',
		'I made {comrade} laugh at breakfast. A good start.',
		'We’re a good company. {Comrade} said so, so it must be true.',
		'It’s hard to stay gloomy when {comrade} is around.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Gloomy) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'{Comrade} laughs a lot. I envy that. I don’t understand it.',
		'I worry about {comrade}. Somebody has to.',
		'{Comrade} won’t last long with that attitude. Or I won’t. Hard to say.',
		'I worry when {comrade} gets quiet. I worry when they don’t.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Devout) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'I’ve been praying for {comrade}. They don’t need to know.',
		'If the gods are paying attention, {comrade} deserves a kind word from them.',
		'I wonder what {comrade} believes in. I never think to ask.',
		'I hope the gods keep {comrade} safe, even if they won’t ask for it.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Curious) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'Where did {comrade} learn to fight like that? I should ask.',
		'I’ve been wondering what {comrade} dreams about.',
		'There’s a story behind {comrade}. I can tell. I’ll get it out of them.',
		'I could ask {comrade} a hundred questions and still have more.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Humble) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'{Comrade} is better than me at most things. I’m learning a lot.',
		'Whatever I’ve done, {comrade} did it first and better.',
		'I’m lucky to have {comrade} beside me. Luckier than I deserve.',
		'{Comrade} makes the hard work look worth doing.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Bold) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'Let {comrade} take the left; I’ll take the right and the middle.',
		'I’d race {comrade} to the front line. And I’d win.',
		'{Comrade} and I make a good pair. The monsters should be nervous.',
		'If {comrade} is going in, then so am I.'
	]),
	make(C.Comrades, ctx => ctx.comrades.length > 0 && ctx.has(P.Cautious) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'I’ve asked {comrade} to watch my left flank. I’ve been asking for years.',
		'If {comrade} is calm, I’m calm. If {comrade} runs, I run faster.',
		'I trust {comrade}. I’m also making sure the exits are clear.',
		'{Comrade} knows I’ll keep watch while they rest.'
	]),

	// How the company feels as a whole
	make(C.Comrades, ctx => ctx.comrades.length === 0 ? {} : null, [
		'It’s a quiet place when you’re the only one here.',
		'I miss having someone to talk to. Anyone.',
		'A company of one is a lonely sort of company.',
		'I hope the next person through the gate likes conversation.'
	], 3),
	make(C.Comrades, ctx => ctx.comrades.length >= 4 ? { count: String(ctx.comrades.length + 1) } : null, [
		'{Count} of us now. That’s a proper company.',
		'It’s a good thing, being part of a crowd that can fight.',
		'You can feel it at the table: we’re a proper company now.',
		'It takes a moment to learn everyone’s footsteps. I’m getting there.'
	]),

	// Recruiting
	make(C.Recruiting, ctx => (ctx.canRecruit && ctx.missingRoles.length > 0) ? { role: lower(ctx.pick(ctx.missingRoles)) } : null, [
		'We should recruit {a role}.',
		'We’re light on {role}s. Someone should go and find one.',
		'I’d feel safer with {a role} on our side.',
		'The next hero we take on ought to be {a role}.',
		'Have we thought about hiring {a role}? We could use one.',
		'A {role} would bring a different kind of experience to the company.'
	], 2),
	make(C.Recruiting, ctx => (ctx.canRecruit && ctx.missingRoles.length > 0 && ctx.has(P.Cautious)) ? { role: lower(ctx.pick(ctx.missingRoles)) } : null, [
		'There’s no {role} among us. That’s a hole in our defences.',
		'If we had {a role}, I could sleep a little better.',
		'I’d like a {role} watching the things I don’t know how to watch.'
	], 1.5),
	make(C.Recruiting, ctx => (ctx.canRecruit && ctx.missingRoles.length > 0 && ctx.has(P.Curious)) ? { role: lower(ctx.pick(ctx.missingRoles)) } : null, [
		'I’ve never worked with {a role}. I’d like to see how they do things.',
		'I wonder what a {role} could teach us.',
		'I’d like to hear how a {role} sees the world.'
	], 1.5),
	make(C.Recruiting, ctx => (ctx.canRecruit && ctx.missingRoles.length === 0) ? {} : null, [
		'There’s a bunk free in the Barracks. We should fill it.',
		'More hands would help. I’m sure there are good people out there.',
		'The company could use someone new. Fresh eyes.',
		'There’s room at the table for someone with a good story.'
	]),
	make(C.Recruiting, ctx => ctx.partyFull ? {} : null, [
		'The Barracks is bursting. Somebody has to retire before we can take anyone else.',
		'We’re full. If someone wants to join, someone else has to leave.',
		'No more beds. We’d need to let someone go to make room.',
		'We’ve grown into every corner of the Barracks.'
	]),
	make(C.Recruiting, ctx => ctx.game.heroSlots > 0 ? { count: String(ctx.game.heroSlots) } : null, [
		'There are {count} places open for new heroes. Let’s put them to good use.',
		'People are asking about joining. I say we let some of them.',
		'We should see who’s turned up at the Barracks gate.',
		'There are {count} open places. I wonder who might fill them.'
	], 0.7)
];
