import { Random } from './random';

export class Collections {
	static shuffle = <T>(collection: T[]) => {
		let currentIndex = collection.length;
		while (currentIndex !== 0) {
			const randomIndex = Random.randomNumber(currentIndex);
			currentIndex -= 1;

			const temporaryValue = collection[currentIndex];
			collection[currentIndex] = collection[randomIndex];
			collection[randomIndex] = temporaryValue;
		}

		return collection;
	};

	static draw = <T>(collection: T[]) => {
		const index = Random.randomNumber(collection.length);
		return collection[index];
	};

	static distinct = <T>(collection: T[], key: (item: T) => string) => {
		const seen = new Set();
		return collection.filter(item => {
			const k = key(item);
			return seen.has(k) ? false : seen.add(k);
		});
	};
}
