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

		const streets: { dir: string, squares: EncounterMapSquareModel[] }[] = [];

		while (map.length < 400) {
			const dirs = [ 'n', 'e', 's', 'w' ];
			let dir = Collections.draw(dirs, rng);

			if (streets.length === 1) {
				const firstStreet = streets[0];
				switch (firstStreet.dir) {
					case 'n':
					case 's':
						dir = Random.randomBoolean(rng) ? 'e' : 'w';
						break;
					case 'e':
					case 'w':
						dir = Random.randomBoolean(rng) ? 'n' : 's';
						break;
				}
			}

			const size = {
				width: (dir === 'n') || (dir === 's') ? 3 : 10 + Random.dice(5, rng),
				height: (dir === 'e') || (dir === 'w') ? 3 : 10 + Random.dice(5, rng)
			};

			const position = { x: 0, y: 0 };
			if (streets.length > 0) {
				const perpendicular = streets.filter(s => {
					switch (dir) {
						case 'n':
						case 's':
							return (s.dir === 'e') || (s.dir === 'w');
						case 'e':
						case 'w':
							return (s.dir === 'n') || (s.dir === 's');
					}

					return false;
				});
				if (perpendicular.length > 0) {
					const selectedStreet = Collections.draw(perpendicular, rng);
					const adj = EncounterMapLogic.getAdjacentWalls(map, selectedStreet.squares, [ dir as 'n' | 'e' | 's' | 'w' ]);
					if (adj.length > 0) {
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
				}
			}

			const street: { dir: string, squares: EncounterMapSquareModel[] } = {
				dir: dir,
				squares: []
			};

			for (let x = position.x; x < position.x + size.width; ++x) {
				for (let y = position.y; y < position.y + size.height; ++y) {
					if (!map.find(t => (t.x === x) && (t.y === y))) {
						const square: EncounterMapSquareModel = {
							x: x,
							y: y,
							type: EncounterMapSquareType.Clear
						};
						street.squares.push(square);
					}
				}
			}

			streets.push(street);
			map.push(...street.squares);
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
