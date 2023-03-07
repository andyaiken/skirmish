import { Component } from 'react';

import type { BackgroundModel } from '../../../models/background';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import { Text, TextType } from '../../controls';

import './background-card.scss';

interface Props {
	background: BackgroundModel;
}

export class BackgroundCard extends Component<Props> {
	render = () => {
		let features = null;
		if (this.props.background.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.background.features.map(f => <Text key={f.id} type={TextType.ListItem}>{FeatureLogic.getFeatureDescription(f)}</Text>)}
				</div>
			);
		}

		let actions = null;
		if (this.props.background.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.background.actions.map(a => <Text key={a.id} type={TextType.ListItem}>{ActionLogic.getActionDescription(a)}</Text>)}
				</div>
			);
		}

		return (
			<div className='background-card'>
				<Text type={TextType.SubHeading}>{this.props.background.name}</Text>
				<hr />
				{features}
				{actions}
			</div>
		);
	};
}