import { randomNumber } from './random';

export const guid = () => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	let id = '';
	while (id.length < 16) {
		const n = randomNumber(letters.length);
		id += letters[n];
	}
	return id;
}

export const getHashCode = (str: string) => {
	if (str.length === 0) {
		return 0;
	}

	let hash = 0;
	for (let i = 0; i < str.length; ++i) {
		const chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return Math.abs(hash);
}

export const debounce = (func: () => void, delay = 500) => {
	let timeout: NodeJS.Timeout;
	return () => {
		clearTimeout(timeout);
		timeout = setTimeout(func, delay);
	};
}
