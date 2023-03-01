import { ConditionType } from '../enums/condition-type';
import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import { ActionLogic } from '../logic/action-logic';
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
						name: 'Arcane Shield (self, resist all damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'arcanist-action-2',
						name: 'Arcane Armor (other, resist all damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'arcanist-action-3',
						name: 'Arcane Force (push)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'arcanist-action-4',
						name: 'Arcane Arrow',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'arcanist-action-5',
						name: 'Swap positions',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'barbarian-action-2',
						name: 'Knockdown strike',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'barbarian-action-3',
						name: 'Stunning strike',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'barbarian-action-4',
						name: 'Haymaker strike',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'barbarian-action-5',
						name: 'Burst through wall',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'dervish-action-2',
						name: 'Dual strike (two targets)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'dervish-action-3',
						name: 'Whirlwind strike',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'dervish-action-4',
						name: 'Leaping strike',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'dervish-action-5',
						name: 'Dodging stance (adds physical damage resistance)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Confusion (target makes attack)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'enchanter-action-2',
						name: 'Stun (target loses action)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'enchanter-action-3',
						name: 'Fear (target loses speed)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'enchanter-action-4',
						name: 'Mental shield (add psychic damage resistance)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'enchanter-action-5',
						name: 'Weaken (reduce target\'s damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'geomancer-action-2',
						name: 'Create clear terrain',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'geomancer-action-3',
						name: 'Destroy ground',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'geomancer-action-4',
						name: 'Create ground',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'geomancer-action-5',
						name: 'Earthbind (reduce target\'s speed)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
				proficiencies: [
					// None
				],
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
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'ninja-action-2',
						name: 'Flurry (single target)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'ninja-action-3',
						name: 'Leaping kick',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'ninja-action-4',
						name: 'Lightning speed (move)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'ninja-action-5',
						name: 'Adrenal boost (adds to attack / damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Fusilade (area, low damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'gunslinger-action-2',
						name: 'Fire',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'gunslinger-action-3',
						name: 'Pommel strike',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'gunslinger-action-4',
						name: 'Quickfire (two attacks, low accuracy)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'gunslinger-action-5',
						name: 'Careful shot',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Quick shot',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'ranger-action-2',
						name: 'Sure shot',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'ranger-action-3',
						name: 'Pinning shot (slows)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'ranger-action-4',
						name: 'Barrage (area, low damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'necromancer-action-2',
						name: 'Transfer wounds (self to enemy)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'necromancer-action-3',
						name: 'Transfer damage (ally to enemy)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'necromancer-action-4',
						name: 'Transfer wounds (ally to enemy)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'soldier-action-2',
						name: 'Precise attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'soldier-action-3',
						name: 'Disarming attack',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'soldier-action-4',
						name: 'Parrying stance',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'soldier-action-5',
						name: 'Shield bash (push)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Lightning bolt (single target, damage and stuns)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'sorcerer-action-2',
						name: 'Fireball (area, ongoing fire damage)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'sorcerer-action-3',
						name: 'Ice storm (area, damage and reduced speed)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'sorcerer-action-4',
						name: 'Elemental resistance: fire',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'sorcerer-action-5',
						name: 'Elemental resistance: cold',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'sorcerer-action-6',
						name: 'Elemental resistance: electricity',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
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
						name: 'Flaming blade (ongoing fire)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'warmage-action-2',
						name: 'Frost blade (slows)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'warmage-action-3',
						name: 'Shocking blade (stuns)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'warmage-action-4',
						name: 'Armor enhancement',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					},
					{
						id: 'warmage-action-5',
						name: 'Arcane Whip (attack at range)',
						prerequisites: [],
						target: ActionLogic.targetSelf(),
						prologue: [],
						attack: null,
						epilogue: []
					}
				]
			}
		];
	};
}
