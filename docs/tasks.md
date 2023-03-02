# Tasks

## Bugs

* It's possible for some squares on the encounter map to be detatched from the rest
  * When generating the map, remove unattached areas
  * Or, when removing squares, check whether this would result in an unattached area
* The campaign map (sometimes) has odd lines on it

## To Do

* Encounters:
  * Implement actions
    * In the data:
      * Add effects
    * In the UI:
      * Handle parameters
      * Handle effects
      * Only draw action cards when you ask to
        * That way the prerequisites are based on your current state
  * Implement AI so that monsters can take their turns
  * Show turn log for current combatant, if it's a monster
    * With a button to take each action in turn
* Add help / documentation to explain game rules
* Card colors:

|Card        |Colour                          |
|------------|--------------------------------|
|Hero        |Grey                            |
|Species     |Red                             |
|Role        |Blue                            |
|Background  |Green                           |
|Item        |Yellow                          |
|Magic item  |Purple                          |
|Boon        |Orange                          |
|Feature     |White; footer colour by source  |
|Action      |White; footer colour by source  |

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
* Human should have an action to clear and redraw actions
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
* Use hooks
