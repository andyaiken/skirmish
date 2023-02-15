import { randomNumber } from './random';

export const shuffle = <T>(collection: T[]) => {
	let currentIndex = collection.length;
	while (currentIndex !== 0) {
		const randomIndex = randomNumber(currentIndex);
		currentIndex -= 1;

		const temporaryValue = collection[currentIndex];
		collection[currentIndex] = collection[randomIndex];
		collection[randomIndex] = temporaryValue;
	}

	return collection;
};

export const draw = <T>(collection: T[]) => {
	const index = randomNumber(collection.length);
	return collection[index];
};
