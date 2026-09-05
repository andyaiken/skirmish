# Long Dark Winter

## Why this pack

Winter is the one theme where the engine is already finished and the fiction is entirely absent.

**What is built.** Ice is a full terrain type with rules no other square has. Cold damage dealt to
someone standing in Water freezes the water around them into Ice; Fire dealt to someone standing on
Ice melts it back to Water (`applyTerrainEffects`, `encounter-logic.ts:908`). Ice is *not* difficult
terrain — you cross it as easily as open ground — so freezing water is a way to take away the
movement penalty, the fire shelter, and the conduction of Acid, Electricity and Poison, all at once.
Aquatic creatures already resist Cold.

**What is missing.** The words *winter*, *blizzard* and *snow* appear nowhere. `createTerrain` is used three times in the game — Obstructed, Clear and Water — and **no card
has ever created Ice**. Ice exists only as a side effect of hitting someone standing in water with
Cold damage.

Cold itself is nearly as thin: seventeen raw uses, but only **three cards** carry a Cold identity at
all — Draugr, Tidecaller and Air Elemental — and none of them is really about the cold.

So this pack is not asking for new systems. It is asking for cards that use the ones already sitting
there, and a reason for Ice to be something you *make* rather than something that happens to you.

```ts
export const longDarkWinter = (): PackModel => ({
    id: 'pack-long-dark-winter',
    name: 'The Long Dark Winter',
    description: 'Cold is patient. It only has to win once.'
});
```

---

## The design hook: cold as tempo, not damage

Fire is the game's damage element and Cold should not be a second one. What cold does in fiction is
**slow things down**, and as of `delay` and `hasten` the game can finally say that.

That gives the pack an identity nothing else has:

- `delay` — the cold makes you late. One card uses this so far (the Siren).
- `MovementPenaltyCondition` — nineteen uses, so well-trodden, but nothing owns it.
- `TraitPenaltyCondition` on Speed.
- `createTerrain(Ice)` — freeze the water so it stops sheltering people from fire and stops
  conducting.

Build the pack so Cold damage is the *smaller* half of every card and the tempo effect is the point.
That also keeps it clear of the Tidecaller, which is the existing Cold role and is about water.

---

## The decision to make first

**Does the pack need snow, or is Ice enough?**

Ice is built and free. A `Snow` square type — difficult terrain that also hides tracks, or that
melts — would need `applyTerrainEffects`, path costs and the renderer, which is the largest piece of
work anywhere in this spec.

The honest answer is probably that Ice is enough for version one, and that a pack which finally uses
`createTerrain(Ice)` has done its job. Revisit snow only if the pack feels thin without it.

A cheaper alternative worth considering: give the pack a card that turns Ice **back** into Water. The
melt rule exists only as a Fire side effect, and a card that deliberately breaks the ice under
someone is a nice inversion that costs nothing to build.

---

## Cards

### Frostkin (species, hero)

Cold-adapted: resists Cold, unbothered by ice, and slow. Fills a real gap — of fourteen hero species,
**none** has a Cold identity, and only one is Endurance-rooted with a resistance theme.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Perception +2, Cold resistance +2 |
| Features | Endurance +1, Perception +2, Cold resistance +1, Cold +1 |
| Action | *Numbing Touch* — adjacent attack: small Cold damage, `delay` |
| Action | *Sure-Footed* — self: movement bonus, and ignore whatever the ground is doing |
| Action | *Still the Blood* — attack: Speed trait penalty |

Perception is deliberate: it is one of the two thinnest skills in the game (two roles), and a species
that reads the weather is a fair home for it. Target 5–6.

### Rimecaller (role)

The tempo caster. Its whole argument is that going second is worse than taking three damage.

| Slot | Content |
| --- | --- |
| Starting | Resolve +1, Spellcasting +2, Implements |
| Features | Resolve +1, Spellcasting +2, Cold +1, Energy resistance +1 |
| Action | *Hoarfrost* — `createTerrain(Ice)` over a burst. The card the pack exists for |
| Action | *Slow* — attack; on hit `delay` and a movement penalty. No damage at all |
| Action | *Cold Snap* — burst, modest Cold damage, Speed penalty on everything caught |
| Action | *Black Ice* — attack; `ifTarget(Prone)` for a bonus, and `knockDown` on anyone on Ice |
| Action | *Thaw* — turn Ice back to Water beneath an enemy, undoing someone else's ground |

Target 4–6. Watch the band: `delay` scores as its rank and several of these stack tempo effects.

### Wintertouched (background)

Endurance against the cold, and the ability to keep moving when nobody else can. Three actions, no
damage — backgrounds sit in a 3–4 band and most are already at 4. Target 3–4.

### Monsters

**Frost Giant** — size 2 or 3, Impact and Cold. *Giant* currently appears only in Giant Spider and
Giant Crab and *ogre* appears nowhere, so this is also the game's first actual giant.

**Rimewight** — `Undead`, Cold, and an aura that slows. Undead is six species and none of them is
cold; a frozen corpse is the obvious one.

**Ice Sheet** — `Mindless`, `Amorphous`, cannot move, but freezes the ground around it. The
counterpart to the Strangler in *Root and Branch*: a monster that is really a piece of terrain.

**Wendigo** — the pack's designed centrepiece. Fast, Stealth-heavy, and it hunts the wounded — a
natural home for `ifTarget(TargetStateType.Wounded)`, which so far only the Assassin uses.

**Winter Wolf** — `Beast`, pack fighter, Cold bite. Gives the Beast Summoner in The Menagerie
something worth summoning.

### Items

**Furs** — `LightArmor` with Cold resistance.
