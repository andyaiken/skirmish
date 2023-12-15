import { Component } from 'react';

import './card-list.scss';

interface Props {
	mode: 'grid' | 'row';
	cards: (JSX.Element | null)[];
}

export class CardList extends Component<Props> {
	static defaultProps = {
		mode: 'grid'
	};

	render = () => {
		try {
			return (
				<div className={`card-list ${this.props.mode}`}>
					{this.props.cards.map((card, n) => <div key={n} className='card-container'>{ card }</div>)}
				</div>
			);
		} catch {
			return <div className='card-list render-error' />;
		}
	};
}
