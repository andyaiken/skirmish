# Spec 11 — Monsters and bosses

**Type:** content top-ups across existing packs, plus one system
**Size:** medium
**Depends on:** nothing
**Status:** *Part A built — ten monsters across the five hero-only packs, plus the
`SpeciesModel.deathActions` hook that the Powder Keg needed. Parts B and C remain.*

---

## Why

### Every boss is the same boss

`QuirkType.Boss` is not a species property. `EncounterGenerator` picks an ordinary monster at random
and inflates it (`encounter-generator.ts:119`):

```ts
monster.name = NameGenerator.generateName(rng);
monster.features.push(FeatureLogic.createTraitFeature('boss-1', TraitType.Endurance, 2));
monster.features.push(FeatureLogic.createTraitFeature('boss-2', TraitType.Resolve, 2));
monster.features.push(FeatureLogic.createTraitFeature('boss-3', TraitType.Speed, 2));
// + 5 levels of random features
```

A named Goblin with +2 to everything. It works, but no boss is ever *designed*, and no encounter
ever has a set-piece opponent. `tasks.md` wants a Dragon; the current system cannot express one.

---

## Part B — Top-ups for the monster-light packs

### Out of the Grave (`pack-out-of-the-grave`)

**Ghoul** — `Undead`, paralysis via `MovementPenaltyCondition` at high rank.
**Lich** — see Part C. This is the pack that most obviously wants a designed boss.
**Gravedigger** (background) — the pack has no background at all. Adjacent-corpse interactions,
`summon(SummonType.Undead)`.
**Reliquary** (structure) — from `tasks.md` ("Sanctuary / Sacristy / Reliquary"). The pack has no
structure.

### The Fae Realm (`pack-fae-realm`)

The pack has three roles, two species, one monster and no structure.

**Redcap** — `Beast`-adjacent, Edged damage, gets stronger after a kill.
**Púca** — shapechanger; different damage type each encounter, set at generation.
**Gardens** (structure) — from `tasks.md` morale list.

### Cold Blood (`pack-cold-blood`)

**Basilisk** and **Lindworm** are built, taking the pack to 5 cards. What it still lacks is a
hero-facing card — see the Venomblade and the Charmer in the README's deferred list.

### The Menagerie (`pack-menagerie`)

`tasks.md` asks for big cats and a dragon. The cats belong here: **Stalking Cat** if not already
taken by Spec 03, or **Panther**, **Lion**. All `Beast`, high Speed and Stealth.

---

## Part C — Designed bosses

### The problem with the current system

Boss monsters are randomly selected and randomly upgraded, so they are statistically strong and
narratively empty. The player never faces something built to be faced.

### Proposal

Add a `boss: boolean` field to `SpeciesModel`, defaulting false. Species marked `boss: true` are:

- Excluded from the normal monster draw in `CampaignMapLogic.getMonsters`
- Eligible only where `EncounterGenerator` currently decides `isBoss`
- Used **as designed** — they do not receive the +2/+2/+2 and five random levels, because they are
  already built at that power

`EncounterGenerator.addMonster` needs a branch: if a boss is called for and a boss species is
available for the enabled packs, draw one; otherwise fall back to the existing inflate-a-random-
monster behaviour. That fallback matters — with no packs enabled there are no boss species, and the
base game must keep working.

### Boss species to design

| Boss | Pack | Notes |
| --- | --- | --- |
| **Lich** | Out of the Grave | `Undead`, `Boss`. Summons, Decay, high Resolve. The reanimation rule already in `startOfTurn` makes an undead boss genuinely hard to finish |
| **Dragon** | The Menagerie or Cold Blood | From `tasks.md`. Size 3 — only the Colossus is size 3 today. Breath weapon as a large burst |
| **Demon Lord** | Hell to Pay | Corruption, summons lesser fiends |
| **Kraken** | Deep Water (Spec 02) | Size 3, `Aquatic`. Multi-target attacks, `forceMovement(Pull)` |

Size 3 is worth a note: `getCombatantSquares` handles it, but a 3×3 combatant on a map generated with
corridors may be unable to move at all. Test dragon-sized bosses on cavern and arena maps
specifically, and consider gating large bosses to map types that can hold them.

### Optional: boss-only actions

A designed boss is much more interesting if it can act more than once. `ActionEffects.takeAnotherAction()`
exists and would give a boss a second action per turn, which is the standard way to make one opponent
a match for five heroes. Give it to boss species rather than building a new mechanic.

---

## Suggested order

1. Part B — pure data.
2. Part C's `boss` flag and the Lich, which needs no new pack.
3. Larger bosses once map-size interactions are tested.

## Acceptance criteria

- `CampaignMapLogic.getMonsters` never returns a boss species in the normal draw.
- With no packs enabled, boss generation still works via the existing inflate-a-monster path.
- A designed boss does not receive the generic +2 trait features or the five random levels.
- A size-3 boss can move on the map types it is allowed to appear on.
