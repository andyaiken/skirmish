import { StructureType } from '../enums/structure-type';

import type { GameModel } from '../models/game';
import type { ItemModel } from '../models/item';
import type { RegionModel } from '../models/region';
import type { StructureModel } from '../models/structure';

import { Collections } from '../utils/collections';
import { Utils } from '../utils/utils';

export class StrongholdLogic {
	static getDimensions = (stronghold: StructureModel[]) => {
		const dims = {
			left: Number.MIN_VALUE,
			top: Number.MIN_VALUE,
			right: Number.MIN_VALUE,
			bottom: Number.MIN_VALUE
		};

		stronghold.forEach(structure => {
			dims.left = dims.left === Number.MIN_VALUE ? structure.position.x : Math.min(dims.left, structure.position.x);
			dims.top = dims.top === Number.MIN_VALUE ? structure.position.y : Math.min(dims.top, structure.position.y);
			dims.right = dims.right === Number.MIN_VALUE ? structure.position.x : Math.max(dims.right, structure.position.x);
			dims.bottom = dims.bottom === Number.MIN_VALUE ? structure.position.y : Math.max(dims.bottom, structure.position.y);
		});

		return dims;
	};

	static addStructure = (game: GameModel, structure: StructureModel) => {
		const copy = JSON.parse(JSON.stringify(structure)) as StructureModel;
		copy.id = Utils.guid();
		copy.position = StrongholdLogic.getEmptyPosition(game.stronghold);
		if (StrongholdLogic.canCharge(copy)) {
			copy.charges = copy.level;
		}
		game.stronghold.push(copy);

		// A Monument is a standing advertisement for the company, so raising one brings someone in.
		// It's uncharged, which means it has no demolish button - the slot can't be banked and the
		// structure then sold back.
		if (copy.type === StructureType.Monument) {
			game.heroSlots += 1;
		}
	};

	// A Counting House is permanent too: every region you take starts paying its dues, and a
	// well-populated region pays more. This is the money economy's first source other than loot.
	static getConquestIncome = (game: GameModel, region: RegionModel) => {
		if (!game.stronghold.some(s => s.type === StructureType.CountingHouse)) {
			return 0;
		}

		return region.demographics.population * 10;
	};

	static getEmptyPosition = (stronghold: StructureModel[]) => {
		const adj: { x: number, y: number }[] = [];

		stronghold.forEach(s => {
			const minX = s.position.x - 3;
			const maxX = s.position.x + 3;
			const minY = s.position.y - 3;
			const maxY = s.position.y + 3;
			for (let x = minX; x < maxX; ++x) {
				for (let y = minY; y < maxY; ++y) {
					adj.push({ x: x, y: y });
				}
			}
		});

		const empty = adj.filter(sq => !stronghold.find(s => (s.position.x === sq.x) && s.position.y === sq.y));
		if (empty.length === 0) {
			return {
				x: 0,
				y: 0
			};
		}

		const square = Collections.draw(empty);

		return {
			x: square.x,
			y: square.y
		};
	};

	static getUpgradeCost = (structure: StructureModel) => {
		return structure.level * 50;
	};

	// What the shops charge before the stronghold gets involved
	static basePrices = {
		mundane: 2,
		potion: 20,
		scroll: 30,
		magic: 100,
		structure: 50
	};

	// What the shops pay for something you no longer want
	static salePrices = {
		mundane: 1,
		potion: 10,
		scroll: 15,
		magic: 50
	};

	// A Bazaar is permanent rather than charged - the traders know you, and go on knowing you - so
	// it reads as a standing discount rather than something spent one purchase at a time. Having
	// two of them is no better than having one.
	static getPrice = (game: GameModel, kind: keyof typeof StrongholdLogic.basePrices) => {
		const price = StrongholdLogic.basePrices[kind];

		if (!game.stronghold.some(s => s.type === StructureType.Bazaar)) {
			return price;
		}

		return Math.max(1, Math.floor(price * 0.75));
	};

	static getItemPrice = (game: GameModel, item: ItemModel) => {
		if (item.magic) {
			return StrongholdLogic.getPrice(game, 'magic');
		}
		if (item.potion) {
			return StrongholdLogic.getPrice(game, 'potion');
		}
		if (item.scroll) {
			return StrongholdLogic.getPrice(game, 'scroll');
		}

		return StrongholdLogic.getPrice(game, 'mundane');
	};

	static getSalePrice = (item: ItemModel) => {
		if (item.magic) {
			return StrongholdLogic.salePrices.magic;
		}
		if (item.potion) {
			return StrongholdLogic.salePrices.potion;
		}
		if (item.scroll) {
			return StrongholdLogic.salePrices.scroll;
		}

		return StrongholdLogic.salePrices.mundane;
	};

	// Barracks and Warehouse come with the campaign and aren't benefits, so they're never offered
	// for sale or as a reward. Everything else is. This used to be inferred from canCharge, which
	// worked only while those two were the only uncharged structures.
	static canBuild = (structure: StructureModel) => {
		switch (structure.type) {
			case StructureType.Barracks:
			case StructureType.Warehouse:
				return false;
		}

		return true;
	};

	// An uncharged structure's benefit is permanent - it never needs recharging, and the stronghold
	// page offers no demolish button for one, so its benefit can't be banked and then sold back
	static canCharge = (structure: StructureModel) => {
		switch (structure.type) {
			case StructureType.Barracks:
			case StructureType.CountingHouse:
			case StructureType.Monument:
			case StructureType.Warehouse:
				return false;
		}

		return true;
	};

	static canRecharge = (structure: StructureModel) => {
		return StrongholdLogic.canCharge(structure) && (structure.charges === 0);
	};

	static rechargeStructure = (structure: StructureModel) => {
		structure.charges = structure.level;
	};

	static getStructureCharges = (game: GameModel, type: StructureType) => {
		return Collections.sum(game.stronghold.filter(s => s.type === type), s => s.charges);
	};

	static spendCharge = (game: GameModel, type: StructureType, count: number) => {
		for (let n = 0; n < count; ++n) {
			const structures = game.stronghold
				.filter(s => s.type === type)
				.filter(s => s.charges > 0);
			if (structures.length > 0) {
				const structure = Collections.draw(structures);
				structure.charges -= 1;
			}
		}
	};
}
