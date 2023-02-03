import { Component } from 'react';
import { Background } from '../../../models/background';
import { FeatureHelper } from '../../../models/feature';
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
				<StatValue label='Features' value={this.props.background.features.map(f => FeatureHelper.getName(f)).join(', ')}/>
			</div>
		);
	}
}
