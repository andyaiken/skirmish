import type { ThoughtTemplate } from '../../models/thought';

import { characterThoughts } from './character-thoughts';
import { comradeThoughts } from './comrade-thoughts';
import { equipmentThoughts } from './equipment-thoughts';
import { islandThoughts } from './island-thoughts';
import { memoryThoughts } from './memory-thoughts';
import { musingThoughts } from './musing-thoughts';
import { strongholdThoughts } from './stronghold-thoughts';

export const allThoughts: ThoughtTemplate[] = [
	...memoryThoughts,
	...comradeThoughts,
	...strongholdThoughts,
	...islandThoughts,
	...equipmentThoughts,
	...characterThoughts,
	...musingThoughts
];
