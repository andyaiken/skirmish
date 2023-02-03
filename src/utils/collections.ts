import { randomNumber } from './random';

export const sort = (collection: any[], sorts: { field: string, dir: 'asc' | 'desc' }[] = []) => {
	if (sorts.length === 0) {
		sorts = [{ field: 'name', dir: 'asc' }];
	}

	const fn = (a: any, b: any, field: string): number => {
		if ((a[field] !== undefined) && (b[field] !== undefined)) {
			if (a[field] < b[field]) { return -1; }
			if (a[field] > b[field]) { return 1; }
		}
		return 0;
	};

	collection.sort((a, b) => {
		let order = 0;
		sorts.forEach(sort => {
			if (order === 0) {
				order = fn(a, b, sort.field) * (sort.dir === 'asc' ? 1 : -1);
			}
		});
		return order;
	});

	return collection;
}

export const shuffle = (collection: any[]) => {
	let currentIndex = collection.length;
	while (0 !== currentIndex) {
		const randomIndex = randomNumber(currentIndex);
		currentIndex -= 1;

		const temporaryValue = collection[currentIndex];
		collection[currentIndex] = collection[randomIndex];
		collection[randomIndex] = temporaryValue;
	}

	return collection;
}

export const draw = (collection: any[]) => {
	const index = randomNumber(collection.length);
	return collection[index];
}
