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
    id: 'pack-16',
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

**Recommendation: build the pack without it first.** The composite version plays almost as well and
costs nothing. Add contagion later if the pack feels flat, and be careful — a spreading condition on
a 400-square map with up to ten combatants can run away, so cap it at one spread per turn per source.

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

Check first whether wounds already clear between encounters — look at `finishEncounter` in
`main.tsx` and `CombatantLogic.resetCombatant`. If they do, this structure needs a different effect
and the obvious one is an extra feature-card redraw. If they do not, wound recovery is a real
campaign-layer lever and nothing else provides it.

Add `Sanatorium = 'sanatorium'` to `StructureType` plus the entry in the pack's `structures` array
and charge plumbing.

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
