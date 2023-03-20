import { EncounterLogic } from './encounter-logic';

import type { CombatantModel } from '../models/combatant';
import type { EncounterModel } from '../models/encounter';
import type { PathModel } from '../models/path';

export class PathLogic {
	static findPaths = (encounter: EncounterModel, combatant: CombatantModel) => {
		const paths: PathModel[] = [
			{
				x: combatant.combat.position.x,
				y: combatant.combat.position.y,
				steps: [],
				cost: 0,
				working: true
			}
		];

		while (paths.filter(p => p.working).length > 0) {
			PathLogic.findSteps(encounter, combatant, paths);
		}

		return paths.filter(path => path.cost <= combatant.combat.movement);
	};

	static findSteps = (encounter: EncounterModel, combatant: CombatantModel, paths: PathModel[]) => {
		const workingSet = paths.filter(path => path.working).filter(path => path.cost <= combatant.combat.movement);
		paths.forEach(path => path.working = false);

		workingSet.forEach(path => {
			[ 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw' ].forEach(dir => {
				const pos = { x: path.x, y: path.y };
				switch (dir) {
					case 'n':
						pos.y -= 1;
						break;
					case 'ne':
						pos.x += 1;
						pos.y -= 1;
						break;
					case 'e':
						pos.x += 1;
						break;
					case 'se':
						pos.x += 1;
						pos.y += 1;
						break;
					case 's':
						pos.y += 1;
						break;
					case 'sw':
						pos.x -= 1;
						pos.y += 1;
						break;
					case 'w':
						pos.x -= 1;
						break;
					case 'nw':
						pos.x -= 1;
						pos.y -= 1;
						break;
				}
				const cost = EncounterLogic.getMoveCost(encounter, combatant, { x: path.x, y: path.y }, dir);
				const discovered = paths.find(p => (p.x === pos.x) && (p.y === pos.y));
				if (!discovered) {
					if (cost !== Number.MAX_VALUE) {
						const newPath = {
							x: pos.x,
							y: pos.y,
							steps: JSON.parse(JSON.stringify(path.steps)) as string[],
							cost: path.cost + cost,
							working: true
						};
						newPath.steps.push(dir);
						if (newPath.cost <= combatant.combat.movement) {
							paths.push(newPath);
						}
					}
				} else {
					if (cost < discovered.cost) {
						// We've been to this square before, but this is a cheaper path
						// TODO: Update all existing paths accordingly
					}
				}
			});
		});
	};
}
