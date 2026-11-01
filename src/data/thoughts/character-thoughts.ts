import { ThoughtCategory as C } from '../../enums/thought-category';
import { DreamType as D } from '../../enums/dream-type';
import { FearType as F } from '../../enums/fear-type';
import { PersonalityType as P } from '../../enums/personality-type';
import { PastimeType as T } from '../../enums/pastime-type';

import type { ThoughtTemplate } from '../../models/thought';

import { createThoughtBuilder, lower } from './thought-builder';

const make = createThoughtBuilder('character');

const dreams: Record<D, string[]> = {
	[D.Glory]: [
		'One day they’ll sing songs about me. I’m working on the verses.',
		'I want my name known from one end of the island to the other.',
		'A hero’s glory is all I’ve ever wanted.',
		'I dream of a crowd cheering my name.',
		'Someday, I want my deeds to outlive me.'
	],
	[D.Wealth]: [
		'One day I’ll have a house with a gold door. Just the one.',
		'I dream of a chest so full it won’t close.',
		'I’m going to be rich one day. I’ve already decided what to do with it.',
		'A modest fortune. That’s all I ask. Modest, but very large.',
		'I keep a list of things I’ll buy when I’m rich. It’s a long list.'
	],
	[D.Peace]: [
		'I dream of a quiet life with no one trying to kill me.',
		'One day I’ll put the sword down and never pick it up again.',
		'When this is over, I want a porch, a chair and silence.',
		'Peace is the only treasure I really want.',
		'I dream of waking up without checking for danger.'
	],
	[D.Knowledge]: [
		'I want to know everything about this island. Everything.',
		'I dream of a library with no end.',
		'There’s so much to learn, and so little time. I resent that.',
		'One day I’ll know why monsters do what they do.',
		'Every answer seems to open three more questions.'
	],
	[D.Home]: [
		'I’d like a home to come back to. A real one.',
		'I dream of a fire, a bed and a door I can lock.',
		'One day I’ll settle down. Somewhere with a garden.',
		'All I want is to see my own roof again.',
		'I miss having a place where I know which floorboard creaks.'
	],
	[D.Legacy]: [
		'I want to leave something behind that lasts.',
		'When I’m gone, I want them to say it mattered.',
		'I think about what we’ll leave to those who come after us.',
		'A name on a stone, a story at a fire. That’s enough for me.',
		'I hope something kind remains after I’m gone.'
	],
	[D.Mastery]: [
		'I’m going to be the best at what I do. Just wait.',
		'There’s a perfect way to do what I do. I’m going to find it.',
		'I practise every day. One day it’ll be flawless.',
		'Mastery isn’t something you reach. It’s what you chase.',
		'I can always do it better than I did yesterday.'
	],
	[D.Adventure]: [
		'I want to see every corner of the world before I’m done.',
		'Every horizon is an invitation. I dream of accepting them all.',
		'I dream of something nobody has ever seen.',
		'There must be somewhere stranger than this. I’m going to find it.',
		'I want to come home with a map full of places nobody believes in.'
	],
	[D.Redemption]: [
		'There are things I did that I’m trying to make right.',
		'I want to prove I’m better than my past.',
		'Every day I try to be someone I’d forgive.',
		'One good act at a time. That’s how I’m going to do it.',
		'If I can mend one thing I broke, I’ll start there.'
	],
	[D.Belonging]: [
		'This company is the first place that’s felt like home. I’d fight for it.',
		'I want to be part of something. I think I am.',
		'I’ve never had a place where I mattered before.',
		'I hope they know how much this company means to me.',
		'I used to think belonging was for other people.'
	]
};

const fears: Record<F, string[]> = {
	[F.Death]: [
		'I’m not afraid of dying. I’m afraid of how it will feel.',
		'Every fight, I think: not today. Please, not today.',
		'I try not to think about the end. It thinks about me.',
		'Death is patient. I try to be faster.',
		'I don’t want fear to make my choices for me.'
	],
	[F.Failure]: [
		'What if we fail? What if it was all for nothing?',
		'I can’t bear the thought of letting everyone down.',
		'I lie awake wondering how I could mess this up.',
		'Failure scares me more than any monster.',
		'I’m afraid the moment we need me most, I’ll have nothing to give.'
	],
	[F.Darkness]: [
		'I don’t like the dark. I leave a lantern burning. Don’t tell anyone.',
		'Shadows move when I’m not looking at them.',
		'The nights are too long. The dark is too quiet.',
		'I always keep one candle in my pack.',
		'I leave a light on, even when I’m not the one who needs it.'
	],
	[F.Fire]: [
		'I flinch at the smell of smoke. It never goes away.',
		'I won’t sleep near a hearth. Don’t ask me why.',
		'Fire is a good servant and a terrible master. I never forget that.',
		'The Forge unsettles me. All that glowing metal.',
		'I watch every flame until it’s safely out.'
	],
	[F.Drowning]: [
		'I never learned to swim. And now we’re talking about ships.',
		'Deep water gives me chills.',
		'I’d rather face any monster than a river in flood.',
		'I check where the exits are, and where the water is.',
		'The sound of deep water makes my chest tighten.'
	],
	[F.Obscurity]: [
		'I’m terrified I’ll die and nobody will remember my name.',
		'I don’t want to be forgotten. I’m afraid I will be.',
		'What if it all fades? What if none of us are remembered?',
		'The worst thing isn’t dying. It’s dying unnoticed.',
		'I’m scared my life will leave no mark at all.'
	],
	[F.Betrayal]: [
		'I’ve been burned by trust before. I look over my shoulder.',
		'I want to trust everyone here. I’m afraid I can’t.',
		'You never really know someone. That’s what scares me.',
		'A knife in the dark is worse than any monster.',
		'I listen for footsteps that stop when I stop.'
	],
	[F.Madness]: [
		'Some nights I hear things that aren’t there. I hope.',
		'I’m afraid my mind will go before my body does.',
		'It’s the quiet moments that worry me. My thoughts go strange.',
		'I count things to keep my head clear. Windows. Steps. Breaths.',
		'Some thoughts are easier to face in daylight.'
	],
	[F.Poverty]: [
		'I’ve been poor. I never want to be again.',
		'I keep a coin sewn in my boot. Just in case.',
		'Empty pockets frighten me more than a drawn sword.',
		'I check the coffers more than I should. It’s a habit.',
		'I’m always waiting for the day the last coin is gone.'
	],
	[F.Captivity]: [
		'I can’t stand being locked in. Every door has to be open.',
		'Cages. I hate cages. I don’t care what’s inside them.',
		'Being trapped is the worst thing I can imagine.',
		'I won’t sleep in a room without a window.',
		'I need to know there’s a way out.'
	]
};

const pastimes: Record<T, string[]> = {
	[T.Feasting]: [
		'I’m thinking about dinner. And, afterwards, a second dinner.',
		'There’s nothing like a hot meal after a long day.',
		'I’d trade my left boot for a plate of roast pork.',
		'If there’s cake, I’m in.',
		'I think most problems would improve after a second helping.'
	],
	[T.Music]: [
		'I’ve been working on a new tune. It’s nearly there.',
		'I hum when I’m thinking. I’m told it’s annoying.',
		'There’s a melody stuck in my head, and it won’t leave.',
		'A drum, a flute and a quiet evening. That’s all I need.',
		'I can find a tune in almost anything, even a rattling cart.'
	],
	[T.Gambling]: [
		'Fancy a game of dice? I’m feeling lucky.',
		'I’ve got a hunch about the next roll.',
		'The odds are always the odds, until they aren’t.',
		'I’d wager we find something good in the next fight.',
		'One more throw. I can feel the odds turning.'
	],
	[T.Reading]: [
		'I’ve got a good book waiting for me. It’s a long one.',
		'I read until the candle burns down, every night.',
		'There’s no adventure like the one on a page.',
		'Someone should write down what we’ve done.',
		'I like a book that makes the room disappear.'
	],
	[T.Fishing]: [
		'I know a pool by the wall that’s full of fish. Quiet there, too.',
		'Give me a line, a stick and an afternoon.',
		'The best thinking happens at the end of a fishing line.',
		'I’ve been fishing for twenty years and I’ve caught three fish. I love it.',
		'Even an empty net makes a peaceful afternoon.'
	],
	[T.Stargazing]: [
		'The sky was clear last night. I counted a hundred stars.',
		'I wonder if anyone else is looking at the same stars.',
		'If you look long enough at the stars, your problems feel smaller.',
		'There’s a star I’ve named after someone I used to know.',
		'The stars make the night feel less empty.'
	],
	[T.Gardening]: [
		'I put some herbs in by the wall. They’re coming along nicely.',
		'Something about a seed becoming a plant makes me hopeful.',
		'I’d like to plant something that’ll be here after I’m gone.',
		'The beans have done well this year. I’m very proud.',
		'I like tending to something that grows at its own pace.'
	],
	[T.Whittling]: [
		'I’m carving a little bird. It looks more like a duck.',
		'A knife, a stick and a bench. That’s my idea of a good evening.',
		'I’ve been whittling the same stick for a week. It’s getting very small.',
		'You can learn a lot about patience from a bit of wood.',
		'The little curls of wood make a fine kindling pile.'
	],
	[T.Napping]: [
		'I could do with a nap. A small one. Maybe two.',
		'The best part of any day is a quiet nap in the sun.',
		'I’ve found a spot by the wall that’s perfect for sleeping.',
		'If anyone needs me, I’ll be sleeping. Please don’t need me.',
		'I can fall asleep anywhere, provided nobody asks me to.'
	],
	[T.Storytelling]: [
		'I’ve been polishing a tale for the next time we’re at a fire.',
		'The one about the troll and the bridge gets better every time I tell it.',
		'Every battle is a story if you tell it right.',
		'I’ve been making up stories about people we meet. Some are true.',
		'A good story deserves a dramatic pause, even if nobody asked for one.'
	]
};

const personalities: Record<P, string[]> = {
	[P.Bold]: [
		'Nothing worth doing was ever done carefully.',
		'I say: charge first, ask questions never.',
		'Fortune favours people who walk up to it and shout.',
		'If I’m going to be afraid, I’ll be afraid at the front.',
		'Fear is just excitement that hasn’t decided yet.',
		'If there’s a hard way through, I’ll be at the front of it.'
	],
	[P.Cautious]: [
		'I always check twice. It’s kept me alive.',
		'It’s better to be late and alive than early and heroic.',
		'Always know where the exit is. That’s my rule.',
		'A plan that has no plan B isn’t a plan.',
		'Nobody ever died of being too careful.',
		'I like a plan with room for things to go wrong.'
	],
	[P.Cheerful]: [
		'What a lovely day for it!',
		'I got up this morning and thought, what a nice life.',
		'The sun’s out. Nothing can go wrong.',
		'Nothing a good laugh won’t fix!',
		'I’m feeling fine. I think I’ll stay that way.',
		'There’s good in today. I’m going to find it.'
	],
	[P.Gloomy]: [
		'I expect it’ll rain. It usually does.',
		'We’re doomed, of course. But we may as well enjoy dinner first.',
		'I’ve got a bad feeling about this. I’ve got one about everything.',
		'The glass is half empty, and it has a crack.',
		'Don’t mind me. I’m just thinking about all the things that could go wrong.',
		'I’ve started expecting disappointment. It’s very dependable.'
	],
	[P.Greedy]: [
		'There’s gold in every region. We just have to take it.',
		'I never met a coin I didn’t like.',
		'A job’s worth doing if it pays well.',
		'Show me a chest and I’ll show you a good day.',
		'My share of the loot had better be fair. Fair meaning large.',
		'I’m not counting the coins. I’m checking they’re all there.'
	],
	[P.Generous]: [
		'There’s always enough to share.',
		'I gave my last biscuit to a stranger today. It felt good.',
		'What’s mine is yours, within reason. And sometimes beyond it.',
		'Kindness costs very little. I like it that way.',
		'I’d rather give than keep. It’s lighter.',
		'A small kindness can carry someone a long way.'
	],
	[P.Curious]: [
		'What does that do? And that? And that?',
		'I took something apart today to see how it worked. It does not work now.',
		'Every question has a better question behind it.',
		'I’ve got a hundred questions. Don’t get me started.',
		'I wonder what’s over the next hill.',
		'There’s always something I haven’t thought to ask yet.'
	],
	[P.Content]: [
		'Not everything needs improving. Some things are good as they are.',
		'I like a quiet day where nothing unexpected happens.',
		'I don’t need to know what’s over every hill.',
		'The familiar can be a comfort, not a cage.',
		'I’m happy to leave a few mysteries alone.',
		'Some questions are nicer when they stay unanswered.'
	],
	[P.Proud]: [
		'I’m the best at what I do. I only say so because it’s true.',
		'I would never settle for second place.',
		'People should be proud of what they’ve achieved. I am.',
		'I like to be looked at. It keeps me sharp.',
		'I haven’t made a mistake yet. Ask anyone. Don’t ask anyone.',
		'I don’t mind being admired. It saves me the trouble of introducing myself.'
	],
	[P.Humble]: [
		'I’m just doing my part. It’s no big thing.',
		'Others have done more than I have. I’m happy to help.',
		'I don’t need the credit. I just need the job done.',
		'I’m not special. I just keep turning up.',
		'Praise makes me uncomfortable. I’m not sure why.',
		'If someone else can take the credit, I’ll let them.'
	],
	[P.Loyal]: [
		'I’ll stand by this company to the end.',
		'I made a promise and I mean to keep it.',
		'You don’t abandon your friends. Not ever.',
		'When the going gets tough, I’m going to be right beside you.',
		'This company is my family. I’d die for them.',
		'I remember who stood beside me when it mattered.'
	],
	[P.Independent]: [
		'I can care for the company without losing myself in it.',
		'I make my own choices, even when I value someone else’s advice.',
		'It’s good to have friends. It’s also good to stand alone.',
		'I don’t need anyone’s permission to find my own way.',
		'My word is mine to give, and I choose carefully.',
		'I can belong here and still be my own person.'
	],
	[P.Wry]: [
		'Another glorious day of not being eaten.',
		'I’m sure this will end well. I’ve been wrong before.',
		'The monsters are very persistent. I admire that.',
		'Heroism is mostly walking toward the things everyone else runs from.',
		'I came for the adventure and stayed for the mud.',
		'At least the disasters are never dull.'
	],
	[P.Sincere]: [
		'I mean what I say. It saves everyone the guessing.',
		'Some things are worth saying plainly.',
		'I’m glad we made it through. I really am.',
		'I don’t need a joke to make a moment bearable.',
		'If I care about something, I’d rather say so.',
		'There’s no use pretending not to care.'
	],
	[P.Devout]: [
		'I said a little prayer for all of us this morning.',
		'The gods have a plan. I hope it’s a good one.',
		'There’s no battle without a blessing.',
		'I light a candle for the fallen every night.',
		'Faith is what you have when the sword breaks.',
		'I find comfort in a prayer spoken quietly.'
	],
	[P.Skeptical]: [
		'I’ll believe it when I’ve seen it for myself.',
		'Faith may comfort people, but I still want proof.',
		'The gods can help if they like. I’m bringing a plan.',
		'Every prophecy sounds clearer after it comes true.',
		'I ask questions before I trust an answer.',
		'A confident voice is not the same thing as proof.'
	]
};

export const characterThoughts: ThoughtTemplate[] = [
	...Object.values(D).map(d => make(C.Dream, ctx => ctx.mind.dream === d ? {} : null, dreams[d], 1.5)),
	...Object.values(F).map(f => make(C.Fear, ctx => ctx.mind.fear === f ? {} : null, fears[f], 1.2)),
	...Object.values(T).map(t => make(C.Pastime, ctx => ctx.mind.pastime === t ? {} : null, pastimes[t], 1.5)),
	...Object.values(P).map(p => make(C.Personality, ctx => ctx.has(p) ? {} : null, personalities[p], ctx => ctx.traitLevel(p))),

	// Thoughts shaped by combinations of independent personality axes
	make(C.Personality, ctx => (ctx.has(P.Bold) && ctx.has(P.Gloomy)) ? {} : null, [
		'If doom is coming, I may as well meet it standing.',
		'I know this may end badly. That is no reason to go halfway.'
	], ctx => Math.min(ctx.traitLevel(P.Bold), ctx.traitLevel(P.Gloomy))),
	make(C.Personality, ctx => (ctx.has(P.Cautious) && ctx.has(P.Cheerful)) ? {} : null, [
		'We will be fine. I have checked every way this could go wrong.',
		'There is always a bright side. I have made a list of the risks, just in case.'
	], ctx => Math.min(ctx.traitLevel(P.Cautious), ctx.traitLevel(P.Cheerful))),
	make(C.Personality, ctx => (ctx.has(P.Curious) && ctx.has(P.Skeptical)) ? {} : null, [
		'A mystery is an invitation. A claim is not evidence.',
		'I want to know what is behind that door. I also want proof it is not trapped.'
	], ctx => Math.min(ctx.traitLevel(P.Curious), ctx.traitLevel(P.Skeptical))),
	make(C.Personality, ctx => (ctx.has(P.Loyal) && ctx.has(P.Wry)) ? {} : null, [
		'I would follow this company anywhere. Preferably somewhere with a bed.',
		'They would be lost without me. Fortunately, I would never let them find out.'
	], ctx => Math.min(ctx.traitLevel(P.Loyal), ctx.traitLevel(P.Wry))),
	make(C.Personality, ctx => (ctx.has(P.Greedy) && ctx.has(P.Proud)) ? {} : null, [
		'If we are going to risk our necks, we should get paid and remembered.',
		'I want my share of the reward, and I want them to know who earned it.'
	], ctx => Math.min(ctx.traitLevel(P.Greedy), ctx.traitLevel(P.Proud))),
	make(C.Personality, ctx => (ctx.has(P.Generous) && ctx.has(P.Humble)) ? {} : null, [
		'I gave what I could. No need to make a story of it.',
		'We all needed a hand. I was there, that is all.'
	], ctx => Math.min(ctx.traitLevel(P.Generous), ctx.traitLevel(P.Humble))),
	make(C.Personality, ctx => (ctx.has(P.Independent) && ctx.has(P.Sincere)) ? {} : null, [
		'I walk my own road, and I will tell you plainly where it leads.',
		'I do not need to follow anyone. But when I agree with you, I mean it.'
	], ctx => Math.min(ctx.traitLevel(P.Independent), ctx.traitLevel(P.Sincere))),
	make(C.Personality, ctx => (ctx.has(P.Devout) && ctx.has(P.Cautious)) ? {} : null, [
		'I trust the gods. I still check the door twice.',
		'Faith may light the way; it does not make me stop watching my step.'
	], ctx => Math.min(ctx.traitLevel(P.Devout), ctx.traitLevel(P.Cautious))),

	// Who am I?
	make(C.Personality, ctx => ({ role: lower(ctx.role) }), [
		'Being {a role} was never what I planned. It’s what I do best.',
		'You don’t choose to be {a role}. It’s a calling.',
		'There are worse things to be than {a role}.',
		'I’m {a role}, and I’m proud of it. Mostly.'
	]),
	make(C.Personality, ctx => ({ species: lower(ctx.species) }), [
		'It’s not always easy being {a species} in a company like this.',
		'My people, the {species}, say that luck follows the brave.',
		'Not many {species} take up this life. I’m glad I did.',
		'Sometimes I think about what it means to be {a species}.'
	]),
	make(C.Personality, ctx => ({ background: lower(ctx.background) }), [
		'I used to be a {background}. It feels like another life.',
		'Once a {background}, always a {background}. Some things don’t wash off.',
		'My time as a {background} taught me things nobody else here knows.',
		'I think about my days as a {background} more than I’d like to admit.'
	]),
	make(C.Personality, ctx => (ctx.has(P.Loyal) && ctx.comrades.length > 0) ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'I’d follow {comrade} anywhere. I think they know.',
		'If {comrade} ever needed me, I’d be there.'
	]),
	make(C.Personality, ctx => ctx.has(P.Proud) && ctx.comrades.length > 0 ? { comrade: ctx.pick(ctx.comrades).name } : null, [
		'{Comrade} is good, but I’m better. I don’t say it to be unkind.',
		'I’d hate for {comrade} to think I’m not paying attention. I notice everything.'
	])
];
