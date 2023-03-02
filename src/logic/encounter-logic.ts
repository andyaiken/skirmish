import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageType } from '../enums/damage-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { EncounterState } from '../enums/encounter-state';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { EncounterMapSquareModel, EncounterModel } from '../models/encounter';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';

import { CombatantLogic } from './combatant-logic';
import { ConditionLogic } from './condition-logic';
import { EncounterMapLogic } from './encounter-map-logic';
import { Factory } from './factory';

export class EncounterLogic {
	static getCombatantSquares = (encounter: EncounterModel, combatant: CombatantModel) => {
		const squares = [];

		const left = combatant.combat.position.x;
		const right = left + combatant.size - 1;
		const top = combatant.combat.position.y;
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

	static getSquareIsEmpty = (encounter: EncounterModel, square: { x: number, y: number }) => {
		const occupied: { x: number; y: number }[] = [];

		encounter.combatants
			.filter(c => c.combat.state !== CombatantState.Dead)
			.forEach(c => {
				const squares = EncounterLogic.getCombatantSquares(encounter, c);
				occupied.push(...squares);
			});
		encounter.loot.forEach(lp => occupied.push(lp.position));

		return occupied.find(s => (s.x === square.x) && (s.y === square.y)) === undefined;
	};

	static rollInitiative = (encounter: EncounterModel) => {
		encounter.round += 1;

		encounter.combatants.forEach(c => {
			c.combat.initiative = Number.MIN_VALUE;

			const speed = EncounterLogic.getTraitRank(encounter, c, TraitType.Speed);
			c.combat.initiative = Random.dice(speed);
		});

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
				const valueA = (a.type === CombatantType.Hero ? 1 : 0);
				const valueB = (b.type === CombatantType.Hero ? 1 : 0);
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
		combatant.combat.current = true;

		combatant.combat.hidden = 0;
		combatant.combat.senses = 0;
		combatant.combat.movement = 0;

		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));

		if (combatant.combat.state === CombatantState.Unconscious) {
			const result = Random.dice(CombatantLogic.getTraitValue(combatant, conditions, TraitType.Resolve));
			if (result < 8) {
				combatant.combat.state = CombatantState.Dead;
			}
		}

		conditions
			.filter(condition => condition.type === ConditionType.AutoHeal)
			.forEach(condition => {
				EncounterLogic.healDamage(encounter, combatant, condition.rank);
			});

		conditions
			.filter(condition => condition.type === ConditionType.AutoDamage)
			.forEach(condition => {
				EncounterLogic.damage(encounter, combatant, condition.rank, condition.details.damage);
			});

		if ((combatant.combat.state === CombatantState.Standing) || (combatant.combat.state === CombatantState.Prone)) {
			combatant.combat.senses = Random.dice(CombatantLogic.getSkillValue(combatant, conditions, SkillType.Perception));
			combatant.combat.movement = Random.dice(CombatantLogic.getTraitValue(combatant, conditions, TraitType.Speed));

			conditions
				.filter(condition => condition.type === ConditionType.MovementBonus)
				.forEach(condition => {
					combatant.combat.movement += condition.rank;
				});
			conditions
				.filter(condition => condition.type === ConditionType.MovementPenalty)
				.forEach(condition => {
					combatant.combat.movement = Math.max(0, combatant.combat.movement - condition.rank);
				});

			const deck = CombatantLogic.getActionDeck(combatant).filter(action => action.prerequisites.every(p => p.isSatisfied(encounter)));
			combatant.combat.actions = Collections.shuffle(deck).splice(0, 3);
		}
	};

	static endOfTurn = (encounter: EncounterModel, combatant: CombatantModel) => {
		combatant.combat.current = false;
		combatant.combat.initiative = Number.MIN_VALUE;
		combatant.combat.senses = 0;
		combatant.combat.movement = 0;

		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));

		combatant.combat.conditions.forEach(condition => {
			if (ConditionLogic.getConditionIsBeneficial(condition)) {
				condition.rank -= 1;
			} else {
				const trait = CombatantLogic.getTraitValue(combatant, conditions, condition.trait);
				if (Random.dice(trait) >= Random.dice(condition.rank)) {
					condition.rank = 0;
				} else {
					condition.rank -= 1;
				}
			}
		});
		combatant.combat.conditions = combatant.combat.conditions.filter(c => c.rank > 0);
	};

	static getMoveCost = (encounter: EncounterModel, combatant: CombatantModel, dir: string) => {
		const movingFrom = EncounterLogic.getCombatantSquares(encounter, combatant);
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
		if (movingTo.some(sq => !EncounterLogic.getSquareIsEmpty(encounter, sq))) {
			return Number.MAX_VALUE;
		}

		let cost = 1;

		// Obstructed: +1
		if (destinationMapSquares.some(ms => ms.type === EncounterMapSquareType.Obstructed)) {
			cost += 1;
		}

		// Moving out of a space adjacent to standing opponent: +4
		const adjacent: { x: number; y: number }[] = [];
		encounter.combatants
			.filter(c => c.type !== combatant.type)
			.filter(c => c.combat.state === CombatantState.Standing)
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

	static move = (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => {
		combatant.combat.movement = Math.max(0, combatant.combat.movement - cost);

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
	};

	static healDamage = (encounter: EncounterModel, combatant: CombatantModel, value: number) => {
		combatant.combat.damage = Math.max(0, combatant.combat.damage - value);
	};

	static healWounds = (encounter: EncounterModel, combatant: CombatantModel, value: number) => {
		combatant.combat.wounds = Math.max(0, combatant.combat.wounds - value);

		const resolve = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve);
		if ((combatant.combat.wounds < resolve) && (combatant.combat.state === CombatantState.Unconscious)) {
			combatant.combat.state = CombatantState.Prone;
		}
		if (combatant.combat.wounds === resolve) {
			combatant.combat.state = CombatantState.Unconscious;
		}
		if (combatant.combat.wounds > resolve) {
			combatant.combat.state = CombatantState.Dead;
		}
	};

	static damage = (encounter: EncounterModel, combatant: CombatantModel, value: number, type: DamageType) => {
		const resistance = EncounterLogic.getDamageResistance(encounter, combatant, type);
		const damage = value - resistance;
		if (damage > 0) {
			combatant.combat.damage += damage;

			const endurance = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Endurance);
			if (Random.dice(endurance) < combatant.combat.damage) {
				EncounterLogic.wound(encounter, combatant, 1);
			}
		}
	};

	static wound = (encounter: EncounterModel, combatant: CombatantModel, value: number) => {
		combatant.combat.damage = 0;
		combatant.combat.wounds += 1;

		const resolve = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Resolve);
		if (combatant.combat.wounds === resolve) {
			combatant.combat.state = CombatantState.Unconscious;
		}
		if (combatant.combat.wounds > resolve) {
			combatant.combat.state = CombatantState.Dead;

			const loot = Factory.createLootPile();
			loot.items.push(...combatant.items, ...combatant.carried);
			loot.position.x = combatant.combat.position.x;
			loot.position.y = combatant.combat.position.y;
			encounter.loot.push(loot);
		}
	};

	static standUpSitDown = (combatant: CombatantModel) => {
		switch (combatant.combat.state) {
			case CombatantState.Standing:
				combatant.combat.movement -= 1;
				combatant.combat.state = CombatantState.Prone;
				break;
			case CombatantState.Prone:
				combatant.combat.movement -= 8;
				combatant.combat.state = CombatantState.Standing;
				break;
		}
	};

	static scan = (encounter: EncounterModel, combatant: CombatantModel) => {
		const perception = EncounterLogic.getSkillRank(encounter, combatant, SkillType.Perception);

		combatant.combat.movement -= 4;
		combatant.combat.senses = Random.dice(perception);
	};

	static hide = (encounter: EncounterModel, combatant: CombatantModel) => {
		const stealth = EncounterLogic.getSkillRank(encounter, combatant, SkillType.Stealth);

		combatant.combat.movement -= 4;
		combatant.combat.hidden = Random.dice(stealth);
	};

	static getEncounterState = (encounter: EncounterModel): EncounterState => {
		const allMonstersDead = encounter.combatants
			.filter(c => c.type === CombatantType.Monster)
			.every(c => (c.combat.state === CombatantState.Dead) || (c.combat.state === CombatantState.Unconscious));
		if (allMonstersDead) {
			return EncounterState.Victory;
		}
		const allHeroesDead = encounter.combatants
			.filter(c => c.type === CombatantType.Hero)
			.every(c => (c.combat.state === CombatantState.Dead) || (c.combat.state === CombatantState.Unconscious));
		if (allHeroesDead) {
			return EncounterState.Defeat;
		}

		return EncounterState.Active;
	};

	static getCombatant = (encounter: EncounterModel, id: string): CombatantModel | null => {
		return encounter.combatants.find(c => c.id === id) ?? null;
	};

	static getAuraConditions = (encounter: EncounterModel, combatant: CombatantModel) => {
		const auras: ConditionModel[] = [];

		const squares = EncounterLogic.getCombatantSquares(encounter, combatant);

		// Get all beneficial aura conditions from adjacent allies
		encounter.combatants
			.filter(combatant => combatant.combat.state !== CombatantState.Dead)
			.filter(c => c.type === combatant.type)
			.filter(c => squares.some(sq => EncounterLogic.getCombatantAuraSquares(encounter, c).find(s => (s.x === sq.x) && (s.y === sq.y))))
			.flatMap(c => CombatantLogic.getAuras(EncounterLogic.getCombatant(encounter, c.id) as CombatantModel))
			.filter(aura => ConditionLogic.getConditionIsBeneficial(aura))
			.forEach(aura => auras.push(aura));

		// Get all non-beneficial aura conditions from adjacent enemies
		encounter.combatants
			.filter(combatant => combatant.combat.state !== CombatantState.Dead)
			.filter(c => c.type !== combatant.type)
			.filter(c => squares.some(sq => EncounterLogic.getCombatantAuraSquares(encounter, c).find(s => (s.x === sq.x) && (s.y === sq.y))))
			.flatMap(c => CombatantLogic.getAuras(EncounterLogic.getCombatant(encounter, c.id) as CombatantModel))
			.filter(aura => !ConditionLogic.getConditionIsBeneficial(aura))
			.forEach(aura => auras.push(aura));

		return auras;
	};

	static getActiveCombatants = (encounter: EncounterModel) => {
		return encounter.combatants
			.filter(c => c.combat.state !== CombatantState.Dead)
			.filter(c => c.combat.initiative !== Number.MIN_VALUE);
	};

	static getAllHeroesInEncounter = (encounter: EncounterModel) => {
		return encounter.combatants.filter(c => c.type === CombatantType.Hero);
	};

	static getSurvivingHeroes = (encounter: EncounterModel): CombatantModel[] => {
		return EncounterLogic.getAllHeroesInEncounter(encounter).filter(h => {
			return (h.combat.state !== CombatantState.Dead) && (h.combat.state !== CombatantState.Unconscious);
		});
	};

	static getFallenHeroes = (encounter: EncounterModel): CombatantModel[] => {
		return EncounterLogic.getAllHeroesInEncounter(encounter).filter(h => {
			return (h.combat.state === CombatantState.Dead) || (h.combat.state === CombatantState.Unconscious);
		});
	};

	static getDeadHeroes = (encounter: EncounterModel): CombatantModel[] => {
		return EncounterLogic.getAllHeroesInEncounter(encounter).filter(h => {
			return (h.combat.state === CombatantState.Dead);
		});
	};

	static getTraitRank = (encounter: EncounterModel, combatant: CombatantModel, trait: TraitType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getTraitValue(combatant, conditions, trait);
	};

	static getSkillRank = (encounter: EncounterModel, combatant: CombatantModel, skill: SkillType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getSkillValue(combatant, conditions, skill);
	};

	static getDamageBonus = (encounter: EncounterModel, combatant: CombatantModel, damage: DamageType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getDamageBonusValue(combatant, conditions, damage);
	};

	static getDamageResistance = (encounter: EncounterModel, combatant: CombatantModel, damage: DamageType) => {
		const conditions = ([] as ConditionModel[])
			.concat(combatant.combat.conditions)
			.concat(EncounterLogic.getAuraConditions(encounter, combatant));
		return CombatantLogic.getDamageResistanceValue(combatant, conditions, damage);
	};
}
