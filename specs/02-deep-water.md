# Spec 02 — Deep Water

**Type:** new pack + new systems
**Size:** large — phase it
**Depends on:** —

---

## Why this pack

The campaign's premise is conquering an island. There is no water in the game: no coast, no ships,
no aquatic species, no water squares. `EncounterMapSquareType` has exactly two members, `Clear` and
`Obstructed`. It is the largest thematic gap in the game and the one that most obviously belongs.

`tasks.md` already specifies most of the rules. This spec collects them, adds the cards, and phases
the work so each stage ships on its own.

**Naming:** *Deep Water* keeps the idiom register of *Cold Blood* and *Magic in a Glass* while
saying exactly what the pack is. Alternatives: **Salt and Tide**, **The Drowned Coast**.

New file `src/data/packs/deep-water.ts`, registered in `PackLogic.getExpansionPacks()`. Every
array on `PackModel` must be present even when empty.

```ts
export const deepWater = (): PackModel => ({
    id: 'pack-12',
    name: 'Deep Water',
    description: 'The island has a coastline, and things live along it.',
    heroSpecies: [],
    monsterSpecies: [],
    roles: [],
    backgrounds: [],
    items: [],
    potions: [],
    structures: []
});
```

---

## Phase 1 — Water and ice squares

### Enum

`src/enums/encounter-map-square-type.ts`:

```ts
export enum EncounterMapSquareType {
    Clear = 'Clear',
    Obstructed = 'Obstructed',
    Water = 'Water',
    Ice = 'Ice'
}
```

This enum is persisted inside saved games, so `Platform.updateGame` should tolerate maps that
predate it — existing saves only contain `Clear` and `Obstructed`, which stay valid, so no migration
is strictly needed. Confirm nothing does an exhaustive `switch` on the enum without a `default`.

### Movement

`EncounterLogic.getMoveCost` (`encounter-logic.ts:354`) is the single hook. It already handles
`Obstructed` as `+1`; add water as difficult terrain the same way:

```ts
// Obstructed or water: +1
if (destinationMapSquares.some(ms => (ms.type === EncounterMapSquareType.Obstructed) || (ms.type === EncounterMapSquareType.Water))) {
    cost += 1;
}
```

Then the `Aquatic` quirk exemption (Phase 2) is a second condition on the same block.

Ice is **not** difficult terrain — it costs 1 like clear ground. Its interest is that it converts.

### Rules from `tasks.md`, restated precisely

- Standing in water grants resistance to Fire damage.
- Dealing Poison, Acid or Electricity damage to a target standing in water deals the **same damage**
  to every combatant standing in a water square **adjacent to the target**.
- Dealing Cold damage to a target on a water square turns all **adjacent** water squares to Ice.
- Dealing Fire damage to a target on an Ice square turns all **adjacent** ice squares to Water.

All four hang off the damage pipeline. `EncounterLogic.dealDamage` and `takeDamage` are where the
type is known and the target's position is available; put the conduction and phase-change logic
there rather than in `ActionEffects`, so it fires for every damage source including auras and
conditions rather than only for actions that opt in.

The Fire resistance is different in kind — it is a standing property of the square, not an event, so
it belongs in `EncounterLogic.getDamageResistance` alongside the existing feature and condition
lookups.

**Watch for loops.** Conduction damages adjacent combatants in water, which is itself
damage-in-water. Conduction must not re-trigger conduction — resolve it as a single pass from the
original target, not recursively.

### Rendering

`components/panels/encounter-map/floor/` renders squares by type. Water and ice need their own
classes in the accompanying `.scss`. The project moved to CSS variables in a 2024 commit
(`Use CSS variables`) — follow whatever token scheme the existing floor styles use rather than
hard-coding colours, and check both light and dark rendering.

### Generation

`EncounterMapGenerator.generateEncounterMap` currently picks one of four map functions at random and
then adds obstructed blobs with `getFloorBlob`. Add water the same way — reuse `getFloorBlob` and
paint the blob `Water` instead of `Obstructed`. Gate it so water only appears when the pack is
enabled, which means `generateEncounterMap` needs `packIDs` passed in; it currently takes only
`rng`. That signature change ripples to `EncounterGenerator.createEncounter` and to
`regenerateEncounterMap` in `main.tsx`.

---

## Phase 2 — The Aquatic quirk

`src/enums/quirk-type.ts`:

```ts
Aquatic = 'Aquatic'
```

Effects, following the pattern of the existing quirk checks in `encounter-logic.ts`:

- No movement penalty for water squares (the exemption in `getMoveCost` above)
- Resistance to Cold damage
- No Fire resistance from standing in water — an aquatic creature is *in* the water, not sheltering
  behind it. Optional, but it stops Aquatic being strictly better.

Document it in `assets/docs/encounters.md` beside the existing Beast / Drone / Swarm / Undead
keyword list, which is where players learn what quirks do.

---

## Phase 3 — The cards

### Species

**Merrow** — `Aquatic`, size 1. Endurance-leaning, Cold resistance, a Brawl-based bite. Brawl is
under-served (only Sensei and Ninja build on it) so this is a useful second home for it.

**Selkie** — `Aquatic`, size 1. Speed and Stealth; a signature action that grants a movement bonus
condition, reading as slipping between forms.

Target 5–6 on `getSpeciesStrength`.

### Roles

**Corsair** — paired weapons and Reactions. This is the pack's flagship and the second
Reactions-based role after the Skirmisher. Distinguish the two: the Skirmisher uses Reactions to act
*early*, the Corsair uses it to act *repeatedly* — lean on `takeAnotherAction` and
`forceMovement(Swap)` for boarding-action flavour.

| Slot | Content |
| --- | --- |
| Starting | Speed +1, Reactions +2, Weapon +2, PairedWeapons, LightArmor |
| Features | Speed +1, Reactions +2, Weapon +2, Edged damage bonus +1 |
| Actions | *Boarding Action* (attack + `forceMovement(Swap)`), *Cut and Thrust* (two attacks), *Grapple* (`forceMovement(Pull, 2)`), *Press the Advantage* (attack + `takeAnotherAction()`), *Disarm* (`ActionEffects.disarm()` — implemented and barely used) |

**Tidecaller** — Spellcasting, Cold and water control. The role that makes Phase 1's phase-change
rules matter: `createTerrain(Water)` to lay water down, then Cold damage to freeze it. This is the
pack's mechanical payoff and should be obvious on the card.

### Background

**Smuggler** — Stealth and carrying capacity. `ActionPrerequisites.carryingCapacity()` already
exists and almost nothing uses it. Target 3–4.

### Monsters

Kelpie (`Beast`, `Aquatic`), Siren (`Aquatic`, Sonic — Sonic is one of the two nearly-dead damage
types), Draugr (`Undead`, `Aquatic`), Giant Crab (`Beast`, size 2, Physical resistance).

Folklore names throughout — they are richer than the generic alternatives and carry no licensing
questions.

---

## Phase 4 — The Shipyard and coastal regions

The `tasks.md` entry: *"Shipyard — allows you to attack a non-adjacent coastal region."*

### Coastal detection

The campaign map is a hex grid in offset coordinates;
`CampaignMapLogic.getAdjacentSquares(map, x, y)` returns between 2 and 6 neighbours depending on
position. A square on the island's edge has fewer than 6.

```
A region is coastal if any of its squares has fewer than 6 adjacent squares.
```

Add `CampaignMapLogic.isCoastal(map, region)`. No model change needed — it is derived, so it costs
nothing in the save file.

### Attack rule

`CampaignMapLogic.canAttackRegion` currently requires adjacency to a conquered region. Extend it:
if the player has a Shipyard with charges, and both the target region and at least one conquered
region are coastal, the attack is legal. Spend a charge on the attack, not on the conquest.

### Structure

```ts
Shipyard = 'shipyard'
```

in `StructureType`, plus the Shipyard entry in the pack's `structures` array and the charge wiring in
`stronghold-page`, which is where every other structure's benefit is read
(`StrongholdLogic.getStructureCharges(game, StructureType.X)`).

This is the first structure whose effect touches the campaign map rather than a card draw, so expect
it to need more UI work than the existing ones — the region card and the attack flow both need to
show that a sea route is available.

---

## Suggested order

1. Phase 1 without the phase-change rules — water as difficult terrain, rendered, generated. Ships
   on its own and immediately makes maps more varied.
2. Phase 2, the Aquatic quirk.
3. Phase 3, the cards.
4. Phase 1's conduction and freeze/thaw rules.
5. Phase 4, the Shipyard.

Steps 1–3 give a complete, playable pack. Steps 4–5 are the interesting part but neither blocks the
release.

## Acceptance criteria

- Water squares cost 2 to enter for a non-Aquatic combatant, 1 for an Aquatic one.
- A combatant standing in water takes reduced Fire damage.
- Cold damage to a target in water freezes adjacent water; Fire damage to a target on ice thaws
  adjacent ice.
- Electricity damage to a target in water damages other combatants in adjacent water exactly once.
- Water squares never appear when the pack is disabled.
- An existing save from before this change loads without error.
- `npm run lint` and `tsc --noEmit` clean.
