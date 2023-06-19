import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import type { EncounterMapSquareModel } from '../models/encounter';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

import { EncounterMapLogic } from '../logic/encounter-map-logic';

export class EncounterMapGenerator {
	static generateEncounterMap = (rng: () => number): EncounterMapSquareModel[] => {
		EncounterMapLogic.visibilityCache.reset();

		const mapTypes = [ 'dungeon', 'cavern', 'street' ];
		switch (Collections.draw(mapTypes, rng)) {
			case 'dungeon':
				return EncounterMapGenerator.generateDungeonMap(rng);
			case 'cavern':
				return EncounterMapGenerator.generateCavernMap(rng);
			case 'street':
				return EncounterMapGenerator.generateStreetMap(rng);
		}

		return [];
	};

	static generateDungeonMap = (rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];

		while (map.length < 400) {
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

		while (Random.randomNumber(3, rng) !== 0) {
			// Add a blob of obstructed terrain
			const start = Collections.draw(map, rng);
			const blob = EncounterMapLogic.getFloorBlob(map, start, rng);
			blob.forEach(sq => sq.type = EncounterMapSquareType.Obstructed);
		}

		return EncounterMapGenerator.simplifyMap(map);
	};

	static generateCavernMap = (rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [
			{
				x: 0,
				y: 0,
				type: EncounterMapSquareType.Clear
			}
		];

		while (map.length < 400) {
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

		return EncounterMapGenerator.simplifyMap(map);
	};

	static generateStreetMap = (rng: () => number): EncounterMapSquareModel[] => {
		const map: EncounterMapSquareModel[] = [];

		const intersections: { x: number, y: number, used: { n: boolean, e: boolean, s: boolean, w: boolean } }[] = [];

		while (map.length < 400) {
			const position = { x: 0, y: 0 };
			const length = 10 + Random.dice(5, rng);

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

		while (Random.randomNumber(3, rng) !== 0) {
			// Add a blob of obstructed terrain
			const start = Collections.draw(map, rng);
			const blob = EncounterMapLogic.getFloorBlob(map, start, rng);
			blob.forEach(sq => sq.type = EncounterMapSquareType.Obstructed);
		}

		return EncounterMapGenerator.simplifyMap(map);
	};

	static simplifyMap = (map: EncounterMapSquareModel[]) => {
		return Collections.distinct(map, sq => `${sq.x} ${sq.y}`);
	};
}
