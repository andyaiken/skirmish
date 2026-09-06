import { CombatantType } from '../../enums/combatant-type';

import { CombatantLogic } from '../../logic/combatant/combatant-logic';
import { Factory } from '../../logic/factory/factory';
import { GameLogic } from '../../logic/game/game-logic';

import type { CombatantModel } from '../../models/combatant';

import { Collections } from '../../utils/collections/collections';
import { Color } from '../../utils/color/color';
import { Random } from '../../utils/random/random';

import { NameGenerator } from '../name/name-generator';

export class HeroGenerator {
	// Prefer a card the party does not already hold, but fall back to the whole deck once
	// they are all spoken for. Core alone runs out at the fifth hero - four hero species
	// for a party of five - and drawing from an empty deck yields undefined, which
	// applyCombatantCards skips silently rather than reporting.
	static drawUnused = <T extends { id: string }>(deck: T[], used: string[], rng: () => number) => {
		const unused = deck.filter(entry => !used.includes(entry.id));
		return Collections.draw(unused.length > 0 ? unused : deck, rng);
	};

	static generateHero = (packIDs: string[], existing: CombatantModel[], rng: () => number): CombatantModel => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.name = NameGenerator.generateName(rng);
		hero.color = Color.toString(Random.randomColor(20, 180, rng));

		const species = HeroGenerator.drawUnused(GameLogic.getHeroSpeciesDeck(packIDs), existing.map(h => h.speciesID), rng);
		const role = HeroGenerator.drawUnused(GameLogic.getRoleDeck(packIDs), existing.map(h => h.roleID), rng);
		const background = HeroGenerator.drawUnused(GameLogic.getBackgroundDeck(packIDs), existing.map(h => h.backgroundID), rng);

		CombatantLogic.applyCombatantCards(hero, species.id, role.id, background.id);
		CombatantLogic.addItems(hero, packIDs);

		return hero;
	};
}
