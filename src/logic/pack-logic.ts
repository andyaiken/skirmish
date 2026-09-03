import { arcana } from '../data/packs/arcana';
import { beasts } from '../data/packs/beasts';
import { coldBlood } from '../data/packs/cold-blood';
import { core } from '../data/packs/core';
import { elements } from '../data/packs/elements';
import { fae } from '../data/packs/fae';
import { faith } from '../data/packs/faith';
import { potions } from '../data/packs/potions';
import { skullduggery } from '../data/packs/skullduggery';
import { technology } from '../data/packs/technology';
import { undead } from '../data/packs/undead';

import { Collections } from '../utils/collections';

export class PackLogic {
	static getBaseGame = () => {
		return core();
	};

	static getExpansionPacks = () => {
		const list = [
			arcana(),
			skullduggery(),
			elements(),
			beasts(),
			undead(),
			technology(),
			faith(),
			potions(),
			fae(),
			coldBlood()
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

	static getHeroSpecies = (packID: string) => PackLogic.findPack(packID)?.heroSpecies || [];

	static getMonsterSpecies = (packID: string) => PackLogic.findPack(packID)?.monsterSpecies || [];

	static getRoles = (packID: string) => PackLogic.findPack(packID)?.roles || [];

	static getBackgrounds = (packID: string) => PackLogic.findPack(packID)?.backgrounds || [];

	static getItems = (packID: string) => PackLogic.findPack(packID)?.items || [];

	static getPotions = (packID: string) => PackLogic.findPack(packID)?.potions || [];

	static getStructures = (packID: string) => PackLogic.findPack(packID)?.structures || [];

	static getPackCards = (packID: string) => {
		return [
			...PackLogic.getHeroSpecies(packID),
			...PackLogic.getMonsterSpecies(packID),
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
