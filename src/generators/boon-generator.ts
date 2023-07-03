import { BoonType } from '../enums/boon-type';

import { BoonModel } from '../models/boon';

import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { MagicItemGenerator } from './magic-item-generator';

export class BoonGenerator {
	static generateBoon = (packs: string[]): BoonModel => {
		let type = BoonType.ExtraHero;
		switch (Random.randomNumber(6)) {
			case 0:
				type = BoonType.ExtraHero;
				break;
			case 1:
				type = BoonType.ExtraXP;
				break;
			case 2:
				type = BoonType.LevelUp;
				break;
			case 3:
				type = BoonType.MagicItem;
				break;
			case 4:
				type = BoonType.Money;
				break;
			case 5:
				type = BoonType.EnchantItem;
				break;
		}

		let data = null;
		switch (type) {
			case BoonType.MagicItem:
				data = MagicItemGenerator.generateRandomMagicItem(packs);
				break;
			case BoonType.ExtraXP:
				data = Random.dice(5);
				break;
			case BoonType.Money:
				data = Random.dice(5) * 5;
				break;
		}

		return {
			id: Utils.guid(),
			type: type,
			data: data
		};
	};
}
