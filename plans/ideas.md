# Improvements / Enhancements

## Encounters
* Undo movement
  * Can't undo movement if you've done anything (taken an action, hidden, etc)
* Drag and drop movement
  * Automatically select the best path to a selected square

# New Features

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

## Blur Aura
* Mountebank, Ninja, Sensei, and Pixie should have a blur aura
* Affects self
* When attacked by someone within the aura, roll aura rank; 10+ means attack misses

## Victory Conditions
* Get a certain number of heroes to a specific area and stay there for a certain number of rounds
* Defeat a specific opponent within a certain number of rounds

## Hero History
* Randomly generated history of a hero
* Shown on the character sheet

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

# Content Ideas

## Ideas for Species
* Small:
  * Pixie, Gnome, Goblin, Scarab
  * Can't be size 0 - that'll mess with grid sizing - needs to be a quirk
  * Probably just a display effect, rather than a mechanical effect
* Quirks:
  * Insubstantial / phasing / ghostly
    * Takes half damage from physical damage
    * Move through / see through walls
    * No movement penalty for obstructed terrain
* Kobold
* Ogre
* Demon
* Beasts:
  * Lion / tiger / panther etc
  * Dragon
  * Kruthik / Ankheg
* Ooze

## Ideas for Structures

| Structure     | Effect                                                            | Pack    |
|---------------|-------------------------------------------------------------------|---------|
| XXX           | Add 1 rank in any physical skill to a hero                        |         |
| XXX           | Add 1 rank in any mental skill to a hero                          |         |
| Trophy Room   | Add charge when a boss is defeated; use charges for ???           |         |

* Armory
* Sanctuary / Sacristy / Reliquary
* Scriptorium
* Guildhall
* Sanctum
* Archive / Vault
* Bazaar / Marketplace
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

# Tech Debt

* Convert to functional components, using hooks
* Convert to React Native / Electron
* Port to ipadOS, macOS
