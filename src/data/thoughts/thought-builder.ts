import { ThoughtCategory } from '../../enums/thought-category';

import type { ThoughtBindings, ThoughtContext, ThoughtTemplate } from '../../models/thought';

// Each file of thoughts makes its own builder, so that a template's id says where to find it
export const createThoughtBuilder = (prefix: string) => {
	let count = 0;

	return (
		category: ThoughtCategory,
		when: (ctx: ThoughtContext) => ThoughtBindings | null,
		say: string[],
		weight: number | ((ctx: ThoughtContext) => number) = 1
	): ThoughtTemplate => {
		count += 1;
		return {
			id: `${prefix}-${count}`,
			category: category,
			weight: weight,
			when: when,
			say: say
		};
	};
};

export const lower = (text: string) => text.toLowerCase();

// "a ranger", "an alchemist"
export const withArticle = (text: string) => {
	return /^[aeiou]/i.test(text) ? `an ${text}` : `a ${text}`;
};
