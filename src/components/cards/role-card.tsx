import { Divider, Typography } from 'antd';
import React from 'react';
import { FeatureHelper } from '../../models/feature';
import { Role } from '../../models/role';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';
import { StatValue } from '../utility/stat-value';

interface Props {
	role: Role;
}

export class RoleCard extends React.Component<Props> {
	public render() {
		return (
			<Padding>
				<Align>
					<Typography.Paragraph style={{ textAlign: 'center' }}>
						<b>{this.props.role.name}</b>
					</Typography.Paragraph>
					<Divider/>
					<StatValue label='Trait bonus' value={this.props.role.traits.map(t => t.toString()).join(', ')}/>
					<StatValue label='Skill bonus' value={this.props.role.skills.map(s => s.toString()).join(', ')}/>
					<StatValue label='Proficiencies' value={this.props.role.proficiencies.map(p => p.toString()).join(', ')}/>
					<StatValue label='Features' value={this.props.role.features.map(f => FeatureHelper.getName(f)).join(', ')}/>
				</Align>
			</Padding>
		);
	}
}
