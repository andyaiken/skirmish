import { DamageCategoryType } from '../enums/damage-category-type';
import { DamageType } from '../enums/damage-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { TraitType } from '../enums/trait-type';

import { FeatureLogic } from '../logic/feature-logic';

import type { ItemModel } from '../models/item';

export class ItemData {
	static getList = (): ItemModel[] => {
		return [
			{
				id: 'item-sword',
				name: 'Sword',
				description: 'Three feet long and sharp on both sides.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-katana',
				name: 'Katana',
				description: 'An elegant single-edged blade with a slight curve.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-scimitar',
				name: 'Scimitar',
				description: 'A wickedly-curved blade.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-handaxe',
				name: 'Handaxe',
				description: 'A chopping blade at the end of a wooden haft.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-khopesh',
				name: 'Khopesh',
				description: 'An intimidatingly-hooked sword.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-mace',
				name: 'Mace',
				description: 'A simple bludgeoning weapon.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Impact,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-flail',
				name: 'Flail',
				description: 'A length of metal chain at the end of a wooden haft.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Impact,
							rank: 4
						}
					],
					range: 1,
					unreliable: 1
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-spear',
				name: 'Spear',
				description: 'A long haft, topped with a sharp metal point.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 2
						}
					],
					range: 2,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-mattock',
				name: 'Mattock',
				description: 'A smaller, one-handed warhammer.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-rapier',
				name: 'Rapier',
				description: 'A sword with a thin, pointed blade.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.MilitaryWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 3
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-greatsword',
				name: 'Greatsword',
				description: 'A large, two-handed sword.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 5
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-battleaxe',
				name: 'Battleaxe',
				description: 'A heavy axe that requires two hands to wield it.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 5
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-glaive',
				name: 'Glaive',
				description: 'A sword blade mounted at the end of a long haft.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 4
						}
					],
					range: 2,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-warhammer',
				name: 'Warhammer',
				description: 'A heavy, blunt-faced crushing weapon.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Impact,
							rank: 5
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-quarterstaff',
				name: 'Quarterstaff',
				description: 'A sturdy wooden stick, as tall as a person.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Impact,
							rank: 5
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-pike',
				name: 'Pike',
				description: 'A spear point mounted at the end of a long haft.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 4
						}
					],
					range: 2,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-halberd',
				name: 'Halberd',
				description: 'An axe blade mounted at the end of a long haft.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 4
						}
					],
					range: 2,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-trident',
				name: 'Trident',
				description: 'A three-pronged spear.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LargeWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 5
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-dagger',
				name: 'Daggers',
				description: 'Simple small blades, easily hidden.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.PairedWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Edged,
							rank: 2
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-sai',
				name: 'Sais',
				description: 'Pointed daggers with sharp side-prongs.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.PairedWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 2
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-tonfas',
				name: 'Tonfas',
				description: 'Wooden batons with a perpendicular handle.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.PairedWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Impact,
							rank: 2
						}
					],
					range: 1,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-longbow',
				name: 'Longbow',
				description: 'Longbows loose arrows with great accuracy.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.RangedWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 3
						}
					],
					range: 15,
					unreliable: 0
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-crossbow',
				name: 'Crossbow',
				description: 'A device which can launch wooden bolts hundreds of feet.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.RangedWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 4
						}
					],
					range: 20,
					unreliable: 1
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-catapult',
				name: 'Catapult',
				description: 'A simple device for launching rocks and other small blunt projectiles.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.RangedWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Impact,
							rank: 3
						}
					],
					range: 10,
					unreliable: 1
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-rifle',
				name: 'Rifle',
				description: 'A large gun that requires two hands to use.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.PowderWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 8
						}
					],
					range: 20,
					unreliable: 2
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-carbine',
				name: 'Carbine',
				description: 'Smaller than a rifle, larger than a pistol.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.PowderWeapons,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 7
						}
					],
					range: 15,
					unreliable: 2
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-pistol',
				name: 'Pistol',
				description: 'A less powerful hand-held gun.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.PowderWeapons,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: {
					damage: [
						{
							type: DamageType.Piercing,
							rank: 6
						}
					],
					range: 10,
					unreliable: 2
				},
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-orb',
				name: 'Orb',
				description: 'A crystal ball.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.Implements,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-wand',
				name: 'Wand',
				description: 'A small wooden rod.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.Implements,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-tome',
				name: 'Tome',
				description: 'A spellbook or grimoire.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.Implements,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-amulet',
				name: 'Amulet',
				description: 'A magical symbol worn around the neck.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.Implements,
				location: ItemLocationType.Neck,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-staff',
				name: 'Staff',
				description: 'A magical walking stick.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.Implements,
				location: ItemLocationType.Hand,
				slots: 2,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-leather-armor',
				name: 'Leather Armor',
				description: 'Armor made of tanned animal skin.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LightArmor,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('leatherarmour-1', DamageCategoryType.Physical, 1)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-hide-armor',
				name: 'Hide Armor',
				description: 'The thick hide of a beast, used as armor.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LightArmor,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('hidearmour-1', DamageCategoryType.Physical, 2),
						FeatureLogic.createSkillCategoryFeature('hidearmour-2', SkillCategoryType.Physical, -1)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-brigandine-armor',
				name: 'Brigandine Armor',
				description: 'Armor made of small metal plates sewn into fabric.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LightArmor,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('brigandinearmour-1', DamageCategoryType.Physical, 3),
						FeatureLogic.createSkillCategoryFeature('brigandinearmour-2', SkillCategoryType.Physical, -1),
						FeatureLogic.createTraitFeature('brigandinearmour-3', TraitType.Speed, -1)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-breastplate',
				name: 'Breastplate',
				description: 'Armor for the torso, made of leather or metal.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.LightArmor,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('brigandinearmour-1', DamageCategoryType.Physical, 3),
						FeatureLogic.createSkillCategoryFeature('brigandinearmour-2', SkillCategoryType.Physical, -2)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-chain-armor',
				name: 'Chain Armor',
				description: 'Armor made of tiny interwoven metal rings.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.HeavyArmor,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('chainarmour-1', DamageCategoryType.Physical, 4),
						FeatureLogic.createSkillCategoryFeature('chainarmour-2', SkillCategoryType.Physical, -2),
						FeatureLogic.createTraitFeature('chainarmour-3', TraitType.Speed, -1)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-plate-armor',
				name: 'Plate Armor',
				description: 'Armor made of jointed sheets of metal.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.HeavyArmor,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('platearmor-1', DamageCategoryType.Physical, 5),
						FeatureLogic.createSkillCategoryFeature('platearmor-2', SkillCategoryType.Physical, -2),
						FeatureLogic.createTraitFeature('platearmor-3', TraitType.Speed, -2)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-shield',
				name: 'Shield',
				description: 'A small shield, often worn strapped to the arm.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.Shields,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('shield-1', DamageCategoryType.Physical, 1)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-tower-shield',
				name: 'Tower shield',
				description: 'A larger shield, more protective but cumbersome.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.Shields,
				location: ItemLocationType.Hand,
				slots: 1,
				weapon: null,
				armor: {
					features: [
						FeatureLogic.createDamageCategoryResistFeature('towershield-1', DamageCategoryType.Physical, 2),
						FeatureLogic.createSkillCategoryFeature('towershield-2', SkillCategoryType.Physical, -1)
					]
				},
				features: [],
				actions: []
			},
			{
				id: 'item-helm',
				name: 'Helm',
				description: 'Ornamental headware.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Head,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-circlet',
				name: 'Circlet',
				description: 'Ornamental headware.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Head,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-crown',
				name: 'Crown',
				description: 'Ornamental headware.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Head,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-tiara',
				name: 'Tiara',
				description: 'Ornamental headware.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Head,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-diadem',
				name: 'Diadem',
				description: 'Ornamental headware.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Head,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-belt',
				name: 'Belt',
				description: 'Leather strip worn around the waist.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-sash',
				name: 'Sash',
				description: 'Strip of fabric worn across the body.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-bandolier',
				name: 'Bandolier',
				description: 'A belt or sash with pockets.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Body,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-cloak',
				name: 'Cloak',
				description: 'Garment which is fastened around the shoulders, sometimes magical.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Neck,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-torc',
				name: 'Torc',
				description: 'Ornamental neckwear.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Neck,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-necklace',
				name: 'Necklace',
				description: 'Ornamental neckwear.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Neck,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-ring',
				name: 'Ring',
				description: 'Worn on the fingers.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Ring,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			},
			{
				id: 'item-boots',
				name: 'Boots',
				description: 'Footwear.',
				baseItem: '',
				magic: false,
				proficiency: ItemProficiencyType.None,
				location: ItemLocationType.Feet,
				slots: 1,
				weapon: null,
				armor: null,
				features: [],
				actions: []
			}
		];
	};
}
