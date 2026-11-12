# Encounters

An encounter is a turn-based battle between your heroes and the region's monsters. The map is in the center; the combatant list, status panels, and controls may be arranged around it differently depending on your screen. Select a token to inspect that combatant. The toolbar includes map controls, retreat, and Help.

## Quick turn guide

At the start of a round, choose **Roll Initiative**. Combatants roll using Reactions; the highest result acts first. When a hero's turn comes around:

1. Check the hero's status and movement points in the hero controls.
2. Move if you want to, using the Movement control. You can move before or after taking an action.
3. Choose an available action card in the row below the map. A disabled card has a requirement you do not currently meet.
4. If asked, choose a weapon, target, or map square, then choose **Go** to perform the action.
5. Spend any remaining movement points, then choose **End My Turn**.

You normally get one action and a pool of movement points each turn. If you are stunned, you cannot act and must skip your turn. Monsters choose their own actions and move automatically; the game resolves their turns for you.

## The map and visibility

Hero tokens use their hero colors; monsters are dark tokens. Select a token to view its information. Yellow tokens mark treasure. A translucent circle around a token shows its aura.

White squares are ordinary ground, gray squares are **Obstructed**, blue squares are **Water**, and pale blue squares are **Ice**. Obstructed ground and water cost extra movement to enter. Ice does not. Some actions can change terrain.

Water has additional effects: it shelters occupants from Fire damage, conducts Acid, Electricity, and Poison damage to others standing in the same water, and freezes into Ice when Cold damage is dealt to someone standing in it. Fire damage to a combatant on Ice melts that Ice into Water. **Aquatic** combatants are in the water rather than sheltered by it.

Red diamonds mark traps. A trap is visible only to a combatant whose Senses meet its Hidden score; the side that placed it can always see it. Moving onto a trap triggers it. A sprung trap is harmless. If your hero has **Disarm Trap**, they can attempt it with Perception; a result of 8 or more removes the trap, while a failed attempt reveals it. Monsters avoid traps they can see.

The map hides areas a combatant cannot see from their current point of view. At the start of a turn, Senses are based on Perception. **Hide** increases Hidden using Stealth; **Scan** increases Senses using Perception. An enemy with a Hidden score higher than your Senses cannot be seen or targeted.

## Movement points

At the start of a turn, a combatant rolls Speed to get movement points. The movement control shows which directions are available and their costs.

- Moving to an adjacent empty square, including diagonally, normally costs 1 point.
- Entering Obstructed ground or Water costs 1 extra point. **Sure-footed** ignores both costs; **Aquatic** ignores the extra cost for Water.
- Leaving a square beside a standing, unstunned opponent costs 4 extra points.
- Being Prone or Hidden doubles movement costs.

Movement points can also be spent to:

- **Inspire** (4): roll Presence; on 8 or higher, allies you can see are no longer Stunned.
- **Scan** (4): roll Perception and add the result to your Senses.
- **Hide** (4): roll Stealth and add the result to your Hidden score.
- **Drink a potion** (2): drink one you carry or give it to an adjacent ally.
- **Pick up or equip/unequip an item** (1): manage an item beside you or in your inventory.
- **Drop an item** (0): drop an equipped or carried item.

## Actions

At the start of a hero's turn, the game draws three action cards from their deck. Scrolls you carry are added as extra action cards. Select a card to read its details; the game will ask for any required weapon, target, or square before you can choose **Go**. A card can be disabled when you do not meet its prerequisites.

Every combatant also has **standard** cards, shown after the others. They are always in hand, but appear only while you can use them. **Unarmed Attack** needs a free hand, **Stand Up** needs you to be Prone, and **Dig** needs a wall beside you. Each kind of weapon you have equipped also gives one standard card, and so do implements:

- **Guarded Strike** (military weapons): a Weapon attack that deals weapon damage. Hit or miss, you also gain rank 1 resistance to all damage until your next turn.
- **Heavy Blow** (large weapons): a Weapon attack that deals weapon damage.
- **Nimble Strike** (paired weapons): a Weapon attack at +1 that deals weapon damage.
- **Aimed Shot** (ranged weapons): a Weapon attack at +1 that deals weapon damage.
- **Discharge** (powder weapons): a Weapon attack that deals weapon damage.
- **Focused Bolt** (implements): a Spellcasting attack against an enemy within 10 squares that deals rank 2 Electricity damage.

Two weapons of the same kind share one card, and you choose which of them to use. Weapons of different kinds give a card each. However many implements you have equipped, you get one Focused Bolt. A weapon or implement card appears only if the hero is proficient with that kind of item.

An attack compares the attacker's named skill with the target's named trait. The attacker hits if their roll is higher. If a weapon is required and has an **Unreliable** rank, roll that many dice first; a result of 10 or more means the weapon fails and the attack ends. An action card's text describes its effects. A scroll is consumed when read, whether or not its effect succeeds.

Using an action does not spend your remaining movement points. Some stronghold benefits can let a hero act again or redraw action cards; the benefit card shows when one is available.

## Enemy keywords

Keywords describe special rules or kinds of creatures. The monster's action cards can also refer to its keywords.

- **Beast**: Has no role or background and cannot use items.
- **Mindless**: Has no role or background.
- **Drone**: Dies when it takes damage that gets past its resistances.
- **Undead**: If unconscious at the start of its turn, it rolls Resolve. A result of 10 or more lets it reanimate Prone with one fewer Wound than its Resolve rank; a result of 1 or less kills it.
- **Swarm** or **Amorphous**: Takes half physical damage, rounded down, before damage resistance is applied.
- **Aquatic**: Moves through Water without its extra movement cost, resists Cold damage, and does not get Water's shelter from Fire.
- **Sure-footed**: Ignores the extra movement cost for both Obstructed ground and Water.
- **Plant**: A plant creature. Plant-specific actions may summon or affect plants.
- **Elemental**: An elemental creature. Elemental-specific actions may summon or affect elementals.
- **Small**: Marks a creature as small.
- **Boss**: Marks a creature as a boss.

Plant, Elemental, Small, and Boss do not add a universal movement or damage rule by themselves; check any action that refers to them for its effect.

## Conditions and wounds

Conditions can help or hinder a combatant. Each has a rank and is linked to a Trait. At the start of a turn, beneficial Conditions lose a rank; detrimental Conditions test against their linked Trait and either end or lose a rank. A Condition at rank 0 is removed. Some Conditions are **contagious** and may spread to nearby combatants at the end of the affected combatant's turn.

When damage gets through resistance, it adds to the target's Damage score. The target rolls Endurance; if the roll is lower than their current Damage, they suffer a Wound and their Damage returns to 0. When Wounds reach Resolve, the combatant becomes Unconscious. Another Wound while Unconscious is fatal. An unconscious combatant rolls Resolve at the start of their turn: a result of 1 or less is fatal. An unconscious Undead combatant can reanimate on a result of 10 or more, as described above.

## Dice

A Trait or Skill roll uses a number of ten-sided dice equal to its rank; the highest result is used. Each 10 explodes: roll that die again and add the result, repeating if it rolls another 10. At rank 0, roll one die and halve its result.

## Ending an encounter

Defeat the monsters to win. Each surviving hero who took part gains 1 XP after a victory, and dead heroes are lost. Winning the last encounter in a region takes control of it and gives you its reward and a chance to recruit a hero.

You can retreat from the toolbar. Retreating or losing costs any participating heroes who fell, along with their equipment. Check the confirmation panel before you finish the encounter.
