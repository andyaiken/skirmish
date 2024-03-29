import { CampaignMapLogic } from '../logic/campaign-map-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../models/campaign-map';

import { Collections } from '../utils/collections';
import { Color } from '../utils/color';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { BoonGenerator } from './boon-generator';
import { NameGenerator } from './name-generator';

export class CampaignMapGenerator {
	static generateCampaignMap = (packIDs: string[], rng: () => number): CampaignMapModel => {
		const map: CampaignMapModel = {
			squares: [ {
				x: 0,
				y: 0,
				regionID: ''
			} ],
			regions: []
		};

		while (map.squares.length < 1000) {
			const parent = Collections.draw(map.squares, rng);

			let adjacent = [];
			if (parent.x % 2 === 0) {
				adjacent = [
					{ x: parent.x, y: parent.y - 1, regionID: '' },
					{ x: parent.x + 1, y: parent.y, regionID: '' },
					{ x: parent.x + 1, y: parent.y + 1, regionID: '' },
					{ x: parent.x, y: parent.y + 1, regionID: '' },
					{ x: parent.x - 1, y: parent.y + 1, regionID: '' },
					{ x: parent.x - 1, y: parent.y, regionID: '' }
				];
			} else {
				adjacent = [
					{ x: parent.x, y: parent.y - 1, regionID: '' },
					{ x: parent.x + 1, y: parent.y - 1, regionID: '' },
					{ x: parent.x + 1, y: parent.y, regionID: '' },
					{ x: parent.x, y: parent.y + 1, regionID: '' },
					{ x: parent.x - 1, y: parent.y, regionID: '' },
					{ x: parent.x - 1, y: parent.y - 1, regionID: '' }
				];
			}

			const empty = adjacent.filter(e => !map.squares.find(sq => (sq.x === e.x) && (sq.y === e.y)));
			if (empty.length > 0) {
				const sq = Collections.draw(empty, rng);
				map.squares.push(sq);
			}
		}

		const regionCount = 1 + (map.squares.length / 20);
		while (map.regions.length !== regionCount) {
			// The lightest colour we will allow is rgb(229, 229, 229)
			// This is so that the player (white) stands out
			const color = Random.randomColor(20, 230, rng);

			map.regions.push({
				id: Utils.guid(),
				name: NameGenerator.generateName(Math.random),
				color: Color.toString(color),
				encounters: [],
				boon: BoonGenerator.generateBoon(packIDs, Math.random),
				demographics: {
					size: 0,
					population: 0,
					terrain: ''
				}
			});
		}

		map.regions.forEach(region => {
			const unclaimed = map.squares.filter(sq => sq.regionID === '');
			const square = Collections.draw(unclaimed, rng);
			square.regionID = region.id;
		});

		while (map.squares.filter(sq => sq.regionID === '').length !== 0) {
			// Pick a region
			map.regions.forEach(region => {
				// Find all adjacent unclaimed squares
				const candidates: CampaignMapSquareModel[] = [];
				map.squares
					.filter(sq => sq.regionID === region.id)
					.forEach(sq => {
						CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y)
							.filter(s => s.regionID === '')
							.forEach(s => candidates.push(s));
					});

				// Pick a square and claim it
				if (candidates.length > 0) {
					const square = Collections.draw(candidates, rng);
					square.regionID = region.id;
				}
			});
		}

		map.regions.forEach(region => {
			const size = CampaignMapLogic.getSquares(map, region).length;
			region.demographics.size = size;
			region.demographics.population = Random.dice(size, rng);

			const terrains = [
				'Badlands',
				'Canyons',
				'Desert',
				'Fens',
				'Forest',
				'Jungle',
				'Lakes',
				'Marshland',
				'Mountains',
				'Plains',
				'Plateaus',
				'Rainforest',
				'Riverlands',
				'Salt flats',
				'Scrubland',
				'Steppe',
				'Taiga',
				'Valleys',
				'Volcanic',
				'Wetlands'
			];
			region.demographics.terrain = Collections.draw(terrains, rng);

			const count = Random.randomNumber(9, rng) + 1;
			while (region.encounters.length < count) {
				region.encounters.push(Utils.guid());
			}
		});

		// Find a coastal region and conquer it
		const coastalRegions = map.regions.filter(region => {
			const squares = CampaignMapLogic.getSquares(map, region);
			return squares.some(sq => CampaignMapLogic.getAdjacentSquares(map, sq.x, sq.y).length !== 6);
		});
		const startingRegion = Collections.draw(coastalRegions, rng);
		CampaignMapLogic.conquerRegion(map, startingRegion);

		return map;
	};
}
