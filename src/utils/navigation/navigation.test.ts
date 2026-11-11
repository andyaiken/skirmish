import { describe, expect, it } from 'vitest';

import { Navigation, Rect } from './navigation';

// A rect from its top-left corner and size, which is easier to lay out by eye than four edges.
const box = (x: number, y: number, w = 100, h = 40): Rect => ({ left: x, top: y, right: x + w, bottom: y + h });

describe('Navigation.findBest', () => {
	it('finds nothing when no candidate is in that direction', () => {
		const from = box(0, 0);
		expect(Navigation.findBest(from, [ box(0, 100) ], 'up')).toBe(-1);
		expect(Navigation.findBest(from, [ box(0, 100) ], 'left')).toBe(-1);
		expect(Navigation.findBest(from, [], 'down')).toBe(-1);
	});

	it('moves to the next item in a row', () => {
		const from = box(0, 0);
		const row = [ box(220, 0), box(110, 0) ];
		expect(Navigation.findBest(from, row, 'right')).toBe(1);
	});

	it('moves back along a row', () => {
		const from = box(220, 0);
		const row = [ box(0, 0), box(110, 0) ];
		expect(Navigation.findBest(from, row, 'left')).toBe(1);
	});

	it('stays in its column rather than taking a nearer item in the next column', () => {
		// The item below in the same column is further away than the one diagonally below, but
		// is in line with where focus is.
		const from = box(0, 0);
		const candidates = [ box(110, 45), box(0, 120) ];
		expect(Navigation.findBest(from, candidates, 'down')).toBe(1);
	});

	it('counts items whose edges touch or overlap a little as beside each other', () => {
		const from = box(0, 0);
		expect(Navigation.findBest(from, [ box(98, 0) ], 'right')).toBe(0);
		expect(Navigation.findBest(from, [ box(0, 38) ], 'down')).toBe(0);
	});

	it('does not count an item which overlaps a lot as being in that direction', () => {
		const from = box(0, 0);
		expect(Navigation.findBest(from, [ box(50, 0) ], 'right')).toBe(-1);
	});

	it('picks the item most nearly straight ahead from a row of equally near items', () => {
		// A wide button above a row of three small ones: down goes to the middle one.
		const from = box(0, 0, 300, 40);
		const row = [ box(0, 60), box(100, 60), box(200, 60) ];
		expect(Navigation.findBest(from, row, 'down')).toBe(1);
	});

	it('reaches a diagonal item when nothing lines up', () => {
		const from = box(0, 0);
		expect(Navigation.findBest(from, [ box(300, 200) ], 'down')).toBe(0);
		expect(Navigation.findBest(from, [ box(300, 200) ], 'right')).toBe(0);
	});
});

describe('Navigation.findNearest', () => {
	// A small marker centred on a point, like a region label on the map.
	const dot = (x: number, y: number): Rect => ({ left: x - 5, top: y - 5, right: x + 5, bottom: y + 5 });

	it('finds nothing when nothing is on that side', () => {
		expect(Navigation.findNearest(dot(0, 0), [ dot(-50, 0) ], 'right')).toBe(-1);
	});

	it('takes a marker which is off to one side but within the cone', () => {
		// Neither lines up exactly, which findBest would want; this takes the nearer.
		const candidates = [ dot(100, 30), dot(60, -20) ];
		expect(Navigation.findNearest(dot(0, 0), candidates, 'right')).toBe(1);
	});

	it('prefers a marker in the cone to a nearer one outside it', () => {
		const candidates = [ dot(20, 60), dot(90, 40) ];
		expect(Navigation.findNearest(dot(0, 0), candidates, 'right')).toBe(1);
	});

	it('finds nothing when the only markers on that side are outside the cone', () => {
		// So that at the edge of the map, focus leaves it rather than doubling back.
		expect(Navigation.findNearest(dot(0, 0), [ dot(20, 60) ], 'right')).toBe(-1);
	});
});

describe('Navigation.findClosest', () => {
	it('finds nothing among no candidates', () => {
		expect(Navigation.findClosest(box(0, 0), [])).toBe(-1);
	});

	it('takes the candidate whose centre is nearest, in any direction', () => {
		const candidates = [ box(300, 0), box(-50, 60), box(0, 200) ];
		expect(Navigation.findClosest(box(0, 0), candidates)).toBe(1);
	});
});
