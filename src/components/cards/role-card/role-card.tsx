import { Component } from 'react';

import { GameLogic } from '../../../logic/game-logic';

import type { RoleModel } from '../../../models/role';

import { StatValue, Text, TextType } from '../../controls';

import './role-card.scss';

interface Props {
	role: RoleModel;
}

export class RoleCard extends Component<Props> {
	render = () => {
		let features = null;
		if (this.props.role.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.role.features.map(f => <Text key={f.id} type={TextType.ListItem}>{GameLogic.getFeatureDescription(f)}</Text>)}
				</div>
			);
		}

		let actions = null;
		if (this.props.role.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.role.actions.map(a => <Text key={a.id} type={TextType.ListItem}>{GameLogic.getActionDescription(a)}</Text>)}
				</div>
			);
		}

		return (
			<div className='role-card'>
				<Text type={TextType.SubHeading}>{this.props.role.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.role.traits.map(t => t.toString()).join(', ') || '-'}/>
				<StatValue label='Skill bonus' value={this.props.role.skills.map(s => s.toString()).join(', ') || '-'}/>
				<StatValue label='Proficiencies' value={this.props.role.proficiencies.length > 0 ? this.props.role.proficiencies.map(p => p.toString()) : '-'}/>
				{features}
				{actions}
			</div>
		);
	};
}
