# Spec 01 — Hero options: new base role, new pack, and pack top-ups

**Type:** content (data only — no engine changes)
**Size:** medium
**Depends on:** —

---

## House rules for all cards in this spec

**Strength bands.** `GameLogic.getSpeciesStrength`, `getRoleStrength` and `getBackgroundStrength`
already exist and score every card. Measured across the current set:

| Card type | Existing range | Target for new cards |
| --- | --- | --- |
| Hero species | 5–6 | **5–6** |
| Role | 4–6 (Luckweaver is the lone 4) | **5–6** |
| Background | 3–4 | **3–4** |

Score every new card before merging. A quick harness:

```ts
import { GameLogic } from './src/logic/game-logic';
import { PackLogic } from './src/logic/pack-logic';
PackLogic.getAllPacks()
	.flatMap(pack => PackLogic.getRoles(pack.id))
	.forEach(r => console.log(r.name, GameLogic.getRoleStrength(r)));
```

Run with `npx tsx`. The three cards written out in full below have been scored and land at
Skirmisher 6, Warlock 6, Cultist 4.

**Conventions.** Follow the existing files exactly:

- IDs are `role-<name>`, `species-<name>`, `background-<name>`
- Feature IDs are `<name>-start-N` and `<name>-feature-N`; action IDs are `<name>-action-N`
- Every card must sit in one of the arrays on a pack literal in `src/data/packs/` — a card that is
  written but not placed in an array silently does not exist
- Cards carry no `packID`; the pack that owns a card is the pack whose array it is in. Base cards go
  in `core()`, pack cards in that pack's file
- Descriptions are one sentence, present tense, no trailing full stop inside the card copy where the
  existing entries omit it (check neighbours — the file is consistent)

**Shape guidance.** Roles run 2–5 starting features, 2–7 features, 3–7 actions. Backgrounds run
1–7 starting features and 3–4 actions and should feel like a modifier on a role, not a second role.

---

## 1. Skirmisher — new **base** role

**Why base rather than a pack:** Reactions is the only one of the seven skills that no role builds
on, and Reactions governs initiative — `EncounterLogic.rollInitiative` rolls it directly — so there
should be a role that owns it. The game is called Skirmish; it should have a skirmisher.

**Identity:** acts first, hits, and is somewhere else by the time the reply lands. Its actions
mostly end in `addMovement` or push the target away, so it is the answer to the +4 disengagement
penalty in `getMoveCost`.

Add to the `roles` array in `src/data/packs/core.ts`.

```ts
{
    id: 'role-skirmisher',
    name: 'Skirmisher',
    description: 'Skirmishers strike before the enemy is ready, and are gone before the reply lands.',
    startingFeatures: [
        FeatureLogic.createTraitFeature('skirmisher-start-1', TraitType.Speed, 1),
        FeatureLogic.createSkillFeature('skirmisher-start-2', SkillType.Reactions, 2),
        FeatureLogic.createSkillFeature('skirmisher-start-3', SkillType.Weapon, 2),
        FeatureLogic.createProficiencyFeature('skirmisher-start-4', ItemProficiencyType.MilitaryWeapons),
        FeatureLogic.createProficiencyFeature('skirmisher-start-5', ItemProficiencyType.LightArmor)
    ],
    features: [
        FeatureLogic.createTraitFeature('skirmisher-feature-1', TraitType.Speed, 1),
        FeatureLogic.createSkillFeature('skirmisher-feature-2', SkillType.Reactions, 2),
        FeatureLogic.createSkillFeature('skirmisher-feature-3', SkillType.Weapon, 2),
        FeatureLogic.createDamageBonusFeature('skirmisher-feature-4', DamageType.Piercing, 1)
    ],
    actions: [
        {
            id: 'skirmisher-action-1',
            name: 'Opening Move',
            prerequisites: [ ActionPrerequisites.meleeWeapon() ],
            parameters: [
                ActionWeaponParameters.melee(),
                ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
            ],
            effects: [
                ActionEffects.attack({
                    weapon: true, skill: SkillType.Weapon, trait: TraitType.Speed, skillBonus: 0,
                    hit: [ ActionEffects.dealWeaponDamage() ]
                }),
                ActionEffects.addMovement()
            ]
        },
        {
            id: 'skirmisher-action-2',
            name: 'Harrying Strike',
            prerequisites: [ ActionPrerequisites.meleeWeapon() ],
            parameters: [
                ActionWeaponParameters.melee(),
                ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
            ],
            effects: [
                ActionEffects.attack({
                    weapon: true, skill: SkillType.Weapon, trait: TraitType.Speed, skillBonus: 0,
                    hit: [
                        ActionEffects.dealWeaponDamage(),
                        ActionEffects.forceMovement(MovementType.Push, 2)
                    ]
                })
            ]
        },
        {
            id: 'skirmisher-action-3',
            name: 'Reflexive Cut',
            prerequisites: [ ActionPrerequisites.meleeWeapon() ],
            parameters: [
                ActionWeaponParameters.melee(),
                ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
            ],
            effects: [
                ActionEffects.attack({
                    weapon: true, skill: SkillType.Reactions, trait: TraitType.Speed, skillBonus: 0,
                    hit: [ ActionEffects.dealWeaponDamage(1) ]
                })
            ]
        },
        {
            id: 'skirmisher-action-4',
            name: 'Fall Back',
            prerequisites: [],
            parameters: [ ActionTargetParameters.self() ],
            effects: [
                ActionEffects.addMovement(),
                ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Speed, 4, TraitType.Speed))
            ]
        },
        {
            id: 'skirmisher-action-5',
            name: 'Seize the Initiative',
            prerequisites: [],
            parameters: [ ActionTargetParameters.self() ],
            effects: [
                ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Speed, 5, SkillType.Reactions)),
                ActionEffects.takeAnotherAction(true)
            ]
        },
        {
            id: 'skirmisher-action-6',
            name: 'Running Skirmish',
            prerequisites: [ ActionPrerequisites.meleeWeapon() ],
            parameters: [
                ActionWeaponParameters.melee(),
                ActionTargetParameters.weapon(ActionTargetType.Enemies, 2, 0)
            ],
            effects: [
                ActionEffects.attack({
                    weapon: true, skill: SkillType.Weapon, trait: TraitType.Speed, skillBonus: -2,
                    hit: [ ActionEffects.dealWeaponDamage() ]
                }),
                ActionEffects.addMovement()
            ]
        }
    ]
}
```

Note `Reflexive Cut` deliberately attacks with `SkillType.Reactions`. The Thief already does this
(`thief-action-1` in `src/data/packs/skullduggery.ts`), so the pattern is proven.

---

## 2. New pack — **Hell to Pay** (`pack-hell-to-pay`)

Your `tasks.md` sketches an "Evil" pack: Shadowborn as a hero, a Demon, a swarm of imps, and a
Necromancer split into necromancy proper and a "misc creepy" sibling. This is that pack. It needs no
engine work at all, which makes it the cheapest large addition available.

**Naming:** "Hell to Pay" matches the idiom register of *Cold Blood* and *Magic in a Glass*.
Alternatives if you want something less flip: **A Deal in the Dark**, **The Pit**.

New file `src/data/packs/hell.ts`, modelled on the existing pack files, and registered in
`PackLogic.getExpansionPacks()`. The cards below go into its arrays; every array on `PackModel` must
be present even when empty.

```ts
export const hell = (): PackModel => ({
    id: 'pack-hell-to-pay',
    name: 'Hell to Pay',
    description: 'Power is available on generous terms. The repayment schedule is the problem.',
    species: [ /* 2a */ ],
    roles: [ /* 2b, 2c */ ],
    backgrounds: [ /* 2d */ ],
    items: [],
    potions: [],
    structures: []
});
```

### 2a. Shadowborn type — hero species

Shadowborn already exists as a **monster** species, in the `species` array of
`src/data/packs/core.ts`. `tasks.md` proposes it as a hero.

We should create a similar demonic-sounding hero species.

~~**Built as `Cambion`.**~~ Structured as the Deva's mirror — the same 3 starting / 4 features /
2 actions shape, with a Corruption damage bonus where the Deva has Corruption resistance, and Fire
resistance for the infernal half. Scores 5. The monster Shadowborn is untouched.

### 2b. Warlock — role

Power bought with the caster's own health. `Strike the Bargain` is the signature: it inflicts a wound
on the caster and buys a Corruption damage bonus in exchange.

```ts
{
    id: 'role-warlock',
    name: 'Warlock',
    description: 'Warlocks draw on a bargain they cannot break, and pay for every casting in their own blood.',
    startingFeatures: [
        FeatureLogic.createTraitFeature('warlock-start-1', TraitType.Resolve, 1),
        FeatureLogic.createSkillFeature('warlock-start-2', SkillType.Spellcasting, 2),
        FeatureLogic.createProficiencyFeature('warlock-start-3', ItemProficiencyType.Implements),
        FeatureLogic.createDamageCategoryBonusFeature('warlock-start-4', DamageCategoryType.Corruption, 1)
    ],
    features: [
        FeatureLogic.createTraitFeature('warlock-feature-1', TraitType.Resolve, 1),
        FeatureLogic.createSkillFeature('warlock-feature-2', SkillType.Spellcasting, 2),
        FeatureLogic.createDamageBonusFeature('warlock-feature-3', DamageType.Decay, 1),
        FeatureLogic.createDamageCategoryResistFeature('warlock-feature-4', DamageCategoryType.Corruption, 1)
    ],
    actions: [
        {
            id: 'warlock-action-1',
            name: 'Eldritch Lash',
            prerequisites: [ ActionPrerequisites.implement() ],
            parameters: [ ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5) ],
            effects: [
                ActionEffects.attack({
                    weapon: false, skill: SkillType.Spellcasting, trait: TraitType.Resolve, skillBonus: 0,
                    hit: [ ActionEffects.dealDamage(DamageType.Decay, 3) ]
                })
            ]
        },
        {
            id: 'warlock-action-2',
            name: 'Strike the Bargain',
            prerequisites: [ ActionPrerequisites.implement() ],
            parameters: [ ActionTargetParameters.self() ],
            effects: [
                ActionEffects.inflictWounds(1),
                ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 6, DamageCategoryType.Corruption))
            ]
        },
        {
            id: 'warlock-action-3',
            name: 'Withering Hex',
            prerequisites: [ ActionPrerequisites.implement() ],
            parameters: [ ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5) ],
            effects: [
                ActionEffects.attack({
                    weapon: false, skill: SkillType.Spellcasting, trait: TraitType.Resolve, skillBonus: 0,
                    hit: [
                        ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 4, TraitType.Endurance)),
                        ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Resolve, 3, DamageType.Decay))
                    ]
                })
            ]
        },
        {
            id: 'warlock-action-4',
            name: 'Blood Price',
            prerequisites: [ ActionPrerequisites.implement(), ActionPrerequisites.damage() ],
            parameters: [ ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5) ],
            effects: [ ActionEffects.transferCondition() ]
        },
        {
            id: 'warlock-action-5',
            name: 'Dread Aspect',
            prerequisites: [],
            parameters: [ ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 2) ],
            effects: [
                ActionEffects.attack({
                    weapon: false, skill: SkillType.Spellcasting, trait: TraitType.Resolve, skillBonus: -2,
                    hit: [ ActionEffects.stun() ]
                })
            ]
        }
    ]
}
```

### 2c. Lifestealer — role

The "misc creepy" half of the Necromancer split from `tasks.md`. Where the Necromancer raises the
dead, the Lifestealer takes from the living: every one of its attacks converts enemy loss into its
own gain. Not written out here; build it to this shape:

| Slot | Content |
| --- | --- |
| Starting | Resolve +1, Spellcasting +2, Implements, Decay damage bonus +1 |
| Features | Resolve +1, Spellcasting +2, Endurance +1, Corruption resistance +1 |
| Action 1 | *Siphon* — Spellcasting vs Endurance, burst 5, `dealDamage(Decay, 3)` then `toSelf([ healDamage(4) ])` |
| Action 2 | *Leech Vitality* — attack, on hit `inflictWounds(1)` plus `toSelf([ healWounds(1) ])` |
| Action 3 | *Rot* — on hit, `AutoDamageCondition(Endurance, 4, Decay)` |
| Action 4 | *Sap Will* — on hit, `TraitPenaltyCondition(Resolve, 4, Resolve)` |
| Action 5 | *Feast* — prerequisite `wound()`; heals the caster in proportion to damage dealt |

The self-heal-on-damage pattern is the identity — keep it on at least three of the five actions or
it reads as a second Necromancer.

~~**Built, with one correction.**~~ The warning above points at the right risk but the wrong card:
the shipped Necromancer is *already* the life-drain role — 6 of its 7 actions are damage or wound
transfer, and only `Raise the Dead` is necromancy. Siphon, Leech Vitality and Feast as tabled would
have reproduced `Transfer Damage`, `Transfer Wounds` and `Grave Bolt` almost verbatim. The signature
is instead a **paired steal**: `Sap Will` and `Drain Vigour` put a trait penalty on the target and
the matching bonus on the caster via `toSelf`, which nothing else in the game does. Self-heal stays
on three of the five actions. Scores 6.

### 2d. Cultist — background

```ts
{
    id: 'background-cultist',
    name: 'Cultist',
    description: 'A devotee of something that should not be named, and certainly should not be worshipped.',
    startingFeatures: [
        FeatureLogic.createTraitFeature('cultist-start-1', TraitType.Resolve, 1),
        FeatureLogic.createDamageCategoryResistFeature('cultist-start-2', DamageCategoryType.Corruption, 1)
    ],
    features: [
        FeatureLogic.createTraitFeature('cultist-feature-1', TraitType.Resolve, 1),
        FeatureLogic.createDamageCategoryResistFeature('cultist-feature-2', DamageCategoryType.Corruption, 1)
    ],
    actions: [
        {
            id: 'cultist-action-1',
            name: 'Fervent Chant',
            prerequisites: [],
            parameters: [ ActionTargetParameters.burst(ActionTargetType.Allies, 1, 3) ],
            effects: [
                ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Resolve, 4, DamageCategoryType.Corruption))
            ]
        },
        {
            id: 'cultist-action-2',
            name: 'Willing Sacrifice',
            prerequisites: [],
            parameters: [ ActionTargetParameters.adjacent(ActionTargetType.Allies, 1) ],
            effects: [
                ActionEffects.toSelf([ ActionEffects.inflictWounds(1) ]),
                ActionEffects.healDamage(4)
            ]
        },
        {
            id: 'cultist-action-3',
            name: 'Whispered Doubt',
            prerequisites: [],
            parameters: [ ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 4) ],
            effects: [
                ActionEffects.attack({
                    weapon: false, skill: SkillType.Presence, trait: TraitType.Resolve, skillBonus: 0,
                    hit: [ ActionEffects.addCondition(ConditionLogic.createSkillCategoryPenaltyCondition(TraitType.Resolve, 4, SkillCategoryType.Mental)) ]
                })
            ]
        }
    ]
}
```

An earlier draft used a `Number.MAX_VALUE` ally burst and `healWounds(1)` and scored **5**, one over
the background band. The version above scores **4**. Worth knowing which levers moved it.

### 2e. Monsters (lower priority, listed for completeness)

Fiend (size 2), Imp Swarm (`Swarm` quirk, `Drone`-adjacent), Hellhound (`Beast`, Fire).

~~**All three built.**~~ Note the Imp Swarm carries `Swarm` only: `Drone` means *dies to any damage*
and is pushed onto summoned creatures at runtime, so baking it into a species would make it
evaporate on the first hit.

### 2f. Tormentor — role (added, not in the original spec)

The pack as specified was two Implement-and-Spellcasting Corruption casters. The Tormentor is the
melee counterweight: Endurance and Brawl, Military weapons and Heavy armour, and a `MovementPenalty`
aura. Its identity is that nobody leaves — `forceMovement(Pull)` to drag a target in, movement
penalties to pin them, and `disarm`, which had only two users in the whole game. Scores 6.

**`commandMove` does not work as a compulsion; `commandAction` does.** `commandMove` gives the target
movement and then runs *its own* movement intents, so used on an enemy it helps them reposition —
both existing users target allies, and that is why. `commandAction` is built differently: it passes
an invert-targets flag, so on an enemy it turns them against their own side (the Naga's `Beguiling
Gaze` already does this). For the Charmer sketch in section 3, compelling an enemy to **act** works;
compelling one to **move** does not.

---

## 3. Top-ups for existing packs

Ranked by how badly the pack needs them.

**Status: no actionable work left here.** The five monsterless packs were closed by Spec 11 Part A;
Cold Blood's two monsters are built. Everything else in this section is deferred, each with its
reason recorded below — the Venomblade and Charmer for overlapping the Assassin and the Presence
backgrounds, the Elements species for being four cards where the gap is cosmetic, and the
Beastmaster and Houndmaster for overlapping the Druid. Three of the four are blocked on finding a
distinct identity rather than on effort.

### Cold Blood (`pack-cold-blood`) — was 3 cards, now 5

The thinnest pack in the game, with no role, no background, no structure, no item. It reads as
unfinished. Add:

- **Venomblade** (role) — **deferred; needs a distinct identity first.** As sketched — Weapon +
  Stealth, Poison damage bonus, `AutoDamageCondition` on hit — this *is* the Assassin, whose
  `Poison Strike` already does weapon damage plus Poison plus an `AutoDamageCondition` on a
  Stealth-and-Weapon card with a Poison bonus. A first attempt traded Stealth for Endurance and cut
  the burst damage; that still read as the same card, because both remain melee weapon users whose
  strikes add poison. Separating them means changing what poison *does* on this card, not which
  stats carry it. The most promising unclaimed ground: **no card in the game has a Poison aura**
  (there are 14 damage auras — Decay, Fire, Cold, Light, Psychic, Edged — and no Poison), which
  would make proximity the attack, with strikes that apply Endurance penalties and Poison
  vulnerability rather than poison damage. The Assassin then kills with poison; the Venomblade
  disables with it.
- **Charmer** (background) — **deferred; the Presence lane is full.** Every action in a first
  attempt was already owned: a `commandAction` charm is the Commander's `Direct the Attack`, an
  enemy penalty is the Noble's `Dishearten` and the Mountebank's `Jinx`, and an ally buff is the
  Bard's and the Noble's. Presence-plus-buff-plus-debuff is the most crowded lane in the background
  list — Noble, Commander, Bard and Mountebank all sit in it. If this card is revived it needs a
  mechanism none of them use. Free ground among backgrounds: **no background uses `weapondamage`,
  `disarm`, `createTerrain` or `summon`** — backgrounds never touch weapons at all. Note also that
  `commandMove` does not work on an enemy (see section 2f).
- ~~**Basilisk**, **Lindworm** (monsters). Medusa's petrifying-gaze pattern is already in the base
  monster file and can be adapted.~~ **Both built.** The Basilisk adapts the gaze as a movement and
  Speed penalty rather than Medusa's all-traits version; the Lindworm is the size 2 physical threat
  the pack lacked. Cold Blood is now 5 cards, and enabling it adds 4 monsters rather than 2. The
  Venomblade and Charmer above remain outstanding.

### The Elements (`pack-elements`) — no playable species — **deferred**

Four new species in one go is more than this gap warrants; the pack is playable today through the
Elementalist and Sorcerer, and the missing piece is flavour rather than function. Deferred as a set
— if it is revived, consider building one and playing it before committing to all four.

A pack described as "Become the master of the four elements" with no elemental species. The four
elementals exist as monsters only. Add hero counterparts:

| Species | Damage bonus | Resistance | Signature action |
| --- | --- | --- | --- |
| **Emberborn** | Fire +1 | Fire +1 | burst Fire damage |
| **Stoneborn** | Impact +1 | Physical +1 | `createTerrain(Obstructed)` — already implemented |
| **Tideborn** | Cold +1 | Cold +1 | `forceMovement(Pull, 2)` |
| **Stormborn** | Electricity +1 | Electricity +1 | multi-target Electricity chain |

Each at 3 starting features / 3–4 features / 2–3 actions to land in the 5–6 species band. Note
Stoneborn overlaps the Geomancer; give it the durability angle rather than the terrain-control one if
that reads as too close.

### The Menagerie (`pack-menagerie`) — no roles or backgrounds — **deferred**

A beast pack with no way to play a beast-handler.

- **Beastmaster** (role) — `ActionEffects.summon(SummonType.Beast)` already exists and currently has
  very few users. Build the role around summoning and commanding.
- **Houndmaster** (background) — `commandMove` on a summoned ally.

**Deferred: both encroach on the Druid.** The Druid (The Fae Realm) already owns this ground — its
`Animal Companion` *is* `summon(SummonType.Beast)`, which is the whole basis of the Beastmaster, and
a background commanding a summoned beast sits in the same lane. `summon` has only three users in the
game precisely because it is a narrow mechanic, and the Druid holds the beast half of it. Reviving
these means finding a beast-handler identity that is not summoning — or accepting the overlap
deliberately.

### ~~The five monsterless packs~~ — **already done**

Codex Arcanum, Guile and Cunning, The Workshop, Power and Glory and Magic in a Glass add zero
monsters, so switching them on never changes what you fight. One or two each closes the gap:
Animated Object (Arcanum), Doppelganger (Guile), Automaton (Workshop), Apostate (Power and Glory).

Spec 11 Part A closed this: all five now carry exactly two monsters — Animated Object and Arcane
Aberration, Doppelganger and Cutthroat, Automaton and Powder Keg, Apostate and Inquisitor, Mutant
and Homunculus. Nothing left to do here.

---

## While you are in these files

**Pixie should not be size 0.** Do not try it. `getCombatantSquares` computes
`right = left + size - 1`, so size 0 yields an empty square list and the combatant occupies nothing.
Small creatures need a `Small` quirk with explicit rules, not a size value — treat that as its own
spec if you want it.

## Acceptance criteria

1. Every new card appears in the right array of the right pack literal.
2. Every new card scores inside its band (species 5–6, role 5–6, background 3–4).
3. `hell()` is registered in `PackLogic.getExpansionPacks()`; the base Skirmisher is in `core()`.
4. With no packs enabled, the new base Skirmisher appears in hero creation and nothing else does.
5. With Hell to Pay enabled, `PackLogic.getPackCardCount('pack-hell-to-pay')` returns the expected total.
6. `npm run lint` and `tsc --noEmit` clean.
