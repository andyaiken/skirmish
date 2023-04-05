import { BoonType } from '../enums/boon-type';

import { BoonModel } from '../models/boon';

import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { MagicItemGenerator } from './magic-item-generator';

export class BoonGenerator {
	static generateBoon = (): BoonModel => {
		let type = BoonType.ExtraHero;
		switch (Random.randomNumber(13)) {
			case 0:
			case 1:
			case 2:
				type = BoonType.ExtraHero;
				break;
			case 3:
			case 4:
			case 5:
				type = BoonType.ExtraXP;
				break;
			case 6:
			case 7:
			case 8:
				type = BoonType.LevelUp;
				break;
			case 9:
			case 10:
			case 11:
				type = BoonType.Money;
				break;
			case 12:
				type = BoonType.MagicItem;
				break;
		}

		let data = null;
		switch (type) {
			case BoonType.MagicItem:
				data = MagicItemGenerator.generateMagicItem();
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
