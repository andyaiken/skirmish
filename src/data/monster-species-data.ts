import { ActionTargetType } from '../enums/action-target-type';
import { CombatantType } from '../enums/combatant-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { MovementType } from '../enums/movement-type';
import { QuirkType } from '../enums/quirk-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { SpeciesModel } from '../models/species';

export class MonsterSpeciesData {
	static getList = (): SpeciesModel[] => {
		return [
			{
				id: 'species-orc',
				name: 'Orc',
				pack: '',
				description: 'An evil creature bred for war.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Endurance,
					TraitType.Speed
				],
				skills: [
					SkillType.Brawl,
					SkillType.Weapon
				],
				features: [
					FeatureLogic.createDamageResistFeature('orc-feature-1', DamageType.All, 1),
					FeatureLogic.createSkillFeature('orc-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('orc-feature-3', SkillType.Weapon, 2)
				],
				actions: [
					{
						id: 'orc-action-1',
						name: 'Bloodlust',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 2, SkillType.Brawl)),
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 2, SkillType.Weapon)),
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 2, DamageCategoryType.Physical))
						]
					},
					{
						id: 'orc-action-2',
						name: 'Bloodfury',
						prerequisites: [
							ActionPrerequisites.wound()
						],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 3)
								]
							}),
							ActionEffects.takeAnotherAction()
						]
					}
				]
			},
			{
				id: 'species-goblin',
				name: 'Goblin',
				pack: '',
				description: 'A fleet-footed creature, difficult to pin down.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Reactions,
					SkillType.Stealth
				],
				features: [
					FeatureLogic.createTraitFeature('goblin-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('goblin-feature-2', SkillType.Reactions, 2),
					FeatureLogic.createSkillFeature('goblin-feature-3', SkillType.Stealth, 2)
				],
				actions: [
					{
						id: 'goblin-action-1',
						name: 'Backstab',
						prerequisites: [
							ActionPrerequisites.meleeWeapon(),
							ActionPrerequisites.hidden()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 2,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							})
						]
					},
					{
						id: 'goblin-action-2',
						name: 'Skitter',
						prerequisites: [
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.forceMovement(MovementType.Random, 1),
							ActionEffects.takeAnotherAction()
						]
					}
				]
			},
			{
				id: 'species-troll',
				name: 'Troll',
				pack: '',
				description: 'A huge brute of a humanoid.',
				type: CombatantType.Monster,
				size: 2,
				quirks: [
					QuirkType.Mindless
				],
				traits: [
					TraitType.Endurance
				],
				skills: [],
				features: [
					FeatureLogic.createTraitFeature('troll-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-2', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-3', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature('troll-feature-4', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'troll-action-1',
						name: 'Slam',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2),
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'troll-action-2',
						name: 'Regeneration',
						prerequisites: [
							ActionPrerequisites.wound()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.healWounds(1)
						]
					}
				]
			},
			{
				id: 'species-naga',
				name: 'Naga',
				pack: '',
				description: 'A serpentine humanoiod.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Brawl,
					SkillType.Presence
				],
				features: [
					FeatureLogic.createTraitFeature('naga-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('naga-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('naga-feature-3', SkillType.Presence, 2),
					FeatureLogic.createDamageBonusFeature('naga-feature-4', DamageType.Poison, 2),
					FeatureLogic.createDamageResistFeature('naga-feature-5', DamageType.Poison, 2)
				],
				actions: [
					{
						id: 'naga-action-1',
						name: 'Venomous Bite',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Poison, 4)
								]
							})
						]
					},
					{
						id: 'naga-action-2',
						name: 'Constrict',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 4)
								]
							})
						]
					},
					{
						id: 'naga-action-3',
						name: 'Beguiling Gaze',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 8)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Presence,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.commandAction()
								]
							})
						]
					}
				]
			},
			{
				id: 'species-elemental-fire',
				name: 'Fire Elemental',
				pack: 'Elements',
				description: 'Hot blooded and quick to anger, these humanoids are made of living fire.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('elemental-fire-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('elemental-fire-feature-2', DamageType.Fire, 2),
					FeatureLogic.createDamageResistFeature('elemental-fire-feature-3', DamageType.Fire, 5),
					FeatureLogic.createAuraDamageFeature('elemental-fire-feature-4', ConditionType.AutoDamage, DamageType.Fire, 1)
				],
				actions: [
					{
						id: 'elemental-fire-action-1',
						name: 'Volcanic Flare',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Fire, 1),
									ActionEffects.dealDamage(DamageType.Light, 1)
								]
							})
						]
					},
					{
						id: 'elemental-fire-action-2',
						name: 'Hurl Fire',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 2,
								hit: [
									ActionEffects.dealDamage(DamageType.Fire, 2)
								]
							})
						]
					},
					{
						id: 'elemental-fire-action-3',
						name: 'Immolation',
						prerequisites: [
							ActionPrerequisites.wound()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 2)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Fire, 3)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-elemental-air',
				name: 'Air Elemental',
				pack: 'Elements',
				description: 'Air elementals are as changeable as the weather, either calm or tempestuous.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('elemental-air-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('elemental-air-feature-2', DamageType.Cold, 2),
					FeatureLogic.createDamageResistFeature('elemental-air-feature-3', DamageType.Cold, 5),
					FeatureLogic.createAuraDamageFeature('elemental-air-feature-4', ConditionType.AutoDamage, DamageType.Cold, 1)
				],
				actions: [
					{
						id: 'elemental-air-action-1',
						name: 'Thunderclap',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Sonic, 1),
									ActionEffects.dealDamage(DamageType.Electricity, 1)
								]
							})
						]
					},
					{
						id: 'elemental-air-action-2',
						name: 'Step Of The Tempest',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.forceMovement(MovementType.BesideTarget, 0),
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Cold, 1),
									ActionEffects.forceMovement(MovementType.Push, 1)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-elemental-earth',
				name: 'Earth Elemental',
				pack: 'Elements',
				description: 'Earth elementals are slow but unstoppable.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('elemental-earth-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('elemental-earth-feature-2', DamageType.Impact, 2),
					FeatureLogic.createDamageResistFeature('elemental-earth-feature-3', DamageType.Impact, 5),
					FeatureLogic.createAuraDamageFeature('elemental-earth-feature-4', ConditionType.AutoDamage, DamageType.Impact, 1)
				],
				actions: [
					{
						id: 'elemental-earth-action-1',
						name: 'Earthbind',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed)),
									ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 5))
								]
							})
						]
					},
					{
						id: 'elemental-earth-action-2',
						name: 'Rockblast',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 3),
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'elemental-earth-action-3',
						name: 'Earthquake',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Combatants, Number.MAX_VALUE)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 1),
									ActionEffects.forceMovement(MovementType.Push, 1),
									ActionEffects.knockDown()
								]
							})
						]
					}
				]
			},
			{
				id: 'species-scarab',
				name: 'Scarab',
				pack: 'Beasts',
				description: 'Insects with an acidic bite.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Beast
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('scarab-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('scarab-feature-2', DamageType.Acid, 2)
				],
				actions: [
					{
						id: 'scarab-action-1',
						name: 'Mandible',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Edged, 2),
									ActionEffects.dealDamage(DamageType.Acid, 2)
								]
							})
						]
					},
					{
						id: 'scarab-action-2',
						name: 'Stinger',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 2),
									ActionEffects.dealDamage(DamageType.Acid, 2)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-giant-spider',
				name: 'Giant Spider',
				pack: 'Beasts',
				description: 'Venomous insects with eight legs.',
				type: CombatantType.Monster,
				size: 2,
				quirks: [
					QuirkType.Beast
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('giant-spider-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageBonusFeature('giant-spider-feature-2', DamageType.Poison, 2)
				],
				actions: [
					{
						id: 'giant-spider-action-1',
						name: 'Bite',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Edged, 2),
									ActionEffects.dealDamage(DamageType.Poison, 2)
								]
							})
						]
					},
					{
						id: 'giant-spider-action-2',
						name: 'Web',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, Number.MAX_VALUE, 5)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 2, TraitType.Speed)),
									ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 5))
								]
							})
						]
					}
				]
			},
			{
				id: 'species-bear',
				name: 'Bear',
				pack: 'Beasts',
				description: 'A huge, powerful animal.',
				type: CombatantType.Monster,
				size: 2,
				quirks: [
					QuirkType.Beast
				],
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createTraitFeature('bear-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('bear-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryBonusFeature('bear-feature-3', DamageCategoryType.Physical, 1)
				],
				actions: [
					{
						id: 'bear-action-1',
						name: 'Bite',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 3)
								]
							})
						]
					},
					{
						id: 'bear-action-2',
						name: 'Swipe',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Edged, 4)
								]
							})
						]
					},
					{
						id: 'bear-action-3',
						name: 'Hug',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 4)
								]
							})
						]
					}
				]
			},
			{
				id: 'species-zombie',
				name: 'Zombie',
				pack: 'Undead',
				description: 'A re-animated corpse.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Mindless,
					QuirkType.Undead
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('zombie-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageCategoryResistFeature('zombie-feature-2', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'zombie-action-1',
						name: 'Rend',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 1),
									ActionEffects.dealDamage(DamageType.Decay, 1)
								]
							})
						]
					},
					{
						id: 'zombie-action-2',
						name: 'Grave Rot',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Combatants, Number.MAX_VALUE)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Decay, 2),
									ActionEffects.toSelf([
										ActionEffects.healDamage(1)
									])
								]
							})
						]
					}
				]
			},
			{
				id: 'species-skeleton',
				name: 'Skeleton',
				pack: 'Undead',
				description: 'Re-animated bones.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Undead
				],
				traits: [],
				skills: [
					SkillType.Brawl
				],
				features: [
					FeatureLogic.createSkillFeature('skeleton-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createDamageResistFeature('skeleton-feature-2', DamageType.Piercing, 2),
					FeatureLogic.createDamageCategoryResistFeature('skeleton-feature-3', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'skeleton-action-1',
						name: 'Bash',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 1)
								]
							})
						]
					},
					{
						id: 'skeleton-action-2',
						name: 'Reassemble',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.healDamage(3)
						]
					}
				]
			},
			{
				id: 'species-vampire',
				name: 'Vampire',
				pack: 'Undead',
				description: 'The blood is the life.',
				type: CombatantType.Monster,
				size: 1,
				quirks: [
					QuirkType.Undead
				],
				traits: [],
				skills: [
					SkillType.Brawl,
					SkillType.Presence
				],
				features: [
					FeatureLogic.createSkillFeature('vampire-feature-1', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('vampire-feature-2', SkillType.Presence, 2),
					FeatureLogic.createDamageCategoryResistFeature('vampire-feature-3', DamageCategoryType.Corruption, 1)
				],
				actions: [
					{
						id: 'vampire-action-1',
						name: 'Speed Of The Grave',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.forceMovement(MovementType.BesideTarget, 0),
							ActionEffects.takeAnotherAction()
						]
					},
					{
						id: 'vampire-action-2',
						name: 'Vampiric Bite',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Piercing, 1),
									ActionEffects.dealDamage(DamageType.Decay, 1),
									ActionEffects.toSelf([
										ActionEffects.healDamage(1),
										ActionEffects.healWounds(1)
									])
								]
							})
						]
					},
					{
						id: 'vampire-action-3',
						name: 'Mesmerize',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
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
				]
			},
			{
				id: 'species-giant',
				name: 'Giant',
				pack: '',
				description: 'A huge, monstrously strong creature.',
				type: CombatantType.Monster,
				size: 3,
				quirks: [],
				traits: [
					TraitType.Endurance,
					TraitType.Endurance,
					TraitType.Endurance
				],
				skills: [],
				features: [
					FeatureLogic.createTraitFeature('giant-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createTraitFeature('giant-feature-2', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('giant-feature-3', SkillType.Brawl, 2),
					FeatureLogic.createDamageResistFeature('giant-feature-4', DamageType.All, 1)
				],
				actions: [
					{
						id: 'giant-action-1',
						name: 'Hurl Object',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 3),
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'giant-action-2',
						name: 'Sweep',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, Number.MAX_VALUE)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2),
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'giant-action-3',
						name: 'Thwack',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Resolve,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 4),
									ActionEffects.forceMovement(MovementType.Push, 2),
									ActionEffects.knockDown()
								]
							})
						]
					}
				]
			}
		];
	};
}
