interface RGB {
	r: number;
	g: number;
	b: number;
}

export class Color {
	static toString = (color: RGB): string => {
		return `rgb(${color.r}, ${color.g}, ${color.b})`;
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

	static lighten = (color: RGB): RGB => {
		const factor = 0.3;
		return {
			r: color.r + ((255 - color.r) * factor),
			g: color.g + ((255 - color.g) * factor),
			b: color.b + ((255 - color.b) * factor)
		};
	};

	static darken = (color: RGB): RGB => {
		const factor = 0.7;
		return {
			r: color.r * factor,
			g: color.g * factor,
			b: color.b * factor
		};
	};
}
