import { ActionTargetType } from '../enums/action-target-type';
import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionLogic, ActionPrerequisites } from './action-logic';
import { EncounterLogic } from './encounter-logic';
import { EncounterMapLogic } from './encounter-map-logic';
import { PathLogic } from './path-logic';

import type { ActionModel, ActionTargetParameterModel } from '../models/action';
import type { EncounterMapEdgeModel, EncounterModel } from '../models/encounter';
import type { IntentModel, IntentsModel } from '../models/intent';
import type { CombatantModel } from '../models/combatant';
import type { PathModel } from '../models/path';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

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

export class IntentsLogic {
	static getIntents = (encounter: EncounterModel, combatant: CombatantModel) => {
		const paths = PathLogic.findPaths(encounter, combatant);
		const edges = EncounterMapLogic.getMapEdges(encounter.mapSquares);

		const options: IntentsModel[] = [];

		combatant.combat.actions
			.filter(a => a.prerequisites.every(p => ActionPrerequisites.isSatisfied(p, encounter, combatant)))
			.forEach(action => {
				action.parameters.forEach(param => {
					if (param.id === 'targets') {
						const targetParam = param as ActionTargetParameterModel;
						if (targetParam.targets === null) {
							options.push({
								description: action.name,
								intents: [ Intents.action(action) ],
								weight: 2
							});
						} else {
							switch (targetParam.targets.type) {
								case ActionTargetType.Enemies:
								case ActionTargetType.Combatants:
									options.push(...IntentsLogic.getCombatantTargetIntents(encounter, combatant, action, CombatantType.Hero, paths, edges));
									break;
								case ActionTargetType.Allies:
									options.push(...IntentsLogic.getCombatantTargetIntents(encounter, combatant, action, CombatantType.Monster, paths, edges));
									break;
								case ActionTargetType.Squares:
									options.push(...IntentsLogic.getSquareTargetIntents(encounter, combatant, action, paths, edges));
									break;
								case ActionTargetType.Walls:
									options.push(...IntentsLogic.getWallTargetIntents(encounter, combatant, action, paths));
									break;
							}
						}
					}
				});
			});

		options.push(...IntentsLogic.getMovementIntents(encounter, combatant, paths));
		options.push(...IntentsLogic.getAttackIntents(encounter, combatant));

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

	static getCombatantTargetIntents = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel, type: CombatantType, paths: PathModel[], edges: EncounterMapEdgeModel) => {
		const range = ActionLogic.getActionRange(action);

		const intents: IntentsModel[] = [];

		encounter.combatants
			.filter(c => c.type === type)
			.forEach(target => {
				const targetSquares = EncounterLogic.getCombatantSquares(encounter, target);
				const candidatePaths = encounter.mapSquares
					.filter(sq => EncounterMapLogic.canSeeAny(edges, targetSquares, [ sq ]))
					.filter(sq => {
						// Limit this to squares which would put us within range for this action
						return EncounterMapLogic.getDistanceAny(targetSquares, [ sq ]) <= range;
					})
					.map(sq => {
						// Find the cheapest path to this square
						return paths.find(path => (sq.x === path.x) && (sq.y === path.y)) || null;
					})
					.filter(p => {
						// Limit this to paths we have enough movement for
						const cost = p ? p.cost : Number.MAX_VALUE;
						return cost <= combatant.combat.movement;
					});
				if (candidatePaths.length > 0) {
					const path = Collections.min(candidatePaths, p => p?.cost || Number.MAX_VALUE);
					if (path) {
						intents.push({
							description: action.name,
							intents: [
								...path.steps.map(step => Intents.move(step)),
								Intents.action(action)
							],
							weight: ActionLogic.getActionType(action) === 'Attack' ? 4 : 2
						});
					}
				}
			});

		return intents;
	};

	static getSquareTargetIntents = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel, paths: PathModel[], edges: EncounterMapEdgeModel) => {
		const range = ActionLogic.getActionRange(action);

		const intents: IntentsModel[] = [];

		encounter.mapSquares
			.forEach(targetSquare => {
				const candidatePaths = encounter.mapSquares
					.filter(sq => EncounterMapLogic.canSee(edges, targetSquare, sq))
					.filter(sq => {
						// Limit this to squares which would put us within range for this action
						return EncounterMapLogic.getDistance(targetSquare, sq) <= range;
					})
					.map(sq => {
						// Find the cheapest path to this square
						return paths.find(path => (sq.x === path.x) && (sq.y === path.y)) || null;
					})
					.filter(p => {
						// Limit this to paths we have enough movement for
						const cost = p ? p.cost : Number.MAX_VALUE;
						return cost <= combatant.combat.movement;
					});
				if (candidatePaths.length > 0) {
					const path = Collections.min(candidatePaths, p => p?.cost || Number.MAX_VALUE);
					if (path) {
						intents.push({
							description: action.name,
							intents: [
								...path.steps.map(step => Intents.move(step)),
								Intents.action(action)
							],
							weight: 1
						});
					}
				}
			});

		return intents;
	};

	static getWallTargetIntents = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel, paths: PathModel[]) => {
		const range = ActionLogic.getActionRange(action);

		const intents: IntentsModel[] = [];

		Collections.distinct(EncounterMapLogic.getAdjacentWalls(encounter.mapSquares, encounter.mapSquares), sq => `${sq.x} ${sq.y}`)
			.forEach(targetWall => {
				const candidatePaths = encounter.mapSquares
					.filter(sq => {
						// Limit this to squares which would put us within range for this action
						return EncounterMapLogic.getDistance(targetWall, sq) <= range;
					})
					.map(sq => {
						// Find the cheapest path to this square
						return paths.find(path => (sq.x === path.x) && (sq.y === path.y)) || null;
					})
					.filter(p => {
						// Limit this to paths we have enough movement for
						const cost = p ? p.cost : Number.MAX_VALUE;
						return cost <= combatant.combat.movement;
					});
				if (candidatePaths.length > 0) {
					const path = Collections.min(candidatePaths, p => p?.cost || Number.MAX_VALUE);
					if (path) {
						intents.push({
							description: action.name,
							intents: [
								...path.steps.map(step => Intents.move(step)),
								Intents.action(action)
							],
							weight: 1
						});
					}
				}
			});

		return intents;
	};

	static getAttackIntents = (encounter: EncounterModel, combatant: CombatantModel) => {
		const intents: IntentsModel[] = [];

		combatant.combat.actions
			.filter(action => ActionLogic.getActionType(action) === 'Attack')
			.forEach(action => {
				const prerequisitesMet = action.prerequisites.every(prerequisite => ActionPrerequisites.isSatisfied(prerequisite, encounter, combatant));
				const parametersSet = action.parameters.every(param => {
					switch (param.id) {
						case 'origin':
						case 'targets':
							return (param.value as []).length > 0;
					}

					return param.value !== null;
				});
				if (prerequisitesMet && parametersSet) {
					intents.push({
						description: action.name,
						intents: [
							Intents.action(action)
						],
						weight: 4
					});
				}
			});

		return intents;
	};

	static getMovementIntents = (encounter: EncounterModel, combatant: CombatantModel, paths: PathModel[]) => {
		const movePaths = paths.filter(p => p.cost > 0);
		if (movePaths.length === 0) {
			return [];
		}

		const intents: IntentsModel[] = [];

		const resolve = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve);
		if ((combatant.combat.damage > 0) && (combatant.combat.wounds >= resolve)) {
			// Find the path that will take me furthest from an enemy
			const path = Collections.max(movePaths, p => {
				const distances = encounter.combatants
					.filter(c => c.type === CombatantType.Hero)
					.map(c => {
						const squares = EncounterLogic.getCombatantSquares(encounter, c);
						return EncounterMapLogic.getDistanceAny(squares, [ p ]);
					});
				return Math.min(...distances);
			});
			if (path) {
				intents.push({
					description: 'Move Away',
					intents: [
						...path.steps.map(step => Intents.move(step))
					],
					weight: 0
				});
			}
		} else {
			const adjacentSquares = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, EncounterLogic.getCombatantSquares(encounter, combatant));
			const adjacentToEnemy = encounter.combatants.filter(c => c.type === CombatantType.Hero).some(c => {
				const enemySquares = EncounterLogic.getCombatantSquares(encounter, c);
				return enemySquares.some(sq => adjacentSquares.find(s => (s.x === sq.x) && (s.y === sq.y)));
			});
			if (adjacentToEnemy) {
				// Move out of melee
				const disengagePaths = movePaths.filter(p => {
					const distances = encounter.combatants
						.filter(c => c.type === CombatantType.Hero)
						.map(c => {
							const squares = EncounterLogic.getCombatantSquares(encounter, c);
							return EncounterMapLogic.getDistanceAny(squares, [ p ]);
						});
					return Math.min(...distances) >= 2;
				});
				if (disengagePaths.length > 0) {
					const path = Collections.draw(disengagePaths);
					intents.push({
						description: 'Disengage',
						intents: [
							...path.steps.map(step => Intents.move(step))
						],
						weight: 0
					});
				}
			} else {
				// Find the path that will take me closest to an enemy
				const path = Collections.min(movePaths, p => {
					const distances = encounter.combatants
						.filter(c => c.type === CombatantType.Hero)
						.map(c => {
							const squares = EncounterLogic.getCombatantSquares(encounter, c);
							return EncounterMapLogic.getDistanceAny(squares, [ p ]);
						});
					return Math.min(...distances);
				});
				if (path) {
					intents.push({
						description: 'Move to Engage',
						intents: [
							...path.steps.map(step => Intents.move(step))
						],
						weight: 0
					});
				}
			}
		}

		return intents;
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

		combatant.combat.intents = IntentsLogic.getIntents(encounter, combatant);
	};
}
