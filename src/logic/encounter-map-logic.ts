import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import type { EncounterMapSquareModel } from '../models/encounter';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

export class EncounterMapLogic {
	static generateEncounterMap = (rng: () => number): EncounterMapSquareModel[] => {
		return Random.randomBoolean(rng) ? EncounterMapLogic.generateDungeonMap(rng) : EncounterMapLogic.generateCavernMap(rng);
	};

	static generateDungeonMap = (rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];

		while (map.length < 500) {
			const dirs = [ 'n', 'e', 's', 'w' ];
			const dir = dirs[Random.randomNumber(4, rng)];

			// 0, 1 = room, 2 = corridor
			const type = Random.randomNumber(3, rng);

			const size = {
				width: (type === 2) && ((dir === 'n') || (dir === 's')) ? 2 : Random.dice(2, rng),
				height: (type === 2) && ((dir === 'e') || (dir === 'w')) ? 2 : Random.dice(2, rng)
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
			// Add a blob of obstructed terrain
			const start = Collections.draw(map, rng);
			const blob = EncounterMapLogic.getFloorBlob(map, start, rng);
			blob.forEach(sq => sq.type = EncounterMapSquareType.Obstructed);
		}

		return map;
	};

	static generateCavernMap = (rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [
			{
				x: 0,
				y: 0,
				type: EncounterMapSquareType.Clear
			}
		];

		while (map.length < 1000) {
			const walls = EncounterMapLogic.getAdjacentWalls(map, map, [ 'n', 'e', 's', 'w' ]);
			const wall = Collections.draw(walls, rng);

			const blob = EncounterMapLogic.getWallBlob(map, wall, rng);
			blob.forEach(sq => {
				const square: EncounterMapSquareModel = {
					x: sq.x,
					y: sq.y,
					type: EncounterMapSquareType.Clear
				};
				map.push(square);
			});
		}

		while (Random.randomNumber(3, rng) !== 0) {
			// Add a blob of obstructed terrain
			const start = Collections.draw(map, rng);
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

	static canSeeAny = (
		edges: { horizontal: { start: number, end: number, y: number }[], vertical: { start: number, end: number, x: number }[] },
		aSquares: { x: number, y: number }[],
		bSquares: { x: number, y: number }[]
	) => {
		return aSquares.some(a => bSquares.some(b => EncounterMapLogic.canSee(edges, a, b)));
	};

	static canSee = (
		edges: { horizontal: { start: number, end: number, y: number }[], vertical: { start: number, end: number, x: number }[] },
		a: { x: number, y: number },
		b: { x: number, y: number }
	) => {
		const midA = { x: a.x + 0.5, y: a.y + 0.5 };
		const midB = { x: b.x + 0.5, y: b.y + 0.5 };
		return !(edges.horizontal.some(edge => Utils.intersects({ a: midA, b: midB }, { a: { x: edge.start, y: edge.y }, b: { x: edge.end, y: edge.y } }))
			|| edges.vertical.some(edge => Utils.intersects({ a: midA, b: midB }, { a: { x: edge.x, y: edge.start }, b: { x: edge.x, y: edge.end } })));
	};

	static getMapEdges = (map: EncounterMapSquareModel[]) => {
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
