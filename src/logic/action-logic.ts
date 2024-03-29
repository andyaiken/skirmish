import { BaseData } from '../data/base-data';
import { MonsterSpeciesData } from '../data/monster-species-data';

import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';
import { CombatantState } from '../enums/combatant-state';
import { CombatantType } from '../enums/combatant-type';
import { DamageType } from '../enums/damage-type';
import { EncounterMapSquareType } from '../enums/encounter-map-square-type';
import { FeatureType } from '../enums/feature-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { MovementType } from '../enums/movement-type';
import { QuirkType } from '../enums/quirk-type';
import { SkillType } from '../enums/skill-type';
import { SummonType } from '../enums/summon-type';
import { TraitType } from '../enums/trait-type';

import { EncounterGenerator } from '../generators/encounter-generator';

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
import { EncounterLogLogic } from './encounter-log-logic';
import { EncounterLogic } from './encounter-logic';
import { EncounterMapLogic } from './encounter-map-logic';
import { Factory } from './factory';
import { GameLogic } from './game-logic';
import { IntentsLogic } from './intents-logic';
import { PathLogic } from './path-logic';

export class ActionPrerequisites {
	static meleeWeapon = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires you to have a melee weapon',
			data: [ ItemProficiencyType.LargeWeapons, ItemProficiencyType.MilitaryWeapons, ItemProficiencyType.PairedWeapons ]
		};
	};

	static rangedWeapon = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires you to have a ranged weapon',
			data: [ ItemProficiencyType.PowderWeapons, ItemProficiencyType.RangedWeapons ]
		};
	};

	static armor = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires you to be wearing armor',
			data: [ ItemProficiencyType.LightArmor, ItemProficiencyType.HeavyArmor ]
		};
	};

	static shield = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires you to have a shield',
			data: [ ItemProficiencyType.Shields ]
		};
	};

	static implement = (): ActionPrerequisiteModel => {
		return {
			id: 'item',
			description: 'Requires you to have an implement',
			data: [ ItemProficiencyType.Implements ]
		};
	};

	static emptyHand = (): ActionPrerequisiteModel => {
		return {
			id: 'emptyhand',
			description: 'Requires you to have a free hand',
			data: null
		};
	};

	static damage = (): ActionPrerequisiteModel => {
		return {
			id: 'damage',
			description: 'Requires you to have at least 1 point of damage',
			data: null
		};
	};

	static wound = (): ActionPrerequisiteModel => {
		return {
			id: 'wound',
			description: 'Requires you to have at least 1 wound',
			data: null
		};
	};

	static condition = (trait: TraitType): ActionPrerequisiteModel => {
		return {
			id: 'condition',
			description: trait === TraitType.Any ? 'Requires you to have a condition': `Requires you to have a ${trait} condition`,
			data: null
		};
	};

	static carryingCapacity = (): ActionPrerequisiteModel => {
		return {
			id: 'carryingcapacity',
			description: 'Requires you to have spare carrying capacity',
			data: null
		};
	};

	static hidden = (): ActionPrerequisiteModel => {
		return {
			id: 'hidden',
			description: 'Requires you to be hidden',
			data: null
		};
	};

	static prone = (): ActionPrerequisiteModel => {
		return {
			id: 'prone',
			description: 'Requires you to be prone',
			data: null
		};
	};

	static isSatisfied = (prerequisite: ActionPrerequisiteModel, combatant: CombatantModel) => {
		switch (prerequisite.id) {
			case 'item': {
				const proficiencies = prerequisite.data as ItemProficiencyType[];
				return proficiencies.some(prof => {
					return combatant.items.some(i => i.proficiency === prof) && CombatantLogic.getProficiencies(combatant).includes(prof);
				});
			}
			case 'emptyhand': {
				const slotsUsed = Collections.sum(combatant.items.filter(i => i.location === ItemLocationType.Hand), i => i.slots);
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
				return combatant.carried.length < CombatantLogic.CARRY_CAPACITY;
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
			id: 'origin',
			distance: value,
			candidates: [],
			value: null
		};
	};

	static weapon = (): ActionOriginParameterModel => {
		return {
			id: 'origin',
			distance: 'weapon',
			candidates: [],
			value: null
		};
	};
}

export class ActionTargetParameters {
	static self = (): ActionTargetParameterModel => {
		return {
			id: 'targets',
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
			id: 'targets',
			range: {
				type: ActionRangeType.Adjacent,
				radius: 1
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
			id: 'targets',
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

	static weapon = (type: ActionTargetType, count: number, radius: number): ActionTargetParameterModel => {
		return {
			id: 'targets',
			range: {
				type: ActionRangeType.Weapon,
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
}

export class ActionWeaponParameters {
	static melee = (): ActionWeaponParameterModel => {
		return {
			id: 'weapon',
			type: 'melee',
			candidates: [],
			value: null
		};
	};

	static ranged = (): ActionWeaponParameterModel => {
		return {
			id: 'weapon',
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
			data: data,
			children: data.hit
		};
	};

	static toSelf = (data: ActionEffectModel[]): ActionEffectModel => {
		return {
			id: 'toSelf',
			data: data,
			children: data
		};
	};

	static dealWeaponDamage = (rankModifier = 0): ActionEffectModel => {
		return {
			id: 'weapondamage',
			data: rankModifier,
			children: []
		};
	};

	static dealDamage = (type: DamageType, rank: number): ActionEffectModel => {
		return {
			id: 'damage',
			data: { type: type, rank: rank },
			children: []
		};
	};

	static inflictWounds = (value: number): ActionEffectModel => {
		return {
			id: 'wounds',
			data: value,
			children: []
		};
	};

	static healDamage = (rank: number): ActionEffectModel => {
		return {
			id: 'healdamage',
			data: rank,
			children: []
		};
	};

	static healWounds = (value: number): ActionEffectModel => {
		return {
			id: 'healwounds',
			data: value,
			children: []
		};
	};

	static addCondition = (condition: ConditionModel): ActionEffectModel => {
		return {
			id: 'addcondition',
			data: condition,
			children: []
		};
	};

	static removeCondition = (trait: TraitType): ActionEffectModel => {
		return {
			id: 'removecondition',
			data: trait,
			children: []
		};
	};

	static addMovement = (): ActionEffectModel => {
		return {
			id: 'addMovement',
			data: null,
			children: []
		};
	};

	static knockDown = (): ActionEffectModel => {
		return {
			id: 'knockdown',
			data: null,
			children: []
		};
	};

	static stun = (): ActionEffectModel => {
		return {
			id: 'stun',
			data: null,
			children: []
		};
	};

	static stand = (): ActionEffectModel => {
		return {
			id: 'stand',
			data: null,
			children: []
		};
	};

	static scan = (): ActionEffectModel => {
		return {
			id: 'scan',
			data: null,
			children: []
		};
	};

	static hide = (): ActionEffectModel => {
		return {
			id: 'hide',
			data: null,
			children: []
		};
	};

	static reveal = (): ActionEffectModel => {
		return {
			id: 'reveal',
			data: null,
			children: []
		};
	};

	static takeAnotherAction = (redraw = false): ActionEffectModel => {
		return {
			id: 'takeAnotherAction',
			data: redraw,
			children: []
		};
	};

	static invertConditions = (all: boolean): ActionEffectModel => {
		return {
			id: 'invertConditions',
			data: all,
			children: []
		};
	};

	static transferCondition = (): ActionEffectModel => {
		return {
			id: 'transferCondition',
			data: null,
			children: []
		};
	};

	static commandAction = (): ActionEffectModel => {
		return {
			id: 'commandAction',
			data: null,
			children: []
		};
	};

	static commandMove = (): ActionEffectModel => {
		return {
			id: 'commandMove',
			data: null,
			children: []
		};
	};

	static forceMovement = (type: MovementType, rank: number): ActionEffectModel => {
		return {
			id: 'forceMovement',
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
			data: null,
			children: []
		};
	};

	static disarm = (): ActionEffectModel => {
		return {
			id: 'disarm',
			data: null,
			children: []
		};
	};

	static steal = (): ActionEffectModel => {
		return {
			id: 'steal',
			data: null,
			children: []
		};
	};

	static createTerrain = (type: EncounterMapSquareType): ActionEffectModel => {
		return {
			id: 'createTerrain',
			data: type,
			children: []
		};
	};

	static addSquares = (): ActionEffectModel => {
		return {
			id: 'addSquares',
			data: null,
			children: []
		};
	};

	static removeSquares = (): ActionEffectModel => {
		return {
			id: 'removeSquares',
			data: null,
			children: []
		};
	};

	static destroyWalls = (): ActionEffectModel => {
		return {
			id: 'destroyWalls',
			data: null,
			children: []
		};
	};

	static createPotion = (potionID: string): ActionEffectModel => {
		return {
			id: 'createPotion',
			data: potionID,
			children: []
		};
	};

	static summon = (type: SummonType): ActionEffectModel => {
		return {
			id: 'summon',
			data: type,
			children: []
		};
	};

	static getDescription = (effect: ActionEffectModel, combatant: CombatantModel | null, encounter: EncounterModel | null): string => {
		switch (effect.id) {
			case 'attack': {
				const data = effect.data as {
					weapon: boolean,
					skill: SkillType,
					trait: TraitType,
					skillBonus: number,
					hit: ActionEffectModel[]
				};
				if (combatant) {
					let rank = CombatantLogic.getSkillRank(combatant, [], data.skill);
					if (encounter) {
						rank = EncounterLogic.getSkillRank(encounter, combatant, data.skill);
					}
					if (data.skillBonus === 0) {
						return `Attack: ${data.skill} (rank ${rank}) vs ${data.trait}`;
					}
					return `Attack: ${data.skill} ${data.skillBonus >= 0 ? '+' : ''}${data.skillBonus} (rank ${Math.max(rank + data.skillBonus, 0)}) vs ${data.trait}`;
				}
				if (data.skillBonus === 0) {
					return `Attack: ${data.skill} vs ${data.trait}`;
				}
				return `Attack: ${data.skill} ${data.skillBonus >= 0 ? '+' : ''}${data.skillBonus} vs ${data.trait}`;
			}
			case 'toSelf': {
				return 'To self';
			}
			case 'weapondamage': {
				const rankModifier = effect.data as number;
				return rankModifier === 0 ? 'Deal weapon damage' : `Deal weapon damage ${rankModifier > 0 ? '+' : ''}${rankModifier}`;
			}
			case 'damage': {
				const data = effect.data as { type: DamageType, rank: number };
				return `Deal ${data.type} damage (rank ${data.rank})`;
			}
			case 'wounds': {
				const value = effect.data as number;
				return `Inflict ${value} wounds`;
			}
			case 'healdamage': {
				const rank = effect.data as number;
				return `Heal damage (rank ${rank})`;
			}
			case 'healwounds': {
				const value = effect.data as number;
				return `Heal ${value} wound(s)`;
			}
			case 'addcondition': {
				const condition = effect.data as ConditionModel;
				return `Add a condition (${ConditionLogic.getConditionDescription(condition)}, rank ${condition.rank})`;
			}
			case 'removecondition': {
				const trait = effect.data as TraitType;
				return trait === TraitType.Any ? 'Remove a condition' : `Remove a ${trait} condition`;
			}
			case 'addMovement': {
				return 'Add movement points';
			}
			case 'knockdown': {
				return 'Knock down';
			}
			case 'stun': {
				return 'Stun';
			}
			case 'scan': {
				return 'Scan';
			}
			case 'hide': {
				return 'Hide';
			}
			case 'reveal': {
				return 'Reveal';
			}
			case 'stand': {
				return 'Stand Up';
			}
			case 'takeAnotherAction': {
				const redraw = effect.data as boolean;
				return redraw ? 'Redraw action cards' : 'Take another action';
			}
			case 'invertConditions': {
				const all = effect.data as boolean;
				return all ? 'Invert conditions' : 'Invert a condition';
			}
			case 'transferCondition': {
				return 'Transfer a condition';
			}
			case 'commandAction': {
				return 'Command target to attack';
			}
			case 'commandMove': {
				return 'Command target to move';
			}
			case 'forceMovement': {
				const data = effect.data as { type: MovementType, rank: number };
				if (data.rank === 0) {
					return `Move (${data.type})`;
				}
				return `Move (${data.type}), rank ${data.rank}`;
			}
			case 'moveSelfTo': {
				return 'Move to square';
			}
			case 'disarm': {
				return 'Disarm';
			}
			case 'steal': {
				return 'Steal';
			}
			case 'createTerrain': {
				const type = effect.data as EncounterMapSquareType;
				return `Create ${type.toLowerCase()} terrain`;
			}
			case 'addSquares': {
				return 'Create map squares';
			}
			case 'removeSquares': {
				return 'Destroy map squares';
			}
			case 'destroyWalls': {
				return 'Destroy walls';
			}
			case 'createPotion': {
				const potionID = effect.data as string;
				const potion = GameLogic.getPotion(potionID) as ItemModel;
				return `Create a ${potion.name}`;
			}
			case 'summon': {
				const type = effect.data as SummonType;
				return `Summon ${type}`;
			}
		}

		return '';
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

				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;

						let success = true;
						const weaponParam = parameters.find(p => p.id === 'weapon');
						if (weaponParam) {
							const itemID = weaponParam.value as string;
							const item = combatant.items.find(i => i.id === itemID);
							if (item) {
								const weapon = item.weapon as WeaponModel;
								if (weapon.unreliable > 0) {
									const roll = Random.dice(weapon.unreliable);
									if (roll >= 10) {
										success = false;
										EncounterLogLogic.log(encounter, [
											EncounterLogLogic.text(`${item.name} is Unreliable (rank ${weapon.unreliable}); it fails with`),
											EncounterLogLogic.result(roll)
										]);
									}
								}
							}
						}

						if (success) {
							if ((target.combat.state === CombatantState.Unconscious) || (target.combat.state === CombatantState.Dead)) {
								// Automatic hit
								EncounterLogLogic.log(encounter, [
									EncounterLogLogic.text('Coup de grâce (no attack roll required)')
								]);
							} else {
								const atkRank = EncounterLogic.getSkillRank(encounter, combatant, data.skill) + data.skillBonus;
								const defRank = EncounterLogic.getTraitRank(encounter, target, data.trait);

								const atkRoll = Random.dice(atkRank);
								const defRoll = Random.dice(defRank);
								success = atkRoll >= defRoll;

								EncounterLogLogic.log(
									encounter,
									[
										EncounterLogLogic.combatant(combatant),
										EncounterLogLogic.text('attacks with'),
										EncounterLogLogic.rank(data.skill, atkRank),
										EncounterLogLogic.text('and gets'),
										EncounterLogLogic.result(atkRoll),
										EncounterLogLogic.text('-'),
										EncounterLogLogic.combatant(target),
										EncounterLogLogic.text('defends with'),
										EncounterLogLogic.rank(data.trait, defRank),
										EncounterLogLogic.text('and gets'),
										EncounterLogLogic.result(defRoll),
										EncounterLogLogic.text('-'),
										success ? EncounterLogLogic.text('HIT') : EncounterLogLogic.text('MISS')
									],
									true
								);
							}
						}

						if (success) {
							targetsSucceeded.push(target.id);
						}
					});
				}

				let copy = JSON.parse(JSON.stringify(parameters)) as ActionParameterModel[];
				copy = copy.filter(p => p.id !== 'targets');
				copy.push({ id: 'targets', candidates: [], value: targetsSucceeded });
				data.hit.forEach(effect => {
					ActionEffects.run(effect, encounter, combatant, copy);
				});
				break;
			}
			case 'toSelf': {
				let copy = JSON.parse(JSON.stringify(parameters)) as ActionParameterModel[];
				copy = copy.filter(p => p.id !== 'targets');
				copy.push({ id: 'targets', candidates: [], value: [ combatant.id ] });
				const effects = effect.data as ActionEffectModel[];
				effects.forEach(effect => {
					ActionEffects.run(effect, encounter, combatant, copy);
				});
				break;
			}
			case 'weapondamage': {
				const rankModifier = effect.data as number;
				const weaponParameter = parameters.find(p => p.id === 'weapon');
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (weaponParameter && targetParameter) {
					const itemID = weaponParameter.value as string;
					const item = combatant.items.find(i => i.id === itemID);
					if (item) {
						const weapon = item.weapon as WeaponModel;
						const targetIDs = targetParameter.value as string[];
						targetIDs.forEach(id => {
							const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
							weapon.damage.forEach(dmg => {
								EncounterLogic.dealDamage(encounter, combatant, target, dmg.rank + rankModifier, dmg.type);
							});
						});
					}
				}
				break;
			}
			case 'damage': {
				const data = effect.data as { type: DamageType, rank: number };
				if (data.type === DamageType.Any) {
					data.type = GameLogic.getRandomDamageType();
				}
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.dealDamage(encounter, combatant, target, data.rank, data.type);
					});
				}
				break;
			}
			case 'wounds': {
				const value = effect.data as number;
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.wound(encounter, target, value);
					});
				}
				break;
			}
			case 'healdamage': {
				const rank = effect.data as number;
				const targetParameter = parameters.find(p => p.id === 'targets');
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
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.healWounds(encounter, target, value);
					});
				}
				break;
			}
			case 'addcondition': {
				const condition = effect.data as ConditionModel;
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						if (target.combat.state !== CombatantState.Dead) {
							const existing = target.combat.conditions
								.find(c => (c.trait === condition.trait) && (ConditionLogic.getConditionDescription(c) === ConditionLogic.getConditionDescription(condition)));
							if (existing) {
								existing.rank += condition.rank;
							} else {
								const copy = JSON.parse(JSON.stringify(condition)) as ConditionModel;
								copy.id = Utils.guid();
								target.combat.conditions.push(copy);
							}
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(target),
								EncounterLogLogic.text(`is now affected by ${ConditionLogic.getConditionDescription(condition)}, rank ${condition.rank}`)
							]);
						}
					});
				}
				break;
			}
			case 'removecondition': {
				const trait = effect.data as TraitType;
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const t = trait === TraitType.Any ? Collections.draw([ TraitType.Endurance, TraitType.Resolve, TraitType.Speed ]) : trait;
						const conditions = target.combat.conditions
							.filter(condition => condition.trait === t)
							.filter(condition => ConditionLogic.getConditionIsBeneficial(condition) === (combatant.faction !== target.faction));
						if (conditions.length !== 0) {
							const maxRank = Math.max(...conditions.map(c => c.rank));
							const condition = conditions.find(c => c.rank === maxRank) as ConditionModel;
							target.combat.conditions = target.combat.conditions.filter(c => c.id !== condition.id);
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(target),
								EncounterLogLogic.text(`is no longer affected by ${ConditionLogic.getConditionDescription(condition)}`)
							]);
						}
					});
				}
				break;
			}
			case 'addMovement': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const rank = EncounterLogic.getTraitRank(encounter, target, TraitType.Speed);
						const result = Random.dice(rank);
						target.combat.movement += result;
						EncounterLogLogic.log(encounter, [
							EncounterLogLogic.combatant(target),
							EncounterLogLogic.text('rolls'),
							EncounterLogLogic.rank('Speed', rank),
							EncounterLogLogic.text('and gets'),
							EncounterLogLogic.result(result),
							EncounterLogLogic.text('additional movement')
						]);
					});
				}
				break;
			}
			case 'knockdown': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.goProne(encounter, target);
					});
				}
				break;
			}
			case 'stun': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.stun(encounter, target);
					});
				}
				break;
			}
			case 'scan': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						target.combat.movement += 4;
						EncounterLogic.scan(encounter, target);
						EncounterLogLogic.log(encounter, [
							EncounterLogLogic.combatant(target),
							EncounterLogLogic.text('scans')
						]);
					});
				}
				break;
			}
			case 'hide': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						target.combat.movement += 4;
						EncounterLogic.hide(encounter, target);
						EncounterLogLogic.log(encounter, [
							EncounterLogLogic.combatant(target),
							EncounterLogLogic.text('hides')
						]);
					});
				}
				break;
			}
			case 'reveal': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.reveal(encounter, target);
					});
				}
				break;
			}
			case 'stand': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogic.standUp(encounter, target);
					});
				}
				break;
			}
			case 'takeAnotherAction': {
				// This only applies to the current combatant
				const redraw = effect.data as boolean;
				if (redraw) {
					// Get a new set of action cards
					EncounterLogic.drawActions(encounter, combatant);
					combatant.combat.selectedAction = null;
				} else {
					// Remove this action card from the set
					const currentActionID = combatant.combat.selectedAction ? combatant.combat.selectedAction.action.id : null;
					if (currentActionID) {
						combatant.combat.actions = combatant.combat.actions.filter(a => a.id !== currentActionID);
					}
					combatant.combat.selectedAction = null;
				}
				break;
			}
			case 'invertConditions': {
				const all = effect.data as boolean;
				const invert = (target: CombatantModel, condition: ConditionModel) => {
					condition.type = ConditionLogic.getOppositeType(condition.type);
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.combatant(target),
						EncounterLogLogic.text(`is now affected by ${ConditionLogic.getConditionDescription(condition)}`)
					]);
				};
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const conditions = target.combat.conditions.filter(c => (combatant.faction === target.faction) !== ConditionLogic.getConditionIsBeneficial(c));
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
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const conditions = combatant.combat.conditions.filter(c => (combatant.faction === target.faction) === ConditionLogic.getConditionIsBeneficial(c));
						if (conditions.length > 0) {
							const condition = Collections.draw(conditions);
							combatant.combat.conditions = combatant.combat.conditions.filter(c => c !== condition);
							const copy = JSON.parse(JSON.stringify(condition)) as ConditionModel;
							target.combat.conditions.push(copy);
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(combatant),
								EncounterLogLogic.text('is no longer affected by'),
								EncounterLogLogic.rank(ConditionLogic.getConditionDescription(condition), condition.rank)
							]);
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(target),
								EncounterLogLogic.text('is now affected by'),
								EncounterLogLogic.rank(ConditionLogic.getConditionDescription(copy), copy.rank)
							]);
						}
					});
				}
				break;
			}
			case 'commandAction': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogLogic.log(encounter, [
							EncounterLogLogic.combatant(combatant),
							EncounterLogLogic.text('commands'),
							EncounterLogLogic.combatant(target),
							EncounterLogLogic.text('to attack')
						]);
						target.combat.selectedAction = null;
						target.combat.actions = CombatantLogic.getActionDeck(target).filter(action => ActionLogic.getActionType(action) === 'Attack');
						target.combat.actions.push(...BaseData.getBaseActions().filter(action => ActionLogic.getActionType(action) === 'Attack'));
						EncounterLogic.checkActionParameters(encounter, target, (combatant.faction !== target.faction));
						const intents = IntentsLogic.getAttackIntents(encounter, target, (combatant.faction !== target.faction));
						if (intents.length > 0) {
							target.combat.intents = Collections.draw(intents);
							IntentsLogic.performIntents(encounter, target);
						} else {
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(target),
								EncounterLogLogic.text('cannot attack')
							]);
						}
					});
				}
				break;
			}
			case 'commandMove': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						EncounterLogLogic.log(encounter, [
							EncounterLogLogic.combatant(combatant),
							EncounterLogLogic.text('commands'),
							EncounterLogLogic.combatant(target),
							EncounterLogLogic.text('to move')
						]);
						target.combat.movement = Random.dice(EncounterLogic.getTraitRank(encounter, target, TraitType.Speed));
						const paths = PathLogic.findPaths(encounter, target, true);
						const intents = IntentsLogic.getMovementIntents(encounter, target, paths);
						if (intents.length > 0) {
							target.combat.intents = Collections.draw(intents);
							IntentsLogic.performIntents(encounter, target);
						} else {
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(target),
								EncounterLogLogic.text('cannot move')
							]);
						}
					});
				}
				break;
			}
			case 'forceMovement': {
				const data = effect.data as { type: MovementType, rank: number };
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						switch (data.type) {
							case MovementType.Pull: {
								let origin = combatant.combat.position;
								const originParameter = parameters.find(p => p.id === 'origin');
								if (originParameter && originParameter.value) {
									const originSquares = originParameter.value as { x: number, y: number }[];
									if (originSquares.length > 0) {
										origin = originSquares[0];
									}
								}
								const moveDistance = Random.dice(data.rank);
								for (let n = 0; n < moveDistance; ++n) {
									const distance = EncounterMapLogic.getDistance(origin, target.combat.position);
									const squares = EncounterLogic.getPossibleMoveSquares(encounter, target).filter(square => {
										return EncounterMapLogic.getDistance(origin, square) < distance;
									});
									if (squares.length > 0) {
										const square = Collections.draw(squares);
										target.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
										target.combat.position.x = square.x;
										target.combat.position.y = square.y;
									}
								}
								EncounterLogLogic.log(encounter, [
									EncounterLogLogic.combatant(target),
									EncounterLogLogic.text('has been pulled')
								]);
								break;
							}
							case MovementType.Push: {
								let origin = combatant.combat.position;
								const originParameter = parameters.find(p => p.id === 'origin');
								if (originParameter && originParameter.value) {
									const originSquares = originParameter.value as { x: number, y: number }[];
									if (originSquares.length > 0) {
										origin = originSquares[0];
									}
								}
								const moveDistance = Random.dice(data.rank);
								for (let n = 0; n < moveDistance; ++n) {
									const distance = EncounterMapLogic.getDistance(origin, target.combat.position);
									const squares = EncounterLogic.getPossibleMoveSquares(encounter, target).filter(square => {
										return EncounterMapLogic.getDistance(origin, square) > distance;
									});
									if (squares.length > 0) {
										const square = Collections.draw(squares);
										target.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
										target.combat.position.x = square.x;
										target.combat.position.y = square.y;
									}
								}
								EncounterLogLogic.log(encounter, [
									EncounterLogLogic.combatant(target),
									EncounterLogLogic.text('has been pushed')
								]);
								break;
							}
							case MovementType.Swap: {
								const currentX = combatant.combat.position.x;
								const currentY = combatant.combat.position.y;
								combatant.combat.position.x = target.combat.position.x;
								combatant.combat.position.y = target.combat.position.y;
								target.combat.position.x = currentX;
								target.combat.position.y = currentY;
								EncounterLogLogic.log(encounter, [
									EncounterLogLogic.combatant(combatant),
									EncounterLogLogic.text('and'),
									EncounterLogLogic.combatant(target),
									EncounterLogLogic.text('have swapped positions')
								]);
								break;
							}
							case MovementType.TowardsTarget: {
								const moveDistance = Random.dice(data.rank);
								for (let n = 0; n < moveDistance; ++n) {
									const distance = EncounterMapLogic.getDistance(combatant.combat.position, target.combat.position);
									const squares = EncounterLogic.getPossibleMoveSquares(encounter, combatant).filter(square => {
										return EncounterMapLogic.getDistance(target.combat.position, square) < distance;
									});
									if (squares.length > 0) {
										const square = Collections.draw(squares);
										combatant.combat.trail.push({ x: combatant.combat.position.x, y: combatant.combat.position.y });
										combatant.combat.position.x = square.x;
										combatant.combat.position.y = square.y;
									}
								}
								EncounterLogLogic.log(encounter, [
									EncounterLogLogic.combatant(combatant),
									EncounterLogLogic.text('has moved towards'),
									EncounterLogLogic.combatant(target)
								]);
								break;
							}
							case MovementType.BesideTarget: {
								const combatantSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
								const targetSquares = EncounterLogic.getCombatantSquares(encounter, target);
								const targetAdjacentSquares = EncounterMapLogic.getAdjacentSquares(encounter.mapSquares, targetSquares);
								if (combatantSquares.some(square => targetAdjacentSquares.find(s => (s.x === square.x) && (s.y === square.y)))) {
									EncounterLogLogic.log(encounter, [
										EncounterLogLogic.combatant(combatant),
										EncounterLogLogic.text('is already beside'),
										EncounterLogLogic.combatant(target)
									]);
								} else {
									const candidates = encounter.mapSquares.filter(square => {
										const squares = EncounterLogic.getCombatantSquares(encounter, combatant, square);
										const canMoveHere = squares.every(sq => EncounterLogic.getSquareIsEmpty(encounter, sq, [ combatant ]));
										const wouldBeAdjacent = squares.some(sq => targetAdjacentSquares.find(s => (s.x === sq.x) && (s.y === sq.y)));
										return canMoveHere && wouldBeAdjacent;
									});
									if (candidates.length > 0) {
										const square = Collections.draw(candidates);
										combatant.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
										combatant.combat.position.x = square.x;
										combatant.combat.position.y = square.y;
										EncounterLogLogic.log(encounter, [
											EncounterLogLogic.combatant(combatant),
											EncounterLogLogic.text('has moved to'),
											EncounterLogLogic.combatant(target)
										]);
									} else {
										EncounterLogLogic.log(encounter, [
											EncounterLogLogic.combatant(combatant),
											EncounterLogLogic.text('cannot move to'),
											EncounterLogLogic.combatant(target)
										]);
									}
								}
								break;
							}
							case MovementType.Random: {
								const moveDistance = Random.dice(data.rank);
								const squares = encounter.mapSquares
									.filter(square => EncounterMapLogic.getDistance(target.combat.position, square) <= moveDistance)
									.filter(square => EncounterLogic.getCombatantSquares(encounter, target, square).every(sq => EncounterLogic.getSquareIsEmpty(encounter, sq, [ target ])));
								if (squares.length > 0) {
									const square = Collections.draw(squares);
									target.combat.trail.push({ x: target.combat.position.x, y: target.combat.position.y });
									target.combat.position.x = square.x;
									target.combat.position.y = square.y;
								}
								EncounterLogLogic.log(encounter, [
									EncounterLogLogic.combatant(target),
									EncounterLogLogic.text('has been moved to a random square')
								]);
								break;
							}
						}
					});
				}
				break;
			}
			case 'moveSelfTo': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetSquares = targetParameter.value as { x: number, y: number }[];
					const candidates = targetSquares.filter(square => {
						return EncounterLogic.getCombatantSquares(encounter, combatant, square).every(sq => EncounterLogic.getSquareIsEmpty(encounter, sq, [ combatant ]));
					});
					if (candidates.length > 0) {
						const square = Collections.draw(candidates);
						combatant.combat.trail.push({ x: combatant.combat.position.x, y: combatant.combat.position.y });
						combatant.combat.position.x = square.x;
						combatant.combat.position.y = square.y;
					} else {
						EncounterLogLogic.log(encounter, [
							EncounterLogLogic.combatant(combatant),
							EncounterLogLogic.text('cannot move')
						]);
					}
				}
				break;
			}
			case 'disarm': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const items = target.items.filter(i => i.location === ItemLocationType.Hand);
						if (items.length > 0) {
							const item = Collections.draw(items);
							target.items = target.items.filter(i => i.id !== item.id);
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
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(target),
								EncounterLogLogic.text(`has lost ${item.name}`)
							]);
						} else {
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(target),
								EncounterLogLogic.text('is not holding anything')
							]);
						}
					});
				}
				break;
			}
			case 'steal': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const items = ([] as ItemModel[]).concat(target.items).concat(target.carried);
						if (items.length > 0) {
							const item = Collections.draw(items);
							target.items = target.items.filter(i => i.id !== item.id);
							target.carried = target.carried.filter(i => i.id !== item.id);
							combatant.carried.push(item);
							EncounterLogLogic.log(encounter, [
								EncounterLogLogic.combatant(combatant),
								EncounterLogLogic.text(`has stolen ${item.name} from`),
								EncounterLogLogic.combatant(target)
							]);
						}
					});
				}
				break;
			}
			case 'createTerrain': {
				const type = effect.data as EncounterMapSquareType;
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const squares = targetParameter.value as { x: number, y: number }[];
					squares.forEach(square => {
						const blob = EncounterMapLogic.getFloorBlob(encounter.mapSquares, square);
						blob.forEach(sq => sq.type = type);
					});
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.combatant(combatant),
						EncounterLogLogic.text(`has created an area of ${type.toLowerCase()} terrain`)
					]);
				}
				break;
			}
			case 'addSquares': {
				const targetParameter = parameters.find(p => p.id === 'targets');
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
					EncounterMapLogic.visibilityCache.reset();
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.combatant(combatant),
						EncounterLogLogic.text('has created map squares')
					]);
				}
				break;
			}
			case 'removeSquares': {
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const squares = targetParameter.value as { x: number, y: number }[];
					squares.forEach(square => {
						const blob = EncounterMapLogic.getFloorBlob(encounter.mapSquares, square).filter(sq => EncounterLogic.getSquareIsEmpty(encounter, sq));
						encounter.mapSquares = encounter.mapSquares.filter(sq => !blob.includes(sq));
					});
					EncounterMapLogic.visibilityCache.reset();
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.combatant(combatant),
						EncounterLogLogic.text('has destroyed map squares')
					]);
				}
				break;
			}
			case 'destroyWalls': {
				const targetParameter = parameters.find(p => p.id === 'targets');
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
					EncounterMapLogic.visibilityCache.reset();
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.combatant(combatant),
						EncounterLogLogic.text('has destroyed walls')
					]);
				}
				break;
			}
			case 'createPotion': {
				const potionID = effect.data as string;
				const targetParameter = parameters.find(p => p.id === 'targets');
				if (targetParameter) {
					const targetIDs = targetParameter.value as string[];
					targetIDs.forEach(id => {
						const target = EncounterLogic.getCombatant(encounter, id) as CombatantModel;
						const potion = GameLogic.getPotion(potionID) as ItemModel;
						const copy = JSON.parse(JSON.stringify(potion)) as ItemModel;
						copy.id = Utils.guid();
						target.carried.push(copy);
					});
				}
				break;
			}
			case 'summon': {
				const type = effect.data as SummonType;
				const list = [];
				switch (type) {
					case SummonType.Undead: {
						list.push(...MonsterSpeciesData.getList().filter(s => s.quirks.includes(QuirkType.Undead)).map(s => s.id));
						break;
					}
					case SummonType.Beast: {
						list.push(...MonsterSpeciesData.getList().filter(s => s.quirks.includes(QuirkType.Beast)).map(s => s.id));
						break;
					}
					case SummonType.Elemental: {
						list.push(...MonsterSpeciesData.getList().filter(s => s.name.toLowerCase().includes('elemental')).map(s => s.id));
						break;
					}
				}
				if (list.length > 0) {
					const speciesID = Collections.draw(list);
					const monster = Factory.createCombatant(CombatantType.Monster);
					CombatantLogic.applyCombatantCards(monster, speciesID, '', '');
					CombatantLogic.makeFeatureChoices(monster);
					CombatantLogic.addItems(monster, []);

					while (monster.level < combatant.level) {
						const featureDeck = CombatantLogic.getFeatureDeck(monster).filter(f => f.type !== FeatureType.Proficiency);
						CombatantLogic.incrementCombatantLevel(monster, Collections.draw(featureDeck), []);
						CombatantLogic.makeFeatureChoices(monster);
					}

					monster.faction = combatant.faction;
					monster.quirks.push(QuirkType.Drone);
					CombatantLogic.resetCombatant(monster);
					encounter.combatants.push(monster);
					EncounterGenerator.placeCombatants(encounter, Math.random);
					EncounterLogLogic.log(encounter, [
						EncounterLogLogic.combatant(combatant),
						EncounterLogLogic.text('has summoned'),
						EncounterLogLogic.combatant(monster)
					]);
				}
				break;
			}
		}
	};
}

export class ActionLogic {
	static getActionType = (action: ActionModel) => {
		return action.effects.some(e => e.id === 'attack') ? 'Attack' : 'Utility';
	};

	static getActionSpeed = (action: ActionModel) => {
		return action.effects.some(e => e.id === 'takeAnotherAction') ? 'Quick' : 'Full';
	};

	static getActionDescription = (action: ActionModel) => {
		return action.name;
	};

	static getParameterDescription = (parameter: ActionParameterModel) => {
		switch (parameter.id) {
			case 'origin': {
				const originParam = parameter as ActionOriginParameterModel;
				if (originParam.distance === 'weapon') {
					return 'Origin: within weapon range';
				}
				return `Origin: within ${originParam.distance} squares`;
			}
			case 'weapon': {
				const weaponParam = parameter as ActionWeaponParameterModel;
				return `Uses weapon: ${weaponParam.type}`;
			}
			case 'targets': {
				const targetParam = parameter as ActionTargetParameterModel;
				return `Target(s): ${ActionLogic.getTargetDescription(targetParam)}`;
			}
		}

		return '';
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

		let countAndType = `${count} ${type}`;
		if (target.targets && (target.targets.count === Number.MAX_VALUE) && (target.targets.type === ActionTargetType.Combatants)) {
			countAndType = 'everyone';
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
				str = `${countAndType} within ${target.range.radius} squares`;
				break;
			case ActionRangeType.Weapon:
				if (target.range.radius > 0) {
					str = `${countAndType} within weapon range +${target.range.radius}`;
				} else {
					str = `${countAndType} within weapon range`;
				}
				break;
		}

		return str;
	};

	static getActionRange = (action: ActionModel, combatant: CombatantModel) => {
		let range = 0;

		action.parameters.forEach(param => {
			if (param.id === 'targets') {
				const targetParam = param as ActionTargetParameterModel;
				switch (targetParam.range.type) {
					case ActionRangeType.Self: {
						range = 0;
						break;
					}
					case ActionRangeType.Adjacent: {
						range = 1;
						break;
					}
					case ActionRangeType.Burst: {
						range = targetParam.range.radius;
						break;
					}
					case ActionRangeType.Weapon: {
						const wpnParam = action.parameters.find(p => p.id === 'weapon') as ActionWeaponParameterModel;
						if (wpnParam && (wpnParam.value !== null)) {
							const itemID = wpnParam.value as string;
							const item = combatant.items.find(i => i.id === itemID);
							if (item && item.weapon) {
								range = item.weapon.range + targetParam.range.radius;
							}
						}
						break;
					}
				}
			}
		});

		return range;
	};

	static isParameterSet = (parameter: ActionParameterModel) => {
		let parameterSet = true;

		if (parameter.value) {
			switch (parameter.id) {
				case 'weapon': {
					const weaponParam = parameter as ActionWeaponParameterModel;
					parameterSet = !!weaponParam.value;
					break;
				}
				case 'origin': {
					const originParam = parameter as ActionOriginParameterModel;
					if (originParam.value) {
						const list = originParam.value as { x: number, y: number }[];
						parameterSet = list.length > 0;
					} else {
						parameterSet = false;
					}
					break;
				}
				case 'targets': {
					const targetParam = parameter as ActionTargetParameterModel;
					if (targetParam.targets) {
						switch (targetParam.targets.type) {
							case ActionTargetType.Combatants:
							case ActionTargetType.Enemies:
							case ActionTargetType.Allies: {
								const list = targetParam.value as string[];
								if (!list || (list.length === 0)) {
									parameterSet = false;
								}
								break;
							}
							case ActionTargetType.Squares: {
								const list = targetParam.value as { x: number, y: number }[];
								if (!list || (list.length === 0)) {
									parameterSet = false;
								}
								break;
							}
							case ActionTargetType.Walls: {
								const list = targetParam.value as { x: number, y: number }[];
								if (!list || (list.length === 0)) {
									parameterSet = false;
								}
								break;
							}
						}
					}
					break;
				}
			}
		} else {
			parameterSet = false;
		}

		return parameterSet;
	};

	static checkWeaponParameter = (parameter: ActionWeaponParameterModel, combatant: CombatantModel) => {
		const candidates: string[] = [];
		let value = parameter.value as string | null;

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
			.forEach(i => candidates.push(i.id));

		if ((value === null) || !candidates.includes(value)) {
			if (candidates.length > 0) {
				value = candidates[0];
			} else {
				value = null;
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
			const wpnParam = action.parameters.find(p => p.id === 'weapon') as ActionWeaponParameterModel;
			if (wpnParam && (wpnParam.value !== null)) {
				const itemID = wpnParam.value as string;
				const item = combatant.items.find(i => i.id === itemID);
				if (item && item.weapon) {
					radius = item.weapon.range;
				}
			}
		} else {
			radius = parameter.distance;
		}

		const edges = EncounterMapLogic.getMapEdges(encounter.mapSquares);
		const originSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
		candidates.push(
			...EncounterLogic.findSquares(encounter, EncounterLogic.getCombatantSquares(encounter, combatant), radius)
				.filter(sq => EncounterMapLogic.canSeeAny(edges, originSquares, [ sq ]))
		);
		if ((value === null) || (value.length === 0) || value.some(v => !candidates.includes(v))) {
			if (candidates.length > 0) {
				value = [ candidates[0] ];
			} else {
				value = [];
			}
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};

	static checkTargetParameter = (parameter: ActionTargetParameterModel, encounter: EncounterModel, combatant: CombatantModel, action: ActionModel, invertTargets: boolean) => {
		const candidates: (string | { x: number, y: number })[] = [];
		let value = parameter.value as (string | { x: number, y: number })[] ?? [];

		if (parameter.range.type === ActionRangeType.Self) {
			candidates.push(combatant.id);
			value = [ combatant.id ];
		} else {
			const radius = ActionLogic.getActionRange(action, combatant);

			let originSquares = EncounterLogic.getCombatantSquares(encounter, combatant);
			const originParam = action.parameters.find(p => p.id === 'origin');
			if (originParam) {
				originSquares = originParam.value as { x: number, y: number }[];
			}

			if (parameter.targets) {
				const edges = EncounterMapLogic.getMapEdges(encounter.mapSquares);
				switch (parameter.targets.type) {
					case ActionTargetType.Combatants:
						candidates.push(
							...EncounterLogic.findCombatants(encounter, originSquares, radius)
								.filter(c => c.id !== combatant.id)
								.filter(c => c.combat.state !== CombatantState.Dead)
								.filter(c => combatant.combat.senses >= c.combat.hidden)
								.filter(c => EncounterMapLogic.canSeeAny(edges, originSquares, EncounterLogic.getCombatantSquares(encounter, c)))
								.sort((a, b) => {
									const squaresCombatant = EncounterLogic.getCombatantSquares(encounter, combatant);
									const squaresA = EncounterLogic.getCombatantSquares(encounter, a);
									const squaresB = EncounterLogic.getCombatantSquares(encounter, b);
									const distanceA = EncounterMapLogic.getDistanceAny(squaresA, squaresCombatant);
									const distanceB = EncounterMapLogic.getDistanceAny(squaresB, squaresCombatant);
									return distanceA - distanceB;
								})
								.map(c => c.id)
						);
						break;
					case ActionTargetType.Enemies:
						candidates.push(
							...EncounterLogic.findCombatants(encounter, originSquares, radius)
								.filter(c => c.id !== combatant.id)
								.filter(c => c.combat.state !== CombatantState.Dead)
								.filter(c => combatant.combat.senses >= c.combat.hidden)
								.filter(c => invertTargets ? (c.faction === combatant.faction) : (c.faction !== combatant.faction))
								.filter(c => EncounterMapLogic.canSeeAny(edges, originSquares, EncounterLogic.getCombatantSquares(encounter, c)))
								.sort((a, b) => {
									const squaresCombatant = EncounterLogic.getCombatantSquares(encounter, combatant);
									const squaresA = EncounterLogic.getCombatantSquares(encounter, a);
									const squaresB = EncounterLogic.getCombatantSquares(encounter, b);
									const distanceA = EncounterMapLogic.getDistanceAny(squaresA, squaresCombatant);
									const distanceB = EncounterMapLogic.getDistanceAny(squaresB, squaresCombatant);
									return distanceA - distanceB;
								})
								.map(c => c.id)
						);
						break;
					case ActionTargetType.Allies:
						candidates.push(
							...EncounterLogic.findCombatants(encounter, originSquares, radius)
								.filter(c => c.id !== combatant.id)
								.filter(c => c.combat.state !== CombatantState.Dead)
								.filter(c => invertTargets ? (c.faction !== combatant.faction) : (c.faction === combatant.faction))
								.filter(c => EncounterMapLogic.canSeeAny(edges, originSquares, EncounterLogic.getCombatantSquares(encounter, c)))
								.sort((a, b) => {
									const squaresCombatant = EncounterLogic.getCombatantSquares(encounter, combatant);
									const squaresA = EncounterLogic.getCombatantSquares(encounter, a);
									const squaresB = EncounterLogic.getCombatantSquares(encounter, b);
									const distanceA = EncounterMapLogic.getDistanceAny(squaresA, squaresCombatant);
									const distanceB = EncounterMapLogic.getDistanceAny(squaresB, squaresCombatant);
									return distanceA - distanceB;
								})
								.map(c => c.id)
						);
						break;
					case ActionTargetType.Squares:
						candidates.push(
							...EncounterLogic.findSquares(encounter, originSquares, radius)
								.filter(sq => EncounterMapLogic.canSeeAny(edges, originSquares, [ sq ]))
								.sort((a, b) => {
									const distanceA = EncounterMapLogic.getDistance(a, combatant.combat.position);
									const distanceB = EncounterMapLogic.getDistance(b, combatant.combat.position);
									return distanceA - distanceB;
								})
						);
						break;
					case ActionTargetType.Walls:
						candidates.push(
							...EncounterLogic.findWalls(encounter, originSquares, radius)
								.sort((a, b) => {
									const distanceA = EncounterMapLogic.getDistance(a, combatant.combat.position);
									const distanceB = EncounterMapLogic.getDistance(b, combatant.combat.position);
									return distanceA - distanceB;
								})
						);
						break;
				}

				if (parameter.targets.count === Number.MAX_VALUE) {
					value = [ ...candidates ];
				} else {
					if ((value.length === 0) || value.some(v => !candidates.includes(v))) {
						value = [ ...candidates.slice(0, parameter.targets.count) ];
					}
				}
			}
		}

		parameter.candidates = candidates;
		parameter.value = value;
	};
}
