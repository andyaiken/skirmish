# Tasks

## Bugs

* If you select a 'square' parameter, and move, the candidate squares do not move
  * Presumably this is the same for other parameter types

## Priority

* Encounters:
  * Implement AI so that monsters can take their turns
    * Add a button so that the user can perform each action in turn
  * Actions
    * Allow the user to opt for a universal action instead
    * Implement the last action effects (command action / command move)
* Add a system for evaluating each action to ensure none is too powerful
  * Then extend this to ensure species / roles / backgrounds are equally matched
* Add help / documentation to explain game rules

## Future Work

* Minions
  * Die as soon as they take any damage
  * Convert one monster into 4 minions
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
  * Traps
    * Pit traps
    * Fire traps
    * Dart traps
    * Poison dart traps
  * Action parameter selection / 'go' button / etc, should happen in the card itself
  * Indicate combatant's info on the map token / in the initiative list
    * Damage
    * Stunned
    * Standing / prone / unconscious
    * Conditions exist
  * Allow other victory conditions
    * Get a certain number of heroes to a particular area
    * Get one hero to a particular area and stay there for a certain number of rounds
    * Defeat a specific opponent within a certain number of rounds
* Dark mode
* Undo movement

## Ideas for Species / Roles / Backgrounds

* Mountebank, Thief, and Pixie should have an attack redirection aura
* Gnome, Thief should be able to set / disable traps
* Minotaur, Reptilian, and Shadowborn should be able to intimidate
  * Use the same skill as the Noble's Taunt action
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
  * Artificer (infuse item with magic, drain item of magic, convert item / loot pile into energy)
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
    * Martial artist / sensei?
      * Melee elemental attacks
      * Ability to remove conditions on self
  * Thief types
    * Assassin / poisoner
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
