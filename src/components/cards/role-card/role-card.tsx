import { Component } from 'react';
import { getFeatureDescription, getFeatureTitle } from '../../../models/feature';
import { Role } from '../../../models/role';
import { StatValue, StatValueList, Text, TextType } from '../../utility';

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
				<StatValueList label='Proficiencies' values={this.props.role.proficiencies.map(p => p.toString())}/>
				<StatValueList label='Features' values={this.props.role.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`)}/>
				<StatValueList label='Actions' values={this.props.role.actions.map(a => a.name)}/>
			</div>
		);
	}
}
