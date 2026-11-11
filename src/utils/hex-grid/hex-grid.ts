export interface HexPoint {
	x: number;
	y: number;
}

export const getHexCenter = (square: { x: number, y: number }): HexPoint => ({
	x: square.x + 0.5,
	y: square.y + 0.5 + ((square.x % 2 === 0) ? 0.25 : -0.25)
});

export const getHexVertices = (square: { x: number, y: number }): HexPoint[] => {
	const offset = square.x % 2 === 0 ? 0.25 : -0.25;
	return [
		{ x: square.x + 0.1, y: square.y + offset },
		{ x: square.x + 0.9, y: square.y + offset },
		{ x: square.x + 1.1, y: square.y + 0.5 + offset },
		{ x: square.x + 0.9, y: square.y + 1 + offset },
		{ x: square.x + 0.1, y: square.y + 1 + offset },
		{ x: square.x - 0.1, y: square.y + 0.5 + offset }
	];
};

// The map is stored, and generated, on a grid of whole numbers: a column to every unit across and
// a row to every unit down, with odd columns half a row up. Laid out as it is, a hex on that grid
// is not regular - the corners of getHexVertices make it 1.2 wide and 1 high, with its top and
// bottom edges half as long again as its sloping ones. Rather than change the grid, and with it
// every save's rivers, which are stored as points on it, the map is drawn through toDisplay,
// which moves every point to where it belongs for regular hexes.
//
// Across, columns stay a unit apart, which makes each hex 4/3 wide (a regular hex is 1.5 sides
// across from one column to the next) with sides 2/3 long. The corners getHexVertices puts a
// tenth of a unit in from each column boundary move out to a sixth; anything in between is
// stretched in proportion, so a river running along an edge still runs along it. Down, rows
// are spread to the height of a regular hex, root 3 sides: 2 / root 3.
export const HEX_SIDE = 2 / 3;
export const HEX_ROW_HEIGHT = 2 / Math.sqrt(3);

const displayX = (x: number) => {
	const column = Math.floor(x);
	const t = x - column;
	// Piecewise linear through the corners: 0 -> 0, 0.1 -> 1/6, 0.9 -> 5/6, 1 -> 1
	let mapped: number;
	if (t <= 0.1) {
		mapped = t * (1 / 6) / 0.1;
	} else if (t <= 0.9) {
		mapped = (1 / 6) + ((t - 0.1) * (4 / 6) / 0.8);
	} else {
		mapped = (5 / 6) + ((t - 0.9) * (1 / 6) / 0.1);
	}
	return column + mapped;
};

export const toDisplay = (point: HexPoint): HexPoint => ({
	x: displayX(point.x),
	y: point.y * HEX_ROW_HEIGHT
});

export const getHexDisplayCenter = (square: { x: number, y: number }): HexPoint => toDisplay(getHexCenter(square));

// The corners of a square's hex as drawn: a regular hexagon, flat at top and bottom, inset a
// little so neighbouring hexes have a hairline between them, and optionally scaled about its
// centre (the shallows are drawn as larger hexes behind the coast).
export const getHexPoints = (square: { x: number, y: number }, scale = 1): HexPoint[] => {
	const center = getHexDisplayCenter(square);
	// The inset is measured across an edge; a corner is 2 / root 3 times as far out as an edge.
	const padding = 0.024;
	const radius = (HEX_SIDE - (padding * 2 / Math.sqrt(3))) * scale;
	return [ 240, 300, 0, 60, 120, 180 ].map(degrees => {
		const radians = degrees * Math.PI / 180;
		return {
			x: center.x + (radius * Math.cos(radians)),
			y: center.y + (radius * Math.sin(radians))
		};
	});
};
