import { Component } from 'react';
import type { RoleModel } from '../../../models/role';
import { Text, TextType } from '../../../controls';
import { GameLogic } from '../../../logic/game-logic';
import { StatValue } from '../../utility';

import './role-card.scss';

interface Props {
	role: RoleModel;
}

export class RoleCard extends Component<Props> {
	public render() {
		const features = this.props.role.features.length > 0 ? this.props.role.features.map(f => GameLogic.getFeatureDescription(f)) : '-';
		const actions = this.props.role.actions.length > 0 ? this.props.role.actions.map(a => GameLogic.getActionDescription(a)) : '-';

		return (
			<div className='role-card'>
				<Text type={TextType.SubHeading}>{this.props.role.name}</Text>
				<hr />
				<StatValue label='Trait bonus' value={this.props.role.traits.map(t => t.toString()).join(', ') || '-'}/>
				<StatValue label='Skill bonus' value={this.props.role.skills.map(s => s.toString()).join(', ') || '-'}/>
				<StatValue label='Proficiencies' value={this.props.role.proficiencies.length > 0 ? this.props.role.proficiencies.map(p => p.toString()) : '-'}/>
				<StatValue label='Features' value={features}/>
				<StatValue label='Actions' value={actions}/>
			</div>
		);
	}
}
