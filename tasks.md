# Tasks

## Bugs

* It's possible to run out of proficiencies to learn
  * Might have to add some code to a feature to see whether it can be chosen

## To Do

* Encounters:
  * Implement the encounter flow
  * Implement things you can do when it's your turn
  * Implement AI so that monsters can take their turns
  * Click on an initiative entry or a map token, to show a character sheet with combat data included
    * Limited data for monsters (level, conditions, damage, wounds)
  * Monster names should be suffixed with ...1, 2 if duplicated
  * Show controls for current combatant, if it's a hero
    * Otherwise, show log of monster's turn
* Implement actions
* Magic item generation (add features and actions)
* Monster species:
  * Orc
  * Goblin
  * Troll

## Ideas for Future Work

* Character sheet panel:
  * Show the XP required as a gauge
  * Show damage bonuses / resistances grouped by category
* Encounter maps should (occasionally) have items scattered about
* Potions (add features when used)
* Features and Actions should indicate where they come from (universal, species, role, background, item)
* The island should include mountain ranges, lakes etc, which are impassable
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
  * Cleric
  * Paladin
  * Cultist
  * Assassin / poisoner
  * Bandit
  * Blackguard
  * Champion
  * Evoker
  * Guard / warden
  * Illusionist
  * Knight
  * Mage
  * Necromancer
  * Shaman
  * Scout
  * Spy
  * Thug
  * Warpriest
  * Warrior
  * Warlock
  * Warlord

## Tech Debt

* Convert to functional components
* Use hooks
