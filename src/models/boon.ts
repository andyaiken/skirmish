import { draw } from '../utils/collections';
import { guid } from '../utils/utils';
import { generateMagicItem, Item } from './item';

export enum BoonType {
	ExtraHero = 'Extra hero',
	ExtraXP = 'Extra XP',
	LevelUp = 'Level up',
	MagicItem = 'Magic item'
}

export interface Boon {
	id: string;
	type: BoonType;
	data: Item | null;
}

export const generateBoon = (): Boon => {
	const list = [
		BoonType.ExtraHero,
		BoonType.ExtraXP,
		BoonType.LevelUp,
		BoonType.MagicItem
	];
	const type = draw(list);

	let data = null;
	if (type === BoonType.MagicItem) {
		data = generateMagicItem();
	}

	return {
		id: guid(),
		type: type,
		data: data
	};
}
