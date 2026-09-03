import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import type { EncounterMapSquareModel } from '../models/encounter';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

import { EncounterMapLogic } from '../logic/encounter-map-logic';

export class EncounterMapGenerator {
	static terrainWeights: { terrains: string[], dungeon: number, ruin: number, cavern: number, street: number, arena: number, building: number, warren: number }[] = [
		{
			terrains: [ 'Canyons', 'Mountains', 'Plateaus', 'Volcanic' ],
			dungeon: 2,
			ruin: 3,
			cavern: 8,
			street: 1,
			arena: 1,
			building: 1,
			warren: 3
		},
		{
			terrains: [ 'Fens', 'Forest', 'Jungle', 'Lakes', 'Marshland', 'Rainforest', 'Riverlands', 'Taiga', 'Wetlands' ],
			dungeon: 2,
			ruin: 5,
			cavern: 4,
			street: 1,
			arena: 1,
			building: 2,
			warren: 3
		},
		{
			terrains: [ 'Badlands', 'Desert', 'Plains', 'Salt flats', 'Scrubland', 'Steppe', 'Valleys' ],
			dungeon: 2,
			ruin: 4,
			cavern: 1,
			street: 6,
			arena: 2,
			building: 3,
			warren: 1
		}
	];

	static drawMapType = (terrain: string, rng: () => number): ((size: number, rng: () => number) => EncounterMapSquareModel[]) => {
		const weights = EncounterMapGenerator.terrainWeights.find(tw => tw.terrains.includes(terrain));

		const mapTypes: ((size: number, rng: () => number) => EncounterMapSquareModel[])[] = [];
		const add = (fn: (size: number, rng: () => number) => EncounterMapSquareModel[], weight: number) => {
			for (let n = 0; n < weight; ++n) {
				mapTypes.push(fn);
			}
		};

		add(EncounterMapGenerator.generateDungeonMap, weights ? weights.dungeon : 1);
		add(EncounterMapGenerator.generateRuinMap, weights ? weights.ruin : 1);
		add(EncounterMapGenerator.generateCavernMap, weights ? weights.cavern : 1);
		add(EncounterMapGenerator.generateStreetMap, weights ? weights.street : 1);
		add(EncounterMapGenerator.generateArenaMap, weights ? weights.arena : 1);
		add(EncounterMapGenerator.generateBuildingMap, weights ? weights.building : 1);
		add(EncounterMapGenerator.generateWarrenMap, weights ? weights.warren : 1);

		return Collections.draw(mapTypes, rng);
	};

	static generateEncounterMap = (rng: () => number, terrain = ''): EncounterMapSquareModel[] => {
		EncounterMapLogic.visibilityCache.reset();

		// Obstructed terrain is added by the individual generators rather than here, so that a map
		// type can opt out of it - the arena is meant to stay open.
		const fn = EncounterMapGenerator.drawMapType(terrain, rng);
		const map = fn(400, rng);

		return EncounterMapGenerator.simplifyMap(map);
	};

	static generateDungeonMap = (size: number, rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];

		while (map.length < size) {
			const dirs = [ 'n', 'e', 's', 'w' ];
			const dir = Collections.draw(dirs, rng);

			// 0, 1 = room, 2 = corridor
			const type = Random.randomNumber(3, rng);

			const size = {
				width: (type === 2) && ((dir === 'n') || (dir === 's')) ? 2 : Random.dice(2, rng),
				height: (type === 2) && ((dir === 'e') || (dir === 'w')) ? 2 : Random.dice(2, rng)
			};

			const position = { x: 0, y: 0 };
			if (map.length > 0) {
				const adj = EncounterMapLogic.getAdjacentWalls(map, map, [ dir as 'n' | 'e' | 's' | 'w' ]);
				const sq = Collections.draw(adj, rng);
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

		EncounterMapGenerator.addObstructedBlobs(map, rng);

		return map;
	};

	static generateRuinMap = (size: number, rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];

		while (map.length < size) {
			const dirs = [ 'n', 'e', 's', 'w' ];
			const dir = Collections.draw(dirs, rng);

			if (Random.randomBoolean(rng)) {
				// 0, 1 = room, 2 = corridor
				const type = Random.randomNumber(3, rng);

				const size = {
					width: (type === 2) && ((dir === 'n') || (dir === 's')) ? 2 : Random.dice(2, rng),
					height: (type === 2) && ((dir === 'e') || (dir === 'w')) ? 2 : Random.dice(2, rng)
				};

				const position = { x: 0, y: 0 };
				if (map.length > 0) {
					const adj = EncounterMapLogic.getAdjacentWalls(map, map, [ dir as 'n' | 'e' | 's' | 'w' ]);
					const sq = Collections.draw(adj, rng);
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
			} else {
				const walls = EncounterMapLogic.getAdjacentWalls(map, map, [ 'n', 'e', 's', 'w' ]);
				if (walls.length > 0) {
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
			}
		}

		EncounterMapGenerator.addObstructedBlobs(map, rng);

		return map;
	};

	static generateCavernMap = (size: number, rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [
			{
				x: 0,
				y: 0,
				type: EncounterMapSquareType.Clear
			}
		];

		while (map.length < size) {
			const walls = EncounterMapLogic.getAdjacentWalls(map, map, [ 'n', 'e', 's', 'w' ]);
			if (walls.length > 0) {
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
		}

		EncounterMapGenerator.addObstructedBlobs(map, rng);

		return map;
	};

	static generateStreetMap = (size: number, rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];

		const intersections: { x: number, y: number, used: { n: boolean, e: boolean, s: boolean, w: boolean } }[] = [];

		while (map.length < size) {
			const position = { x: 0, y: 0 };
			const length = 8 + Random.dice(5, rng);

			if (intersections.length === 0) {
				const dirs = [ 'n', 'e', 's', 'w' ];
				const dir = Collections.draw(dirs, rng);
				const size = {
					width: (dir === 'n') || (dir === 's') ? 3 : length,
					height: (dir === 'e') || (dir === 'w') ? 3 : length
				};
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

				intersections.push({ x: position.x + 1, y: position.y + 1, used: { n: dir === 'n', e: dir === 'e', s: dir === 's', w: dir === 'w' } });
				intersections.push({ x: position.x + size.width - 2, y: position.y + size.height - 2, used: { n: dir === 's', e: dir === 'w', s: dir === 'n', w: dir === 'e' } });
			} else {
				const intersection = Collections.draw(intersections, rng);
				const dirs = [];
				if (!intersection.used.n) {
					dirs.push('n');
				}
				if (!intersection.used.e) {
					dirs.push('e');
				}
				if (!intersection.used.s) {
					dirs.push('s');
				}
				if (!intersection.used.w) {
					dirs.push('w');
				}
				if (dirs.length > 0) {
					const dir = Collections.draw(dirs, rng);
					if (dir === 'n') {
						position.x = intersection.x - 1;
						position.y = intersection.y - (length - 2);
					}
					if (dir === 'e') {
						position.x = intersection.x - 1;
						position.y = intersection.y - 1;
					}
					if (dir === 's') {
						position.x = intersection.x - 1;
						position.y = intersection.y - 1;
					}
					if (dir === 'w') {
						position.x = intersection.x - (length - 2);
						position.y = intersection.y - 1;
					}

					const size = {
						width: (dir === 'n') || (dir === 's') ? 3 : length,
						height: (dir === 'e') || (dir === 'w') ? 3 : length
					};
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

					if (dir === 'n') {
						intersection.used.n = true;
						intersections.push({ x: intersection.x, y: intersection.y - length + 3, used: { n: false, e: false, s: true, w: false } });
					}
					if (dir === 'e') {
						intersection.used.e = true;
						intersections.push({ x: intersection.x + length - 3, y: intersection.y, used: { n: false, e: false, s: false, w: true } });
					}
					if (dir === 's') {
						intersection.used.s = true;
						intersections.push({ x: intersection.x, y: intersection.y + length - 3, used: { n: true, e: false, s: false, w: false } });
					}
					if (dir === 'w') {
						intersection.used.w = true;
						intersections.push({ x: intersection.x - length + 3, y: intersection.y, used: { n: false, e: true, s: false, w: false } });
					}
				}
			}
		}

		EncounterMapGenerator.addObstructedBlobs(map, rng);

		return map;
	};

	static generateArenaMap = (size: number, rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];

		const radius = Math.sqrt(size / Math.PI);
		const aspect = 1 + (Random.randomDecimal(rng) / 2);
		const wide = Random.randomBoolean(rng);
		const radiusX = wide ? radius * aspect : radius / aspect;
		const radiusY = wide ? radius / aspect : radius * aspect;

		for (let x = Math.ceil(-radiusX); x <= Math.floor(radiusX); ++x) {
			for (let y = Math.ceil(-radiusY); y <= Math.floor(radiusY); ++y) {
				const dx = x / radiusX;
				const dy = y / radiusY;
				if (((dx * dx) + (dy * dy)) <= 1) {
					const square: EncounterMapSquareModel = {
						x: x,
						y: y,
						type: EncounterMapSquareType.Clear
					};
					map.push(square);
				}
			}
		}

		EncounterMapGenerator.addPillars(map, rng, 1 + Random.randomNumber(4, rng));

		return map;
	};

	static addObstructedBlobs = (map: EncounterMapSquareModel[], rng: () => number) => {
		while (Random.randomNumber(3, rng) !== 0) {
			const start = Collections.draw(map, rng);
			const blob = EncounterMapLogic.getFloorBlob(map, start, rng);
			blob.forEach(sq => sq.type = EncounterMapSquareType.Obstructed);
		}
	};

	static addPillars = (map: EncounterMapSquareModel[], rng: () => number, count: number) => {
		const floor = new Set(map.map(sq => `${sq.x} ${sq.y}`));

		for (let n = 0; n < count; ++n) {
			const clear = map.filter(sq => sq.type === EncounterMapSquareType.Clear);
			const inner = clear.filter(sq => [ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ].every(([ dx, dy ]) => floor.has(`${sq.x + dx} ${sq.y + dy}`)));

			const candidates = inner.length > 0 ? inner : clear;
			if (candidates.length === 0) {
				return;
			}

			const sq = Collections.draw(candidates, rng);
			sq.type = EncounterMapSquareType.Obstructed;

			if (Random.randomBoolean(rng)) {
				const dir = Collections.draw([ 'n', 'e', 's', 'w' ], rng);
				const x = sq.x + (dir === 'e' ? 1 : 0) - (dir === 'w' ? 1 : 0);
				const y = sq.y + (dir === 's' ? 1 : 0) - (dir === 'n' ? 1 : 0);
				const adj = map.find(s => (s.x === x) && (s.y === y));
				if (adj) {
					adj.type = EncounterMapSquareType.Obstructed;
				}
			}
		}
	};

	static generateBuildingMap = (size: number, rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];
		const floor = new Set<string>();

		const carve = (x: number, y: number) => {
			if (!floor.has(`${x} ${y}`)) {
				floor.add(`${x} ${y}`);
				map.push({
					x: x,
					y: y,
					type: EncounterMapSquareType.Clear
				});
			}
		};

		// A size 2 combatant has to be able to stand in the smallest room.
		const minRoom = 4;

		const divide = (x: number, y: number, width: number, height: number) => {
			const canSplitVertically = width >= ((2 * minRoom) + 1);
			const canSplitHorizontally = height >= ((2 * minRoom) + 1);

			const stop = !canSplitVertically && !canSplitHorizontally;

			// Stopping early once a region is room-sized leaves a few large rooms rather than a grid of identical small ones.
			const stopEarly = ((width * height) <= 80) && Random.randomBoolean(rng);

			if (stop || stopEarly) {
				for (let cx = x; cx < x + width; ++cx) {
					for (let cy = y; cy < y + height; ++cy) {
						carve(cx, cy);
					}
				}
				return;
			}

			// Favour the longer axis, so rooms stay roughly rectangular
			let vertical = canSplitVertically;
			if (canSplitVertically && canSplitHorizontally) {
				vertical = Random.randomDecimal(rng) < (width / (width + height));
			}

			// Averaging two draws pulls the wall towards the middle; a flat draw slices thin strips off the edge of the building just as often
			const splitPoint = (extent: number) => {
				const range = extent - (2 * minRoom);
				return minRoom + Math.round((Random.randomNumber(range, rng) + Random.randomNumber(range, rng)) / 2);
			};

			if (vertical) {
				const wall = x + splitPoint(width);

				divide(x, y, wall - x, height);
				divide(wall + 1, y, x + width - wall - 1, height);

				EncounterMapGenerator.addDoorway(floor, carve, wall, y, height, true, rng);
			} else {
				const wall = y + splitPoint(height);

				divide(x, y, width, wall - y);
				divide(x, wall + 1, width, y + height - wall - 1);

				EncounterMapGenerator.addDoorway(floor, carve, wall, x, width, false, rng);
			}
		};

		// The footprint pays for its own walls, so it is larger than the square count asked for
		const footprint = Math.sqrt(size * 1.2);
		const aspect = 1 + (Random.randomDecimal(rng) / 2);
		const wide = Random.randomBoolean(rng);

		divide(
			0,
			0,
			Math.round(wide ? footprint * aspect : footprint / aspect),
			Math.round(wide ? footprint / aspect : footprint * aspect)
		);

		// Furniture. addPillars only picks squares with floor on all four sides, so it can never block a doorway.
		EncounterMapGenerator.addPillars(map, rng, 3 + Random.randomNumber(5, rng));

		return map;
	};

	// Cuts one square out of a dividing wall. The wall runs along `line` - a column if `vertical`, otherwise a row - and spans `span` squares from `start`.
	static addDoorway = (floor: Set<string>, carve: (x: number, y: number) => void, line: number, start: number, span: number, vertical: boolean, rng: () => number) => {
		const at = (along: number, across: number) => (vertical ? { x: across, y: along } : { x: along, y: across });

		// Only somewhere with floor on both sides is a doorway; anywhere else opens into a wall
		const candidates: number[] = [];
		for (let along = start; along < start + span; ++along) {
			const before = at(along, line - 1);
			const after = at(along, line + 1);
			if (floor.has(`${before.x} ${before.y}`) && floor.has(`${after.x} ${after.y}`)) {
				candidates.push(along);
			}
		}

		if (candidates.length > 0) {
			const along = Collections.draw(candidates, rng);
			const door = at(along, line);
			carve(door.x, door.y);
			return;
		}

		// Both halves put a wall of their own against this one all the way along it; force a way through rather than leave them unreachable
		const along = start + Math.floor(span / 2);
		[ line - 1, line, line + 1 ].forEach(across => {
			const sq = at(along, across);
			carve(sq.x, sq.y);
		});
	};

	// Chambers dug out and linked by winding one-square tunnels. The cavern is one amorphous blob;
	// this has the same organic feel but with structure - chokepoints, corners and no long sight
	// lines.
	//
	// Each new chamber tunnels back to one already dug, so the warren is a spanning tree and is
	// connected by construction. Unlike the building, there is nothing here that can seal a room.
	static generateWarrenMap = (size: number, rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];
		const floor = new Set<string>();

		const carve = (x: number, y: number) => {
			if (!floor.has(`${x} ${y}`)) {
				floor.add(`${x} ${y}`);
				map.push({
					x: x,
					y: y,
					type: EncounterMapSquareType.Clear
				});
			}
		};

		// Tunnels take up room too, so the box is wider than the square count asked for
		const extent = Math.sqrt(size * 2);
		const aspect = 1 + (Random.randomDecimal(rng) / 2);
		const wide = Random.randomBoolean(rng);
		const width = Math.round(wide ? extent * aspect : extent / aspect);
		const height = Math.round(wide ? extent / aspect : extent * aspect);

		const centres: { x: number, y: number }[] = [];

		for (let attempt = 0; (attempt < 1000) && (map.length < size); ++attempt) {
			// Keeping the chambers apart stops the warren collapsing into one cavern. The gap closes
			// up once the box is full, so a warren that has run out of room still reaches its size.
			const separation = attempt < 500 ? 6 : 3;

			const centre = {
				x: Random.randomNumber(width, rng),
				y: Random.randomNumber(height, rng)
			};

			if (centres.some(c => (Math.abs(c.x - centre.x) < separation) && (Math.abs(c.y - centre.y) < separation))) {
				continue;
			}

			EncounterMapLogic.getWallBlob(map, centre, rng).forEach(sq => carve(sq.x, sq.y));

			if (centres.length > 0) {
				EncounterMapGenerator.addTunnel(carve, centre, Collections.draw(centres, rng), rng);
			}

			centres.push(centre);
		}

		EncounterMapGenerator.addPillars(map, rng, 2 + Random.randomNumber(3, rng));

		return map;
	};

	// A one-square tunnel between two chambers. Each step closes the gap on one axis or the other,
	// picked at random - which makes the tunnel wind, and means it always arrives.
	static addTunnel = (carve: (x: number, y: number) => void, from: { x: number, y: number }, to: { x: number, y: number }, rng: () => number) => {
		let x = from.x;
		let y = from.y;

		while ((x !== to.x) || (y !== to.y)) {
			const canMoveX = x !== to.x;
			const canMoveY = y !== to.y;

			if (canMoveX && (!canMoveY || Random.randomBoolean(rng))) {
				x += to.x > x ? 1 : -1;
			} else {
				y += to.y > y ? 1 : -1;
			}

			carve(x, y);
		}
	};

	static simplifyMap = (map: EncounterMapSquareModel[]) => {
		return Collections.distinct(map, sq => `${sq.x} ${sq.y}`);
	};
}
