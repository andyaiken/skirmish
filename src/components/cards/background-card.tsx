import { Divider } from 'antd';
import React from 'react';
import { Background } from '../../models/background';
import { FeatureHelper } from '../../models/feature';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';
import { StatValue } from '../utility/stat-value';

interface Props {
	background: Background;
}

export class BackgroundCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Divider>{this.props.background.name}</Divider>
					<StatValue label='Features' value={this.props.background.features.map(f => FeatureHelper.getName(f)).join(', ')}/>
				</Align>
			</Padding>
		);
	}
}
