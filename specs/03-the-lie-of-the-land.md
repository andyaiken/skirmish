# Spec 03 — The Lie of the Land

**Type:** new pack + two systems
**Size:** large — two independent halves
**Depends on:** nothing

---

## Why this pack

`CampaignMapGenerator` rolls one of nineteen terrain types per region — Badlands, Canyons, Desert,
Fens, Forest, Jungle, Lakes, Marshland, Mountains, Plains, Plateaus, Rainforest, Riverlands, Salt
flats, Scrubland, Steppe, Taiga, Valleys, Volcanic, Wetlands — writes it to
`region.demographics.terrain` (`campaign-map-generator.ts:129`), and shows it on the region card
(`region-card.tsx:104`).

Nothing else reads it. Meanwhile `EncounterMapGenerator.generateEncounterMap` picks one of four map
shapes at random with no knowledge of where the fight is happening. Two systems a foot apart,
unwired. Attacking the Fens plays identically to attacking the Volcanic highlands.

This pack wires them together and adds the wilderness content that makes the difference visible.

**Naming:** *The Lie of the Land* carries both meanings — topography and deception — which suits a
pack about scouting and traps. Alternatives: **Rough Ground**, **Every Inch of Ground**.

```ts
static land = (): PackModel => ({
    id: 'pack-13',
    name: 'The Lie of the Land',
    description: 'The ground itself is on somebody\'s side. Make sure it is yours.'
});
```

---

## Part A — Terrain drives the encounter map

This half is worth doing **whether or not you build the pack**. It costs little and improves every
existing game.

### Current behaviour

```ts
const mapTypes = [
    EncounterMapGenerator.generateDungeonMap,
    EncounterMapGenerator.generateRuinMap,
    EncounterMapGenerator.generateCavernMap,
    EncounterMapGenerator.generateStreetMap
];
const fn = Collections.draw(mapTypes, rng);
```

### Change

Pass the region into `generateEncounterMap` and weight the draw by terrain. `EncounterGenerator.
createEncounter` already has the region in hand, so it is a signature change and a lookup table.

```
Mountains, Canyons, Plateaus, Volcanic   → Cavern (heavily weighted), Ruin
Forest, Jungle, Rainforest, Taiga        → Ruin, Cavern
Fens, Marshland, Wetlands, Lakes,
  Riverlands                             → Ruin, Cavern    (+ Water squares, see Spec 02)
Plains, Steppe, Scrubland, Salt flats,
  Badlands, Desert, Valleys              → Street, Ruin
```

Weight rather than hard-assign, so a Mountains region can still surprise you with a ruined
settlement. Keep an unweighted fallback for any terrain string that is not in the table, so adding
terrains later cannot crash generation.

### Two follow-ons this unlocks

**Obstructed density by terrain.** The blob loop currently runs `while (Random.randomNumber(3, rng)
!== 0)`. Making that probability terrain-dependent — dense in Jungle, sparse on Salt flats — is a
one-line change with a large felt effect.

**Terrain-appropriate monsters.** `CampaignMapLogic.getMonsters(region, packIDs)`
(`campaign-map-logic.ts:115`) selects the region's monster species. It could filter or weight by
terrain, so Fens produce swamp-dwellers. This is more design work than it looks — with only nine base
monsters, filtering too hard leaves nothing to draw — so treat it as optional and weight, never
exclude.

---

## Part B — Traps

Specified in `tasks.md`; nothing exists yet.

### Model

Traps are map furniture, not combatants. Add to `src/models/encounter.ts`:

```ts
export interface TrapModel {
    id: string;
    name: string;
    type: TrapType;
    position: { x: number, y: number };
    hidden: number;
    effects: ActionEffectModel[];
    armed: boolean;
}
```

and `traps: TrapModel[]` on `EncounterModel`. Add the array defensively in
`Platform.updateGame` — saves from before this change will not have it, exactly as
`game.encounter.log` is patched today.

New enum `src/enums/trap-type.ts`: `Spike`, `Fire`, `PoisonGas`, `AcidDart`.

Reusing `ActionEffectModel[]` for the payload means every trap is built from the existing
`ActionEffects` vocabulary and needs no new resolution code — `ActionEffects.run` already takes an
effect, an encounter, a combatant and parameters.

### Rules

- A trap has a `hidden` score, exactly like a combatant's. A trap is visible to a combatant whose
  `senses` beats it. Reuse the comparison in `EncounterLogic` rather than writing a second one.
- Moving onto a trap's square triggers it. Hook into `EncounterLogic.move`, after the position is
  committed.
- A triggered trap sets `hidden = 0` and `armed = false`.
- **Disarm** costs 4 movement points, matching Hide and Scan. Roll Perception; on 8 or higher the
  trap is removed. Gnome, Thief and the new Trapper background get a bonus.
- **Trapper** can place a trap during an encounter: 4 movement points, adjacent empty square.

### Rendering

Traps need a token layer alongside `loot-token` and `trail-token` under
`components/panels/encounter-map/`. Hidden traps render only when the current combatant's senses
beat them, which is the same visibility question `fog` already answers — follow that component's
pattern rather than inventing a second one.

### Generation

Add traps in `EncounterGenerator.createEncounter`, gated on the pack, and place them on Clear
squares away from starting positions. Chests-with-traps from `tasks.md` are a later addition — they
need loot piles to become interactable objects first.

---

## Part C — Cards

### Outrider (role)

Fills the **Perception** gap. Across all 23 existing roles, Perception is referenced twice; the
Ranger is the only role with any claim on it, and its identity is ranged weapons, not scouting.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Perception +2, Weapon +2, RangedWeapons, LightArmor |
| Features | Endurance +1, Perception +2, Speed +1, Piercing +1 |
| Actions | *Survey* (`ActionEffects.scan()` plus a Perception bonus condition), *Mark the Ground* (reveals hidden enemies and traps in a burst — `ActionEffects.reveal()`), *Ranging Shot* (ranged attack at extended radius), *Read the Signs* (self: Perception bonus and movement bonus), *Cover the Retreat* (ally-targeted movement bonus) |

Target 5–6 on `getRoleStrength`.

### Warden (role)

The counterpart: holds ground rather than scouting it. Endurance and Presence, `createTerrain
(Obstructed)` to shape the field, aura features that penalise enemy movement. Auras are underused —
only a handful of cards carry them and `tasks.md` notes a blur aura as a wanted feature.

### Trapper (background)

From `tasks.md`. Places and disarms traps; requires Part B. Target 3–4.

| Slot | Content |
| --- | --- |
| Starting | Perception +2 |
| Features | Perception +2 |
| Actions | *Set Snare* (place a trap), *Spring the Trap* (trigger a visible trap remotely), *Concealed Position* (`ActionEffects.hide()` with a Stealth bonus) |

### Cartographer (structure)

From `tasks.md`. Spend a charge to **choose the encounter map type** instead of rolling it. This is
the structure that makes Part A legible to the player — without it, terrain-weighted maps are an
invisible improvement.

Add `Cartographer = 'cartographer'` to `StructureType`, a Cartographer entry in the owning pack's
`structures` array, and
read the charges in the encounter-start flow with `StrongholdLogic.getStructureCharges(game,
StructureType.Cartographer)`, following the pattern in `stronghold-page`.

### Monsters

Burrower (`Beast`, size 2, emerges from Obstructed squares), Mire Hulk (`Beast`, size 2, Poison,
ignores water penalties if Spec 02 is in), Stalking Cat (`Beast`, high Stealth — `tasks.md` asks for
lion/tiger/panther).

### Items

**Snare Kit** (`ItemProficiencyType.None`), **Climbing Boots** (`ItemLocationType.Feet`). The Feet
slot currently contains exactly one item, so any hero who acquires a Feet magic item gets a variant
of Boots. See Spec 05.

---

## Suggested order

1. Part A on its own — a small, self-contained improvement to every existing game.
2. Part C's Outrider and Warden — cards only, no new systems.
3. Part B, traps, which is the expensive half.
4. The Cartographer, which needs Part A to be meaningful.

## Acceptance criteria

- A Mountains region produces a cavern map noticeably more often than a street map; a Plains region
  the reverse.
- An unrecognised terrain string still generates a valid map.
- A trap triggers when a combatant enters its square, applies its effects, and becomes visible.
- A trap with a hidden score above a combatant's senses is not rendered for that combatant.
- A save created before this spec loads without error and has an empty `traps` array.
- New cards score inside band (roles 5–6, backgrounds 3–4).
- `npm run lint` and `tsc --noEmit` clean.
