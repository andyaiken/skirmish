# Spec 06 — Ill Humours

**Type:** new pack (data only, one optional condition)
**Size:** medium
**Depends on:** nothing

---

## Why this pack

There are three damage categories. Two are well served:

- **Physical** — Edged, Impact, Piercing. Every martial role.
- **Energy** — Cold, Electricity, Fire, Light, Sonic. The Elements, Codex Arcanum, Power and Glory.
- **Corruption** — Acid, Decay, Poison, Psychic. Necromancer (Out of the Grave), Assassin (Guile and
  Cunning), Psion (Codex Arcanum). Three roles across three unrelated packs, and no pack that owns
  the category.

Within it, **Acid is nearly dead**: one role reference, four monsters, and no hero species deals it
at all. Decay is Necromancer-only.

This pack gives Corruption a home, and sits deliberately beside *Magic in a Glass* — where that pack
is potions that help, this is chemistry that does not.

**Naming:** *Ill Humours* is the period-medical register, and pairs with *Magic in a Glass* the way
*Cold Blood* pairs with *The Menagerie*. Alternatives: **The Rot**, **Contagion**.

```ts
static rot = (): PackModel => ({
    id: 'pack-ill-humours',
    name: 'Ill Humours',
    description: 'Some things are cured. Others are merely passed on.'
});
```

---

## Optional system — the Disease condition

`ConditionType` has 19 members and covers bonuses, penalties, resistances, vulnerabilities,
auto-damage and auto-healing. A disease is expressible today as a combination:
`AutoDamageCondition` plus `TraitPenaltyCondition`. That works and needs no new code.

What it does not capture is **contagion** — a condition that spreads to adjacent combatants at the
start of a turn. If you want that, it is a new `ConditionType.Contagion` handled in
`EncounterLogic.startOfTurn`, where conditions are already iterated and decremented.

~~**Recommendation: build the pack without it first.**~~ **Contagion was built first**, ahead of the
cards, and is now base-game behaviour that any card can use.

**How it works.** `ConditionModel` gained a `contagious` flag rather than `ConditionType` gaining a
member — so any existing condition can be made infectious by wrapping it:
`ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(...))`. No new condition
types, and it composes with every existing factory.

`EncounterLogic.spreadContagion` runs from `endTurn`, not `startOfTurn` as suggested above: each
contagious condition a combatant carries gets a roll against **every** adjacent combatant, who
resists with the condition's own trait. It skips the dead and anyone already carrying the same
condition. Adjacency uses `getDistanceAny` over `getCombatantSquares`, so size 2 and 3 combatants
infect from any of their squares.

**The cap is not needed.** The worry above was a runaway outbreak; the copy passed on is **one rank
weaker than the original**, so a chain always terminates. Simulated at the worst case — ten
combatants packed adjacent, 200 outbreaks per rank — every outbreak burned out, with the burn-out
turn tracking the source rank almost exactly:

| Source rank | Avg peak infected (of 10) | Median burn-out |
| --- | --- | --- |
| 4 | 7.1 | turn 4 |
| 6 | 9.8 | turn 6 |
| 8 | 10.0 | turn 8 |
| 10 | 10.0 | turn 10 |

So rank is the balance lever: **rank 4 spreads and fades, rank 8 infects the whole scrum.** Keep new
contagious conditions at the low end.

**Scoring.** `GameLogic.getActionEffectStrength` counts a contagious condition at **double** its
rank, since it lands on more than one combatant. Without that, a spreading condition scored
identically to a static one.

**Five cards carry it.** Retrofitted to the Lifestealer's *Rot* and the Warlock's *Withering Hex*
(both Decay, *Hell to Pay*), and to three cards that had the theme but no condition at all:

| Card | Action | Condition added | Strength |
| --- | --- | --- | --- |
| Rat Swarm | *Bite* | contagious AutoDamage(Poison) r3 | 4 → 5 |
| Zombie | *Grave Rot* | contagious AutoDamage(Decay) r3 | 5 → 5 |
| Elementalist | *Ember* | existing r2 Fire made contagious | 5 → 5 |

All still in band, and the Warlock and Lifestealer remain at 6. The Elementalist's *Ember* was chosen
as the fire trial because it is the **lowest-scoring** fire effect in the game at strength 3 — and
usefully it is rank 2, so it passes on a rank 1 copy that cannot spread again. One hop, no further.
Note the Grenadier's *Molotov* is rank 1 and would have been inert, since a rank 1 condition is
filtered out before it can copy across at rank 0.

**Player-facing rules.** `src/assets/docs/encounters.md` gained an *At the end of a turn* section
covering the spread rules, and the Conditions bullet in the overview now mentions contagion. It
notes explicitly that contagion ignores factions — a diseased enemy infects its own allies, and a
hero can carry something back into your own line.

An audit of every other existing condition found no further candidates. The game has only ten
`AutoDamage` conditions: five are Fire (burning is not disease, and giving five established cards
the ability to spread is a large balance change — revisit only now that the strength metric accounts
for contagion), one is the Assassin's blade toxin, and two are Sonic. Note also that the game's most
disease-flavoured monsters — the Rat Swarm's *Bite*, the Zombie's *Grave Rot* — apply **no condition
at all**, so they cannot be made contagious by flipping a flag; they need a condition first, which is
this pack's business.

---

## Cards

### Plaguebearer (role)

Corruption damage over time. Where the Warlock (Spec 01) pays for power in wounds and the
Lifestealer converts enemy loss into gain, the Plaguebearer simply makes things worse slowly. Its
identity is `AutoDamageCondition` — nothing in the current game leans on it.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Spellcasting +2, Implements, Corruption resistance +1 |
| Features | Endurance +1, Spellcasting +2, Decay +1, Poison +1 |
| Action | *Miasma* — burst, on hit `AutoDamageCondition(Endurance, 3, Poison)` |
| Action | *Wasting Touch* — adjacent, on hit `AutoDamageCondition(Resolve, 4, Decay)` plus `TraitPenaltyCondition(Endurance, 4, Endurance)` |
| Action | *Fever* — on hit `SkillCategoryPenaltyCondition(Resolve, 4, SkillCategoryType.Mental)` |
| Action | *Weeping Sores* — on hit `DamageCategoryVulnerabilityCondition(Endurance, 4, Corruption)` |
| Action | *Carrier* — self: Corruption resistance condition, plus an aura that damages adjacent enemies |

The last one wants `FeatureLogic.createAuraDamageFeature` rather than an action effect if it should
persist. Auras are underused and this is a natural home for one.

Target 5–6.

### Alchemist (role)

Distinct from the Apothecary background in *Magic in a Glass*: the Apothecary **makes** potions with
`ActionEffects.createPotion(potionID)`; the Alchemist **throws** them. Acid and Fire, area effects,
volatile.

The `unreliable` mechanic on weapons has an analogue here — an action that occasionally catches the
caster. `ActionEffects.toSelf([ ... ])` makes that expressible without new code, and it is the most
characterful thing in the pack. Use it on one action, not three.

| Slot | Content |
| --- | --- |
| Starting | Resolve +1, Spellcasting +2, Implements, Acid +1 |
| Features | Resolve +1, Spellcasting +2, Acid +1, Fire +1 |
| Action | *Acid Flask* — burst radius 3, `dealDamage(Acid, 3)` to all enemies in it |
| Action | *Volatile Mixture* — larger burst, higher damage, plus `toSelf([ dealDamage(Fire, 2) ])` |
| Action | *Solvent* — on hit, `DamageCategoryVulnerabilityCondition(Endurance, 5, Physical)` — eats armour |
| Action | *Smoke* — `createTerrain` or a Perception penalty condition in a burst |
| Action | *Restorative* — ally-targeted `healDamage` |

Target 5–6.

### Leech (background)

The period word for a physician, and the joke is that it means both. Where the base-game Physician
heals, the Leech heals **by taking something**.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1 |
| Features | Endurance +1 |
| Action | *Bleed the Patient* — adjacent ally: `healWounds(1)` and a Trait penalty condition |
| Action | *Draw Off the Humour* — `ActionEffects.transferCondition()` from an ally to an adjacent enemy |
| Action | *Poultice* — adjacent ally `healDamage` |

`transferCondition` is implemented and barely used. This card is built almost entirely from it.

Target 3–4.

### Monsters

**Ooze** — from `tasks.md`. `Amorphous` quirk (half damage from physical), Acid damage, size 2. The
`Amorphous` quirk exists and only three monsters use it.

**Rot Grub Swarm** — `Swarm`, `Beast`, Decay damage over time.

**Blightspawn** — Corruption damage, `DamageCategoryVulnerabilityCondition` on hit.

**Plague Doctor** — a humanoid caster; a monster with a background-like feel, which the current
monster roster lacks.

### Sanatorium (structure)

From `tasks.md` ("Hospital / Sanatorium"). Effect: spend a charge to **heal a wound on a hero
between encounters**.

~~Effect: spend a charge to **heal a wound on a hero between encounters**.~~ **Both the effect above
and the fallback below are dead ends, and it was built differently.** Checked as instructed:

- **Wounds already clear between encounters.** `CombatantLogic.resetCombatant` zeroes `damage`,
  `wounds` *and* `conditions`, so the effect as specified would do nothing at all.
- **The fallback is already a structure.** "An extra feature-card redraw" is the **Training Ground**.
  The thirteen existing structures cover every redraw axis in the game — hero (Hall), item
  (Quartermaster), feature (Training Ground), action (Observatory), magic item (Wizard Tower),
  structure (Forge) — plus benefit and detriment mods, extra actions, extra heroes and XP.

**Built as an encounter-time structure instead.** Wounds and unconsciousness only exist *during* an
encounter, so that is where the charge is spent: on their own turn, the current hero may spend one to
clear **all** their wounds. There is a precedent — the **Observatory** already spends charges inside
a live encounter to redraw action cards, using the reusable `StrongholdBenefitCard`.

**It is one structure, not two.** Unconsciousness *is* wounds: a combatant drops when
`wounds === resolve`, and `EncounterLogic.healWounds` already contains the reverse —

```ts
if ((combatant.combat.wounds < resolve) && (combatant.combat.state === CombatantState.Unconscious)) {
    combatant.combat.state = CombatantState.Prone;
}
```

— so clearing wounds brings an unconscious hero round for free. A second structure that restored
consciousness *without* healing would leave the hero at `wounds === resolve` and they would drop
again on their next turn.

**A revived hero needs the turn they were denied.** `startOfTurn` only rolls senses and movement and
draws actions inside an `if (Standing || Prone)` gate, so an unconscious combatant begins their turn
with nothing. Being healed mid-turn would otherwise leave them upright, with no movement and an empty
hand. That block is now `EncounterLogic.startActiveTurn`, called from `startOfTurn` as before and
again by `treatWounds` when a hero is brought round. This matches how **undead reanimation** already
behaves: it flips the combatant to Prone *before* the gate, so it grants a full turn by ordering.
Note undead come back at `wounds = resolve - 1`, one below the threshold, where a treated hero comes
back at zero — stronger, but it costs a charge.

### What was built

| Piece | Where |
| --- | --- |
| `StructureType.Sanatorium` | `src/enums/structure-type.ts` |
| The structure card | `structure-card.tsx` |
| `startActiveTurn`, `treatWounds` | `EncounterLogic` |
| `treatWounds` handler + charge spend | `main.tsx`, modelled on `drawActions` |
| Prop chain | encounter-screen → hero-controls → hero-overview |
| The benefit card | `hero-overview`, beside the wounds display; hidden when the hero has no wounds |
| The pack | `src/data/packs/ill-humours.ts`, registered in `PackLogic.getExpansionPacks()` |

Four tests cover it: wounds cleared, an unconscious hero brought round, a revived hero given movement
and cards, and — the one worth having — an *already conscious* hero **not** handed a second turn,
which would otherwise be a free action redraw.

---

## Acceptance criteria

- The pack introduces at least three cards that deal Acid damage, at least one of them hero-facing.
- `AutoDamageCondition` from the Plaguebearer ticks at the start of the target's turn and decrements
  correctly.
- `toSelf` self-damage on the Alchemist's *Volatile Mixture* applies to the caster, not the target.
- `transferCondition` on the Leech moves a condition from an ally to an enemy.
- If the Sanatorium heals wounds, a wounded hero shows one fewer wound after spending a charge.
- New cards score inside band.
- `npm run lint` and `tsc --noEmit` clean.
