import { Component } from 'react';
import { getFeatureDescription, getFeatureTitle } from '../../../models/feature';
import { RoleModel } from '../../../models/role';
import { Text, TextType } from '../../../controls';
import { StatValue } from '../../utility';

import './role-card.scss';

interface Props {
	role: RoleModel;
}

export class RoleCard extends Component<Props> {
	public render() {
		return (
			<div className='role-card'>
				<Text type={TextType.SubHeading}>{this.props.role.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.role.traits.map(t => t.toString()).join(', ')}/>
				<StatValue label='Skill bonus' value={this.props.role.skills.map(s => s.toString()).join(', ')}/>
				<StatValue label='Proficiencies' value={this.props.role.proficiencies.map(p => p.toString())}/>
				<StatValue label='Features' value={this.props.role.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`)}/>
				<StatValue label='Actions' value={this.props.role.actions.map(a => a.name)}/>
			</div>
		);
	}
}
