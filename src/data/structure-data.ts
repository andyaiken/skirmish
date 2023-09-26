import { PackData } from './pack-data';

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

	static hall: StructureModel = {
		id: 'structure-hall',
		type: StructureType.Hall,
		name: 'Recruitment Hall',
		packID: '',
		description: 'This building is used to attract new heroes to join the company.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static quartermaster: StructureModel = {
		id: 'structure-quartermaster',
		type: StructureType.Quartermaster,
		name: 'Quartermaster',
		packID: '',
		description: 'The quartermaster requisitions and maintains equipment.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static training: StructureModel = {
		id: 'structure-training',
		type: StructureType.TrainingGround,
		name: 'Training Ground',
		packID: '',
		description: 'A place for heroes of all kinds to improve their abilities.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static observatory: StructureModel = {
		id: 'structure-observatory',
		type: StructureType.Observatory,
		name: 'Observatory',
		packID: PackData.arcana.id,
		description: 'By observing the stars, an astrologer can sometimes manipulate the fates.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static wizard: StructureModel = {
		id: 'structure-wizard',
		type: StructureType.WizardTower,
		name: 'Wizard Tower',
		packID: '',
		description: 'A wizard\'s tower is often full of mysterious items.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static stockpile: StructureModel = {
		id: 'structure-stockpile',
		type: StructureType.Stockpile,
		name: 'Stockpile',
		packID: PackData.technology.id,
		description: 'Stockpiles contain materials for building strongholds.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static temple: StructureModel = {
		id: 'structure-temple',
		type: StructureType.Temple,
		name: 'Temple',
		packID: PackData.faith.id,
		description: 'A place for heroes to pray to their gods for good fortune.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static intelligencer: StructureModel = {
		id: 'structure-intelligencer',
		type: StructureType.Intelligencer,
		name: 'Intelligencer',
		packID: PackData.skullduggery.id,
		description: 'In this building, a spymaster devises schemes to undermine the enemy.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	};

	static getList = (): StructureModel[] => {
		const list = [
			StructureData.barracks,
			StructureData.hall,
			StructureData.quartermaster,
			StructureData.training,
			StructureData.observatory,
			StructureData.wizard,
			StructureData.stockpile,
			StructureData.temple,
			StructureData.intelligencer
		];

		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	};
}
