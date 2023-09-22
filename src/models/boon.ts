import type { BoonType } from '../enums/boon-type';

import type { ItemModel } from './item';
import type { StructureModel } from './structure';

export interface BoonModel {
	id: string;
	type: BoonType;
	data: ItemModel | StructureModel | number | null;
}
