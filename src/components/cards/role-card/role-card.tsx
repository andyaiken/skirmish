import { Component } from 'react';

import type { RoleModel } from '../../../models/role';

import { ActionListItemPanel, FeatureListItemPanel, TextListItemPanel } from '../../panels';

import { Text, TextType } from '../../controls';

import './role-card.scss';

interface Props {
	role: RoleModel;
}

export class RoleCard extends Component<Props> {
	render = () => {
		let traits = null;
		if (this.props.role.traits.length > 0) {
			traits = (
				<div>
					<Text type={TextType.MinorHeading}>Traits</Text>
					{this.props.role.traits.map((t, n) => <TextListItemPanel key={n} item={t} />)}
				</div>
			);
		}

		let skills = null;
		if (this.props.role.skills.length > 0) {
			skills = (
				<div>
					<Text type={TextType.MinorHeading}>Skills</Text>
					{this.props.role.skills.map((s, n) => <TextListItemPanel key={n} item={s} />)}
				</div>
			);
		}

		let profs = null;
		if (this.props.role.proficiencies.length > 0) {
			profs = (
				<div>
					<Text type={TextType.MinorHeading}>Proficiencies</Text>
					{this.props.role.proficiencies.map((p, n) => <TextListItemPanel key={n} item={p} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.role.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.role.features.map(f => <FeatureListItemPanel key={f.id} item={f} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.role.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.role.actions.map(a => <ActionListItemPanel key={a.id} item={a} />)}
				</div>
			);
		}

		return (
			<div className='role-card'>
				<Text type={TextType.SubHeading}>{this.props.role.name}</Text>
				<hr />
				{traits}
				{skills}
				{profs}
				{features}
				{actions}
			</div>
		);
	};
}
