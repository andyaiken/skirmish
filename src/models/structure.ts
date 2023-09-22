import { StructureType } from '../enums/structure-type';

export interface StructureModel {
	id: string;
	type: StructureType;
	name: string;
	packID: string;
	description: string;
	position: {
		x: number;
		y: number;
	};
	level: number;
	charges: number;
}
