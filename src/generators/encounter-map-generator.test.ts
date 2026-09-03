import { describe, expect, it } from 'vitest';

import { EncounterMapSquareType } from '../enums/encounter-map-square-type';

import type { EncounterMapSquareModel } from '../models/encounter';

import { Random } from '../utils/random';

import { EncounterMapGenerator } from './encounter-map-generator';

const mapTypeNames = new Map([
	[ EncounterMapGenerator.generateDungeonMap, 'dungeon' ],
	[ EncounterMapGenerator.generateRuinMap, 'ruin' ],
	[ EncounterMapGenerator.generateCavernMap, 'cavern' ],
	[ EncounterMapGenerator.generateStreetMap, 'street' ],
	[ EncounterMapGenerator.generateArenaMap, 'arena' ],
	[ EncounterMapGenerator.generateBuildingMap, 'building' ]
]);

// Draws map types for one terrain and counts how often each came up. Only the
// type is drawn - the map itself is never built, so this stays fast.
const drawCounts = (terrain: string, count = 2000) => {
	const rng = Random.getSeededRNG(`map types for ${terrain}`);

	const counts: Record<string, number> = { dungeon: 0, ruin: 0, cavern: 0, street: 0, arena: 0, building: 0 };
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
