import { UniversalData } from '../data/universal-data';

import { CombatantState } from '../enums/combatant-state';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionPrerequisites } from './action-logic';
import { EncounterLogic } from './encounter-logic';
import { EncounterMapLogic } from './encounter-map-logic';

import type { IntentModel, IntentsModel } from '../models/intent';
import type { ActionModel } from '../models/action';
import type { CombatantModel } from '../models/combatant';
import type { EncounterModel } from '../models/encounter';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

interface PathModel {
	x: number;
	y: number;
	steps: string[];
	cost: number;
	working: boolean;
}

export class Intents {
	static hide = (): IntentModel => {
		return {
			id: 'hide',
			data: null
		};
	};

	static standUp = (): IntentModel => {
		return {
			id: 'stand-up',
			data: null
		};
	};

	static move = (dir: string): IntentModel => {
		return {
			id: 'move',
			data: dir
		};
	};

	static action = (action: ActionModel): IntentModel => {
		return {
			id: 'action',
			data: action
		};
	};
}

export class MonsterLogic {
	static getIntents = (encounter: EncounterModel, combatant: CombatantModel) => {
		const options: IntentsModel[] = [];

		if (combatant.combat.actions.length > 0) {
			const actions = combatant.combat.actions.filter(a => a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, encounter)));
			if (actions.length === 0) {
				actions.push(...UniversalData.getUniversalActions().filter(a => a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, encounter))));
			}
			actions.forEach(action => {
				// This assumes we want to target an enemy
				// TODO: Determine what we want to be in range of
				// TODO: Handle actions that target self, allies, squares, or walls
				options.push(...MonsterLogic.getAttackIntents(encounter, combatant, action));
			});
		} else {
			// TODO: If we're adjacent to an enemy, and we have enough movement, move out of melee
		}

		const paths = MonsterLogic.findPaths(encounter, combatant).filter(p => (p.cost > 0) && (p.cost <= combatant.combat.movement));
		if (paths.length > 0) {
			const path = Collections.draw(paths);
			options.push({
				description: 'Move',
				intents: [
					...path.steps.map(step => Intents.move(step))
				],
				weight: 0
			});
		}

		if ((combatant.combat.damage > 0) && (combatant.combat.wounds + 1 > EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve))) {
			// TODO: If there is there an ally that could heal us, move to them
			// TODO: Otherwise, move to safety
		}

		const hide = EncounterLogic.getSkillRank(encounter, combatant, SkillType.Stealth);
		if ((hide > 0) && (combatant.combat.movement >= 4)) {
			options.push({
				description: 'Hide',
				intents: [ Intents.hide() ],
				weight: hide
			});
		}

		if ((combatant.combat.state === CombatantState.Prone) && (combatant.combat.movement >= 8)) {
			options.push({
				description: 'Stand Up',
				intents: [ Intents.standUp() ],
				weight: 5
			});
		}

		return Collections.max(options, o => Random.dice(o.weight));
	};

	static getAttackIntents = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		const edges = EncounterMapLogic.getMapEdges(encounter.mapSquares);
		const allPaths = MonsterLogic.findPaths(encounter, combatant);

		const options: IntentsModel[] = [];

		encounter.combatants
			.filter(c => c.type !== combatant.type)
			.forEach(enemy => {
				const enemySquares = EncounterLogic.getCombatantSquares(encounter, enemy);
				const paths = encounter.mapSquares
					.filter(sq => EncounterMapLogic.canSeeAny(edges, enemySquares, [ sq ]))
					.filter(sq => {
						// TODO: Limit this to squares which would put us within range for this action
						return true;
					})
					.map(sq => {
						// Find the cheapest path to this square
						return allPaths.find(path => (sq.x === path.x) && (sq.y === path.y)) || null;
					})
					.filter(p => {
						const cost = p ? p.cost : Number.MAX_VALUE;
						return cost <= combatant.combat.movement;
					});
				if (paths.length > 0) {
					const path = paths
						.reduce((best, current) => {
							const costBest = best ? best.cost : Number.MAX_VALUE;
							const costCurrent = current ? current.cost : Number.MAX_VALUE;
							return (costCurrent < costBest) ? current : best;
						});
					if (path) {
						options.push({
							description: action.name,
							intents: [
								...path.steps.map(step => Intents.move(step)),
								Intents.action(action)
							],
							// TODO: Weight this based on how many targets we can hit with it
							weight: 1
						});
					}
				}
			});

		return options;
	};

	static performIntents = (encounter: EncounterModel, combatant: CombatantModel): void => {
		if ((combatant.combat.intents === null) || (combatant.combat.intents.intents.length === 0)) {
			EncounterLogic.endTurn(encounter);
			return;
		}

		combatant.combat.intents.intents.forEach(intent => {
			switch (intent.id) {
				case 'hide': {
					if (combatant.combat.movement >= 4) {
						EncounterLogic.hide(encounter, combatant);
					}
					break;
				}
				case 'stand-up': {
					if (combatant.combat.movement >= 8) {
						EncounterLogic.standUpSitDown(encounter, combatant);
					}
					break;
				}
				case 'move': {
					const dir = intent.data as string;
					const cost = EncounterLogic.getMoveCost(encounter, combatant, combatant.combat.position, dir);
					if (combatant.combat.movement >= cost) {
						EncounterLogic.move(encounter, combatant, dir, cost);
					}
					break;
				}
				case 'action': {
					const action = intent.data as ActionModel;
					EncounterLogic.selectAction(encounter, combatant, action);
					EncounterLogic.runAction(encounter, combatant);
					break;
				}
			}
		});

		combatant.combat.intents = MonsterLogic.getIntents(encounter, combatant);
	};

	static findPaths = (encounter: EncounterModel, combatant: CombatantModel) => {
		const paths: PathModel[] = [ { x: combatant.combat.position.x, y: combatant.combat.position.y, steps: [], cost: 0, working: true } ];

		while (paths.filter(p => p.working).length > 0) {
			MonsterLogic.findSteps(encounter, combatant, paths);
		}

		return paths;
	};

	static findSteps = (encounter: EncounterModel, combatant: CombatantModel, paths: PathModel[]) => {
		const workingSet = paths.filter(path => path.working);
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
						paths.push(newPath);
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
