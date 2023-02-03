import { Component } from 'react';
import { Action } from '../../../models/action';
import { Text, TextType } from '../../utility';

import './action-card.scss';

interface Props {
	action: Action;
}

export class ActionCard extends Component<Props> {
	public render() {
		return (
			<div className='action-card'>
				<Text type={TextType.SubHeading}>{this.props.action.name}</Text>
			</div>
		);
	}
}
