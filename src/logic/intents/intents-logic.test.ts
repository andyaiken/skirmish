import { describe, expect, it } from 'vitest';

import { outOfTheGrave } from '../../data/packs/out-of-the-grave';

import { CombatantType } from '../../enums/combatant-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';

import type { ActionModel } from '../../models/action';
import type { EncounterModel } from '../../models/encounter';

import { EncounterMapLogic } from '../encounter-map/encounter-map-logic';
import { Factory } from '../factory/factory';
import { IntentsLogic } from './intents-logic';
import { PathLogic } from '../path/path-logic';

// A square open map, big enough for a combatant to move in every direction.
const createEncounter = (width = 7, height = 7): EncounterModel => {
	const mapSquares = [];
	for (let x = 0; x < width; ++x) {
		for (let y = 0; y < height; ++y) {
			mapSquares.push({ x: x, y: y, type: EncounterMapSquareType.Clear });
		}
	}

	EncounterMapLogic.visibilityCache.reset();

	return {
		regionID: '',
		packIDs: [],
		round: 0,
		combatants: [],
		loot: [],
		traps: [],
		mapSquares: mapSquares,
		log: []
	};
};

const addCombatant = (encounter: EncounterModel, type: CombatantType, x: number, y: number, movement: number) => {
	const combatant = Factory.createCombatant(type);
	combatant.combat.position = { x: x, y: y };
	combatant.combat.movement = movement;
	encounter.combatants.push(combatant);
	return combatant;
};

const getWraithAction = (id: string) => {
	const wraith = outOfTheGrave().species.find(s => s.id === 'species-wraith');
	return JSON.parse(JSON.stringify(wraith?.actions.find(a => a.id === id))) as ActionModel;
};

describe('IntentsLogic.getCombatantTargetIntents', () => {
	const getIntents = (movement: number) => {
		const encounter = createEncounter();
		const monster = addCombatant(encounter, CombatantType.Monster, 3, 3, movement);
		addCombatant(encounter, CombatantType.Hero, 4, 3, 0);

		const action = getWraithAction('wraith-action-2');
		const paths = PathLogic.findPaths(encounter, monster, true);
		const edges = EncounterMapLogic.getMapEdges(encounter.mapSquares);
		return IntentsLogic.getCombatantTargetIntents(encounter, monster, action, CombatantType.Hero, paths, edges);
	};

	it('acts from where it stands when it cannot move', () => {
		const intents = getIntents(0);
		expect(intents).toHaveLength(1);
		expect(intents[0].intents.map(i => i.id)).toEqual([ 'action' ]);
	});

	it('does not move when it is already in range', () => {
		const intents = getIntents(4);
		expect(intents).toHaveLength(1);
		expect(intents[0].intents.map(i => i.id)).toEqual([ 'action' ]);
	});
});

describe('IntentsLogic.getSquareTargetIntents', () => {
	it('targets squares from where it stands when it cannot move', () => {
		const encounter = createEncounter();
		const monster = addCombatant(encounter, CombatantType.Monster, 3, 3, 0);

		const action = getWraithAction('wraith-action-3');
		const paths = PathLogic.findPaths(encounter, monster, true);
		const edges = EncounterMapLogic.getMapEdges(encounter.mapSquares);
		const intents = IntentsLogic.getSquareTargetIntents(encounter, monster, action, paths, edges);

		expect(intents).toHaveLength(encounter.mapSquares.length);
		intents.forEach(intent => expect(intent.intents.map(i => i.id)).toEqual([ 'action' ]));
	});
});
