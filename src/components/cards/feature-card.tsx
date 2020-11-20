import { Divider } from 'antd';
import React from 'react';
import { Feature, FeatureHelper } from '../../models/feature';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';

interface Props {
	feature: Feature;
}

export class FeatureCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Divider>{FeatureHelper.getName(this.props.feature)}</Divider>
				</Align>
			</Padding>
		);
	}
}
