import { DamageCategoryType } from '../enums/damage-category-type';
import { FeatureType } from '../enums/feature-type';
import { ItemLocationType } from '../enums/item-location-type';
import { ItemProficiencyType } from '../enums/item-proficiency-type';
import { SkillCategoryType } from '../enums/skill-category-type';
import { SkillType } from '../enums/skill-type';
import { TraitType } from '../enums/trait-type';

import type { ArmorModel, ItemModel, WeaponModel } from '../models/item';
import type { FeatureModel } from '../models/feature';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { FeatureLogic } from '../logic/feature-logic';
import { GameLogic } from '../logic/game-logic';
import { NameGenerator } from './name-generator';

export class MagicItemGenerator {
	static generateMagicItem = (baseItem: ItemModel, packIDs: string[]) => {
		const item = MagicItemGenerator.convertToMagicItem(baseItem);
		return MagicItemGenerator.addMagicItemFeature(item, packIDs);
	};

	static generateRandomMagicItem = (packIDs: string[]) => {
		const baseItem = Collections.draw(GameLogic.getItemDeck(packIDs));
		const item = MagicItemGenerator.convertToMagicItem(baseItem);
		return MagicItemGenerator.addMagicItemFeature(item, packIDs);
	};

	static convertToMagicItem = (baseItem: ItemModel) => {
		if (baseItem.magic) {
			return baseItem;
		}

		const item = JSON.parse(JSON.stringify(baseItem)) as ItemModel;
		item.id = Utils.guid();
		item.name = NameGenerator.generateName();
		item.description = `Magical ${baseItem.name.toLowerCase()}`;
		item.baseItem = baseItem.name;
		item.magic = true;
		return item;
	};

	static addMagicItemFeature = (item: ItemModel, packIDs: string[]) => {
		const options: ItemModel[] = [];

		if (item.weapon) {
			// Increase damage rank
			const copyW1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn1 = copyW1.weapon as WeaponModel;
			const dmg = Collections.draw(wpn1.damage);
			dmg.rank += Random.randomBonus();
			options.push(copyW1);

			// Increase range
			const copyW2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn2 = copyW2.weapon as WeaponModel;
			if (wpn2.range <= 1) {
				wpn2.range += 1;
			} else {
				wpn2.range += Math.floor(wpn2.range * Random.randomBonus() / 10);
			}
			options.push(copyW2);

			// Add an additional damage type
			const copyW3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn3 = copyW3.weapon as WeaponModel;
			wpn3.damage.push({
				type: GameLogic.getRandomDamageType(Random.randomBoolean() ? DamageCategoryType.Energy : DamageCategoryType.Corruption),
				rank: Random.randomBonus()
			});
			options.push(copyW3);

			// Increase Weapon skill
			const copyW4 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyW4.features.push(FeatureLogic.createSkillFeature(Utils.guid(), SkillType.Weapon, Random.randomBonus()));
			options.push(copyW4);

			// Negate unreliability
			if (item.weapon.unreliable > 0) {
				const copyW5 = JSON.parse(JSON.stringify(item)) as ItemModel;
				const wpn5 = copyW5.weapon as WeaponModel;
				wpn5.unreliable = 0;
				options.push(copyW5);
			}
		}

		if (item.armor) {
			// Increase damage resistance rank
			const copyA1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const arm1 = copyA1.armor as ArmorModel;
			const f1 = arm1.features.find(f => f.type === FeatureType.DamageCategoryResist);
			if (f1) {
				f1.rank += Random.randomBonus();
				options.push(copyA1);
			}

			// Apply damage resistance to more damage categories
			const copyA2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const arm2 = copyA2.armor as ArmorModel;
			const f2 = arm2.features.find(f => f.type === FeatureType.DamageCategoryResist);
			if (f2) {
				const f2Copy = JSON.parse(JSON.stringify(f2)) as FeatureModel;
				f2Copy.id = Utils.guid();
				f2Copy.damageCategory = Random.randomBoolean() ? DamageCategoryType.Energy : DamageCategoryType.Corruption;
				arm2.features.push(f2Copy);
				options.push(copyA2);
			}

			// Negate skill penalty
			const copyA3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const arm3 = copyA3.armor as ArmorModel;
			const f3 = arm3.features.find(f => f.type === FeatureType.SkillCategory);
			if (f3) {
				arm3.features = arm3.features.filter(f => f.id !== f3.id);
				options.push(copyA3);
			}

			// Negate speed penalty
			const copyA4 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const arm4 = copyA4.armor as ArmorModel;
			const f4 = arm4.features.find(f => f.type === FeatureType.Trait);
			if (f4) {
				arm4.features = arm4.features.filter(f => f.id !== f4.id);
				options.push(copyA4);
			}
		}

		if (item.proficiency === ItemProficiencyType.Implements) {
			// Increase Spellcasting skill
			const copyI1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyI1.features.push(FeatureLogic.createSkillFeature(Utils.guid(), SkillType.Spellcasting, Random.randomBonus()));
			options.push(copyI1);

			// Increase Energy damage
			const copyI2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyI2.features.push(FeatureLogic.createDamageCategoryBonusFeature(Utils.guid(), DamageCategoryType.Energy, Random.randomBonus()));
			options.push(copyI2);

			// Increase Corruption damage
			const copyI3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyI3.features.push(FeatureLogic.createDamageCategoryBonusFeature(Utils.guid(), DamageCategoryType.Corruption, Random.randomBonus()));
			options.push(copyI3);
		}

		item.features.filter(f => f.rank < 0).forEach(penalty => {
			// Negate the penalty
			const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy.features = copy.features.filter(f => f.id !== penalty.id);
			options.push(copy);
		});

		if (item.location === ItemLocationType.Head) {
			// Increase a mental skill
			const copyH1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyH1.features.push(FeatureLogic.createSkillFeature(Utils.guid(), GameLogic.getRandomSkill(SkillCategoryType.Mental), Random.randomBonus()));
			options.push(copyH1);

			// Increase all physical or mental skills
			const copyH2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyH2.features.push(FeatureLogic.createSkillCategoryFeature(Utils.guid(), Random.randomBoolean() ? SkillCategoryType.Physical : SkillCategoryType.Mental, Random.randomBonus()));
			options.push(copyH2);

			// Increase Resolve
			const copyH3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyH3.features.push(FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Resolve, Random.randomBonus()));
			options.push(copyH3);
		}

		if (item.location === ItemLocationType.Feet) {
			// Increase Speed
			const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy.features.push(FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Speed, Random.randomBonus()));
			options.push(copy);
		}

		if (item.location === ItemLocationType.Neck) {
			// Increase Endurance
			const copyN1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyN1.features.push(FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Speed, Random.randomBonus()));
			options.push(copyN1);

			// Increase Resolve
			const copyN2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyN2.features.push(FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Resolve, Random.randomBonus()));
			options.push(copyN2);
		}

		// A random feature
		const copyFeature = JSON.parse(JSON.stringify(item)) as ItemModel;
		copyFeature.id = Utils.guid();
		copyFeature.features.push(FeatureLogic.createRandomFeature());
		options.push(copyFeature);

		// A random action
		const copyAction = JSON.parse(JSON.stringify(item)) as ItemModel;
		copyAction.id = Utils.guid();
		copyAction.actions.push(GameLogic.getRandomAction(item, packIDs));
		options.push(copyAction);

		if (options.length === 0) {
			return item;
		}

		return Collections.draw(options);
	};
}
