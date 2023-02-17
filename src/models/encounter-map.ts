import { dice, randomNumber } from '../utils/random';

export enum EncounterMapSquareType {
	Clear = 'Clear',
	Obstructed = 'Obstructed'
}

export interface EncounterMapSquareModel {
	x: number;
	y: number;
	type: EncounterMapSquareType;
}

export interface EncounterMapModel {
	squares: EncounterMapSquareModel[];
}

export const generateEncounterMap = (rng: () => number): EncounterMapModel => {
	const map: EncounterMapModel = {
		squares: []
	};

	while (map.squares.length < 1000) {
		const dirs = [ 'n', 'e', 's', 'w' ];
		const dir = dirs[randomNumber(4, rng)];

		// 0, 1 = room, 2 = corridor
		const type = randomNumber(3, rng);

		const size = {
			width: (type === 2) && ((dir === 'n') || (dir === 's')) ? 2 : dice(1, rng) + dice(1, rng) + dice(1, rng),
			height: (type === 2) && ((dir === 'e') || (dir === 'w')) ? 2 : dice(1, rng) + dice(1, rng) + dice(1, rng)
		};

		const position = { x: 0, y: 0 };
		if (map.squares.length > 0) {
			const adj = getEncounterMapEdges(map, map.squares, dir as 'n' | 'e' | 's' | 'w');
			const sq = adj[randomNumber(adj.length, rng)];
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
				if (!map.squares.find(t => (t.x === x) && (t.y === y))) {
					const square: EncounterMapSquareModel = {
						x: x,
						y: y,
						type: EncounterMapSquareType.Clear
					};
					map.squares.push(square);
				}
			}
		}
	}

	while (randomNumber(3, rng) !== 0) {
		// Add a blob of blocked terrain
		const blob: EncounterMapSquareModel[] = [];
		while ((blob.length < 5) || (randomNumber(10, rng) !== 0)) {
			const candidates = ((blob.length === 0) ? map.squares : getEncounterMapAdjacentSquares(map, blob, [ 'n', 'e', 's', 'w' ])).filter(c => c.type === EncounterMapSquareType.Clear);
			if (candidates.length > 0) {
				const n = randomNumber(candidates.length, rng);
				const square = candidates[n];
				blob.push(square);
			}
		}
		map.squares = map.squares.filter(sq => !blob.includes(sq));
	}

	while (randomNumber(3, rng) !== 0) {
		// Add a blob of obstructed terrain
		const blob: EncounterMapSquareModel[] = [];
		while ((blob.length < 5) || (randomNumber(10, rng) !== 0)) {
			const candidates = ((blob.length === 0) ? map.squares : getEncounterMapAdjacentSquares(map, blob, [ 'n', 'e', 's', 'w' ])).filter(c => c.type === EncounterMapSquareType.Clear);
			if (candidates.length > 0) {
				const n = randomNumber(candidates.length, rng);
				const square = candidates[n];
				blob.push(square);
			}
		}
		blob.forEach(sq => sq.type = EncounterMapSquareType.Obstructed);
	}

	return map;
};

export const getEncounterMapDimensions = (map: EncounterMapModel) => {
	const dims = {
		left: Number.MAX_VALUE,
		top: Number.MAX_VALUE,
		right: Number.MIN_VALUE,
		bottom: Number.MIN_VALUE
	};

	map.squares.forEach(sq => {
		dims.left = Math.min(dims.left, sq.x);
		dims.top = Math.min(dims.top, sq.y);
		dims.right = Math.max(dims.right, sq.x);
		dims.bottom = Math.max(dims.bottom, sq.y);
	});

	return dims;
};

export const getEncounterMapAdjacentSquares = (map: EncounterMapModel, squares: { x: number; y: number }[], directions: ('n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw')[] = []) => {
	const adj: EncounterMapSquareModel[] = [];

	squares.forEach(square => {
		if ((directions.length === 0) || (directions.includes('n'))) {
			const n = map.squares.find(sq => (sq.x === square.x) && (sq.y === square.y - 1));
			if (n) {
				adj.push(n);
			}
		}
		if ((directions.length === 0) || (directions.includes('ne'))) {
			const ne = map.squares.find(sq => (sq.x === square.x + 1) && (sq.y === square.y - 1));
			if (ne) {
				adj.push(ne);
			}
		}
		if ((directions.length === 0) || (directions.includes('e'))) {
			const e = map.squares.find(sq => (sq.x === square.x + 1) && (sq.y === square.y));
			if (e) {
				adj.push(e);
			}
		}
		if ((directions.length === 0) || (directions.includes('se'))) {
			const se = map.squares.find(sq => (sq.x === square.x + 1) && (sq.y === square.y + 1));
			if (se) {
				adj.push(se);
			}
		}
		if ((directions.length === 0) || (directions.includes('s'))) {
			const s = map.squares.find(sq => (sq.x === square.x) && (sq.y === square.y + 1));
			if (s) {
				adj.push(s);
			}
		}
		if ((directions.length === 0) || (directions.includes('sw'))) {
			const sw = map.squares.find(sq => (sq.x === square.x - 1) && (sq.y === square.y + 1));
			if (sw) {
				adj.push(sw);
			}
		}
		if ((directions.length === 0) || (directions.includes('w'))) {
			const w = map.squares.find(sq => (sq.x === square.x - 1) && (sq.y === square.y));
			if (w) {
				adj.push(w);
			}
		}
		if ((directions.length === 0) || (directions.includes('nw'))) {
			const nw = map.squares.find(sq => (sq.x === square.x - 1) && (sq.y === square.y - 1));
			if (nw) {
				adj.push(nw);
			}
		}
	});

	return adj.filter(sq => !squares.find(s => (s.x === sq.x) && (s.y === sq.y)));
};

export const getEncounterMapEdges = (map: EncounterMapModel, squares: { x: number; y: number }[], direction: 'n' | 'e' | 's' | 'w') => {
	const adj: { x: number; y: number }[] = [];

	squares.forEach(square => {
		const sq = { x: square.x, y: square.y };
		switch (direction) {
			case 'n':
				sq.y -= 1;
				break;
			case 'e':
				sq.x += 1;
				break;
			case 's':
				sq.y += 1;
				break;
			case 'w':
				sq.x -= 1;
				break;
		}
		if (!map.squares.find(s => (s.x === sq.x) && (s.y === sq.y))) {
			adj.push(sq);
		}
	});

	return adj;
};
