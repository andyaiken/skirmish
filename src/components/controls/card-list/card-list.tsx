import { Component, ReactNode } from 'react';

import './card-list.scss';

interface Props {
	cards: ReactNode[];
}

export class CardList extends Component<Props> {
	render = () => {
		try {
			return (
				<div className='card-list'>
					{this.props.cards.map((card, n) => <div key={n} className='card-container'>{ card }</div>)}
				</div>
			);
		} catch {
			return <div className='card-list render-error' />;
		}
	};
}
