import { BoonType } from './enums';
import { ItemModel } from './item';

export interface BoonModel {
	id: string;
	type: BoonType;
	data: ItemModel | number | null;
}
