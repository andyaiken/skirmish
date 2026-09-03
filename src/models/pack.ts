import { BackgroundModel } from './background';
import { ItemModel } from './item';
import { RoleModel } from './role';
import { SpeciesModel } from './species';
import { StructureModel } from './structure';

export interface PackModel {
	id: string;
	name: string;
	description: string;
	species: SpeciesModel[];
	roles: RoleModel[];
	backgrounds: BackgroundModel[];
	items: ItemModel[];
	potions: ItemModel[];
	structures: StructureModel[];
}
