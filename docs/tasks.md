# Tasks

## Bugs

* If you select a 'square' parameter, and move, the origin candidate squares do not move
  * Presumably this is the same for other parameter types

## Priority

* Add a system for evaluating each action to ensure none is too powerful
  * Then extend this to ensure species / roles / backgrounds are equally matched
  * Also check that the different effect types are all used

## Future Work

* Add encounter map types
  * Street
  * Building interior
* Regions could specify monster types found there
  * This should then be used for building encounters
* Improve the turn log
  * It should be more than just a block of text
  * Indentation
  * Colours
  * Highlighting names, values
* Minions
  * Die as soon as they take any damage
  * Convert one monster into 4 minions
* Items:
  * Potions
    * Could be found on the map (as a loot pile)
    * An extra section in the items page
    * 1M to drink
      * Then destroyed
      * Health (heals wounds)
      * Luck (grants skill bonuses)
    * Buy for 25 money
  * Magic items could gain additional attributes when wielder levels up
    * Dormant => awakened => Exalted
* Keys
  * Another sort of consumable item
  * Doors on the map
* Campaign screen, Items page:
  * Click on magic item / mundane item to see heroes with the correct proficiency
* Character sheet panel:
  * Show ranks as filled circles
  * Show the XP required as a gauge
* Encounters
  * Traps
    * Pit traps
    * Fire traps
    * Dart traps
    * Poison dart traps
  * Action parameter selection / 'go' button / etc, should happen in the card itself
  * Allow other victory conditions
    * Get a certain number of heroes to a particular area
    * Get one hero to a particular area and stay there for a certain number of rounds
    * Defeat a specific opponent within a certain number of rounds
* Dark mode
* Sound effects
* Action animations (fireball etc)
* Undo movement

## Ideas for Species / Roles / Backgrounds

* Mountebank, Thief, and Pixie should have an attack redirection aura
* Gnome, Thief should be able to set / disable traps
* Deva should have the ability to see opponent character sheet
* Shadowborn should be monster species
* Necromancer should be monster role
* Monster species:
  * Humanoids
    * Kobold
    * Ogre
    * Giant
    * Elemental
    * Wraith
    * Zombie
    * Ghoul
    * Vampire
  * Beasts
    * Basilisk / medusa / gorgon
    * Bear
    * Lion / tiger / panther etc
    * Crocodile
    * Giant spider
    * Giant rat
    * Giant snake
    * Dragon
* Roles / backgrounds:
  * Artificer (infuse item with magic, drain item of magic, convert item / loot pile into energy, create potion, shocking grasp)
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

## Tech Debt

* Convert to functional components
* Add error boundaries
* Use hooks
