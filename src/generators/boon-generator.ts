import { BoonType } from '../enums/boon-type';

import { GameLogic } from '../logic/game-logic';
import { StrongholdLogic } from '../logic/stronghold-logic';

import { BoonModel } from '../models/boon';

import { Collections } from '../utils/collections';
import { Random } from '../utils/random';
import { Utils } from '../utils/utils';

import { MagicItemGenerator } from './magic-item-generator';

export class BoonGenerator {
	static generateBoon = (packIDs: string[]): BoonModel => {
		let type = BoonType.ExtraHero;
		switch (Random.randomNumber(7)) {
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
			case 6:
				type = BoonType.Structure;
				break;
		}

		let data = null;
		switch (type) {
			case BoonType.MagicItem:
				data = MagicItemGenerator.generateRandomMagicItem(packIDs);
				break;
			case BoonType.ExtraXP:
				data = Random.dice(5);
				break;
			case BoonType.Money:
				data = Random.dice(5) * 5;
				break;
			case BoonType.Structure:
				data = Collections.draw(GameLogic.getStructureDeck(packIDs).filter(s => !StrongholdLogic.canCharge(s)));
				break;
		}

		return {
			id: Utils.guid(),
			type: type,
			data: data
		};
	};
}
