import { BackgroundData } from '../data/background-data';
import { HeroSpeciesData } from '../data/hero-species-data';
import { ItemData } from '../data/item-data';
import { MonsterSpeciesData } from '../data/monster-species-data';
import { PackData } from '../data/pack-data';
import { PotionData } from '../data/potion-data';
import { RoleData } from '../data/role-data';
import { StructureData } from '../data/structure-data';

export class PackLogic {
	static getPacks = () => {
		return PackData.getList();
	};

	static getPackCardCount = (packID: string) => {
		let count = 0;

		count += HeroSpeciesData.getList().filter(s => s.packID === packID).length;
		count += MonsterSpeciesData.getList().filter(s => s.packID === packID).length;
		count += RoleData.getList().filter(r => r.packID === packID).length;
		count += BackgroundData.getList().filter(b => b.packID === packID).length;
		count += ItemData.getList().filter(i => i.packID === packID).length;
		count += PotionData.getList().filter(i => i.packID === packID).length;
		count += StructureData.getList().filter(s => s.packID === packID).length;

		return count;
	};
}
