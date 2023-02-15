import { Component } from 'react';

import './selector.scss';

interface Props {
	options: { id: string, display?: string | JSX.Element }[];
	selectedID: string;
	onSelect: (id: string) => void;
}

export class Selector extends Component<Props> {
	public static defaultProps = {
		selectedID: ''
	};

	public render = () => {
		const options = this.props.options.map(option => {
			const className = option.id === this.props.selectedID ? 'option selected' : 'option';
			return (
				<div key={option.id} className={className} onClick={() => this.props.onSelect(option.id)}>
					{ option.display ?? option.id }
				</div>
			);
		});

		return (
			<div className='selector'>
				{ options }
			</div>
		);
	};
}
