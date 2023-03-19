export interface IntentModel {
	id: string;
	data: unknown;
}

export interface IntentsModel {
	description: string;
	intents: IntentModel[];
	weight: number;
}
