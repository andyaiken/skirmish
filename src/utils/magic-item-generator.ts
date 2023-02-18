import { ItemList } from '../data/item-data';
import { DamageCategoryType, SkillType, ItemProficiencyType, FeatureType, ItemLocationType, SkillCategoryType, TraitType } from '../models/enums';
import { ItemModel, WeaponModel } from '../models/item';
import { Collections } from './collections';
import { FeatureUtils } from './feature-utils';
import { getRandomDamageType, getRandomSkill, getRandomAction } from './game-logic';
import { NameGenerator } from './name-generator';
import { Random } from './random';
import { Utils } from './utils';

export class MagicItemGenerator {
	static generateMagicItem = (): ItemModel => {
		// Pick a random item from the item list
		const baseItem = Collections.draw(ItemList);

		const item = JSON.parse(JSON.stringify(baseItem)) as ItemModel;
		item.id = Utils.guid();
		item.baseItem = item.name;
		item.name = NameGenerator.generateName();
		item.magic = true;

		return MagicItemGenerator.addMagicItemFeature(item);
	};

	static addMagicItemFeature = (item: ItemModel) => {
		const options: ItemModel[] = [];

		if (item.weapon) {
			// Increase damage rank
			const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn1 = copy1.weapon as WeaponModel;
			wpn1.damage.rank += Random.randomBonus();
			options.push(copy1);

			// Increase range
			const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn2 = copy2.weapon as WeaponModel;
			if (wpn2.range === 0) {
				wpn2.range = 1;
			} else {
				wpn2.range += Math.floor(wpn2.range * Random.randomBonus() / 10);
			}
			options.push(copy2);

			// Change damage type
			const copy3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			const wpn3 = copy3.weapon as WeaponModel;
			wpn3.damage.type = getRandomDamageType(Random.randomBoolean() ? DamageCategoryType.Energy : DamageCategoryType.Corruption);
			options.push(copy3);

			// Increase Weapon skill
			const copy4 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy4.features.push(FeatureUtils.createSkillFeature(SkillType.Weapon, Random.randomBonus()));
			options.push(copy4);

			// Negate unreliability
			if (item.weapon.unreliable > 0) {
				const copy5 = JSON.parse(JSON.stringify(item)) as ItemModel;
				const wpn5 = copy5.weapon as WeaponModel;
				wpn5.unreliable = 0;
				options.push(copy5);
			}
		}

		if (item.proficiency === ItemProficiencyType.Implements) {
			// Increase Spellcasting skill
			const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy1.features.push(FeatureUtils.createSkillFeature(SkillType.Spellcasting, Random.randomBonus()));
			options.push(copy1);

			// Increase Energy damage
			const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy2.features.push(FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Energy, Random.randomBonus()));
			options.push(copy2);

			// Increase Corruption damage
			const copy3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy3.features.push(FeatureUtils.createDamageCategoryTypeBonusFeature(DamageCategoryType.Corruption, Random.randomBonus()));
			options.push(copy3);
		}

		if ((item.proficiency === ItemProficiencyType.LightArmor) || (item.proficiency === ItemProficiencyType.HeavyArmor) || (item.proficiency === ItemProficiencyType.Shields)) {
			// Increase damage resistance rank
			const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
			const feature = copy.features.find(f => f.type === FeatureType.DamageCategoryTypeResist);
			if (feature) {
				feature.rank += Random.randomBonus();
				options.push(copy);
			}
		}

		item.features.filter(f => f.rank < 0).forEach(penalty => {
			// Negate the penalty
			const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy.features = copy.features.filter(f => f.id !== penalty.id);
			options.push(copy);
		});

		if (item.location === ItemLocationType.Head) {
			// Increase a mental skill
			const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy1.features.push(FeatureUtils.createSkillFeature(getRandomSkill(SkillCategoryType.Mental), Random.randomBonus()));
			options.push(copy1);

			// Increase all physical or mental skills
			const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy2.features.push(FeatureUtils.createSkillCategoryFeature(Random.randomBoolean() ? SkillCategoryType.Physical : SkillCategoryType.Mental, Random.randomBonus()));
			options.push(copy2);

			// Increase Resolve
			const copy3 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy3.features.push(FeatureUtils.createTraitFeature(TraitType.Resolve, Random.randomBonus()));
			options.push(copy3);
		}

		if (item.location === ItemLocationType.Feet) {
			// Increase Speed
			const copy = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy.features.push(FeatureUtils.createTraitFeature(TraitType.Speed, Random.randomBonus()));
			options.push(copy);
		}

		if (item.location === ItemLocationType.Neck) {
			// Increase Endurance
			const copy1 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy1.features.push(FeatureUtils.createTraitFeature(TraitType.Speed, Random.randomBonus()));
			options.push(copy1);

			// Increase Resolve
			const copy2 = JSON.parse(JSON.stringify(item)) as ItemModel;
			copy2.features.push(FeatureUtils.createTraitFeature(TraitType.Resolve, Random.randomBonus()));
			options.push(copy2);
		}

		// A random feature
		const copyFeature = JSON.parse(JSON.stringify(item)) as ItemModel;
		copyFeature.features.push(FeatureUtils.createRandomFeature());
		options.push(copyFeature);

		// a random action
		const copyAction = JSON.parse(JSON.stringify(item)) as ItemModel;
		copyAction.actions.push(getRandomAction());
		options.push(copyFeature);

		const n = Random.randomNumber(options.length);
		return options[n];
	};
}
