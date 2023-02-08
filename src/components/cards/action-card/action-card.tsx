import { Component } from 'react';
import { Text, TextType } from '../../../controls';
import { ActionModel } from '../../../models/action';

import './action-card.scss';

interface Props {
	action: ActionModel;
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
