export class HashTable<T> {
	private size = 199;
	private data: Record<string, T>[] = [];

	hash = (key: string) => {
		const sum = key.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
		return sum % this.size;
	};

	insert = (key: string, value: T) => {
		const index = this.hash(key);

		if (!this.data[index]) {
			const rec: Record<string, T> = {};
			this.data[index] = rec;
		}

		this.data[index][key] = value;
	};

	search = (key: string) => {
		const index = this.hash(key);
		const rec = this.data[index];
		if (rec) {
			const value = rec[key];
			if (value !== undefined) {
				return value;
			}
		}

		return null;
	};

	reset = () => {
		this.data = [];
	};
}
