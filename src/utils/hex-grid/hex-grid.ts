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

export const getHexPoints = (square: { x: number, y: number }, scale = 1): HexPoint[] => {
	const center = getHexCenter(square);
	const padding = 0.024;
	const dx = 0.1;
	const points = [
		{ x: square.x + padding + dx, y: square.y + padding },
		{ x: square.x + 1 - padding - dx, y: square.y + padding },
		{ x: square.x + 1 + dx - padding, y: square.y + 0.5 },
		{ x: square.x + 1 - padding - dx, y: square.y + 1 - padding },
		{ x: square.x + padding + dx, y: square.y + 1 - padding },
		{ x: square.x + padding - dx, y: square.y + 0.5 }
	];
	if (square.x % 2 === 0) {
		points.forEach(point => point.y += 0.25);
	} else {
		points.forEach(point => point.y -= 0.25);
	}
	return points.map(point => ({
		x: center.x + ((point.x - center.x) * scale),
		y: center.y + ((point.y - center.y) * scale)
	}));
};
