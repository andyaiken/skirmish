# Spec 08 — Sound and Fury

**Type:** new pack (data only)
**Size:** small
**Depends on:** nothing
**Status:** *built — 6 cards*

---

## Why this pack

Counting `DamageType` references across all card data:

| Damage type | Roles | Hero species | Monsters |
| --- | --- | --- | --- |
| Impact | 12 | 2 | 21 |
| Fire | 11 | 1 | 7 |
| Electricity | 10 | 0 | 1 |
| Poison | 4 | 3 | 15 |
| **Sonic** | **1** | **1** | **5** |
| **Acid** | **1** | **0** | **4** |

Acid is handled by Spec 06. Sonic is the other near-dead type: one role reference, one hero species,
and five monsters — mostly the Banshee.

Sonic is also mechanically distinctive in a way the game does not exploit. It is the damage type
that most naturally ignores cover and line of sight, and the game has a fully implemented visibility
system (`EncounterMapLogic.visibilityCache`, the fog component, per-combatant hidden/senses scores)
that no damage type interacts with.

**Naming:** *Sound and Fury* is the phrase, and the Shakespeare tail — "signifying nothing" — is a
decent joke about a pack built on the least-used damage type. Alternatives: **Discord**,
**A Song of Ruin**.

```ts
static sound = (): PackModel => ({
    id: 'pack-sound-and-fury',
    name: 'Sound and Fury',
    description: 'Noise travels where a blade cannot.'
});
```

This is a deliberately small pack — 5 or 6 cards, in the range of *Out of the Grave* and
*Power and Glory*. It does not need to be more.

## What was built

Six cards: **Bard** (role, 6), **Minstrel** (background, 4), **Crier** (background, 4), **Screamer**
and **Echo** (monsters, 5 and 5), and the **Horn**. The Discordant was not built — see below.

**Named differently to the spec.** The spec's Skald is built as the **Bard** role — "Bard" is the
name players expect for this archetype and it belongs on the role, which is the bigger card. The
former Bard background, moved here out of the base game, became the **Minstrel**: a working
performer rather than a heroic one, which is the right register for a background sitting beside a
Bard role. Every ID follows the names (`role-bard`, `background-minstrel`, and the feature and
action prefixes), which required renaming the background first — the role's new `bard-*` prefixes
would otherwise have collided with the background's existing ones, and `npm test` checks ID
uniqueness.

**The Bard background moved from `core()` into this pack, and is now the Minstrel.** The spec
positions its role as "the role-scale version of the Bard background", which is an argument for the
two living together: this is the performance pack, and both are performance cards. It also thins an over-represented cluster —
three of the base game's seven backgrounds were Presence-based (Bard, Commander, Noble), and core
keeps Commander and Noble, so nothing is left uncovered. Base backgrounds go 7 → 6.

Same reasoning as the Banshee applies in reverse: `GameLogic.getBackground` searches `getAllPacks()`,
so every saved hero with the Bard background still resolves. What changes is hero creation — the Bard
is now drawn only when this pack is enabled.

Sonic went from 4 cards that touch it to 7, and from **zero hero-facing sources to one**: before
this pack, no role or background in the game dealt Sonic damage at all.

### Corrections to the analysis above

- **"The Skald damages with Presence, which no card in the game currently does" is false.** Nine
  actions already do: Cambion's `Hellfire`, Wraith's `Life Drain`, Deva's `Divine Light`, Apostate's
  `Withering Radiance` and `Fall With Me`, Inquisitor's `Interrogate` and `Cleansing Fire`, Cleric's
  `Divine Retribution`, and Paladin's `Flame of Valor`. The Skald/Bard separation still holds, but
  for a simpler reason: the Bard is a background that deals no damage at all, and the Skald is a
  role built on Sonic.
- **`invertConditions` is used by five cards** — the spec's "barely used" is accurate. Luckweaver's
  `Probability Wave` (all combatants, every condition), Mystic's `Eldritch Reversal`, Mountebank's
  `Roll the Dice`, Zealot's `Righteous Will`, and the Arcane Aberration's `Turn Inward`.
- **The Horn is the sixth Implement, not the fifth.** Orb, Wand, Tome, Amulet and Staff already
  existed.
- **The Crier as tabled scores 2, below the 3–4 band.** One starting feature and one feature is too
  thin; `npm test` catches it. It needed a second of each (Resolve +1) to reach 4.
- **The Banshee objection was half right.** Moving a species between packs does *not* break saves:
  `GameLogic.getSpecies` searches `getAllPacks()`, so a saved combatant resolves whatever is enabled.
  The real reason to leave it is stronger than the one given — the Banshee is The Fae Realm's *only*
  monster, so moving it would make Fae the single monsterless pack in the game and undo what Spec 11
  Part A established. **Decision: left in The Fae Realm**, as the spec recommends.

---

## The design hook

Sonic should interact with **hiding and senses**, not with cover. Everything needed already exists:

- `ActionEffects.reveal()` — sets a target's hidden score to 0
- `ActionEffects.scan()` — increases the actor's senses
- `ActionEffects.stun()` — the deafening effect
- `combat.hidden` and `combat.senses` are per-combatant and rolled fresh each turn

So a Sonic pack can be built entirely from existing effects, and its cards do something no other
cards do: they make stealth stop working.

Whether Sonic damage should literally ignore obstructed squares is a bigger question —
`ActionTargetParameters.burst` resolves targets through `EncounterLogic.findCombatants`, which
respects visibility. Changing that for one damage type means a special case in targeting, which is
more invasive than this pack warrants. **Keep it out of the first version.** Express the idea through
`reveal` instead.

---

## Cards

### Skald (role) — *built as the **Bard***

The base game has a Bard **background** — charismatic, inspires allies. The Skald is the role-scale
version and should not simply be a bigger Bard. Its distinction: the Bard buffs, the Skald
**damages with Presence**, which no card in the game currently does.

Built under the name **Bard** (`role-bard`); the background it is contrasted with here is now the
**Minstrel**. The distinction still holds as written — the Minstrel buffs and deals no damage, the
Bard deals Sonic — just not for the reason given, since Presence damage already existed.

| Slot | Content |
| --- | --- |
| Starting | Resolve +1, Presence +2, Spellcasting +2, Implements |
| Features | Resolve +1, Presence +2, Sonic +1, Energy resistance +1 |
| Action | *Battle Hymn* — burst on allies, Presence-rooted damage bonus condition |
| Action | *Shattering Note* — burst on enemies, Presence vs Endurance, `dealDamage(Sonic, 3)` |
| Action | *Dirge* — on hit, `TraitPenaltyCondition(Resolve, 4, Resolve)` plus `AutoDamageCondition(Resolve, 3, Sonic)` |
| Action | *Rallying Cry* — allies within burst: `ActionEffects.stand()` and a movement bonus |
| Action | *Deafening Shout* — burst radius 2, all enemies, on hit `ActionEffects.stun()` and `ActionEffects.reveal()` |

Target 5–6.

### Discordant (role) — *not built*

Optional second role if the pack feels thin at one. Six cards matched *Out of the Grave*, so it was
not needed for size. The inverse of the Bard: rather than inspiring allies it unmakes enemy
coordination — condition inversion and penalties. `ActionEffects.invertConditions(all)` is exactly
this card's identity.

**Assessed and not built.** Two problems, both from the data:

1. *Inverting enemy buffs rarely fires.* Only 6 of the game's 42 monsters ever gain a beneficial
   condition — Orc, Animated Object, Doppelganger, Mutant, Inquisitor, Automaton. Against the other
   36 the signature action finds nothing to flip. The direction that always fires is the opposite
   one: inverting an **ally's** penalties into bonuses, which no card does (Physician, Druid and
   Cleric only *remove* ally conditions).
2. *The identity is already occupied.* `invertConditions` has five users, and the Luckweaver's
   `Probability Wave` in particular targets **all combatants and flips every qualifying condition** —
   which is the broad polarity-flipping the Discordant would be built on. A Discordant would be a
   narrower Luckweaver in a different pack.

If it is revived, the ally-facing direction is the one with room in it, and it needs to stay clear of
both the Luckweaver and this pack's own Bard.

### Minstrel (background) — *moved here from the base game, formerly the Bard*

Not a new card. See "What was built" above for why it moved and why it was renamed.

### Crier (background)

| Slot | Content |
| --- | --- |
| Starting | Presence +2 |
| Features | Presence +2 |
| Action | *Call Out* — `reveal()` on all enemies in a burst |
| Action | *Drown Out* — enemy Presence/Spellcasting penalty condition |
| Action | *Carry the Word* — `commandMove()` on an ally |

`reveal` as a background action is genuinely useful and nothing currently offers it outside
combat-specific roles. Target 3–4.

### Monsters

**Screamer** — low damage, high Sonic, `stun` on hit. A monster that disrupts rather than kills.

**Echo** — `Amorphous`, resistant to Physical, deals Sonic. Flavour: it is not really there.

Both size 1. Consider whether the **Banshee** should move here from *The Fae Realm* — it is the
game's existing Sonic monster and fits this pack better thematically. **Recommendation: leave it.**
Moving a card between packs breaks any save where the Fae pack is enabled and the Sound pack is not,
and *The Fae Realm* would drop to five cards.

### Items

**Horn** — `ItemLocationType.Hand`, `ItemProficiencyType.Implements`. Gives the Implements
proficiency a ~~fifth~~ sixth item and is the obvious Sonic implement.

---

## Note on the sound system

The game has a `Sound` utility and an audio volume option, and `tasks.md` wants sound effects. That
is unrelated to this pack — Sonic is a damage type, not audio — but if both land in the same period,
resist the temptation to couple them. A Sonic action playing a distinctive sound effect is a nice
touch and nothing more.

## Acceptance criteria

- ~~At least three hero-facing cards deal or resist Sonic damage.~~ **Two: the Skald deals it, the
  Crier resists it.** The Minstrel is a third hero-facing card but touches no Sonic — it was moved
  here for theme, not to meet this. Giving it a Sonic hook would satisfy the criterion, but that means
  changing a long-standing base card's mechanics, so it was left alone. Building the Discordant would
  also do it.
- The Skald's Presence-based attacks resolve as attacks, using Presence as the skill.
- `reveal()` on the Deafening Shout sets affected enemies' hidden score to 0.
- `invertConditions` on the Discordant, if built, correctly flips beneficial and detrimental
  conditions.
- New cards score inside band.
- `npm run lint` and `tsc --noEmit` clean.
