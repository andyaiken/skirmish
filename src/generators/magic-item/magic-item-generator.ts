import { DamageCategoryType } from '../../enums/damage-category-type';
import { FeatureType } from '../../enums/feature-type';
import { ItemLocationType } from '../../enums/item-location-type';
import { ItemProficiencyType } from '../../enums/item-proficiency-type';
import { SkillCategoryType } from '../../enums/skill-category-type';
import { SkillType } from '../../enums/skill-type';
import { TraitType } from '../../enums/trait-type';

import type { ArmorModel, ItemModel, WeaponModel } from '../../models/item';
import type { FeatureModel } from '../../models/feature';

import { Collections } from '../../utils/collections/collections';
import { Random } from '../../utils/random/random';
import { Utils } from '../../utils/utils/utils';

import { FeatureLogic } from '../../logic/feature/feature-logic';
import { GameLogic } from '../../logic/game/game-logic';
import { NameGenerator } from '../name/name-generator';

export class MagicItemGenerator {
	static generateMagicItem = (baseItem: ItemModel, packIDs: string[], rng: () => number) => {
		const item = MagicItemGenerator.convertToMagicItem(baseItem, rng);
		return MagicItemGenerator.addMagicItemFeature(item, packIDs, rng);
	};

	static generateRandomMagicItem = (packIDs: string[], rng: () => number) => {
		const baseItem = Collections.draw(GameLogic.getItemDeck(packIDs), rng);
		const item = MagicItemGenerator.convertToMagicItem(baseItem, rng);
		return MagicItemGenerator.addMagicItemFeature(item, packIDs, rng);
	};

	static convertToMagicItem = (baseItem: ItemModel, rng: () => number) => {
		if (baseItem.magic) {
			return baseItem;
		}

		const item = JSON.parse(JSON.stringify(baseItem)) as ItemModel;
		item.id = Utils.guid();
		item.name = NameGenerator.generateName(rng);
		item.description = `Magical ${baseItem.name.toLowerCase()}`;
		item.baseItem = baseItem.name;
		item.magic = true;
		return item;
	};

	static addFeature = (item: ItemModel, feature: FeatureModel) => {
		// If the item already has an equivalent feature, boost that rather than adding a duplicate
		const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
		const existing = copy.features.find(f => FeatureLogic.featuresAreEquivalent(f, feature));
		if (existing) {
			existing.rank += feature.rank;
		} else {
			copy.features.push(feature);
		}
		return copy;
	};

	static addMagicItemFeature = (item: ItemModel, packIDs: string[], rng: () => number) => {
		const options: ItemModel[] = [];

		if (item.weapon) {
			// Increase damage rank
			const copyW1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn1 = copyW1.weapon as WeaponModel;
			const dmg = Collections.draw(wpn1.damage, rng);
			dmg.rank += Random.randomBonus(rng);
			options.push(copyW1);

			// Increase range
			const copyW2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn2 = copyW2.weapon as WeaponModel;
			if (wpn2.range <= 1) {
				wpn2.range += 1;
			} else {
				wpn2.range += Math.floor(wpn2.range * Random.randomBonus(rng) / 10);
			}
			options.push(copyW2);

			// Add an additional damage type
			const copyW3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn3 = copyW3.weapon as WeaponModel;
			const category = Random.randomBoolean(rng) ? DamageCategoryType.Energy : DamageCategoryType.Corruption;
			const damageTypes = GameLogic.getDamageTypes(category).filter(dt => !wpn3.damage.find(d => d.type === dt));
			if (damageTypes.length > 0) {
				wpn3.damage.push({
					type: Collections.draw(damageTypes, rng),
					rank: Random.randomBonus(rng)
				});
				options.push(copyW3);
			}

			// Increase Weapon skill
			const copyW4 = MagicItemGenerator.addFeature(item, FeatureLogic.createSkillFeature(Utils.guid(), SkillType.Weapon, Random.randomBonus(rng)));
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
				f1.rank += Random.randomBonus(rng);
				options.push(copyA1);
			}

			// Apply damage resistance to more damage categories
			const copyA2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const arm2 = copyA2.armor as ArmorModel;
			const f2 = arm2.features.find(f => f.type === FeatureType.DamageCategoryResist);
			if (f2) {
				const f2Copy = JSON.parse(JSON.stringify(f2)) as FeatureModel;
				f2Copy.id = Utils.guid();
				f2Copy.damageCategory = Random.randomBoolean(rng) ? DamageCategoryType.Energy : DamageCategoryType.Corruption;
				// Only worth doing if this category isn't already resisted
				if (!arm2.features.find(f => FeatureLogic.featuresAreEquivalent(f, f2Copy))) {
					arm2.features.push(f2Copy);
					options.push(copyA2);
				}
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
			const copyI1 = MagicItemGenerator.addFeature(item, FeatureLogic.createSkillFeature(Utils.guid(), SkillType.Spellcasting, Random.randomBonus(rng)));
			options.push(copyI1);

			// Increase Energy damage
			const copyI2 = MagicItemGenerator.addFeature(item, FeatureLogic.createDamageCategoryBonusFeature(Utils.guid(), DamageCategoryType.Energy, Random.randomBonus(rng)));
			options.push(copyI2);

			// Increase Corruption damage
			const copyI3 = MagicItemGenerator.addFeature(item, FeatureLogic.createDamageCategoryBonusFeature(Utils.guid(), DamageCategoryType.Corruption, Random.randomBonus(rng)));
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
			const copyH1 = MagicItemGenerator.addFeature(item, FeatureLogic.createSkillFeature(Utils.guid(), GameLogic.getRandomSkill(SkillCategoryType.Mental), Random.randomBonus(rng)));
			options.push(copyH1);

			// Increase all physical or mental skills
			const skillCategory = Random.randomBoolean(rng) ? SkillCategoryType.Physical : SkillCategoryType.Mental;
			const copyH2 = MagicItemGenerator.addFeature(item, FeatureLogic.createSkillCategoryFeature(Utils.guid(), skillCategory, Random.randomBonus(rng)));
			options.push(copyH2);

			// Increase Resolve
			const copyH3 = MagicItemGenerator.addFeature(item, FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Resolve, Random.randomBonus(rng)));
			options.push(copyH3);
		}

		if (item.location === ItemLocationType.Feet) {
			// Increase Speed
			const copy = MagicItemGenerator.addFeature(item, FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Speed, Random.randomBonus(rng)));
			options.push(copy);
		}

		if (item.location === ItemLocationType.Neck) {
			// Increase Endurance
			const copyN1 = MagicItemGenerator.addFeature(item, FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Endurance, Random.randomBonus(rng)));
			options.push(copyN1);

			// Increase Resolve
			const copyN2 = MagicItemGenerator.addFeature(item, FeatureLogic.createTraitFeature(Utils.guid(), TraitType.Resolve, Random.randomBonus(rng)));
			options.push(copyN2);
		}

		// A random feature
		const randomFeature = FeatureLogic.createRandomFeature();
		const isDuplicate = !!item.features.find(f => FeatureLogic.featuresAreEquivalent(f, randomFeature));
		if (!isDuplicate || (randomFeature.rank !== 0)) {
			// A rank 0 duplicate (ie a proficiency the item already grants) would do nothing
			const copyFeature = MagicItemGenerator.addFeature(item, randomFeature);
			copyFeature.id = Utils.guid();
			options.push(copyFeature);
		}

		if (item.actions.length === 0) {
			// A random action
			const copyAction = JSON.parse(JSON.stringify(item)) as ItemModel;
			copyAction.id = Utils.guid();
			copyAction.actions.push(GameLogic.getRandomAction(item, packIDs));
			options.push(copyAction);
		}

		if (options.length === 0) {
			return item;
		}

		return Collections.draw(options, rng);
	};
}
