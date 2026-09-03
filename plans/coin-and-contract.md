# Coin and Contract

## Why this pack

Two gaps meet here.

**Structures are the least developed layer in the game.** Thirteen exist and all but two do the same
thing: hold charges that buy a redraw. Academy redraws XP, Quartermaster redraws items, Training
Ground redraws features, Observatory redraws actions, Wizard Tower redraws magic items, Forge
redraws structures, Recruitment Hall redraws heroes. Seven structures, one idea. `tasks.md` has a
long list of structure ideas — Bazaar, Guildhall, Museum, Library, Gallery, Tavern, Theatre,
Gardens, Monument — and a table with an empty `Pack` column, which suggests you already noticed.

**Presence has no life outside combat.** It is described as the skill used "whenever a hero needs to
exert their influence," and every use of it is an attack roll or a buff. The campaign map has
regions with `demographics.population` and `demographics.size` — both generated, both cosmetic.

This pack is the mercenary-company layer: money, reputation, and taking a region without fighting
for it.

**Naming:** *Coin and Contract* matches the *Power and Glory* / *Guile and Cunning* construction.
Alternatives: **For Coin**, **The Price of Peace**.

```ts
static coin = (): PackModel => ({
    id: 'pack-coin-and-contract',
    name: 'Coin and Contract',
    description: 'Every region has a price. Blood is simply the most common currency.'
});
```

---

## Part A — Buy a region

The pack's headline mechanic, and the first thing in the game that lets you progress without an
encounter.

### Rule

A region can be **bought** instead of conquered. Cost scales with what is left of it:

```
price = base × remaining encounters × (1 + population / 10)
```

`region.demographics.population` is `Random.dice(size)` and currently unused, so this is the first
thing that reads it. Tune `base` against the existing economy: a structure costs 50, a magic item
100, and selling a magic item returns 50.

Buying a region should be **more expensive than fighting is worth** in most cases — the point is a
release valve for a region you cannot beat, not a way to skip the game. A reasonable target is that
buying a fresh region costs more than the loot from clearing it.

### Where it goes

`CampaignMapLogic.canAttackRegion` gates attacks; the buy option needs a sibling
`canPurchaseRegion(map, region, game)` with the same adjacency requirement plus an affordability
check. `CampaignMapLogic.conquerRegion` already handles the conquest side and can be reused
directly — buying a region should award the boon exactly as conquering does.

UI: a second button on the region card next to `Start An Encounter`, showing the price and disabled
when unaffordable. `main.tsx` gains a `purchaseRegion` handler beside `conquer`.

### The Presence hook

Make the price depend on the party. Take the highest Presence rank among the player's heroes and
reduce the cost by a percentage. This is what finally gives Presence a campaign-layer use, and it
means the Noble and Bard backgrounds have a reason to exist outside combat.

Use `CombatantLogic.getSkillRank(hero, SkillType.Presence)` rather than the encounter-scoped
`EncounterLogic.getSkillRank`, since there is no encounter in progress.

---

## Part B — Structures

The chance to break the redraw monoculture. Each of these does something no existing structure does.

| Structure | Effect | Notes |
| --- | --- | --- |
| **Bazaar** | Reduces the cost of buying items and structures | From `tasks.md`. First structure that touches prices |
| **Guildhall** | Reduces the price of buying a region | From `tasks.md`. Pairs with Part A |
| **Tavern** | Recharges another structure of your choice | From `tasks.md` morale list. Interacts with `StrongholdLogic.rechargeStructure` |
| **Monument** | Permanent, no charges: +1 hero slot | From `tasks.md`. `GameModel.heroSlots` exists and is currently only changed by the Extra Hero boon |
| **Counting House** | Passive income on conquering a region | Not in `tasks.md`; the money economy has no source but loot |

The Monument is the interesting one because it is the first structure with a **permanent** effect
rather than charges. `StrongholdLogic.canCharge` already special-cases Barracks and Warehouse as
uncharged structures, so the pattern exists.

Each needs a `StructureType` member, an entry in the pack's `structures` array, and charge-reading
wherever its effect applies — which for most of these is **not** `stronghold-page`, where all the
existing ones live. Expect to touch the campaign map page and the buy-item modals.

---

## Part C — Cards

### Sellsword (role)

A mercenary who fights better when paid — but the game has no in-encounter money, so express it as
opportunism: bonuses against wounded or outnumbered targets.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Weapon +2, Presence +2, MilitaryWeapons, LightArmor |
| Features | Endurance +1, Weapon +2, Presence +2, Edged +1 |
| Action | *Cut Your Losses* — attack plus `addMovement` |
| Action | *Finish the Job* — attack with `dealWeaponDamage(2)`; prerequisite that the target is wounded |
| Action | *Terms of Engagement* — burst on enemies, Presence vs Resolve, on hit a Weapon skill penalty |
| Action | *Hired Steel* — self: a Weapon bonus condition |
| Action | *Take the Purse* — `ActionEffects.steal()`, which is implemented and used almost nowhere |

Target 5–6.

### Negotiator (background)

Presence-focused, and the card that most directly supports Part A.

| Slot | Content |
| --- | --- |
| Starting | Presence +2, Resolve +1 |
| Features | Presence +2, Resolve +1 |
| Action | *Parley* — enemy: `commandMove()`, pushing them out of position without violence |
| Action | *Reassess* — ally: remove a detrimental condition |
| Action | *Read the Room* — self: `scan()` plus a Presence bonus |

Target 3–4.

### Monsters

**Brigand** and **Mercenary Captain** — humanoid opponents with roles and backgrounds rather than
monstrous species. The monster roster is almost entirely non-human; opponents who are simply other
companies fit this pack and reuse the existing hero card pool.

Note `EncounterGenerator.addMonster` takes species, role and background IDs, so a monster species
that draws from the hero role deck is already expressible.

---

## Scope warning

This is the largest and riskiest of the pack specs, because Part A and Part B both change the
campaign layer rather than adding cards to it. Part C alone is a small, safe pack that could ship
first.

If you want a smaller version: **build Part C and the Bazaar only.** That gives the pack an identity
and defers everything that touches `CampaignMapLogic`.

## Acceptance criteria

- A region adjacent to conquered territory can be purchased if affordable, and the purchase awards
  the region's boon exactly as conquest does.
- Purchase price scales with remaining encounters and population, and falls with party Presence.
- A region with no adjacency cannot be purchased.
- The Bazaar reduces item and structure prices while it has charges.
- The Monument permanently increases `heroSlots` and does not consume charges.
- New cards score inside band.
- A save from before this change loads without error.
- `npm run lint` and `tsc --noEmit` clean.
