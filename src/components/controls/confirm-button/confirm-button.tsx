import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { Component } from 'react';

import { Text, TextType } from '../../controls';

import './confirm-button.scss';

interface Props {
	label: string;
	info: string;
	onClick: () => void;
}

interface State {
	view: 'button' | 'query';
}

export class ConfirmButton extends Component<Props, State> {
	static defaultProps = {
		info: ''
	};

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
					<Text type={TextType.Information}>
						<p><b>Are you sure?</b></p>
						{this.props.info ? <p>{this.props.info}</p> : null}
					</Text>
					<div className='button-row'>
						<button className='icon-btn' onClick={this.onConfirm}><IconCircleCheck /></button>
						<button className='icon-btn' onClick={this.onCancel}><IconCircleX /></button>
					</div>
				</div>
			);
		}
	};
}
