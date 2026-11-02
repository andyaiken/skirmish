# Hero Thoughts

## Current context

Hero thoughts use a lightweight, data-driven template system. `ThoughtLogic` builds context from
the hero and game, filters eligible templates, then selects and voices a thought. Templates can
depend on memories, party composition, equipment, stronghold state, campaign progress, and
personality. Recent template IDs, expanded phrases, and categories are tracked per hero for variety.

Personality consists of eight independent axes, each with two opposite poles and a shared 0–6
position. The midpoint is neutral; pole strength is derived from the distance toward either end.
Personality affects thought eligibility and weight. An information button beside the hero's thought
opens a dialog showing the axes, aspirations, campaign history, and recent memories.

The character sheet reuses a hero's thought for 30 seconds, refreshing on expiry or when eligible
thought content or weights change. Significant milestones can shift an axis one step toward an
associated pole. The change is stored with its memory, and recent memories can produce thoughts
that reflect on personality shifts, injuries, enemies, and places. These foundations are in place;
future work should build on them rather than reimplement them.
When choosing purchases, a hero can recommend an offered structure or item based on personality
and equipment compatibility.

## Remaining work

### Develop character arcs

Milestone-driven personality shifts exist, but there is not yet a broader sense of a hero's
concerns or beliefs changing over a campaign.

- Define what an arc adds beyond the existing bounded event-to-axis shifts.
- Keep changes understandable, gradual, and tied to experiences rather than hidden drift.
- Surface meaningful developments to the player through the personality profile, memories, or
  thoughts.
- Avoid repetitive or contradictory arc beats; test progression, bounds, and persistence.

### Explore party banter

Let one hero occasionally respond to another hero's recent thought or action.

- Define how thoughts are shared and how responses remain attributable to the speaking hero.
- Avoid coupling general thought selection to character-sheet modal state.
- Preserve variety and avoid repetitive call-and-response loops.
- Prototype only when there is a clear player-facing interaction to validate.

### Tune thought pacing

Consider occasional silence or brief reactions so important thoughts stand out.

- Decide how often silence or short reactions occur and whether they count as recent thoughts for
  repeat/category variety.
- Keep timely or highly relevant thoughts from being suppressed by pacing.
- Use deterministic random selection when an injected RNG is supplied; test pacing alongside
  relevance and variety.

## Constraints for future work

- Prefer existing context, template eligibility, weights, memories, and personality axes over a
  parallel system.
- Use the RNG supplied through `ThoughtContext` for random decisions.
- Keep candidate evaluation side-effect free.
- Do not hide invalid template bindings or make malformed thoughts look successful.
- Preserve a useful fallback when no templates are eligible.
- Update focused tests and this spec when future behavior changes.

===============================================================================

## Problem

Today the loop is events → memories → thoughts, and it ends there. Outside the UI, the only
consumer of a hero's mind is `purchase-advice.ts`. Depth comes from state that feeds back into
play, so the aim is to make mind state matter to decisions, not to add more phrases.

## Review findings

Defects and weaknesses in the current implementation:

1. **Purchase advice ranks heroes, not options.** Each structure maps to one hardcoded
   `PersonalityType`, and the hero with the highest level of that trait recommends it (+1 if
   unbuilt). `missingRoles`, `drained`, `partyFull`, `storesFill`, and `money` in `ThoughtContext`
   go unused, as do affordability and whether an item improves on the equipped one. A hero with
   trait level 0 still recommends confidently.
2. **Personality shifts are thin and one-way.** Only four of 21 memory types move an axis
   (`SlewBoss`, `KnockedOut`, `AllyFell`, `RegionConquered`). Nothing pushes back and nothing
   decays. `KnockedOut` is keyed by region, so repeat knockouts in the same region never register.
3. **Re-trigger drift.** `MindLogic.remember` decides whether an event already shifted an axis by
   finding the previous memory in the live list. Once that memory is evicted (cap 16), the same
   event shifts the axis again.
4. **Eviction is by age only.** A boss kill can fall off after 16 minor events.
5. **Dream, fear, and pastime are static.** They are rolled once and never fulfilled, triggered, or
   frustrated.
6. **Background is display-only.** The initial personality roll is uniform and ignores species,
   role, and background.
7. **Candidate evaluation is not side-effect free.** `chooseThought` mutates `recent`, and
   `getStableThought` rebuilds and stringifies every candidate on each call.
8. **Death leaves little trace.** `comradesLost` holds ten names and no story.

## Priority and sequencing

Effort: S is a day or less, M is a few days, L is a week or more. Benefit weighs player usefulness
first, then depth. Steps within a row can overlap; "needs" lists hard dependencies only.

| Step | Work | Effort | Benefit | Needs |
|------|------|--------|---------|-------|
| 1 | Phase 0 foundations | S–M | High (fixes real bugs, unblocks everything) | none |
| 2 | Phase 2a: need-based advice with "Why" line | M | High (the player-facing payoff) | none |
| 2 | Quick wins: obituary, epithets, "tell me about them" summary | S | Medium | step 1 for the summary |
| 3 | Phase 1: relationships and earned tags | L | Very high (unlocks most later work) | step 1 |
| 4 | Phase 1b: lasting loss | M | High (emotional core) | steps 1, 3 |
| 4 | Phase 2b: multi-voice advice and dissent | S–M | High | steps 2, 3 |
| 4 | Party banter from `hero-thoughts.md` | M | Medium | step 3 |
| 5 | Phase 4: dream, fear, pastime triggers | M | Medium | step 1 |
| 6 | Phase 3: mood and needs | L | High, but balance risk | steps 3, 5 |
| 7 | Phase 5: wishes | M | Medium–high | steps 2, 6 |
| 7 | Phase 6: arcs | M | Medium | step 1 |

Reasoning:

- **Step 1 first** because it fixes the shifted-flag drift, adds memory importance (needed by
  lasting loss), and makes thought selection side-effect free. Every later phase builds on those.
- **Step 2a in parallel with step 3** because need-based advice needs no relationship data and is
  the most direct answer to making minds useful. The dissent part waits for opinions.
- **Relationships before mood** because opinion is one of mood's main drivers, and mood without it
  would be thin.
- **Triggers before mood** for the same reason: mood needs fulfilled and frustrated drivers to read.
- **Mood is the riskiest step.** It is the first place where mind state affects play, so it gets the
  open questions below answered first and ships with tuning tests.

### Backlog

Not scheduled. Pull these in once the step they depend on has landed.

| Idea | Effort | Benefit | Needs |
|------|--------|---------|-------|
| Naming weapons, monsters, and places | S | Low–medium (charm) | step 1 |
| Habits and tics | S–M | Medium (flavour in play) | none |
| Opinions about things (species, regions, structures) | M | Medium–high | step 3 pattern |
| Enemies with memories (surviving bosses hunt their attackers) | M–L | High (world responds) | step 1; touches encounters |
| Returning characters (retired or lost heroes resurface) | M | Medium–high | step 4 lasting loss |
| Stories at the Tavern, company legends | M | Medium | step 3 |
| Mentorship | M | Medium | step 3 |
| Secrets | M | Medium | step 3, step 6 |
| Promises | M | High (a real player choice) | step 6 |
| Hard choices that cost relationships | L | Very high | steps 3, 6 |
| Factions within the company | L | Medium–high | steps 3, 6 |
| Reputation across the island | L | Medium–high | step 6 |
| Traditions and leadership | M | Low–medium | steps 3, 6 |
| Legends mode (exportable campaign history) | S–M | Medium | Phase 6 chronicle |

Best next picks after step 7: hard choices, enemies with memories, promises, and opinions about
things. They convert existing state into decisions the player makes.

## Phase 0: Foundations (quick fixes)

Do these first; later phases depend on them.

- Record whether a memory has already shifted personality in a durable field, not by looking it up
  in the live memory list.
- Let more memory types move axes in both directions, with a per-axis cooldown measured in
  encounters. Examples: `Victory` and `Unscathed` reinforce Bold; `Retreat` and `Wounded` reinforce
  Cautious; `NewComrade` and `AllyDown` pull toward Loyal; repeated `LeftBehind` pulls toward
  Independent.
- Add `importance` to `MemoryModel`. Evict the lowest `importance` weighted by age, and keep a small
  number of defining memories (for example boss kills, an ally falling, a region conquered)
  permanently.
- Seed the initial personality from species, role, and background as small biases on the random
  roll, so those fields mean something.
- Split `chooseThought` into a pure pick and a separate "record that it was said". Cache the stable
  thought's candidate signature instead of stringifying on every call.

Tests: bounds, persistence of the shifted flag through eviction, cooldown, and bias seeding with an
injected RNG.

## Phase 1: Relationships

A pairwise opinion between heroes, built from shared experience.

- `RelationshipModel`: `other` (hero id), `opinion` (bounded integer), and an optional `tag`
  (`Friend`, `Rival`, `Mentor`, `OwesLife`).
- Opinion changes on: fighting together, `AllyDown` followed by survival (rescue), who fell, who
  made the kill, gear gifts, and being left behind.
- Personality modulates changes: Loyal amplifies positive opinion, Independent damps both,
  Proud resents being rescued, Humble does not.
- Store a bounded number of strongest relationships per hero. Retirement drops them; death
  converts them to lasting loss, below.
- Tags form when opinion crosses a threshold and stays there for several shared encounters, so
  friendship and rivalry are earned. A rivalry needs a cause (competing for kills, being rescued by
  the other while Proud), not just a low opinion. Tag changes create a memory.
- **Lasting loss.** When a hero dies, the survivors' relationships with them turn into
  *defining memories* that do not fade:
  - Friend or Mentor: a grief memory. Rival: a complicated one (relief, emptiness, "nobody left to
    beat"). OwesLife: a debt that can no longer be repaid.
  - It stores the dead hero's name, species, role, and how they fell, because the hero no longer
    exists to look up.
  - It is exempt from age-based eviction and from the `maxAge` cut-off. Instead of fading, it
    surfaces on cues: returning to the region where they fell, recruiting the same species or
    role, a similar fight, a level-up or milestone they would have enjoyed, and occasionally at
    random with low weight.
  - Grief moves axes once (through the Phase 0 shifted flag): Gloomy for a friend, Cautious or
    Independent for repeated losses, Bold or Proud for a rival's death in some cases.
  - Cap pinned loss memories per hero (about three). A new one replaces the least important, so
    saves stay bounded. The dead remain in `comradesLost`.
  - Mood (Phase 3) reads these as a standing driver that eases but never reaches zero.
  Saves are already about 280kB and driven by hero count, so the storage must not grow with the
  square of party size.
- Surface opinions in the personality profile, and use them in thoughts, advice, and the party
  banter described in `plans/hero-thoughts.md`.

Tests: opinion bounds, personality modulation, cap and cleanup on retirement or death, and old
saves with no relationships.

## Phase 2: Evidence-based, multi-voiced advice

Make advice useful, not only flavourful.

- Score each option by need first, using the existing context: missing roles, drained structures,
  a full party, store pressure, money and affordability, and equipment upgrades over what is
  equipped.
- Use personality only to choose the speaker and the framing, and to break ties.
- Show up to three heroes. At least one may dissent when its trait or opinion conflicts with the
  leading choice.
- Add a one-line "Why" built from real facts, so the player can check the advice.
- Do not make a recommendation from a trait the hero lacks. Fall back to a neutral voice instead.

Tests: need beats personality, affordability, dissent selection, and stable output with an injected
RNG.

## Phase 3: Mood and needs

The bridge from flavour to consequence.

- Compute mood from drivers: dream progress, fear exposure, pastime opportunity, recent
  victories and losses, relationships, and company.
- Show mood on the roster and list its drivers, so changes are explained rather than hidden.
- Consequences should be small and legible: a minor stat nudge, a refusal to leave the stronghold,
  a request, or an outburst. Nothing should be silently punitive.
- Mood must be derived from stored facts where possible, to keep saves small.

Tests: driver weights, mood bounds, and consequence thresholds.

## Phase 4: Dream, fear, and pastime as triggers

- Dreams track progress and create memories on fulfilment or setback: `Wealth` against money,
  `Home` against the stronghold, `Glory` against bosses slain, `Redemption` against rescues.
- Fears trigger on matching encounter conditions or damage types, creating memories and temporary
  mood effects.
- Pastimes are satisfied by matching stronghold structures (for example a Tavern), feeding mood.

## Phase 5: Wishes

- A hero occasionally asks for something concrete: a structure, an item, a rest, or a particular
  ally in the party.
- A wish has an expiry, appears in the profile, and resolves into a memory and a mood change when
  fulfilled or ignored.
- Wishes reuse the advice need scoring from Phase 2 rather than a separate system.

## Phase 6: Arcs, titles, and chronicle

- Derive named arcs from axis trajectory over a campaign (for example Hardened, Shaken, Humbled),
  with a visible beat when one begins or ends.
- Award epithets from history (for example for bosses of a species, or a record of surviving
  knockouts) and show them on the character sheet.
- Add a campaign chronicle and an obituary for each fallen hero, kept compact.

## Backlog ideas in detail

Descriptions for the entries in the backlog table. Each should reuse existing state rather than add
a parallel system.

### Heroes as people

- **Habits and tics.** Small recurring behaviours that show in play and the log, such as naming a
  weapon, touching a charm before a fight, or refusing to fight on a particular night.
- **Private rituals after loss.** After a death, a hero sets aside a share of loot, visits the
  region where it happened, or names a recruit after the dead. Extends lasting loss.
- **Secrets.** A hidden fact (a debt, a past crime, a fear of their own side) revealed only by
  enough shared history or a particular event, which then changes thoughts and mood.
- **Opinions about things.** Likes and dislikes for monster species, regions, weapons, and
  structures, formed by experience. A hero knocked out by wolves develops a wolf grudge.
- **Naming things.** Heroes name weapons, a recurring monster, or a favourite place. The names
  appear in thoughts and the chronicle.

### The company as a society

- **Factions within the company.** Cliques form from friendships and shared dreams. They advise
  differently, and a rift can split them.
- **Stories at the Tavern.** Heroes tell each other memories, listeners may form a small opinion,
  and the company builds a legend from true events whose exaggeration grows with retelling.
- **Traditions.** A recurring event the company invents, such as a toast to the fallen after each
  boss. Someone proposes it and others must agree.
- **Mentorship.** A senior hero takes a junior under their wing, passing on a trait, habit, or small
  bonus, and creating a bond that matters if either falls.
- **Leadership.** Someone becomes the company's voice from opinion, deeds, and personality. Others
  defer or resent them.

### Player choices

- **Hard choices that cost relationships.** Two heroes want opposite things (retreat or press on).
  Whichever the player picks, someone's opinion shifts.
- **Promises.** A hero asks the player to promise something ("don't leave Dara behind"). Keeping it
  builds trust; breaking it costs something lasting.
- **Reputation.** The island reacts to the company's history: towns saved, enemies who know the
  name, bounties after a massacre. Epithets feed into it.
- **Debt and favours.** A hero owes another hero, or an NPC from their background, and it comes due
  as a quest hook.

### The world responds

- **Enemies with memories.** A boss that survives remembers whoever hurt it and hunts them. This is
  the mirror image of hero memories.
- **Returning characters.** A retired or lost hero resurfaces as a rival, hermit, or ghost, using
  their stored name, species, and role.
- **Omens and weather.** Storms, eclipses, and anniversaries shift mood or trigger fears.
- **Home region echoes.** A hero's background ties to a place on the island. Reaching it triggers a
  memory, a reunion, or a decision.

### Systems and presentation

- **Skills from habit.** A hero who keeps using one approach unlocks a quirk or minor perk from it.
- **Compatibility as a puzzle.** Because personality and opinion affect mood, assembling a party
  becomes a deliberate choice.
- **Legends mode.** After a campaign, a generated history of the company that can be exported or
  shared. Needs the Phase 6 chronicle.

## Constraints

- Prefer the existing context, template eligibility, weights, memories, and personality axes over a
  parallel system.
- Use the RNG supplied through `ThoughtContext` for random decisions; candidate evaluation stays
  side-effect free.
- Keep every change explainable in the UI. No hidden drift.
- Keep saved state bounded, and migrate old saves through `MindLogic.ensure`.
- Do not hide invalid template bindings or make malformed thoughts look successful.
- Update focused tests and `plans/hero-thoughts.md` when behaviour changes.

## Open questions

- Should mood have mechanical effects in encounters, or only in the stronghold?
- Can a hero leave the company over sustained low mood, and is that acceptable in an unreleased
  game with an existing hero cap?
- How many heroes should advice show before it becomes noise?
