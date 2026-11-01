import { ThoughtCategory as C } from '../../enums/thought-category';

import type { ThoughtTemplate } from '../../models/thought';

import { createThoughtBuilder } from './thought-builder';

const make = createThoughtBuilder('musing');

// Idle thoughts that anybody might have at any time, so there is always something to say
const musings: string[][] = [
	[
		'I wonder what’s for dinner.',
		'Is it dinner time yet? I feel like it should be.',
		'I could eat a horse. Not a particular horse. Just in general.',
		'I hope there’s something warm on the table tonight.'
	],
	[
		'The weather’s turning. I can feel it in my bones.',
		'It looks like rain. It always looks like rain.',
		'The sky has gone odd. I don’t trust it.',
		'The wind has that look about it. You know the one.'
	],
	[
		'I wonder what the townsfolk really think of us.',
		'The townsfolk give us strange looks. I’ve decided it’s admiration.',
		'Everyone in town seems to know my name. That’s unnerving.',
		'I waved at someone in town and they waved back. I think we’re friends now.'
	],
	[
		'My boots are wet. They’ve been wet for days.',
		'I’d give a lot for dry socks.',
		'There’s a hole in my boot, and I’m pretending there isn’t.',
		'I’ve forgotten what dry boots feel like.'
	],
	[
		'I thought I heard something in the walls last night.',
		'The stronghold creaks at night. I’m sure it’s the wind.',
		'Something scratched at my door. It was probably a cat.',
		'If the walls are haunted, at least the ghosts are polite.'
	],
	[
		'What a strange life this is.',
		'If you’d told me five years ago, I’d have laughed.',
		'I never planned on any of this.',
		'Somehow, this has become ordinary. That’s the strangest part.'
	],
	[
		'I should write to my family. I should.',
		'I wonder if anyone back home thinks of me.',
		'I haven’t sent word home in a while.',
		'I wonder what I’d even say in a letter.'
	],
	[
		'The birds were very loud this morning.',
		'There’s a crow that follows me everywhere. I’ve named him Gerald.',
		'I like the sound of the wind in the stronghold walls.',
		'I think the birds know something we don’t.'
	],
	[
		'I could use a rest. A proper one.',
		'I wonder what a day without anything to do would feel like.',
		'Rest is for the dead, they say. I’d like a bit anyway.',
		'I’d like one whole day where nobody needs me to be brave.'
	],
	[
		'I keep losing my left glove. It makes no sense.',
		'I swear I put my knife down right here.',
		'I can’t find my other sock, and I’m not sure I ever had it.',
		'I should tie my belongings to myself. Just to be safe.'
	],
	[
		'The bread here is better than it has any right to be.',
		'Somebody in the kitchen knows what they’re doing, and I salute them.',
		'Cheese. That’s all I’m thinking about. Cheese.',
		'I’m beginning to think the cook is the most powerful person here.'
	],
	[
		'There’s a smell in the stables I can’t place.',
		'The stronghold smells of woodsmoke and old stone. I rather like it.',
		'Someone’s been baking. I’m going to find out who.',
		'Every building has its own smell. I know them all now.'
	],
	[
		'Everyone here has a story. I’d like to hear them all.',
		'I wonder how everyone ended up here.',
		'We’re a strange bunch, when you think about it.',
		'I bet the quiet ones have the best stories.'
	],
	[
		'I’m not sure what day it is.',
		'Has anyone seen the calendar? I think I’ve lost a week.',
		'Time passes strangely when you’re fighting for your life.',
		'If it’s morning, I’m calling it a good morning.'
	],
	[
		'I’ve been standing here for ten minutes and I can’t remember why.',
		'I had a thought a moment ago. It was a good one.',
		'What was I going to do next? It’ll come back to me.',
		'I was on my way somewhere. I hope it was important.'
	],
	[
		'Looking at the walls, I think we’ve built something real.',
		'It’s strange to think we made all this.',
		'A year ago, none of this existed.',
		'I know every stone we’ve put in place. Not literally. Mostly.'
	],
	[
		'I wonder what’s over the wall.',
		'The horizon never looks any closer, does it?',
		'There’s a hill to the east I keep staring at.',
		'One day I’m going to walk until the map runs out.'
	],
	[
		'There are worse places to be than here.',
		'I could do worse than this life.',
		'It’s not perfect, but it’s ours.',
		'I think I’m starting to feel at home.'
	],
	[
		'Someone has been in my room. Nothing’s gone, but things have moved.',
		'My bed was made today. I didn’t make it.',
		'I’m sure someone has been rearranging my things.',
		'I’m going to leave a crumb trail and see who’s tidying up.'
	],
	[
		'A quiet day is a good day.',
		'I’m enjoying the peace. It won’t last.',
		'No fighting today. I’m going to appreciate it.',
		'I should remember how this sounds before the next battle.'
	],
	[
		'I wonder how the monsters see us.',
		'Do monsters have days off, do you think?',
		'I wonder if the things we fight have homes to go to.',
		'Maybe we’re the frightening thing in someone else’s story.'
	],
	[
		'I feel as though I’ve forgotten something important.',
		'Did I leave a fire burning? Probably not.',
		'There’s something I meant to do. It’ll come to me.',
		'If it was truly important, I’m sure it’ll come back.'
	],
	[
		'I’ve got an itch I can’t reach.',
		'My shoulder aches when it rains. It’s going to rain.',
		'My knees tell me when it’s cold. They’re very chatty today.',
		'I’m collecting aches like other people collect souvenirs.'
	],
	[
		'I like the way the light falls in the courtyard.',
		'Look at that sky. Just look at it.',
		'The evening light makes this place look almost grand.',
		'I wonder if the sky looks the same from the other side of the island.'
	],
	[
		'I really must get around to mending that cloak.',
		'My cloak’s coming apart at the seams. As am I.',
		'I should clean my gear. I’ll do it tomorrow.',
		'If I mend it carefully, the tear might become a feature.'
	],
	[
		'A cup of something hot would be lovely right now.',
		'Is there any tea left? Or anything like tea?',
		'I’d trade a lot for a warm drink.',
		'I’m not fussy. I’ll even take the tea that tastes like bark.'
	],
	[
		'I wonder who’ll be next to join us.',
		'The company feels different every time someone new arrives.',
		'I’m curious who’ll be through the gates next.',
		'I hope they like us. We’re not always easy to like.'
	],
	[
		'Ah, to be a cat. Sleeping in the sun all day.',
		'The cat by the Warehouse has the right idea about life.',
		'There’s a dog that’s adopted me. I haven’t told him no.',
		'I’d like to be an animal with no responsibilities for a day.'
	],
	[
		'I’ve been wondering what we’d do if we ever won.',
		'What happens when we’re finished here?',
		'Would we stay on this island, if the fighting stopped?',
		'I don’t know if I remember how to live without a cause.'
	],
	[
		'I’m going to count the stones in the wall. Just to pass the time.',
		'Forty-two paces from the gate to the hall. I counted.',
		'I know every crack in this courtyard.',
		'I’ve started counting the steps. It gives the day some shape.'
	],
	[
		'I don’t mind a bit of danger, so long as the pay is regular.',
		'Someone told me this would be glamorous.',
		'No one warned me about the amount of walking.',
		'At least the view is good when we’re running for our lives.'
	],
	[
		'There’s nothing like the first morning after a victory.',
		'The best sleep I ever had was after a hard fight.',
		'Days like this make the bad ones worth it.',
		'The stronghold feels lighter when everyone comes home.'
	],
	[
		'I’ve always wondered how stone is cut so straight.',
		'I could watch builders all day.',
		'It takes real skill to build a wall. I respect that.',
		'I never appreciated a good wall until I had to defend one.'
	],
	[
		'Someone is humming somewhere. I can’t tell who.',
		'There’s a sound in the distance. A horn, I think.',
		'The bells keep ringing the wrong hour. I’ve stopped relying on them.',
		'I like the way the whole stronghold wakes up one sound at a time.'
	],
	[ 'Hmm.', 'Hmm. Yes. Right.', 'Hm. Well, there it is.', 'Ah. I see. I don’t, but I see.' ]
];

export const musingThoughts: ThoughtTemplate[] = musings.map(say => make(C.Musing, () => ({}), say, 0.4));
