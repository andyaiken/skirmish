import { CombatantType } from '../enums/combatant-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { TraitType } from '../enums/trait-type';
import { TrapType } from '../enums/trap-type';

import type { TrapModel } from '../models/encounter';

import { Utils } from '../utils/utils';

import { ActionEffects } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';

// A trap's payload is an ordinary list of action effects, so a trap can do anything a card can do
// and needs no resolution code of its own
export class TrapData {
	static getTrapTypes = () => {
		return [
			TrapType.Spike,
			TrapType.Fire,
			TrapType.PoisonGas,
			TrapType.AcidDart
		];
	};

	static getName = (type: TrapType) => {
		switch (type) {
			case TrapType.Spike:
				return 'Spike Pit';
			case TrapType.Fire:
				return 'Flame Jet';
			case TrapType.PoisonGas:
				return 'Gas Vent';
			case TrapType.AcidDart:
				return 'Dart Trap';
		}
	};

	static getDescription = (type: TrapType) => {
		switch (type) {
			case TrapType.Spike:
				return 'A covered pit, lined with sharpened stakes.';
			case TrapType.Fire:
				return 'A pressure plate wired to a reservoir of oil.';
			case TrapType.PoisonGas:
				return 'A hairline crack in the floor, breathing something sour.';
			case TrapType.AcidDart:
				return 'A row of holes at ankle height, and something waiting behind them.';
		}
	};

	static getEffects = (type: TrapType) => {
		switch (type) {
			case TrapType.Spike:
				return [
					ActionEffects.dealDamage(DamageType.Piercing, 4),
					ActionEffects.knockDown()
				];
			case TrapType.Fire:
				return [
					ActionEffects.dealDamage(DamageType.Fire, 5)
				];
			case TrapType.PoisonGas:
				return [
					ActionEffects.dealDamage(DamageType.Poison, 3),
					ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 4, TraitType.Endurance))
				];
			case TrapType.AcidDart:
				return [
					ActionEffects.dealDamage(DamageType.Acid, 4),
					ActionEffects.addCondition(ConditionLogic.createDamageCategoryVulnerabilityCondition(TraitType.Endurance, 4, DamageCategoryType.Corruption))
				];
		}
	};

	// Position and hidden score belong to the trap's place on the map, so the caller sets them
	static createTrap = (type: TrapType, setBy: CombatantType): TrapModel => {
		return {
			id: Utils.guid(),
			name: TrapData.getName(type),
			type: type,
			setBy: setBy,
			position: { x: 0, y: 0 },
			hidden: 0,
			effects: TrapData.getEffects(type),
			armed: true
		};
	};
}
