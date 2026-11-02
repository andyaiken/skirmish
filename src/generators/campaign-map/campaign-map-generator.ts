import { CampaignMapLogic } from '../../logic/campaign-map/campaign-map-logic';

import type { CampaignMapModel, CampaignMapRiverModel, CampaignMapSquareModel } from '../../models/campaign-map';
import type { RegionModel } from '../../models/region';

import { getHexCenter, getHexVertices } from '../../utils/hex-grid/hex-grid';
import { Collections } from '../../utils/collections/collections';
import { Color } from '../../utils/color/color';
import { HashTable } from '../../utils/hash-table/hash-table';
import { Random } from '../../utils/random/random';
import { Utils } from '../../utils/utils/utils';

import { BoonGenerator } from '../boon/boon-generator';
import { NameGenerator } from '../name/name-generator';

interface Candidate {
	x: number;
	y: number;
	noise: number;
	score: number;
}

const key = (x: number, y: number) => `${x},${y}`;

const getAdjacentCoordinates = (x: number, y: number) => {
	if (x % 2 === 0) {
		return [
			{ x: x, y: y - 1 },
			{ x: x + 1, y: y },
			{ x: x + 1, y: y + 1 },
			{ x: x, y: y + 1 },
			{ x: x - 1, y: y + 1 },
			{ x: x - 1, y: y }
		];
	}

	return [
		{ x: x, y: y - 1 },
		{ x: x + 1, y: y - 1 },
		{ x: x + 1, y: y },
		{ x: x, y: y + 1 },
		{ x: x - 1, y: y },
		{ x: x - 1, y: y - 1 }
	];
};

const createNoiseGrid = (columns: number, rows: number, rng: () => number) => {
	return Array.from({ length: rows }, () =>
		Array.from({ length: columns }, () => rng()));
};

const sampleNoise = (grid: number[][], x: number, y: number, width: number, height: number) => {
	const gx = (x / (width - 1)) * (grid[0].length - 1);
	const gy = (y / (height - 1)) * (grid.length - 1);
	const x0 = Math.floor(gx);
	const y0 = Math.floor(gy);
	const x1 = Math.min(grid[0].length - 1, x0 + 1);
	const y1 = Math.min(grid.length - 1, y0 + 1);
	const tx = gx - x0;
	const ty = gy - y0;
	const smoothX = tx * tx * (3 - (2 * tx));
	const smoothY = ty * ty * (3 - (2 * ty));
	const top = grid[y0][x0] + ((grid[y0][x1] - grid[y0][x0]) * smoothX);
	const bottom = grid[y1][x0] + ((grid[y1][x1] - grid[y1][x0]) * smoothX);
	return top + ((bottom - top) * smoothY);
};

const getComponents = (
	squares: CampaignMapSquareModel[],
	squareAt: HashTable<CampaignMapSquareModel>
) => {
	const passable = squares.filter(CampaignMapLogic.isClaimable);
	const remaining = new Set(passable.map(sq => key(sq.x, sq.y)));
	const components: CampaignMapSquareModel[][] = [];

	while (remaining.size > 0) {
		const first = squareAt.search(remaining.values().next().value as string);
		if (!first) {
			break;
		}

		const component: CampaignMapSquareModel[] = [];
		const queue = [ first ];
		remaining.delete(key(first.x, first.y));
		for (let i = 0; i < queue.length; i++) {
			const current = queue[i];
			component.push(current);
			getAdjacentCoordinates(current.x, current.y)
				.map(pt => squareAt.search(key(pt.x, pt.y)))
				.filter((sq): sq is CampaignMapSquareModel => !!sq && CampaignMapLogic.isClaimable(sq))
				.forEach(sq => {
					const sqKey = key(sq.x, sq.y);
					if (remaining.delete(sqKey)) {
						queue.push(sq);
					}
				});
		}
		components.push(component);
	}

	return components;
};

const ensurePassableLandIsConnected = (
	squares: CampaignMapSquareModel[],
	squareAt: HashTable<CampaignMapSquareModel>
) => {
	while (true) {
		const components = getComponents(squares, squareAt);
		if (components.length <= 1) {
			return;
		}

		const componentByKey = new Map<string, number>();
		components.forEach((component, i) =>
			component.forEach(sq => componentByKey.set(key(sq.x, sq.y), i)));

		const queue = [ ...components[0] ];
		const visited = new Set(queue.map(sq => key(sq.x, sq.y)));
		const parent = new Map<string, string>();
		let target: CampaignMapSquareModel | null = null;

		for (let i = 0; (i < queue.length) && !target; i++) {
			const current = queue[i];
			for (const pt of getAdjacentCoordinates(current.x, current.y)) {
				const adjacent = squareAt.search(key(pt.x, pt.y));
				if (!adjacent) {
					continue;
				}

				const adjacentKey = key(adjacent.x, adjacent.y);
				if (CampaignMapLogic.isClaimable(adjacent)) {
					if ((componentByKey.get(adjacentKey) ?? 0) !== 0) {
						target = adjacent;
						parent.set(adjacentKey, key(current.x, current.y));
						break;
					}
				} else if (!visited.has(adjacentKey)) {
					visited.add(adjacentKey);
					parent.set(adjacentKey, key(current.x, current.y));
					queue.push(adjacent);
				}
			}
		}

		if (!target) {
			throw new Error('Unable to connect passable island terrain');
		}

		let cursor = key(target.x, target.y);
		while (parent.has(cursor)) {
			const square = squareAt.search(cursor);
			if (square?.feature) {
				square.feature = undefined;
				break;
			}
			cursor = parent.get(cursor) as string;
		}
	}
};

const isCoastalSquare = (
	square: CampaignMapSquareModel,
	squareAt: HashTable<CampaignMapSquareModel>
) => {
	return getAdjacentCoordinates(square.x, square.y)
		.some(pt => !squareAt.search(key(pt.x, pt.y)));
};

const getSideToSquare = (square: CampaignMapSquareModel, adjacent: { x: number, y: number }) => {
	const points = getHexVertices(square);
	const center = getHexCenter(adjacent);
	let side = 0;
	let distance = Number.MAX_VALUE;
	for (let i = 0; i < points.length; i++) {
		const next = points[(i + 1) % points.length];
		const midpoint = { x: (points[i].x + next.x) / 2, y: (points[i].y + next.y) / 2 };
		const candidateDistance = Math.hypot(center.x - midpoint.x, center.y - midpoint.y);
		if (candidateDistance < distance) {
			side = i;
			distance = candidateDistance;
		}
	}
	return side;
};

interface RiverNode {
	id: string;
	x: number;
	y: number;
	elevation: number;
	hasLand: boolean;
	coast: boolean;
	lakes: Set<string>;
	neighbors: Set<string>;
}

const MOUNTAIN_HEIGHT = 7;
const MIN_RIVER_WIDTH = 0.03;
const MAX_RIVER_WIDTH = 0.15;
const RIVER_WIDTH_PER_SECTION = 0.004;
const RIVER_WIDTH_PER_TRIBUTARY = 0.004;
const MAX_SECTION_WIDTH_INCREASE = 0.008;

const getRiverGraph = (
	squares: CampaignMapSquareModel[],
	squareAt: HashTable<CampaignMapSquareModel>
) => {
	const nodes = new Map<string, RiverNode>();
	const getNode = (point: { x: number, y: number }) => {
		const id = `${point.x},${point.y}`;
		if (!nodes.has(id)) {
			nodes.set(id, {
				id,
				x: point.x,
				y: point.y,
				elevation: Number.MAX_VALUE,
				hasLand: false,
				coast: false,
				lakes: new Set<string>(),
				neighbors: new Set<string>()
			});
		}
		return nodes.get(id) as RiverNode;
	};

	for (const square of squares) {
		const vertices = getHexVertices(square);
		const adjacent = getAdjacentCoordinates(square.x, square.y);
		const sideNeighbors = new Array<{ x: number, y: number }>(vertices.length);
		adjacent.forEach(point => {
			sideNeighbors[getSideToSquare(square, point)] = point;
		});
		const isLake = square.feature === 'lake';
		vertices.forEach(point => {
			const node = getNode(point);
			if (isLake) {
				node.lakes.add(key(square.x, square.y));
			} else {
				node.hasLand = true;
				node.elevation = Math.min(node.elevation, square.height);
			}
		});
		vertices.forEach((point, index) => {
			const next = vertices[(index + 1) % vertices.length];
			const first = getNode(point);
			const second = getNode(next);
			first.neighbors.add(second.id);
			second.neighbors.add(first.id);
			if (!sideNeighbors[index] || !squareAt.search(key(sideNeighbors[index].x, sideNeighbors[index].y))) {
				first.coast = true;
				second.coast = true;
			}
		});
	}

	nodes.forEach(node => {
		if (node.elevation === Number.MAX_VALUE) {
			node.elevation = 0;
		}
	});
	return nodes;
};

const findRiverRoute = (
	source: CampaignMapSquareModel,
	nodes: Map<string, RiverNode>,
	riverNodeIDs: Set<string>,
	riverEdgeIDs: Set<string>,
	allowRiverJoin = true,
	startNodeID?: string,
	allowUphill = false,
	allowLakeJoin = true,
	blockedLakeIDs: Set<string> = new Set(),
	joinMaxElevation = Number.MAX_VALUE
) => {
	const sourceKey = key(source.x, source.y);
	const starts = getHexVertices(source);
	const queue: { node: RiverNode, elevation: number }[] = [];
	const parent = new Map<string, string | null>();
	const startIDs = startNodeID ? [ startNodeID ] : starts.map(point => `${point.x},${point.y}`);
	startIDs.forEach(id => {
		const node = nodes.get(id);
		if (node && node.hasLand && (startNodeID || !riverNodeIDs.has(id)) && !parent.has(id)) {
			parent.set(id, null);
			queue.push({ node, elevation: source.height });
		}
	});

	let target: RiverNode | null = null;
	for (let i = 0; (i < queue.length) && !target; i++) {
		const current = queue[i];
		const avoidsBlockedLake = [ ...current.node.lakes ].every(lake => !blockedLakeIDs.has(lake));
		const reachesLake = [ ...current.node.lakes ].some(lake =>
			(lake !== sourceKey) && !blockedLakeIDs.has(lake))
			&& avoidsBlockedLake;
		if ((parent.get(current.node.id) !== null)
			&& avoidsBlockedLake
			&& (current.node.coast
				|| (allowRiverJoin && riverNodeIDs.has(current.node.id) && (current.node.elevation < joinMaxElevation))
				|| (allowLakeJoin && reachesLake))) {
			target = current.node;
			break;
		}

		for (const neighborID of current.node.neighbors) {
			const neighbor = nodes.get(neighborID) as RiverNode;
			const edgeID = [ current.node.id, neighborID ].sort().join('|');
			if (parent.has(neighborID)
				|| !neighbor.hasLand
				|| (!allowRiverJoin && riverNodeIDs.has(neighborID))
				|| (riverNodeIDs.has(neighborID) && (neighbor.elevation >= joinMaxElevation))
				|| riverEdgeIDs.has(edgeID)
				|| (!allowUphill && (neighbor.elevation > current.elevation))) {
				continue;
			}
			parent.set(neighborID, current.node.id);
			queue.push({ node: neighbor, elevation: neighbor.elevation });
		}
	}

	if (!target) {
		return null;
	}

	const route = [ target ];
	let cursor: string | null = target.id;
	while (cursor !== null) {
		const parentID = parent.get(cursor);
		if (parentID === undefined) {
			return null;
		}
		if (parentID !== null) {
			route.unshift(nodes.get(parentID) as RiverNode);
		}
		cursor = parentID;
	}
	return route;
};

const createRiver = (route: RiverNode[], endWidth: number, startWidth?: number): CampaignMapRiverModel | null => {
	if (route.length < 2) {
		return null;
	}
	if (startWidth !== undefined) {
		endWidth = Math.max(startWidth, endWidth);
	}
	const widthPerSection = (endWidth - MIN_RIVER_WIDTH) / (route.length - 1);
	const outletWidthPerSection = startWidth === undefined
		? 0
		: (endWidth - startWidth) / Math.max(1, route.length - 2);
	return {
		points: route.map((node, index) => ({
			x: node.x,
			y: node.y,
			width: Math.min(MAX_RIVER_WIDTH, startWidth === undefined
				? MIN_RIVER_WIDTH + (index * widthPerSection)
				: startWidth + (Math.max(0, index - 1) * outletWidthPerSection))
		}))
	};
};

const normalizeRiverWidths = (rivers: CampaignMapRiverModel[]) => {
	const widths = new Map<string, number>();
	const edges: { from: string, to: string }[] = [];
	rivers.forEach(river => {
		river.points.forEach(point => {
			const id = `${point.x},${point.y}`;
			widths.set(id, Math.max(widths.get(id) ?? MIN_RIVER_WIDTH, point.width));
		});
		river.points.slice(1).forEach((point, index) => {
			edges.push({
				from: `${river.points[index].x},${river.points[index].y}`,
				to: `${point.x},${point.y}`
			});
		});
	});

	let changed = true;
	for (let iteration = 0; changed && (iteration < widths.size); iteration++) {
		changed = false;
		edges.forEach(edge => {
			const fromWidth = widths.get(edge.from) ?? MIN_RIVER_WIDTH;
			const toWidth = widths.get(edge.to) ?? MIN_RIVER_WIDTH;
			const nextWidth = Math.min(MAX_RIVER_WIDTH, Math.max(toWidth, fromWidth));
			const previousWidth = Math.min(MAX_RIVER_WIDTH, Math.max(fromWidth, nextWidth - MAX_SECTION_WIDTH_INCREASE));
			if ((nextWidth > toWidth) || (previousWidth > fromWidth)) {
				widths.set(edge.to, nextWidth);
				widths.set(edge.from, previousWidth);
				changed = true;
			}
		});
	}

	rivers.forEach(river => river.points.forEach(point => {
		point.width = widths.get(`${point.x},${point.y}`) ?? MIN_RIVER_WIDTH;
	}));
};

const widenDownstream = (rivers: CampaignMapRiverModel[], startID: string) => {
	const downstream = new Map<string, Set<string>>();
	rivers.forEach(river => river.points.slice(1).forEach((point, index) => {
		const fromID = `${river.points[index].x},${river.points[index].y}`;
		const toID = `${point.x},${point.y}`;
		if (!downstream.has(fromID)) {
			downstream.set(fromID, new Set<string>());
		}
		downstream.get(fromID)?.add(toID);
	}));

	const downstreamNodes = new Set([ startID ]);
	const queue = [ startID ];
	for (let i = 0; i < queue.length; i++) {
		downstream.get(queue[i])?.forEach(next => {
			if (!downstreamNodes.has(next)) {
				downstreamNodes.add(next);
				queue.push(next);
			}
		});
	}

	rivers.forEach(river => river.points.forEach(point => {
		const pointID = `${point.x},${point.y}`;
		if (downstreamNodes.has(pointID)) {
			point.width = Math.min(MAX_RIVER_WIDTH, point.width + RIVER_WIDTH_PER_TRIBUTARY);
		}
	}));

	rivers.forEach(river => river.points.forEach((point, index) => {
		if (`${point.x},${point.y}` !== startID) {
			return;
		}
		for (let distance = 1; distance <= 3; distance++) {
			const upstreamPoint = river.points[index - distance];
			if (upstreamPoint) {
				const taper = (4 - distance) / 4;
				upstreamPoint.width = Math.min(
					MAX_RIVER_WIDTH,
					upstreamPoint.width + (RIVER_WIDTH_PER_TRIBUTARY * taper)
				);
			}
		}
	}));
};

const createRivers = (
	squares: CampaignMapSquareModel[],
	squareAt: HashTable<CampaignMapSquareModel>
) => {
	const nodes = getRiverGraph(squares, squareAt);
	const sourceCount = squares.filter(square => (square.feature === 'peak') || (square.feature === 'lake')).length;
	const sources = squares
		.filter(square => square.feature === 'peak')
		.sort((a, b) =>
			(b.height - a.height)
			|| (a.y - b.y)
			|| (a.x - b.x));
	const lakeSquares = new Map(squares
		.filter(square => square.feature === 'lake')
		.map(square => [ key(square.x, square.y), square ]));
	const lakeEntries = new Map<string, CampaignMapRiverModel['points'][number][]>();
	const riverCount = Math.max(3, Math.round(sourceCount * 0.12));
	const rivers: CampaignMapRiverModel[] = [];
	const riverNodeIDs = new Set<string>();
	const riverEdgeIDs = new Set<string>();
	for (const source of sources) {
		if (rivers.length >= riverCount) {
			break;
		}
		// Prefer joining another river only once out of the mountains
		const route = findRiverRoute(source, nodes, riverNodeIDs, riverEdgeIDs, true, undefined, false, true, new Set(), MOUNTAIN_HEIGHT)
			?? findRiverRoute(source, nodes, riverNodeIDs, riverEdgeIDs);
		if (route) {
			const endpoint = route[route.length - 1];
			const endpointID = endpoint.id;
			const joinedRiver = rivers.some(river =>
				river.points.some(point => `${point.x},${point.y}` === endpointID));
			if (joinedRiver) {
				widenDownstream(rivers, endpointID);
			}
			const endWidth = joinedRiver
				? Math.max(...rivers.flatMap(river =>
					river.points
						.filter(point => `${point.x},${point.y}` === endpointID)
						.map(point => point.width)))
				: Math.min(MAX_RIVER_WIDTH, MIN_RIVER_WIDTH + ((route.length - 1) * RIVER_WIDTH_PER_SECTION));
			const river = createRiver(route, endWidth);
			if (river) {
				rivers.push(river);
				route.forEach(node => riverNodeIDs.add(node.id));
				route.slice(1).forEach((node, index) => {
					riverEdgeIDs.add([ route[index].id, node.id ].sort().join('|'));
				});
				endpoint.lakes.forEach(lakeID => {
					if (!lakeEntries.has(lakeID)) {
						lakeEntries.set(lakeID, []);
					}
					lakeEntries.get(lakeID)?.push(river.points[river.points.length - 1]);
				});
			}
		}
	}
	normalizeRiverWidths(rivers);

	const getLakeBody = (startID: string) => {
		const body = new Set<string>([ startID ]);
		const pending = [ startID ];
		while (pending.length > 0) {
			const lake = lakeSquares.get(pending.pop() as string);
			if (!lake) {
				continue;
			}
			getAdjacentCoordinates(lake.x, lake.y).forEach(point => {
				const id = key(point.x, point.y);
				if (lakeSquares.has(id) && !body.has(id)) {
					body.add(id);
					pending.push(id);
				}
			});
		}
		return body;
	};
	const lakeOutflows = new Set<string>();
	const lakesToDrain = [ ...lakeEntries.keys() ];
	const lakeAncestors = new Map<string, Set<string>>();
	for (let i = 0; i < lakesToDrain.length; i++) {
		const lakeID = lakesToDrain[i];
		if (lakeOutflows.has(lakeID)) {
			continue;
		}
		lakeOutflows.add(lakeID);
		const lake = lakeSquares.get(lakeID);
		if (!lake) {
			continue;
		}
		const entries = lakeEntries.get(lakeID) ?? [];
		const entry = entries.reduce((widest, point) => point.width > widest.width ? point : widest);
		const startWidth = entry.width;
		const ancestors = new Set<string>(getLakeBody(lakeID));
		(lakeAncestors.get(lakeID) ?? new Set<string>()).forEach(ancestorID =>
			getLakeBody(ancestorID).forEach(id => ancestors.add(id)));
		ancestors.delete(lakeID);
		const route = findRiverRoute(
			lake,
			nodes,
			riverNodeIDs,
			riverEdgeIDs,
			false,
			undefined,
			false,
			true,
			ancestors
		) ?? findRiverRoute(lake, nodes, riverNodeIDs, riverEdgeIDs, false, undefined, true, true, ancestors);
		if (!route) {
			continue;
		}
		const endpoint = route[route.length - 1];
		const endpointID = endpoint.id;
		const joinedRiver = rivers.some(river =>
			river.points.some(point => `${point.x},${point.y}` === endpointID));
		if (joinedRiver) {
			widenDownstream(rivers, endpointID);
		}
		const endWidth = joinedRiver
			? Math.max(startWidth, ...rivers.flatMap(river =>
				river.points
					.filter(point => `${point.x},${point.y}` === endpointID)
					.map(point => point.width)))
			: Math.min(MAX_RIVER_WIDTH, startWidth + (Math.max(0, route.length - 2) * RIVER_WIDTH_PER_SECTION));
		const river = createRiver(route, endWidth, startWidth);
		if (river) {
			rivers.push(river);
			route.forEach(node => riverNodeIDs.add(node.id));
			route.slice(1).forEach((node, index) => {
				riverEdgeIDs.add([ route[index].id, node.id ].sort().join('|'));
			});
			endpoint.lakes.forEach(nextLakeID => {
				if ((nextLakeID === lakeID) || lakeOutflows.has(nextLakeID)) {
					return;
				}
				if (!lakeEntries.has(nextLakeID)) {
					lakeEntries.set(nextLakeID, []);
				}
				lakeEntries.get(nextLakeID)?.push(river.points[river.points.length - 1]);
				const nextAncestors = lakeAncestors.get(nextLakeID) ?? new Set<string>();
				ancestors.forEach(ancestorID => nextAncestors.add(ancestorID));
				nextAncestors.add(lakeID);
				lakeAncestors.set(nextLakeID, nextAncestors);
				if (!lakesToDrain.includes(nextLakeID)) {
					lakesToDrain.push(nextLakeID);
				}
			});
		}
	}
	for (let iteration = 0; iteration <= lakeSquares.size; iteration++) {
		normalizeRiverWidths(rivers);
		let changed = false;
		lakeSquares.forEach(lake => {
			const vertexIDs = new Set(getHexVertices(lake).map(point => `${point.x},${point.y}`));
			const incomingPoints = rivers
				.filter(river => vertexIDs.has(`${river.points[river.points.length - 1].x},${river.points[river.points.length - 1].y}`))
				.map(river => river.points[river.points.length - 1]);
			const outgoingRivers = rivers.filter(river => vertexIDs.has(`${river.points[0].x},${river.points[0].y}`));
			if ((incomingPoints.length === 0) || (outgoingRivers.length === 0)) {
				return;
			}
			const connectedPoints = [
				...incomingPoints,
				...outgoingRivers.flatMap(river => river.points.slice(0, 2))
			];
			const width = Math.max(...connectedPoints.map(point => point.width));
			connectedPoints.forEach(point => {
				if (point.width < width) {
					point.width = width;
					changed = true;
				}
			});
		});
		if (!changed) {
			break;
		}
	}
	normalizeRiverWidths(rivers);
	return rivers;
};

const getDistancesFromCoast = (
	squares: CampaignMapSquareModel[],
	squareAt: HashTable<CampaignMapSquareModel>
) => {
	const distances = new Map<string, number>();
	const queue = squares.filter(sq => isCoastalSquare(sq, squareAt));
	queue.forEach(sq => distances.set(key(sq.x, sq.y), 0));

	for (let i = 0; i < queue.length; i++) {
		const current = queue[i];
		const distance = distances.get(key(current.x, current.y)) as number;
		getAdjacentCoordinates(current.x, current.y)
			.map(pt => squareAt.search(key(pt.x, pt.y)))
			.filter((sq): sq is CampaignMapSquareModel => !!sq)
			.forEach(sq => {
				const sqKey = key(sq.x, sq.y);
				if (!distances.has(sqKey)) {
					distances.set(sqKey, distance + 1);
					queue.push(sq);
				}
			});
	}

	return distances;
};

const getMoistureDistances = (
	squares: CampaignMapSquareModel[],
	squareAt: HashTable<CampaignMapSquareModel>
) => {
	const distances = new Map<string, number>();
	const queue = squares.filter(sq => isCoastalSquare(sq, squareAt) || (sq.feature === 'lake'));
	queue.forEach(sq => distances.set(key(sq.x, sq.y), 0));

	for (let i = 0; i < queue.length; i++) {
		const current = queue[i];
		const distance = distances.get(key(current.x, current.y)) as number;
		getAdjacentCoordinates(current.x, current.y)
			.map(pt => squareAt.search(key(pt.x, pt.y)))
			.filter((sq): sq is CampaignMapSquareModel => !!sq)
			.forEach(sq => {
				const sqKey = key(sq.x, sq.y);
				if (!distances.has(sqKey)) {
					distances.set(sqKey, distance + 1);
					queue.push(sq);
				}
			});
	}

	return distances;
};

const isRainShadowed = (
	square: CampaignMapSquareModel,
	squareAt: HashTable<CampaignMapSquareModel>,
	windDirection: number
) => {
	const upwindDirection = (windDirection + 3) % 6;
	let { x, y } = square;

	for (let i = 0; i < 5; i++) {
		const next = getAdjacentCoordinates(x, y)[upwindDirection];
		x = next.x;
		y = next.y;
		const upwind = squareAt.search(key(x, y));
		if (!upwind) {
			return false;
		}
		if (upwind.feature === 'peak') {
			return true;
		}
	}

	return false;
};

const getTerrain = (
	square: CampaignMapSquareModel,
	moisture: number,
	isWarm: boolean,
	rng: () => number
) => {
	if ((square.height >= 7) && (Random.randomNumber(100, rng) === 0)) {
		return 'Volcanic';
	}

	if (square.height >= 7) {
		if (moisture <= 2) {
			return Collections.draw([ 'Plateaus', 'Canyons' ], rng);
		}
		return moisture >= 7 ? 'Taiga' : 'Mountains';
	}

	if (square.height >= 3) {
		if (moisture <= 2) {
			return Collections.draw([ 'Badlands', 'Scrubland', 'Steppe' ], rng);
		}
		return moisture >= 7 ? 'Forest' : Collections.draw([ 'Valleys', 'Plains' ], rng);
	}

	if (moisture <= 2) {
		return Collections.draw([ 'Desert', 'Salt flats' ], rng);
	}
	if (moisture <= 5) {
		return 'Plains';
	}
	if (isWarm) {
		return Collections.draw([ 'Jungle', 'Rainforest' ], rng);
	}
	if (square.feature === 'lake') {
		return 'Lakes';
	}
	return Collections.draw([ 'Fens', 'Marshland', 'Wetlands', 'Lakes' ], rng);
};

export class CampaignMapGenerator {
	static generateCampaignMap = (packIDs: string[], rng: () => number): CampaignMapModel => {
		const seed = [ rng(), rng(), rng(), rng() ]
			.map(n => Math.floor(n * 0x100000000).toString(16).padStart(8, '0'))
			.join('');
		const width = 64;
		const height = 48;
		const coarseNoise = createNoiseGrid(9, 7, rng);
		const mediumNoise = createNoiseGrid(17, 13, rng);
		const fineNoise = createNoiseGrid(33, 25, rng);
		const candidates: Candidate[] = [];
		const candidateAt = new HashTable<Candidate>();

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const noise = (sampleNoise(coarseNoise, x, y, width, height) * 0.55)
					+ (sampleNoise(mediumNoise, x, y, width, height) * 0.3)
					+ (sampleNoise(fineNoise, x, y, width, height) * 0.15);
				const radius = Math.hypot((x - 31.5) / 32, (y - 23.5) / 24);
				const score = noise - (Math.max(0, radius - 0.4) * 1.5);
				const candidate = { x: x, y: y, noise: noise, score: score };
				candidates.push(candidate);
				candidateAt.insert(key(x, y), candidate);
			}
		}

		const landCandidates: Candidate[] = [];
		const first = Collections.max(candidates, candidate => candidate.score) as Candidate;
		const frontier = [ first ];
		const frontierKeys = new Set([ key(first.x, first.y) ]);
		const landKeys = new Set<string>();

		while (landCandidates.length < 1000) {
			let bestIndex = -1;
			for (let i = 0; i < frontier.length; i++) {
				if ((bestIndex < 0) || (frontier[i].score > frontier[bestIndex].score)) {
					bestIndex = i;
				}
			}

			if (bestIndex < 0) {
				throw new Error('Unable to grow the island to the target size');
			}

			const [ candidate ] = frontier.splice(bestIndex, 1);
			const candidateKey = key(candidate.x, candidate.y);
			frontierKeys.delete(candidateKey);
			if (landKeys.has(candidateKey)) {
				continue;
			}

			landKeys.add(candidateKey);
			landCandidates.push(candidate);
			getAdjacentCoordinates(candidate.x, candidate.y).forEach(pt => {
				const adjacentKey = key(pt.x, pt.y);
				const adjacent = candidateAt.search(adjacentKey);
				if (adjacent && !landKeys.has(adjacentKey) && !frontierKeys.has(adjacentKey)) {
					frontier.push(adjacent);
					frontierKeys.add(adjacentKey);
				}
			});
		}

		const squares: CampaignMapSquareModel[] = landCandidates.map(candidate => ({
			x: candidate.x,
			y: candidate.y,
			regionID: '',
			terrain: '',
			height: 0
		}));
		const squareAt = new HashTable<CampaignMapSquareModel>();
		squares.forEach(square => squareAt.insert(key(square.x, square.y), square));

		const coastDistances = getDistancesFromCoast(squares, squareAt);
		const maxDistance = Math.max(...coastDistances.values());
		squares.forEach(square => {
			const noise = candidateAt.search(key(square.x, square.y))?.noise ?? 0.5;
			const distance = coastDistances.get(key(square.x, square.y)) ?? 0;
			square.height = Math.max(0, Math.min(9, Math.round(
				((distance / maxDistance) * 7.5) + ((noise - 0.5) * 3)
			)));
		});

		const peakCount = Math.round(squares.length * 0.06);
		[ ...squares ]
			.sort((a, b) => (b.height - a.height) || ((candidateAt.search(key(b.x, b.y))?.noise ?? 0) - (candidateAt.search(key(a.x, a.y))?.noise ?? 0)))
			.slice(0, peakCount)
			.forEach(square => square.feature = 'peak');
		ensurePassableLandIsConnected(squares, squareAt);

		const lakeCount = Math.round(squares.length * 0.03);
		const lakeCandidates = [ ...squares ]
			.filter(square => !square.feature && (coastDistances.get(key(square.x, square.y)) ?? 0) > 1)
			.sort((a, b) => a.height - b.height);
		let lakesPlaced = 0;
		for (const square of lakeCandidates) {
			if (lakesPlaced >= lakeCount) {
				break;
			}
			square.feature = 'lake';
			if (getComponents(squares, squareAt).length === 1) {
				lakesPlaced++;
			} else {
				square.feature = undefined;
			}
		}

		ensurePassableLandIsConnected(squares, squareAt);

		const moistureDistances = getMoistureDistances(squares, squareAt);
		const windDirection = Random.randomNumber(6, rng);
		const minY = Math.min(...squares.map(square => square.y));
		const maxY = Math.max(...squares.map(square => square.y));
		squares.forEach(square => {
			const distance = moistureDistances.get(key(square.x, square.y)) ?? 10;
			const rainShadow = isRainShadowed(square, squareAt, windDirection) ? 3 : 0;
			const moisture = Math.max(0, Math.min(9,
				9 - (distance * 1.1) - rainShadow + ((candidateAt.search(key(square.x, square.y))?.noise ?? 0.5) - 0.5) * 2));
			const isWarm = square.y > (minY + ((maxY - minY) * 0.55));
			square.terrain = getTerrain(square, moisture, isWarm, rng);
		});

		const claimable = squares.filter(CampaignMapLogic.isClaimable);
		const regionCount = 1 + Math.floor(claimable.length / 20);
		const regions: RegionModel[] = [];
		const regionSeeds: CampaignMapSquareModel[] = [];
		const minSeedDistance = new Map<string, number>();
		let nextSeed = Collections.draw(claimable, rng);

		while (regionSeeds.length < regionCount) {
			regionSeeds.push(nextSeed);
			const queue = [ nextSeed ];
			const distances = new Map<string, number>([ [ key(nextSeed.x, nextSeed.y), 0 ] ]);
			for (let i = 0; i < queue.length; i++) {
				const current = queue[i];
				const distance = distances.get(key(current.x, current.y)) as number;
				getAdjacentCoordinates(current.x, current.y)
					.map(pt => squareAt.search(key(pt.x, pt.y)))
					.filter((sq): sq is CampaignMapSquareModel => !!sq && CampaignMapLogic.isClaimable(sq))
					.forEach(sq => {
						const sqKey = key(sq.x, sq.y);
						if (!distances.has(sqKey)) {
							distances.set(sqKey, distance + 1);
							queue.push(sq);
						}
					});
			}
			distances.forEach((distance, sqKey) => {
				minSeedDistance.set(sqKey, Math.min(minSeedDistance.get(sqKey) ?? Number.MAX_VALUE, distance));
			});

			if (regionSeeds.length < regionCount) {
				const remaining = claimable.filter(square => !regionSeeds.includes(square));
				const maxDistance = Math.max(...remaining.map(square => minSeedDistance.get(key(square.x, square.y)) ?? 0));
				nextSeed = Collections.draw(remaining.filter(square =>
					(minSeedDistance.get(key(square.x, square.y)) ?? 0) === maxDistance
				), rng);
			}
		}

		regionSeeds.forEach((square, i) => {
			const region: RegionModel = {
				id: Utils.guid(rng),
				name: NameGenerator.generateName(rng),
				color: Color.toString(Random.randomColor(20, 230, rng)),
				encounters: [],
				boon: BoonGenerator.generateBoon(packIDs, rng),
				demographics: {
					size: 0,
					population: 0,
					terrain: ''
				}
			};
			regions.push(region);
			square.regionID = region.id;
		});

		const frontiers = new Map<string, Set<string>>();
		const seedTerrain = new Map<string, string>();
		const regionSizes = new Map<string, number>();
		regions.forEach((region, i) => {
			const frontierKeys = new Set<string>();
			frontiers.set(region.id, frontierKeys);
			seedTerrain.set(region.id, regionSeeds[i].terrain);
			regionSizes.set(region.id, 1);
			getAdjacentCoordinates(regionSeeds[i].x, regionSeeds[i].y).forEach(pt => {
				const adjacent = squareAt.search(key(pt.x, pt.y));
				if (adjacent && CampaignMapLogic.isClaimable(adjacent) && !adjacent.regionID) {
					frontierKeys.add(key(adjacent.x, adjacent.y));
				}
			});
		});

		const regionOrder = Collections.shuffle(regions, rng);
		let remainingSquares = claimable.length - regionSeeds.length;
		while (remainingSquares > 0) {
			let claimedThisRound = 0;
			for (const region of regionOrder) {
				if ((regionSizes.get(region.id) ?? 0) >= 40) {
					continue;
				}

				const frontierKeys = frontiers.get(region.id) as Set<string>;
				let bestSquare: CampaignMapSquareModel | null = null;
				let bestCost = Number.MAX_VALUE;
				for (const frontierKey of frontierKeys) {
					const square = squareAt.search(frontierKey);
					if (!square || square.regionID) {
						continue;
					}

					const parents = getAdjacentCoordinates(square.x, square.y)
						.map(pt => squareAt.search(key(pt.x, pt.y)))
						.filter((sq): sq is CampaignMapSquareModel => !!sq && (sq.regionID === region.id));
					const parentCost = Math.min(...parents.map(parent =>
						Math.max(0, square.height - parent.height)
						+ ((square.terrain === seedTerrain.get(region.id)) ? 0 : 1)
					));
					const cost = parentCost + (rng() * 0.001);
					if (cost < bestCost) {
						bestSquare = square;
						bestCost = cost;
					}
				}

				if (!bestSquare) {
					continue;
				}

				bestSquare.regionID = region.id;
				frontierKeys.delete(key(bestSquare.x, bestSquare.y));
				regionSizes.set(region.id, (regionSizes.get(region.id) ?? 0) + 1);
				for (const otherFrontier of frontiers.values()) {
					otherFrontier.delete(key(bestSquare.x, bestSquare.y));
				}
				getAdjacentCoordinates(bestSquare.x, bestSquare.y).forEach(pt => {
					const adjacent = squareAt.search(key(pt.x, pt.y));
					if (adjacent && CampaignMapLogic.isClaimable(adjacent) && !adjacent.regionID) {
						frontierKeys.add(key(adjacent.x, adjacent.y));
					}
				});
				remainingSquares--;
				claimedThisRound++;
			}

			if (claimedThisRound === 0) {
				throw new Error('Unable to assign every claimable island hex to a region');
			}
		}

		for (const region of [ ...regions ]) {
			const size = regionSizes.get(region.id) ?? 0;
			if (size >= 8) {
				continue;
			}

			const borderLengths = new Map<string, number>();
			squares
				.filter(square => square.regionID === region.id)
				.forEach(square => {
					getAdjacentCoordinates(square.x, square.y)
						.map(pt => squareAt.search(key(pt.x, pt.y)))
						.filter((sq): sq is CampaignMapSquareModel => !!sq && !!sq.regionID && (sq.regionID !== region.id))
						.forEach(sq => borderLengths.set(sq.regionID, (borderLengths.get(sq.regionID) ?? 0) + 1));
				});

			const target = Collections.max(
				[ ...borderLengths.keys() ]
					.map(id => regions.find(candidate => candidate.id === id))
					.filter((candidate): candidate is RegionModel =>
						!!candidate && ((regionSizes.get(candidate.id) ?? 0) + size <= 40)),
				candidate => borderLengths.get(candidate.id) ?? 0
			);
			if (!target) {
				throw new Error('Unable to merge an undersized island region');
			}

			squares.filter(square => square.regionID === region.id).forEach(square => square.regionID = target.id);
			regionSizes.set(target.id, (regionSizes.get(target.id) ?? 0) + size);
			regions.splice(regions.indexOf(region), 1);
		}

		regions.forEach(region => {
			const regionSquares = squares.filter(square => square.regionID === region.id);
			region.demographics.size = regionSquares.length;
			region.demographics.population = Random.dice(regionSquares.length, rng);
			const terrainCounts = new Map<string, number>();
			regionSquares.forEach(square => terrainCounts.set(square.terrain, (terrainCounts.get(square.terrain) ?? 0) + 1));
			region.demographics.terrain = Collections.max(
				[ ...terrainCounts.keys() ],
				terrain => terrainCounts.get(terrain) ?? 0
			) as string;

			const count = Random.randomNumber(9, rng) + 1;
			while (region.encounters.length < count) {
				region.encounters.push(Utils.guid(rng));
			}
		});

		// Lakes shape the land (moisture and region borders) but are not part of the map:
		// they are left as gaps, like the sea.
		const map: CampaignMapModel = {
			squares: squares.filter(square => square.feature !== 'lake'),
			regions: regions,
			seed: seed,
			history: [],
			lakes: squares
				.filter(square => square.feature === 'lake')
				.map(square => ({ x: square.x, y: square.y })),
			rivers: createRivers(squares, squareAt)
		};
		map.regions.forEach(region => {
			const centre = CampaignMapLogic.getCentralSquare(map, region);
			if (centre) {
				centre.feature = 'settlement';
			}
		});
		const coastalRegions = map.regions.filter(region =>
			CampaignMapLogic.getSquares(map, region).some(square => isCoastalSquare(square, squareAt)));
		const startingRegion = Collections.draw(coastalRegions, rng);
		CampaignMapLogic.conquerRegion(map, startingRegion);

		return map;
	};
}
