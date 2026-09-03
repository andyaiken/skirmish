# Spec 04 — Blood and Sand

**Type:** new pack + one map type
**Size:** medium
**Depends on:** nothing

---

## Why this pack

`tasks.md` lists three separate wants that are all the same pack:

- Map type: **Arena**
- Role idea: **Gladiator** (large weapons, showmanship)
- Role idea: **Ravager**
- Structure idea: **Trophy Room**

It also closes a smaller gap. **Brawl** is a full skill with no associated item — Sensei and Ninja
build on it and fight with nothing in their hands, because no item in the game supports unarmed
combat. A gladiator pack is the natural home for that.

**Naming:** *Blood and Sand* is the phrase for exactly this. No alternative needed.

```ts
static arena = (): PackModel => ({
    id: 'pack-blood-and-sand',
    name: 'Blood and Sand',
    description: 'Fighting to win is one thing. Fighting to be watched is another.'
});
```

---

## Part A — The Arena map type

Every current map is a maze: dungeon corridors, ruins, caverns, streets. All four reward line-of-
sight play and cover. An arena is the opposite — one open space with nowhere to hide — and it makes
every existing card play differently without changing a single rule.

Add `EncounterMapGenerator.generateArenaMap(size, rng)` and register it in the `mapTypes` array in
`generateEncounterMap`.

**Shape:** a single open floor, roughly circular or oval, sized to `size` squares. Scatter a small
number of Obstructed squares as pillars or barriers — but far fewer than the blob loop produces, so
the arena stays open. That means the arena should **skip or reduce** the obstructed-blob pass that
follows the map draw:

```ts
while (Random.randomNumber(3, rng) !== 0) {
    // Add a blob of obstructed terrain
}
```

Either special-case the arena there, or move the blob pass into the individual generators that want
it. The second is cleaner and helps Spec 03 as well.

**Building Interior**, the other map type in `tasks.md`, is the same size of job — rectangular rooms
off a corridor spine, more walls than the dungeon generator produces. Worth doing in the same pass
while the generator file is open, though it belongs to no particular pack.

---

## Part B — Cards

### Gladiator (role)

From `tasks.md`: large weapons and showmanship. The design hook is that showmanship should be
mechanical, not flavour — the Gladiator is the first role to make **Presence** matter in a fight
without being a spellcaster or a commander.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Weapon +2, Presence +2, LargeWeapons, LightArmor |
| Features | Endurance +1, Weapon +2, Presence +2, Impact +1 |
| Action | *Crowd-Pleaser* — melee attack; on hit, add a Presence-rooted damage bonus condition to self |
| Action | *Killing Blow* — melee attack with `skillBonus: -2` and `dealWeaponDamage(2)`; prerequisite `ActionPrerequisites.meleeWeapon()` |
| Action | *Play to the Gallery* — burst on enemies, Presence vs Resolve, on hit `ActionEffects.stun()` |
| Action | *Sweeping Blow* — melee attack against `Number.MAX_VALUE` enemies at radius 0, `skillBonus: -2` |
| Action | *Second Wind* — prerequisite `ActionPrerequisites.damage()`; `ActionEffects.healDamage()` and stand |

Target 5–6.

### Ravager (role)

From `tasks.md`, no further detail given. The reading that does not duplicate the Barbarian: the
Barbarian attacks recklessly and takes the consequences; the Ravager gets **stronger as the fight
goes badly**. Build every action with a `ActionPrerequisites.wound()` or `damage()` prerequisite, so
the card is weak at full health and frightening at one wound from unconsciousness.

That prerequisite pair is barely used in the current data and this is the cleanest expression of it.

### Beast-handler (background)

Fights alongside something on a chain. `ActionEffects.summon(SummonType.Beast)` is implemented and
has very few users — but see the deferred Beastmaster in the README, and the Druid's *Animal
Companion*, which already owns plain beast-summoning. Differentiate on what happens after the
summon: the Beast-handler throws it at people.

Target 3–4.

### Monsters

**Ogre** (`tasks.md`, size 2, Impact, LargeWeapons), **Pit Hound** (`Beast`, pack fighter),
**Wisent** (`Beast`, size 2, charge attack using `forceMovement(TowardsTarget)`).

### Items

**Cestus** — `ItemProficiencyType.None`, `ItemLocationType.Hand`, a weapon with low Impact damage.
The point is that it is the first item a Brawl character has any reason to hold. Consider whether
Brawl attacks should be able to use it: `ActionEffects.attack` takes `weapon: boolean`, and Brawl
actions currently pass `weapon: false`, so a cestus would need either its own actions or a Brawl
proficiency to be meaningful. **Decide this before building it** — it is the one piece of this pack
that might need engine support.

**Manica** — `ItemLocationType.Hand`, armour-like, granting a Physical damage resistance feature.

---

## Part C — Trophy Room (structure)

From `tasks.md`. The obvious effect, and one nothing else provides: **charges accumulate from
victories rather than being bought**. Every other structure recharges on the same schedule; a
Trophy Room that gains a charge each time you defeat a boss would be the first structure with a
gameplay-driven charge source.

That is a genuine change to `StrongholdLogic.rechargeStructure` and the encounter-completion flow in
`main.tsx` (`finishEncounter`), so treat it as optional. The cheap version — a normal structure
granting an extra feature-card redraw — works with no engine change.

Add `TrophyRoom = 'trophy room'` to `StructureType` plus the entry in the pack's `structures` array
either way.

---

## Acceptance criteria

- The arena map generates as a single connected open space with no more than a light scatter of
  obstructed squares.
- The arena is not subsequently filled by the obstructed-blob pass.
- Arena maps only appear when the pack is enabled.
- The Gladiator's Presence-based actions resolve correctly against enemy Resolve.
- Every Ravager action is gated on a damage or wound prerequisite and is correctly unavailable at
  full health.
- New cards score inside band.
- `npm run lint` and `tsc --noEmit` clean.
