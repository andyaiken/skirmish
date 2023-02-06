import { Component } from 'react';
import { Background } from '../../../models/background';
import { getFeatureDescription, getFeatureTitle } from '../../../models/feature';
import { StatValueList, Text, TextType } from '../../utility';

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
				<StatValueList label='Features' values={this.props.background.features.map(f => `${getFeatureTitle(f)}: ${getFeatureDescription(f)}`)}/>
				<StatValueList label='Actions' values={this.props.background.actions.map(a => a.name)}/>
			</div>
		);
	}
}
