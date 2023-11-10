import './card-list.scss';

interface Props {
	cards: (JSX.Element | null)[];
}

export const CardList = (props: Props) => {
	try {
		return (
			<div className='card-list'>
				{props.cards.map((card, n) => <div key={n} className='card-container'>{ card }</div>)}
			</div>
		);
	} catch {
		return <div className='card-list render-error' />;
	}
};
