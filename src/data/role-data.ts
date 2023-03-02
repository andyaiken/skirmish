import { ActionTargetType } from '../enums/action-target-type';
import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionEffects, ActionPrerequisites, ActionTargetParameters, ActionWeaponParameters } from '../logic/action-logic';
import { ConditionLogic } from '../logic/condition-logic';
import { FeatureLogic } from '../logic/feature-logic';

import type { RoleModel } from '../models/role';

export class RoleData {
	static getList = (): RoleModel[] => {
		return [
			{
				id: 'role-arcanist',
				name: 'Arcanist',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('arcanist-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('arcanist-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature('arcanist-feature-3', DamageCategoryType.Energy, 1)
				],
				actions: [
					{
						id: 'arcanist-action-1',
						name: 'Arcane Shield',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 5, DamageType.All))
						]
					},
					{
						id: 'arcanist-action-2',
						name: 'Arcane Armor',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 5, DamageType.All))
						]
					},
					{
						id: 'arcanist-action-3',
						name: 'Arcane Force (push)',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Move selected target away
						]
					},
					{
						id: 'arcanist-action-4',
						name: 'Arcane Arrow',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							ActionEffects.dealDamage(DamageType.Electricity, 1),
							ActionEffects.dealDamage(DamageType.Piercing, 1)
						]
					},
					{
						id: 'arcanist-action-5',
						name: 'Swap positions',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, 1, 5)
						],
						effects: [
							// TODO: Swap position with selected target
						]
					}
				]
			},
			{
				id: 'role-barbarian',
				name: 'Barbarian',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.LargeWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('barbarian-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('barbarian-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature('barbarian-feature-3', DamageCategoryType.Physical, 1),
					FeatureLogic.createDamageCategoryResistFeature('barbarian-feature-4', DamageCategoryType.Physical, 1)
				],
				actions: [
					{
						id: 'barbarian-action-1',
						name: 'Overhead strike',
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
									ActionEffects.dealWeaponDamage(),
									ActionEffects.dealWeaponDamage()
								]
							})
						]
					},
					{
						id: 'barbarian-action-2',
						name: 'Knockdown strike',
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
									ActionEffects.dealWeaponDamage(),
									ActionEffects.knockDown()
								]
							})
						]
					},
					{
						id: 'barbarian-action-3',
						name: 'Stunning strike',
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
									ActionEffects.dealWeaponDamage(),
									ActionEffects.loseTurn()
								]
							})
						]
					},
					{
						id: 'barbarian-action-4',
						name: 'Haymaker strike',
						prerequisites: [
							ActionPrerequisites.meleeWeapon()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, Number.MAX_VALUE, 0)
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
							})
						]
					},
					{
						id: 'barbarian-action-5',
						name: 'Burst through wall',
						prerequisites: [
							ActionPrerequisites.meleeWeapon()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.weapon(ActionTargetType.Walls, 1, 0)
						],
						effects: [
							// TODO: Destroy selected walls
						]
					}
				]
			},
			{
				id: 'role-dervish',
				name: 'Dervish',
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.PairedWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('dervish-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('dervish-feature-2', SkillType.Weapon, 2)
				],
				actions: [
					{
						id: 'dervish-action-1',
						name: 'Dual strike (one target)',
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
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							})
						]
					},
					{
						id: 'dervish-action-2',
						name: 'Dual strike (two targets)',
						prerequisites: [
							ActionPrerequisites.meleeWeapon()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, 2, 0)
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
							})
						]
					},
					{
						id: 'dervish-action-3',
						name: 'Whirlwind strike',
						prerequisites: [
							ActionPrerequisites.meleeWeapon()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, Number.MAX_VALUE, 0)
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
							})
						]
					},
					{
						id: 'dervish-action-4',
						name: 'Leaping strike',
						prerequisites: [
							ActionPrerequisites.meleeWeapon()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 2)
						],
						effects: [
							// TODO: Move adjacent to selected target
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							})
						]
					},
					{
						id: 'dervish-action-5',
						name: 'Dodging stance',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 5, TraitType.Speed)),
							ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Endurance, 5, DamageType.All))
						]
					}
				]
			},
			{
				id: 'role-enchanter',
				name: 'Enchanter',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('enchanter-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('enchanter-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageBonusFeature('enchanter-feature-3', DamageType.Psychic, 1),
					FeatureLogic.createDamageResistFeature('enchanter-feature-4', DamageType.Psychic, 1)
				],
				actions: [
					{
						id: 'enchanter-action-1',
						name: 'Confusion',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							// TODO: Target makes attack
						]
					},
					{
						id: 'enchanter-action-2',
						name: 'Stun',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.loseTurn()
						]
					},
					{
						id: 'enchanter-action-3',
						name: 'Fear',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Resolve, 5, TraitType.Speed))
						]
					},
					{
						id: 'enchanter-action-4',
						name: 'Mental shield',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Corruption))
						]
					},
					{
						id: 'enchanter-action-5',
						name: 'Weaken',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamagePenaltyCondition(TraitType.Endurance, 5, DamageType.All))
						]
					}
				]
			},
			{
				id: 'role-geomancer',
				name: 'Geomancer',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('geomancer-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('geomancer-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createAuraFeature('geomancer-feature-3', ConditionType.MovementBonus, 1),
					FeatureLogic.createAuraFeature('geomancer-feature-4', ConditionType.MovementPenalty, 1)
				],
				actions: [
					{
						id: 'geomancer-action-1',
						name: 'Create difficult terrain',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.area(ActionTargetType.Squares, Number.MAX_VALUE, 3, 10)
						],
						effects: [
							// TODO: Turn selected squares into difficult terrain
						]
					},
					{
						id: 'geomancer-action-2',
						name: 'Create clear terrain',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.area(ActionTargetType.Squares, Number.MAX_VALUE, 3, 10)
						],
						effects: [
							// TODO: Turn selected squares into clear terrain
						]
					},
					{
						id: 'geomancer-action-3',
						name: 'Destroy ground',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.area(ActionTargetType.Squares, Number.MAX_VALUE, 3, 10)
						],
						effects: [
							// TODO: Remove selected squares from map
						]
					},
					{
						id: 'geomancer-action-4',
						name: 'Create ground',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.area(ActionTargetType.Walls, Number.MAX_VALUE, 3, 10)
						],
						effects: [
							// TODO: Turn selected walls into squares
						]
					},
					{
						id: 'geomancer-action-5',
						name: 'Earthbind (reduce target\'s speed)',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.area(ActionTargetType.Enemies, Number.MAX_VALUE, 3, 10)
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed)),
							ActionEffects.addCondition(ConditionLogic.createMovementPenaltyCondition(TraitType.Endurance, 5))
						]
					}
				]
			},
			{
				id: 'role-luckweaver',
				name: 'Luckweaver',
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [],
				features: [
					FeatureLogic.createSkillFeature('luckweaver-feature-1', SkillType.Spellcasting, 2),
					FeatureLogic.createSkillCategoryFeature('luckweaver-feature-2', SkillCategoryType.Any, 1),
					FeatureLogic.createDamageCategoryBonusFeature('luckweaver-feature-3', DamageCategoryType.Any, 1),
					FeatureLogic.createDamageCategoryResistFeature('luckweaver-feature-4', DamageCategoryType.Any, 1)
				],
				actions: [
					{
						id: 'luckweaver-action-1',
						name: 'Chaos bolt',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Any, 3)
								]
							})
						]
					},
					{
						id: 'luckweaver-action-2',
						name: 'Warp space',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 10)
						],
						effects: [
							// TODO: Selected target moves to a different empty square
						]
					},
					{
						id: 'luckweaver-action-3',
						name: 'Probability wave',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Combatants, Number.MAX_VALUE, 10)
						],
						effects: [
							// TODO: Selected target's conditions invert
						]
					}
				]
			},
			{
				id: 'role-ninja',
				name: 'Ninja',
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Brawl,
					SkillType.Stealth
				],
				proficiencies: [],
				features: [
					FeatureLogic.createTraitFeature('ninja-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('ninja-feature-2', SkillType.Brawl, 2),
					FeatureLogic.createSkillFeature('ninja-feature-3', SkillType.Stealth, 2),
					FeatureLogic.createDamageCategoryBonusFeature('ninja-feature-4', DamageCategoryType.Physical, 1)
				],
				actions: [
					{
						id: 'ninja-action-1',
						name: 'Roundhouse kick',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 2,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2)
								]
							})
						]
					},
					{
						id: 'ninja-action-2',
						name: 'Flurry',
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
									ActionEffects.dealDamage(DamageType.Impact, 2)
								]
							}),
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2)
								]
							}),
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2)
								]
							})
						]
					},
					{
						id: 'ninja-action-3',
						name: 'Split kick',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 2)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Brawl,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2)
								]
							})
						]
					},
					{
						id: 'ninja-action-4',
						name: 'Lightning Speed',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.grantMovement()
						]
					},
					{
						id: 'ninja-action-5',
						name: 'Adrenal boost',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Endurance, 3, TraitType.Speed)),
							ActionEffects.addCondition(ConditionLogic.createMovementBonusCondition(TraitType.Endurance, 3)),
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Endurance, 3, SkillType.Brawl)),
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryBonusCondition(TraitType.Endurance, 3, DamageCategoryType.Physical))
						]
					}
				]
			},
			{
				id: 'role-gunslinger',
				name: 'Gunslinger',
				traits: [
					TraitType.Speed
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.PowderWeapons
				],
				features: [
					FeatureLogic.createTraitFeature('gunslinger-feature-1', TraitType.Speed, 1),
					FeatureLogic.createSkillFeature('gunslinger-feature-2', SkillType.Weapon, 2)
				],
				actions: [
					{
						id: 'gunslinger-action-1',
						name: 'Fusilade',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged(),
							ActionTargetParameters.weaponArea(ActionTargetType.Combatants, Number.MAX_VALUE, 3)
						],
						effects: [
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealWeaponDamage(-2)
								]
							})
						]
					},
					{
						id: 'gunslinger-action-2',
						name: 'Fire',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged(),
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
							})
						]
					},
					{
						id: 'gunslinger-action-3',
						name: 'Pommel strike',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 2)
								]
							})
						]
					},
					{
						id: 'gunslinger-action-4',
						name: 'Quickfire',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
						],
						effects: [
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: -2,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							}),
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: -2,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							})
						]
					},
					{
						id: 'gunslinger-action-5',
						name: 'Careful shot',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
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
					}
				]
			},
			{
				id: 'role-ranger',
				name: 'Ranger',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.RangedWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('ranger-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('ranger-feature-2', SkillType.Perception, 2),
					FeatureLogic.createSkillFeature('ranger-feature-3', SkillType.Weapon, 2)
				],
				actions: [
					{
						id: 'ranger-action-1',
						name: 'Careful aim',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createSkillBonusCondition(TraitType.Resolve, 5, SkillType.Weapon))
						]
					},
					{
						id: 'ranger-action-2',
						name: 'Sure shot',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
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
						id: 'ranger-action-3',
						name: 'Pinning shot (slows)',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 0)
						],
						effects: [
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealWeaponDamage(),
									ActionEffects.loseTurn(),
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
								]
							})
						]
					},
					{
						id: 'ranger-action-4',
						name: 'Barrage (area, low damage)',
						prerequisites: [
							ActionPrerequisites.rangedWeapon()
						],
						parameters: [
							ActionWeaponParameters.ranged(),
							ActionTargetParameters.weaponArea(ActionTargetType.Enemies, Number.MAX_VALUE, 3)
						],
						effects: [
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealWeaponDamage(-2)
								]
							})
						]
					}
				]
			},
			{
				id: 'role-necromancer',
				name: 'Necromancer',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('necromancer-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('necromancer-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createAuraDamageFeature('necromancer-feature-3', ConditionType.AutoDamage, DamageType.Decay, 1)
				],
				actions: [
					{
						id: 'necromancer-action-1',
						name: 'Transfer damage (self to enemy)',
						prerequisites: [
							ActionPrerequisites.implement(),
							ActionPrerequisites.damage()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Heal damage from self
							ActionEffects.dealDamage(DamageType.Decay, 3)
						]
					},
					{
						id: 'necromancer-action-2',
						name: 'Transfer wounds (self to enemy)',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Heal wound from self
							ActionEffects.inflictWounds(1)
						]
					},
					{
						id: 'necromancer-action-3',
						name: 'Transfer damage (ally to enemy)',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
						],
						effects: [
							ActionEffects.healDamage(3)
							// TODO: Inflict damage on nearby enemy
						]
					},
					{
						id: 'necromancer-action-4',
						name: 'Transfer wounds (ally to enemy)',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
						],
						effects: [
							ActionEffects.healWounds(1)
							// TODO: Inflict wound on nearby enemy
						]
					},
					{
						id: 'necromancer-action-5',
						name: 'Strength from pain',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Allies, 1, 5)
						],
						effects: [
							ActionEffects.healDamage(3),
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Endurance)),
							ActionEffects.addCondition(ConditionLogic.createTraitBonusCondition(TraitType.Resolve, 3, TraitType.Resolve))
						]
					}
				]
			},
			{
				id: 'role-soldier',
				name: 'Soldier',
				traits: [
					TraitType.Endurance
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.MilitaryWeapons,
					ItemProficiencyType.HeavyArmor,
					ItemProficiencyType.Shields
				],
				features: [
					FeatureLogic.createTraitFeature('soldier-feature-1', TraitType.Endurance, 1),
					FeatureLogic.createSkillFeature('soldier-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature('soldier-feature-3', DamageCategoryType.Physical, 1)
				],
				actions: [
					{
						id: 'soldier-action-1',
						name: 'Charge attack',
						prerequisites: [
							ActionPrerequisites.meleeWeapon()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 5)
						],
						effects: [
							// TODO: Move adjacent to selected target
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							})
						]
					},
					{
						id: 'soldier-action-2',
						name: 'Precise attack',
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
								skillBonus: 2,
								hit: [
									ActionEffects.dealWeaponDamage()
								]
							})
						]
					},
					{
						id: 'soldier-action-3',
						name: 'Disarming attack',
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
									// TODO: Remove selected target's weapon
								]
							})
						]
					},
					{
						id: 'soldier-action-4',
						name: 'Parrying stance',
						prerequisites: [],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Endurance, 5, DamageType.All))
						]
					},
					{
						id: 'soldier-action-5',
						name: 'Shield bash (push)',
						prerequisites: [
							ActionPrerequisites.shield()
						],
						parameters: [
							ActionTargetParameters.adjacent(ActionTargetType.Enemies, 1)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Impact, 3)
									// TODO: Push selected target away
								]
							})
						]
					}
				]
			},
			{
				id: 'role-sorcerer',
				name: 'Sorcerer',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Spellcasting
				],
				proficiencies: [
					ItemProficiencyType.Implements
				],
				features: [
					FeatureLogic.createTraitFeature('sorcerer-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('sorcerer-feature-2', SkillType.Spellcasting, 2),
					FeatureLogic.createDamageCategoryBonusFeature('sorcerer-feature-3', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryResistFeature('sorcerer-feature-4', DamageCategoryType.Energy, 1),
					FeatureLogic.createAuraDamageFeature('sorcerer-feature-5', ConditionType.AutoDamage, DamageType.Fire, 1),
					FeatureLogic.createAuraDamageFeature('sorcerer-feature-6', ConditionType.AutoDamage, DamageType.Cold, 1),
					FeatureLogic.createAuraDamageFeature('sorcerer-feature-7', ConditionType.AutoDamage, DamageType.Electricity, 1)
				],
				actions: [
					{
						id: 'sorcerer-action-1',
						name: 'Lightning bolt',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.burst(ActionTargetType.Enemies, 1, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Electricity, 3),
									ActionEffects.loseTurn()
								]
							})
						]
					},
					{
						id: 'sorcerer-action-2',
						name: 'Fireball (area, ongoing fire damage)',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.area(ActionTargetType.Combatants, Number.MAX_VALUE, 3, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Fire, 3),
									ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 5, DamageType.Fire))
								]
							})
						]
					},
					{
						id: 'sorcerer-action-3',
						name: 'Ice storm',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.area(ActionTargetType.Combatants, Number.MAX_VALUE, 3, 10)
						],
						effects: [
							ActionEffects.attack({
								weapon: false,
								skill: SkillType.Spellcasting,
								trait: TraitType.Endurance,
								skillBonus: 0,
								hit: [
									ActionEffects.dealDamage(DamageType.Cold, 3),
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
								]
							})
						]
					},
					{
						id: 'sorcerer-action-4',
						name: 'Elemental resistance: fire / ice / electricity',
						prerequisites: [
							ActionPrerequisites.implement()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageCategoryResistanceCondition(TraitType.Resolve, 5, DamageCategoryType.Energy))
						]
					}
				]
			},
			{
				id: 'role-warmage',
				name: 'Warmage',
				traits: [
					TraitType.Resolve
				],
				skills: [
					SkillType.Weapon
				],
				proficiencies: [
					ItemProficiencyType.MilitaryWeapons,
					ItemProficiencyType.LightArmor
				],
				features: [
					FeatureLogic.createTraitFeature('warmage-feature-1', TraitType.Resolve, 1),
					FeatureLogic.createSkillFeature('warmage-feature-2', SkillType.Weapon, 2),
					FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-3', DamageCategoryType.Energy, 1),
					FeatureLogic.createDamageCategoryBonusFeature('warmage-feature-4', DamageCategoryType.Physical, 1)
				],
				actions: [
					{
						id: 'warmage-action-1',
						name: 'Flaming blade',
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
									ActionEffects.dealDamage(DamageType.Fire, 3),
									ActionEffects.addCondition(ConditionLogic.createAutoDamageCondition(TraitType.Endurance, 5, DamageType.Fire))
								]
							})
						]
					},
					{
						id: 'warmage-action-2',
						name: 'Frost blade',
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
									ActionEffects.dealDamage(DamageType.Cold, 3),
									ActionEffects.addCondition(ConditionLogic.createTraitPenaltyCondition(TraitType.Endurance, 5, TraitType.Speed))
								]
							})
						]
					},
					{
						id: 'warmage-action-3',
						name: 'Shocking blade',
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
									ActionEffects.dealDamage(DamageType.Electricity, 3),
									ActionEffects.loseTurn()
								]
							})
						]
					},
					{
						id: 'warmage-action-4',
						name: 'Armor enhancement',
						prerequisites: [
							ActionPrerequisites.armor()
						],
						parameters: [
							ActionTargetParameters.self()
						],
						effects: [
							ActionEffects.addCondition(ConditionLogic.createDamageResistanceCondition(TraitType.Resolve, 8, DamageType.All))
						]
					},
					{
						id: 'warmage-action-5',
						name: 'Arcane whip',
						prerequisites: [
							ActionPrerequisites.meleeWeapon()
						],
						parameters: [
							ActionWeaponParameters.melee(),
							ActionTargetParameters.weapon(ActionTargetType.Enemies, 1, 2)
						],
						effects: [
							ActionEffects.attack({
								weapon: true,
								skill: SkillType.Weapon,
								trait: TraitType.Speed,
								skillBonus: 0,
								hit: [
									ActionEffects.dealWeaponDamage()
									// TODO: move selected target adjacent to me
								]
							})
						]
					}
				]
			}
		];
	};
}
