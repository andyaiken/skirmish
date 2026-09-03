# Spec 05 — Tools of the Trade

**Type:** base-game content (data only)
**Size:** medium — high card count, low complexity
**Depends on:** nothing
**Status:** *built, scoped down — see "What was built" below*

---

## Why this pack

Items are the most lopsided content in the game. 53 items, of which 33 occupy the Hand slot:

| Location | Count | Contents |
| --- | --- | --- |
| Hand | 33 | 27 weapons, 4 implements, 2 shields |
| Body | 9 | 6 armours, Belt, Sash, Bandolier |
| Head | 5 | Helm, Circlet, Crown, Tiara, Diadem — **all described "Ornamental headware"** |
| Neck | 4 | Amulet, Cloak, Torc, Necklace |
| Feet | **1** | Boots |
| Ring | **1** | Ring |

Only one pack in the game adds items at all: The Workshop, with two guns. So no matter which packs
are enabled, the item pool is essentially fixed.

This matters more than the raw numbers suggest, because of how the pool is consumed:

**`MagicItemGenerator.generateRandomMagicItem` draws a base item and enchants it.** Every magic Feet
item in every campaign is a variant of Boots. Every magic Ring is a variant of Ring. Adding item
cards multiplies through the entire magic item economy — the Wizard Tower, the boon rewards, and
loot piles all draw from it.

**`CombatantLogic.addItems` draws one item per proficiency**, filtered by
`GameLogic.getItemsForProficiency`, which matches on `item.proficiency`. Note the consequence: the
14 items with `ItemProficiencyType.None` — all the jewellery, boots and belts — are **never drawn at
hero creation**. They arrive only through loot and purchase. So new `None` items expand the magic
item pool and the loot tables but do not change starting equipment; new items with a real
proficiency do both.

**This shipped into `core()`, not as a pack.** Filling gaps in the base item pool is not a thing to
sell separately: every hero draws from these slots, and a Feet slot with one item in it is a defect
in the base game rather than missing premium content. There is no `pack-tools-of-the-trade`.

## What was built

Scoped to filling gaps plus a few thematic options, rather than the ~30 cards below.

**Part A in full — 15 items, no features.** Feet 1 → 5, Ring 1 → 5, Head 5 → 8, Neck 4 → 8. This is
the part that multiplies through the magic item economy: every magic Feet item used to be a variant
of Boots and every Ring a variant of Ring.

**Part B trimmed to 3, then extended by 3:** Sling, Hand Crossbow and Chakram — all
`RangedWeapons`. The Whip was dropped (see the correction below) and the Bastard Sword and Bardiche
were not built: Military and Large weapons already have 10 and 8 entries and are the least thin
proficiencies in the game.

Three **paired weapons** were then added, which the original spec did not call for. The existing
three were identical but for damage type — Daggers, Sais and Tonfas are all rank 2, range 1,
reliable — so rather than add a fourth damage type that does not exist, each new one opens an axis
the category was not using:

| Item | Stats | New axis |
| --- | --- | --- |
| **Hook Swords** | Edged 2, range 2 | the first paired weapon with reach |
| **Katars** | Piercing 3, unreliable 1 | +1 rank bought with unreliability |
| **Nunchaku** | Impact 3, unreliable 1 | the same trade on the impact line |

That +1-rank-for-`unreliable: 1` trade is the game's existing rate: Crossbow is Piercing 4
unreliable 1 against Longbow's Piercing 3 unreliable 0.

**Part C trimmed to 2:** Scale Armor and Splint Armor, both `HeavyArmor`. Padded Armor and Studded
Leather were not built — Light armor has 4 entries and was not a gap.

**Part D dropped.** The Armourer is a background, not an item; nothing in the item pool needed it.

**Ring-slot rework.** Part A's ring table produced five near-identical rings — Ring, Signet Ring,
Seal, Band, Loop — which is filler rather than variety. Seal, Band and Loop were replaced with
**Armband**, **Bracelet** and **Bracer**: things worn on the arm rather than four ways of saying
"ring". Ring and Signet Ring were kept, the signet because it has an actual function. This works
because the slot holds two items (see the correction below).

Result: Shields 2 → 3, Heavy armor 2 → 4, Ranged weapons 3 → 6, Paired weapons 3 → 6. **Shields is
now the thinnest weapon proficiency at 3** — Powder weapons is also 3, but deliberately so, since it
is The Workshop's identity.

One loose end: `ItemLocationType.Ring` is the string `'Ring'`, so the slot is labelled "Ring" in the
UI even with an armband in it. Renaming it to something like `Trinket` would read better, but that
string is persisted on every saved item, so it was left alone.

### Corrections to the analysis below

- **`range: 2` is not new.** Spear, Glaive, Pike and Halberd already have reach 2, which removed the
  Whip's entire justification.
- **`unreliable` is not powder-only.** Flail, Crossbow and Catapult use it too — six users, not
  three.
- **Negative-rank features are already proven.** Plate Armor carries `Speed, -2` and a `-2` skill
  category feature, so the warning in Part C to verify them first is unnecessary.
- **Melee versus ranged is decided by proficiency, not by `range`.** `checkWeaponParameter` maps
  melee to Large/Paired/Military and ranged to Ranged/Powder. A `PairedWeapons` Chakram would have
  been a *melee* weapon with 3 squares of reach — longer than any polearm — so it was built as
  `RangedWeapons` instead.
- **The Ring slot holds two items, not one.** `CombatantLogic.canEquip` gives `Ring` a `slotsTotal`
  of 2, the same as `Hand`, so the note in Part A below is answered: a hero wears two.
- **Non-armour items carry no features.** Not one of the 53 original items had a top-level feature
  or action; only armour and shields have them, in `armor.features`. Part A's instruction to give
  each new item "a small `FeatureLogic` feature" would have broken that, so it was not followed.

---

## Part A — Fill the empty slots

All `ItemProficiencyType.None`. These exist to give the magic item generator something to work with,
so what matters is that they are **distinct**, not that they are individually interesting. ~~Each
should carry a small `FeatureLogic` feature so the unenchanted version is not blank.~~ **Built
without features** — see the corrections above. The feature columns in the tables below were not
used; the descriptions carry the cards.

### Feet (currently 1)

| Item | Feature |
| --- | --- |
| Sabatons | Physical damage resistance +1 |
| Sandals | Speed +1 |
| Greaves | Endurance +1 |
| Snowshoes | Cold resistance +1 |

### Ring (currently 1)

| Item | Feature | Built as |
| --- | --- | --- |
| Signet Ring | Presence +1 | Signet Ring |
| Seal | Resolve +1 | **Armband** |
| Band | Energy resistance +1 | **Bracelet** |
| Loop | Spellcasting +1 | **Bracer** |

~~Note `ItemLocationType.Ring` has no special multi-slot handling in the model — `slots: 1` like
everything else — so a hero wears one ring unless `canEquip` says otherwise. Check
`CombatantLogic.canEquip` before assuming two.~~ **It is two:** `canEquip` gives `Ring` a
`slotsTotal` of 2, like `Hand`.

### Head (currently 5, all identically described)

~~Rewrite the five existing descriptions first — "Ornamental headware" five times is the single most
obviously unfinished text in the data.~~ **Already done** — all five are distinct. Then add:

| Item | Feature |
| --- | --- |
| Mask | Stealth +1 |
| Hood | Perception +1 |
| Coif | Physical damage resistance +1 |

### Neck (currently 4)

| Item | Feature |
| --- | --- |
| Pendant | Resolve +1 |
| Charm | Corruption resistance +1 |
| Locket | Presence +1 |
| Scarf | Cold resistance +1 |

---

## Part B — Weapons the base set lacks

These carry real proficiencies, so they **do** enter the hero-creation draw and change what a
character can start with. Balance them against the existing entries in the `items` arrays under
`src/data/packs/` — most one-handed weapons are damage rank 3, two-handed are 4.

| Item | Proficiency | Notes |
| --- | --- | --- |
| Whip | MilitaryWeapons | `range: 2` — a melee weapon with reach; nothing in the game has this |
| Sling | RangedWeapons | Low damage, no `unreliable` — the cheap ranged option |
| Blowpipe | RangedWeapons | Low Piercing damage plus Poison; Poison is scarce for heroes |
| Chakram | PairedWeapons | Thrown, `range: 3`; paired weapons are all melee today |
| Bastard Sword | MilitaryWeapons | Damage between one- and two-handed |
| Buckler | Shields | Lighter than Shield; the Shields proficiency has only two items |
| Hand Crossbow | RangedWeapons | Short range, no reload penalty |
| Bardiche | LargeWeapons | Edged, high damage |

Shields deserve particular attention: two items for a whole proficiency means a Centurion or Paladin
drawing shield equipment picks from a hand of two.

### The `unreliable` mechanic

`WeaponModel.unreliable` makes a weapon fail on a high roll and is currently only used by the powder
weapons. It is a good lever for interesting cheap items — a jury-rigged or improvised weapon with
strong damage and a real failure chance. Consider one or two.

---

## Part C — Armour

Body has six armours across LightArmor (4) and HeavyArmor (2). HeavyArmor is thin for a proficiency
granted by the Centurion, Paladin and Valkyrie.

| Item | Proficiency | Notes |
| --- | --- | --- |
| Scale Armor | HeavyArmor | Between chain and plate |
| Splint Armor | HeavyArmor | High Physical resistance, Speed penalty feature |
| Padded Armor | LightArmor | Low resistance, no penalty |
| Studded Leather | LightArmor | Piercing resistance specifically |

`ArmorModel` carries a `features` array, so a Speed penalty is expressible as a negative-rank trait
feature. **Verify that negative ranks behave** in `FeatureLogic.getFeatureDescription` and in
`CombatantLogic.getTraitRank` before relying on it — nothing in the current data uses one.

---

## Part D — Armourer (background)

One card, to give the pack a hero-facing face.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Physical damage resistance +1 |
| Features | Endurance +1, Physical damage resistance +1 |
| Actions | *Field Repair* (ally-targeted damage resistance condition), *Shore Up* (self: resistance and a Speed penalty), *Improvise* (`ActionEffects.disarm()` on an enemy) |

Target 3–4.

---

## Notes

**Card count.** This is by far the largest pack by card count — around 30. That breaks the pattern
of the existing packs, which run 3–10. Two options: ship it as one large pack, or split into
**Tools of the Trade** (weapons and armour, proficiency-bearing) and a smaller **Trinkets**-style
pack for the jewellery. The first is simpler and the pricing code in `Platform.getPackPrice` is
disabled anyway, so nothing depends on packs being similarly sized.

**Descriptions matter here more than usual.** These cards have little mechanical identity, so the
text is the card. One sentence, concrete, in the voice of the existing entries — "Three feet long and
sharp on both sides," "A wickedly-curved blade." Avoid stating the mechanical effect in the
description; the card renders that separately.

## Acceptance criteria

- ~~Every new item appears in the `items` array of the pack that owns it.~~ All in `core()`.
- ~~The five existing Head items have distinct descriptions.~~ Were already distinct.
- ~~`GameLogic.getItemsForProficiency(ItemProficiencyType.Shields, [])` returns more than two
  items.~~ Returns Shield, Tower shield, Buckler.
- Drawing a random magic item repeatedly produces varied Feet and Ring base items.
- A weapon with `range: 2` can be used at two squares by a standard melee attack action.
- If any armour uses a negative-rank feature, it displays sensibly on the character sheet.
- `npm run lint` and `tsc --noEmit` clean.
