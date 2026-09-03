import { codexArcanum } from '../data/packs/codex-arcanum';
import { coldBlood } from '../data/packs/cold-blood';
import { core } from '../data/packs/core';
import { elements } from '../data/packs/elements';
import { faeRealm } from '../data/packs/fae-realm';
import { guileAndCunning } from '../data/packs/guile-and-cunning';
import { hellToPay } from '../data/packs/hell-to-pay';
import { magicInAGlass } from '../data/packs/magic-in-a-glass';
import { menagerie } from '../data/packs/menagerie';
import { outOfTheGrave } from '../data/packs/out-of-the-grave';
import { powerAndGlory } from '../data/packs/power-and-glory';
import { soundAndFury } from '../data/packs/sound-and-fury';
import { workshop } from '../data/packs/workshop';

import { CombatantType } from '../enums/combatant-type';

import { Collections } from '../utils/collections';

export class PackLogic {
	static getBaseGame = () => {
		return core();
	};

	static getExpansionPacks = () => {
		const list = [
			codexArcanum(),
			coldBlood(),
			elements(),
			faeRealm(),
			guileAndCunning(),
			hellToPay(),
			magicInAGlass(),
			menagerie(),
			outOfTheGrave(),
			powerAndGlory(),
			soundAndFury(),
			workshop()
		];

		return Collections.sort(list, n => n.name);
	};

	static getAllPacks = () => {
		return [
			core(),
			...PackLogic.getExpansionPacks()
		];
	};

	static getAvailablePacks = (packIDs: string[]) => {
		return [
			core(),
			...PackLogic.findPacks(packIDs)
		];
	};

	static findPack = (packID: string) => {
		return PackLogic.getAllPacks().find(p => p.id === packID) || null;
	};

	static findPacks = (packIDs: string[]) => {
		return Collections.distinct(
			packIDs.map(PackLogic.findPack).filter(p => !!p),
			p => p.id
		);
	};

	static getSpecies = (packID: string) => PackLogic.findPack(packID)?.species || [];

	static getHeroSpecies = (packID: string) => PackLogic.getSpecies(packID).filter(s => s.type === CombatantType.Hero);

	static getMonsterSpecies = (packID: string) => PackLogic.getSpecies(packID).filter(s => s.type === CombatantType.Monster);

	static getRoles = (packID: string) => PackLogic.findPack(packID)?.roles || [];

	static getBackgrounds = (packID: string) => PackLogic.findPack(packID)?.backgrounds || [];

	static getItems = (packID: string) => PackLogic.findPack(packID)?.items || [];

	static getPotions = (packID: string) => PackLogic.findPack(packID)?.potions || [];

	static getStructures = (packID: string) => PackLogic.findPack(packID)?.structures || [];

	static getPackCards = (packID: string) => {
		return [
			...PackLogic.getSpecies(packID),
			...PackLogic.getRoles(packID),
			...PackLogic.getBackgrounds(packID),
			...PackLogic.getItems(packID),
			...PackLogic.getPotions(packID),
			...PackLogic.getStructures(packID)
		];
	};

	static getPackCardCount = (packID: string) => {
		return PackLogic.getPackCards(packID).length;
	};

	static findContainingPack = (cardID: string) => {
		return PackLogic.getAllPacks()
			.find(pack => PackLogic.getPackCards(pack.id).some(card => card.id === cardID));
	};
}
