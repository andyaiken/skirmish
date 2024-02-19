import { BaseData } from '../data/base-data';

import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { EncounterState } from '../enums/encounter-state';
import { QuirkType } from '../enums/quirk-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionLogic, ActionTargetParameters } from './action-logic';
import { GameLogic } from './game-logic';

import type { ActionModel, ActionOriginParameterModel, ActionTargetParameterModel, ActionWeaponParameterModel } from '../models/action';
import type { EncounterMapSquareModel, EncounterModel, LootPileModel } from '../models/encounter';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { ItemModel } from '../models/item';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Sound } from '../utils/sound';

import { CombatantLogic } from './combatant-logic';
import { ConditionLogic } from './condition-logic';
import { EncounterLogLogic } from './encounter-log-logic';
import { EncounterMapLogic } from './encounter-map-logic';
import { Factory } from './factory';

export class EncounterLogic {
	static getCombatantSquares = (encounter: EncounterModel, combatant: CombatantModel, position: { x: number, y: number } | null = null) => {
		const squares = [];

		if (!position) {
			position = combatant.combat.position;
		}

		const left = position.x;
		const right = left + combatant.size - 1;
		const top = position.y;
		const bottom = top + combatant.size - 1;

		for (let x = left; x <= right; ++x) {
			for (let y = top; y <= bottom; ++y) {
				squares.push({ x: x, y: y });
			}
		}

		return squares;
	};

	static getCombatantAuraSquares = (encounter: EncounterModel, combatant: CombatantModel) => {
		const squares = [];

		const left = combatant.combat.position.x - 1;
		const right = left + combatant.size + 1;
		const top = combatant.combat.position.y - 1;
		const bottom = top + combatant.size + 1;

		for (let x = left; x <= right; ++x) {
			for (let y = top; y <= bottom; ++y) {
				squares.push({ x: x, y: y });
			}
		}

		const combatantSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
		return squares.filter(sq => !combatantSquares.find(s => (s.x === sq.x) && (s.y === sq.y)));
	};

	static getSquareIsEmpty = (encounter: EncounterModel, square: { x: number, y: number }, ignore: CombatantModel[] = []) => {
		const occupied: { x: number; y: number }[] = [];

		encounter.combatants
			.filter(c => !ignore.includes(c))
			.filter(c => c.combat.state !== CombatantState.Dead)
			.forEach(c => {
				const squares = EncounterLogic.getCombatantSquares(encounter, c);
				occupied.push(...squares);
			});
		encounter.loot.forEach(lp => occupied.push(lp.position));

		return encounter.mapSquares.find(s => (s.x === square.x) && (s.y === square.y)) && !occupied.find(s => (s.x === square.x) && (s.y === square.y));
	};

	static rollInitiative = (encounter: EncounterModel) => {
		encounter.round += 1;

		encounter.combatants.forEach(c => {
			c.combat.initiative = Number.MIN_VALUE;

			const speed = EncounterLogic.getTraitRank(encounter, c, TraitType.Speed);
			c.combat.initiative = Random.dice(speed);
		});

		EncounterLogic.sortInitiative(encounter);
	};

	static sortInitiative = (encounter: EncounterModel) => {
		encounter.combatants.sort((a, b) => {
			// Sort by Inititive
			let result: number = b.combat.initiative - a.combat.initiative;

			if (result === 0) {
				// Sort by Speed
				const speedA = EncounterLogic.getTraitRank(encounter, a, TraitType.Speed);
				const speedB = EncounterLogic.getTraitRank(encounter, b, TraitType.Speed);
				result = speedB - speedA;
			}

			if (result === 0) {
				// Sort heroes before monsters
				const valueA = (a.faction === CombatantType.Hero ? 1 : 0);
				const valueB = (b.faction === CombatantType.Hero ? 1 : 0);
				result = valueB - valueA;
			}

			if (result === 0) {
				// Sort alphabetically
				result = (a.name < b.name) ? -1 : +1;
			}

			return result;
		});
	};

	static startOfTurn = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.text('Starting turn for '),
			EncounterLogLogic.combatant(combatant)
		]);

		combatant.combat.current = true;

		combatant.combat.hidden = 0;
		combatant.combat.senses = 0;
		combatant.combat.movement = 0;
		combatant.combat.trail = [];
		combatant.combat.actions = [];
		combatant.combat.selectedAction = null;
		combatant.combat.intents = null;

		if (combatant.combat.state === CombatantState.Unconscious) {
			const rank = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve);
			const result = Random.dice(rank);
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text('is unconscious: rolls'),
				EncounterLogLogic.rank('Resolve', rank),
				EncounterLogLogic.text('and gets'),
				EncounterLogLogic.result(result)
			]);
			if (result <= 1) {
				EncounterLogic.kill(encounter, combatant);
			} else if ((result >= 10) && (combatant.quirks.includes(QuirkType.Undead))) {
				combatant.combat.wounds = rank - 1;
				combatant.combat.state = CombatantState.Prone;
				EncounterLogLogic.logState(encounter, combatant);
			} else {
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.combatant(combatant),
					EncounterLogLogic.text('remains unconscious')
				]);
			}
		}

		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));

		conditions.forEach(condition => {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text('is currently affected by'),
				EncounterLogLogic.rank(ConditionLogic.getConditionDescription(condition), condition.rank)
			]);
		});

		if (combatant.combat.stunned) {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text('is stunned')
			]);
		}

		conditions
			.filter(condition => condition.type === ConditionType.AutoHeal)
			.forEach(condition => {
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.text(`Healing condition (${condition.rank})`)
				]);
				EncounterLogic.healDamage(encounter, combatant, condition.rank);
			});

		conditions
			.filter(condition => condition.type === ConditionType.AutoDamage)
			.forEach(condition => {
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.text(`Damage condition (${condition.details.damage}, ${condition.rank})`)
				]);
				const value = Random.dice(condition.rank);
				EncounterLogic.takeDamage(encounter, combatant, value, condition.details.damage);
			});

		if ((combatant.combat.state === CombatantState.Standing) || (combatant.combat.state === CombatantState.Prone)) {
			combatant.combat.senses = Random.dice(EncounterLogic.getSkillRank(encounter, combatant, SkillType.Perception));
			combatant.combat.movement = Random.dice(EncounterLogic.getTraitRank(encounter, combatant, TraitType.Speed));

			conditions
				.filter(condition => condition.type === ConditionType.MovementBonus)
				.forEach(condition => {
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.text(`Movement bonus condition (${condition.rank})`)
					]);
					combatant.combat.movement += Random.dice(condition.rank);
				});
			conditions
				.filter(condition => condition.type === ConditionType.MovementPenalty)
				.forEach(condition => {
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.text(`Movement penalty condition (${condition.rank})`)
					]);
					combatant.combat.movement = Math.max(0, combatant.combat.movement - condition.rank);
				});

			EncounterLogic.drawActions(encounter, combatant);
		}

		// Decrement conditions
		combatant.combat.conditions.forEach(condition => {
			if (ConditionLogic.getConditionIsBeneficial(condition)) {
				condition.rank -= 1;
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.text(`Condition '${ConditionLogic.getConditionDescription(condition)}' reduced to rank ${condition.rank}`)
				]);
			} else {
				const trait = EncounterLogic.getTraitRank(encounter, combatant, condition.trait);
				if (Random.dice(trait) >= Random.dice(condition.rank)) {
					condition.rank = 0;
				} else {
					condition.rank -= 1;
				}
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.text(`Condition '${ConditionLogic.getConditionDescription(condition)}' reduced to rank ${condition.rank}`)
				]);
			}
		});
		combatant.combat.conditions = combatant.combat.conditions.filter(c => c.rank > 0);

		// This might have affected our Resolve, so check whether this is a problem
		const resolve = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve);
		if (combatant.combat.wounds === resolve) {
			if ((combatant.combat.state === CombatantState.Standing) || (combatant.combat.state === CombatantState.Prone)) {
				combatant.combat.state = CombatantState.Unconscious;
				EncounterLogLogic.logState(encounter, combatant);
			}
		}
		if (combatant.combat.wounds > resolve) {
			if ((combatant.combat.state === CombatantState.Standing) || (combatant.combat.state === CombatantState.Prone) || (combatant.combat.state === CombatantState.Unconscious)) {
				EncounterLogic.kill(encounter, combatant);
			}
		}
	};

	static endTurn = (encounter: EncounterModel) => {
		const current = encounter.combatants.filter(combatant => combatant.combat.current);
		current.forEach(combatant => {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.text('Ending turn for '),
				EncounterLogLogic.combatant(combatant)
			]);

			combatant.combat.current = false;
			combatant.combat.senses = 0;
			combatant.combat.movement = 0;
			combatant.combat.trail = [];
			combatant.combat.actions = [];
			combatant.combat.selectedAction = null;
			combatant.combat.intents = null;
			combatant.combat.stunned = false;
			combatant.combat.initiative = Number.MIN_VALUE;
		});

		const active = EncounterLogic.getActiveCombatants(encounter);
		const nextCombatant = active.length > 0 ? active[0] : null;
		if (nextCombatant) {
			EncounterLogic.startOfTurn(encounter, nextCombatant);
		}
	};

	static drawActions = (encounter: EncounterModel, combatant: CombatantModel) => {
		const deck = CombatantLogic.getActionDeck(combatant);
		switch (combatant.faction) {
			case CombatantType.Hero:
				combatant.combat.actions = Collections.shuffle(deck).splice(0, 3);
				combatant.combat.actions.push(...BaseData.getBaseActions());
				combatant.combat.selectedAction = null;
				break;
			case CombatantType.Monster:
				combatant.combat.actions = deck;
				combatant.combat.actions.push(...BaseData.getBaseActions());
				EncounterLogic.checkActionParameters(encounter, combatant);
				combatant.combat.selectedAction = null;
				break;
		}
	};

	static selectAction = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		combatant.combat.selectedAction = {
			action: action,
			used: false
		};
		EncounterLogic.checkActionParameters(encounter, combatant, false);
	};

	static deselectAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		combatant.combat.selectedAction = null;
		EncounterLogic.checkActionParameters(encounter, combatant, false);
	};

	static checkActionParameters = (encounter: EncounterModel, combatant: CombatantModel, invertTargets = false) => {
		combatant.combat.actions.forEach(action => {
			action.parameters.forEach(parameter => {
				switch (parameter.id) {
					case 'weapon':
						ActionLogic.checkWeaponParameter(parameter as ActionWeaponParameterModel, combatant);
						break;
					case 'origin':
						ActionLogic.checkOriginParameter(parameter as ActionOriginParameterModel, encounter, combatant, action);
						break;
					case 'targets': {
						ActionLogic.checkTargetParameter(parameter as ActionTargetParameterModel, encounter, combatant, action, invertTargets);
						break;
					}
				}
			});
		});
	};

	static runAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.combat.selectedAction !== null) {
			const action = combatant.combat.selectedAction.action;
			combatant.combat.selectedAction.used = true;
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text(`selects ${action.name}`)
			]);
			action.effects.forEach(effect => ActionEffects.run(effect, encounter, combatant, action.parameters));
		}
	};

	static getMoveCost = (encounter: EncounterModel, combatant: CombatantModel, position: { x: number, y: number }, dir: string) => {
		const movingFrom = EncounterLogic.getCombatantSquares(encounter, combatant, position);
		const movingTo = movingFrom.map(sq => {
			const dest = { x: sq.x, y: sq.y };
			switch (dir) {
				case 'n':
					dest.y -= 1;
					break;
				case 'ne':
					dest.x += 1;
					dest.y -= 1;
					break;
				case 'e':
					dest.x += 1;
					break;
				case 'se':
					dest.x += 1;
					dest.y += 1;
					break;
				case 's':
					dest.y += 1;
					break;
				case 'sw':
					dest.x -= 1;
					dest.y += 1;
					break;
				case 'w':
					dest.x -= 1;
					break;
				case 'nw':
					dest.x -= 1;
					dest.y -= 1;
					break;
			}
			return dest;
		});

		const destinationMapSquares = movingTo
			.map(sq => encounter.mapSquares.find(ms => (ms.x === sq.x) && (ms.y === sq.y)) ?? null)
			.filter(ms => ms !== null) as EncounterMapSquareModel[];

		// Can't move off the map
		if (destinationMapSquares.length !== movingTo.length) {
			return Number.MAX_VALUE;
		}

		// Can't move into an occupied square
		if (movingTo.some(sq => !EncounterLogic.getSquareIsEmpty(encounter, sq, [ combatant ]))) {
			return Number.MAX_VALUE;
		}

		let cost = 1;

		// Obstructed: +1
		if (destinationMapSquares.some(ms => ms.type === EncounterMapSquareType.Obstructed)) {
			cost += 1;
		}

		// Moving out of a space adjacent to (standing, not stunned) opponent: +4
		const adjacent: { x: number; y: number }[] = [];
		encounter.combatants
			.filter(c => c.faction !== combatant.faction)
			.filter(c => c.combat.state === CombatantState.Standing)
			.filter(c => !c.combat.stunned)
			.forEach(c => {
				const current = EncounterLogic.getCombatantSquares(encounter, c);
				const squares = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, current);
				adjacent.push(...squares);
			});
		if (movingFrom.some(sq => adjacent.find(os => (os.x === sq.x) && (os.y === sq.y)))) {
			cost += 4;
		}

		// Prone or hidden: x2
		if ((combatant.combat.state === CombatantState.Prone) || (combatant.combat.hidden > 0)) {
			cost *= 2;
		}

		return cost;
	};

	static getPossibleMoveSquares = (encounter: EncounterModel, combatant: CombatantModel) => {
		const squares = [
			{ dir: 'n', x: combatant.combat.position.x, y: combatant.combat.position.y - 1 },
			{ dir: 'ne', x: combatant.combat.position.x + 1, y: combatant.combat.position.y - 1 },
			{ dir: 'e', x: combatant.combat.position.x + 1, y: combatant.combat.position.y },
			{ dir: 'se', x: combatant.combat.position.x + 1, y: combatant.combat.position.y + 1 },
			{ dir: 's', x: combatant.combat.position.x, y: combatant.combat.position.y + 1 },
			{ dir: 'sw', x: combatant.combat.position.x - 1, y: combatant.combat.position.y + 1 },
			{ dir: 'w', x: combatant.combat.position.x - 1, y: combatant.combat.position.y },
			{ dir: 'nw', x: combatant.combat.position.x - 1, y: combatant.combat.position.y - 1 }
		];

		return squares.filter(square => {
			const cost = EncounterLogic.getMoveCost(encounter, combatant, combatant.combat.position, square.dir);
			return cost !== Number.MAX_VALUE;
		});
	};

	///////////////////////////////////////////////////////////////////////////

	static move = (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => {
		combatant.combat.movement = Math.max(0, combatant.combat.movement - cost);

		combatant.combat.trail.push({ x: combatant.combat.position.x, y: combatant.combat.position.y });

		switch (dir) {
			case 'n':
				combatant.combat.position.y -= 1;
				break;
			case 'ne':
				combatant.combat.position.x += 1;
				combatant.combat.position.y -= 1;
				break;
			case 'e':
				combatant.combat.position.x += 1;
				break;
			case 'se':
				combatant.combat.position.x += 1;
				combatant.combat.position.y += 1;
				break;
			case 's':
				combatant.combat.position.y += 1;
				break;
			case 'sw':
				combatant.combat.position.x -= 1;
				combatant.combat.position.y += 1;
				break;
			case 'w':
				combatant.combat.position.x -= 1;
				break;
			case 'nw':
				combatant.combat.position.x -= 1;
				combatant.combat.position.y -= 1;
				break;
		}

		EncounterLogic.checkActionParameters(encounter, combatant);
	};

	static drinkPotion = (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => {
		if (!potion.potion) {
			return;
		}

		if (owner.id === drinker.id) {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(owner),
				EncounterLogLogic.text(`drinks ${potion.name}`)
			]);
		} else {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(owner),
				EncounterLogLogic.text(`gives ${potion.name} to`),
				EncounterLogLogic.combatant(drinker)
			]);
		}

		owner.combat.movement -= 2;

		owner.items = owner.items.filter(i => i.id !== potion.id);
		owner.carried = owner.carried.filter(i => i.id !== potion.id);

		potion.potion.effects.forEach(effect => {
			const param = ActionTargetParameters.self();
			param.value = [ drinker.id ];
			ActionEffects.run(effect, encounter, drinker, [ param ]);
		});
	};

	static healDamage = (encounter: EncounterModel, combatant: CombatantModel, value: number) => {
		combatant.combat.damage = Math.max(0, combatant.combat.damage - value);

		EncounterLogic.checkActionParameters(encounter, combatant);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`heals damage (${value} pts) and is now at ${combatant.combat.damage}`)
		]);
	};

	static healWounds = (encounter: EncounterModel, combatant: CombatantModel, value: number) => {
		combatant.combat.wounds = Math.max(0, combatant.combat.wounds - value);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`heals wounds (${value}) and is now at ${combatant.combat.wounds}`)
		]);

		const resolve = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve);
		if ((combatant.combat.wounds < resolve) && (combatant.combat.state === CombatantState.Unconscious)) {
			combatant.combat.state = CombatantState.Prone;
			EncounterLogLogic.logState(encounter, combatant);
		}

		EncounterLogic.checkActionParameters(encounter, combatant);
	};

	static dealDamage = (encounter: EncounterModel, combatant: CombatantModel, target: CombatantModel, rank: number, type: DamageType) => {
		if (target.combat.state === CombatantState.Dead){
			return;
		}

		const result = Random.dice(rank);
		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text('rolls weapon damage for'),
			EncounterLogLogic.combatant(target),
			EncounterLogLogic.rank(type, rank),
			EncounterLogLogic.text('and gets'),
			EncounterLogLogic.result(result)
		]);
		const bonus = EncounterLogic.getDamageBonus(encounter, combatant, type);
		if (bonus > 0) {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text(`deals ${bonus} additional ${type} damage`)
			]);
		}
		if (bonus < 0) {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text(`deals ${bonus} less ${type} damage`)
			]);
		}

		EncounterLogic.takeDamage(encounter, target, result + bonus, type);
	};

	static takeDamage = (encounter: EncounterModel, combatant: CombatantModel, value: number, type: DamageType) => {
		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`suffers damage (${type}, ${value} pts)`)
		]);

		if (combatant.quirks.includes(QuirkType.Swarm) || combatant.quirks.includes(QuirkType.Amorphous)) {
			if (GameLogic.getDamageCategory(type) === DamageCategoryType.Physical) {
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.combatant(combatant),
					EncounterLogLogic.text('takes half physical damage')
				]);
				value = Math.floor(value / 2);
			}
		}

		const resistance = EncounterLogic.getDamageResistance(encounter, combatant, type);
		if (resistance > 0) {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text(`has damage resistance (${type}, ${resistance} pts)`)
			]);
			value -= resistance;
		}

		if (value > 0) {
			if (combatant.quirks.includes(QuirkType.Drone)) {
				// Drones die if they take any damage
				EncounterLogic.kill(encounter, combatant);
			} else {
				combatant.combat.damage += value;
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.combatant(combatant),
					EncounterLogLogic.text(`takes damage (${value} pts) and is now at ${combatant.combat.damage}`)
				]);

				const rank = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Endurance);
				const result = Random.dice(rank);
				EncounterLogLogic.log(encounter, [
					EncounterLogLogic.combatant(combatant),
					EncounterLogLogic.text('rolls'),
					EncounterLogLogic.rank('Endurance', rank),
					EncounterLogLogic.text('and gets'),
					EncounterLogLogic.result(result)
				]);
				if (result < combatant.combat.damage) {
					EncounterLogic.wound(encounter, combatant, 1);
				}
			}
		} else {
			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text('takes no damage')
			]);
		}

		EncounterLogic.checkActionParameters(encounter, combatant);
	};

	static wound = (encounter: EncounterModel, combatant: CombatantModel, value: number) => {
		if (combatant.combat.state === CombatantState.Dead) {
			return;
		}

		combatant.combat.damage = 0;
		combatant.combat.wounds += value;
		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`takes wounds (${value}) and is now at ${combatant.combat.damage} damage, ${combatant.combat.wounds} wounds`)
		]);

		if (combatant.quirks.includes(QuirkType.Drone)) {
			// Drones die if they take any damage
			EncounterLogic.kill(encounter, combatant);
		} else {
			const resolve = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve);
			if (combatant.combat.wounds === resolve) {
				if ((combatant.combat.state === CombatantState.Standing) || (combatant.combat.state === CombatantState.Prone)) {
					combatant.combat.state = CombatantState.Unconscious;
					EncounterLogLogic.logState(encounter, combatant);
				}
			}
			if (combatant.combat.wounds > resolve) {
				if ((combatant.combat.state === CombatantState.Standing) || (combatant.combat.state === CombatantState.Prone) || (combatant.combat.state === CombatantState.Unconscious)) {
					EncounterLogic.kill(encounter, combatant);
				}
			}
		}

		EncounterLogic.checkActionParameters(encounter, combatant);
	};

	static kill = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.combat.state === CombatantState.Dead){
			return;
		}

		combatant.combat.state = CombatantState.Dead;
		combatant.combat.conditions = [];
		combatant.combat.senses = 0;
		combatant.combat.movement = 0;
		combatant.combat.actions = [];
		combatant.combat.selectedAction = null;
		combatant.combat.intents = null;
		combatant.combat.stunned = false;

		EncounterLogLogic.logState(encounter, combatant);
		EncounterLogic.dropAllItems(encounter, combatant);
		Sound.play(Sound.dong);
	};

	static knockout = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.combat.state === CombatantState.Unconscious){
			return;
		}

		combatant.combat.state = CombatantState.Unconscious;
		combatant.combat.senses = 0;
		combatant.combat.movement = 0;
		combatant.combat.actions = [];
		combatant.combat.selectedAction = null;
		combatant.combat.intents = null;

		EncounterLogLogic.logState(encounter, combatant);
	};

	static goProne = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.combat.state === CombatantState.Standing) {
			combatant.combat.state = CombatantState.Prone;

			EncounterLogic.checkActionParameters(encounter, combatant);

			EncounterLogLogic.logState(encounter, combatant);
		}
	};

	static standUp = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.combat.state === CombatantState.Prone) {
			combatant.combat.state = CombatantState.Standing;

			EncounterLogic.checkActionParameters(encounter, combatant);

			EncounterLogLogic.logState(encounter, combatant);
		}
	};

	static stun = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.combat.state === CombatantState.Dead){
			return;
		}

		combatant.combat.stunned = true;
		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text('is stunned')
		], true);
	};

	static inspire = (encounter: EncounterModel, combatant: CombatantModel) => {
		const rank = EncounterLogic.getSkillRank(encounter, combatant, SkillType.Presence);
		const result = Random.dice(rank);
		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.text('Inspire:'),
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text('rolls'),
			EncounterLogLogic.rank('Presence', rank),
			EncounterLogLogic.text('and gets'),
			EncounterLogLogic.result(result)
		]);

		combatant.combat.movement -= 4;
		if (result > 8) {
			const edges = EncounterMapLogic.getMapEdges(encounter.mapSquares);
			const combatantSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
			encounter.combatants
				.filter(c => c.faction === combatant.faction)
				.filter(c => c.combat.stunned)
				.forEach(ally => {
					const allySquares = EncounterLogic.getCombatantSquares(encounter, ally);
					if (EncounterMapLogic.canSeeAny(edges, combatantSquares, allySquares)) {
						ally.combat.stunned = false;
						EncounterLogLogic.log(encounter, [
							EncounterLogLogic.combatant(ally),
							EncounterLogLogic.text('is no longer stunned')
						]);
					}
				});
		}

		EncounterLogic.checkActionParameters(encounter, combatant);

	};

	static scan = (encounter: EncounterModel, combatant: CombatantModel) => {
		const rank = EncounterLogic.getSkillRank(encounter, combatant, SkillType.Perception);
		const result = Random.dice(rank);

		combatant.combat.movement -= 4;
		combatant.combat.senses += result;

		EncounterLogic.checkActionParameters(encounter, combatant);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.text('Scan:'),
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text('rolls'),
			EncounterLogLogic.rank('Perception', rank),
			EncounterLogLogic.text('and gets'),
			EncounterLogLogic.result(result)
		]);
	};

	static hide = (encounter: EncounterModel, combatant: CombatantModel) => {
		const rank = EncounterLogic.getSkillRank(encounter, combatant, SkillType.Stealth);
		const result = Random.dice(rank);

		combatant.combat.movement -= 4;
		combatant.combat.hidden += result;

		EncounterLogic.checkActionParameters(encounter, combatant);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.text('Hide:'),
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text('rolls'),
			EncounterLogLogic.rank('Stealth', rank),
			EncounterLogLogic.text('and gets'),
			EncounterLogLogic.result(result)
		]);
	};

	static reveal = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.combat.hidden > 0) {
			combatant.combat.hidden = 0;

			EncounterLogic.checkActionParameters(encounter, combatant);

			EncounterLogLogic.log(encounter, [
				EncounterLogLogic.combatant(combatant),
				EncounterLogLogic.text('is no longer hidden')
			]);
		}
	};

	static equipItem = (encounter: EncounterModel, combatant: CombatantModel, item: ItemModel) => {
		if (combatant.quirks.includes(QuirkType.Beast)) {
			// Beasts can't use items
			return;
		}

		combatant.combat.movement = Math.max(0, combatant.combat.movement - 1);

		combatant.carried = combatant.carried.filter(i => i.id !== item.id);

		combatant.items.push(item);

		EncounterLogic.checkActionParameters(encounter, combatant);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`equips ${item.name}`)
		]);
	};

	static unequipItem = (encounter: EncounterModel, combatant: CombatantModel, item: ItemModel) => {
		if (combatant.quirks.includes(QuirkType.Beast)) {
			// Beasts can't use items
			return;
		}

		combatant.combat.movement = Math.max(0, combatant.combat.movement - 1);

		combatant.items = combatant.items.filter(i => i.id !== item.id);

		combatant.carried.push(item);

		EncounterLogic.checkActionParameters(encounter, combatant);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`unequips ${item.name}`)
		]);
	};

	static pickUpItem = (encounter: EncounterModel, combatant: CombatantModel, item: ItemModel) => {
		if (combatant.quirks.includes(QuirkType.Beast)) {
			// Beasts can't use items
			return;
		}

		combatant.combat.movement = Math.max(0, combatant.combat.movement - 1);

		const adj = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, [ combatant.combat.position ]);
		const piles = encounter.loot.filter(lp => adj.find(sq => (sq.x === lp.position.x) && (sq.y === lp.position.y)));
		const lp = piles.find(l => l.items.find(i => i === item));
		if (lp) {
			lp.items = lp.items.filter(i => i.id !== item.id);
			if (lp.items.length === 0) {
				encounter.loot = encounter.loot.filter(l => l.id !== lp.id);
			}
		}

		combatant.carried.push(item);

		EncounterLogic.checkActionParameters(encounter, combatant);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`picks up ${item.name}`)
		]);
	};

	static dropItem = (encounter: EncounterModel, combatant: CombatantModel, item: ItemModel) => {
		if (combatant.quirks.includes(QuirkType.Beast)) {
			// Beasts can't use items
			return;
		}

		combatant.items = combatant.items.filter(i => i.id !== item.id);
		combatant.carried = combatant.carried.filter(i => i.id !== item.id);

		// See if we're beside any loot piles
		const adj = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, [ combatant.combat.position ]);
		const piles = encounter.loot.filter(lp => adj.find(sq => (sq.x === lp.position.x) && (sq.y === lp.position.y)));

		let lp = null;
		if (piles.length === 0) {
			lp = Factory.createLootPile();

			const empty = adj.filter(sq => EncounterLogic.getSquareIsEmpty(encounter as EncounterModel, sq));
			if (empty.length > 0) {
				const sq = Collections.draw(empty);
				lp.position.x = sq.x;
				lp.position.y = sq.y;
				encounter.loot.push(lp);
			}
		} else {
			lp = Collections.draw(piles);
		}

		lp.items.push(item);

		EncounterLogic.checkActionParameters(encounter, combatant);

		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`drops ${item.name}`)
		]);
	};

	static dropAllItems = (encounter: EncounterModel, combatant: CombatantModel) => {
		if (combatant.quirks.includes(QuirkType.Beast)) {
			// Beasts can't use items
			return;
		}

		let money = 0;
		if (combatant.faction === CombatantType.Monster) {
			if (Random.randomBoolean()) {
				money = Random.dice(2) + Random.dice(2);
			}
		}

		if ((combatant.items.length > 0) || (combatant.carried.length > 0) || (money > 0)) {
			const empty = EncounterLogic.getCombatantSquares(encounter, combatant).filter(sq => EncounterLogic.getSquareIsEmpty(encounter as EncounterModel, sq));
			if (empty.length > 0) {
				const loot = Factory.createLootPile();

				loot.items.push(...combatant.items);
				loot.items.push(...combatant.carried);
				loot.money = money;

				combatant.items = [];
				combatant.carried = [];

				const sq = Collections.draw(empty);
				loot.position.x = sq.x;
				loot.position.y = sq.y;
				encounter.loot.push(loot);
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////

	static getEncounterState = (encounter: EncounterModel): EncounterState => {
		const allMonstersDead = encounter.combatants
			.filter(c => c.faction === CombatantType.Monster)
			.every(c => (c.combat.state === CombatantState.Dead) || (c.combat.state === CombatantState.Unconscious));
		if (allMonstersDead) {
			return EncounterState.Victory;
		}
		const allHeroesDead = encounter.combatants
			.filter(c => c.faction === CombatantType.Hero)
			.every(c => (c.combat.state === CombatantState.Dead) || (c.combat.state === CombatantState.Unconscious));
		if (allHeroesDead) {
			return EncounterState.Defeat;
		}

		return EncounterState.Active;
	};

	static getCombatant = (encounter: EncounterModel, id: string): CombatantModel | null => {
		return encounter.combatants.find(c => c.id === id) ?? null;
	};

	static getLoot = (encounter: EncounterModel, id: string): LootPileModel | null => {
		return encounter.loot.find(lp => lp.id === id) ?? null;
	};

	static getAuraConditions = (encounter: EncounterModel, combatant: CombatantModel) => {
		const auras: ConditionModel[] = [];

		const squares = EncounterLogic.getCombatantSquares(encounter, combatant);

		// Get all beneficial aura conditions from adjacent allies
		encounter.combatants
			.filter(combatant => combatant.combat.state !== CombatantState.Dead)
			.filter(c => c.faction === combatant.faction)
			.filter(c => squares.some(sq => EncounterLogic.getCombatantAuraSquares(encounter, c).find(s => (s.x === sq.x) && (s.y === sq.y))))
			.flatMap(c => CombatantLogic.getAuras(EncounterLogic.getCombatant(encounter, c.id) as CombatantModel))
			.filter(aura => ConditionLogic.getConditionIsBeneficial(aura))
			.forEach(aura => auras.push(aura));

		// Get all non-beneficial aura conditions from adjacent enemies
		encounter.combatants
			.filter(combatant => combatant.combat.state !== CombatantState.Dead)
			.filter(c => c.faction !== combatant.faction)
			.filter(c => squares.some(sq => EncounterLogic.getCombatantAuraSquares(encounter, c).find(s => (s.x === sq.x) && (s.y === sq.y))))
			.flatMap(c => CombatantLogic.getAuras(EncounterLogic.getCombatant(encounter, c.id) as CombatantModel))
			.filter(aura => !ConditionLogic.getConditionIsBeneficial(aura))
			.forEach(aura => auras.push(aura));

		return auras;
	};

	///////////////////////////////////////////////////////////////////////////

	static getActiveCombatants = (encounter: EncounterModel) => {
		return encounter.combatants
			.filter(c => c.combat.state !== CombatantState.Dead)
			.filter(c => c.combat.initiative !== Number.MIN_VALUE);
	};

	static getActedCombatants = (encounter: EncounterModel) => {
		return encounter.combatants
			.filter(c => c.combat.state !== CombatantState.Dead)
			.filter(c => c.combat.initiative === Number.MIN_VALUE);
	};

	static getDeadCombatants = (encounter: EncounterModel) => {
		return encounter.combatants
			.filter(c => c.combat.state === CombatantState.Dead);
	};

	///////////////////////////////////////////////////////////////////////////

	static getTraitRank = (encounter: EncounterModel, combatant: CombatantModel, trait: TraitType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getTraitRank(combatant, conditions, trait);
	};

	static getSkillRank = (encounter: EncounterModel, combatant: CombatantModel, skill: SkillType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getSkillRank(combatant, conditions, skill);
	};

	static getDamageBonus = (encounter: EncounterModel, combatant: CombatantModel, damage: DamageType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getDamageBonus(combatant, conditions, damage);
	};

	static getDamageResistance = (encounter: EncounterModel, combatant: CombatantModel, damage: DamageType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getDamageResistance(combatant, conditions, damage);
	};

	///////////////////////////////////////////////////////////////////////////

	static findCombatants = (encounter: EncounterModel, originSquares: { x: number, y: number }[], radius: number) => {
		return encounter.combatants.filter(combatant => {
			const destSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
			const distance = EncounterMapLogic.getDistanceAny(originSquares, destSquares);
			return (distance <= radius);
		});
	};

	static findSquares = (encounter: EncounterModel, originSquares: { x: number, y: number }[], radius: number) => {
		return encounter.mapSquares.filter(square => {
			const distance = EncounterMapLogic.getDistanceAny(originSquares, [ square ]);
			return (distance <= radius);
		});
	};

	static findWalls = (encounter: EncounterModel, originSquares: { x: number, y: number }[], radius: number) => {
		return EncounterMapLogic.getAdjacentWalls(encounter.mapSquares, encounter.mapSquares).filter(wall => {
			const distance = EncounterMapLogic.getDistanceAny(originSquares, [ wall ]);
			return (distance <= radius);
		});
	};
}
