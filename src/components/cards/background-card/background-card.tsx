import { Component } from 'react';

import type { BackgroundModel } from '../../../models/background';

import { Text, TextType } from '../../controls';

import { ActionListItemPanel, FeatureListItemPanel } from '../../panels';

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
					{this.props.background.features.map(f => <FeatureListItemPanel key={f.id} item={f} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.background.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.background.actions.map(a => <ActionListItemPanel key={a.id} item={a} />)}
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
