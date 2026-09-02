import { StrongholdLogic } from './stronghold-logic';

import type { StructureModel } from '../models/structure';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

// A square of the map grid; each structure fills one square, and every other
// square is a street that people can walk along
interface Square {
	x: number;
	y: number;
}

// A position on the map, in the same units as the grid
interface Point {
	x: number;
	y: number;
}

export class StrongholdMapLogic {
	// How far a person keeps away from a structure's square. Structures are
	// rotated within their square, so they can overhang it by about 0.14, and a
	// person is 0.045 across.
	static clearance = 0.2;

	// How far from the middle of the street a person's own lane can be. Half a
	// square, less the clearance above, is the most that would be safe.
	static laneWidth = 0.12;

	// How tightly people turn corners
	static cornerRadius = 0.25;

	// The squares that people can walk on: everything within the map's borders
	// that isn't a structure, less any courtyard which is walled in.
	static getStreets = (structures: StructureModel[]) => {
		const dims = StrongholdLogic.getDimensions(structures);

		// The map is drawn with a one-square border, which people can walk in
		const left = dims.left - 1;
		const top = dims.top - 1;
		const right = dims.right + 1;
		const bottom = dims.bottom + 1;

		const built = new Set(structures.map(s => StrongholdMapLogic.getKey(s.position)));

		const open = new Set<string>();
		for (let x = left; x <= right; ++x) {
			for (let y = top; y <= bottom; ++y) {
				const key = StrongholdMapLogic.getKey({ x: x, y: y });
				if (!built.has(key)) {
					open.add(key);
				}
			}
		}

		// Flood fill from a corner of the border, which is always empty. This
		// drops any courtyard enclosed by structures, where a person could
		// otherwise be stranded with nowhere to walk.
		return StrongholdMapLogic.getConnected(open, { x: left, y: top });
	};

	// A closed circuit of the streets for a single person, as an SVG path,
	// along with its length so that everyone can be made to walk at one pace.
	static getWalk = (structures: StructureModel[], streets: Square[], rng: () => number) => {
		if (streets.length < 2) {
			return null;
		}

		const open = new Set(streets.map(StrongholdMapLogic.getKey));

		// Three or four places to head for, kept apart from each other so that
		// nobody ends up shuffling around a single corner. If the streets are too
		// cramped for that, settle for stops which are closer together.
		const count = Random.randomNumber(2, rng) + 3;
		const shuffled = Collections.shuffle([ ...streets ], rng);
		let stops: Square[] = [];
		for (let apart = 3; (apart > 0) && (stops.length < 3); --apart) {
			stops = [];
			shuffled.forEach(square => {
				const isSpacedOut = stops.every(stop => StrongholdMapLogic.getDistance(stop, square) >= apart);
				if ((stops.length < count) && isSpacedOut) {
					stops.push(square);
				}
			});
		}
		if (stops.length < 3) {
			return null;
		}

		// Everyone walks in a lane of their own, rather than in single file down
		// the middle of the street
		const lane = {
			x: ((Random.randomDecimal(rng) * 2) - 1) * StrongholdMapLogic.laneWidth,
			y: ((Random.randomDecimal(rng) * 2) - 1) * StrongholdMapLogic.laneWidth
		};

		// Join the stops up by the shortest way round. Each leg is straightened
		// out on its own, so that people cut diagonally across open ground instead
		// of tracing every step of the grid, but still call at each of their stops.
		// The last corner of each leg is dropped, being the first of the next one.
		const corners: Point[] = [];
		stops.forEach((stop, n) => {
			const leg = StrongholdMapLogic
				.getRoute(open, stop, stops[(n + 1) % stops.length])
				.map(square => ({
					x: square.x + 0.5 + lane.x,
					y: square.y + 0.5 + lane.y
				}));
			const straightened = StrongholdMapLogic.straighten(leg, structures);
			corners.push(...straightened.slice(0, straightened.length - 1));
		});
		if (corners.length < 3) {
			return null;
		}

		let distance = 0;
		corners.forEach((corner, n) => {
			distance += StrongholdMapLogic.getDistance(corner, corners[(n + 1) % corners.length]);
		});

		return {
			path: StrongholdMapLogic.getPathData(corners),
			distance: distance
		};
	};

	// The open squares which can be reached from the given square, by stepping
	// from one to the next. Steps are never diagonal, as that would squeeze a
	// person between the corners of two structures.
	static getConnected = (open: Set<string>, from: Square) => {
		const connected: Square[] = [];

		const seen = new Set<string>([ StrongholdMapLogic.getKey(from) ]);
		const queue = [ from ];
		while (queue.length > 0) {
			const square = queue.shift() as Square;
			connected.push(square);

			StrongholdMapLogic.getAdjacent(square).forEach(adj => {
				const key = StrongholdMapLogic.getKey(adj);
				if (open.has(key) && !seen.has(key)) {
					seen.add(key);
					queue.push(adj);
				}
			});
		}

		return connected;
	};

	// The shortest way from one square to another, including both ends
	static getRoute = (open: Set<string>, from: Square, to: Square) => {
		const previous = new Map<string, Square | null>([ [ StrongholdMapLogic.getKey(from), null ] ]);

		const queue = [ from ];
		while (queue.length > 0) {
			const square = queue.shift() as Square;
			if ((square.x === to.x) && (square.y === to.y)) {
				const route: Square[] = [];
				let step: Square | null = square;
				while (step !== null) {
					route.unshift(step);
					step = previous.get(StrongholdMapLogic.getKey(step)) ?? null;
				}
				return route;
			}

			StrongholdMapLogic.getAdjacent(square).forEach(adj => {
				const key = StrongholdMapLogic.getKey(adj);
				if (open.has(key) && !previous.has(key)) {
					previous.set(key, square);
					queue.push(adj);
				}
			});
		}

		return [];
	};

	// Remove any corner of a leg which can be cut off by walking straight
	// between its neighbours; the two ends of the leg stay where they are
	static straighten = (points: Point[], structures: StructureModel[]) => {
		const corners = [ ...points ];

		let n = 1;
		while (n < corners.length - 1) {
			if (StrongholdMapLogic.canWalk(corners[n - 1], corners[n + 1], structures)) {
				// Removing this corner may have opened up the one before it
				corners.splice(n, 1);
				n = Math.max(n - 1, 1);
			} else {
				n += 1;
			}
		}

		return corners;
	};

	// Can a person walk straight from one point to another, or is there a
	// structure in the way?
	static canWalk = (from: Point, to: Point, structures: StructureModel[]) => {
		return structures.every(structure => !StrongholdMapLogic.isBlocked(from, to, structure));
	};

	static isBlocked = (from: Point, to: Point, structure: StructureModel) => {
		const minX = structure.position.x - StrongholdMapLogic.clearance;
		const maxX = structure.position.x + 1 + StrongholdMapLogic.clearance;
		const minY = structure.position.y - StrongholdMapLogic.clearance;
		const maxY = structure.position.y + 1 + StrongholdMapLogic.clearance;

		const dx = to.x - from.x;
		const dy = to.y - from.y;

		// Trim the line back to each edge of the structure's square in turn; if
		// any of it is left, it passes through the structure
		const edges = [
			{ towards: -dx, distance: from.x - minX },
			{ towards: dx, distance: maxX - from.x },
			{ towards: -dy, distance: from.y - minY },
			{ towards: dy, distance: maxY - from.y }
		];

		let start = 0;
		let end = 1;
		for (let n = 0; n !== edges.length; ++n) {
			const edge = edges[n];
			if (edge.towards === 0) {
				// The line runs alongside this edge; either it's clear of the
				// square altogether, or this edge tells us nothing
				if (edge.distance < 0) {
					return false;
				}
			} else if (edge.towards < 0) {
				start = Math.max(start, edge.distance / edge.towards);
			} else {
				end = Math.min(end, edge.distance / edge.towards);
			}
		}

		return start <= end;
	};

	// A closed path through the given corners, rounded off so that people turn
	// corners rather than pivoting on the spot
	static getPathData = (corners: Point[]) => {
		const format = (point: Point) => `${point.x.toFixed(3)},${point.y.toFixed(3)}`;

		const parts: string[] = [];
		corners.forEach((corner, n) => {
			const previous = corners[(n + corners.length - 1) % corners.length];
			const next = corners[(n + 1) % corners.length];

			// Never cut back further than halfway along either side, or the
			// curves of two corners would run into each other
			const radius = Math.min(
				StrongholdMapLogic.cornerRadius,
				StrongholdMapLogic.getDistance(previous, corner) / 2,
				StrongholdMapLogic.getDistance(corner, next) / 2
			);

			const into = StrongholdMapLogic.getPointBetween(corner, previous, radius);
			const outOf = StrongholdMapLogic.getPointBetween(corner, next, radius);

			parts.push(`${n === 0 ? 'M' : 'L'}${format(into)}`);
			parts.push(`Q${format(corner)} ${format(outOf)}`);
		});

		return `${parts.join(' ')} Z`;
	};

	static getPointBetween = (from: Point, to: Point, distance: number) => {
		const length = StrongholdMapLogic.getDistance(from, to);
		if (length === 0) {
			return from;
		}

		return {
			x: from.x + (((to.x - from.x) / length) * distance),
			y: from.y + (((to.y - from.y) / length) * distance)
		};
	};

	static getDistance = (from: Point, to: Point) => {
		return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
	};

	static getAdjacent = (square: Square) => {
		return [
			{ x: square.x, y: square.y - 1 },
			{ x: square.x + 1, y: square.y },
			{ x: square.x, y: square.y + 1 },
			{ x: square.x - 1, y: square.y }
		];
	};

	static getKey = (square: Square) => {
		return `${square.x},${square.y}`;
	};
}
