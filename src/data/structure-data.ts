import { PackData } from './pack-data';

import { StructureType } from '../enums/structure-type';

import type { StructureModel } from '../models/structure';

import { Collections } from '../utils/collections';

export class StructureData {
	static barracks = (): StructureModel => ({
		id: 'structure-barracks',
		type: StructureType.Barracks,
		name: 'Barracks',
		packID: '',
		description: 'A place for heroes to live.',
		position: { x: 0, y: 0 },
		level: 0,
		charges: 0
	});

	static warehouse = (): StructureModel => ({
		id: 'structure-warehouse',
		type: StructureType.Warehouse,
		name: 'Warehouse',
		packID: '',
		description: 'A place to store unused equipment.',
		position: { x: 0, y: 0 },
		level: 0,
		charges: 0
	});

	static academy = (): StructureModel => ({
		id: 'structure-academy',
		type: StructureType.Academy,
		name: 'Academy',
		packID: '',
		description: 'The military academy is a place for heroes to become the best they can be.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static forge = (): StructureModel => ({
		id: 'structure-forge',
		type: StructureType.Forge,
		name: 'Forge',
		packID: PackData.technology().id,
		description: 'Forges contain materials for building strongholds.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static recruitment = (): StructureModel => ({
		id: 'structure-recruitment',
		type: StructureType.Hall,
		name: 'Recruitment Hall',
		packID: '',
		description: 'This building is used to attract new heroes to join the company.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static intelligencer = (): StructureModel => ({
		id: 'structure-intelligencer',
		type: StructureType.Intelligencer,
		name: 'Intelligencer',
		packID: PackData.skullduggery().id,
		description: 'In this building, a spymaster devises schemes to undermine the enemy.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static observatory = (): StructureModel => ({
		id: 'structure-observatory',
		type: StructureType.Observatory,
		name: 'Observatory',
		packID: PackData.arcana().id,
		description: 'By observing the stars, an astrologer can sometimes manipulate the fates.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static quartermaster = (): StructureModel => ({
		id: 'structure-quartermaster',
		type: StructureType.Quartermaster,
		name: 'Quartermaster',
		packID: '',
		description: 'The quartermaster requisitions and maintains equipment.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static temple = (): StructureModel => ({
		id: 'structure-temple',
		type: StructureType.Temple,
		name: 'Temple',
		packID: PackData.faith().id,
		description: 'A place for heroes to pray to their gods for good fortune.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static thief = (): StructureModel => ({
		id: 'structure-thief',
		type: StructureType.ThievesGuild,
		name: 'Thieves\' Guild',
		packID: PackData.skullduggery().id,
		description: 'This nondescript structure houses those who utilize every possible advantage.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static training = (): StructureModel => ({
		id: 'structure-training',
		type: StructureType.TrainingGround,
		name: 'Training Ground',
		packID: '',
		description: 'A place for heroes of all kinds to improve their abilities.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static warRoom = (): StructureModel => ({
		id: 'structure-war-room',
		type: StructureType.WarRoom,
		name: 'War Room',
		packID: '',
		description: 'Inside this heavily-guarded building, strategies are formulated.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static wizard = (): StructureModel => ({
		id: 'structure-wizard',
		type: StructureType.WizardTower,
		name: 'Wizard Tower',
		packID: '',
		description: 'A wizard\'s tower is often full of mysterious items.',
		position: { x: 0, y: 0 },
		level: 1,
		charges: 0
	});

	static getList = (): StructureModel[] => {
		const list = [
			StructureData.barracks(),
			StructureData.warehouse(),
			StructureData.academy(),
			StructureData.forge(),
			StructureData.recruitment(),
			StructureData.intelligencer(),
			StructureData.observatory(),
			StructureData.quartermaster(),
			StructureData.temple(),
			StructureData.thief(),
			StructureData.training(),
			StructureData.warRoom(),
			StructureData.wizard()
		];

		return Collections.sort(list, n => n.name);
	};
}
