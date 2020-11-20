import { Divider } from 'antd';
import React from 'react';
import { BoonType } from '../../models/boon';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';

interface Props {
	boon: BoonType;
}

export class BoonCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Divider>{this.props.boon}</Divider>
				</Align>
			</Padding>
		);
	}
}
