import { describe, expect, it } from 'vitest';

import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';

import type { EncounterMapSquareModel } from '../../models/encounter';

import { Random } from '../../utils/random/random';

import { EncounterMapGenerator } from './encounter-map-generator';

const mapTypeNames = new Map([
	[ EncounterMapGenerator.generateDungeonMap, 'dungeon' ],
	[ EncounterMapGenerator.generateRuinMap, 'ruin' ],
	[ EncounterMapGenerator.generateCavernMap, 'cavern' ],
	[ EncounterMapGenerator.generateStreetMap, 'street' ],
	[ EncounterMapGenerator.generateArenaMap, 'arena' ],
	[ EncounterMapGenerator.generateBuildingMap, 'building' ],
	[ EncounterMapGenerator.generateWarrenMap, 'warren' ]
]);

// Draws map types for one terrain and counts how often each came up. Only the
// type is drawn - the map itself is never built, so this stays fast.
const drawCounts = (terrain: string, count = 2000) => {
	const rng = Random.getSeededRNG(`map types for ${terrain}`);

	const counts: Record<string, number> = { dungeon: 0, ruin: 0, cavern: 0, street: 0, arena: 0, building: 0, warren: 0 };
	for (let n = 0; n < count; ++n) {
		const name = mapTypeNames.get(EncounterMapGenerator.drawMapType(terrain, rng)) as string;
		counts[name] += 1;
	}

	return counts;
};

describe('terrain drives the encounter map type', () => {
	it('favours caverns over streets in the mountains', () => {
		const counts = drawCounts('Mountains');
		expect(counts.cavern).toBeGreaterThan(counts.street);
	});

	it('favours streets over caverns on the plains', () => {
		const counts = drawCounts('Plains');
		expect(counts.street).toBeGreaterThan(counts.cavern);
	});

	it('never rules a map type out entirely', () => {
		// Weighted, not hard-assigned: an unlikely map type is still possible.
		Object.values(drawCounts('Mountains')).forEach(count => expect(count).toBeGreaterThan(0));
	});

	it('draws evenly for a terrain it does not recognise', () => {
		const counts = drawCounts('Sky');
		Object.values(counts).forEach(count => expect(count).toBeGreaterThan(0));
		expect(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))).toBeLessThan(200);
	});

	it('generates a valid map for an unrecognised terrain', () => {
		const map = EncounterMapGenerator.generateEncounterMap(Random.getSeededRNG('sky map'), 'Sky');
		expect(map.length).toBeGreaterThan(0);
	});

	it('covers every terrain the campaign map generates', () => {
		// The list in CampaignMapGenerator; anything missing here would silently
		// fall back to an even draw.
		const terrains = [
			'Badlands',
			'Canyons',
			'Desert',
			'Fens',
			'Forest',
			'Jungle',
			'Lakes',
			'Marshland',
			'Mountains',
			'Plains',
			'Plateaus',
			'Rainforest',
			'Riverlands',
			'Salt flats',
			'Scrubland',
			'Steppe',
			'Taiga',
			'Valleys',
			'Volcanic',
			'Wetlands'
		];

		terrains.forEach(terrain => {
			expect(EncounterMapGenerator.terrainWeights.find(tw => tw.terrains.includes(terrain)), terrain).toBeDefined();
		});
	});
});

describe('the arena map', () => {
	// The arena's whole point is that there is nowhere to hide, so these guard the two properties
	// that make it different from the four maze-shaped map types.
	const arenas = [ 'one', 'two', 'three', 'four', 'five' ].map(seed => EncounterMapGenerator.generateArenaMap(400, Random.getSeededRNG(seed)));

	const clear = (map: EncounterMapSquareModel[]) => map.filter(sq => sq.type === EncounterMapSquareType.Clear);

	it('generates roughly the requested number of squares', () => {
		arenas.forEach(map => {
			expect(map.length).toBeGreaterThan(350);
			expect(map.length).toBeLessThan(450);
		});
	});

	it('leaves only a light scatter of obstructed squares', () => {
		// Far fewer than the blob pass drops on the other map types.
		arenas.forEach(map => {
			const obstructed = map.length - clear(map).length;
			expect(obstructed).toBeGreaterThan(0);
			expect(obstructed).toBeLessThan(map.length / 20);
		});
	});

	it('is a single connected open space', () => {
		arenas.forEach(map => {
			const open = new Set(clear(map).map(sq => `${sq.x} ${sq.y}`));

			const start = clear(map)[0];
			const seen = new Set([ `${start.x} ${start.y}` ]);
			const pending = [ start ];
			while (pending.length > 0) {
				const sq = pending.pop() as EncounterMapSquareModel;
				([ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ]).forEach(([ dx, dy ]) => {
					const key = `${sq.x + dx} ${sq.y + dy}`;
					if (open.has(key) && !seen.has(key)) {
						seen.add(key);
						pending.push({ x: sq.x + dx, y: sq.y + dy, type: EncounterMapSquareType.Clear });
					}
				});
			}

			expect(seen.size).toBe(open.size);
		});
	});

	it('does not get the obstructed-blob pass', () => {
		// generateEncounterMap used to run the blob loop over every map; the maze-shaped generators
		// now call it themselves, so an arena drawn through the full pipeline stays open.
		const cavern = EncounterMapGenerator.generateCavernMap(400, Random.getSeededRNG('blobs'));
		const cavernObstructed = cavern.length - clear(cavern).length;

		arenas.forEach(map => {
			expect(map.length - clear(map).length).toBeLessThan(cavernObstructed);
		});
	});
});

describe('the building map', () => {
	const buildings = [ 'one', 'two', 'three', 'four', 'five' ].map(seed => EncounterMapGenerator.generateBuildingMap(400, Random.getSeededRNG(seed)));

	// Obstructed is difficult terrain rather than a wall - it costs an extra movement point and does
	// not block line of sight - so both square types are walkable and both count as connected.
	const isConnected = (map: EncounterMapSquareModel[]) => {
		const walkable = new Set(map.map(sq => `${sq.x} ${sq.y}`));

		const seen = new Set([ `${map[0].x} ${map[0].y}` ]);
		const pending = [ map[0] ];
		while (pending.length > 0) {
			const sq = pending.pop() as EncounterMapSquareModel;
			([ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ]).forEach(([ dx, dy ]) => {
				const key = `${sq.x + dx} ${sq.y + dy}`;
				if (walkable.has(key) && !seen.has(key)) {
					seen.add(key);
					pending.push({ x: sq.x + dx, y: sq.y + dy, type: EncounterMapSquareType.Clear });
				}
			});
		}

		return seen.size === walkable.size;
	};

	it('generates roughly the requested number of squares', () => {
		buildings.forEach(map => {
			expect(map.length).toBeGreaterThan(350);
			expect(map.length).toBeLessThan(450);
		});
	});

	it('leaves every room reachable', () => {
		// The one that matters. Every other generator is connected by construction, but a room whose
		// doorway went missing would hold a monster no hero could reach, and the encounter could
		// never be finished.
		buildings.forEach(map => expect(isConnected(map)).toBe(true));
	});

	it('leaves every room reachable across many seeds', () => {
		for (let n = 0; n < 200; ++n) {
			const map = EncounterMapGenerator.generateBuildingMap(400, Random.getSeededRNG(`building ${n}`));
			expect(isConnected(map), `seed ${n}`).toBe(true);
		}
	});

	it('is divided by interior walls', () => {
		// What separates a building from the arena: a good fraction of its bounding box is wall.
		buildings.forEach(map => {
			const width = Math.max(...map.map(sq => sq.x)) - Math.min(...map.map(sq => sq.x)) + 1;
			const height = Math.max(...map.map(sq => sq.y)) - Math.min(...map.map(sq => sq.y)) + 1;

			expect(map.length).toBeLessThan((width * height) * 0.9);
		});
	});

	it('has room for a size 2 combatant', () => {
		// Rooms are never narrower than the minimum, so a large monster always has somewhere to stand.
		buildings.forEach(map => {
			const squares = new Set(map.map(sq => `${sq.x} ${sq.y}`));
			const blocks = map.filter(sq => [ [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ].every(([ dx, dy ]) => squares.has(`${sq.x + dx} ${sq.y + dy}`)));

			expect(blocks.length).toBeGreaterThan(20);
		});
	});
});

describe('the warren map', () => {
	const warrens = [ 'one', 'two', 'three', 'four', 'five' ].map(seed => EncounterMapGenerator.generateWarrenMap(400, Random.getSeededRNG(seed)));

	const neighbours = (walkable: Set<string>, sq: { x: number, y: number }) => {
		return ([ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ]).filter(([ dx, dy ]) => walkable.has(`${sq.x + dx} ${sq.y + dy}`)).length;
	};

	it('generates roughly the requested number of squares', () => {
		warrens.forEach(map => {
			expect(map.length).toBeGreaterThan(350);
			expect(map.length).toBeLessThan(500);
		});
	});

	it('is connected by construction', () => {
		// Every chamber tunnels back to one already dug, so the warren is a spanning tree. This
		// checks the property holds rather than trusting the argument.
		for (let n = 0; n < 200; ++n) {
			const map = EncounterMapGenerator.generateWarrenMap(400, Random.getSeededRNG(`warren ${n}`));
			const walkable = new Set(map.map(sq => `${sq.x} ${sq.y}`));

			const seen = new Set([ `${map[0].x} ${map[0].y}` ]);
			const pending = [ map[0] ];
			while (pending.length > 0) {
				const sq = pending.pop() as EncounterMapSquareModel;
				([ [ 1, 0 ], [ -1, 0 ], [ 0, 1 ], [ 0, -1 ] ]).forEach(([ dx, dy ]) => {
					const key = `${sq.x + dx} ${sq.y + dy}`;
					if (walkable.has(key) && !seen.has(key)) {
						seen.add(key);
						pending.push({ x: sq.x + dx, y: sq.y + dy, type: EncounterMapSquareType.Clear });
					}
				});
			}

			expect(seen.size, `seed ${n}`).toBe(walkable.size);
		}
	});

	it('is mostly tunnel and chokepoint', () => {
		// What makes it a warren rather than a cavern: a large share of squares have somewhere to go
		// in two directions or fewer.
		warrens.forEach(map => {
			const walkable = new Set(map.map(sq => `${sq.x} ${sq.y}`));
			const tight = map.filter(sq => neighbours(walkable, sq) <= 2).length;

			expect(tight).toBeGreaterThan(map.length / 4);
		});
	});

	it('is tighter than a cavern of the same size', () => {
		const cavern = EncounterMapGenerator.generateCavernMap(400, Random.getSeededRNG('cavern'));
		const cavernWalkable = new Set(cavern.map(sq => `${sq.x} ${sq.y}`));
		const cavernTight = cavern.filter(sq => neighbours(cavernWalkable, sq) <= 2).length / cavern.length;

		warrens.forEach(map => {
			const walkable = new Set(map.map(sq => `${sq.x} ${sq.y}`));
			const tight = map.filter(sq => neighbours(walkable, sq) <= 2).length / map.length;

			expect(tight).toBeGreaterThan(cavernTight);
		});
	});
});

describe('water on the encounter map', () => {
	// Water blobs are random in both count and size, so a single map can legitimately have none.
	// Generating a handful of maps and looking at the total avoids a flaky assertion.
	const countWater = (terrain: string, maps = 10) => {
		let water = 0;
		for (let n = 0; n < maps; ++n) {
			const map = EncounterMapGenerator.generateEncounterMap(Random.getSeededRNG(`water ${terrain} ${n}`), terrain);
			water += map.filter(sq => sq.type === EncounterMapSquareType.Water).length;
		}
		return water;
	};

	it('appears on maps regardless of which packs are switched on', () => {
		// Water is part of the base game; the Deep Water pack only adds cards that make use of it
		expect(countWater('Plains')).toBeGreaterThan(0);
		expect(countWater('Mountains')).toBeGreaterThan(0);
	});

	it('floods open ground rather than replacing cover', () => {
		// A water blob can overlap obstructed squares; those must survive as obstructed
		const map = EncounterMapGenerator.generateEncounterMap(Random.getSeededRNG('cover'), 'Plains');
		const water = map.filter(sq => sq.type === EncounterMapSquareType.Water);
		expect(water.length).toBeGreaterThan(0);
		expect(map.every(sq => Object.values(EncounterMapSquareType).includes(sq.type))).toBe(true);
	});

	it('leaves most of the map dry', () => {
		const map = EncounterMapGenerator.generateEncounterMap(Random.getSeededRNG('proportion'), 'Plains');
		const water = map.filter(sq => sq.type === EncounterMapSquareType.Water).length;
		expect(water).toBeLessThan(map.length / 2);
	});
});
