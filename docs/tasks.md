# Tasks

## Bugs

* The campaign map (sometimes) has odd lines on it
* It's possible to run out of proficiencies to learn
  * Might have to add some code to a feature to see whether it can be chosen
  * Should do the same for actions - only allow action cards to be drawn if they can be used
    * For example, can't use a weapon attack if you dont have a weapon

## To Do

* Encounters:
  * Click on an initiative entry or a map token, to show a character sheet with combat data included
    * Limited data for monsters (level, conditions, damage, wounds)
  * Show turn log for current combatant, if it's a monster
  * Implement things you can do when it's your turn
    * Picking up / dropping items
    * Actions
  * Implement the encounter flow
  * Implement AI so that monsters can take their turns

## Ideas for Future Work

* Heroes page / hero selection dialog:
  * Allow grouping by species, role, background, level
* Heroes page:
  * Allow mundane items to be filtered out or sold
  * Click on magic item / mundane item to see heroes with the correct proficiency
* Character sheet panel:
  * Show skills as ranks (filled circles)
  * Show the XP required as a gauge
* Encounter maps should (occasionally) have items scattered about
* Potions (add features when used)
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
  * Grenadier
  * Martial artist
  * Chaos magic

## Tech Debt

* Convert to functional components
* Use hooks
* Use CSS modules
