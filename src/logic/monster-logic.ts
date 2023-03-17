import { EncounterLogic } from './encounter-logic';

import type { ActionModel } from '../models/action';
import type { CombatantModel } from '../models/combatant';
import type { EncounterModel } from '../models/encounter';
import type { IntentModel } from '../models/intent';

export class Intents {
	static endTurn = (): IntentModel => {
		return {
			name: 'end-turn',
			description: 'End Turn',
			data: null
		};
	};

	static hide = (): IntentModel => {
		return {
			name: 'hide',
			description: 'Hide',
			data: null
		};
	};

	static move = (dir: string): IntentModel => {
		return {
			name: 'move',
			description: 'Move',
			data: dir
		};
	};

	static action = (action: ActionModel): IntentModel => {
		return {
			name: 'move',
			description: `Use ${action.name}`,
			data: action
		};
	};
}

export class MonsterLogic {
	static getIntent = (): IntentModel => {
		// TODO: Decide on an intent

		// The options are:
		// * move (if we want to escape to safety or move to attack; specify direction)
		// * hide (if we're good at hiding)
		// * use an action (if we haven't already; if we satisfy prequisites; specify action but set parameters first)
		// * end turn (if there's nothing else we want to do)

		return Intents.endTurn();
	};

	static performIntent = (encounter: EncounterModel, combatant: CombatantModel, intent: IntentModel): IntentModel => {
		switch (intent.name) {
			case 'end-turn': {
				EncounterLogic.endTurn(encounter);
				break;
			}
			case 'hide': {
				EncounterLogic.hide(encounter, combatant);
				break;
			}
			case 'move': {
				const dir = intent.data as string;
				const cost = EncounterLogic.getMoveCost(encounter, combatant, dir);
				if (cost !== Number.MAX_VALUE) {
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

		return MonsterLogic.getIntent();
	};
}
