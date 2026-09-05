import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../../logic/action/action-logic';
import { ActionTargetType } from '../../enums/action-target-type';
import { CombatantType } from '../../enums/combatant-type';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { DamageType } from '../../enums/damage-type';
import { FeatureLogic } from '../../logic/feature/feature-logic';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { PackModel } from '../../models/pack';
import { SkillType } from '../../enums/skill-type';
import { StructureType } from '../../enums/structure-type';
import { TraitType } from '../../enums/trait-type';

export const theGoingRate = (): PackModel => ({
	id: 'pack-the-going-rate',
	name: 'The Going Rate',
	description: 'Everyone has a price.',
	species: [
		// Brigands and Mercenary Captains carry no monstrous quirks, so the encounter generator
		// dresses them with a role and a background drawn from the hero decks - they fight like
		// another company rather than like a monster
		{
			id: 'species-brigand',
			name: 'Brigand',
			description: 'Someone who decided that other people\'s property was a career.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('brigand-start-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('brigand-start-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('brigand-start-3', SkillType.Stealth, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('brigand-feature-1', TraitType.Speed, 1),
				FeatureLogic.createSkillFeature('brigand-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('brigand-feature-3', SkillType.Stealth, 2)
			],
			actions: [
				{
					id: 'brigand-action-1',
					name: 'Ambush',
					prerequisites: [
						ActionPrerequisites.meleeWeapon(),
						ActionPrerequisites.hidden()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 2,
							hit: [
								ActionEffects.dealWeaponDamage(1)
							]
						})
					]
				},
				{
					id: 'brigand-action-2',
					name: 'Cut and Run',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.addMovement()
					]
				},
				{
					id: 'brigand-action-3',
					name: 'Rifle Their Pockets',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Stealth,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.steal()
							]
						})
					]
				}
			],
			deathActions: []
		},
		{
			id: 'species-mercenary-captain',
			name: 'Mercenary Captain',
			description: 'Their company has a banner, a paymaster, and a list of work it will not take.',
			type: CombatantType.Monster,
			size: 1,
			quirks: [],
			startingFeatures: [
				FeatureLogic.createTraitFeature('mercenary-captain-start-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('mercenary-captain-start-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('mercenary-captain-start-3', SkillType.Presence, 2)
			],
			features: [
				FeatureLogic.createTraitFeature('mercenary-captain-feature-1', TraitType.Resolve, 1),
				FeatureLogic.createSkillFeature('mercenary-captain-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('mercenary-captain-feature-3', SkillType.Presence, 2)
			],
			actions: [
				{
					id: 'mercenary-captain-action-1',
					name: 'Veteran\'s Cut',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage(1)
							]
						})
					]
				},
				{
					id: 'mercenary-captain-action-2',
					name: 'Form Up',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 3, 5)
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 4, SkillType.Weapon))
					]
				},
				{
					id: 'mercenary-captain-action-3',
					name: 'Break Their Nerve',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 2, 4)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.stun()
							]
						})
					]
				}
			],
			deathActions: []
		}
	],
	roles: [
		{
			// The game has no money inside an encounter, so the Sellsword's "fights better when
			// paid" is expressed as opportunism instead: it wants targets that are already in
			// trouble, and it wants to be paid in loot
			id: 'role-sellsword',
			name: 'Sellsword',
			description: 'Asks what the work pays before asking what it is.',
			startingFeatures: [
				FeatureLogic.createTraitFeature('sellsword-start-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('sellsword-start-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('sellsword-start-3', SkillType.Presence, 2),
				FeatureLogic.createProficiencyFeature('sellsword-start-4', ItemProficiencyType.MilitaryWeapons),
				FeatureLogic.createProficiencyFeature('sellsword-start-5', ItemProficiencyType.LightArmor)
			],
			features: [
				FeatureLogic.createTraitFeature('sellsword-feature-1', TraitType.Endurance, 1),
				FeatureLogic.createSkillFeature('sellsword-feature-2', SkillType.Weapon, 2),
				FeatureLogic.createSkillFeature('sellsword-feature-3', SkillType.Presence, 2),
				FeatureLogic.createDamageBonusFeature('sellsword-feature-4', DamageType.Edged, 1)
			],
			actions: [
				{
					id: 'sellsword-action-1',
					name: 'Cut Your Losses',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.dealWeaponDamage()
							]
						}),
						ActionEffects.addMovement()
					]
				},
				{
					// A prerequisite is checked against the acting combatant before any target is
					// chosen, so "the target is wounded" can't be stated. The finisher is priced
					// with a to-hit penalty instead: heavy, and easy to waste
					id: 'sellsword-action-2',
					name: 'Finish the Job',
					prerequisites: [
						ActionPrerequisites.meleeWeapon()
					],
					parameters: [
						ActionWeaponParameters.melee(),
						ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
					],
					effects: [
						ActionEffects.attack({
							weapon: true,
							skill: SkillType.Weapon,
							trait: TraitType.Endurance,
							skillBonus: -2,
							hit: [
								ActionEffects.dealWeaponDamage(2)
							]
						})
					]
				},
				{
					id: 'sellsword-action-3',
					name: 'Terms of Engagement',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 3, 4)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.addCondition(ConditionLogic.createSkillPenaltyCondition(TraitType.Resolve, 4, SkillType.Weapon))
							]
						})
					]
				},
				{
					id: 'sellsword-action-4',
					name: 'Hired Steel',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 5, SkillType.Weapon))
					]
				},
				{
					id: 'sellsword-action-5',
					name: 'Take the Purse',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Speed,
							skillBonus: 0,
							hit: [
								ActionEffects.steal()
							]
						})
					]
				}
			]
		}
	],
	backgrounds: [
		{
			id: 'background-negotiator',
			name: 'Negotiator',
			description: 'Comes to a battle carrying terms rather than a weapon.',
			startingFeatures: [
				FeatureLogic.createSkillFeature('negotiator-start-1', SkillType.Presence, 2)
			],
			features: [
				FeatureLogic.createSkillFeature('negotiator-feature-1', SkillType.Presence, 2),
				FeatureLogic.createTraitFeature('negotiator-feature-2', TraitType.Resolve, 1)
			],
			actions: [
				{
					id: 'negotiator-action-1',
					name: 'Parley',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
					],
					effects: [
						ActionEffects.attack({
							weapon: false,
							skill: SkillType.Presence,
							trait: TraitType.Resolve,
							skillBonus: 0,
							hit: [
								ActionEffects.commandMove()
							]
						})
					]
				},
				{
					id: 'negotiator-action-2',
					name: 'Reassess',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
					],
					effects: [
						ActionEffects.removeCondition(TraitType.Any)
					]
				},
				{
					id: 'negotiator-action-3',
					name: 'Read the Room',
					prerequisites: [],
					parameters: [
						ActionTargetParameters.self()
					],
					effects: [
						ActionEffects.scan(),
						ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 4, SkillType.Presence))
					]
				}
			]
		}
	],
	items: [],
	potions: [],
	scrolls: [],
	structures: [
		{
			id: 'structure-bazaar',
			type: StructureType.Bazaar,
			name: 'Bazaar',
			description: 'Every stall here remembers what you paid last season.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-counting-house',
			type: StructureType.CountingHouse,
			name: 'Counting House',
			description: 'Every region you take starts paying its dues.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-guildhall',
			type: StructureType.Guildhall,
			name: 'Guildhall',
			description: 'The guilds keep a ledger of favours owed in every port on the coast.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-monument',
			type: StructureType.Monument,
			name: 'Monument',
			description: 'A company with a monument is a company worth joining.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		},
		{
			id: 'structure-tavern',
			type: StructureType.Tavern,
			name: 'Tavern',
			description: 'Rest, rumour and recruitment - everyone ends up here eventually.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
