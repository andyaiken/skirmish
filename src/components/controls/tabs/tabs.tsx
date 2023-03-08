import { Component } from 'react';

import './tabs.scss';

interface Props {
	options: { id: string; display?: JSX.Element | string }[];
	selectedID: string;
	onSelect: (id: string) => void;
}

export class Tabs extends Component<Props> {
	static defaultProps = {
		selectedID: ''
	};

	render = () => {
		const options = this.props.options.map(option => {
			const className = option.id === this.props.selectedID ? 'option selected' : 'option';
			return (
				<div key={option.id} className={className} onClick={() => this.props.onSelect(option.id)}>
					{ option.display ?? option.id }
				</div>
			);
		});

		return (
			<div className='tabs'>
				<div className='spacer' />
				{ options }
				<div className='spacer' />
			</div>
		);
	};
}
