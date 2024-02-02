import type { EncounterMapEdgeModel, EncounterMapSquareModel } from '../models/encounter';

import { Collections } from '../utils/collections';
import { HashTable } from '../utils/hash-table';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

export class EncounterMapLogic {
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

			const square = Collections.draw(candidates, rng);
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

			const square = Collections.draw(candidates, rng);
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
				if (!map.find(s => (s.x === sq.x) && (s.y === sq.y))) {
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

	static getCenter = (squares: { x: number, y: number }[]) => {
		return {
			x: Collections.mean(squares, s => s.x),
			y: Collections.mean(squares, s => s.y)
		};
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

	static canSeeAny = (edges: EncounterMapEdgeModel, aSquares: { x: number, y: number }[], bSquares: { x: number, y: number }[]) => {
		return aSquares.some(a => bSquares.some(b => EncounterMapLogic.canSee(edges, a, b)));
	};

	static visibilityCache = new HashTable<boolean>();

	static canSee = (edges: EncounterMapEdgeModel, a: { x: number, y: number }, b: { x: number, y: number }) => {
		// Check the cache
		const cached = EncounterMapLogic.visibilityCache.search(`${a.x} ${a.y} - ${b.x} ${b.y}`);
		if (cached !== null) {
			return cached;
		}

		// Do the calculation
		const midA = { x: a.x + 0.5, y: a.y + 0.5 };
		const midB = { x: b.x + 0.5, y: b.y + 0.5 };
		const visible = !(edges.horizontal.some(edge => Utils.intersects({ a: midA, b: midB }, { a: { x: edge.start, y: edge.y }, b: { x: edge.end, y: edge.y } }))
			|| edges.vertical.some(edge => Utils.intersects({ a: midA, b: midB }, { a: { x: edge.x, y: edge.start }, b: { x: edge.x, y: edge.end } })));

		// Cache this value
		EncounterMapLogic.visibilityCache.insert(`${a.x} ${a.y} - ${b.x} ${b.y}`, visible);
		EncounterMapLogic.visibilityCache.insert(`${b.x} ${b.y} - ${a.x} ${a.y}`, visible);

		return visible;
	};

	static getMapEdges = (map: EncounterMapSquareModel[]): EncounterMapEdgeModel => {
		const horizontal: { start: number, end: number, y: number }[] = [];
		EncounterMapLogic.getAdjacentWalls(map, map, [ 'n' ]).forEach(wall => horizontal.push({ start: wall.x, end: wall.x + 1, y: wall.y + 1 }));
		EncounterMapLogic.getAdjacentWalls(map, map, [ 's' ]).forEach(wall => horizontal.push({ start: wall.x, end: wall.x + 1, y: wall.y }));

		const vertical: { start: number, end: number, x: number }[] = [];
		EncounterMapLogic.getAdjacentWalls(map, map, [ 'e' ]).forEach(wall => vertical.push({ start: wall.y, end: wall.y + 1, x: wall.x }));
		EncounterMapLogic.getAdjacentWalls(map, map, [ 'w' ]).forEach(wall => vertical.push({ start: wall.y, end: wall.y + 1, x: wall.x + 1 }));

		const horizontalReduced: { start: number, end: number, y: number }[] = [];
		horizontal.sort((a, b) => a.start - b.start).forEach(edge => {
			const e = horizontalReduced.find(e => (e.y === edge.y) && (e.end === edge.start));
			if (e) {
				e.end = edge.end;
			} else {
				horizontalReduced.push(edge);
			}
		});

		const verticalReduced: { start: number, end: number, x: number }[] = [];
		vertical.sort((a, b) => a.start - b.start).forEach(edge => {
			const e = verticalReduced.find(e => (e.x === edge.x) && (e.end === edge.start));
			if (e) {
				e.end = edge.end;
			} else {
				verticalReduced.push(edge);
			}
		});

		return {
			horizontal: horizontalReduced,
			vertical: verticalReduced
		};
	};
}
