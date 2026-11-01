import { ThoughtCategory as C } from '../../enums/thought-category';
import { PersonalityType as P } from '../../enums/personality-type';
import { StructureType as S } from '../../enums/structure-type';

import type { ThoughtTemplate } from '../../models/thought';

import { createThoughtBuilder } from './thought-builder';

const make = createThoughtBuilder('stronghold');

// Why a hero might want a structure we haven’t built
const reasons: Partial<Record<S, string[]>> = {
	[S.Academy]: [
		'Good instructors would get us all to the next level faster.',
		'Nothing beats being taught by someone who knows what they’re doing.'
	],
	[S.Bazaar]: [
		'Everything we buy would cost a quarter less.',
		'A proper market would save us a fortune on gear.'
	],
	[S.CountingHouse]: [
		'Every region we take would start paying us dues.',
		'Conquered land ought to be making us money.'
	],
	[S.Forge]: [
		'We’d have a better choice of what to build next.',
		'A forge gives us options for new buildings, and we’d like those.'
	],
	[S.Guildhall]: [
		'The guilds could take a quarter off the price of buying a region.',
		'Regions are expensive. The guilds have discounts for people with a hall.'
	],
	[S.Hall]: [
		'We could look over more candidates before taking on a new hero.',
		'We’d be able to find just the right recruit instead of the first who walks in.'
	],
	[S.Intelligencer]: [
		'We’d know enough about our enemies to put them at a disadvantage.',
		'A spy network would mean monsters start every fight worse off.'
	],
	[S.Monument]: [
		'Something grand to attract recruits to the company.',
		'A monument says we’re here to stay. It might bring someone to the cause.'
	],
	[S.Observatory]: [
		'Reading the stars would give us a second look at our options in a fight.',
		'The stars might tell us what to do in a tight spot.'
	],
	[S.Quartermaster]: [
		'We’d get to choose the kit a new recruit comes with.',
		'Better kit for our new people would help everyone.'
	],
	[S.Sanatorium]: [
		'It would mean treating wounds in the middle of a fight. I’d have used it already.',
		'Somewhere to patch up the wounded, and wake the unconscious.'
	],
	[S.Scriptorium]: [
		'Scrolls are worth their weight in gold. Better if we could write our own.',
		'A scribe on site would give us scrolls between battles.'
	],
	[S.Shipyard]: [
		'We could sail to any coast on the island, not just the land next door.',
		'The sea is right there. We’re wasting it.'
	],
	[S.Tavern]: [
		'A good tavern would recharge our other buildings without costing us coin.',
		'A warm room, good food, and our buildings back at full charge. Why don’t we have one?'
	],
	[S.Temple]: [
		'We’d go into battle with a blessing or two on our side.',
		'A temple would mean the gods owed us a favour on the field.'
	],
	[S.ThievesGuild]: [
		'We’d be able to take extra actions when it mattered most.',
		'Sometimes you need a fast hand and a short conscience. They’d provide both.'
	],
	[S.TrainingGround]: [
		'More choice when someone levels up would help.',
		'A proper place to train: that’s all we need.'
	],
	[S.WarRoom]: [
		'We could bring extra heroes into a fight when we need them.',
		'Planning is the soul of a fight. We should have a place to do it.'
	],
	[S.WizardTower]: [
		'We’d have a pick of magic items and potions when we buy.',
		'A tower full of wizards could point us toward better treasure.'
	]
};

// What a hero might say about a structure that stands in the stronghold
const praise: Partial<Record<S, string[]>> = {
	[S.Academy]: [
		'The Academy turned out a few good arguments, and a few good fighters.',
		'You can hear the drill sergeants from the Academy at dawn. I’ve got used to it.'
	],
	[S.Bazaar]: [
		'The Bazaar is where the real fights happen. Haggling is a blood sport.',
		'I do love a bargain, and the Bazaar delivers.'
	],
	[S.Barracks]: [
		'The Barracks floor is cold, but the company is warm.',
		'Home is the Barracks, whatever else is true.'
	],
	[S.CountingHouse]: [
		'The Counting House is the only place in the stronghold that smells like money.',
		'The clerks at the Counting House could count a river’s pebbles.'
	],
	[S.Forge]: [
		'The Forge is always warm. That’s why I keep walking past it.',
		'There’s a rhythm to the Forge that gets into your bones.'
	],
	[S.Guildhall]: [
		'The Guildhall is full of people who talk a lot and say very little. Handy for discounts.',
		'I like the Guildhall; they know everybody who matters.'
	],
	[S.Hall]: [
		'There’s always a crowd outside the Recruitment Hall. I wonder what they hope for.',
		'The Recruitment Hall is where I started. I look at it differently now.'
	],
	[S.Intelligencer]: [
		'The Intelligencer knows more about our enemies than they do.',
		'The Intelligencer smiles when I walk past. I don’t like it. I’m glad.'
	],
	[S.Monument]: [
		'The Monument catches the light just right at dusk.',
		'I’ve been told the Monument looks like me. It really doesn’t.'
	],
	[S.Observatory]: [
		'The Observatory is a good place to think. And look at stars.',
		'They say the Observatory has found a new constellation. I don’t know.'
	],
	[S.Quartermaster]: [
		'The Quartermaster counts every buckle. I find that reassuring.',
		'Nobody ever got lost with the Quartermaster’s inventory to hand.'
	],
	[S.Sanatorium]: [
		'The Sanatorium smells of clean linen and herbs. I hope I never need it. I know I will.',
		'The healers at the Sanatorium are a calming sort. I like that.'
	],
	[S.Scriptorium]: [
		'The Scriptorium is the only quiet place in the stronghold. I treasure it.',
		'I’ve learned to love the smell of ink from the Scriptorium.'
	],
	[S.Shipyard]: [
		'I can see the Shipyard from the walls. I’ve been looking at the sea more lately.',
		'You can tell a lot about a company by the quality of its ships.'
	],
	[S.Tavern]: [
		'The Tavern is the best-run building we’ve got.',
		'The Tavern keeps the stronghold running. Don’t ask me how.'
	],
	[S.Temple]: [
		'The Temple bells are the first thing I hear in the morning.',
		'I’ve lit a lamp at the Temple, in case it helps.'
	],
	[S.ThievesGuild]: [
		'The Thieves’ Guild hasn’t stolen from us yet. I’m choosing to take that as respect.',
		'I keep an eye on my purse near the Thieves’ Guild. They keep an eye on me.'
	],
	[S.TrainingGround]: [
		'I’ve spent half my life in the mud of the Training Ground. It’s done me good.',
		'The Training Ground never rests, and neither do we.'
	],
	[S.Warehouse]: [
		'The Warehouse is full of things we mean to use. Someday.',
		'I know every crate in the Warehouse by now.'
	],
	[S.WarRoom]: [
		'The War Room is where the real decisions are made. I’m not allowed in.',
		'The War Room door is shut. I want to know what’s behind it.'
	],
	[S.WizardTower]: [
		'The Wizard Tower hums at night. I try not to think about what it’s humming about.',
		'Every time I pass the Wizard Tower, something strange happens. I’m used to it now.'
	]
};

const upgradable = new Set<S>([ S.Barracks, S.Warehouse, S.Bazaar, S.CountingHouse, S.Monument ]);
const sharedReasons = [
	'It would give the company another way to prepare for what lies ahead.',
	'We’ve made it this far by building on good foundations.'
];
const sharedPraise = [
	'Every building here carries a little of our effort in its walls.',
	'This place feels more like ours every time something new takes shape.'
];

export const strongholdThoughts: ThoughtTemplate[] = [
	// Things we ought to build
	make(C.Stronghold, ctx => {
		if (ctx.unbuilt.length === 0) {
			return null;
		}
		const s = ctx.pick(ctx.unbuilt);
		const options = [ ...(reasons[s.type] ?? []), ...sharedReasons ];
		return { structure: s.name, reason: ctx.pick(options) };
	}, [
		'We should build a {structure}. {Reason}',
		'Why don’t we have a {structure} yet? {Reason}',
		'I keep thinking about the {structure} we haven’t built. {Reason}',
		'Somebody ought to build a {structure}. {Reason}',
		'If we had a {structure}, I think we’d be better off. {Reason}',
		'The {structure} would give us more room to grow. {Reason}'
	], 3),
	make(C.Stronghold, ctx => {
		if ((ctx.unbuilt.length === 0) || !ctx.has(P.Bold)) {
			return null;
		}
		return { structure: ctx.pick(ctx.unbuilt).name };
	}, [
		'A {structure}! Let’s build it now. I’ll lay the first stone myself.',
		'Why wait for a {structure}? Let’s get it done.',
		'We’ve talked about the {structure} long enough. Let’s build it.'
	]),
	make(C.Stronghold, ctx => {
		if ((ctx.unbuilt.length === 0) || !ctx.has(P.Cautious)) {
			return null;
		}
		return { structure: ctx.pick(ctx.unbuilt).name };
	}, [
		'I’d like a {structure}, but let’s be sure we can pay for it first.',
		'A {structure} would be fine. Not before the roof is mended, though.',
		'Let’s make sure the {structure} is the right next step.'
	]),

	// Things we have
	make(C.Stronghold, ctx => {
		if (ctx.structures.length === 0) {
			return null;
		}
		const s = ctx.pick(ctx.structures);
		const options = [ ...(praise[s.type] ?? []), ...sharedPraise ];
		return { line: ctx.pick(options) };
	}, [
		'{Line}',
		'I’m glad we have a place like this to come back to.'
	], 3),

	// Structures that need attention
	make(C.Stronghold, ctx => ctx.drained.length > 0 ? { structure: ctx.pick(ctx.drained).name } : null, [
		'The {structure} is spent. It needs recharging.',
		'Have we seen to the {structure}? It looks done in.',
		'The {structure} has no charges left. Better see to it.',
		'We’ve run the {structure} dry. Time to top it up.',
		'The {structure} has done its part. We should do ours.'
	], 2),
	make(C.Stronghold, ctx => (ctx.drained.length > 0 && ctx.hasStructure(S.Tavern)) ? { structure: ctx.pick(ctx.drained).name } : null, [
		'The Tavern can recharge the {structure}. I volunteer to do the field testing.',
		'Let the Tavern pick up the {structure}. It’s what it’s for.',
		'The {structure} has earned a rest. The Tavern can take it from here.'
	]),
	make(C.Stronghold, ctx => ctx.drained.length >= 3 ? { count: String(ctx.drained.length) } : null, [
		'{Count} of our buildings are empty. We’ve really used them up.',
		'We’ve been busy. {Count} of our buildings need recharging.',
		'We should make a round of the stronghold and get those {count} buildings ready.'
	]),
	make(C.Stronghold, ctx => {
		const options = ctx.structures.filter(s => !upgradable.has(s.type) && (s.charges > 0) && (ctx.money >= 50 * s.level));
		return options.length > 0 ? { structure: ctx.pick(options).name } : null;
	}, [
		'We could afford to improve the {structure} now.',
		'I’d put some coin into the {structure}. It would pay back.',
		'If we upgraded the {structure}, we’d feel it in every fight.',
		'The {structure} has served us well. We could help it serve us better.'
	]),

	// The size and state of the place
	make(C.Stronghold, ctx => ctx.structures.length <= 2 ? {} : null, [
		'It’s just the Barracks and the Warehouse. We have a lot to build.',
		'Not much of a stronghold yet. Just walls and good intentions.',
		'I look around and think: what a lot of space.',
		'One day every empty corner here will have a purpose.'
	], 2),
	make(C.Stronghold, ctx => ctx.structures.length >= 8 ? { count: String(ctx.structures.length) } : null, [
		'{Count} buildings! It’s becoming a proper stronghold.',
		'I got lost in the stronghold today. It’s that big now.',
		'There’s a little town’s worth of buildings here now.',
		'This place has grown around us while we were busy.'
	]),
	make(C.Stronghold, ctx => ctx.storesFill >= 0.8 ? { count: String(ctx.game.items.length) } : null, [
		'The Warehouse is getting full. {Count} things in there.',
		'We’re running out of room in the Warehouse. Time to sort it out.',
		'I can’t get into the Warehouse without moving three crates. It’s gotten too full.',
		'We should find homes for some of the things stacked in there.'
	], 2),
	make(C.Stronghold, ctx => ctx.storesFill <= 0.1 ? {} : null, [
		'The Warehouse is almost empty. You can hear your own footsteps in there.',
		'We’ve got a lot of room in the Warehouse. Time to fill it.',
		'An empty Warehouse. That’s either very tidy or very sad.',
		'There’s room for what we’ll need next. I hope we find it soon.'
	]),

	// Money
	make(C.Money, ctx => ctx.money >= 300 ? { money: String(ctx.money) } : null, [
		'We’ve got {money} in the coffers. We should spend it before it gets stolen.',
		'{Money} gold sitting there, earning nothing. That seems a waste.',
		'With {money} gold, we could do some real good.',
		'We should decide what this {money} gold can build for us.'
	], 1.5),
	make(C.Money, ctx => (ctx.money >= 100 && ctx.has(P.Greedy)) ? { money: String(ctx.money) } : null, [
		'I counted the gold again. {Money}. Still all there.',
		'I like looking at the {money} in the coffers. It’s very soothing.',
		'We could do with a bit more than {money}. A great deal more.',
		'I’m not counting it again. I’m just making sure it hasn’t grown.'
	], 2),
	make(C.Money, ctx => (ctx.money >= 100 && ctx.has(P.Generous)) ? { money: String(ctx.money) } : null, [
		'Gold is only worth something when it’s spent on others. {Money} is a lot of good.',
		'With {money}, we could do something kind for somebody.',
		'Let’s put some of that {money} toward making life easier for the company.'
	], 2),
	make(C.Money, ctx => ctx.money < 50 ? { money: String(ctx.money) } : null, [
		'There’s only {money} in the coffers. We’ll have to be careful.',
		'We’re short of money. I’ve checked every pocket.',
		'Coin’s scarce. I hope the next region pays well.',
		'We’ll have to make every coin do the work of two.'
	], 1.5),
	make(C.Money, ctx => ctx.money === 0 ? {} : null, [
		'There’s not a coin in the coffers. We’re broke.',
		'Not a penny left. Nobody tell the baker.',
		'We’re penniless. I’ve got half a biscuit and a loose button.',
		'Let’s not start a tab at the Tavern. Not today.'
	], 3),
	make(C.Money, ctx => ctx.has(P.Wry) && (ctx.money > 0) ? { money: String(ctx.money) } : null, [
		'{Money} gold: a fortune if you don’t need anything.',
		'We’ve got {money} gold. We’d have more if we stopped buying things.',
		'The coffers are lighter than I’d like, and heavier than they were yesterday.'
	])
];
