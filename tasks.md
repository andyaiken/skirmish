# Bugs

## Highlighted Squares
* If you select a 'square' parameter, and move, the origin candidate squares do not move
* Presumably this is the same for other parameter types

-----------------------------------------------------------------------------------------

# Priority

## Character Sheet
* Make it so that we can see a hero character sheet without having to level up

## Magic items
* When buying / in items list, make clear which heroes can equip this item / could equip but the slot is currently used

## Encounters
* When you don’t win an encounter, save its state so you can try again from that point with a new team

-----------------------------------------------------------------------------------------

# Improvements / Enhancements

## Character Sheet
* Show ranks as filled circles
* Show the XP required as a gauge

## Features
* Mountebank and Pixie should have an attack redirection aura

## Map Types
* Street
* Building interior

## Encounters
* Undo movement

## Turn Log
* Indentation
* Colours
* Highlighting names, values

-----------------------------------------------------------------------------------------

# New Features

## Water / Ice
* Squares of water / ice would be difficult terrain
* Standing in water gives resistance to fire damage
* Dealing poison / acid / electricity damage to a target in water deals the same damage to any combatant in adjacent water
* Dealing cold damage to a target on a water square turns all adjacent water squares into ice
* Dealing fire damage to a target on an ice square turns all adjacent ice squares into water

## Chests
* Like a loot pile

## Potions
* Could be found on the map (as a loot pile)
* An extra section in the items page
* Drink
  * 2 movement points
  * Then destroyed
  * Has effects:
    * Health (heals damage and wounds)
    * Luck (grants skill bonuses)
    * Power (grants damage bonuses)
    * Resistance (grants damage resistances)
* Buy for 50 money

## Doors
* Present on the map - 2 squares wide
* Can be open / closed
  * Open / close a door for 1 movement point
  * When closed, blocks LOS
* Can be broken down
  * Counts as a wall

## Keys
* Another sort of consumable item
* Make doors / chests lockable
* Destroyed when used to lock / unlock

## Traps
* Types of trap:
  * Pit traps
  * Fire traps
  * Dart traps
  * Poison dart traps
  * Traps on chests
* Traps should be present on the map initially
* Traps should have a set Hidden score
* Gnome, Thief should be able to set / disable traps

## Lighting
* General light level
* Sources of light
* Species with darkvision

## Victory Conditions
* Get a certain number of heroes to a specific area and stay there for a certain number of rounds
* Defeat a specific opponent within a certain number of rounds

## Ideas for Roles / Backgrounds
* Artificer / Technomage
  * Create potion
  * Shocking grasp (electrical damage, stun)
  * Electrical dischange (area effect)
  * Supercharge (buff nearby ally's damage output)
* Gladiator 
  * Large weapons
  * Showmanship
* Cleric
* Centurion
* Paladin / warpriest

## Ideas for Species
* Small:
  * Pixie, Gnome, Goblin, Scarab
* Quirks:
  * Swarm / amorphous / ooze
    * Takes half damage from physical damage
  * Insubstantial / phasing / ghostly
    * Takes half damage from physical damage
    * Move through / see through walls
    * No movement penalty for obstructed terrain
  * Aquatic
    * No movement penalty for water terrain
* Kobold
* Ogre
* Giant
* Gnoll
* Elemental:
  * Water Elemental
* Undead:
  * Wraith
* Demon
* Beasts:
  * Basilisk / medusa / gorgon
  * Lion / tiger / panther etc
  * Crocodile
  * Giant rat
  * Dragon
  * Kruthik / Ankheg
* Ooze

## Styling
* Dark mode
* Action animations (fireball etc)

## Sound
* Add sound effects
* Add music

-----------------------------------------------------------------------------------------

# Tech Debt

* Convert to functional components
* Use hooks
