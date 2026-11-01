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
