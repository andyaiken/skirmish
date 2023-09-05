import type { PackModel } from '../models/pack';

export class PackData {
	static arcana: PackModel = {
		id: 'pack-1',
		name: 'Codex Arcanum',
		description: 'Discover new ways to channel magic with the cards in this pack.'
	};

	static skullduggery: PackModel = {
		id: 'pack-2',
		name: 'Skullduggery',
		description: 'A collection of cards for those who fight with cunning rather than valor.'
	};

	static elements: PackModel = {
		id: 'pack-3',
		name: 'The Elements',
		description: 'Become the master of the four elements with this pack.'
	};

	static beasts: PackModel = {
		id: 'pack-4',
		name: 'Menagerie',
		description: 'This beast-themed collection contains dangerous new species.'
	};

	static undead: PackModel = {
		id: 'pack-5',
		name: 'Out of the Grave',
		description: 'Add a touch of gothic horror to your game with this pack.'
	};

	static technology: PackModel = {
		id: 'pack-6',
		name: 'The Workshop',
		description: 'The cards in this pack showcase marvels of engineering and ingenuity.'
	};

	static faith: PackModel = {
		id: 'pack-7',
		name: 'Power and Glory',
		description: 'These cards bring the majesty of the divine to your game.'
	};

	static getList = (): PackModel[] => {
		const list = [
			PackData.arcana,
			PackData.skullduggery,
			PackData.elements,
			PackData.beasts,
			PackData.undead,
			PackData.technology,
			PackData.faith
		];

		list.sort((a, b) => a.name.localeCompare(b.name));
		return list;
	};
}
