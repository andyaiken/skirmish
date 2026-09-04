# Traps

### Model

Traps are map furniture, not combatants. They take up a single square. Add to `src/models/encounter.ts`:

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

- A trap has a `hidden` score, exactly like a combatant's. This is set once, at the beginning of the encounter. A trap is visible to a combatant whose
  `senses` beats it. Reuse the comparison in `EncounterLogic` rather than writing a second one.
- Moving onto a trap's square triggers it. Hook into `EncounterLogic.move`, after the position is
  committed.
- A triggered trap sets `hidden = 0` and `armed = false`.
- **Disarm** is an action given to Ranger, Gnome, Thief, Trapper. Roll Perception; on 8 or higher the trap is removed.
- **Trapper** can place a trap during an encounter: quick action, adjacent empty square.

### Rendering

Traps need a token layer alongside `loot-token` and `trail-token` under
`components/panels/encounter-map/`. Hidden traps render only when the current combatant's senses
beat them, which is the same visibility question `fog` already answers — follow that component's
pattern rather than inventing a second one.

Traps, when visible, should be selectable.

### Generation

Add traps in `EncounterGenerator.createEncounter` and place them on Clear
squares away from starting positions. Chests-with-traps from `tasks.md` are a later addition — they
need loot piles to become interactable objects first.
