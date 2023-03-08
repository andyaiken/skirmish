# Tasks

## Bugs

* If you select a 'square' parameter, and move, the highlighted squares do not move
  * Presumably this is the same for other parameter types
* It's possible for some squares on the encounter map to be detatched from the rest
  * When generating the map, remove unattached areas
  * Or, when removing squares, check whether this would result in an unattached area
* The campaign map (sometimes) has odd lines on it
* It's possible to close out of dialogs; this should be forbidden for:
  * The character sheet dialog, when levelling up
  * The hero builder dialog
  * The magic item selection dialog

## To Do

* Encounters:
  * Indicate to the user whether a hero's movement / actions have been spent
    * On the move / action tabs?
  * Allow the user to opt for a universal action instead
  * Implement actions
    * Parameter selection / 'go' button / etc, should happen in the card itself
    * Lose turn should set a flag on the combatant
      * On start of turn, notify and end turn
      * This flag should be reflected in the initiative list
    * Add missing effects
  * Implement AI so that monsters can take their turns
    * Add a button so that the user can perform each action in turn
* Add a system for evaluating each action to ensure none is too powerful
  * Then extend this to ensure species / roles / backgrounds are equally matched
* Add help / documentation to explain game rules

## Ideas for Future Work

* Minions
* Items:
  * Potions (add conditions when used)
  * Magic items could gain additional attributes when wielder levels up
    * Dormant => awakened => Exalted
* Campaign screen, Items page:
  * Click on magic item / mundane item to see heroes with the correct proficiency
* Character sheet panel:
  * Show ranks as filled circles
  * Show the XP required as a gauge
* Encounters
  * Implement line-of-sight
  * Allow other victory conditions
    * Get a certain number of heroes to a particular area
    * Get one hero to a particular area and stay there for a certain number of rounds
    * Defeat a specific opponent within a certain number of rounds
* Mountebank, Thief and Pixie should have an attack redirection aura
* Gnome, Thief should be able to set / disable traps
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
  * Blackguard
  * Shaman
  * Warlock
  * Non-magic types
    * Champion
    * Guard / warden
    * Knight
    * Warrior
    * Warlord
    * Grenadier
    * Martial artist
      * Melee elemental attacks
      * Ability to remove conditions on self
  * Divine types
    * Cleric
    * Cultist
    * Paladin / warpriest
  * Thief types
    * Assassin / poisoner
    * Bandit
    * Scout
    * Spy
    * Thug
  * Wizard types
    * Evoker
    * Illusionist

## Tech Debt

* Convert to functional components
* Add error boundaries
* Use hooks
