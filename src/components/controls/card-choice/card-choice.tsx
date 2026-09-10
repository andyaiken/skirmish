import { ReactNode } from 'react';

import './card-choice.scss';

interface Props {
	card: ReactNode;
	label: ReactNode;
	onSelect: () => void;
}

// A card that is taken with the button beneath it rather than by clicking the card itself. That
// leaves the card's own click free to flip it, so its back can be read before choosing - which the
// small flip button in the card's footer never made obvious.
export const CardChoice = (props: Props) => {
	return (
		<div className='card-choice'>
			{props.card}
			<button onClick={props.onSelect}>{props.label}</button>
		</div>
	);
};
