import { describe, expect, it } from 'vitest';

import { Random } from './random';

// A generator that yields the given values in order, then repeats the last one.
// Random.randomNumber(10, rng) maps rng() to Math.floor(rng() * 10), so a value
// of n / 10 produces a die roll of n + 1.
const rollsOf = (...dieResults: number[]) => {
	const values = dieResults.map(n => (n - 1) / 10);
	let index = 0;
	return () => values[Math.min(index++, values.length - 1)];
};

describe('Random.dice', () => {
	it('rolls a single die for rank 1', () => {
		expect(Random.dice(1, rollsOf(7))).toBe(7);
	});

	it('takes the highest of the dice rolled', () => {
		expect(Random.dice(3, rollsOf(2, 9, 4))).toBe(9);
	});

	it('explodes on a 10, adding a further roll', () => {
		expect(Random.dice(1, rollsOf(10, 3))).toBe(13);
	});

	it('explodes repeatedly', () => {
		expect(Random.dice(1, rollsOf(10, 10, 5))).toBe(25);
	});

	it('halves the result at rank 0', () => {
		expect(Random.dice(0, rollsOf(7))).toBe(3);
	});

	it('rolls one die at rank 0 rather than none', () => {
		expect(Random.dice(0, rollsOf(4))).toBe(2);
	});

	it('halves negative ranks in the same way as rank 0', () => {
		expect(Random.dice(-2, rollsOf(9))).toBe(4);
	});

	it('is deterministic for a given seed', () => {
		const a = Random.dice(3, Random.getSeededRNG('skirmish'));
		const b = Random.dice(3, Random.getSeededRNG('skirmish'));
		expect(a).toBe(b);
	});
});
