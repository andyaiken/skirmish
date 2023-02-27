# Tasks

## Bugs

* It's possible for some squares on the encounter map to be detatched from the rest
  * When generating the map, remove unattached areas
  * Or, when removing squares, check whether this would result in an unattached area
* The campaign map (sometimes) has odd lines on it

## To Do

* Encounters:
  * Implement actions
  * Implement AI so that monsters can take their turns
  * Show turn log for current combatant, if it's a monster
    * With a button to take each action in turn
* Add help / documentation to explain game rules

## Ideas for Future Work

* Items:
  * Potions (add conditions when used)
  * Magic items could gain additional attributes when wielder levels up
    * Dormant => awakened => Exalted
* Campaign screen, Items page:
  * Click on magic item / mundane item to see heroes with the correct proficiency
* Character sheet panel:
  * Show ranks as filled circles
  * Show the XP required as a gauge
* Mountebank, Thief and Pixie should have an attack redirection aura
* Monster species:
  * Kobold
  * Ogre
  * Giant
  * Elemental
  * Wraith
  * Zombie
  * Ghoul
  * Vampire
  * Dark elf
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
    * Chaos magic
    * Evoker
    * Illusionist

## Tech Debt

* Convert to functional components
* Use hooks
* Use CSS modules
