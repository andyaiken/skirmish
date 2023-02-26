# Tasks

## Bugs

* It's possible to run out of proficiencies to learn
  * Should add code to a feature / action to see whether it can be chosen
  * Only draw feature / action cards that can be chosen
    * For example, you can't use a weapon attack if you don't have a weapon
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
* Campaign screen, Heroes page:
  * Allow grouping by species, role, background, level
  * Also do this in the hero selection dialog
* Campaign screen, Items page:
  * Allow mundane items to be filtered out or sold
    * You could then use money buy magic items / hero slots, or to add enhancements to items
    * Loot piles could include money
  * Click on magic item / mundane item to see heroes with the correct proficiency
* Character sheet panel:
  * Show ranks as filled circles
  * Show the XP required as a gauge
* Campaign maps:
  * The island should include mountain ranges, lakes etc, which are impassable
  * Regions could have population, terrain types, etc
* Mountebank, Thief and Pixie should have an attack redirection aura
* Noble should have trait buffing / skill buffing auras
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
    * Necromancer

## Tech Debt

* Convert to functional components
* Use hooks
* Use CSS modules
