import { Component, ReactNode } from 'react';

import { Keyboard } from '../../../utils/keyboard/keyboard';

import './tabs.scss';

interface Props {
	// A label names a tab whose display is only an icon, for a screen reader and as a tooltip.
	options: { id: string; display?: ReactNode | string; label?: string }[];
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
				<div
					key={option.id}
					className={className}
					{...Keyboard.clickable(true, 'tab')}
					aria-selected={option.id === this.props.selectedID}
					aria-label={option.label}
					title={option.label}
					onClick={() => this.props.onSelect(option.id)}
				>
					{ option.display ?? option.id }
				</div>
			);
		});

		return (
			<div className='tabs' role='tablist'>
				<div className='spacer' />
				{ options }
				<div className='spacer' />
			</div>
		);
	};
}
