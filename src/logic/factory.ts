import { CombatDataState } from '../enums/combat-data-state';
import { CombatantType } from '../enums/combatant-type';

import type { AuraModel } from '../models/aura';
import type { CombatDataModel } from '../models/combat-data';
import type { CombatantModel } from '../models/combatant';
import type { FeatureModel } from '../models/feature';
import type { GameModel } from '../models/game';

import { Utils } from '../utils/utils';

import { CampaignMapLogic } from './campaign-map-logic';

export class Factory {
	static createAura = (feature: FeatureModel) => {
		const aura: AuraModel = {
			id: Utils.guid(),
			type: feature.aura,
			damage: feature.damage,
			DamageCategoryType: feature.DamageCategoryType,
			rank: feature.rank
		};
		return aura;
	};

	static createCombatData = (combatant: CombatantModel): CombatDataModel => {
		return {
			id: combatant.id,
			type: combatant.type,
			size: combatant.size,
			state: CombatDataState.Standing,
			position: {
				x: 0,
				y: 0
			},
			damage: 0,
			wounds: 0,
			initiative: Number.MIN_VALUE,
			movement: 0,
			senses: 0,
			hidden: 0,
			conditions: [],
			actions: []
		};
	};

	static createCombatant = (type: CombatantType): CombatantModel => {
		return {
			id: Utils.guid(),
			type: type,
			name: '',
			speciesID: '',
			roleID: '',
			backgroundID: '',
			size: 1,
			level: 1,
			xp: 0,
			features: [],
			items: []
		};
	};

	static createGame = (): GameModel => {
		return {
			heroes: [
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero)
			],
			items: [],
			boons: [],
			map: CampaignMapLogic.generateCampaignMap(),
			encounter: null
		};
	};
}
