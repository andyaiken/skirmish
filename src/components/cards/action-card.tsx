import { Divider } from 'antd';
import React from 'react';
import { Action } from '../../models/action';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';

interface Props {
	action: Action;
}

export class ActionCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Divider>{this.props.action.name}</Divider>
				</Align>
			</Padding>
		);
	}
}
