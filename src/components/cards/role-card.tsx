import { Divider, Typography } from 'antd';
import React from 'react';
import { FeatureHelper } from '../../models/feature';
import { Role } from '../../models/role';
import { Align } from '../utility/align';
import { Padding } from '../utility/padding';

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
					<Typography.Paragraph>
						<b>Trait bonus:</b> {this.props.role.traits.map(t => t.toString()).join(', ')}
					</Typography.Paragraph>
					<Typography.Paragraph>
						<b>Skill bonus:</b> {this.props.role.skills.map(t => t.toString()).join(', ')}
					</Typography.Paragraph>
					<Typography.Paragraph>
						<b>Proficiencies:</b> {this.props.role.proficiencies.map(t => t.toString()).join(', ')}
					</Typography.Paragraph>
					<Typography.Paragraph>
						<b>Features:</b> {this.props.role.features.map(t => FeatureHelper.getName(t)).join(', ')}
					</Typography.Paragraph>
				</Align>
			</Padding>
		);
	}
}
