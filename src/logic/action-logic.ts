import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';
import { CombatantState } from '../enums/combatant-state';
import { DamageType } from '../enums/damage-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { MovementType } from '../enums/movement-type';
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
import type { EncounterMapSquareModel, EncounterModel } from '../models/encounter';
import type { ItemModel, WeaponModel } from '../models/item';
import type { CombatantModel } from '../models/combatant';
import type { ConditionModel } from '../models/condition';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { CombatantLogic } from './combatant-logic';
import { ConditionLogic } from './condition-logic';
import { EncounterLogic } from './encounter-logic';
import { EncounterMapLogic } from './encounter-map-logic';
import { Factory } from './factory';

export class ActionPrerequisites {
	static meleeWeapon = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires a melee weapon',
			data: [ ItemProficiencyType.LargeWeapons, ItemProficiencyType.MilitaryWeapons, ItemProficiencyType.PairedWeapons ]
		};
	};

	static rangedWeapon = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires a ranged weapon',
			data: [ ItemProficiencyType.PowderWeapons, ItemProficiencyType.RangedWeapons ]
		};
	};

	static armor = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires armor',
			data: [ ItemProficiencyType.LightArmor, ItemProficiencyType.HeavyArmor ]
		};
	};

	static shield = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires a shield',
			data: [ ItemProficiencyType.Shields ]
		};
	};

	static implement = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires an implement',
			data: [ ItemProficiencyType.Implements ]
		};
	};

	static emptyHand = (): ActionPrerequisiteModel => {
		return {
			id: 'emptyhand',
			description: 'Requires a free hand',
			data: null
		};
	};

	static damage = (): ActionPrerequisiteModel => {
		return {
			id: 'damage',
			description: 'Requires at least 1 point of damage',
			data: null
		};
	};

	static wound = (): ActionPrerequisiteModel => {
		return {
			id: 'wound',
			description: 'Requires at least 1 wound',
			data: null
		};
	};

	static condition = (trait: TraitType): ActionPrerequisiteModel => {
		return {
			id: 'condition',
			description: trait === TraitType.Any ? 'Requires a condition': `Requires a ${trait} condition`,
			data: null
		};
	};

	static carryingCapacity = (): ActionPrerequisiteModel => {
		return {
			id: 'carryingcapacity',
			description: 'Requires spare carrying capacity',
			data: null
		};
	};

	static hidden = (): ActionPrerequisiteModel => {
		return {
			id: 'hidden',
			description: 'Requires hiding',
			data: null
		};
	};

	static prone = (): ActionPrerequisiteModel => {
		return {
			id: 'prone',
			description: 'Requires prone',
			data: null
		};
	};

	static isSatisfied = (prerequisite: ActionPrerequisiteModel, encounter: EncounterModel) => {
		const combatant = encounter.combatants.find(c => c.combat.current);
		if (!combatant) {
			return false;
		}

		switch (prerequisite.id) {
			case 'item': {
				const proficiencies = prerequisite.data as ItemProficiencyType[];
				return proficiencies.some(prof => {
					return combatant.items.some(i => i.proficiency === prof) && CombatantLogic.getProficiencies(combatant).includes(prof);
				});
			}
			case 'emptyhand': {
				const slotsUsed = combatant.items
					.filter(i => i.location === ItemLocationType.Hand)
					.map(i => i.slots)
					.reduce((sum, value) => sum + value, 0);
				return slotsUsed < 2;
			}
			case 'damage': {
				return combatant.combat.damage > 0;
			}
			case 'wound': {
				return combatant.combat.wounds > 0;
			}
			case 'condition': {
				const trait = prerequisite.data as TraitType;
				if (trait === TraitType.Any) {
					return combatant.combat.conditions.length > 0;
				}

				return combatant.combat.conditions.filter(c => c.trait === trait).length > 0;
			}
			case 'carryingcapacity': {
				return combatant.carried.length < 6;
			}
			case 'hidden': {
				return combatant.combat.hidden > 0;
			}
			case 'prone': {
				return combatant.combat.state === CombatantState.Prone;
			}
		}

		return true;
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
			id: 'attack',
			description: (data.skillBonus === 0) ? `Attack: ${data.skill} vs ${data.trait}` : `Attack: ${data.skill} ${data.skillBonus >= 0 ? '+' : ''}${data.skillBonus} vs ${data.trait}`,
			data: data,
			children: data.hit
		};
	};

	static dealWeaponDamage = (rankModifier = 0): ActionEffectModel => {
		return {
			id: 'weapondamage',
			description: 'Deal weapon damage',
			data: rankModifier,
			children: []
		};
	};

	static dealDamage = (type: DamageType, rank: number): ActionEffectModel => {
		return {
			id: 'damage',
			description: `Deal ${type} damage (rank ${rank})`,
			data: { type: type, rank: rank },
			children: []
		};
	};

	static inflictWounds = (value: number): ActionEffectModel => {
		return {
			id: 'wounds',
			description: `Inflict ${value} wounds`,
			data: value,
			children: []
		};
	};

	static dealDamageSelf = (type: DamageType, rank: number): ActionEffectModel => {
		return {
			id: 'damageSelf',
			description: `Deal ${type} damage to self (rank ${rank})`,
			data: { type: type, rank: rank },
			children: []
		};
	};

	static inflictWoundsSelf = (value: number): ActionEffectModel => {
		return {
			id: 'woundsSelf',
			description: `Inflict ${value} wounds on self`,
			data: value,
			children: []
		};
	};

	static healDamage = (rank: number): ActionEffectModel => {
		return {
			id: 'healdamage',
			description: `Heal damage (rank ${rank})`,
			data: rank,
			children: []
		};
	};

	static healWounds = (value: number): ActionEffectModel => {
		return {
			id: 'healwounds',
			description: `Heal ${value} wound(s)`,
			data: value,
			children: []
		};
	};

	static healDamageSelf = (rank: number): ActionEffectModel => {
		return {
			id: 'healdamageSelf',
			description: `Heal damage on self (rank ${rank})`,
			data: rank,
			children: []
		};
	};

	static healWoundsSelf = (value: number): ActionEffectModel => {
		return {
			id: 'healwoundsSelf',
			description: `Heal ${value} wound(s) on self`,
			data: value,
			children: []
		};
	};

	static addCondition = (condition: ConditionModel): ActionEffectModel => {
		return {
			id: 'addcondition',
			description: `Add a condition (${ConditionLogic.getConditionDescription(condition)}, rank ${condition.rank})`,
			data: condition,
			children: []
		};
	};

	static removeCondition = (trait: TraitType): ActionEffectModel => {
		return {
			id: 'removecondition',
			description: trait === TraitType.Any ? 'Remove a condition' : `Remove a ${trait} condition`,
			data: trait,
			children: []
		};
	};

	static addMovement = (): ActionEffectModel => {
		return {
			id: 'addMovementSelf',
			description: 'Add movement points',
			data: null,
			children: []
		};
	};

	static knockDown = (): ActionEffectModel => {
		return {
			id: 'knockdown',
			description: 'Knock down',
			data: null,
			children: []
		};
	};

	static stun = (): ActionEffectModel => {
		return {
			id: 'stun',
			description: 'Stun',
			data: null,
			children: []
		};
	};

	static stand = (): ActionEffectModel => {
		return {
			id: 'stand',
			description: 'Stand Up',
			data: null,
			children: []
		};
	};

	static reveal = (): ActionEffectModel => {
		return {
			id: 'reveal',
			description: 'Reveal if hidden',
			data: null,
			children: []
		};
	};

	static redrawActions = (): ActionEffectModel => {
		return {
			id: 'redraw',
			description: 'Redraw action cards',
			data: null,
			children: []
		};
	};

	static invertConditions = (all: boolean): ActionEffectModel => {
		return {
			id: 'invertCondition',
			description: all ? 'Invert conditions' : 'Invert a condition',
			data: all,
			children: []
		};
	};

	static transferCondition = (): ActionEffectModel => {
		return {
			id: 'transferCondition',
			description: 'Transfer a condition',
			data: null,
			children: []
		};
	};

	static commandAction = (): ActionEffectModel => {
		return {
			id: 'commandAction',
			description: 'Command target to attack',
			data: null,
			children: []
		};
	};

	static commandMove = (): ActionEffectModel => {
		return {
			id: 'commandMove',
			description: 'Command target to move',
			data: null,
			children: []
		};
	};

	static forceMovement = (type: MovementType, rank: number): ActionEffectModel => {
		return {
			id: 'forceMovement',
			description: `Forced movement (${type}), rank ${rank}`,
			data: {
				type: type,
				rank: rank
			},
			children: []
		};
	};

	static moveToTargetSquare = (): ActionEffectModel => {
		return {
			id: 'moveSelfTo',
			description: 'Move to square',
			data: null,
			children: []
		};
	};

	static disarm = (): ActionEffectModel => {
		return {
			id: 'disarm',
			description: 'Disarm',
			data: null,
			children: []
		};
	};

	static steal = (): ActionEffectModel => {
		return {
			id: 'steal',
			description: 'Steal',
			data: null,
			children: []
		};
	};

	static createTerrain = (type: EncounterMapSquareType): ActionEffectModel => {
		return {
			id: 'createTerrain',
			description: `Create ${type.toLowerCase()} terrain`,
			data: type,
			children: []
		};
	};

	static addSquares = (): ActionEffectModel => {
		return {
			id: 'addSquares',
			description: 'Create map squares',
			data: null,
			children: []
		};
	};

	static removeSquares = (): ActionEffectModel => {
		return {
			id: 'removeSquares',
			description: 'Destroy map squares',
			data: null,
			children: []
		};
	};

	static destroyWalls = (): ActionEffectModel => {
		return {
			id: 'destroyWalls',
			description: 'Destroy walls',
			data: null,
			children: []
		};
	};

	static run = (effect: ActionEffectModel, encounter: EncounterModel, combatant: CombatantModel, parameters: ActionParameterModel[]) => {
		switch (effect.id) {
			case 'attack': {
				const data = effect.data as {
					weapon: boolean,
					skill: SkillType,
					trait: TraitType,
					skillBonus: number,
					hit: ActionEffectModel[]
				};

				const targetsSucceeded: string[] = [];

				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;

						EncounterLogic.log(encounter, `${combatant.name} attacks ${target.name}`);

						let success = true;
						const weaponParam = parameters.find(p => p.name === 'weapon');
						if (weaponParam) {
							const item = weaponParam.value as ItemModel;
							const weapon = item.weapon as WeaponModel;
							if (weapon.unreliable > 0) {
								EncounterLogic.log(encounter, `${item.name} is Unreliable (rank ${weapon.unreliable})`);
								const roll = Random.dice(weapon.unreliable);
								if (roll >= 10) {
									success = false;
									EncounterLogic.log(encounter, `It fails (rolled ${roll})`);
								} else {
									EncounterLogic.log(encounter, `It works (rolled ${roll})`);
								}
							}
						}

						if (success) {
							const attackRank = EncounterLogic.getSkillRank(encounter, combatant, data.skill) + data.skillBonus;
							const defenceRank = EncounterLogic.getTraitRank(encounter, target, data.trait);

							const attackRoll = Random.dice(attackRank);
							const defenceRoll = Random.dice(defenceRank);

							EncounterLogic.log(encounter, `${combatant.name} rolls ${data.skill} (${attackRank}) and gets ${attackRoll}`);
							EncounterLogic.log(encounter, `${target.name} rolls ${data.trait} (${defenceRank}) and gets ${defenceRoll}`);

							success = attackRoll >= defenceRoll;
						}

						if (success) {
							targetsSucceeded.push(target.id);
							EncounterLogic.log(encounter, 'Hit');
						} else {
							EncounterLogic.log(encounter, 'Miss');
						}
					});
				}

				let copy = JSON.parse(JSON.stringify(parameters)) as ActionParameterModel[];
				copy = copy.filter(p => p.name !== 'targets');
				copy.push({ name: 'targets', candidates: [], value: targetsSucceeded });
				data.hit.forEach(effect => ActionEffects.run(effect, encounter, combatant, copy));
				break;
			}
			case 'weapondamage': {
				const rankModifier = effect.data as number;
				const weaponParameter = parameters.find(p => p.name === 'weapon');
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (weaponParameter && targetParameter) {
					const item = weaponParameter.value as ItemModel;
					const weapon = item.weapon as WeaponModel;
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const rank = weapon.damage.rank + rankModifier;
						const result = Random.dice(rank);
						EncounterLogic.log(encounter, `${combatant.name} rolls damage for ${target.name} (${rank}) and gets ${result}`);
						const bonus = EncounterLogic.getDamageBonus(encounter, combatant, weapon.damage.type);
						if (bonus > 0) {
							EncounterLogic.log(encounter, `${combatant.name} deals a bonus ${bonus} damage`);
						}
						EncounterLogic.damage(encounter, target, result + bonus, weapon.damage.type);
					});
				}
				break;
			}
			case 'damage': {
				const data = effect.data as { type: DamageType, rank: number };
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const result = Random.dice(data.rank);
						EncounterLogic.log(encounter, `${combatant.name} rolls damage for ${target.name} (${data.rank}) and gets ${result}`);
						const bonus = EncounterLogic.getDamageBonus(encounter, combatant, data.type);
						if (bonus > 0) {
							EncounterLogic.log(encounter, `${combatant.name} deals a bonus ${bonus} damage`);
						}
						EncounterLogic.damage(encounter, target, result + bonus, data.type);
					});
				}
				break;
			}
			case 'wounds': {
				const value = effect.data as number;
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.wound(encounter, target, value);
					});
				}
				break;
			}
			case 'damageSelf': {
				const data = effect.data as { type: DamageType, rank: number };
				const result = Random.dice(data.rank);
				EncounterLogic.log(encounter, `${combatant.name} rolls damage for self (${data.rank}) and gets ${result}`);
				const bonus = EncounterLogic.getDamageBonus(encounter, combatant, data.type);
				if (bonus > 0) {
					EncounterLogic.log(encounter, `${combatant.name} deals a bonus ${bonus} damage`);
				}
				EncounterLogic.damage(encounter, combatant, result + bonus, data.type);
				break;
			}
			case 'woundsSelf': {
				const value = effect.data as number;
				EncounterLogic.wound(encounter, combatant, value);
				break;
			}
			case 'healdamage': {
				const rank = effect.data as number;
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const value = Random.dice(rank);
						EncounterLogic.healDamage(encounter, target, value);
					});
				}
				break;
			}
			case 'healwounds': {
				const value = effect.data as number;
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.healWounds(encounter, target, value);
					});
				}
				break;
			}
			case 'healdamageSelf': {
				const rank = effect.data as number;
				const value = Random.dice(rank);
				EncounterLogic.healDamage(encounter, combatant, value);
				break;
			}
			case 'healwoundsSelf': {
				const value = effect.data as number;
				EncounterLogic.healWounds(encounter, combatant, value);
				break;
			}
			case 'addcondition': {
				const condition = effect.data as ConditionModel;
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const copy = JSON.parse(JSON.stringify(condition)) as ConditionModel;
						copy.id = Utils.guid();
						target.combat.conditions.push(copy);
						EncounterLogic.log(encounter, `${target.name} is now affected by ${ConditionLogic.getConditionDescription(condition)}, rank ${condition.rank}`);
					});
				}
				break;
			}
			case 'removecondition': {
				const trait = effect.data as TraitType;
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const t = trait === TraitType.Any ? Collections.draw([ TraitType.Endurance, TraitType.Resolve, TraitType.Speed ]) : trait;
						const conditions = target.combat.conditions
							.filter(condition => condition.trait === t)
							.filter(condition => ConditionLogic.getConditionIsBeneficial(condition) === (combatant.type === target.type));
						if (conditions.length !== 0) {
							const maxRank = Math.max(...conditions.map(c => c.rank));
							const condition = conditions.find(c => c.rank === maxRank) as ConditionModel;
							target.combat.conditions = target.combat.conditions.filter(c => c.id !== condition.id);
							EncounterLogic.log(encounter, `${target.name} is no longer affected by ${ConditionLogic.getConditionDescription(condition)}`);
						}
					});
				}
				break;
			}
			case 'addMovementSelf': {
				// This only applies to the current combatant
				const rank = EncounterLogic.getTraitRank(encounter, combatant, TraitType.Speed);
				const result = Random.dice(rank);
				combatant.combat.movement += result;
				EncounterLogic.log(encounter, `${combatant.name} rolls Speed (rank ${rank}) and gets ${result} additional movement`);
				break;
			}
			case 'knockdown': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						if (target.combat.state === CombatantState.Standing) {
							target.combat.state = CombatantState.Prone;
							EncounterLogic.log(encounter, `${target.name} is now ${target.combat.state}`);
						}
					});
				}
				break;
			}
			case 'stun': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						target.combat.stunned = true;
						EncounterLogic.log(encounter, `${target.name} is stunned`);
					});
				}
				break;
			}
			case 'stand': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						if (target.combat.state === CombatantState.Prone) {
							target.combat.state = CombatantState.Standing;
							EncounterLogic.log(encounter, `${target.name} stands up`);
						}
					});
				}
				break;
			}
			case 'reveal': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						if (target.combat.hidden > 0) {
							target.combat.hidden = 0;
							EncounterLogic.log(encounter, `${target.name} is no longer hidden`);
						}
					});
				}
				break;
			}
			case 'redraw': {
				// This only applies to the current combatant
				const deck = CombatantLogic.getActionDeck(combatant);
				combatant.combat.actions = Collections.shuffle(deck).splice(0, 3);
				break;
			}
			case 'invertConditions': {
				const all = effect.data as boolean;
				const invert = (target: CombatantModel, condition: ConditionModel) => {
					condition.type = ConditionLogic.getOppositeType(condition.type);
					EncounterLogic.log(encounter, `${target.name} is now affected by ${ConditionLogic.getConditionDescription(condition)}`);
				};
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const conditions = target.combat.conditions.filter(c => (combatant.type === target.type) !== ConditionLogic.getConditionIsBeneficial(c));
						if (all) {
							conditions.forEach(condition => invert(target, condition));
						} else if (conditions.length > 0) {
							const condition = Collections.draw(conditions);
							invert(target, condition);
						}
					});
				}
				break;
			}
			case 'transferCondition': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const conditions = combatant.combat.conditions.filter(c => (combatant.type === target.type) === ConditionLogic.getConditionIsBeneficial(c));
						if (conditions.length > 0) {
							const condition = Collections.draw(conditions);
							combatant.combat.conditions = combatant.combat.conditions.filter(c => c !== condition);
							const copy = JSON.parse(JSON.stringify(condition)) as ConditionModel;
							target.combat.conditions.push(copy);
							EncounterLogic.log(encounter, `${combatant.name} is no longer affected by ${ConditionLogic.getConditionDescription(condition)}`);
							EncounterLogic.log(encounter, `${target.name} is now affected by ${ConditionLogic.getConditionDescription(copy)}`);
						}
					});
				}
				break;
			}
			case 'commandAction': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						// TODO: Target uses an action
						// Select an action that we can meet the prerequisites of and set the parameters of
						// Perform it
					});
				}
				break;
			}
			case 'commandMove': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const distance = Random.dice(EncounterLogic.getTraitRank(encounter, target, TraitType.Speed));
						// TODO: Target moves
						// Select a location we can move to within range
						// Perform it
					});
				}
				break;
			}
			case 'forceMovement': {
				const data = effect.data as { type: MovementType, rank: number };
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						switch (data.type) {
							case MovementType.Pull: {
								const moveDistance = Random.dice(data.rank);
								for (let n = 0; n < moveDistance; ++n) {
									const distance = EncounterMapLogic.getDistance(combatant.combat.position, target.combat.position);
									const squares = EncounterLogic.getPossibleMoveSquares(encounter, target).filter(square => {
										return EncounterMapLogic.getDistance(combatant.combat.position, square) < distance;
									});
									if (squares.length > 0) {
										const square = Collections.draw(squares);
										target.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
										target.combat.position.x = square.x;
										target.combat.position.y = square.y;
									}
								}
								EncounterLogic.log(encounter, `${target.name} has been pulled`);
								break;
							}
							case MovementType.Push: {
								const moveDistance = Random.dice(data.rank);
								for (let n = 0; n < moveDistance; ++n) {
									const distance = EncounterMapLogic.getDistance(combatant.combat.position, target.combat.position);
									const squares = EncounterLogic.getPossibleMoveSquares(encounter, target).filter(square => {
										return EncounterMapLogic.getDistance(combatant.combat.position, square) > distance;
									});
									if (squares.length > 0) {
										const square = Collections.draw(squares);
										target.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
										target.combat.position.x = square.x;
										target.combat.position.y = square.y;
									}
								}
								EncounterLogic.log(encounter, `${target.name} has been pushed`);
								break;
							}
							case MovementType.Swap: {
								const currentX = combatant.combat.position.x;
								const currentY = combatant.combat.position.y;
								combatant.combat.position.x = target.combat.position.x;
								combatant.combat.position.y = target.combat.position.y;
								target.combat.position.x = currentX;
								target.combat.position.y = currentY;
								EncounterLogic.log(encounter, `${combatant.name} and ${target.name} have swapped positions`);
								break;
							}
							case MovementType.ToTarget: {
								const combatantSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
								const targetAdjacentSquares = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, EncounterLogic.getCombatantSquares(encounter, target));
								if (combatantSquares.some(sq => targetAdjacentSquares.find(s => (s.x === sq.x) && (s.y === sq.y)))) {
									// Already adjacent
								} else {
									const candidates = encounter.mapSquares.filter(sq => {
										const combatantSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
										const targetAdjacentSquares = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, EncounterLogic.getCombatantSquares(encounter, target));
										const canMoveHere = combatantSquares.every(sq => EncounterLogic.getSquareIsEmpty(encounter, sq));
										const wouldBeAdjacent = combatantSquares.some(sq => targetAdjacentSquares.find(s => (s.x === sq.x) && (s.y === sq.y)));
										return canMoveHere && wouldBeAdjacent;
									});
									if (candidates.length > 0) {
										const square = Collections.draw(candidates);
										combatant.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
										combatant.combat.position.x = square.x;
										combatant.combat.position.y = square.y;
										EncounterLogic.log(encounter, `${combatant.name} has moved to ${target.name}`);
									}
								}
								break;
							}
							case MovementType.Random: {
								const moveDistance = Random.dice(data.rank);
								const squares = encounter.mapSquares
									.filter(square => EncounterMapLogic.getDistance(target.combat.position, square) <= moveDistance)
									.filter(square => EncounterLogic.getCombatantSquares(encounter, target, square).every(sq => EncounterLogic.getSquareIsEmpty(encounter, sq)));
								if (squares.length > 0) {
									const square = Collections.draw(squares);
									target.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
									target.combat.position.x = square.x;
									target.combat.position.y = square.y;
								}
								EncounterLogic.log(encounter, `${target.name} has been moved to a random square`);
								break;
							}
						}
					});
				}
				break;
			}
			case 'moveSelfTo': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const squares = targetParameter.value as { x: number, y: number }[];
					const candidates = squares.filter(square => {
						return EncounterLogic.getCombatantSquares(encounter, combatant, square).every(sq => EncounterLogic.getSquareIsEmpty(encounter, sq));
					});
					if (candidates.length > 0) {
						const square = Collections.draw(candidates);
						combatant.combat.trail.push({ x: combatant.combat.position.x, y: combatant.combat.position.y });
						combatant.combat.position.x = square.x;
						combatant.combat.position.y = square.y;
					}
					EncounterLogic.log(encounter, `${combatant.name} has moved`);
				}
				break;
			}
			case 'disarm': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const items = target.items.filter(i => i.location === ItemLocationType.Hand);
						if (items.length > 0) {
							const item = Collections.draw(items);
							target.items.filter(i => i !== item);
							target.carried.filter(i => i !== item);
							const squares = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, EncounterLogic.getCombatantSquares(encounter, target))
								.filter(square => EncounterLogic.getSquareIsEmpty(encounter, square));
							if (squares.length > 0) {
								const square = Collections.draw(squares);
								const loot = Factory.createLootPile();
								loot.items.push(item);
								loot.position.x = square.x;
								loot.position.y = square.y;
								encounter.loot.push(loot);
							}
							EncounterLogic.log(encounter, `${target.name} has lost ${item.name}`);
						}
					});
				}
				break;
			}
			case 'steal': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const items = ([] as ItemModel[]).concat(target.items).concat(target.carried);
						if (items.length > 0) {
							const item = Collections.draw(items);
							target.items.filter(i => i !== item);
							target.carried.filter(i => i !== item);
							combatant.carried.push(item);
							EncounterLogic.log(encounter, `${target.name} has lost ${item.name}`);
						}
					});
				}
				break;
			}
			case 'createTerrain': {
				const type = effect.data as EncounterMapSquareType;
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const squares = targetParameter.value as { x: number, y: number }[];
					squares.forEach(square => {
						const blob = EncounterMapLogic.getFloorBlob(encounter.mapSquares, square);
						blob.forEach(sq => sq.type = type);
					});
					EncounterLogic.log(encounter, `${combatant.name} has created an area of ${type.toLowerCase()} terrain`);
				}
				break;
			}
			case 'addSquares': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const walls = targetParameter.value as { x: number, y: number }[];
					walls.forEach(wall => {
						const blob = EncounterMapLogic.getWallBlob(encounter.mapSquares, wall);
						blob.forEach(sq => {
							const square: EncounterMapSquareModel = {
								x: sq.x,
								y: sq.y,
								type: EncounterMapSquareType.Clear
							};
							encounter.mapSquares.push(square);
						});
					});
					EncounterLogic.log(encounter, `${combatant.name} has created map squares`);
				}
				break;
			}
			case 'removeSquares': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const squares = targetParameter.value as { x: number, y: number }[];
					squares.forEach(square => {
						const blob = EncounterMapLogic.getFloorBlob(encounter.mapSquares, square).filter(sq => EncounterLogic.getSquareIsEmpty(encounter, sq));
						encounter.mapSquares = encounter.mapSquares.filter(sq => !blob.includes(sq));
					});
					EncounterLogic.log(encounter, `${combatant.name} has destroyed map squares`);
				}
				break;
			}
			case 'destroyWalls': {
				const targetParameter = parameters.find(p => p.name === 'targets');
				if (targetParameter) {
					const walls = targetParameter.value as { x: number, y: number }[];
					walls.forEach(wall => {
						const square: EncounterMapSquareModel = {
							x: wall.x,
							y: wall.y,
							type: EncounterMapSquareType.Obstructed
						};
						encounter.mapSquares.push(square);
					});
					EncounterLogic.log(encounter, `${combatant.name} has destroyed walls`);
				}
				break;
			}
		}
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
		let value = parameter.value as ItemModel | null;

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
			if ((value === null) || !candidates.includes(value)) {
				value = candidates[0];
			}
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};

	static checkOriginParameter = (parameter: ActionOriginParameterModel, encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		const candidates: { x: number, y: number }[] = [];
		let value = parameter.value as { x: number, y: number }[];

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
			if ((value === null) || (value.length === 0) || value.some(v => !candidates.includes(v))) {
				value = [ candidates[0] ];
			}
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};

	static checkTargetParameter = (parameter: ActionTargetParameterModel, encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		const candidates: (string | { x: number, y: number })[] = [];
		let value = parameter.value as (string | { x: number, y: number })[] ?? [];

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
							radius = weapon.weapon.range + parameter.range.radius;
						}
					}
					break;
				}
			}

			let originSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
			const originParam = action.parameters.find(p => p.name === 'origin');
			if (originParam) {
				originSquares = originParam.value as { x: number, y: number }[];
			}

			if (parameter.targets) {
				switch (parameter.targets.type) {
					case ActionTargetType.Combatants:
						candidates.push(
							...EncounterLogic.findCombatants(encounter, originSquares, radius)
								.filter(c => c.id !== combatant.id)
								.filter(c => c.combat.state !== CombatantState.Dead)
								.filter(c => combatant.combat.senses >= c.combat.hidden)
								.filter(c => EncounterMapLogic.canSeeAny(originSquares, EncounterLogic.getCombatantSquares(encounter, c)))
								.map(c => c.id));
						break;
					case ActionTargetType.Enemies:
						candidates.push(
							...EncounterLogic.findCombatants(encounter, originSquares, radius)
								.filter(c => c.id !== combatant.id)
								.filter(c => c.combat.state !== CombatantState.Dead)
								.filter(c => combatant.combat.senses >= c.combat.hidden)
								.filter(c => c.type !== combatant.type)
								.filter(c => EncounterMapLogic.canSeeAny(originSquares, EncounterLogic.getCombatantSquares(encounter, c)))
								.map(c => c.id));
						break;
					case ActionTargetType.Allies:
						candidates.push(
							...EncounterLogic.findCombatants(encounter, originSquares, radius)
								.filter(c => c.id !== combatant.id)
								.filter(c => c.combat.state !== CombatantState.Dead)
								.filter(c => combatant.combat.senses >= c.combat.hidden)
								.filter(c => c.type === combatant.type)
								.filter(c => EncounterMapLogic.canSeeAny(originSquares, EncounterLogic.getCombatantSquares(encounter, c)))
								.map(c => c.id));
						break;
					case ActionTargetType.Squares:
						candidates.push(
							...EncounterLogic.findSquares(encounter, originSquares, radius)
								.filter(sq => EncounterMapLogic.canSeeAny(originSquares, [ sq ])));
						break;
					case ActionTargetType.Walls:
						candidates.push(
							...EncounterLogic.findWalls(encounter, originSquares, radius)
								.filter(sq => EncounterMapLogic.canSeeAny(originSquares, [ sq ])));
						break;
				}

				if (parameter.targets.count === Number.MAX_VALUE) {
					value = [];
					value.push(...candidates);
				} else {
					if (candidates.length > 0) {
						if ((value.length === 0) || value.some(v => !candidates.includes(v))) {
							value = [];
							value.push(...candidates.slice(0, parameter.targets.count));
						}
					}
				}
			}
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};
}
