import { StructureType } from '../enums/structure-type';

import type { GameModel } from '../models/game';
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

	static addStructure = (stronghold: StructureModel[], structure: StructureModel) => {
		const copy = JSON.parse(JSON.stringify(structure)) as StructureModel;
		copy.id = Utils.guid();
		copy.position = StrongholdLogic.getEmptyPosition(stronghold);
		if (StrongholdLogic.canCharge(copy)) {
			copy.charges = copy.level;
		}
		stronghold.push(copy);
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

	static canCharge = (structure: StructureModel) => {
		switch (structure.type) {
			case StructureType.Barracks:
			case StructureType.Warehouse:
				return false;
		}

		return true;
	};

	static getStructureCharges = (game: GameModel, type: StructureType) => {
		return Collections.sum(game.stronghold.filter(s => s.type === type), s => s.charges);
	};

	static useCharge = (game: GameModel, type: StructureType, count: number) => {
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
