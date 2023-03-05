import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';
import { CombatantState } from '../enums/combatant-state';
import { DamageType } from '../enums/damage-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type {
	ActionEffectModel,
	ActionModel,
	ActionOriginParameterModel,
	ActionParameterModel,
	ActionPrerequisiteModel,
	ActionTargetParameterModel,
	ActionWeaponParameterModel
} from '../models/action';
import type { ItemModel, WeaponModel } from '../models/item';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';
import type { EncounterModel } from '../models/encounter';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { CombatantLogic } from './combatant-logic';
import { ConditionLogic } from './condition-logic';
import { EncounterLogic } from './encounter-logic';

export class ActionPrerequisites {
	static emptyHand = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires a free hand',
			isSatisfied: encounter => {
				const combatant = encounter.combatants.find(c => c.combat.current);
				if (combatant) {
					const slotsUsed = combatant.items
						.filter(i => i.location === ItemLocationType.Hand)
						.map(i => i.slots)
						.reduce((sum, value) => sum + value, 0);
					return slotsUsed < 2;
				}

				return false;
			}
		};
	};

	static meleeWeapon = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires a melee weapon',
			isSatisfied: encounter => {
				return ActionPrerequisites.item([ ItemProficiencyType.LargeWeapons, ItemProficiencyType.MilitaryWeapons, ItemProficiencyType.PairedWeapons ]).isSatisfied(encounter);
			}
		};
	};

	static rangedWeapon = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires a ranged weapon',
			isSatisfied: encounter => {
				return ActionPrerequisites.item([ ItemProficiencyType.PowderWeapons, ItemProficiencyType.RangedWeapons ]).isSatisfied(encounter);
			}
		};
	};

	static armor = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires armor',
			isSatisfied: encounter => {
				return ActionPrerequisites.item([ ItemProficiencyType.LightArmor, ItemProficiencyType.HeavyArmor ]).isSatisfied(encounter);
			}
		};
	};

	static shield = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires a shield',
			isSatisfied: encounter => {
				return ActionPrerequisites.item([ ItemProficiencyType.Shields ]).isSatisfied(encounter);
			}
		};
	};

	static implement = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires an implement',
			isSatisfied: encounter => {
				return ActionPrerequisites.item([ ItemProficiencyType.Implements ]).isSatisfied(encounter);
			}
		};
	};

	static item = (proficiencies: ItemProficiencyType[]): ActionPrerequisiteModel => {
		return {
			description: `Requires an item with one of the following proficiencies: ${proficiencies.join(', ')}`,
			isSatisfied: encounter => {
				const combatant = encounter.combatants.find(c => c.combat.current);
				if (combatant) {
					return proficiencies.some(prof => {
						return combatant.items.some(i => i.proficiency === prof) && CombatantLogic.getProficiencies(combatant).includes(prof);
					});
				}

				return false;
			}
		};
	};

	static damage = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires at least 1 point of damage',
			isSatisfied: encounter => {
				const combatant = encounter.combatants.find(c => c.combat.current);
				if (combatant) {
					return combatant.combat.damage > 0;
				}

				return false;
			}
		};
	};

	static wound = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires at least 1 wound',
			isSatisfied: encounter => {
				const combatant = encounter.combatants.find(c => c.combat.current);
				if (combatant) {
					return combatant.combat.wounds > 0;
				}

				return false;
			}
		};
	};

	static condition = (trait: TraitType): ActionPrerequisiteModel => {
		return {
			description: trait === TraitType.Any ? 'Requires a condition': `Requires a ${trait} condition'`,
			isSatisfied: encounter => {
				const combatant = encounter.combatants.find(c => c.combat.current);
				if (combatant) {
					if (trait === TraitType.Any) {
						return combatant.combat.conditions.length > 0;
					}

					return combatant.combat.conditions.filter(c => c.trait === trait).length > 0;
				}

				return false;
			}
		};
	};

	static carryingCapacity = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires spare carrying capacity',
			isSatisfied: encounter => {
				const combatant = encounter.combatants.find(c => c.combat.current);
				if (combatant) {
					return combatant.carried.length < 6;
				}

				return false;
			}
		};
	};

	static hidden = (): ActionPrerequisiteModel => {
		return {
			description: 'Requires hiding',
			isSatisfied: encounter => {
				const combatant = encounter.combatants.find(c => c.combat.current);
				if (combatant) {
					return combatant.combat.hidden > 0;
				}

				return false;
			}
		};
	};
}

export class ActionOriginParameters {
	static distance = (value: number): ActionOriginParameterModel => {
		return {
			name: 'origin',
			distance: value,
			candidates: [],
			value: null
		};
	};

	static weapon = (): ActionOriginParameterModel => {
		return {
			name: 'origin',
			distance: 'weapon',
			candidates: [],
			value: null
		};
	};
}

export class ActionTargetParameters {
	static self = (): ActionTargetParameterModel => {
		return {
			name: 'targets',
			range: {
				type: ActionRangeType.Self,
				radius: 0
			},
			targets: null,
			candidates: [],
			value: null
		};
	};

	static adjacent = (type: ActionTargetType, count: number): ActionTargetParameterModel => {
		return {
			name: 'targets',
			range: {
				type: ActionRangeType.Adjacent,
				radius: 0
			},
			targets: {
				type: type,
				count: count
			},
			candidates: [],
			value: null
		};
	};

	static burst = (type: ActionTargetType, count: number, radius: number): ActionTargetParameterModel => {
		return {
			name: 'targets',
			range: {
				type: ActionRangeType.Burst,
				radius: radius
			},
			targets: {
				type: type,
				count: count
			},
			candidates: [],
			value: null
		};
	};

	static weapon = (type: ActionTargetType, count: number, bonus: number): ActionTargetParameterModel => {
		return {
			name: 'targets',
			range: {
				type: ActionRangeType.Weapon,
				radius: bonus
			},
			targets: {
				type: type,
				count: count
			},
			candidates: [],
			value: null
		};
	};
}

export class ActionWeaponParameters {
	static melee = (): ActionWeaponParameterModel => {
		return {
			name: 'weapon',
			type: 'melee',
			candidates: [],
			value: null
		};
	};

	static ranged = (): ActionWeaponParameterModel => {
		return {
			name: 'weapon',
			type: 'ranged',
			candidates: [],
			value: null
		};
	};
}

export class ActionEffects {
	static if = (
		data: {
			description: string,
			check: (encounter: EncounterModel, combatant: CombatantModel, parameters: ActionParameterModel[]) => boolean,
			then: ActionEffectModel[]
		}
	): ActionEffectModel => {
		return {
			description: data.description,
			children: data.then,
			run: (encounter, combatant, parameters) => {
				const result = data.check(encounter, combatant, parameters);
				if (result) {
					data.then.forEach(effect => effect.run(encounter, combatant, parameters));
				}
			}
		};
	};

	static skillCheck = (
		data: {
			skill: SkillType,
			skillBonus: number,
			target: number,
			then: ActionEffectModel[]
		}
	): ActionEffectModel => {
		return {
			description: `Skill check: ${data.skill} vs ${data.target}`,
			children: data.then,
			run: (encounter, combatant, parameters) => {
				const targetsSucceeded: string[] = [];

				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const rank = EncounterLogic.getSkillRank(encounter, target, data.skill) + data.skillBonus;
						const roll = Random.dice(rank);
						if (roll >= data.target) {
							targetsSucceeded.push(target.id);
						}
					});
				}

				let copy = JSON.parse(JSON.stringify(parameters)) as ActionParameterModel[];
				copy = copy.filter(p => p.name !== 'targets');
				copy.push({ name: 'targets', candidates: [], value: targetsSucceeded });
				data.then.forEach(effect => effect.run(encounter, combatant, copy));
			}
		};
	};

	static attack = (
		data: {
			weapon: boolean,
			skill: SkillType,
			trait: TraitType,
			skillBonus: number,
			hit: ActionEffectModel[]
		}
	): ActionEffectModel => {
		return {
			description: (data.skillBonus === 0) ? `Attack: ${data.skill} vs ${data.trait}` : `Attack: ${data.skill} ${data.skillBonus >= 0 ? '+' : ''}${data.skillBonus} vs ${data.trait}`,
			children: data.hit,
			run: (encounter, combatant, parameters) => {
				const targetsSucceeded: string[] = [];

				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;

						let success = true;
						const weaponParam = parameters.find(p => p.name === 'weapon');
						if (weaponParam) {
							const item = weaponParam.value as ItemModel;
							const weapon = item.weapon as WeaponModel;
							if (weapon.unreliable > 0) {
								if (Random.dice(weapon.unreliable) > 10) {
									success = false;
								}
							}
						}

						if (success) {
							const attackRank = EncounterLogic.getSkillRank(encounter, combatant, data.skill) + data.skillBonus;
							const defenceRank = EncounterLogic.getTraitRank(encounter, target, data.trait);

							const attackRoll = Random.dice(attackRank);
							const defenceRoll = Random.dice(defenceRank);

							success = attackRoll >= defenceRoll;
						}

						if (success) {
							targetsSucceeded.push(target.id);
						}
					});
				}

				let copy = JSON.parse(JSON.stringify(parameters)) as ActionParameterModel[];
				copy = copy.filter(p => p.name !== 'targets');
				copy.push({ name: 'targets', candidates: [], value: targetsSucceeded });
				data.hit.forEach(effect => effect.run(encounter, combatant, copy));
			}
		};
	};

	static dealDamage = (type: DamageType, rank: number): ActionEffectModel => {
		return {
			description: `Deal ${type} damage (rank ${rank})`,
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const value = Random.dice(rank) + EncounterLogic.getDamageBonus(encounter, combatant, type);
						EncounterLogic.damage(encounter, target, value, type);
					});
				}
			}
		};
	};

	static dealWeaponDamage = (rankModifier = 0): ActionEffectModel => {
		return {
			description: 'Deal weapon damage',
			children: [],
			run: (encounter, combatant, parameters) => {
				const weaponParameter = parameters.find(p => p.name === 'weapon');
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (weaponParameter && targetParameter) {
					const item = weaponParameter.value as ItemModel;
					const weapon = item.weapon as WeaponModel;
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const value = Random.dice(weapon.damage.rank + rankModifier) + EncounterLogic.getDamageBonus(encounter, combatant, weapon.damage.type);
						EncounterLogic.damage(encounter, target, value, weapon.damage.type);
					});
				}
			}
		};
	};

	static inflictWounds = (value: number): ActionEffectModel => {
		return {
			description: `Inflict ${value} wounds`,
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.wound(encounter, target, value);
					});
				}
			}
		};
	};

	static healDamage = (rank: number): ActionEffectModel => {
		return {
			description: `Heal damage (rank ${rank})`,
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const value = Random.dice(rank);
						EncounterLogic.healDamage(encounter, target, value);
					});
				}
			}
		};
	};

	static healWounds = (value: number): ActionEffectModel => {
		return {
			description: `Heal ${value} wound(s)`,
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.healWounds(encounter, target, value);
					});
				}
			}
		};
	};

	static addCondition = (condition: ConditionModel): ActionEffectModel => {
		return {
			description: `Add a condition (${ConditionLogic.getConditionDescription(condition)}, rank ${condition.rank})`,
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const copy = JSON.parse(JSON.stringify(condition)) as ConditionModel;
						copy.id = Utils.guid();
						target.combat.conditions.push(copy);
					});
				}
			}
		};
	};

	static removeCondition = (trait: TraitType): ActionEffectModel => {
		return {
			description: trait === TraitType.Any ? 'Remove a condition' : `Remove a ${trait} condition`,
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const t = trait === TraitType.Any ? Collections.draw([ TraitType.Endurance, TraitType.Resolve, TraitType.Speed ]) : trait;
						const conditions = target.combat.conditions.filter(condition => condition.trait === t);
						if (conditions.length !== 0) {
							const maxRank = Math.max(...conditions.map(c => c.rank));
							const condition = conditions.find(c => c.rank === maxRank) as ConditionModel;
							target.combat.conditions = target.combat.conditions.filter(c => c.id !== condition.id);
						}
					});
				}
			}
		};
	};

	static grantMovement = (): ActionEffectModel => {
		return {
			description: 'Grant movement',
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const rank = EncounterLogic.getTraitRank(encounter, target, TraitType.Speed);
						target.combat.movement += Random.dice(rank);
					});
				}
			}
		};
	};

	static knockDown = (): ActionEffectModel => {
		return {
			description: 'Knock down',
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						if (target.combat.state === CombatantState.Standing) {
							target.combat.state = CombatantState.Prone;
						}
					});
				}
			}
		};
	};

	static loseTurn = (): ActionEffectModel => {
		return {
			description: 'Lose turn',
			children: [],
			run: (encounter, combatant, parameters) => {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						target.combat.initiative = Number.MIN_VALUE;
					});
				}
			}
		};
	};
}

export class ActionLogic {
	static getActionDescription = (action: ActionModel) => {
		return action.name;
	};

	static getTargetDescription = (target: ActionTargetParameterModel): string => {
		let count = '';
		let type = '';
		if (target.targets) {
			let plural = false;

			if (target.targets.count === 1) {
				count = 'one';
			} else if (target.targets.count === Number.MAX_VALUE) {
				count = 'all';
				plural = true;
			} else {
				count = `up to ${target.targets.count}`;
				plural = true;
			}

			switch (target.targets.type) {
				case ActionTargetType.Combatants:
					type = plural ? 'combatants' : 'combatant';
					break;
				case ActionTargetType.Enemies:
					type = plural ? 'enemies' : 'enemy';
					break;
				case ActionTargetType.Allies:
					type = plural ? 'allies' : 'ally';
					break;
				case ActionTargetType.Squares:
					type = plural ? 'squares' : 'square';
					break;
				case ActionTargetType.Walls:
					type = plural ? 'walls' : 'wall';
					break;
			}
		}

		let str = '';
		switch (target.range.type) {
			case ActionRangeType.Self:
				str = 'self';
				break;
			case ActionRangeType.Adjacent:
				str = `${count} adjacent ${type}`;
				break;
			case ActionRangeType.Burst:
				str = `${count} ${type} within ${target.range.radius} squares`;
				break;
			case ActionRangeType.Weapon:
				if (target.range.radius > 0) {
					str = `${count} ${type} within weapon range +${target.range.radius}`;
				} else {
					str = `${count} ${type} within weapon range`;
				}
				break;
		}

		return str;
	};

	static checkWeaponParameter = (parameter: ActionWeaponParameterModel, combatant: CombatantModel) => {
		const candidates: ItemModel[] = [];
		let value: ItemModel | null = null;

		const proficiencies: ItemProficiencyType[] = [];
		switch (parameter.type) {
			case 'melee':
				proficiencies.push(ItemProficiencyType.LargeWeapons);
				proficiencies.push(ItemProficiencyType.PairedWeapons);
				proficiencies.push(ItemProficiencyType.MilitaryWeapons);
				break;
			case 'ranged':
				proficiencies.push(ItemProficiencyType.RangedWeapons);
				proficiencies.push(ItemProficiencyType.PowderWeapons);
				break;
		}

		combatant.items
			.filter(i => proficiencies.includes(i.proficiency))
			.forEach(i => candidates.push(i));

		if (candidates.length > 0) {
			value = candidates[0];
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};

	static checkOriginParameter = (parameter: ActionOriginParameterModel, encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		const candidates: { x: number, y: number }[] = [];
		let value: { x: number, y: number } | null = null;

		let radius = 0;
		if (parameter.distance === 'weapon') {
			const wpnParam = action.parameters.find(p => p.name === 'weapon') as ActionWeaponParameterModel;
			if (wpnParam && (wpnParam.value !== null)) {
				const weapon = wpnParam.value as ItemModel;
				if (weapon.weapon) {
					radius = weapon.weapon.range;
				}
			}
		} else {
			radius = parameter.distance;
		}

		candidates.push(...EncounterLogic.findSquares(encounter, EncounterLogic.getCombatantSquares(encounter, combatant), radius));
		if (candidates.length > 0) {
			value = candidates[0];
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};

	static checkTargetParameter = (parameter: ActionTargetParameterModel, encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		const candidates: (string | { x: number, y: number })[] = [];
		const value: (string | { x: number, y: number })[] = [];

		if (parameter.range.type === ActionRangeType.Self) {
			candidates.push(combatant.id);
			value.push(combatant.id);
		} else {
			let radius = 0;
			switch (parameter.range.type) {
				case ActionRangeType.Adjacent:
					radius = 1;
					break;
				case ActionRangeType.Burst:
					radius = parameter.range.radius;
					break;
				case ActionRangeType.Weapon: {
					const wpnParam = action.parameters.find(p => p.name === 'weapon') as ActionWeaponParameterModel;
					if (wpnParam && (wpnParam.value !== null)) {
						const weapon = wpnParam.value as ItemModel;
						if (weapon.weapon) {
							radius = weapon.weapon.range;
						}
					}
					break;
				}
			}

			let originSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
			const originParam = action.parameters.find(p => p.name === 'origin');
			if (originParam) {
				originSquares = [ (originParam.value as { x: number, y: number }) ];
			}

			if (parameter.targets) {
				switch (parameter.targets.type) {
					case ActionTargetType.Combatants:
						candidates.push(...EncounterLogic.findCombatants(encounter, originSquares, radius).map(c => c.id));
						break;
					case ActionTargetType.Enemies:
						candidates.push(...EncounterLogic.findCombatants(encounter, originSquares, radius).filter(c => c.type !== combatant.type).map(c => c.id));
						break;
					case ActionTargetType.Allies:
						candidates.push(...EncounterLogic.findCombatants(encounter, originSquares, radius).filter(c => c.type === combatant.type).map(c => c.id));
						break;
					case ActionTargetType.Squares:
						candidates.push(...EncounterLogic.findSquares(encounter, originSquares, radius));
						break;
					case ActionTargetType.Walls:
						candidates.push(...EncounterLogic.findWalls(encounter, originSquares, radius));
						break;
				}

				if (parameter.targets.count === Number.MAX_VALUE) {
					value.push(...candidates);
				} else {
					value.push(...candidates.slice(0, parameter.targets.count));
				}
			}
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};
}
