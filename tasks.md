# Bugs

## Highlighted Squares
* If you select a 'square' parameter, and move, the origin candidate squares do not move
* Presumably this is the same for other parameter types

# Improvements / Enhancements

## Map Types
* Street
* Building interior

## Encounters
* Undo movement

## Actions
* Action parameter selection / 'go' button / etc, should happen in the card itself

## Features
* Mountebank, Thief, and Pixie should have an attack redirection aura

## Character Sheet
* Show ranks as filled circles
* Show the XP required as a gauge

## Turn Log
* Indentation
* Colours
* Highlighting names, values

## Demographics
* Regions could specify monster types found there
* This should then be used for building encounters

# New Features

## Game Diagnostics
* Add a system for evaluating each action to ensure none is too powerful
* Extend this to ensure species / roles / backgrounds are equally matched
* Also check that the different effect types are all used equally

## Doors
* Present on the map - 2 squares wide
* Can be open / closed
  * Open / close a door for 1 movement point
  * When closed, blocks LOS
* Can be broken down
  * Counts as a wall

## Potions
* Could be found on the map (as a loot pile)
* An extra section in the items page
* 1 movement point to drink
  * Then destroyed
  * Health (heals wounds)
  * Luck (grants skill bonuses)
* Buy for 25 money

## Keys
* Another sort of consumable item
* Make doors lockable
* Destroyed when used to lock / unlock

## Minions
* Die as soon as they take any damage
* Convert one monster into 4 minions

## Chests
* Like a loot pile
* Lockable

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

## Victory Conditions
* Get a certain number of heroes to a particular area
* Get one hero to a particular area and stay there for a certain number of rounds
* Defeat a specific opponent within a certain number of rounds

## Ideas for Roles / Backgrounds
* Artificer
  * infuse item with magic
  * drain item of magic
  * convert item / loot pile into energy
  * create potion
  * shocking grasp
* Blackguard
* Shaman
* Warlock
* Non-magic types
  * Champion
  * Guard / warden
  * Knight
  * Warrior
  * Warlord
* Thief types
  * Bandit
  * Scout
  * Spy
  * Thug
* Divine types
  * Cleric
  * Cultist
  * Paladin / warpriest
* Wizard types
  * Evoker
  * Illusionist
  * Psionicist

## Ideas for Species
* Humanoids:
  * Kobold
  * Ogre
  * Giant
  * Elemental
  * Wraith
  * Zombie
  * Ghoul
  * Vampire
* Beasts:
  * Basilisk / medusa / gorgon
  * Bear
  * Lion / tiger / panther etc
  * Crocodile
  * Giant spider
  * Giant rat
  * Giant snake
  * Dragon

## Styling
* Dark mode
* Action animations (fireball etc)

## Sound
* Add sound effects
* Add music

# Tech Debt

* Convert to functional components
* Add error boundaries
* Use hooks
