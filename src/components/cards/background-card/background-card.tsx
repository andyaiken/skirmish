import { Component } from 'react';

import type { BackgroundModel } from '../../../models/background';

import { GameLogic } from '../../../logic/game-logic';

import { StatValue, Text, TextType } from '../../controls';

import './background-card.scss';

interface Props {
	background: BackgroundModel;
}

export class BackgroundCard extends Component<Props> {
	public render() {
		const features = this.props.background.features.length > 0 ? this.props.background.features.map(f => GameLogic.getFeatureDescription(f)) : '-';
		const actions = this.props.background.features.length > 0 ? this.props.background.actions.map(a => GameLogic.getActionDescription(a)) : '-';

		return (
			<div className='background-card'>
				<Text type={TextType.SubHeading}>{this.props.background.name}</Text>
				<hr />
				<StatValue label='Features' value={features}/>
				<StatValue label='Actions' value={actions}/>
			</div>
		);
	}
}
