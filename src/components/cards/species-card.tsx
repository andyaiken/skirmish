import { Divider, Typography } from 'antd';
import React from 'react';
import { FeatureHelper } from '../../models/feature';
import { Species } from '../../models/species';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';

interface Props {
	species: Species;
}

export class SpeciesCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Typography.Paragraph style={{ textAlign: 'center' }}>
						<b>{this.props.species.name}</b>
					</Typography.Paragraph>
					<Divider/>
					<Typography.Paragraph>
						<b>Trait bonus:</b> {this.props.species.traits.map(t => t.toString()).join(', ')}
					</Typography.Paragraph>
					<Typography.Paragraph>
						<b>Features:</b> {this.props.species.features.map(t => FeatureHelper.getName(t)).join(', ')}
					</Typography.Paragraph>
				</Align>
			</Padding>
		);
	}
}
