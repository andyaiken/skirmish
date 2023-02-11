import { dice } from '../utils/random';
import { guid } from '../utils/utils';

export enum EncounterMapSquareType {
	Clear,
	Obstructed,
	Blocked
}

export interface EncounterMapSquareModel {
	id: string;
	x: number;
	y: number;
	type: EncounterMapSquareType;
}

export interface EncounterMapModel {
	squares: EncounterMapSquareModel[];
}

export const generateEncounterMap = (rng: () => number): EncounterMapModel => {
	const map: EncounterMapModel = {
		squares: []
	};

	const tile = {
		width: dice(1, rng) + dice(1, rng) + dice(1, rng),
		height: dice(1, rng) + dice(1, rng) + dice(1, rng)
	};
	addTile(map, tile, { x: 0, y: 0 });

	/*
	while (map.squares.length < 200) {
		const tile = {
			width: dice(1, rng) + dice(1, rng) + dice(1, rng),
			height: dice(1, rng) + dice(1, rng) + dice(1, rng)
		};

		// TODO: Find a position that is adjacent but non-overlapping
		const position = { x: 0, y: 0 };

		addTile(map, tile, position);
	}
	*/

	// TODO: Add decorations, obstructed terrain, blocked terrain

	return map;
}

export const getEncounterMapDimensions = (map: EncounterMapModel) => {
	const dims = {
		left: Number.MAX_VALUE,
		top: Number.MAX_VALUE,
		right: Number.MIN_VALUE,
		bottom: Number.MIN_VALUE
	};

	map.squares.forEach(sq => {
		dims.left = Math.min(dims.left, sq.x);
		dims.top = Math.min(dims.top, sq.y);
		dims.right = Math.max(dims.right, sq.x);
		dims.bottom = Math.max(dims.bottom, sq.y);
	});

	return dims;
}

const addTile = (map: EncounterMapModel, tile: { width: number, height: number }, position: { x: number, y: number }) => {
	for (let tileX = 0; tileX < tile.width; ++tileX) {
		for (let tileY = 0; tileY < tile.height; ++tileY) {
			const square: EncounterMapSquareModel = {
				id: guid(),
				x: position.x + tileX,
				y: position.y + tileY,
				type: EncounterMapSquareType.Clear
			};
			map.squares.push(square);
		}
	}
}

