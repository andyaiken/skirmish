### Gladiator (role)

Large weapons and showmanship. The design hook is that showmanship should be
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

The Ravager gets **stronger as the fight goes badly**. Build every action with a `ActionPrerequisites.wound()` or `damage()` prerequisite, so the card is weak at full health and frightening at one wound from unconsciousness.

### Outrider (role)

Fills the **Perception** gap. Across all 23 existing roles, Perception is referenced twice; the Ranger is the only role with any claim on it, and its identity is ranged weapons, not scouting.

| Slot | Content |
| --- | --- |
| Starting | Endurance +1, Perception +2, Weapon +2, RangedWeapons, LightArmor |
| Features | Endurance +1, Perception +2, Speed +1, Piercing +1 |
| Actions | *Survey* (`ActionEffects.scan()` plus a Perception bonus condition), *Mark the Ground* (reveals hidden enemies and traps in a burst — `ActionEffects.reveal()`), *Ranging Shot* (ranged attack at extended radius), *Read the Signs* (self: Perception bonus and movement bonus), *Cover the Retreat* (ally-targeted movement bonus) |

Target 5–6 on `getRoleStrength`.

### Monsters

**Ogre** (`tasks.md`, size 2, Impact, LargeWeapons), **Pit Hound** (`Beast`, pack fighter),
**Wisent** (`Beast`, size 2, charge attack using `forceMovement(TowardsTarget)`).
**Ghoul** — `Undead`, paralysis via `MovementPenaltyCondition` at high rank.
**Lich** — see Part C. This is the pack that most obviously wants a designed boss.
**Panther**, **Lion**. All `Beast`, high Speed and Stealth.
**Redcap** — `Beast`-adjacent, Edged damage, gets stronger after a kill.
Burrower (`Beast`, size 2, emerges from Obstructed squares)
Mire Hulk (`Beast`, size 2, Poison, ignores water penalties)
Stalking Cat (`Beast`, high Stealth — `tasks.md` asks for lion/tiger/panther).

### Items

**Cestus** — `ItemProficiencyType.None`, `ItemLocationType.Hand`, a weapon with low Impact damage.
The point is that it is the first item a Brawl character has any reason to hold. Consider whether
Brawl attacks should be able to use it: `ActionEffects.attack` takes `weapon: boolean`, and Brawl
actions currently pass `weapon: false`, so a cestus would need either its own actions or a Brawl
proficiency to be meaningful. **Decide this before building it** — it is the one piece of this pack
that might need engine support.

**Manica** — `ItemLocationType.Hand`, armour-like, granting a Physical damage resistance feature.
