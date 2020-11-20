import { Utils } from '../utils/utils';

export enum BoonType {
	ExtraHero = 'Extra hero',
	ExtraXP = 'Extra XP',
	LevelUp = 'Level up',
	MagicItem = 'Magic item'
}

export class BoonHelper {
	public static getRandomBoon() {
		const list = [
			BoonType.ExtraHero,
			BoonType.ExtraXP,
			BoonType.LevelUp,
			BoonType.MagicItem
		];
		return Utils.draw(list);
	}
}
