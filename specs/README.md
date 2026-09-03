# Skirmish — content and systems specs

A set of independent specs for new content and the systems it needs. Each is written to be handed to
an implementer on its own; where one depends on another it says so at the top.

---

## The specs

| #  | Spec                                                       | Type                  | Size   | Depends on           | Status        |
| -- | ---------------------------------------------------------- | --------------------- | ------ | -------------------- | ------------- |
| 01 | [Hero options](01-hero-options.md)                         | Content               | Medium | -                    | *1-2 done, 3 deferred* |
| 02 | [Deep Water](02-deep-water.md)                             | Pack + systems        | Large  | -                    |               |
| 03 | [The Lie of the Land](03-the-lie-of-the-land.md)           | Pack + systems        | Large  | —                    |               |
| 04 | [Blood and Sand](04-blood-and-sand.md)                     | Pack + map type       | Medium | —                    |               |
| 05 | [Tools of the Trade](05-tools-of-the-trade.md)             | Base content (data)   | Medium | —                    | *Built, scoped down* |
| 06 | [Ill Humours](06-ill-humours.md)                           | Pack (data)           | Medium | —                    |               |
| 07 | [Chapter and Verse](07-chapter-and-verse.md)               | Pack + system         | Medium | —                    |               |
| 08 | [Sound and Fury](08-sound-and-fury.md)                     | Pack (data)           | Small  | —                    |               |
| 09 | [Coin and Contract](09-coin-and-contract.md)               | Pack + campaign layer | Large  | —                    |               |
| 10 | [Nightfall](10-nightfall.md)                               | Pack + system         | Large  | —                    |               |
| 11 | [Monsters and bosses](11-monsters-and-bosses.md)           | Content + system      | Medium | —                    | *Part A done* |

Pack IDs are derived from the pack's own name, lowercased and hyphenated with any leading article
dropped — `Hell to Pay` is `pack-hell-to-pay`, `The Elements` is `pack-elements`. The IDs each spec
gives follow that rule, so they can be built in any order. If you rename a pack, rename its ID to
match: the ID is persisted in `options.packIDs`, so the two drifting apart is the kind of thing that
becomes confusing later.

---

## Suggested order

* ~~**Spec 01**, the Skirmisher and the *Hell to Pay* pack.~~ Done; its pack top-ups are deferred.
* ~~**Spec 05**, *Tools of the Trade*.~~ Done, as base content rather than a pack.
* **Spec 06**, *Ill Humours*. ← next
* **Spec 08**, *Sound and Fury*.
* **Spec 03 Part A**, terrain-driven map selection. Small, and improves every existing game.
* **Spec 04**, the arena map type. Every current map is a maze; one open map makes every existing card play differently.
* **Spec 02**, *Deep Water*. The island premise with no water in it is the largest thematic gap.
* **Spec 07**, scrolls. The only mechanism that lets a hero act outside their fixed deck.
* **Spec 03 Part B**, traps.
* **Spec 09**, *Coin and Contract*. Changes the campaign layer rather than adding to it.
* **Spec 10**, *Nightfall*. The biggest system in the set. Ship it without cards first and play three encounters before committing.

---

## Conventions used throughout

**Balance.** `GameLogic.getSpeciesStrength`, `getRoleStrength` and `getBackgroundStrength` already
exist and score every card. Measured across the current set: species 5–6, roles 5–6 (Luckweaver is
the lone 4), backgrounds 3–4. Score every new card before merging:

```ts
import { GameLogic } from './src/logic/game-logic';
import { PackLogic } from './src/logic/pack-logic';
PackLogic.getAllPacks()
	.flatMap(pack => PackLogic.getRoles(pack.id))
	.forEach(r => console.log(r.name, GameLogic.getRoleStrength(r)));
```

Run with `npx tsx`. The cards written out in full in Spec 01 have been scored this way.

There is also a test runner: `npm test` enforces these bands, and monster species
(4–6) alongside them, so a card outside band fails rather than merely being noticed.

**Registration.** Every card lives inside a pack. A pack is one file under `src/data/packs/`
exporting a factory that returns a `PackModel`, and a card exists only if it appears in one of that
literal's arrays — `species`, `roles`, `backgrounds`, `items`, `potions`, `structures`. Hero and
monster cards share the one `species` array; `PackLogic.getHeroSpecies` and `getMonsterSpecies`
filter it on the card's own `type`. A new pack must also be added to `PackLogic.getExpansionPacks()`; a pack file that is
written but not listed silently does not exist.

**Pack gating.** Cards carry no `packID` — membership is which pack's array they sit in.
`PackLogic.getAvailablePacks(packIDs)` returns `core()` plus the selected packs, and each
`GameLogic.getXDeck(packIDs)` flat-maps the matching array across those. Base content therefore goes
in `core()`, which is always available. A new *kind* of content needs a new array on `PackModel`, a
`PackLogic.getX` accessor, and an entry in `PackLogic.getPackCards` — `getPackCardCount` derives from
that list.

**Items.** Only armour and shields carry features, in `armor.features`; no item uses the top-level
`features` or `actions` arrays, and none should. Everything else in the item pool is a base for
`MagicItemGenerator` to enchant, distinguished by name and description alone. Melee versus ranged is
decided by **proficiency**, not by `range` — `checkWeaponParameter` maps melee to
Large/Paired/Military and ranged to Ranged/Powder, so a paired weapon with a long `range` is a melee
weapon with very long reach. The `Hand` and `Ring` locations hold two items each; everything else
holds one.

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
- **Small species** as a size mechanic — see the closing note in Spec 01 for why it is not simply
  `size: 0`.
- The **functional-component migration**, which is the largest item in `tasks.md`'s tech-debt list
  and unrelated to any of this.
