export const dice = (count = 1) => {
	const rolls = [];

	while (rolls.length < count) {
		let result = 0;
		let rollAgain = true;

		while (rollAgain) {
			const n = randomNumber(10) + 1;
			result += n;
			rollAgain = (n === 10);
		}

		rolls.push(result);
	}

	return Math.max(...rolls);
}

export const randomNumber = (max: number) => {
	if (max <= 0) {
		return 0;
	}

	return Math.floor(Math.random() * max);
}

export const randomBoolean = () => {
	return randomNumber(2) === 0;
}

export const randomDecimal = () => {
	return randomNumber(100) / 100;
}
