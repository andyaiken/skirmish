import { Component } from 'react';

import { Text } from '../../controls';

import './confirm-button.scss';

interface Props {
	label: string;
	onClick: () => void;
}

interface State {
	view: 'button' | 'query';
}

export class ConfirmButton extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			view: 'button'
		};
	}

	showDialog = () => {
		this.setState({
			view: 'query'
		});
	};

	onConfirm = () => {
		this.setState({
			view: 'button'
		}, () => {
			this.props.onClick();
		});
	};

	onCancel = () => {
		this.setState({
			view: 'button'
		});
	};

	render = () => {
		if (this.state.view === 'button') {
			return (
				<button className='danger' onClick={this.showDialog}>{this.props.label}</button>
			);
		}

		if (this.state.view === 'query') {
			return (
				<div className='confirm-query'>
					<Text>
						<b>{`${this.props.label} - are you sure?`}</b>
					</Text>
					<div className='button-row'>
						<button onClick={this.onConfirm}>OK</button>
						<button onClick={this.onCancel}>Cancel</button>
					</div>
				</div>
			);
		}
	};
}
