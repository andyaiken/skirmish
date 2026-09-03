# Chapter and Verse

## Why this pack

`tasks.md` specifies scrolls:

> Single-use actions. Created by a background (Scribe). Anyone can use if carried. Can be found as
> treasure.

Nothing exists. It is the only consumable design in the file with no implementation, and it is
cheaper to build than it looks because **potions are already exactly this shape** — a single-use
item that runs stored effects on the drinker.

It also fills a real gap in what a hero can do. Right now a character's action deck is fixed by
species, role and background at creation. Scrolls are the only mechanism that would let a character
do something outside their deck, which makes loot meaningfully interesting for the first time.

**Naming:** *Chapter and Verse* is an idiom about precise citation, which is what a scroll is.
Alternatives: **Ink and Vellum**, **The Written Word**.

```ts
static scrolls = (): PackModel => ({
    id: 'pack-chapter-and-verse',
    name: 'Chapter and Verse',
    description: 'Power that anyone can use, provided they can read and only need it once.'
});
```

---

## The system

### Model

Potions are `ItemModel` with a `potion: PotionModel | null` field holding
`effects: ActionEffectModel[]`. Scrolls are the same idea one level up: an `ActionModel` rather than
a bare effect list, because a scroll needs targeting.

`src/models/item.ts`:

```ts
export interface ScrollModel {
    action: ActionModel;
}
```

and on `ItemModel`:

```ts
scroll: ScrollModel | null;
```

**Every existing item literal must gain `scroll: null`.** That is 53 entries across the `items`
arrays and 9 across the `potions` arrays in `src/data/packs/`, plus anything constructed in `Factory`
and `MagicItemGenerator`. TypeScript will find them all, but expect a large mechanical diff spread
over every pack file.

Consider whether `potion` and `scroll` should collapse into a single `consumable` field with a
discriminator. Cleaner, but it changes the save format and `Platform.updateGame` would need a
migration. **Recommendation: add `scroll` alongside `potion`.** The duplication is small and the
migration risk is not worth it.

### Data

Scrolls are a new content type, so they need a `scrolls: ItemModel[]` array on `PackModel`, added to
every pack literal — empty in most, populated in this pack and in `core()` if any scroll is base
content. Model the entries directly on the `potions` arrays: `proficiency: ItemProficiencyType.None`,
`location: ItemLocationType.None`, `slots: 1`, exactly as potions do.

Then add `PackLogic.getScrolls(packID)` alongside `getPotions`, include it in
`PackLogic.getPackCards` so `getPackCardCount` picks it up, and add
`GameLogic.getScrollDeck(packIDs)` alongside `getPotionDeck`.

### Use

`EncounterLogic.drinkPotion` is the template. A `readScroll` equivalent:

- Costs **2 movement points**, matching a potion. A scroll is a full action in most games, but this
  one already spends movement on Inspire, Scan, Hide and potions — stay consistent with the game
  rather than the genre.
- Removes the scroll from `items` and `carried`.
- Runs the scroll's `ActionModel` through the normal action pipeline, so parameters and targeting
  work. This is the one place it is more than a potion: `ActionEffects.run` takes resolved
  parameters, so the UI must let the player select targets for a scroll the same way it does for a
  selected action.

**The UI is the real work here.** Potions are used from the movement tab with no targeting. Scrolls
need the action-parameter flow in
`components/screens/encounter-screen/action-controls/action-parameter/`. The simplest route is to
treat reading a scroll as *selecting an action that is not in your deck* — push the scroll's action
into the current combatant's `combat.selectedAction` and let the existing machinery handle it, then
consume the scroll when the action runs.

Check `EncounterLogic.selectAction` and `runAction` to see how cleanly that grafts on. If it fights
you, the fallback is to restrict the first release to self-targeted and burst scrolls, which need no
target selection.

### Acquisition

Three routes, in order of cost:

1. **Loot.** `EncounterGenerator` populates `LootPileModel`; add scrolls to what it can draw.
2. **Purchase.** The magic item shop flow in `main.tsx` (`buyItem`) can offer scrolls.
3. **Scribe background.** `ActionEffects.createPotion(potionID)` already exists as an effect; a
   `createScroll(scrollID)` sibling is a near-copy.

---

## Cards

### Scrolls

Draw them from actions the game already has, so no new effect code is needed. The point of a scroll
is access, not novelty — a warrior getting one casting of something a spellcaster does routinely.

| Scroll | Effect |
| --- | --- |
| Scroll of Warding | Self: `DamageCategoryResistanceCondition(Resolve, 5, All)` |
| Scroll of Flame | Burst radius 3, `dealDamage(Fire, 4)` to enemies |
| Scroll of Mending | Adjacent ally, `healWounds(1)` |
| Scroll of Haste | Self or ally, `MovementBonusCondition` |
| Scroll of Blinding | Burst, on hit a Perception penalty condition |
| Scroll of Passage | `ActionEffects.removeSquares()` or `destroyWalls()` — both implemented |
| Scroll of Binding | On hit, `MovementPenaltyCondition` at high rank |
| Scroll of Summoning | `ActionEffects.summon(SummonType.Elemental)` |
| Scroll of Recall | `ActionEffects.moveToTargetSquare()` |

Nine is the same count as the potion pack, which is a reasonable size.

### Scribe (background)

| Slot | Content |
| --- | --- |
| Starting | Resolve +1, Mental skill category +1 |
| Features | Resolve +1, Mental skill category +1 |
| Actions | One `createScroll` action per scroll type, mirroring how the Apothecary has one action per potion |

The Apothecary is the precedent: 1 starting feature, 1 feature, 9 actions, and it scores 4. Follow
that shape exactly and the Scribe will land in band.

### Scriptorium (structure)

From `tasks.md`. Spend a charge to draw a scroll between encounters. Add `Scriptorium =
'scriptorium'` to `StructureType`.

### Archive (structure)

Also from `tasks.md` ("Archive / Vault"). Spend a charge to **redraw the three cards offered at
level-up a second time** — a stronger Training Ground. Only worth adding if the Scriptorium alone
leaves the pack feeling thin.

---

## Acceptance criteria

- `ItemModel` has a `scroll` field and every existing item literal compiles.
- A scroll in a hero's carried items can be read during an encounter, spending 2 movement points.
- Reading a scroll removes it from the hero's inventory.
- A scroll with a target parameter prompts for a target and resolves against it.
- Scrolls appear in loot piles only when the pack is enabled.
- `PackLogic.getPackCardCount('pack-chapter-and-verse')` includes the scrolls.
- A save from before this change loads without error.
- `npm run lint` and `tsc --noEmit` clean.
