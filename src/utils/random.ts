export const randomNumber = (max: number) => {
	if (max <= 0) {
		return 0;
	}

	// tslint:disable-next-line: insecure-random
	return Math.floor(Math.random() * max);
}

export const randomBoolean = () => {
	return randomNumber(2) === 0;
}

export const randomDecimal = () => {
	return randomNumber(100) / 100;
}
