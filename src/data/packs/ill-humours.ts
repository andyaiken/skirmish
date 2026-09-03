import { PackModel } from '../../models/pack';
import { StructureType } from '../../enums/structure-type';

export const illHumours = (): PackModel => ({
	id: 'pack-ill-humours',
	name: 'Ill Humours',
	description: 'Some things are cured. Others are merely passed on.',
	species: [],
	roles: [],
	backgrounds: [],
	items: [],
	potions: [],
	structures: [
		{
			id: 'structure-sanatorium',
			type: StructureType.Sanatorium,
			name: 'Sanatorium',
			description: 'A quiet place to be put back together.',
			position: { x: 0, y: 0 },
			level: 1,
			charges: 0
		}
	]
});
