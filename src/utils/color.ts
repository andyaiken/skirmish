import { Random } from './random';

interface RGB {
	r: number;
	g: number;
	b: number;
}

export class Color {
	static toString = (color: RGB): string => {
		return `rgb(${color.r}, ${color.g}, ${color.b})`;
	};

	static tweak = (color: RGB, delta: number, rng: () => number = Math.random): RGB => {
		const c = {
			r: color.r + Random.randomNumber(delta, rng) + Random.randomNumber(delta, rng) - delta,
			g: color.g + Random.randomNumber(delta, rng) + Random.randomNumber(delta, rng) - delta,
			b: color.b + Random.randomNumber(delta, rng) + Random.randomNumber(delta, rng) - delta
		};

		c.r = Math.max(c.r, 0);
		c.g = Math.max(c.g, 0);
		c.b = Math.max(c.b, 0);

		c.r = Math.min(c.r, 255);
		c.g = Math.min(c.g, 255);
		c.b = Math.min(c.b, 255);

		return c;
	};

	static parse = (str: string): RGB | null => {
		const regex = /rgb\((?<r>\d{1,3}), (?<g>\d{1,3}), (?<b>\d{1,3})\)/;

		const x = regex.exec(str);
		if (x && x.groups) {
			const r = parseInt(x.groups['r']);
			const g = parseInt(x.groups['g']);
			const b = parseInt(x.groups['b']);

			return {
				r: r,
				g: g,
				b: b
			};
		}

		return null;
	};

	static lighten = (color: RGB, factor = 0.3): RGB => {
		return {
			r: color.r + ((255 - color.r) * factor),
			g: color.g + ((255 - color.g) * factor),
			b: color.b + ((255 - color.b) * factor)
		};
	};

	static darken = (color: RGB, factor = 0.7): RGB => {
		return {
			r: color.r * factor,
			g: color.g * factor,
			b: color.b * factor
		};
	};
}
