import { Component } from 'react';
import { BackgroundModel } from '../../../models/background';
import { Text, TextType } from '../../../controls';
import { StatValue } from '../../utility';

import './background-card.scss';
import { getFeatureTitle, getFeatureDescription } from '../../../utils/game-logic';

interface Props {
	background: BackgroundModel;
}

export class BackgroundCard extends Component<Props> {
	public render() {
		return (
			<div className='background-card'>
				<Text type={TextType.SubHeading}>{this.props.background.name}</Text>
				<hr />
				<StatValue label='Features' value={this.props.background.features.length > 0 ? this.props.background.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`) : '-'}/>
				<StatValue label='Actions' value={this.props.background.features.length > 0 ? this.props.background.actions.map(a => a.name) : '-'}/>
			</div>
		);
	}
}
