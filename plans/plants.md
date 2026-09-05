# Overgrowth

## Why this pack

The game has no plants. Not "few" — none. Across every card in every pack, the words *plant, tree,
fungus, spore, thorn, vine, bloom, seed, moss* and *briar* appear **zero times**. There is fire,
water, air, earth, undead, devils, disease, beasts, clockwork, sound, mind magic and the divine, and
nothing that grows.

The sharpest symptom is the **Druid**, described as "a wielder of the magic of the natural world".
Its four actions are *Animal Companion*, *Stone to Dust*, *Sunlight* and *Nature's Balm* — animals,
rock, sun and healing. The one role whose entire premise is nature has no growing thing to command,
and it sits in **The Fae Realm** alongside Pixie and Banshee, which are spirits rather than nature.

This pack also has somewhere to stand mechanically. Three systems are built, working and barely used:

- **Terrain.** `createTerrain` has three uses in the whole game (Obstructed, Clear, Water),
  `addSquares` three, `removeSquares` **one**. Nothing is really *about* shaping the ground.
- **Contagion.** Now that a condition names who can catch it (`ContagionType`), spores are the
  obvious second thing contagion is for, after plague.
- **Summoning.** See below — this pack empties `SummonType.Beast` and should not fill it back in.

**Naming:** *Overgrowth* — one word, and it carries the sense of something that has got away from
whoever planted it. It also keeps the pack list out of the "X and Y" shape, which was up to six
names before Guile and Cunning became Skullduggery and Coin and Contract became The Going Rate.

```ts
export const overgrowth = (): PackModel => ({
    id: 'pack-overgrowth',
    name: 'Overgrowth',
    description: 'None of it is in a hurry, and none of it is on your side.'
});
```

---

## Move the Druid here

Cut `role-druid` from `fae-realm.ts` into the new pack. This is a straight move — a role belongs to
whichever pack file defines it, and nothing references it by pack.

**Drop *Animal Companion*.** It is the only card in the game that uses `SummonType.Beast`
(`fae-realm.ts:258`), so removing it leaves that summon type with no users at all. That is the point:
it clears the beast-summoning idea out of the Druid so it can be a role of its own (below), and it
takes the last animal out of a card that should be about plants.

Replace it with a plant action — *Entangle* or *Choking Roots* — and check the role still lands in
the 4–6 band. The Druid currently scores **5** (raw 4.80), so there is room either way.

Consider whether *Sunlight* stays. It is Light damage and reads as sun-not-plant, but photosynthesis
is a fair argument and Light has few homes. Keep it unless the pack ends up crowded.

**Consequence for The Fae Realm:** it drops to two roles (Hexbow, Luckweaver). That is fine — it
still has three species — but it is worth knowing the pack gets thinner.

## The Beast Summoner belongs in The Menagerie

Not part of this pack, but created by it. The Menagerie has **seven species and no roles or
backgrounds at all** — the only pack with that shape — and `SummonType.Beast` will have no users once
the Druid loses *Animal Companion*.

A **Beastcaller** role there solves both at once, and no longer collides with the
Druid, which is what killed the idea when it was raised before. Give it `summon(SummonType.Beast)`,
pack-tactics support, and something that rewards fighting beside a summoned creature. Target 4–6.

While in there: `SummonType.Elemental` filters by `s.name.toLowerCase().includes('elemental')`
(`action-logic.ts:1621`) rather than by a quirk like Undead and Beast do. It works only because the
four elementals happen to be named that way. Not urgent, but if this pack adds a `Plant` summon type,
give it a quirk to filter on rather than copying the string match.

## Cards

### Sylvan (species, hero)

Plant-kin: slow, tough, and hard to move. Endurance-rooted rather than Resolve — the hero species
spread is Speed 7 / Resolve 5 / Endurance 5, so another Endurance body is welcome.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Brawl +2, Decay resistance +1 |
| Features | Endurance +1, Brawl +2, Fire **vulnerability**, Poison resistance +1 |
| Action | *Take Root* — self: heavy movement penalty, large damage resistance while it lasts |
| Action | *Reach* — adjacent attack at extended radius, Piercing |
| Action | *Regrow* — `healDamage`, prerequisite `damage()` |

The fire vulnerability is the interesting half and needs checking first: no species carries a
permanent weakness, and `createDamageResistFeature` with a negative rank may or may not behave. If it
does not, express it as a starting condition or drop it. Target 5–6.

### Thornwright (role)

The terrain role. Where the Geomancer moves rock, this one grows things in the way.

| Slot | Content |
| --- | --- |
| Starting | Resolve +1, Spellcasting +2, Implements |
| Features | Resolve +1, Spellcasting +2, Piercing +1, Decay +1 |
| Action | *Briar* — `createTerrain(Obstructed)` on a burst of squares |
| Action | *Clear Cut* — the inverse; also a use for `removeSquares`, which has one use in the game |
| Action | *Barbs* — attack; on hit a movement penalty and Piercing damage |
| Action | *Strangle* — attack; `ifTarget(Prone)` for a large bonus, since briars catch the fallen |
| Action | *Deep Roots* — self: resist forced movement, or heal while standing in Obstructed ground |

Target 4–6.

### Sporeborn (background)

The contagion background, and the first use of spores as distinct from plague. Its signature is a
**beneficial** contagious condition — `ContagionType.Allies` — passed through a huddled party, plus
one `Enemies` spore that spreads only among whoever is fighting you.

Backgrounds are the tightest band in the game (3–4, and most sit at 4), so keep this to three actions
and do not give it damage. Target 3–4.

### Monsters

**Bramblewight** — size 2, Piercing, roots itself in place and punishes anyone adjacent. The
"immovable object" the pack needs.

**Fungal Bloom** — `Mindless`, low damage, but its whole purpose is `ContagionType.All` spores and a
death action that bursts them over everything adjacent. Death actions are still only six of
sixty-seven species; this is a natural one.

**Strangler** — a carnivorous plant that cannot move at all. Worth checking the AI copes with a
combatant that has no movement — `IntentsLogic` builds movement intents first and falls back to
`lastResorts`, so it should, but confirm before designing around it.

**Rotcap** — `Mindless`, Decay, spreads what it stands in.

**Heartwood** — the pack's designed boss: size 3, enormous Endurance, summons Bramblewights. Note
that `QuirkType.Boss` is applied by the encounter generator rather than authored on a card, so this
is a big monster rather than a Boss-quirked one.
