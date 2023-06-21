# Encounters

When you start an encounter, you'll see the screen has split into four sections:

* **In the middle**, you'll see the encounter map.
* **At the top** there is a toolbar that allows you to rotate and zoom the map. It also has buttons that allow you to retreat from the encounter.
* **On the left**, you'll see a list of all the combatants (heroes and monsters) in the encounter.
* **On the right** are the controls for the current combatant. You can control your heroes, but monsters act for themselves.

Encounters take place in rounds. At the beginning of each round, you'll be asked to `Roll Initiative` to set the order in which the combatants (heroes and monsters) will act.

## The Map

The map has a number of tokens on it; heroes are in their own colors, monsters are black. You might sometimes see a yellow token, which is a pile of treasure. You can tap on token to select it, which brings up its information at the bottom of the screen. Some combatants might have an Aura, which is shown as a translucent grey circle around their token.

You'll notice that most floor squares are white, but some are gray - these squares are Obstructed, making them more difficult to move into.

On each combatant's turn, you'll see that the map hides the squares that aren't visible from that combatant's point of view.

## Hero Controls

When it's a hero's turn to act, you'll see the following information:

* The `Stats` tab:
  * **Movement points** - Each round, you get a number of movement points which you can spend to move around the map.
  * **Senses** and **Hidden** - Enemies whose Hidden score beats your Senses score can't be seen, and so can't be attacked.
  * **Damage** and **Wounds** - When you're the target of a successful attack you'll take Damage. Damage can become Wounds, which are much more serious.
  * **Conditions** - During the encounter you might have Conditions applied to you. A Condition might be beneficial or detrimental, and each one is associated with a particular Trait.
* The `Move` tab:
  * This tab allows you to move your hero around the battlefield. If you're beside a pile of treasure, you'll also be able to pick up items here.
* The `Action` tab:
  * This tab allows you to select and perform one of your actions.

At the bottom you'll see an `End Turn` button; when you're finished with this hero's turn, press this to move on to the next combatant.

## Monster Controls

When it's a monster's turn to act, you'll see much less information, because the monster has already decided what they want to do; press the `Go` button at the bottom and they'll do it.

Monsters are similar to heroes in most ways, but you may see a few special keywords:
* **Beast** or **Mindless** - A monster with either of these keywords doesn't have a role or a background.
* **Drone** - A monster with this keyword is particularly easy to kill; they die as soon as they take any damage.
* **Undead** - A monster with this keyword is hard to keep down; if they are unconscious at the start of their turn they have a chance to reanimate.

When the monster has done everything they want to do, the game will move on to the next combatant.

---

# A Turn

## At the start of a turn

* If the combatant is subject to any automatic healing or damage effects from Conditions or Auras, apply them.
* If the combatant is Unconscious, roll their Resolve rank; if the result is 0 or 1, the combatant dies and the next combatant's turn starts.
* If the combatant is not Unconscious:
  * Roll the combatant's Speed rank to set their movement points
  * Roll the combatant's Perception rank to set their Senses score
  * Set the combatant's Hidden score to 0

## During a turn

If you're Stunned, you can't do anything for one round; otherwise, you can use your movement points and take an action.

## At the end of a turn

At the end of a combatant's turn, each Condition applied to them is checked:

* If the Condition is beneficial, its rank is reduced by 1
* Otherwise, the combatant rolls their Trait vs the Conditon's rank:
  * If the combatant rolls beats the Condition, its rank is reduced to 0
  * Otherwise, the Condition's rank is reduced by 1

Any Conditions with a rank of 0 are removed.

---

# Spending Movement Points

## Moving

You can move into any adjacent empty square, including diagonally, for 1 movement point.

* If the square you are moving into is Obstructed, add 1 movement point
* If the square you are moving out of is adjacent to an opponent, add 4 movement points
* If you are Prone or Hidden, double the movement point cost

## Other options

* **Inspire**: Roll your Presense rank; on a result of 8 or higher, any allies you can see are no longer Stunned (4 movement points)
* **Scan**: Roll your Perception rank, and add the result to your Senses score (4 movement points)
* **Hide**: Roll your Stealth rank, and add the result to your Hidden score (4 movement points)
* **Pick Up**: Pick up an adjacent item (1 movement point)
* **Equip / Unequip**: Equip a carried item or unequip an equipped item (1 movement point)
* **Drop**: Drop an equipped or carried item (0 movement points)

---

# Using An Action

When you've selected the action card you want to use, you might have to specify some extra information before you can use it - for example, which weapon you want to use, which enemy you want to hit, which ally you want to heal, or which map square you want to target. Once you've done that, press the `Run this Action` button.

If you've chosen an attack action, this is how it works:
  * If the action requires a weapon, and the weapon you're using has an Unreliable rank, roll that number of dice; if the result is 10 or over, the weapon has not worked, and the attack ends unsuccessfully.
  * The attack will be described as `[Skill] vs [Trait]`; you roll your Skill rank and the target rolls their Trait rank. if your roll beats your target's roll, you hit; apply the attack's effects.

---

# Other Rules

## Dice

Dice rolling happens behind the scenes, but here's the system: When you're asked to roll a Trait or Skill, take a number of 10-sided dice equal to the rank of the Trait or Skill and roll them. The result of the roll is the highest individual die roll.

* If a die rolls a 10, roll it again and add the result; keep going until it doesn't roll a 10.
* If the Trait or Skill has a rank of 0, roll one die and halve the result.

## Dealing Damage

When you deal damage to a target, roll the damage rank and add your damage bonus, then subtract your target's damage resistance.

If this result is 0 or less, no damage has been done; otherwise, add this result to the target's Damage score.

The target then rolls their Endurance rank; if the result is less than their current Damage score, reduce their Damage score to 0 and increase their Wounds score by 1.

## Taking Wounds

If your Wounds score is increased to equal your Resolve rank, you fall Unconscious.

If your Wounds score is increased to greater than your Resolve rank, you die.

## Healing Wounds

If you are Unconscious and your Wounds score is reduced to below your Resolve rank, you immediately regain consciousness and become Prone.
