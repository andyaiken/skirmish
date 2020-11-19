import { Divider, Typography } from 'antd';
import React from 'react';
import { FeatureHelper } from '../../models/feature';
import { Species } from '../../models/species';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';
import { StatValue } from '../utility/stat-value';

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
					<StatValue label='Trait bonus' value={this.props.species.traits.map(t => t.toString()).join(', ')}/>
					<StatValue label='Features' value={this.props.species.features.map(f => FeatureHelper.getName(f)).join(', ')}/>
				</Align>
			</Padding>
		);
	}
}
