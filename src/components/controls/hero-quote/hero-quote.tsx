import type { ReactNode } from 'react';

import type { CombatantModel } from '../../../models/combatant';

import { Text, TextType } from '../text/text';
import { MiniToken } from '../../panels/encounter-map/mini-token/mini-token';

import './hero-quote.scss';

interface Props {
	hero: CombatantModel;
	text: string;
	action?: ReactNode;
}

export const HeroQuote = ({ hero, text, action }: Props) => (
	<div className='hero-quote'>
		<MiniToken
			combatant={hero}
			encounter={null}
			squareSize={48}
			mapDimensions={{ left: 0, top: 0 }}
			selectable={false}
			selected={false}
			onClick={() => undefined}
		/>
		<span><b>{hero.name}</b> says:</span>
		<Text type={TextType.Quote}>“{text}”</Text>
		{action ? <div className='hero-quote-action'>{action}</div> : null}
	</div>
);
