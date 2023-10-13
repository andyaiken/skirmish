import type { PackModel } from '../models/pack';

import { Collections } from '../utils/collections';

export class PackData {
	static arcana = (): PackModel => ({
		id: 'pack-01',
		name: 'Codex Arcanum',
		description: 'Discover new ways to channel magic with the cards in this pack.'
	});

	static skullduggery = (): PackModel => ({
		id: 'pack-02',
		name: 'Guile and Cunning',
		description: 'A collection of cards for those who fight with skullduggery rather than valor.'
	});

	static elements = (): PackModel => ({
		id: 'pack-03',
		name: 'The Elements',
		description: 'Become the master of the four elements with this pack.'
	});

	static beasts = (): PackModel => ({
		id: 'pack-04',
		name: 'The Menagerie',
		description: 'This beast-themed collection contains dangerous new species.'
	});

	static undead = (): PackModel => ({
		id: 'pack-05',
		name: 'Out of the Grave',
		description: 'Add a touch of gothic horror to your game with this pack.'
	});

	static technology = (): PackModel => ({
		id: 'pack-06',
		name: 'The Workshop',
		description: 'The cards in this pack showcase marvels of engineering and ingenuity.'
	});

	static faith = (): PackModel => ({
		id: 'pack-07',
		name: 'Power and Glory',
		description: 'These cards bring the majesty of the divine to your game.'
	});

	static potions = (): PackModel => ({
		id: 'pack-08',
		name: 'Magic in a Glass',
		description: 'These cards add magical potions to the game.'
	});

	static fae = (): PackModel => ({
		id: 'pack-09',
		name: 'The Fae Realm',
		description: 'Bring the beguiling wonder of the fae into your game with this pack.'
	});

	static coldBlood = (): PackModel => ({
		id: 'pack-10',
		name: 'Cold Blood',
		description: 'Sinister cold-blooded creatures stalk this pack.'
	});

	static getList = (): PackModel[] => {
		const list = [
			PackData.arcana(),
			PackData.skullduggery(),
			PackData.elements(),
			PackData.beasts(),
			PackData.undead(),
			PackData.technology(),
			PackData.faith(),
			PackData.potions(),
			PackData.fae(),
			PackData.coldBlood()
		];

		return Collections.sort(list, n => n.name);
	};
}
