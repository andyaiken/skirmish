import { Divider, Typography } from 'antd';
import React from 'react';
import { Background } from '../../models/background';
import { FeatureHelper } from '../../models/feature';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';

interface Props {
	background: Background;
}

export class BackgroundCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Typography.Paragraph style={{ textAlign: 'center' }}>
						<b>{this.props.background.name}</b>
					</Typography.Paragraph>
					<Divider/>
					<Typography.Paragraph>
						<b>Features:</b> {this.props.background.features.map(t => FeatureHelper.getName(t)).join(', ')}
					</Typography.Paragraph>
				</Align>
			</Padding>
		);
	}
}
