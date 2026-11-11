import { Component, ReactNode } from 'react';

import { Keyboard } from '../../../utils/keyboard/keyboard';

import './selector.scss';

interface Props {
	options: { id: string; display?: ReactNode | string }[];
	columnCount: number;
	selectedID: string;
	// For a selector that switches between pages, such as the campaign screen's: it is then a
	// set of tabs, which is how it is announced, and the shoulder buttons on a controller step
	// through it (see Navigation.cycleTabs).
	tabs: boolean;
	onSelect: (id: string) => void;
}

export class Selector extends Component<Props> {
	static defaultProps = {
		columnCount: 0,
		selectedID: '',
		tabs: false
	};

	render = () => {
		const columns = `repeat(${this.props.columnCount > 0 ? this.props.columnCount : this.props.options.length}, 1fr)`;

		const options = this.props.options.map(option => {
			const className = option.id === this.props.selectedID ? 'option selected' : 'option';
			return (
				<div
					key={option.id}
					className={className}
					{...Keyboard.clickable(true, this.props.tabs ? 'tab' : 'radio')}
					aria-checked={this.props.tabs ? undefined : option.id === this.props.selectedID}
					aria-selected={this.props.tabs ? option.id === this.props.selectedID : undefined}
					onClick={() => this.props.onSelect(option.id)}
				>
					{ option.display ?? option.id }
				</div>
			);
		});

		return (
			<div className='selector' role={this.props.tabs ? 'tablist' : 'radiogroup'} style={{ gridTemplateColumns: columns }}>
				{ options }
			</div>
		);
	};
}
