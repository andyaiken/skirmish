import { StructureType } from '../enums/structure-type';

import type { GameModel } from '../models/game';
import type { StructureModel } from '../models/structure';

import { Collections } from '../utils/collections';
import { Utils } from '../utils/utils';

export class StrongholdLogic {
	static getDimensions = (stronghold: StructureModel[]) => {
		const dims = {
			left: Number.MAX_VALUE,
			top: Number.MAX_VALUE,
			right: Number.MIN_VALUE,
			bottom: Number.MIN_VALUE
		};

		stronghold.forEach(s => {
			dims.left = Math.min(dims.left, s.position.x);
			dims.top = Math.min(dims.top, s.position.y);
			dims.right = Math.max(dims.right, s.position.x);
			dims.bottom = Math.max(dims.bottom, s.position.y);
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
		const adj: { x: number, y: number, count: number }[] = [];

		stronghold.forEach(s => {
			const minX = s.position.x - 2;
			const maxX = s.position.x + 2;
			const minY = s.position.y - 2;
			const maxY = s.position.y + 2;
			for (let x = minX; x < maxX; ++x) {
				for (let y = minY; y < maxY; ++y) {
					const exist = adj.find(sq => (sq.x === x) && (sq.y === y));
					if (exist) {
						exist.count += 1;
					} else {
						adj.push({ x: x, y: y, count: 1 });
					}
				}
			}
		});

		const empty = adj.filter(sq => !stronghold.find(s => (s.position.x === sq.x) && s.position.y === sq.y));
		const squares = empty.filter(sq => sq.count === 1);
		if (squares.length === 0) {
			return {
				x: 0,
				y: 0
			};
		}

		const square = Collections.draw(squares);

		return {
			x: square.x,
			y: square.y
		};
	};

	static canCharge = (structure: StructureModel) => {
		switch (structure.type) {
			case StructureType.Barracks:
				return false;
		}

		return true;
	};

	static getHeroLimit = (game: GameModel) => {
		let count = 0;

		game.stronghold
			.filter(s => s.type === StructureType.Barracks)
			.forEach(s => count += s.level * 3);

		return count;
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
