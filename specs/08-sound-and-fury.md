# Spec 08 — Sound and Fury

**Type:** new pack (data only)
**Size:** small
**Depends on:** nothing

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

### Skald (role)

The base game has a Bard **background** — charismatic, inspires allies. The Skald is the role-scale
version and should not simply be a bigger Bard. Its distinction: the Bard buffs, the Skald
**damages with Presence**, which no card in the game currently does.

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

### Discordant (role)

Optional second role if the pack feels thin at one. The inverse of the Skald: rather than inspiring
allies it unmakes enemy coordination — condition inversion and penalties.
`ActionEffects.invertConditions(all)` is implemented, barely used, and is exactly this card's
identity.

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
proficiency a fifth item and is the obvious Sonic implement.

---

## Note on the sound system

The game has a `Sound` utility and an audio volume option, and `tasks.md` wants sound effects. That
is unrelated to this pack — Sonic is a damage type, not audio — but if both land in the same period,
resist the temptation to couple them. A Sonic action playing a distinctive sound effect is a nice
touch and nothing more.

## Acceptance criteria

- At least three hero-facing cards deal or resist Sonic damage.
- The Skald's Presence-based attacks resolve as attacks, using Presence as the skill.
- `reveal()` on the Deafening Shout sets affected enemies' hidden score to 0.
- `invertConditions` on the Discordant, if built, correctly flips beneficial and detrimental
  conditions.
- New cards score inside band.
- `npm run lint` and `tsc --noEmit` clean.
