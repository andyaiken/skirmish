import { draw } from '../utils/collections';
import { dice } from '../utils/random';
import { guid } from '../utils/utils';
import { ItemModel, generateMagicItem } from './item';

export enum BoonType {
	ExtraHero = 'Extra hero',
	ExtraXP = 'Extra XP',
	LevelUp = 'Level up',
	MagicItem = 'Magic item'
}

export interface BoonModel {
	id: string;
	type: BoonType;
	data: ItemModel | number | null;
}

export const generateBoon = (): BoonModel => {
	const list = [
		BoonType.ExtraHero,
		BoonType.ExtraXP,
		BoonType.LevelUp,
		BoonType.MagicItem
	];
	const type = draw(list);

	let data = null;
	switch (type) {
		case BoonType.MagicItem:
			data = generateMagicItem();
			break;
		case BoonType.ExtraXP:
			data = dice(1);
			break;
	}

	return {
		id: guid(),
		type: type,
		data: data
	};
};
