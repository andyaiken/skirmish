# Bugs

## Highlighted Squares
* If you select a 'square' parameter, and move, the origin candidate squares do not move
* Presumably this is the same for other parameter types

-----------------------------------------------------------------------------------------

# Priority

-----------------------------------------------------------------------------------------

# Improvements / Enhancements

## Character Sheet
* Show ranks as filled circles
* Show the XP required as a gauge
* Make it so that we can see a hero character sheet without having to level up

## Magic Items
* Allow items to be compared to show which is better
* When adding a feature, collate similar features

## Features
* Mountebank and Pixie should have an attack redirection aura

## Map Types
* Street
* Building interior

## Encounters
* Undo movement
* Make monsters take their actions automatically, in 1s intervals

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

## Potions
* Could be found on the map (as a loot pile)
* An extra section in the items page - 'Potions'
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
* Present on the map - 1x2 squares
* Counts as a wall: blocks LOS and can be broken down
* Open a door for 1 movement point
  * When opened, removed from the map

## Keys
* Another sort of consumable item, like a potion
* Make doors lockable
* Destroyed when used to lock / unlock
* Thieves can pick locks

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
* Artificer / Technomage / Inventor
  * Create potion
  * Shocking grasp (electrical damage, stun)
  * Electrical discharge (all adjacent combatants)
  * Supercharge (buff nearby ally's damage output)
  * Acid spray
* Gladiator 
  * Large weapons
  * Showmanship
* Cleric
* Paladin / warpriest
* Ravager

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
* Gnoll
* Elemental:
  * Water Elemental
* Undead:
  * Wraith
* Demon
* Beasts:
  * Basilisk / medusa / gorgon
  * Lion / tiger / panther etc
  * Wolf
  * Crocodile
  * Giant rat
  * Dragon
  * Kruthik / Ankheg
* Ooze

## Styling
* Favicon
* Dark mode
* Action animations (fireball etc)

## Sound
* Add sound effects
* Add music

-----------------------------------------------------------------------------------------

# Tech Debt

* Make the layout responsive for phones
* Convert to functional components
* Use hooks
