# Tasks

## Bugs

* The campaign map (sometimes) has odd lines on it
* It's possible to run out of proficiencies to learn
  * Might have to add some code to a feature to see whether it can be chosen
  * Should do the same for actions - only allow action cards to be drawn if they can be used
    * For example, can't use a weapon attack if you dont have a weapon
* In an encounter, you can't see the stats for someone who has already acted
  * Show acted combatants below the initiative list

## To Do

* Encounters:
  * Implement things you can do when it's your turn
    * Picking up / dropping items
    * Actions
  * Implement AI so that monsters can take their turns
  * Show turn log for current combatant, if it's a monster
    * With a button to take each action in turn

## Ideas for Future Work

* Magic items should gain additional attributes when wielder levels up
  * dormant => awakened => exalted
* Heroes page / hero selection dialog:
  * Allow grouping by species, role, background, level
* Heroes page:
  * Allow mundane items to be filtered out or sold
  * Click on magic item / mundane item to see heroes with the correct proficiency
* Character sheet panel:
  * Show ranks as filled circles
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
