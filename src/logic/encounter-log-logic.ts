import { LogPartType } from '../enums/log-part-type';

import { EncounterLogic } from './encounter-logic';

import type { EncounterModel, LogMessageModel, LogPartModel } from '../models/encounter';
import type { CombatantModel } from '../models/combatant';

import { Utils } from '../utils/utils';

export class EncounterLogLogic {
	static combatant = (combatant: CombatantModel) => {
		return {
			type: LogPartType.Combatant,
			data: combatant.id
		};
	};

	static rank = (name: string, rank: number) => {
		return {
			type: LogPartType.Rank,
			data: `${name} (${rank})`
		};
	};

	static result = (value: number) => {
		return {
			type: LogPartType.Result,
			data: value.toString()
		};
	};

	static text = (text: string) => {
		return {
			type: LogPartType.Text,
			data: text
		};
	};

	static log = (encounter: EncounterModel, parts: LogPartModel[], notify = false) => {
		const message: LogMessageModel = {
			id: Utils.guid(),
			timestamp: Date.now(),
			parts: parts
		};

		// Add this message to the TOP of the log
		encounter.log.unshift(message);

		if (notify) {
			EncounterLogLogic.logMessages.push(message);

			if (EncounterLogLogic.logTimeout) {
				clearTimeout(EncounterLogLogic.logTimeout);
				EncounterLogLogic.logTimeout = null;
			}

			EncounterLogLogic.logTimeout = setTimeout(() => {
				if (EncounterLogLogic.handleLogMessage) {
					EncounterLogLogic.handleLogMessage(EncounterLogLogic.logMessages);
					EncounterLogLogic.logMessages = [];
				}
			}, 250);
		}
	};

	static logState = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogLogic.log(encounter, [
			EncounterLogLogic.combatant(combatant),
			EncounterLogLogic.text(`is ${combatant.combat.state}`)
		], true);
	};

	static getLogMessage = (encounter: EncounterModel, message: LogMessageModel) => {
		if (!encounter) {
			return '';
		}

		return message.parts
			.map(m => {
				switch (m.type) {
					case LogPartType.Combatant: {
						const combatant = EncounterLogic.getCombatant(encounter, m.data);
						return combatant ? combatant.name : '[unknown combatant]';
					}
				}

				return m.data;
			})
			.join(' ');
	};

	static logMessages: LogMessageModel[] = [];
	static logTimeout: NodeJS.Timeout | null = null;
	static handleLogMessage: ((messages: LogMessageModel[]) => void) | null = null;
}
