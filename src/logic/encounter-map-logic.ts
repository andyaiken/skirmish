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
				const adj = EncounterMapLogic.getEdges(map, dir as 'n' | 'e' | 's' | 'w');
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
			// Add a blob of blocked terrain
			const blob = EncounterMapLogic.getBlob(map, rng);
			map = map.filter(sq => !blob.includes(sq));
		}

		while (Random.randomNumber(3, rng) !== 0) {
			// Add a blob of obstructed terrain
			const blob = EncounterMapLogic.getBlob(map, rng);
			blob.forEach(sq => sq.type = EncounterMapSquareType.Obstructed);
		}

		return map;
	};

	static getBlob = (map: EncounterMapSquareModel[], rng: () => number) => {
		const blob: EncounterMapSquareModel[] = [];
		while ((blob.length < 5) || (Random.randomNumber(10, rng) !== 0)) {
			const candidates = ((blob.length === 0) ? map : EncounterMapLogic.getAdjacentSquares(map, blob, [ 'n', 'e', 's', 'w' ])).filter(c => c.type === EncounterMapSquareType.Clear);

			if (candidates.length === 0) {
				return blob;
			}

			blob.push(Collections.draw(candidates));
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

		squares.forEach(square => {
			if ((directions.length === 0) || (directions.includes('n'))) {
				const n = map.find(sq => (sq.x === square.x) && (sq.y === square.y - 1));
				if (n) {
					adj.push(n);
				}
			}
			if ((directions.length === 0) || (directions.includes('ne'))) {
				const ne = map.find(sq => (sq.x === square.x + 1) && (sq.y === square.y - 1));
				if (ne) {
					adj.push(ne);
				}
			}
			if ((directions.length === 0) || (directions.includes('e'))) {
				const e = map.find(sq => (sq.x === square.x + 1) && (sq.y === square.y));
				if (e) {
					adj.push(e);
				}
			}
			if ((directions.length === 0) || (directions.includes('se'))) {
				const se = map.find(sq => (sq.x === square.x + 1) && (sq.y === square.y + 1));
				if (se) {
					adj.push(se);
				}
			}
			if ((directions.length === 0) || (directions.includes('s'))) {
				const s = map.find(sq => (sq.x === square.x) && (sq.y === square.y + 1));
				if (s) {
					adj.push(s);
				}
			}
			if ((directions.length === 0) || (directions.includes('sw'))) {
				const sw = map.find(sq => (sq.x === square.x - 1) && (sq.y === square.y + 1));
				if (sw) {
					adj.push(sw);
				}
			}
			if ((directions.length === 0) || (directions.includes('w'))) {
				const w = map.find(sq => (sq.x === square.x - 1) && (sq.y === square.y));
				if (w) {
					adj.push(w);
				}
			}
			if ((directions.length === 0) || (directions.includes('nw'))) {
				const nw = map.find(sq => (sq.x === square.x - 1) && (sq.y === square.y - 1));
				if (nw) {
					adj.push(nw);
				}
			}
		});

		return adj.filter(sq => !squares.find(s => (s.x === sq.x) && (s.y === sq.y)));
	};

	static getEdges = (squares: EncounterMapSquareModel[], direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw') => {
		const adj: { x: number; y: number }[] = [];

		squares.forEach(square => {
			const sq = { x: square.x, y: square.y };
			switch (direction) {
				case 'n':
					sq.y -= 1;
					break;
				case 'ne':
					sq.x += 1;
					sq.y -= 1;
					break;
				case 'e':
					sq.x += 1;
					break;
				case 'se':
					sq.x += 1;
					sq.y += 1;
					break;
				case 's':
					sq.y += 1;
					break;
				case 'sw':
					sq.x -= 1;
					sq.y += 1;
					break;
				case 'w':
					sq.x -= 1;
					break;
				case 'nw':
					sq.x -= 1;
					sq.y -= 1;
					break;
			}
			if (!squares.find(s => (s.x === sq.x) && (s.y === sq.y))) {
				adj.push(sq);
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