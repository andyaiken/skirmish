# Tasks

## Screens

### Campaign Map Screen

* The island should include mountain ranges, lakes etc, which are impassable

### Encounter Screen

* Implement the encounter flow
* Click on an initiative entry or a map token, to show a character sheet with combat data included
  * Limited data for monsters (level, conditions, damage, wounds)
* Monster names should be suffixed with ...1, 2 if duplicated
* Show controls for current combatant, if it's a hero
  * Otherwise, show log of monster's turn

## Panels

### Character Sheet Panel

* Show the XP required as a gauge
* Show damage bonuses / resistances grouped by category

### Encounter Map Panel

* Implement this panel

### Initiative List Panel

* Implement this panel

## Data

* Mountebank, Thief and Pixie should have an attack redirection aura
* Noble should have trait buffing / skill buffing auras
* Monster species:
  * Orc
  * Goblin
  * Kobold
  * Troll
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

## To Do

* Regions should have a seed for each encounter that is used to generate its map and monsters
* Monsters should have add-on templates (leader, skirmisher, lurker, brute, artillery, soldier, etc)
* Encounter maps should (occasionally) have items scattered about
* Magic item generation (add features and actions)
* Actions
* Potions (add features when used)
* Features and Actions should indicate where they come from (universal, species, role, background, item)

## Bugs

* It's possible to run out of proficiencies to learn
  * Might have to add some code to a feature to see whether it can be chosen

## Tech Debt

* Convert to functional components
* Use hooks
