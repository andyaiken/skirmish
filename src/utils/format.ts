export class Format {
	static capitalize = (text: string) => {
		return text
			.split(' ')
			.filter(token => token.length > 0)
			.map(token => {
				if (token.length === 0) {
					return '';
				}

				return `${token[0].toUpperCase()}${token.substring(1)}`;
			})
			.join(' ');
	};

	static toText = (value: number) => {
		return value.toLocaleString();
	};

	static toSize = (value: number) => {
		let str = `${value} B`;

		if (value > 1024) {
			value /= 1024;
			str = `${value.toFixed(2)} kB`;
		}

		if (value > 1024) {
			value /= 1024;
			str = `${value.toFixed(2)} MB`;
		}

		if (value > 1024) {
			value /= 1024;
			str = `${value.toFixed(2)} GB`;
		}

		return str;
	};

	static toCurrency = (value: number, symbol: string) => {
		if (value <= 0) {
			return 'FREE';
		}

		return `${symbol}${value.toFixed(2)}`;
	};
}
