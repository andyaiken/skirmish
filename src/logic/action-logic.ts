import { ActionRangeType } from '../enums/action-range-type';
import { ActionTargetType } from '../enums/action-target-type';
import { DamageType } from '../enums/damage-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ActionAttackModel, ActionEffectModel, ActionPrerequisiteModel, ActionTargetModel } from '../models/action';
import { CombatantLogic } from './combatant-logic';

export class ActionLogic {
	///////////////////////////////////////////////////////////////////////////
	// Prerequisites

	static prerequisiteEmptyHand = (): ActionPrerequisiteModel => {
		return {
			name: 'Requires free hand',
			satisfied: (game, combatant, action) => {
				const slotsUsed = combatant.items
					.filter(i => i.location === ItemLocationType.Hand)
					.map(i => i.slots)
					.reduce((sum, value) => sum + value, 0);
				return slotsUsed < 2;
			}
		};
	};

	static prerequisiteWeapon = (): ActionPrerequisiteModel => {
		return {
			name: 'Requires weapon',
			satisfied: (game, combatant, action) => {
				const proficiencies = CombatantLogic.getProficiencies(combatant);
				return combatant.items.some(i => !!i.weapon && proficiencies.includes(i.proficiency));
			}
		};
	};

	static prerequisiteImplement = (): ActionPrerequisiteModel => {
		return {
			name: 'Requires implement',
			satisfied: (game, combatant, action) => {
				return combatant.items.some(i => i.proficiency === ItemProficiencyType.Implements) && CombatantLogic.getProficiencies(combatant).includes(ItemProficiencyType.Implements);
			}
		};
	};

	///////////////////////////////////////////////////////////////////////////
	// Targets

	static targetSelf = (): ActionTargetModel => {
		return {
			range: {
				type: ActionRangeType.Self,
				radius: 0,
				distance: 0
			},
			targets: null
		};
	};

	static targetAdjacent = (type: ActionTargetType, count: number): ActionTargetModel => {
		return {
			range: {
				type: ActionRangeType.Adjacent,
				radius: 0,
				distance: 0
			},
			targets: {
				type: type,
				count: count
			}
		};
	};

	static targetBurst = (type: ActionTargetType, count: number, radius: number): ActionTargetModel => {
		return {
			range: {
				type: ActionRangeType.Burst,
				radius: radius,
				distance: 0
			},
			targets: {
				type: type,
				count: count
			}
		};
	};

	static targetWeapon = (type: ActionTargetType, count: number, radius: number): ActionTargetModel => {
		return {
			range: {
				type: ActionRangeType.Weapon,
				radius: radius,
				distance: 0
			},
			targets: {
				type: type,
				count: count
			}
		};
	};

	static targetArea = (type: ActionTargetType, count: number, radius: number, distance: number): ActionTargetModel => {
		return {
			range: {
				type: ActionRangeType.Area,
				radius: radius,
				distance: distance
			},
			targets: {
				type: type,
				count: count
			}
		};
	};

	///////////////////////////////////////////////////////////////////////////
	// Effects

	static effectSelectTargets = (): ActionEffectModel => {
		return {
			name: 'Select target(s)',
			execute: (game, combatant, action) => {
				// TODO: Select target(s)
				// Store this data
			}
		};
	};

	static effectSelectWeapon = (): ActionEffectModel => {
		return {
			name: 'Select weapon',
			execute: (game, combatant, action) => {
				// TODO: Select weapon
				// Store this data
			}
		};
	};

	static effectSelectImplement = (): ActionEffectModel => {
		return {
			name: 'Select implement',
			execute: (game, combatant, action) => {
				// TODO: Select implement
				// Store this data
			}
		};
	};

	static effectDamage = (type: DamageType, rank: number): ActionEffectModel => {
		return {
			name: 'Damage',
			execute: (game, combatant, action) => {
				// TODO: Damage
			}
		};
	};

	static effectHealDamage = (): ActionEffectModel => {
		return {
			name: 'Heal damage',
			execute: (game, combatant, action) => {
				// TODO: Heal damage
			}
		};
	};

	static effectHealWounds = (): ActionEffectModel => {
		return {
			name: 'Heal wounds',
			execute: (game, combatant, action) => {
				// TODO: Heal wounds
			}
		};
	};

	static effectAddCondition = (): ActionEffectModel => {
		return {
			name: 'Add condition',
			execute: (game, combatant, action) => {
				// TODO: Add condition
			}
		};
	};

	static effectRemoveCondition = (): ActionEffectModel => {
		return {
			name: 'Remove condition',
			execute: (game, combatant, action) => {
				// TODO: Remove condition
			}
		};
	};

	static effectMove = (): ActionEffectModel => {
		return {
			name: 'Move',
			execute: (game, combatant, action) => {
				// TODO: Move
			}
		};
	};

	static effectMakeAttack = (): ActionEffectModel => {
		return {
			name: 'Make attack',
			execute: (game, combatant, action) => {
				// TODO: Make attack
			}
		};
	};

	///////////////////////////////////////////////////////////////////////////

	static attack = (skill: SkillType, trait: TraitType, skillBonus = 0, traitBonus = 0): ActionAttackModel => {
		return {
			skill: skill,
			skillBonus: skillBonus,
			trait: trait,
			traitBonus: traitBonus
		};
	};

	///////////////////////////////////////////////////////////////////////////
}
