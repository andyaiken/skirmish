import { CampaignMapLogic } from '../../logic/campaign-map/campaign-map-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../../models/campaign-map';
import type { RegionModel } from '../../models/region';

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
			history: []
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
