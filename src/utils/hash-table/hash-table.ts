export class HashTable<T> {
	private data = new Map<string, T>();

	insert = (key: string, value: T) => {
		this.data.set(key, value);
	};

	search = (key: string) => {
		const value = this.data.get(key);
		return (value !== undefined) ? value : null;
	};

	reset = () => {
		this.data.clear();
	};
}
