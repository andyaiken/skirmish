import { randomNumber } from './random';

export const guid = () => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	let id = '';
	while (id.length < 10) {
		const n = randomNumber(letters.length);
		id += letters[n];
	}
	return id;
}

export const debounce = (func: () => void, delay: number = 500) => {
	let timeout: NodeJS.Timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(func, delay);
	};
}
