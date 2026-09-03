# Blood and Sand

## Why this pack

`tasks.md` lists three separate wants that are all the same pack:

- Map type: **Arena** — *built, and shipped as a base-game map type rather than pack content; see
  Part A*
- Role idea: **Gladiator** (large weapons, showmanship)
- Role idea: **Ravager**
- Structure idea: **Trophy Room**

It also closes a smaller gap. **Brawl** is a full skill with no associated item — Sensei and Ninja
build on it and fight with nothing in their hands, because no item in the game supports unarmed
combat. A gladiator pack is the natural home for that.

**Naming:** *Blood and Sand* is the phrase for exactly this. No alternative needed.

```ts
static arena = (): PackModel => ({
    id: 'pack-blood-and-sand',
    name: 'Blood and Sand',
    description: 'Fighting to win is one thing. Fighting to be watched is another.'
});
```

---

## ~~Part A — The Arena map type~~ — **built**

`EncounterMapGenerator.generateArenaMap` builds a single open ellipse of roughly the requested area
(`pi * radiusX * radiusY = size`), with the aspect ratio wandering between 1.0 and 1.5 either side of
a circle and a coin toss deciding which axis is the long one. Measured over five seeds: 395–407
squares, bounding boxes from 17x31 to 31x17, fully connected.

The obstructed-blob pass **moved out of `generateEncounterMap`** and into the four maze-shaped
generators, which now call `EncounterMapGenerator.addObstructedBlobs` themselves. This was the second
of the two options the earlier draft weighed — special-case the arena inside `generateEncounterMap`,
or push the pass down into the generators that want it — and it is the one that leaves the door open
for Spec 03's terrain-dependent density. Because the loop now runs at the same point in the RNG
stream as before, seeded output for the four existing map types is unchanged.

The arena calls `addPillars` instead: 1–4 pillars, each with a coin-toss chance of extending one
square into a two-square barrier, drawn from squares with floor on all four sides so a pillar is
never just a bump in the rim. That gives 2–5 obstructed squares against the cavern's ~20.

**The arena is a standard map type and is deliberately never gated.** An earlier draft of this plan
had it appear only when the pack was enabled; that is dropped. A map shape is not a card — it costs
the player nothing to learn, it needs no pack to make sense of it, and every existing card already
plays differently on it. Gating it would have meant `generateEncounterMap` taking `packIDs` purely to
withhold terrain, which is plumbing in service of a restriction nobody wanted. It sits in the base
rotation alongside dungeon, ruin, cavern and street.

The rest of Blood and Sand still needs the pack. Part A is simply not part of it.

`terrainWeights` gained an `arena` column, weighted like a smaller version of the street — 2 in open
country, 1 elsewhere — since an arena is a built thing, and an open floor should stay a change of
pace rather than a default.

**Building Interior**, the other map type in `plans/index.md`, is **built** — also as a standard map
type, and for the same reason. `EncounterMapGenerator.generateBuildingMap` carves a rectangular
footprint into rooms by binary space partition rather than the corridor spine this plan first
suggested: BSP is less code than the spine bookkeeping and gives the packed rectangular floor plan a
building should have, where a spine tends to a sparse plus-shape with dead exterior. Rooms are at
least 4 squares on a side, so a size 2 combatant can stand in the smallest of them, and
`terrainWeights` gained a `building` column at 3 in open country, 2 in forest, 1 in the rocks.

Two things were worth knowing before starting it, and both are recorded here because they will come
up again for anyone touching this generator:

- **`Obstructed` is not a wall.** It is difficult terrain — `+1` movement, no effect on line of
  sight — so interior walls have to be gaps in the square list, not obstructed squares. Reaching for
  `Obstructed` gives you a house you can see straight through.
- **Connectivity is the real risk.** Every other generator is connected by construction; a
  room-and-door layout is the first that can seal a room, and nothing in the codebase validates
  reachability, so a sealed monster is an encounter that can never be finished. Doors are therefore
  cut bottom-up — both halves of a region are carved and connected before the door joining them is
  placed, so it can be aimed at squares already known to be floor, with a forced three-square carve
  as a fallback. A 200-seed reachability test guards it.

Measured over 200 seeds: mean 399 floor squares (368–426), every one fully connected.

---

## Part B — Cards

### Gladiator (role)

From `tasks.md`: large weapons and showmanship. The design hook is that showmanship should be
mechanical, not flavour — the Gladiator is the first role to make **Presence** matter in a fight
without being a spellcaster or a commander.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Weapon +2, Presence +2, LargeWeapons, LightArmor |
| Features | Endurance +1, Weapon +2, Presence +2, Impact +1 |
| Action | *Crowd-Pleaser* — melee attack; on hit, add a Presence-rooted damage bonus condition to self |
| Action | *Killing Blow* — melee attack with `skillBonus: -2` and `dealWeaponDamage(2)`; prerequisite `ActionPrerequisites.meleeWeapon()` |
| Action | *Play to the Gallery* — burst on enemies, Presence vs Resolve, on hit `ActionEffects.stun()` |
| Action | *Sweeping Blow* — melee attack against `Number.MAX_VALUE` enemies at radius 0, `skillBonus: -2` |
| Action | *Second Wind* — prerequisite `ActionPrerequisites.damage()`; `ActionEffects.healDamage()` and stand |

Target 5–6.

### Ravager (role)

From `tasks.md`, no further detail given. The reading that does not duplicate the Barbarian: the
Barbarian attacks recklessly and takes the consequences; the Ravager gets **stronger as the fight
goes badly**. Build every action with a `ActionPrerequisites.wound()` or `damage()` prerequisite, so
the card is weak at full health and frightening at one wound from unconsciousness.

That prerequisite pair is barely used in the current data and this is the cleanest expression of it.

### Beast-handler (background)

Fights alongside something on a chain. `ActionEffects.summon(SummonType.Beast)` is implemented and
has very few users — but see the deferred Beastmaster in the README, and the Druid's *Animal
Companion*, which already owns plain beast-summoning. Differentiate on what happens after the
summon: the Beast-handler throws it at people.

Target 3–4.

### Monsters

**Ogre** (`tasks.md`, size 2, Impact, LargeWeapons), **Pit Hound** (`Beast`, pack fighter),
**Wisent** (`Beast`, size 2, charge attack using `forceMovement(TowardsTarget)`).

### Items

**Cestus** — `ItemProficiencyType.None`, `ItemLocationType.Hand`, a weapon with low Impact damage.
The point is that it is the first item a Brawl character has any reason to hold. Consider whether
Brawl attacks should be able to use it: `ActionEffects.attack` takes `weapon: boolean`, and Brawl
actions currently pass `weapon: false`, so a cestus would need either its own actions or a Brawl
proficiency to be meaningful. **Decide this before building it** — it is the one piece of this pack
that might need engine support.

**Manica** — `ItemLocationType.Hand`, armour-like, granting a Physical damage resistance feature.

---

## Part C — Trophy Room (structure)

From `tasks.md`. The obvious effect, and one nothing else provides: **charges accumulate from
victories rather than being bought**. Every other structure recharges on the same schedule; a
Trophy Room that gains a charge each time you defeat a boss would be the first structure with a
gameplay-driven charge source.

That is a genuine change to `StrongholdLogic.rechargeStructure` and the encounter-completion flow in
`main.tsx` (`finishEncounter`), so treat it as optional. The cheap version — a normal structure
granting an extra feature-card redraw — works with no engine change.

Add `TrophyRoom = 'trophy room'` to `StructureType` plus the entry in the pack's `structures` array
either way.

---

## Acceptance criteria

- ~~The arena map generates as a single connected open space with no more than a light scatter of
  obstructed squares.~~ **Met** — covered by `encounter-map-generator.test.ts`.
- ~~The arena is not subsequently filled by the obstructed-blob pass.~~ **Met** — covered by the same
  test file.
- The Gladiator's Presence-based actions resolve correctly against enemy Resolve.
- Every Ravager action is gated on a damage or wound prerequisite and is correctly unavailable at
  full health.
- New cards score inside band.
- `npm run lint` and `tsc --noEmit` clean.
