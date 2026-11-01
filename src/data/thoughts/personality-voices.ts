import { PersonalityType as P } from '../../enums/personality-type';

export interface PersonalityVoice {
	// Whole sentences placed before the thought
	before: string[];
	// Whole sentences placed after the thought
	after: string[];
	beforeRatio: number;
	transform?: (text: string) => string;
}

export const personalityVoices: Record<P, PersonalityVoice> = {
	[P.Bold]: {
		before: [ 'Ha!', 'Right then.', 'No fear.', 'Good. I was getting restless.' ],
		after: [ 'Let’s get on with it.', 'And I’m not afraid to say so.', 'I say we just do it.', 'We’ll manage the consequences when they arrive.' ],
		beforeRatio: 0.7
	},
	[P.Cautious]: {
		before: [ 'Well…', 'I’ve been thinking, carefully.', 'Hmm, let me be sure.', 'Let’s take this one step at a time.' ],
		after: [ 'Though we should double-check.', 'But let’s not be hasty.', 'I may be wrong, of course.', 'We should leave ourselves another option.' ],
		beforeRatio: 0.3
	},
	[P.Cheerful]: {
		before: [ 'Oh!', 'You know what?', 'Ha, lovely.', 'Well, that’s a bright spot.' ],
		after: [ 'Isn’t that wonderful?', 'It’ll all work out!', 'Still, mustn’t grumble.', 'There’s always something to smile about!' ],
		beforeRatio: 0.6,
		transform: text => text.endsWith('.') ? `${text.slice(0, -1)}!` : text
	},
	[P.Gloomy]: {
		before: [ 'Sigh.', 'Ah, well.', 'Of course.', 'I had a feeling.' ],
		after: [ 'Not that it will help.', 'It’ll probably go wrong.', 'But what does it matter?', 'At least it can hardly get worse.' ],
		beforeRatio: 0.3
	},
	[P.Greedy]: {
		before: [ 'Now then.', 'Mm, interesting.', 'Hold on.', 'Let’s talk terms.' ],
		after: [ 'I wonder what it’s worth.', 'There must be coin in it somewhere.', 'Is there a fee for that?', 'Nothing wrong with asking what it pays.' ],
		beforeRatio: 0.55
	},
	[P.Generous]: {
		before: [ 'Bless me.', 'Friend,', 'Oh, dear.', 'Come, let me help.' ],
		after: [ 'I hope everyone’s all right.', 'I’d happily share the burden.', 'There’s enough for all of us.', 'We’re better when we look after one another.' ],
		beforeRatio: 0.35
	},
	[P.Curious]: {
		before: [ 'Hm, interesting.', 'Now that’s odd.', 'I wonder…', 'That raises a question.' ],
		after: [ 'I’d love to know why.', 'What do you make of that?', 'I should look into it.', 'There’s more to this than meets the eye.' ],
		beforeRatio: 0.65
	},
	[P.Content]: {
		before: [ 'Well enough.', 'As it is, then.', 'No need to fuss.', 'That’ll do nicely.' ],
		after: [ 'I’m content with that.', 'Some things can stay a mystery.', 'It’s all right as it is.', 'We needn’t make more of it.' ],
		beforeRatio: 0.35
	},
	[P.Proud]: {
		before: [ 'Naturally.', 'Mark me.', 'Ahem.', 'I did see this coming.' ],
		after: [ 'As you’d expect from me.', 'I’ve never been wrong about this sort of thing.', 'Remember who said it.', 'You may quote me on that.' ],
		beforeRatio: 0.7
	},
	[P.Humble]: {
		before: [ 'Um.', 'Sorry, but…', 'It’s only me, but…', 'I hope you don’t mind me saying…' ],
		after: [ 'But what do I know?', 'I could be mistaken.', 'Don’t mind me.', 'Someone else would probably put it better.' ],
		beforeRatio: 0.25
	},
	[P.Loyal]: {
		before: [ 'For the company.', 'Between us,', 'Let me say this.', 'I’ve got your back.' ],
		after: [ 'I’m with you, whatever happens.', 'We’ll get through it together.', 'The company comes first.', 'No one here has to face it alone.' ],
		beforeRatio: 0.35
	},
	[P.Independent]: {
		before: [ 'If you ask me,', 'Speaking for myself,', 'My own view is…', 'I’ve made up my mind.' ],
		after: [ 'That’s my choice to make.', 'I’ll find my own way.', 'I can manage on my own.', 'I’ll take responsibility for my answer.' ],
		beforeRatio: 0.6
	},
	[P.Wry]: {
		before: [ 'Oh, joy.', 'Well, well.', 'Brilliant.', 'This should be interesting.' ],
		after: [ 'But I’m sure it’s fine.', 'Who’d have thought?', 'Isn’t life grand?', 'I’ll try not to look surprised.' ],
		beforeRatio: 0.5
	},
	[P.Sincere]: {
		before: [ 'Honestly,', 'Truly,', 'Let me be plain.', 'I’ll say it as I see it.' ],
		after: [ 'I mean that.', 'No joke.', 'That’s the truth of it.', 'I’d rather be clear than clever.' ],
		beforeRatio: 0.65
	},
	[P.Devout]: {
		before: [ 'The gods willing,', 'Blessings upon us.', 'By the light.', 'May we be guided.' ],
		after: [ 'May the gods watch over us.', 'It’s all in the gods’ hands.', 'I’ll say a prayer for it.', 'We should give thanks while we can.' ],
		beforeRatio: 0.6
	},
	[P.Skeptical]: {
		before: [ 'So they say.', 'I’ll reserve judgment.', 'If the evidence holds…', 'That’s a claim, at least.' ],
		after: [ 'I’ll want to check that.', 'Let’s see if it proves true.', 'I’m not convinced yet.', 'I’ll believe the part I can verify.' ],
		beforeRatio: 0.35
	}
};
