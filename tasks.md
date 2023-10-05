-----------------------------------------------------------------------------------------

# Bugs

## Highlighted Squares
* If you select a 'square' parameter, and move, the origin candidate squares do not move
  * Presumably this is the same for other parameter types

-----------------------------------------------------------------------------------------

# Priority

-----------------------------------------------------------------------------------------

# Improvements / Enhancements

## Features
* Mountebank, Ninja, Sensei, and Pixie should have a blur aura
  * Affects self
  * When attacked, roll aura rank; 10+ means attack misses

## Encounters
* Undo movement
  * Can't undo movement if you've done anything (taken an action, hidden, etc)
* Drag and drop movement
  * Automatically select the best path

## Turn Log
* Formatting
  * Indentation
  * Colours
  * Highlighting names, values

## Map Types
* Building interior
* Arena

-----------------------------------------------------------------------------------------

# New Features

## Water / Ice
* Squares of water / ice would be difficult terrain
* Standing in water gives resistance to fire damage
* Dealing poison / acid / electricity damage to a target in water deals the same damage to any combatant in adjacent water
* Dealing cold damage to a target on a water square turns all adjacent water squares into ice
* Dealing fire damage to a target on an ice square turns all adjacent ice squares into water

## Doors
* Present on the map - 1x2 squares, horizontally or vertically
* When closed, counts as a wall: blocks LOS and can be broken down
* When beside a door, move tab should allow you to open / close it
  * 1 movement point

## Keys
* Another sort of consumable item, like a potion
* Make doors lockable
  * Thieves can pick locks
* Destroyed when used to lock / unlock

## Traps
* Types of trap:
  * Spike traps (piercing dmg)
  * Fire traps (fire dmg)
  * Poison gas traps (poison dmg)
  * Acid dart traps (acid dmg)
  * Traps on chests
* Traps might be present on the map initially
* Traps should have a set Hidden score
* When set off, a trap should become visible (Hidden = 0)
* Gnome, Thief should be able to disable traps
* Trapper should be able to set traps

## Lighting
* General light level
* Sources of light
* Species with darkvision

## Victory Conditions
* Get a certain number of heroes to a specific area and stay there for a certain number of rounds
* Defeat a specific opponent within a certain number of rounds

## Styling
* Dark mode
* Action animations (fireball etc)

## Sound
* Add sound effects
  * On move
  * On hit
  * On miss
  * On wound
  * On victory
  * On defeat
* Add music

-----------------------------------------------------------------------------------------

# Content Ideas

## Ideas for Packs
* Evil
  * Shadowborn
  * Demon
  * Swarm of imps
* Fae
  * Pixie
  * Arcane archer / venator / bowmage / hexbow
  * Banshee - sonic dmg

## Ideas for Roles / Backgrounds
* Gladiator 
  * Large weapons
  * Showmanship
* Ravager

## Ideas for Species
* Small:
  * Pixie, Gnome, Goblin, Scarab
* Quirks:
  * Insubstantial / phasing / ghostly
    * Takes half damage from physical damage
    * Move through / see through walls
    * No movement penalty for obstructed terrain
  * Aquatic
    * No movement penalty for water terrain
* Kobold
* Ogre
* Demon
* Beasts:
  * Lion / tiger / panther etc
  * Crocodile
  * Dragon
  * Kruthik / Ankheg
* Ooze

## Ideas for Structures
* Structures as irregular polygons

| Structure     | Effect                                                            | Pack    |
|---------------|-------------------------------------------------------------------|---------|
| Shipyard      | Allows you to attack a non-adjacent coastal region                |         |
| XXX           | Add 1 rank in any physical skill to a hero                        |         |
| XXX           | Add 1 rank in any mental skill to a hero                          |         |

* Warehouse
* Bazaar / marketplace
* Vault
* Cartographer
* Engineer
* Laboratory
* Morale buildings:
  * Museum
  * Library
  * Gallery
  * Tavern
  * Theatre
  * Gardens
  * Monument

-----------------------------------------------------------------------------------------

# Tech Debt

* Make the layout responsive for phones
* Convert from CRA to Vite
* Convert to functional components
* Convert to React Native / Electron
* Use hooks

-----------------------------------------------------------------------------------------
