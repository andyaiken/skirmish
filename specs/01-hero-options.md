# Spec 01 — Hero options: new base role, new pack, and pack top-ups

**Type:** content (data only — no engine changes)
**Size:** medium
**Depends on:** Spec 00 for the Skirmisher role only. Everything else here is independent.

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
import { RoleData } from './src/data/role-data';
RoleData.getList().forEach(r => console.log(r.name, GameLogic.getRoleStrength(r)));
```

Run with `npx tsx`. The three cards written out in full below have been scored and land at
Skirmisher 6, Warlock 6, Cultist 4.

**Conventions.** Follow the existing files exactly:

- IDs are `role-<name>`, `species-<name>`, `background-<name>`
- Feature IDs are `<name>-start-N` and `<name>-feature-N`; action IDs are `<name>-action-N`
- Every card must be added to its file's `getList()` — it will silently not exist otherwise
- Base cards use `packID: ''`; pack cards use `packID: PackData.<fn>().id`
- Descriptions are one sentence, present tense, no trailing full stop inside the card copy where the
  existing entries omit it (check neighbours — the file is consistent)

**Shape guidance.** Roles run 2–5 starting features, 2–7 features, 3–7 actions. Backgrounds run
1–7 starting features and 3–4 actions and should feel like a modifier on a role, not a second role.

---

## 1. Skirmisher — new **base** role

**Why base rather than a pack:** Reactions is the only one of the seven skills that no role builds
on. Once Spec 00 lands, Reactions governs initiative and there should be a role that owns it. The
game is called Skirmish; it should have a skirmisher.

**Identity:** acts first, hits, and is somewhere else by the time the reply lands. Its actions
mostly end in `addMovement` or push the target away, so it is the answer to the +4 disengagement
penalty in `getMoveCost`.

Add to `src/data/role-data.ts` and register in `RoleData.getList()`.

```ts
static skirmisher = (): RoleModel => ({
    id: 'role-skirmisher',
    name: 'Skirmisher',
    packID: '',
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
});
```

Note `Reflexive Cut` deliberately attacks with `SkillType.Reactions`. The Thief already does this
(`thief-action`, `background-data.ts:750`), so the pattern is proven.

---

## 2. New pack — **Hell to Pay** (`pack-11`)

Your `tasks.md` sketches an "Evil" pack: Shadowborn as a hero, a Demon, a swarm of imps, and a
Necromancer split into necromancy proper and a "misc creepy" sibling. This is that pack. It needs no
engine work at all, which makes it the cheapest large addition available.

**Naming:** "Hell to Pay" matches the idiom register of *Cold Blood* and *Magic in a Glass*.
Alternatives if you want something less flip: **A Deal in the Dark**, **The Pit**.

Add to `src/data/pack-data.ts` and register in `PackData.getList()`:

```ts
static hell = (): PackModel => ({
    id: 'pack-11',
    name: 'Hell to Pay',
    description: 'Power is available on generous terms. The repayment schedule is the problem.'
});
```

### 2a. Shadowborn — hero species

Shadowborn already exists as a **monster** species (`monster-species-data.ts`). `tasks.md` proposes
it as a hero. Two options:

- **Promote:** move it to `hero-species-data.ts`, change `type` to `CombatantType.Hero`, set
  `packID: PackData.hell().id`, and remove it from the monster list. Cleanest, but it removes a base
  monster from every existing game, so the base monster deck drops from 9 to 8.
- **Duplicate:** keep the monster and add a hero version with distinct IDs
  (`species-shadowborn-hero`). Safer for existing saves.

**Recommendation: duplicate.** The base monster deck is only nine cards and should not shrink, and
the two versions can diverge — the hero one leans on the pact/corruption theme rather than raw
demonic stats.

### 2b. Warlock — role

Power bought with the caster's own health. `Strike the Bargain` is the signature: it inflicts a wound
on the caster and buys a Corruption damage bonus in exchange.

```ts
static warlock = (): RoleModel => ({
    id: 'role-warlock',
    name: 'Warlock',
    packID: PackData.hell().id,
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
});
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

### 2d. Cultist — background

```ts
static cultist = (): BackgroundModel => ({
    id: 'background-cultist',
    name: 'Cultist',
    packID: PackData.hell().id,
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
});
```

An earlier draft used a `Number.MAX_VALUE` ally burst and `healWounds(1)` and scored **5**, one over
the background band. The version above scores **4**. Worth knowing which levers moved it.

### 2e. Monsters (lower priority, listed for completeness)

Fiend (size 2), Imp Swarm (`Swarm` quirk, `Drone`-adjacent), Hellhound (`Beast`, Fire).

---

## 3. Top-ups for existing packs

Ranked by how badly the pack needs them.

### Cold Blood (`pack-10`) — currently 3 cards

The thinnest pack in the game, with no role, no background, no structure, no item. It reads as
unfinished. Add:

- **Venomblade** (role) — Weapon + Stealth, Poison damage bonus, `AutoDamageCondition` on hit.
  Poison is under-used by heroes: no hero species deals it and only the Assassin builds on it.
- **Charmer** (background) — Presence-based; `commandAction` and `commandMove` are already
  implemented effects and nothing in the game uses them heavily. A snake-charmer background that
  compels an enemy to move or act is a genuinely novel card built entirely from existing parts.
- **Basilisk**, **Lindworm** (monsters). Medusa's petrifying-gaze pattern is already in the base
  monster file and can be adapted.

### The Elements (`pack-03`) — no playable species

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

### The Menagerie (`pack-04`) — no roles or backgrounds

A beast pack with no way to play a beast-handler.

- **Beastmaster** (role) — `ActionEffects.summon(SummonType.Beast)` already exists and currently has
  very few users. Build the role around summoning and commanding.
- **Houndmaster** (background) — `commandMove` on a summoned ally.

### The five monsterless packs

Codex Arcanum, Guile and Cunning, The Workshop, Power and Glory and Magic in a Glass add zero
monsters, so switching them on never changes what you fight. One or two each closes the gap:
Animated Object (Arcanum), Doppelganger (Guile), Automaton (Workshop), the Fallen (Power and Glory).

---

## Free wins while you are in these files

**Minotaur should be size 2.** Every hero species is currently size 1, including one explicitly
described as a muscular bull-headed humanoid. `EncounterLogic.getCombatantSquares`,
`getCombatantAuraSquares`, `getMoveCost` and the placement loop in `encounter-generator.ts:198`
already handle multi-square combatants — the monsters use it. Setting `size: 2` on the Minotaur
should work with no engine change, but test hero placement and the movement UI, since no *hero* has
ever been larger than one square.

**Pixie should not be size 0.** Do not try it. `getCombatantSquares` computes
`right = left + size - 1`, so size 0 yields an empty square list and the combatant occupies nothing.
Small creatures need a `Small` quirk with explicit rules, not a size value — treat that as its own
spec if you want it.

## Acceptance criteria

1. Every new card appears in its file's `getList()`.
2. Every new card scores inside its band (species 5–6, role 5–6, background 3–4).
3. Pack cards carry the correct `packID`; base cards carry `''`.
4. With no packs enabled, the new base Skirmisher appears in hero creation and nothing else does.
5. With Hell to Pay enabled, `PackLogic.getPackCardCount('pack-11')` returns the expected total.
6. `npm run lint` and `tsc --noEmit` clean.
