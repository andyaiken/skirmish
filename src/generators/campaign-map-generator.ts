import { CampaignMapLogic } from '../logic/campaign-map-logic';

import type { CampaignMapModel, CampaignMapSquareModel } from '../models/campaign-map';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { BoonGenerator } from './boon-generator';
import { NameGenerator } from './name-generator';

export class CampaignMapGenerator {
	static generateCampaignMap = (packIDs: string[]): CampaignMapModel => {
		const map: CampaignMapModel = {
			squares: [ {
				x: 0,
				y: 0,
				regionID: ''
			} ],
			regions: []
		};

		while (map.squares.length < 1000) {
			const parent = Collections.draw(map.squares);

			let x = parent.x;
			let y = parent.y;
			const dir = Random.randomNumber(4);
			switch (dir) {
				case 0:
					y -= 1;
					break;
				case 1:
					x += 1;
					break;
				case 2:
					y += 1;
					break;
				case 3:
					x -= 1;
					break;
			}

			const exists = map.squares.find(sq => (sq.x === x) && (sq.y === y));
			if (!exists) {
				map.squares.push({
					x: x,
					y: y,
					regionID: ''
				});
			}
		}

		const regionCount = map.squares.length / 20;
		while (map.regions.length !== regionCount) {
			// The lightest colour we will allow is rgb(229, 229, 229)
			// This is so that the player (white) stands out
			const color = Random.randomColor(0, 230);

			map.regions.push({
				id: Utils.guid(),
				name: NameGenerator.generateName(),
				color: color,
				encounters: [],
				boon: BoonGenerator.generateBoon(packIDs),
				demographics: {
					size: 0,
					population: 0,
					terrain: ''
				}
			});
		}

		map.regions.forEach(region => {
			const unclaimed = map.squares.filter(sq => sq.regionID === '');
			const square = Collections.draw(unclaimed);
			square.regionID = region.id;
		});

		do {
			// Pick a region
			map.regions.forEach(region => {
				// Find all adjacent squares
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
					const square = Collections.draw(candidates);
					square.regionID = region.id;
				}
			});
		} while (map.squares.filter(sq => sq.regionID === '').length !== 0);

		map.regions.forEach(region => {
			const size = CampaignMapLogic.getSquares(map, region).length;
			region.demographics.size = size;
			region.demographics.population = Random.dice(size);

			const terrains = [
				'Badlands',
				'Canyons',
				'Desert',
				'Fens',
				'Forest',
				'Jungle',
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
				'Volcanic'
			];
			region.demographics.terrain = Collections.draw(terrains);

			const count = Random.randomNumber(10) + 1;
			while (region.encounters.length < count) {
				region.encounters.push(Utils.guid());
			}
		});

		return map;
	};
}
