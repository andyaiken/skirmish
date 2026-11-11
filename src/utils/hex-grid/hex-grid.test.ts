import { describe, expect, it } from 'vitest';

import { HEX_SIDE, getHexDisplayCenter, getHexPoints, getHexVertices, toDisplay } from './hex-grid';

const distance = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

// The six squares around a square on the map's grid, where odd columns sit half a row up
const neighbours = (x: number, y: number) => x % 2 === 0
	? [ { x, y: y - 1 }, { x: x + 1, y }, { x: x + 1, y: y + 1 }, { x, y: y + 1 }, { x: x - 1, y: y + 1 }, { x: x - 1, y } ]
	: [ { x, y: y - 1 }, { x: x + 1, y: y - 1 }, { x: x + 1, y }, { x, y: y + 1 }, { x: x - 1, y }, { x: x - 1, y: y - 1 } ];

const squares = [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 4, y: 7 }, { x: 7, y: 3 }, { x: -3, y: -2 } ];

describe('getHexPoints', () => {
	it('draws a regular hexagon: six equal sides', () => {
		squares.forEach(square => {
			const points = getHexPoints(square);
			const sides = points.map((p, n) => distance(p, points[(n + 1) % points.length]));
			sides.forEach(side => expect(side).toBeCloseTo(sides[0], 9));
		});
	});

	it('draws a regular hexagon: every corner 120 degrees', () => {
		squares.forEach(square => {
			const points = getHexPoints(square);
			points.forEach((p, n) => {
				const prev = points[(n + points.length - 1) % points.length];
				const next = points[(n + 1) % points.length];
				const a = { x: prev.x - p.x, y: prev.y - p.y };
				const b = { x: next.x - p.x, y: next.y - p.y };
				const angle = Math.acos(((a.x * b.x) + (a.y * b.y)) / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y))) * 180 / Math.PI;
				expect(angle).toBeCloseTo(120, 9);
			});
		});
	});
});

describe('getHexDisplayCenter', () => {
	it('puts every neighbour the same distance away: two apothems of a regular hex', () => {
		const expected = HEX_SIDE * Math.sqrt(3);
		squares.forEach(square => {
			const centre = getHexDisplayCenter(square);
			neighbours(square.x, square.y).forEach(n => {
				expect(distance(centre, getHexDisplayCenter(n))).toBeCloseTo(expected, 9);
			});
		});
	});
});

describe('toDisplay', () => {
	it('moves the corners of the grid onto the corners of the regular hexes, so rivers follow the edges', () => {
		squares.forEach(square => {
			const centre = getHexDisplayCenter(square);
			getHexVertices(square).forEach(vertex => {
				expect(distance(toDisplay(vertex), centre)).toBeCloseTo(HEX_SIDE, 9);
			});
		});
	});
});
