import { describe, expect, it } from 'vitest';

import { ActionEffects, ActionTargetParameters } from '../action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CardType } from '../../enums/card-type';
import { ConditionLogic } from '../condition/condition-logic';
import { ContagionType } from '../../enums/contagion-type';
import { DamageType } from '../../enums/damage-type';
import { GameLogic } from '../game/game-logic';

import type { BalanceCardModel } from '../game/game-logic';
import { PackLogic } from '../pack/pack-logic';
import { StrongholdLogic } from '../stronghold/stronghold-logic';
import { TraitType } from '../../enums/trait-type';

import type { ActionModel } from '../../models/action';
import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';

const packs = () => PackLogic.getAllPacks();
const heroSpecies = () => packs().flatMap(pack => PackLogic.getHeroSpecies(pack.id));
const monsterSpecies = () => packs().flatMap(pack => PackLogic.getMonsterSpecies(pack.id));
const roles = () => packs().flatMap(pack => PackLogic.getRoles(pack.id));
const backgrounds = () => packs().flatMap(pack => PackLogic.getBackgrounds(pack.id));

// The balance gates. Every one of these goes through GameLogic.getBalanceIssues, which is the same
// call the backstage card page makes to decide whether to draw a card red - so a card cannot show
// green in that view and fail here, or the other way round.
//
// The card-strength band is currently commented out in getBalanceIssues, so what these enforce is
// the action-count minimums and the per-action band. Re-enabling it there turns it on here too,
// with no change needed in this file
describe('card balance', () => {
	const issues = (cards: BalanceCardModel[], type: CardType) => cards.flatMap(card => GameLogic.getBalanceIssues(card, type));

	// The tests read the minimums rather than repeating them, which keeps them honest against the
	// view - but it also means lowering one would quietly make them pass. This pins the numbers, so
	// moving one is a deliberate edit to a test that names it
	it('uses the thresholds the cards were balanced against', () => {
		expect(GameLogic.actionCountMinimums).toEqual({
			species: 3,
			role: 5,
			background: 3
		});

		expect(GameLogic.strengthBands.action).toEqual({ min: 1, max: 12 });
	});

	it('gives every species enough actions, and keeps each one in band', () => {
		expect(issues([ ...heroSpecies(), ...monsterSpecies() ], CardType.Species)).toEqual([]);
	});

	it('gives every role enough actions, and keeps each one in band', () => {
		expect(issues(roles(), CardType.Role)).toEqual([]);
	});

	it('gives every background enough actions, and keeps each one in band', () => {
		expect(issues(backgrounds(), CardType.Background)).toEqual([]);
	});

	// A species' death action is checked against the action band too, but it does not count towards
	// the minimum - a card cannot rely on something that only happens once it is dead
	it('holds death actions to the action band as well', () => {
		const withDeathActions = [ ...heroSpecies(), ...monsterSpecies() ].filter(s => s.deathActions.length > 0);
		expect(withDeathActions.length).toBeGreaterThan(0);
		expect(issues(withDeathActions, CardType.Species)).toEqual([]);
	});
});

const allCards = () => [
	...heroSpecies(),
	...monsterSpecies(),
	...roles(),
	...backgrounds()
];

// Armour carries its features on `armor.features` rather than on the item itself, so anything
// checking item features has to look in both places
const allItems = () => packs().flatMap(pack => [
	...PackLogic.getItems(pack.id),
	...PackLogic.getPotions(pack.id),
	...PackLogic.getScrolls(pack.id)
]);

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

	it('gives every action a unique ID', () => {
		const ids = allCards().flatMap(card => card.actions.map(a => a.id));
		expect(new Set(ids).size).toBe(ids.length);
	});

	// A feature ID is the key its card is rendered with and the handle it is looked up by, so two
	// features sharing one is a real defect. Items were outside this check until the Breastplate
	// turned out to be carrying the Brigandine Armor's IDs, copied along with its stat block -
	// harmless only because both are body armour and nobody can wear both at once
	it('gives every feature a unique ID, items included', () => {
		const owners = new Map<string, string[]>();
		const note = (id: string, owner: string) => owners.set(id, [ ...(owners.get(id) ?? []), owner ]);

		allCards().forEach(card => [ ...card.startingFeatures, ...card.features ].forEach(f => note(f.id, card.name)));
		allItems().forEach(item => [ ...(item.armor ? item.armor.features : []), ...item.features ].forEach(f => note(f.id, item.name)));

		// named rather than counted, so a failure says which cards are fighting over which ID
		const shared = [ ...owners.entries() ]
			.filter(([ , names ]) => names.length > 1)
			.map(([ id, names ]) => `${id} is used by ${names.join(' and ')}`);
		expect(shared).toEqual([]);
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

	// GameLogic.getBalanceIssues marks a card when any single action scores outside 1-12, and the
	// tests above go through it, so this is covered per card. It is kept because it says the thing
	// plainly: the card-level bands average a card's actions, so one spiking action hides inside
	// four ordinary ones, and this fails on the action rather than on the card holding it
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

		// Checked through getBalanceIssues rather than against numbers written out here, so this keeps
		// following the bands as they move - the old literals were from a scale that no longer exists
		expect(packs().flatMap(pack => PackLogic.getRoles(pack.id).filter(contagious))
			.flatMap(role => GameLogic.getBalanceIssues(role, CardType.Role))).toEqual([]);
		expect(packs().flatMap(pack => PackLogic.getMonsterSpecies(pack.id).filter(contagious))
			.flatMap(species => GameLogic.getBalanceIssues(species, CardType.Species))).toEqual([]);
	});
});

// The caps that keep a save bounded. The numbers themselves are a design decision, so these
// assert the behaviour around them rather than the values.
const gameWith = (heroCount: number, itemCount: number): GameModel => ({
	heroSlots: 99,
	heroes: Array.from({ length: heroCount }, (_, n) => ({ id: `hero-${n}` }) as CombatantModel),
	items: Array.from({ length: itemCount }, (_, n) => ({ id: `item-${n}` }) as ItemModel),
	boons: [],
	money: 0,
	map: { squares: [], regions: [] },
	stronghold: [],
	encounter: null
});

const newItems = (count: number) => Array.from({ length: count }, (_, n) => ({ id: `new-${n}` }) as ItemModel);

describe('GameLogic.canRecruitHero', () => {
	it('allows recruiting below the cap, however many recruits are banked', () => {
		expect(GameLogic.canRecruitHero(gameWith(GameLogic.maxHeroes - 1, 0))).toBe(true);
	});

	it('refuses at the cap', () => {
		expect(GameLogic.canRecruitHero(gameWith(GameLogic.maxHeroes, 0))).toBe(false);
	});
});

describe('GameLogic.addItemsToGame', () => {
	it('takes everything when there is room', () => {
		const game = gameWith(0, 0);
		expect(GameLogic.addItemsToGame(game, newItems(3))).toEqual([]);
		expect(game.items).toHaveLength(3);
	});

	it('fills to the cap and hands back the rest', () => {
		const game = gameWith(0, GameLogic.maxItems - 2);
		const leftBehind = GameLogic.addItemsToGame(game, newItems(5));
		expect(game.items).toHaveLength(GameLogic.maxItems);
		expect(leftBehind).toHaveLength(3);
	});

	it('takes nothing once full, and hands all of it back', () => {
		const game = gameWith(0, GameLogic.maxItems);
		expect(GameLogic.addItemsToGame(game, newItems(4))).toHaveLength(4);
		expect(game.items).toHaveLength(GameLogic.maxItems);
	});

	// A save that is already over the cap must not be made worse by a later windfall.
	it('never grows a save that is somehow already over the cap', () => {
		const game = gameWith(0, GameLogic.maxItems + 10);
		expect(GameLogic.addItemsToGame(game, newItems(4))).toHaveLength(4);
		expect(game.items).toHaveLength(GameLogic.maxItems + 10);
	});
});
