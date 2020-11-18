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
					{this.props.action.name}
				</Align>
			</Padding>
		);
	}
}
