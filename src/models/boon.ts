import { draw } from '../utils/collections';

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
		return draw(list);
	}
}
