import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import type { EncounterMapSquareModel } from '../models/encounter';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

export class EncounterMapLogic {
	static generateEncounterMap = (rng: () => number): EncounterMapSquareModel[] => {
		let map: EncounterMapSquareModel[] = [];

		while (map.length < 1000) {
			const dirs = [ 'n', 'e', 's', 'w' ];
			const dir = dirs[Random.randomNumber(4, rng)];

			// 0, 1 = room, 2 = corridor
			const type = Random.randomNumber(3, rng);

			const size = {
				width: (type === 2) && ((dir === 'n') || (dir === 's')) ? 2 : Random.dice(3, rng),
				height: (type === 2) && ((dir === 'e') || (dir === 'w')) ? 2 : Random.dice(3, rng)
			};

			const position = { x: 0, y: 0 };
			if (map.length > 0) {
				const adj = EncounterMapLogic.getAdjacentWalls(map, map, [ dir as 'n' | 'e' | 's' | 'w' ]);
				const sq = adj[Random.randomNumber(adj.length, rng)];
				if (dir === 'n') {
					sq.y -= (size.height - 1);
				}
				if (dir === 'w') {
					sq.x -= (size.width - 1);
				}
				position.x = sq.x;
				position.y = sq.y;
			}

			for (let x = position.x; x < position.x + size.width; ++x) {
				for (let y = position.y; y < position.y + size.height; ++y) {
					if (!map.find(t => (t.x === x) && (t.y === y))) {
						const square: EncounterMapSquareModel = {
							x: x,
							y: y,
							type: EncounterMapSquareType.Clear
						};
						map.push(square);
					}
				}
			}
		}

		while (Random.randomNumber(3, rng) !== 0) {
			// Add a blob of solid rock
			const start = Collections.draw(map);
			const blob = EncounterMapLogic.getFloorBlob(map, start, rng);
			map = map.filter(sq => !blob.includes(sq));
		}

		while (Random.randomNumber(3, rng) !== 0) {
			// Add a blob of obstructed terrain
			const start = Collections.draw(map);
			const blob = EncounterMapLogic.getFloorBlob(map, start, rng);
			blob.forEach(sq => sq.type = EncounterMapSquareType.Obstructed);
		}

		return map;
	};

	static getFloorBlob = (squares: EncounterMapSquareModel[], start: { x: number, y: number }, rng: () => number = Math.random) => {
		const blob: EncounterMapSquareModel[] = [];

		const square = squares.find(sq => (sq.x === start.x) && (sq.y === start.y));
		if (square) {
			blob.push(square);
		}

		while ((blob.length < 5) || (Random.randomNumber(10, rng) !== 0)) {
			let candidates: EncounterMapSquareModel[] = squares;
			if (blob.length > 0) {
				candidates = EncounterMapLogic.getAdjacentSquares(squares, blob, [ 'n', 'e', 's', 'w' ]);
			}

			if (candidates.length === 0) {
				return blob;
			}

			const square = Collections.draw(candidates);
			blob.push(square);
		}

		return blob;
	};

	static getWallBlob = (squares: EncounterMapSquareModel[], start: { x: number, y: number }, rng: () => number = Math.random) => {
		const blob: { x: number, y: number }[] = [ start ];

		while ((blob.length < 5) || (Random.randomNumber(10, rng) !== 0)) {
			let candidates: { x: number, y: number }[] = squares;
			if (blob.length > 0) {
				candidates = EncounterMapLogic.getAdjacentWalls(squares, blob, [ 'n', 'e', 's', 'w' ]);
			}

			if (candidates.length === 0) {
				return blob;
			}

			const square = Collections.draw(candidates);
			blob.push(square);
		}

		return blob;
	};

	static getDimensions = (map: EncounterMapSquareModel[]) => {
		const dims = {
			left: Number.MAX_VALUE,
			top: Number.MAX_VALUE,
			right: Number.MIN_VALUE,
			bottom: Number.MIN_VALUE
		};

		map.forEach(sq => {
			dims.left = Math.min(dims.left, sq.x);
			dims.top = Math.min(dims.top, sq.y);
			dims.right = Math.max(dims.right, sq.x);
			dims.bottom = Math.max(dims.bottom, sq.y);
		});

		return dims;
	};

	static getAdjacentSquares = (map: EncounterMapSquareModel[], squares: { x: number; y: number }[], directions: ('n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw')[] = []) => {
		const adj: EncounterMapSquareModel[] = [];

		const checkSquare = (sq: { x: number, y: number }) => {
			if (!squares.find(s => (s.x === sq.x) && (s.y === sq.y)) && !adj.find(s => (s.x === sq.x) && (s.y === sq.y))) {
				const mapSquare = map.find(s => (s.x === sq.x) && (s.y === sq.y));
				if (mapSquare) {
					adj.push(mapSquare);
				}
			}
		};

		squares.forEach(square => {
			if ((directions.length === 0) || (directions.includes('n'))) {
				const sq = { x: square.x, y: square.y - 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('ne'))) {
				const sq = { x: square.x + 1, y: square.y - 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('e'))) {
				const sq = { x: square.x + 1, y: square.y };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('se'))) {
				const sq = { x: square.x + 1, y: square.y + 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('s'))) {
				const sq = { x: square.x, y: square.y + 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('sw'))) {
				const sq = { x: square.x - 1, y: square.y + 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('w'))) {
				const sq = { x: square.x - 1, y: square.y };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('nw'))) {
				const sq = { x: square.x - 1, y: square.y - 1 };
				checkSquare(sq);
			}
		});

		return adj;
	};

	static getAdjacentWalls = (map: EncounterMapSquareModel[], squares: { x: number; y: number }[], directions: ('n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw')[] = []) => {
		const adj: { x: number; y: number }[] = [];

		const checkSquare = (sq: { x: number, y: number }) => {
			if (!squares.find(s => (s.x === sq.x) && (s.y === sq.y)) && !adj.find(s => (s.x === sq.x) && (s.y === sq.y))) {
				const mapSquare = map.find(s => (s.x === sq.x) && (s.y === sq.y));
				if (!mapSquare) {
					adj.push(sq);
				}
			}
		};

		squares.forEach(square => {
			if ((directions.length === 0) || (directions.includes('n'))) {
				const sq = { x: square.x, y: square.y - 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('ne'))) {
				const sq = { x: square.x + 1, y: square.y - 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('e'))) {
				const sq = { x: square.x + 1, y: square.y };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('se'))) {
				const sq = { x: square.x + 1, y: square.y + 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('s'))) {
				const sq = { x: square.x, y: square.y + 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('sw'))) {
				const sq = { x: square.x - 1, y: square.y + 1 };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('w'))) {
				const sq = { x: square.x - 1, y: square.y };
				checkSquare(sq);
			}
			if ((directions.length === 0) || (directions.includes('nw'))) {
				const sq = { x: square.x - 1, y: square.y - 1 };
				checkSquare(sq);
			}
		});

		return adj;
	};

	static getDistanceAny = (aSquares: { x: number, y: number }[], bSquares: { x: number, y: number }[]) => {
		const distances = aSquares.flatMap(a => bSquares.map(b => EncounterMapLogic.getDistance(a, b)));
		return Math.min(...distances);
	};

	static getDistance = (a: { x: number, y: number }, b: { x: number, y: number }) => {
		const x2 = Math.pow(a.x - b.x, 2);
		const y2 = Math.pow(a.y - b.y, 2);
		const hyp = Math.sqrt(x2 + y2);
		return Math.floor(hyp);
	};

	static getDirection = (a: { x: number, y: number }, b: { x: number, y: number }) => {
		const y = -(b.y) - -(a.y);
		const x = b.x - a.x;
		const radians = Math.atan2(y, x);
		const degrees = radians * 180 / Math.PI;
		return 90 - degrees;
	};

	static canSeeAny = (aSquares: { x: number, y: number }[], bSquares: { x: number, y: number }[]) => {
		return aSquares.some(a => bSquares.some(b => EncounterMapLogic.canSee(a, b)));
	};

	static canSee = (a: { x: number, y: number }, b: { x: number, y: number }) => {
		// For now, assume line-of-sight is always OK
		return true;
	};
}
