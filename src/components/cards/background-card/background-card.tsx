import { Component } from 'react';
import { Background } from '../../../models/background';
import { getFeatureName } from '../../../models/feature';
import { StatValue, Text, TextType } from '../../utility';

import './background-card.scss';

interface Props {
	background: Background;
}

export class BackgroundCard extends Component<Props> {
	public render() {
		return (
			<div className='background-card'>
				<Text type={TextType.SubHeading}>{this.props.background.name}</Text>
				<hr />
				<StatValue label='Features' value={this.props.background.features.map(f => getFeatureName(f)).join(', ')}/>
				<StatValue label='Actions' value={this.props.background.actions.map(a => a.name).join(', ')}/>
			</div>
		);
	}
}
