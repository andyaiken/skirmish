import type { StructureModel } from '../models/structure';

import { Collections } from '../utils/collections';
import { Utils } from '../utils/utils';

export class StrongholdMapLogic {
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
		copy.position = StrongholdMapLogic.getEmptyPosition(stronghold);
		stronghold.push(copy);
	};

	static getEmptyPosition = (stronghold: StructureModel[]) => {
		const adj: { x: number, y: number }[] = [];

		stronghold.forEach(s => {
			adj.push({ x: s.position.x, y: s.position.y - 1 });
			adj.push({ x: s.position.x + 1, y: s.position.y - 1 });
			adj.push({ x: s.position.x + 1, y: s.position.y });
			adj.push({ x: s.position.x + 1, y: s.position.y + 1 });
			adj.push({ x: s.position.x, y: s.position.y + 1 });
			adj.push({ x: s.position.x - 1, y: s.position.y + 1 });
			adj.push({ x: s.position.x - 1, y: s.position.y });
			adj.push({ x: s.position.x - 1, y: s.position.y - 1 });
		});

		const empty = adj.filter(sq => !stronghold.find(s => (s.position.x === sq.x) && s.position.y === sq.y));
		if (empty.length === 0) {
			return {
				x: 0,
				y: 0
			};
		}

		return Collections.draw(empty);
	};
}
