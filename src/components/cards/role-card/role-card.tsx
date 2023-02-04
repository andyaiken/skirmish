import { Component } from 'react';
import { getFeatureName } from '../../../models/feature';
import { Role } from '../../../models/role';
import { StatValue, Text, TextType } from '../../utility';

import './role-card.scss';

interface Props {
	role: Role;
}

export class RoleCard extends Component<Props> {
	public render() {
		return (
			<div className='role-card'>
				<Text type={TextType.SubHeading}>{this.props.role.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.role.traits.map(t => t.toString()).join(', ')}/>
				<StatValue label='Skill bonus' value={this.props.role.skills.map(s => s.toString()).join(', ')}/>
				<StatValue label='Proficiencies' value={this.props.role.proficiencies.map(p => p.toString()).join(', ')}/>
				<StatValue label='Features' value={this.props.role.features.map(f => getFeatureName(f)).join(', ')}/>
				<StatValue label='Actions' value={this.props.role.actions.map(a => a.name).join(', ')}/>
			</div>
		);
	}
}
