# Light

## Why this pack

`tasks.md` asks for lighting:

> General light level. Sources of light. Species with darkvision.

It is the most invasive unbuilt feature in that file, and the one with the largest payoff, because
the game already has everything it needs to support it. Visibility is fully implemented:
`EncounterMapLogic.visibilityCache`, per-combatant `senses` and `hidden` scores rolled fresh each
turn, a fog component that hides squares outside the current combatant's view, and
`ActionEffects.hide`, `scan` and `reveal`.

Lighting is the missing multiplier on all of it. Right now the only thing that affects what you can
see is walls.

It also gives **Light** damage something to be about. Light is currently five role references and one
monster, and it means nothing beyond a damage type name.

**Naming:** *Nightfall* is plain and does the job. Alternatives: **The Long Dark**, **Sunless**,
**What the Dark Hides**.

```ts
static dark = (): PackModel => ({
    id: 'pack-nightfall',
    name: 'Nightfall',
    description: 'Half of what is on this map can see you. You can see rather less of it.'
});
```

---

## The system

### Design decision to make first

There are two workable models, and they cost very different amounts.

**Option 1 — light as a senses modifier.** An encounter has a light level. A combatant's rolled
`senses` score is reduced in darkness and restored near a light source. Everything else follows for
free: hidden enemies stay hidden, and `scan` becomes valuable.

- Cost: small. A field on `EncounterModel`, a modifier in `startOfTurn` where senses are rolled, and
  a distance check against light sources.
- Fits the existing systems exactly. Nothing new to render on the map beyond a tint.

**Option 2 — light as per-square state.** Each map square has a light level; visibility of a square
depends on its illumination as well as line of sight.

- Cost: large. It touches `visibilityCache`, the fog component, and every targeting call that goes
  through `findCombatants` and `findSquares`.
- Much richer — a lit corridor with dark side-rooms — but it is a serious rewrite of the most
  performance-sensitive code in the game. Note that a recent commit is titled *Improve performance*,
  which suggests visibility has already needed attention.

**Recommendation: Option 1.** It delivers most of the felt experience for a fraction of the cost, and
it can be upgraded to Option 2 later without throwing away the card designs.

### Option 1 in detail

`EncounterModel` gains:

```ts
lightLevel: number;   // 0 = pitch dark, 5 = full daylight
```

Set it in `EncounterGenerator.createEncounter`. Default to full light so that behaviour is unchanged
when the pack is off; roll a lower value only when the pack is enabled. Patch it defensively in
`Platform.updateGame` for existing saves, as `game.encounter.log` is patched today.

Light sources are combatants carrying a light item, and optionally fixed map features. Keep it to
combatants for the first version — a `LightModel` on `ItemModel`, or more cheaply, a lookup of item
IDs that emit light and their radius.

In `EncounterLogic.startOfTurn`, where senses are rolled:

```
senses = Random.dice(perceptionRank)
adjusted = senses - darknessPenalty(encounter, combatant)
```

where the penalty is a function of `lightLevel` and the combatant's distance to the nearest light
source, and is zero for a combatant with the `Darkvision` quirk.

`EncounterLogic.getDistance`-style helpers already exist for aura and burst radius calculation —
reuse rather than writing a new distance function.

### Rendering

A tint over the map, keyed to light level, plus a glow around light-bearing combatants. The
`aura-token` component already draws a radius around a combatant and is the closest existing
pattern. Respect `options.reduceMotion` if the tint animates, and check both light and dark UI
themes — a darkness overlay on an already dark theme can render as nothing at all.

### Documentation

Add a keyword paragraph to `assets/docs/encounters.md` beside Beast / Drone / Swarm / Undead. The
existing docs are how players learn what quirks mean, and darkvision is worthless if invisible.

---

## Cards

### Darkvision quirk

`src/enums/quirk-type.ts` gains `Darkvision = 'Darkvision'`. Grant it to:

- **Gnome** (base) — described as "a short creature who often prefers to be unseen," already carries
  Stealth and Reactions
- **Dwarf** (base) — conventional and correct
- The new species below

Granting it to two base species means the pack changes how existing characters play, which is the
right kind of reach for a systems pack.

### Umbral (species)

`Darkvision`, Stealth-focused, Light vulnerability. The vulnerability is the interesting half —
`DamageVulnerabilityCondition` exists but no species carries a permanent weakness, and
`FeatureLogic.createDamageResistFeature` with a negative rank may or may not work. **Check that
before designing around it**; if negative ranks misbehave, express the weakness as a starting
condition instead, or drop it.

Target 5–6.

### Lampbearer (role)

The counter-design: a role built around **carrying the light**, which makes you visible to everything
on the map. Light damage, area illumination, and the tension that its own light betrays it.

| Slot | Content |
| --- | --- |
| Starting | Resolve +1, Spellcasting +2, Presence +2, Implements |
| Features | Resolve +1, Spellcasting +2, Light +1, Energy resistance +1 |
| Action | *Kindle* — self or ally: become a light source for a number of rounds |
| Action | *Flare* — burst, `dealDamage(Light, 3)` and `ActionEffects.reveal()` on all enemies in it |
| Action | *Sear* — single-target Light damage, higher rank |
| Action | *Beacon* — raise the encounter's light level for a round |
| Action | *Snuff* — the inverse: lower it, or extinguish an enemy light source |

Target 5–6.

### Nightwalker (background)

Stealth in darkness; `hide` with a bonus, movement without penalty in the dark. Target 3–4.

### Monsters

**Grue** (`Darkvision`, `Mindless`, only dangerous in darkness)
**Shade** (`Amorphous`, `Darkvision`, Decay)
**Will-o'-the-Wisp** (a light source that lures — deals Light damage, drops loot when killed).

### Items

**Lantern** — `ItemLocationType.Hand`, `ItemProficiencyType.None`. Emits light; occupies a hand,
which is the whole design.

**Shuttered Lamp** — light that can be turned off. Needs an equip/unequip-style toggle, so more work
than the Lantern; skip it in version one.
