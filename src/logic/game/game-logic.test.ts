import { describe, expect, it } from 'vitest';

import { ActionEffects, ActionTargetParameters } from '../action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { ConditionLogic } from '../condition/condition-logic';
import { DamageType } from '../../enums/damage-type';
import { GameLogic } from '../game/game-logic';
import { PackLogic } from '../pack/pack-logic';
import { StrongholdLogic } from '../stronghold/stronghold-logic';
import { TraitType } from '../../enums/trait-type';

import type { ActionModel } from '../../models/action';
import type { ConditionModel } from '../../models/condition';

const packs = () => PackLogic.getAllPacks();
const heroSpecies = () => packs().flatMap(pack => PackLogic.getHeroSpecies(pack.id));
const monsterSpecies = () => packs().flatMap(pack => PackLogic.getMonsterSpecies(pack.id));
const roles = () => packs().flatMap(pack => PackLogic.getRoles(pack.id));
const backgrounds = () => packs().flatMap(pack => PackLogic.getBackgrounds(pack.id));

// These are the balance gates described in specs/README.md. They are ranges
// rather than exact values so that adding a card in band does not break them,
// but a card well outside the band does.
describe('card strength', () => {
	it('scores every hero species in the 5 to 6 band', () => {
		heroSpecies().forEach(species => {
			const strength = GameLogic.getSpeciesStrength(species);
			expect(strength, species.name).toBeGreaterThanOrEqual(5);
			expect(strength, species.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every monster species in the 4 to 6 band', () => {
		monsterSpecies().forEach(species => {
			const strength = GameLogic.getSpeciesStrength(species);
			expect(strength, species.name).toBeGreaterThanOrEqual(4);
			expect(strength, species.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every role in the 4 to 6 band', () => {
		roles().forEach(role => {
			const strength = GameLogic.getRoleStrength(role);
			expect(strength, role.name).toBeGreaterThanOrEqual(4);
			expect(strength, role.name).toBeLessThanOrEqual(6);
		});
	});

	it('scores every background in the 3 to 4 band', () => {
		backgrounds().forEach(background => {
			const strength = GameLogic.getBackgroundStrength(background);
			expect(strength, background.name).toBeGreaterThanOrEqual(3);
			expect(strength, background.name).toBeLessThanOrEqual(4);
		});
	});

	// Luckweaver is the one role below the 5 to 6 band. If this ever fails it is
	// because the role was rebalanced, and the band above can be tightened to
	// 5 to 6.
	it('has Luckweaver as the only role below 5', () => {
		const below = roles().filter(r => GameLogic.getRoleStrength(r) < 5).map(r => r.name);
		expect(below).toEqual([ 'Luckweaver' ]);
	});
});

const allCards = () => [
	...heroSpecies(),
	...monsterSpecies(),
	...roles(),
	...backgrounds()
];

describe('structures', () => {
	// rechargeStructure sets charges = level, so a chargeable structure at level 0 can
	// never hold a charge and its benefit is unreachable. Only the Barracks and the
	// Warehouse are meant to be uncharged.
	it('gives every chargeable structure a level of at least 1', () => {
		packs().forEach(pack => {
			PackLogic.getStructures(pack.id)
				.filter(structure => StrongholdLogic.canCharge(structure))
				.forEach(structure => {
					expect(structure.level, structure.name).toBeGreaterThanOrEqual(1);
				});
		});
	});
});

describe('card registration', () => {
	it('gives every card a unique ID', () => {
		const ids = allCards().map(c => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('gives every feature and action a unique ID', () => {
		const ids = allCards().flatMap(card => [
			...card.startingFeatures.map(f => f.id),
			...card.features.map(f => f.id),
			...card.actions.map(a => a.id)
		]);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('contagion and card strength', () => {
	const action = (condition: ConditionModel): ActionModel => ({
		id: 'test-action',
		name: 'Test',
		prerequisites: [],
		parameters: [ ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5) ],
		effects: [ ActionEffects.addCondition(condition) ]
	});

	it('scores a contagious condition above the same condition without it', () => {
		const plain = GameLogic.getActionStrength(action(
			ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 4, DamageType.Decay)
		));
		const catching = GameLogic.getActionStrength(action(
			ConditionLogic.makeContagious(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 4, DamageType.Decay))
		));

		expect(catching).toBeGreaterThan(plain);
	});

	it('keeps every contagious card inside its band', () => {
		const contagious = (card: { actions: ActionModel[] }) => JSON.stringify(card.actions).includes('"contagious":true');

		packs().forEach(pack => {
			PackLogic.getRoles(pack.id).filter(contagious).forEach(role => {
				const strength = GameLogic.getRoleStrength(role);
				expect(strength, role.name).toBeGreaterThanOrEqual(4);
				expect(strength, role.name).toBeLessThanOrEqual(6);
			});
			PackLogic.getMonsterSpecies(pack.id).filter(contagious).forEach(species => {
				const strength = GameLogic.getSpeciesStrength(species);
				expect(strength, species.name).toBeGreaterThanOrEqual(4);
				expect(strength, species.name).toBeLessThanOrEqual(6);
			});
		});
	});
});
