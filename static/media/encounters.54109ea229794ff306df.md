# Encounters

Encounters take place in rounds

* Each round:
  * Roll reactions to get initiative score
  * Iterate through combatants in initiative order

## A Round

* At start of turn:
  * Set Senses, Hidden, Movement to 0
  * Apply auto-healing effects from conditions / auras
  * Apply auto-damage effects from conditions / auras
  * If unconscious, roll resolve vs 1; on failure, dead
  * If standing or prone
    * Roll Perception to set Senses
    * Roll Speed to set movement points
	  * Apply movement effects from conditions
    * Draw three action cards

* During turn:
  * If you're stunned, you can't do anything
  * If you're not stunned, you can:
    * Combatant uses movement points / takes an action
    * When (action taken and movement points are gone) or (combatant chooses), end turn

* At end of turn:
  * Set Senses, Hidden to 0
  * Iterate through conditions
    * If beneficial, reduce by 1
    * Otherwise, roll trait vs condition rank; on success, reduced to 0, on fail, reduced by 1
    * If condition rank is 0, removed

# Things You Can Do On Your Turn

## Moving

* Move into any adjacent empty square, including diagonals, for 1 movement point
  * If any of the squares you are moving into are obstructed, add 1 movement point
  * If any of the squares you are moving out of is adjacent to a standing opponent, add 4 movement points
  * Apply 'ease movement' effects from auras
  * Apply 'prevent movement' effects from auras
  * If you are prone or hidden, movement point costs are x2

## Using an action

* Select targets (self / allies / enemies, floor squares, wall squares, within range of weapon / implement, cannot target enemies whose Hidden beats your Senses)
* Apply initial effects
* If attack:
  * If requires weapon, and Unreliable weapon, roll Unreliable; if 10 or over, attack ends
  * Otherwise, for each target:
    * Apply pre-attack effects
    * Roll attacker's attack skill vs target's trait
    * Bonus equal to allies adjacent to the target
    * Apply hit / miss effects
    * Apply post-attack effects
* Apply finish effects

## Other options

* **Inspire**: spend 4 movement points, roll Presense; on a result of 8 or higher, any allies you can see are no longer stunned
* **Scan**: spend 4 movement pts, roll Perception, add result to Senses
* **Hide**: spend 4 movement pts, roll Stealth, add result to Hide
* **Stand up**: spend your action
  * When prone: skill ranks are halved
* **Pick up adjacent object**: 1 movement pt
* **Equip / unequip carried object**: 1 movement pt
* **Drop equipped / carried object**: 0 movement pts

---

## Taking damage

* Roll damage rank, add attacker's damage bonus, add attacker's weapon damage bonus, subtract target's damage resistance
  * Apply 'damage vulnerability' / 'damage resistance' effects from auras
  * Add this to the target’s Damage
* If more than 0:
  * Roll target's Endurance; if result less than Damage, reset Damage to 0 and increment Wounds
  * If target's Wounds equals Resolve rank, unconscious; if target's Wounds greater than Resolve rank, dead
    * If dead, removed from the map; equipment lies in the square it fell in

## Healing

* If unconscious and Wounds reduced to below Resolve, prone
