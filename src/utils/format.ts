export class Format {
	static toSize = (value: number) => {
		let str = `${value} b`;

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
}
