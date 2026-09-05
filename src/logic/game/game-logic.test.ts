import { describe, expect, it } from 'vitest';

import { ActionEffects, ActionTargetParameters } from '../action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { ConditionLogic } from '../condition/condition-logic';
import { ContagionType } from '../../enums/contagion-type';
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
	const inBand = (name: string, strength: number, band: { min: number, max: number }) => {
		expect(strength, name).toBeGreaterThanOrEqual(band.min);
		expect(strength, name).toBeLessThanOrEqual(band.max);
	};

	// The tests below read the bands rather than repeating them, which keeps them honest against the
	// backstage card page - but it also means widening a band would quietly make them pass. This
	// pins the numbers, so moving one is a deliberate edit to a test that names it.
	it('uses the bands the cards were balanced against', () => {
		expect(GameLogic.strengthBands).toEqual({
			heroSpecies: { min: 5, max: 6 },
			monsterSpecies: { min: 4, max: 6 },
			role: { min: 5, max: 6 },
			background: { min: 3, max: 4 },
			action: { min: 1, max: 12 }
		});
	});

	it('scores every hero species in band', () => {
		heroSpecies().forEach(s => inBand(s.name, GameLogic.getSpeciesStrength(s), GameLogic.strengthBands.heroSpecies));
	});

	it('scores every monster species in band', () => {
		monsterSpecies().forEach(s => inBand(s.name, GameLogic.getSpeciesStrength(s), GameLogic.strengthBands.monsterSpecies));
	});

	// The role band was tightened from 4-6 once the Luckweaver was brought up; it was the only role
	// below 5, and the band had been left loose to accommodate it
	it('scores every role in band', () => {
		roles().forEach(r => inBand(r.name, GameLogic.getRoleStrength(r), GameLogic.strengthBands.role));
	});

	it('scores every background in band', () => {
		backgrounds().forEach(b => inBand(b.name, GameLogic.getBackgroundStrength(b), GameLogic.strengthBands.background));
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

	// The backstage card page marks a card red when any single action scores outside 1-12
	// (card-page.tsx, getMarked). The card-level bands above cannot catch this: they average a
	// card's actions, so one spiking action hides inside four ordinary ones
	it('keeps every action inside the band the backstage view enforces', () => {
		const offenders: string[] = [];
		const check = (owner: string, actions: ActionModel[]) => {
			actions.forEach(action => {
				const strength = GameLogic.getActionStrength(action);
				const band = GameLogic.strengthBands.action;
				if ((strength < band.min) || (strength > band.max)) {
					offenders.push(`${owner} - ${action.name} (${strength})`);
				}
			});
		};

		packs().forEach(pack => {
			[ ...PackLogic.getHeroSpecies(pack.id), ...PackLogic.getMonsterSpecies(pack.id) ].forEach(species => {
				check(species.name, species.actions);
				check(species.name, species.deathActions);
			});
			PackLogic.getRoles(pack.id).forEach(role => check(role.name, role.actions));
			PackLogic.getBackgrounds(pack.id).forEach(background => check(background.name, background.actions));
		});

		expect(offenders).toEqual([]);
	});

	it('keeps every contagious card inside its band', () => {
		const contagious = (card: { actions: ActionModel[], deathActions?: ActionModel[] }) => {
			const json = JSON.stringify([ ...card.actions, ...(card.deathActions ?? []) ]);
			return [ ContagionType.All, ContagionType.Allies, ContagionType.Enemies ]
				.some(type => json.includes(`"contagion":"${type}"`));
		};

		// The filter above is only worth anything if it actually matches cards
		const matched = packs().flatMap(pack => [
			...PackLogic.getRoles(pack.id).filter(contagious),
			...PackLogic.getMonsterSpecies(pack.id).filter(contagious)
		]);
		expect(matched.length).toBeGreaterThan(0);

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
