# Spec 11 — Monsters and bosses

**Type:** content top-ups across existing packs, plus one system
**Size:** medium
**Depends on:** nothing

---

## Why

Two separate problems.

### ~~Five packs change what you play but not what you fight~~

*Fixed by Part A; each of these packs now has two monsters.*

| Pack | Hero cards | Monsters |
| --- | --- | --- |
| ~~Codex Arcanum~~ | 5 | ~~**0**~~ 2 |
| ~~Guile and Cunning~~ | 4 | ~~**0**~~ 2 |
| ~~The Workshop~~ | 5 | ~~**0**~~ 2 |
| ~~Power and Glory~~ | 4 | ~~**0**~~ 2 |
| ~~Magic in a Glass~~ | 10 | ~~**0**~~ 2 |

Half the packs in the game are hero-only. Enabling Power and Glory gives you a Deva, a Cleric, a
Paladin and a Zealot, and every encounter afterwards is against the same nine base monsters. The
monster deck is drawn by `CampaignMapLogic.getMonsters(region, packIDs)` and filtered by pack
exactly as the hero decks are, so the machinery is there and simply has nothing to select.

Conversely three packs are almost monster-only — The Elements (2 hero cards, 4 monsters), Cold Blood
(1 and 2), and The Menagerie (2 and 5).

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

## ~~Part A — Monsters for the hero-only packs~~

**Done** — all ten cards, plus the death-trigger hook the Powder Keg needed.

Two each, sized to the existing monster cards (2–4 actions, 2–5 features).

### ~~Codex Arcanum (`pack-01`)~~

~~**Animated Object**~~ — `Mindless`, `Amorphous`. A suit of armour or a statue moving on its own. High
Physical resistance, Impact damage. Cheap to design because Mindless monsters skip role and
background (`CombatantLogic.applyCombatantCards` handles this).

~~**Arcane Aberration**~~ — Psychic damage, condition-heavy. Psychic is Psion-only today and has no
monster at all.

### ~~Guile and Cunning (`pack-02`)~~

~~**Doppelganger**~~ — high Stealth, `ActionEffects.disarm()` and `steal()`, both implemented and barely
used. The monster that takes your things.

~~**Cutthroat**~~ — a humanoid that draws role and background cards, unlike most monsters. Poison and
Piercing.

### ~~The Workshop (`pack-06`)~~

~~**Automaton**~~ — `Drone`-flavoured but not literally Drone; Impact damage, Physical resistance,
PowderWeapons proficiency so it can carry the Rifle and Carbine the pack adds.

~~**Powder Keg**~~ — a monster that explodes on death. This needs a **death trigger**, which does not
exist: `EncounterLogic.kill` has no hook for on-death effects. Either add one (small, and useful
beyond this card) or cut the monster. The hook is worth having — undead reanimation is already a
special case in `startOfTurn` and a general trigger would tidy it.

> ~~The hook was added: `SpeciesModel.deathActions`, resolved and run from `EncounterLogic.kill`.~~

### ~~Power and Glory (`pack-07`)~~

~~**The Fallen**~~ — a Deva that went wrong. Light and Decay together, which no card combines.

~~**Inquisitor**~~ — Presence-based attacks, condition removal on allies. A monster that heals its side
is something the roster lacks entirely.

### ~~Magic in a Glass (`pack-08`)~~

~~**Mutagen**~~ — `Amorphous`, changes damage type between rounds. The changing part needs turn-start
logic; the simpler version is a monster with several damage types on one attack.

~~**Homunculus** — small, fast, `Drone`-like. Comes in numbers.~~

---

## Part B — Top-ups for the monster-light packs

### Out of the Grave (`pack-05`)

**Ghoul** — `Undead`, paralysis via `MovementPenaltyCondition` at high rank.
**Lich** — see Part C. This is the pack that most obviously wants a designed boss.
**Gravedigger** (background) — the pack has no background at all. Adjacent-corpse interactions,
`summon(SummonType.Undead)`.
**Reliquary** (structure) — from `tasks.md` ("Sanctuary / Sacristy / Reliquary"). The pack has no
structure.

### The Fae Realm (`pack-09`)

The pack has three roles, two species, one monster and no structure.

**Redcap** — `Beast`-adjacent, Edged damage, gets stronger after a kill.
**Púca** — shapechanger; different damage type each encounter, set at generation.
**Gardens** (structure) — from `tasks.md` morale list.

### Cold Blood (`pack-10`)

Covered in Spec 01, but the monsters belong here: **Basilisk** (petrifying gaze, adapting the
Medusa's existing pattern) and **Lindworm** (size 2, Poison).

### The Menagerie (`pack-04`)

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
| **Demon Lord** | Hell to Pay (Spec 01) | Corruption, summons lesser fiends |
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

1. ~~Part A — pure data, five packs, ten cards. Nothing else in the spec set improves the game's
   variety this cheaply.~~
2. Part B — pure data.
3. Part C's `boss` flag and the Lich, which needs no new pack.
4. Larger bosses once map-size interactions are tested.

## Acceptance criteria

- ~~Enabling any previously monster-free pack visibly changes the monsters encountered.~~
- `CampaignMapLogic.getMonsters` never returns a boss species in the normal draw.
- With no packs enabled, boss generation still works via the existing inflate-a-monster path.
- A designed boss does not receive the generic +2 trait features or the five random levels.
- A size-3 boss can move on the map types it is allowed to appear on.
- ~~All new monster species appear in the `monsterSpecies` array of the pack that owns them.~~
- ~~`npm run lint` and `tsc --noEmit` clean.~~
