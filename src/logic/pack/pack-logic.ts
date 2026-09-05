import { codexArcanum } from '../../data/packs/codex-arcanum';
import { coldBlood } from '../../data/packs/cold-blood';
import { core } from '../../data/packs/core';
import { deepWater } from '../../data/packs/deep-water';
import { elements } from '../../data/packs/elements';
import { faeRealm } from '../../data/packs/fae-realm';
import { hellToPay } from '../../data/packs/hell-to-pay';
import { illHumours } from '../../data/packs/ill-humours';
import { inkAndVellum } from '../../data/packs/ink-and-vellum';
import { longDarkWinter } from '../../data/packs/long-dark-winter';
import { magicInAGlass } from '../../data/packs/magic-in-a-glass';
import { menagerie } from '../../data/packs/menagerie';
import { outOfTheGrave } from '../../data/packs/out-of-the-grave';
import { overgrowth } from '../../data/packs/overgrowth';
import { powerAndGlory } from '../../data/packs/power-and-glory';
import { skullduggery } from '../../data/packs/skullduggery';
import { soundAndFury } from '../../data/packs/sound-and-fury';
import { theGoingRate } from '../../data/packs/the-going-rate';
import { workshop } from '../../data/packs/workshop';

import { CombatantType } from '../../enums/combatant-type';

import type { PackModel } from '../../models/pack';

import { Collections } from '../../utils/collections/collections';

export class PackLogic {
	// Every pack is a function that builds its cards from scratch, so getAllPacks() rebuilt the whole
	// game - nineteen packs, every card, every action - on each call. findPack goes through it, and
	// findPack sits behind getSpecies, getRole, getItem and the rest, so generating a single
	// encounter called it around seven hundred times and spent most of its time there.
	//
	// The cards are immutable in practice: everything that draws one clones it before changing
	// anything (applyCombatantCards, addItems, addStructure, createPotion, the magic item generator).
	// So they are built once and shared. The arrays are handed out as copies, because Collections.sort
	// sorts in place and a caller sorting a deck must not reorder the cache.
	static packCache: PackModel[] | null = null;
	static packsByID = new Map<string, PackModel>();

	static buildPacks = () => {
		if (!PackLogic.packCache) {
			PackLogic.packCache = [ core(), ...PackLogic.buildExpansionPacks() ];
			PackLogic.packsByID = new Map(PackLogic.packCache.map(pack => [ pack.id, pack ]));
		}

		return PackLogic.packCache;
	};

	static getBaseGame = () => {
		return PackLogic.buildPacks()[0];
	};

	static buildExpansionPacks = () => {
		const list = [
			codexArcanum(),
			coldBlood(),
			deepWater(),
			elements(),
			faeRealm(),
			hellToPay(),
			illHumours(),
			inkAndVellum(),
			longDarkWinter(),
			magicInAGlass(),
			menagerie(),
			outOfTheGrave(),
			overgrowth(),
			powerAndGlory(),
			skullduggery(),
			soundAndFury(),
			theGoingRate(),
			workshop()
		];

		return Collections.sort(list, n => n.name);
	};

	static getExpansionPacks = () => {
		return PackLogic.buildPacks().slice(1);
	};

	static getAllPacks = () => {
		return [ ...PackLogic.buildPacks() ];
	};

	// The core game is always available, so naming its ID as well must not add it twice - that
	// would double the weight of every core card in every deck that draws from these packs
	static getAvailablePacks = (packIDs: string[]) => {
		return Collections.distinct([ PackLogic.getBaseGame(), ...PackLogic.findPacks(packIDs) ], p => p.id);
	};

	static findPack = (packID: string) => {
		PackLogic.buildPacks();
		return PackLogic.packsByID.get(packID) || null;
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

	static getScrolls = (packID: string) => PackLogic.findPack(packID)?.scrolls || [];

	static getStructures = (packID: string) => PackLogic.findPack(packID)?.structures || [];

	static getPackCards = (packID: string) => {
		return [
			...PackLogic.getSpecies(packID),
			...PackLogic.getRoles(packID),
			...PackLogic.getBackgrounds(packID),
			...PackLogic.getItems(packID),
			...PackLogic.getPotions(packID),
			...PackLogic.getScrolls(packID),
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
