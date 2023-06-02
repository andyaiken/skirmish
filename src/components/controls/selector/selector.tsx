import { Component } from 'react';

import './selector.scss';

interface Props {
	options: { id: string; display?: JSX.Element | string }[];
	columnCount: number;
	selectedID: string;
	onSelect: (id: string) => void;
}

export class Selector extends Component<Props> {
	static defaultProps = {
		columnCount: 0,
		selectedID: ''
	};

	render = () => {
		try {
			const columns = `repeat(${this.props.columnCount > 0 ? this.props.columnCount : this.props.options.length}, 1fr)`;

			const options = this.props.options.map(option => {
				const className = option.id === this.props.selectedID ? 'option selected' : 'option';
				return (
					<div key={option.id} className={className} onClick={() => this.props.onSelect(option.id)}>
						{ option.display ?? option.id }
					</div>
				);
			});

			return (
				<div className='selector' style={{ gridTemplateColumns: columns }}>
					{ options }
				</div>
			);
		} catch {
			return <div className='selector render-error' />;
		}
	};
}
