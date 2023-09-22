import { StructureType } from '../enums/structure-type';

import type { StructureModel } from '../models/structure';

export class StructureData {
	static barracks: StructureModel = {
		id: 'structure-barracks',
		type: StructureType.Barracks,
		name: 'Barracks',
		packID: '',
		description: 'A place for heroes to live.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static getList = (): StructureModel[] => {
		const list = [
			StructureData.barracks
		];

		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	};
}
