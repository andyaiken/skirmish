import { Random } from './random';

export class Utils {
	static guid = (): string => {
		const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
		let id = '';
		while (id.length < 16) {
			const n = Random.randomNumber(letters.length);
			id += letters[n];
		}
		return id;
	};

	static debounce = (func: () => void, delay = 500) => {
		let timeout: NodeJS.Timeout;
		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(func, delay);
		};
	};
}
