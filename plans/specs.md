# Skirmish — content and systems specs

## The specs

| #  | Spec                                                    | Type                  | Size   | Depends on           | Status        |
| -- | ------------------------------------------------------- | --------------------- | ------ | -------------------- | ------------- |
| 02 | [Deep Water](deep-water.md)                             | Pack + systems        | Large  | —                    |               |
| 03 | [The Lie of the Land](the-lie-of-the-land.md)           | Pack + systems        | Large  | —                    | *Part A done* |
| 04 | [Blood and Sand](blood-and-sand.md)                     | Pack + map type       | Medium | —                    |               |
| 07 | [Chapter and Verse](chapter-and-verse.md)               | Pack + system         | Medium | —                    |               |
| 09 | [Coin and Contract](coin-and-contract.md)               | Pack + campaign layer | Large  | —                    |               |
| 10 | [Nightfall](nightfall.md)                               | Pack + system         | Large  | —                    |               |
| 11 | [Monsters and bosses](monsters-and-bosses.md)           | Content + system      | Medium | —                    | *Part A done* |

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

Run with `npx tsx`. Every card built so far has been scored this way.

There is also a test runner: `npm test` enforces these bands, and monster species
(4–6) alongside them, so a card outside band fails rather than merely being noticed.

**Documentation.** New keywords and rules belong in `src/assets/docs/`. Those five markdown files are
how players learn what quirks and mechanics do; a rule that is not in them is invisible.

**Small species** as a size mechanic. It is not simply `size: 0`: `getCombatantSquares` computes
`right = left + size - 1`, so size 0 yields an empty square list and the combatant occupies
nothing. Small creatures need a `Small` quirk with explicit rules, which is its own spec.

---

## Deferred

Cards and loose ends from the specs that have been built and removed. Each was assessed and set
aside for a reason, recorded here so the reason does not have to be rediscovered. Three of the four
cards are blocked on finding a distinct identity rather than on effort.

### Venomblade (role, Cold Blood) — *needs a distinct identity first*

As originally sketched — Weapon + Stealth, Poison damage bonus, `AutoDamageCondition` on hit — this
*is* the Assassin, whose `Poison Strike` already does weapon damage plus Poison plus an
`AutoDamageCondition` on a Stealth-and-Weapon card with a Poison bonus. A second attempt traded
Stealth for Endurance and cut the burst damage; that still read as the same card, because both remain
melee weapon users whose strikes add poison. Separating them means changing what poison *does* on
this card, not which stats carry it.

The most promising unclaimed ground: **no card in the game has a Poison aura** (there are 14 damage
auras — Decay, Fire, Cold, Light, Psychic, Edged — and no Poison), which would make proximity the
attack, with strikes that apply Endurance penalties and Poison vulnerability rather than poison
damage. The Assassin then kills with poison; the Venomblade disables with it.

### Charmer (background, Cold Blood) — *the Presence lane is full*

Every action in a first attempt was already owned: a `commandAction` charm is the Commander's
*Direct the Attack*, an enemy penalty is the Noble's *Dishearten* and the Mountebank's *Jinx*, and an
ally buff is the Bard's and the Noble's. Presence-plus-buff-plus-debuff is the most crowded lane in
the background list — Noble, Commander, Bard and Mountebank all sit in it. If this card is revived it
needs a mechanism none of them use. Free ground among backgrounds: **no background uses
`weapondamage`, `disarm`, `createTerrain` or `summon`** — backgrounds never touch weapons at all.

Note also that **`commandMove` does not work as a compulsion; `commandAction` does.** `commandMove`
gives the target movement and then runs *its own* movement intents, so used on an enemy it helps them
reposition — both existing users target allies, and that is why. `commandAction` passes an
invert-targets flag, so on an enemy it turns them against their own side (the Naga's *Beguiling Gaze*
already does this).

### Discordant (role, Sound and Fury) — *assessed and not built*

The inverse of the Bard: rather than inspiring allies it unmakes enemy coordination, built on
`ActionEffects.invertConditions(all)`. Two problems, both from the data:

1. *Inverting enemy buffs rarely fires.* Only 6 of the game's 42 monsters ever gain a beneficial
   condition — Orc, Animated Object, Doppelganger, Mutant, Inquisitor, Automaton. Against the other
   36 the signature action finds nothing to flip. The direction that always fires is the opposite
   one: inverting an **ally's** penalties into bonuses, which no card does (Physician, Druid and
   Cleric only *remove* ally conditions).
2. *The identity is already occupied.* `invertConditions` has five users, and the Luckweaver's
   *Probability Wave* in particular targets all combatants and flips every qualifying condition —
   which is the broad polarity-flipping the Discordant would be built on. A Discordant would be a
   narrower Luckweaver in a different pack.

If it is revived, the ally-facing direction is the one with room in it, and it needs to stay clear of
both the Luckweaver and the Bard.

### Elemental hero species (The Elements) — *four cards for a cosmetic gap*

A pack described as "Become the master of the four elements" with no elemental species; the four
elementals exist as monsters only. The sketch was Emberborn (Fire), Stoneborn (Impact/Physical,
`createTerrain(Obstructed)`), Tideborn (Cold, `forceMovement(Pull, 2)`) and Stormborn (Electricity
chain), each at 3 starting features / 3–4 features / 2–3 actions to land in the 5–6 band.

Deferred as a set: four new species in one go is more than this gap warrants, the pack is playable
today through the Elementalist and Sorcerer, and the missing piece is flavour rather than function.
If it is revived, build one and play it before committing to all four. Note Stoneborn overlaps the
Geomancer — give it the durability angle rather than terrain control.

### Beastmaster (role) and Houndmaster (background), The Menagerie — *both encroach on the Druid*

A beast pack with no way to play a beast-handler, which is a real gap;
`ActionEffects.summon(SummonType.Beast)` exists and has very few users. But the Druid (The Fae Realm)
already owns this ground — its *Animal Companion* **is** `summon(SummonType.Beast)`, which is the
whole basis of the Beastmaster, and a background commanding a summoned beast sits in the same lane.
`summon` has only three users precisely because it is a narrow mechanic, and the Druid holds the
beast half of it. Reviving these means finding a beast-handler identity that is not summoning — or
accepting the overlap deliberately.

### Item-pool loose ends (Tools of the Trade)

- **Shields is now the thinnest weapon proficiency at 3.** Powder weapons is also 3, but deliberately
  so — it is The Workshop's identity.
- **`ItemLocationType.Ring` is the string `'Ring'`**, so the slot is labelled "Ring" in the UI even
  with an armband or a bracer in it. Renaming it to something like `Trinket` would read better, but
  that string is persisted on every saved item, so it was left alone.
- **Bastard Sword, Bardiche, Padded Armor and Studded Leather** were assessed and not built: Military
  (10), Large (8) and Light armor (4) were not gaps. Not deferred so much as declined.
