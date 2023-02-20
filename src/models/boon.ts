import type { BoonType } from '../enums/boon-type';

import type { ItemModel } from './item';

export interface BoonModel {
	id: string;
	type: BoonType;
	data: ItemModel | number | null;
}
