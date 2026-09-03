# Skirmish — content and systems specs

A set of independent specs for new content and the systems it needs. Each is written to be handed to
an implementer on its own; where one depends on another it says so at the top.

---

## The specs

| #  | Spec                                                       | Type                  | Size   | Depends on           | Status        |
| -- | ---------------------------------------------------------- | --------------------- | ------ | -------------------- | ------------- |
| 01 | [Hero options](01-hero-options.md)                         | Content               | Medium | -                    |               |
| 02 | [Deep Water](02-deep-water.md)                             | Pack + systems        | Large  | -                    |               |
| 03 | [The Lie of the Land](03-the-lie-of-the-land.md)           | Pack + systems        | Large  | —                    |               |
| 04 | [Blood and Sand](04-blood-and-sand.md)                     | Pack + map type       | Medium | —                    |               |
| 05 | [Tools of the Trade](05-tools-of-the-trade.md)             | Pack (data)           | Medium | —                    |               |
| 06 | [Ill Humours](06-ill-humours.md)                           | Pack (data)           | Medium | —                    |               |
| 07 | [Chapter and Verse](07-chapter-and-verse.md)               | Pack + system         | Medium | —                    |               |
| 08 | [Sound and Fury](08-sound-and-fury.md)                     | Pack (data)           | Small  | —                    |               |
| 09 | [Coin and Contract](09-coin-and-contract.md)               | Pack + campaign layer | Large  | —                    |               |
| 10 | [Nightfall](10-nightfall.md)                               | Pack + system         | Large  | —                    |               |
| 11 | [Monsters and bosses](11-monsters-and-bosses.md)           | Content + system      | Medium | —                    | *Part A done* |

Pack IDs are allocated `pack-11` through `pack-20` in spec order. If you build them out of order,
reassign so the IDs stay contiguous — nothing depends on the numbers, but gaps in a persisted
identifier are the kind of thing that becomes confusing later.

---

## Suggested order

1. **Spec 01**, the Skirmisher and the *Hell to Pay* pack.
2. **Spec 05**, *Tools of the Trade*. Unglamorous and the highest systemic return in the set: the
   item pool feeds the magic item generator, so every card added multiplies through the economy.
3. **Spec 06** and **Spec 08**, *Ill Humours* and *Sound and Fury*, which between them rescue the
   three near-dead damage types.
4. **Spec 03 Part A**, terrain-driven map selection. Small, and improves every existing game.
5. **Spec 04**, the arena map type. Every current map is a maze; one open map makes every existing
   card play differently.
6. **Spec 02**, *Deep Water*. The island premise with no water in it is the largest thematic gap.
7. **Spec 07**, scrolls. The only mechanism that lets a hero act outside their fixed deck.
8. **Spec 03 Part B**, traps.
9. **Spec 09**, *Coin and Contract*. Changes the campaign layer rather than adding to it.
10. **Spec 10**, *Nightfall*. The biggest system in the set. Ship it without cards first and play
    three encounters before committing.

---

## Conventions used throughout

**Balance.** `GameLogic.getSpeciesStrength`, `getRoleStrength` and `getBackgroundStrength` already
exist and score every card. Measured across the current set: species 5–6, roles 5–6 (Luckweaver is
the lone 4), backgrounds 3–4. Score every new card before merging:

```ts
import { GameLogic } from './src/logic/game-logic';
import { RoleData } from './src/data/role-data';
RoleData.getList().forEach(r => console.log(r.name, GameLogic.getRoleStrength(r)));
```

Run with `npx tsx`. The cards written out in full in Spec 01 have been scored this way.

Since Spec 12 there is also a test runner: `npm test` enforces these bands, and monster species
(4–6) alongside them, so a card outside band fails rather than merely being noticed.

**Registration.** Every new card must be added to its file's `getList()`. There is no other
registry — a card that is defined but not listed silently does not exist.

**Pack gating.** `GameLogic.getXDeck(packIDs)` filters on `(packID === '') || packIDs.includes(packID)`.
Base content uses `packID: ''`. Any new content type also needs adding to
`PackLogic.getPackCardCount`.

**Saves.** Games persist as JSON through localforage. New fields on `EncounterModel`, `GameModel` or
`CombatantModel` must be patched defensively in `Platform.updateGame`, following the existing
treatment of `game.encounter.log` and `lootPile.money`.

**Documentation.** New keywords and rules belong in `src/assets/docs/`. Those five markdown files are
how players learn what quirks and mechanics do; a rule that is not in them is invisible.

---

## What is not covered here

- **Doors and keys** from `tasks.md`. They interact with walls and line of sight, which is the most
  performance-sensitive code in the game, and no pack in this set needs them.
- **Undo movement** and **drag-and-drop movement**, both UI work with no content implications.
- **Action animations** and **sound effects**.
- **Small species** as a size mechanic — see Spec 12 item 4 for why it is not simply `size: 0`.
- The **functional-component migration**, which is the largest item in `tasks.md`'s tech-debt list
  and unrelated to any of this.
