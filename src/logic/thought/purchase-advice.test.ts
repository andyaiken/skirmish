import { describe, expect, it } from 'vitest';

import { CombatantType } from '../../enums/combatant-type';
import { ItemLocationType } from '../../enums/item-location-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { PersonalityType } from '../../enums/personality-type';
import { QuirkType } from '../../enums/quirk-type';
import { StructureType } from '../../enums/structure-type';

import { Factory } from '../factory/factory';
import { GameLogic } from '../game/game-logic';
import { MindLogic } from '../mind/mind-logic';
import { PackLogic } from '../pack/pack-logic';
import { PurchaseAdviceLogic } from './purchase-advice';

const packIDs = () => PackLogic.getAllPacks().map(pack => pack.id);
const makeMagicItem = (name: string) => {
	const baseItem = GameLogic.getItemDeck(packIDs()).find(item =>
		item.location !== ItemLocationType.None && (item.location !== ItemLocationType.Any)
	)!;
	return { ...baseItem, id: name, name: name, magic: true, proficiency: ItemProficiencyType.None };
};

describe('PurchaseAdviceLogic', () => {
	it('matches structure advice to a hero personality and an offered structure', () => {
		const game = Factory.createGame(packIDs());
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.name = 'Mira';
		MindLogic.setPersonalityLevel(hero.mind.personality, PersonalityType.Curious, 3);
		game.heroes.push(hero);

		const structures = [
			GameLogic.getStructure(`structure-${StructureType.Academy}`)!,
			GameLogic.getStructure(`structure-${StructureType.Bazaar}`)!
		];
		const advice = PurchaseAdviceLogic.getStructureAdvice(game, structures);

		expect(advice?.hero.name).toBe('Mira');
		expect(advice?.choice).toBe(structures[0].name);
		expect(advice?.message).toContain('learn something useful');
	});

	it('steers away from a duplicate permanent structure and recommends a new one', () => {
		const game = Factory.createGame(packIDs());
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.name = 'Mira';
		MindLogic.setPersonalityLevel(hero.mind.personality, PersonalityType.Greedy, 3);
		MindLogic.setPersonalityLevel(hero.mind.personality, PersonalityType.Curious, 0);
		game.heroes.push(hero);

		const bazaar = GameLogic.getStructure(`structure-${StructureType.Bazaar}`)!;
		const academy = GameLogic.getStructure(`structure-${StructureType.Academy}`)!;
		game.stronghold.push(bazaar);

		const advice = PurchaseAdviceLogic.getStructureAdvice(game, [ bazaar, academy ]);

		expect(advice?.choice).toBe(academy.name);
		expect(advice?.message).toContain(`skip another ${bazaar.name}`);
		expect(advice?.message).toContain(`go for the ${academy.name}`);
	});

	it('does not compare a choice with an unrelated structure that was not offered', () => {
		const game = Factory.createGame(packIDs());
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.name = 'Mira';
		game.heroes.push(hero);

		const existingStructure = game.stronghold[0];
		const academy = GameLogic.getStructure(`structure-${StructureType.Academy}`)!;

		const advice = PurchaseAdviceLogic.getStructureAdvice(game, [ academy ]);

		expect(advice?.choice).toBe(academy.name);
		expect(advice?.message).not.toContain(existingStructure.name);
		expect(advice?.message).toContain(academy.name);
	});

	it('recommends an offered potion through a hero with a matching temperament', () => {
		const game = Factory.createGame(packIDs());
		const cheerful = Factory.createCombatant(CombatantType.Hero);
		cheerful.name = 'Tamsin';
		MindLogic.setPersonalityLevel(cheerful.mind.personality, PersonalityType.Cheerful, 3);
		MindLogic.setPersonalityLevel(cheerful.mind.personality, PersonalityType.Cautious, 0);
		const cautious = Factory.createCombatant(CombatantType.Hero);
		cautious.name = 'Rook';
		MindLogic.setPersonalityLevel(cautious.mind.personality, PersonalityType.Cautious, 3);
		game.heroes.push(cheerful, cautious);

		const potion = GameLogic.getPotionDeck(packIDs())[0];
		const advice = PurchaseAdviceLogic.getItemAdvice(game, [ potion ]);

		expect(advice?.hero.name).toBe('Rook');
		expect(advice?.choice).toBe(potion.name);
	});

	it('varies the reason given for magic item recommendations', () => {
		const game = Factory.createGame(packIDs());
		const hero = Factory.createCombatant(CombatantType.Hero);
		game.heroes.push(hero);

		const messages = Array.from({ length: 12 }, (_, index) =>
			PurchaseAdviceLogic.getItemAdvice(game, [ makeMagicItem(`Magic item ${index}`) ])?.message
		);
		const reasons = [
			'its enchantment could give me an edge.',
			'I can put that magic to good use.',
			'it could make a real difference when we need it.',
			'that would be a useful bit of magic to have on our side.'
		];

		expect(new Set(messages.map(message => reasons.find(reason => message?.endsWith(reason)))).size).toBeGreaterThan(1);
		expect(messages.every(message => !message?.includes('I could make good use of it'))).toBe(true);
		expect(messages.every((message, index) => !message?.includes(`the Magic item ${index}`))).toBe(true);
	});

	it('only recommends magic items a hero can equip in an unoccupied slot', () => {
		const game = Factory.createGame(packIDs());
		const enthusiastic = Factory.createCombatant(CombatantType.Hero);
		enthusiastic.name = 'Mira';
		MindLogic.setPersonalityLevel(enthusiastic.mind.personality, PersonalityType.Curious, 3);
		const equipped = makeMagicItem('Existing charm');
		enthusiastic.items.push(equipped);

		const available = Factory.createCombatant(CombatantType.Hero);
		available.name = 'Rook';
		MindLogic.setPersonalityLevel(available.mind.personality, PersonalityType.Curious, 2);
		game.heroes.push(enthusiastic, available);

		const newMagicItem = makeMagicItem('New charm');
		const advice = PurchaseAdviceLogic.getItemAdvice(game, [ newMagicItem ]);

		expect(advice?.hero.name).toBe('Rook');
		expect(advice?.choice).toBe(newMagicItem.name);
	});

	it('does not recommend a magic item when no hero can equip it in an available slot', () => {
		const game = Factory.createGame(packIDs());
		const hero = Factory.createCombatant(CombatantType.Hero);
		const magicItem = makeMagicItem('Charm');
		hero.items.push(makeMagicItem('Existing charm'));
		game.heroes.push(hero);

		expect(PurchaseAdviceLogic.getItemAdvice(game, [ magicItem ])).toBeNull();
	});

	it('does not recommend a magic item to a hero who cannot use items', () => {
		const game = Factory.createGame(packIDs());
		const hero = Factory.createCombatant(CombatantType.Hero);
		hero.quirks.push(QuirkType.Beast);
		game.heroes.push(hero);

		expect(PurchaseAdviceLogic.getItemAdvice(game, [ makeMagicItem('Charm') ])).toBeNull();
	});

	it('does not give advice when there are no heroes or no options', () => {
		const game = Factory.createGame(packIDs());
		const structure = GameLogic.getStructure(`structure-${StructureType.Academy}`)!;

		expect(PurchaseAdviceLogic.getStructureAdvice(game, [ structure ])).toBeNull();

		const hero = Factory.createCombatant(CombatantType.Hero);
		game.heroes.push(hero);
		expect(PurchaseAdviceLogic.getStructureAdvice(game, [])).toBeNull();
		expect(PurchaseAdviceLogic.getItemAdvice(game, [])).toBeNull();
	});
});
