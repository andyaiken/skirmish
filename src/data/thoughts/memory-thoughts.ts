import { MemoryType } from '../../enums/memory-type';
import { PersonalityType as P } from '../../enums/personality-type';
import { ThoughtCategory } from '../../enums/thought-category';

import type { ThoughtContext, ThoughtTemplate } from '../../models/thought';
import type { MemoryModel } from '../../models/mind';

import { createThoughtBuilder, lower } from './thought-builder';

const make = createThoughtBuilder('memory');

interface MemoryOptions {
	// Only heroes of this temperament think it
	personality?: P;
	// How many encounters ago it can have happened and still be on their mind
	maxAge?: number;
	weight?: number;
}

// A thought about something that happened to the hero. Recent events come to mind more often.
const memory = (type: MemoryType, say: string[], options: MemoryOptions = {}) => make(
	ThoughtCategory.Memory,
	ctx => {
		if (options.personality && !ctx.has(options.personality)) {
			return null;
		}

		const m = ctx.recall(type, options.maxAge ?? 6);
		if (!m) {
			return null;
		}

		return {
			subject: m.subject,
			region: m.subject,
			comrade: m.subject,
			boss: m.subject,
			item: m.subject,
			structure: m.subject,
			kind: lower(m.detail),
			amount: String(m.amount),
			level: String(m.amount)
		};
	},
	say,
	ctx => {
		const m = ctx.recall(type, options.maxAge ?? 6);
		const recency = m ? Math.max(1, 4 - m.age) : 1;
		return recency * (options.weight ?? 1) * (options.personality ? 1.5 : 1);
	}
);

const history = (when: (ctx: ThoughtContext) => boolean, say: string[], weight = 1) => make(
	ThoughtCategory.Memory,
	ctx => when(ctx) ? {
		battles: String(ctx.mind.history.encounters),
		count: String(ctx.mind.history.monstersSlain),
		amount: String(ctx.mind.history.mostSlainAtOnce),
		knockouts: String(ctx.mind.history.knockouts)
	} : null,
	say,
	weight
);

const callback = (
	type: MemoryType,
	maxAge: number,
	say: string[],
	bindings: (memory: MemoryModel) => Record<string, string>
) => make(
	ThoughtCategory.Memory,
	ctx => {
		const memory = ctx.recall(type, maxAge);
		return memory ? bindings(memory) : null;
	},
	say,
	ctx => {
		const memory = ctx.recall(type, maxAge);
		return memory ? ((maxAge + 1 - memory.age) / (maxAge + 1)) * 1.2 : 0;
	}
);

export const memoryThoughts: ThoughtTemplate[] = [
	// Victory
	memory(MemoryType.Victory, [
		'We won at {region}. I keep turning it over in my head.',
		'{Region} is ours now. Funny how quiet it goes afterwards.',
		'I can still hear {region} in my ears. A good fight, that.',
		'After {region}, I think I could sleep for a week.',
		'I keep remembering the moment we knew {region} was won.'
	]),
	memory(MemoryType.Victory, [
		'{Region} was won, and I earned my share of it.',
		'No one will say we didn’t earn {region}.',
		'Let them tell the story of {region} however they like. I was there.'
	], { personality: P.Proud }),
	memory(MemoryType.Victory, [
		'We did it! {Region}! Did you see us?',
		'Another win. I could sing about {region} all night.',
		'{Region} behind us and the sun still shining. What a day.'
	], { personality: P.Cheerful }),
	memory(MemoryType.Victory, [
		'We won at {region}. That only means the next one is waiting.',
		'{Region} went well. I don’t trust it.',
		'We won, and it still didn’t feel like enough.'
	], { personality: P.Gloomy }),

	// Retreat
	memory(MemoryType.Retreat, [
		'We ran from {region}. I know why we did, and I still don’t like it.',
		'Falling back from {region} was the right call. Mostly.',
		'{Region} beat us, this time. Only this time.',
		'I keep seeing {region} over my shoulder as we ran.',
		'We came back in one piece. I’m trying to let that be enough.'
	]),
	memory(MemoryType.Retreat, [
		'Run today, fight tomorrow. {Region} will keep.',
		'Pulling out of {region} was sensible, and I’m proud we did it in order.',
		'Better a retreat from {region} than a funeral.'
	], { personality: P.Cautious }),
	memory(MemoryType.Retreat, [
		'We turned our backs on {region}. I don’t do that twice.',
		'Retreat. The word tastes like iron. {Region} will see me again.',
		'I never should have let us leave {region} that way.'
	], { personality: P.Bold }),

	// Wounded
	memory(MemoryType.Wounded, [
		'Those wounds from {region} still ache when it rains.',
		'I’m patched up, but {region} left its mark.',
		'I felt every one of those wounds at {region}. I’m going to be careful for a while.',
		'It was closer than I let on, back at {region}.',
		'I notice the old hurt most when everything else is quiet.'
	]),
	memory(MemoryType.Wounded, [
		'It’s only a scratch from {region}. Ignore the limp.',
		'I’ve had worse. Not recently, but I’ve had worse.',
		'A few wounds from {region}. They make the story better.'
	], { personality: P.Bold }),
	memory(MemoryType.Wounded, [
		'I should have kept my head down at {region}.',
		'That was too close. I’m not telling anyone how close.',
		'I’ll hold my shield higher next time. After {region}, I will.'
	], { personality: P.Cautious }),
	memory(MemoryType.Wounded, [
		'The Sanatorium would have been nice after {region}.',
		'I’ve been wounded and no one has brought me soup.',
		'Wounded at {region}. I’m sure it’s fine. I’m sure it’s all fine.'
	], { personality: P.Wry }),

	// Knocked out
	memory(MemoryType.KnockedOut, [
		'I woke up on the ground at {region}. I don’t remember falling.',
		'Going down at {region} was the strangest feeling. Dark, then everyone’s faces.',
		'They had to carry me out of {region}. I owe someone for that.',
		'I was out cold at {region}. I won’t pretend it didn’t scare me.',
		'I remember waking up more clearly than I remember falling.'
	]),
	memory(MemoryType.KnockedOut, [
		'I was lying in the dirt and I thought: this is how it ends. Then it didn’t.',
		'There was a moment at {region} when I wasn’t sure I would get up again.',
		'Falling unconscious at {region} frightened me more than anything I saw.'
	], { personality: P.Gloomy }),
	memory(MemoryType.KnockedOut, [
		'Somebody dragged me out of {region}. I’ll find out who and thank them.',
		'I was down, but my friends weren’t finished. I won’t forget it.',
		'Whoever kept fighting at {region} while I was out: thank you.'
	], { personality: P.Loyal }),
	memory(MemoryType.KnockedOut, [
		'I took a nap at {region}. Briefly. In front of the enemy.',
		'Knocked out at {region}. I’d like to say it was strategy.',
		'I fell over at {region}. In my defence, the ground looked inviting.'
	], { personality: P.Wry }),

	// Unscathed
	memory(MemoryType.Unscathed, [
		'Not a scratch on me at {region}. I almost feel guilty.',
		'I came out of {region} without a mark. I’m not sure I’ve earned it.',
		'Clean as a whistle after {region}. Let’s hope the luck holds.',
		'I came back untouched. I’m grateful, even if I can’t explain it.'
	]),
	memory(MemoryType.Unscathed, [
		'Not a mark on me from {region}. They never touched me.',
		'Untouched at {region}. I’d show you the dent-free armour, but you’d only be jealous.'
	], { personality: P.Proud }),
	memory(MemoryType.Unscathed, [
		'Unhurt at {region}, and I’m sure it isn’t going to last.',
		'We came through {region} without harm. Somebody will pay for that later.'
	], { personality: P.Gloomy }),

	// Slew a boss
	memory(MemoryType.SlewBoss, [
		'{Boss} is dead. I keep checking over my shoulder anyway.',
		'We brought down {boss}. I still can’t quite believe it.',
		'{Boss}, the {kind}, was no small thing to beat. I’m not forgetting that.',
		'Whoever sings about us will have to mention {boss}.',
		'I wonder how many others had tried to stop {boss} before us.'
	], { maxAge: 12 }),
	memory(MemoryType.SlewBoss, [
		'I felled {boss}, the {kind}. Put that in the songs.',
		'{Boss} thought they were the greatest {kind} in the land. They were wrong, and I was there to say so.',
		'They’ll speak of how I ended {boss} for a long time.'
	], { personality: P.Proud, maxAge: 12 }),
	memory(MemoryType.SlewBoss, [
		'I killed {boss}. I wonder who is going to miss them.',
		'It was a big thing, {boss}. It was a big thing and then it wasn’t.',
		'{Boss} is gone, and my hands won’t stop shaking.'
	], { personality: P.Humble, maxAge: 12 }),
	memory(MemoryType.SlewBoss, [
		'With {boss} gone, I’d say we’re ready for the next monster.',
		'{Boss} the {kind} won’t trouble anybody again. Who’s next?'
	], { personality: P.Bold, maxAge: 12 }),

	// Slew many
	memory(MemoryType.SlewMany, [
		'I lost count at {region}. Easily {amount}, I think.',
		'{Amount} of them at {region}, and I’m still standing. Somehow.',
		'There was a point at {region} where I stopped counting and started breathing.',
		'I remember the noise more than the number.'
	]),
	memory(MemoryType.SlewMany, [
		'I cut down {amount} at {region}. Tell me I’m not the best in the company.',
		'{Amount} before sunset. That’s a good day’s work.'
	], { personality: P.Proud }),
	memory(MemoryType.SlewMany, [
		'That was a lot of blood at {region}. I’m not as pleased about it as I thought I’d be.',
		'I brought down {amount} at {region}. It shouldn’t keep me awake. It does.'
	], { personality: P.Gloomy }),

	// Slew several at once
	memory(MemoryType.SlewAtOnce, [
		'{Amount} at once! Did you see that? I couldn’t make it happen again if I tried.',
		'Felled {amount} in one stroke at {region}. I’m going to talk about it for a month.',
		'I’ve never seen {amount} go down together like that. Not before {region}.',
		'For one breath, the whole fight seemed to stop.'
	]),
	memory(MemoryType.SlewAtOnce, [
		'I’d like it noted that I brought down {amount} at once.',
		'{Amount} in a single blow. Not every hero can say that.'
	], { personality: P.Proud }),
	memory(MemoryType.SlewAtOnce, [
		'{Amount} at once and all I could think was: hope that doesn’t happen to me.',
		'Whatever I did at {region}, I hope I never have to do it again. {Amount}, all at once.'
	], { personality: P.Cautious }),

	// Didn't kill anything
	memory(MemoryType.NoKills, [
		'I didn’t land a single finishing blow at {region}. I’ll do better.',
		'I fought at {region} and not one of them fell to me. Next time.',
		'Everyone else got the glory at {region}. I held the line.',
		'I didn’t finish the fight, but I helped us see it through.'
	]),
	memory(MemoryType.NoKills, [
		'Someone has to do the supporting work. I just wish it felt more… heroic.',
		'My part at {region} didn’t make the songs. It still mattered.'
	], { personality: P.Humble }),

	// Ally fell
	memory(MemoryType.AllyFell, [
		'I keep thinking of {comrade}. We should have been faster.',
		'Nobody should go the way {comrade} did.',
		'There’s a space where {comrade} used to stand. I keep looking at it.',
		'I’d give a lot to hear {comrade} laugh again.',
		'I still catch myself saving a place for {comrade}.'
	], { maxAge: 12, weight: 1.5 }),
	memory(MemoryType.AllyFell, [
		'I swear I’ll make it count, {comrade}.',
		'I’ll carry {comrade}’s name into every fight from now on.',
		'We don’t leave anyone behind, and we left {comrade}. I won’t forget it.'
	], { personality: P.Loyal, maxAge: 12, weight: 1.5 }),
	memory(MemoryType.AllyFell, [
		'It could have been me instead of {comrade}. It could be me next.',
		'{Comrade} is gone. Everyone goes eventually, and it never gets easier.'
	], { personality: P.Gloomy, maxAge: 12, weight: 1.5 }),
	memory(MemoryType.AllyFell, [
		'May {comrade} find a rest that suits them. I’ll light a candle.',
		'I said a prayer for {comrade}. I hope it reached someone.'
	], { personality: P.Devout, maxAge: 12, weight: 1.5 }),

	// Ally knocked out
	memory(MemoryType.AllyDown, [
		'{Comrade} went down at {region}. I saw it happen.',
		'I was relieved when {comrade} got up again.',
		'We nearly lost {comrade}. I don’t like how close that was.',
		'I keep checking that {comrade} is on their feet.'
	]),
	memory(MemoryType.AllyDown, [
		'I should have been quicker to reach {comrade}.',
		'I’ll watch {comrade}’s back more closely from now on.'
	], { personality: P.Loyal }),

	// Left at home
	memory(MemoryType.LeftBehind, [
		'They went to {region} without me. Not that I mind. Much.',
		'I stayed home while the others went to {region}. It’s harder than it sounds.',
		'Hearing about {region} from the others isn’t the same as being there.',
		'I wasn’t at {region}. I’d like to have been.',
		'I heard every version of what happened at {region}, and none felt like being there.'
	]),
	memory(MemoryType.LeftBehind, [
		'Left out of {region}. I’d have made a difference.',
		'I’ll be at the front at the next one. I’ve waited long enough.'
	], { personality: P.Bold }),
	memory(MemoryType.LeftBehind, [
		'I stayed out of {region} and slept well for it.',
		'Someone has to keep the fires lit while they’re away.'
	], { personality: P.Cheerful }),

	// Region conquered
	memory(MemoryType.RegionConquered, [
		'{Region} is ours. I walked the border today and it felt different.',
		'Taking {region} makes the island feel smaller. And us a little larger.',
		'Hard to believe we hold {region} now.',
		'I wonder what the first quiet night in {region} will feel like.'
	], { maxAge: 8 }),
	memory(MemoryType.RegionConquered, [
		'{Region} was the right place to take next. I said so.',
		'One more piece of the island, and {region} was no small piece.'
	], { personality: P.Proud, maxAge: 8 }),

	// Region bought
	memory(MemoryType.RegionBought, [
		'We bought {region}. I’m not sure whether that’s clever or cowardly.',
		'Coin instead of blood for {region}. I could get used to that.',
		'We paid for {region} and nobody had to die. Remember that next time.',
		'It’s strange how peaceful a victory can be when nobody draws a blade.'
	], { maxAge: 8 }),
	memory(MemoryType.RegionBought, [
		'{Region} for a handful of gold. Cheap, if you ask me.',
		'Buying {region} was good business. I do like good business.'
	], { personality: P.Greedy, maxAge: 8 }),

	// Level up
	memory(MemoryType.LevelUp, [
		'I feel different since I reached level {level}. Sharper.',
		'Level {level}. A year ago I’d never have believed it.',
		'Getting stronger doesn’t feel like I thought it would. It feels like being more responsible.',
		'I’m proud of the work it took to reach level {level}.'
	], { maxAge: 4 }),
	memory(MemoryType.LevelUp, [
		'Level {level}, and I’m still not done.',
		'Level {level}. I’d like to see anyone keep up now.'
	], { personality: P.Proud, maxAge: 4 }),
	memory(MemoryType.LevelUp, [
		'I trained for this. Level {level} is just the start.',
		'Every level is another reason to keep going.'
	], { personality: P.Bold, maxAge: 4 }),

	// New gear
	memory(MemoryType.NewGear, [
		'The {item} suits me. I don’t know how I managed without it.',
		'I keep catching myself admiring the {item}.',
		'Whoever made the {item} knew what they were about.',
		'I’ve taken to carrying the {item} everywhere. Even where I don’t need to.',
		'I keep finding new reasons to be glad I have the {item}.'
	], { maxAge: 8 }),
	memory(MemoryType.NewGear, [
		'The {item} is worth a small fortune. I’ll be careful with it.',
		'I wonder what the {item} would fetch at the Bazaar. Not that I’d ever sell it.'
	], { personality: P.Greedy, maxAge: 8 }),
	memory(MemoryType.NewGear, [
		'There’s something about the {item} I can’t explain. It almost hums.',
		'What’s the story behind the {item}? Somebody must know.'
	], { personality: P.Curious, maxAge: 8 }),

	// A new comrade
	memory(MemoryType.NewComrade, [
		'{Comrade} has joined us. I think they’ll fit in.',
		'I’m still learning how {comrade} fights. We’ll get there.',
		'It’s good to have {comrade} here. I think it’ll be good for all of us.',
		'There’s a new voice at the table. The company feels different already.'
	], { maxAge: 8 }),
	memory(MemoryType.NewComrade, [
		'Welcome, {comrade}! Come, let me show you where the food is.',
		'I’ve already decided I like {comrade}.'
	], { personality: P.Cheerful, maxAge: 8 }),
	memory(MemoryType.NewComrade, [
		'We’ll see what {comrade} is made of soon enough.',
		'I’ll reserve judgement on {comrade}. For now.'
	], { personality: P.Cautious, maxAge: 8 }),

	// A comrade retired
	memory(MemoryType.ComradeRetired, [
		'{Comrade} has hung up their weapons. The camp is quieter now.',
		'I’m glad {comrade} got out while they could. I’ll miss them.',
		'Good luck to {comrade}, wherever they end up.',
		'I hope {comrade} finds somewhere peaceful to put their feet up.'
	], { maxAge: 10 }),
	memory(MemoryType.ComradeRetired, [
		'{Comrade} left, but they’ll always be one of us.',
		'We shouldn’t forget {comrade}. I won’t.'
	], { personality: P.Loyal, maxAge: 10 }),

	// A structure built
	memory(MemoryType.StructureBuilt, [
		'I’ve been past the new {structure} four times today. I like it.',
		'The {structure} makes this place feel like we mean to stay.',
		'You can smell fresh timber from the new {structure}.',
		'The new {structure} makes tomorrow feel a little more possible.'
	], { maxAge: 8 }),
	memory(MemoryType.StructureBuilt, [
		'We built a {structure}. I’ll bet nobody else has one.',
		'A {structure} of our own! We’ve come a long way.'
	], { personality: P.Proud, maxAge: 8 }),

	// A structure upgraded
	memory(MemoryType.StructureUpgraded, [
		'The {structure} looks bigger since they finished it. Or maybe I’m just proud.',
		'They’ve been busy at the {structure}. It shows.',
		'Level {level} for the {structure}. That’s no small thing.',
		'The {structure} has grown with us. I like that.'
	], { maxAge: 8 }),

	// A structure sold
	memory(MemoryType.StructureSold, [
		'It feels odd without the {structure}. I keep walking toward it.',
		'I miss the {structure}. I know it was the right choice. I still miss it.',
		'Where the {structure} was is just dust and good memories now.',
		'We made a choice about the {structure}. I hope it was the right one.'
	], { maxAge: 8 }),
	memory(MemoryType.StructureSold, [
		'We got coin for the {structure}. I won’t pretend I minded.',
		'Selling the {structure} was practical. Practical is good.'
	], { personality: P.Greedy, maxAge: 8 }),

	// Long-term history: rookies, veterans, and the fallen
	history(ctx => ctx.battles === 0, [
		'I haven’t been in a real fight yet. Everyone else seems to know what they’re doing.',
		'I haven’t seen battle. I wonder what it will be like.',
		'Everyone talks about battle as if I know what they mean. I don’t. Not yet.',
		'I’m new here and haven’t fought a single battle. I’d like to put that right.'
	], 2),
	history(ctx => (ctx.battles > 0) && (ctx.battles <= 3), [
		'I’ve only fought {battles} battles. I’m learning. I’m learning fast.',
		'The first battles felt like a blur. I’m starting to see the shape of things.',
		'I’m getting the hang of this. Don’t tell anyone I said that.'
	]),
	history(ctx => ctx.battles >= 8, [
		'I’ve fought in {battles} battles. They’ve all merged together a little.',
		'You know you’re a veteran when you stop counting battles. I counted: {battles}.',
		'{Battles} battles and the fear never really leaves. It just gets quieter.',
		'I’ve seen {battles} battles now. I could teach a thing or two.'
	]),
	history(ctx => ctx.mind.history.bossesSlain >= 2, [
		'I’ve brought down {count} monsters and more than one was a boss. That has to count for something.',
		'Boss-killers, that’s us. I like the sound of it.',
		'A monster that size should frighten me. After what we’ve done, it just annoys me.'
	]),
	history(ctx => ctx.mind.history.monstersSlain >= 25, [
		'{Count} monsters, give or take. I should have kept a tally.',
		'It occurs to me I’ve ended {count} lives. I don’t know what to make of that.',
		'I’ve brought down a fair few. {Count}, anyway.'
	]),
	history(ctx => ctx.mind.history.mostSlainAtOnce >= 3, [
		'The most I ever took down in one go was {amount}. I’d like to beat that.',
		'I still think about the time I felled {amount} at once.'
	], 0.7),
	history(ctx => ctx.mind.history.knockouts >= 2, [
		'I’ve been knocked down more than once now. It doesn’t get less frightening.',
		'I’ve been out cold {knockouts} times. I’m not looking for another.'
	], 0.7),
	history(ctx => ctx.mind.history.retreats >= 1, [
		'I’ve run from a fight before. It doesn’t trouble me, much.',
		'I know the shape of a retreat now. It’s a lot like a fight, except you’re walking faster.'
	], 0.7),
	make(
		ThoughtCategory.Memory,
		ctx => ctx.mind.history.comradesLost.length > 0 ? { comrade: ctx.pick(ctx.mind.history.comradesLost) } : null,
		[
			'I still think about {comrade}. Probably I always will.',
			'There’s an empty bunk where {comrade} used to be, and nobody’s moved their things.',
			'{Comrade} would have laughed at this. I wish I could hear it.',
			'Some days I still expect {comrade} to walk in.',
			'We’ve lost people. {Comrade} most of all, I think.'
		],
		0.8
	),
	make(
		ThoughtCategory.Memory,
		ctx => {
			const memory = ctx.mind.memories.find(m => !!m.personalityChange && (m.age <= 6));
			return memory?.personalityChange
				? { experience: memory.personalityChange.experience, trait: lower(memory.personalityChange.trait) }
				: null;
		},
		[
			'After {experience}, I can feel myself leaning a little more {trait}.',
			'I keep thinking about {experience}. I can see how it made me more {trait}.',
			'Some things change you. {Experience} is one of them; I have grown more {trait} since.'
		],
		ctx => {
			const memory = ctx.mind.memories.find(m => !!m.personalityChange && (m.age <= 6));
			return memory ? Math.max(1, 4 - memory.age) * 1.2 : 0;
		}
	),
	callback(MemoryType.Wounded, 8, [
		'The ache takes me back to {region}. I remember how close that was.',
		'I still carry a little of {region} with me, in these old wounds.'
	], memory => ({ region: memory.subject })),
	callback(MemoryType.SlewBoss, 12, [
		'I wonder what {boss} was like before we met. I still think about that fight.',
		'Even now, I catch myself watching for {boss}. Old habits, I suppose.'
	], memory => ({ boss: memory.subject })),
	callback(MemoryType.RegionConquered, 8, [
		'I think about {region} sometimes. It must feel strange to belong to us now.',
		'We changed {region} when we took it. I wonder what it will become.'
	], memory => ({ region: memory.subject }))
];
