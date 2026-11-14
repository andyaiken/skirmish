import { describe, expect, it } from 'vitest';

import { CardType } from '../../enums/card-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionType } from '../../enums/condition-type';
import { EncounterMapSquareType } from '../../enums/encounter-map-square-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';

import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';
import type { ItemModel } from '../../models/item';

import { CombatantLogic } from './combatant-logic';
import { ConditionLogic } from '../condition/condition-logic';
import { EncounterLogic } from '../encounter/encounter-logic';
import { Factory } from '../factory/factory';
import { FeatureLogic } from '../feature/feature-logic';
import { GameLogic } from '../game/game-logic';

const createEncounter = (): EncounterModel => {
	const mapSquares = [];
	for (let x = 0; x < 5; ++x) {
		for (let y = 0; y < 5; ++y) {
			mapSquares.push({ x: x, y: y, type: EncounterMapSquareType.Clear });
		}
	}

	return {
		regionID: '', packIDs: [], round: 0, combatants: [], loot: [], traps: [], mapSquares: mapSquares, log: []
	};
};

const addCombatant = (encounter: EncounterModel, x: number, y: number): CombatantModel => {
	const combatant = Factory.createCombatant(CombatantType.Hero);
	combatant.combat.position = { x: x, y: y };
	encounter.combatants.push(combatant);
	return combatant;
};

describe('an aura that raises a skill', () => {
	const spellcasting = (encounter: EncounterModel, combatant: CombatantModel) => {
		return EncounterLogic.getSkillRank(encounter, combatant, SkillType.Spellcasting);
	};

	it('raises that skill for an ally standing beside it', () => {
		const encounter = createEncounter();
		const ally = addCombatant(encounter, 1, 1);
		const before = spellcasting(encounter, ally);

		const wyrdling = addCombatant(encounter, 1, 2);
		wyrdling.features.push(FeatureLogic.createAuraSkillFeature('test-aura', ConditionType.SkillBonus, SkillType.Spellcasting, 2));

		expect(spellcasting(encounter, ally)).toBe(before + 2);
	});

	it('does not reach an ally standing well away from it', () => {
		const encounter = createEncounter();
		const ally = addCombatant(encounter, 0, 0);
		const before = spellcasting(encounter, ally);

		const wyrdling = addCombatant(encounter, 4, 4);
		wyrdling.features.push(FeatureLogic.createAuraSkillFeature('test-aura', ConditionType.SkillBonus, SkillType.Spellcasting, 2));

		expect(spellcasting(encounter, ally)).toBe(before);
	});

	it('leaves other skills alone', () => {
		const encounter = createEncounter();
		const ally = addCombatant(encounter, 1, 1);
		const before = EncounterLogic.getSkillRank(encounter, ally, SkillType.Stealth);

		const wyrdling = addCombatant(encounter, 1, 2);
		wyrdling.features.push(FeatureLogic.createAuraSkillFeature('test-aura', ConditionType.SkillBonus, SkillType.Spellcasting, 2));

		expect(EncounterLogic.getSkillRank(encounter, ally, SkillType.Stealth)).toBe(before);
	});
});

// The all-skills cases have to be tested on someone who has the skill to begin with: getSkillRank
// floors at 0, so a penalty against a rank of 0 reads the same whether it applied or not.
//
// The penalty branch used to read `c.details.trait === TraitType.All` where the bonus branch above
// it reads `c.details.skill === SkillType.All`. Nothing ever sets details.trait on a skill
// condition, so an all-skills penalty applied to nothing at all
describe('a condition that moves every skill at once', () => {
	const stealthRank = (...conditions: ConditionModel[]) => {
		const combatant = Factory.createCombatant(CombatantType.Hero);
		combatant.features.push(FeatureLogic.createSkillFeature('test-base', SkillType.Stealth, 5));
		return CombatantLogic.getSkillRank(combatant, conditions, SkillType.Stealth);
	};

	it('leaves the rank alone when there is no condition', () => {
		expect(stealthRank()).toBe(5);
	});

	it('raises a named skill', () => {
		expect(stealthRank(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 3, SkillType.Stealth))).toBe(8);
	});

	it('raises every skill', () => {
		expect(stealthRank(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 3, SkillType.All))).toBe(8);
	});

	it('lowers a named skill', () => {
		expect(stealthRank(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 3, SkillType.Stealth))).toBe(2);
	});

	it('lowers every skill', () => {
		expect(stealthRank(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 3, SkillType.All))).toBe(2);
	});

	it('lowers a skill the combatant does not have no further than zero', () => {
		const combatant = Factory.createCombatant(CombatantType.Hero);
		const penalty = ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 3, SkillType.All);
		expect(CombatantLogic.getSkillRank(combatant, [ penalty ], SkillType.Brawl)).toBe(0);
	});
});

// Each distinct item group a combatant has equipped grants one default card; the card's weapon
// parameter then picks between that group's weapons, so two of a kind never mean two cards
describe('CombatantLogic.getItemActions', () => {
	const heroWith = (...itemIDs: string[]) => {
		const hero = Factory.createCombatant(CombatantType.Hero);
		itemIDs.forEach((id, n) => {
			const item = JSON.parse(JSON.stringify(GameLogic.getItem(id))) as ItemModel;
			item.id = `${id}-${n}`;
			hero.items.push(item);
		});
		return hero;
	};

	const itemActionIDs = (...itemIDs: string[]) => CombatantLogic.getItemActions(heroWith(...itemIDs)).map(a => a.id);

	it('gives nothing to a combatant with nothing equipped', () => {
		expect(itemActionIDs()).toEqual([]);
	});

	it('gives one card per item group', () => {
		expect(itemActionIDs('item-sword', 'item-greatsword')).toEqual([ 'default-military', 'default-large' ]);
	});

	it('gives two weapons from the same group a single card', () => {
		expect(itemActionIDs('item-sword', 'item-mace')).toEqual([ 'default-military' ]);
	});

	it('gives implements a single card, whatever slot they occupy', () => {
		expect(itemActionIDs('item-wand', 'item-amulet')).toEqual([ 'default-implement' ]);
	});

	it('gives a card for an implement held in the hand', () => {
		expect(itemActionIDs('item-staff')).toEqual([ 'default-implement' ]);
	});

	it('gives nothing for items with no default action', () => {
		expect(itemActionIDs('item-shield')).toEqual([]);
	});

	// Parameters hold their candidates and chosen value, so two combatants must never share them
	it('returns fresh actions on every call', () => {
		const hero = heroWith('item-sword');
		const first = CombatantLogic.getItemActions(hero)[0];
		first.parameters[0].value = 'changed';
		expect(CombatantLogic.getItemActions(hero)[0].parameters[0].value).toBeNull();
	});

	it('shows default cards as standard cards', () => {
		const hero = heroWith('item-sword', 'item-wand');
		CombatantLogic.getItemActions(hero).forEach(action => {
			expect(CombatantLogic.getActionSourceType(hero, action.id)).toBe(CardType.Base);
		});
	});

	it('names the proficiency that grants each default card', () => {
		const hero = heroWith('item-sword', 'item-wand');
		const sources = CombatantLogic.getItemActions(hero).map(action => CombatantLogic.getActionSource(hero, action.id));
		expect(sources).toEqual([ ItemProficiencyType.MilitaryWeapons, ItemProficiencyType.Implements ]);
	});
});
