import { v4 as uuid4 } from 'uuid';

export class Utils {
	public static guid(): string {
		return uuid4();
	}

	public static sort<T>(collection: T[], sorts: { field: string, dir: 'asc' | 'desc' }[] = []) {
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

	public static shuffle<T>(collection: T[]) {
		let currentIndex = collection.length;
		while (0 !== currentIndex) {
			const randomIndex = Utils.randomNumber(currentIndex);
			currentIndex -= 1;

			const temporaryValue = collection[currentIndex];
			collection[currentIndex] = collection[randomIndex];
			collection[randomIndex] = temporaryValue;
		}

		return collection;
	}

	public static draw<T>(collection: T[]): T {
		const index = Utils.randomNumber(collection.length);
		return collection[index];
	}

	public static debounce(func: () => void, delay: number = 500) {
		let timeout: NodeJS.Timeout;
		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(func, delay);
		};
	}

	public static randomNumber(max: number) {
		if (max <= 0) {
			return 0;
		}

		// tslint:disable-next-line: insecure-random
		return Math.floor(Math.random() * max);
	}

	public static randomBoolean() {
		return Utils.randomNumber(2) === 0;
	}

	public static randomDecimal() {
		return Utils.randomNumber(100) / 100;
	}
}
