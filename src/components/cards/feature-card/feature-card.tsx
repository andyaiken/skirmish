import { Component } from 'react';
import { Feature, getFeatureDescription, getFeatureTitle } from '../../../models/feature';
import { Text, TextType } from '../../utility';

import './feature-card.scss';

interface Props {
	feature: Feature;
}

export class FeatureCard extends Component<Props> {
	public render() {
		return (
			<div className='feature-card'>
				<Text type={TextType.SubHeading}>{getFeatureTitle(this.props.feature)}</Text>
				<hr />
				<Text>{getFeatureDescription(this.props.feature)}</Text>
			</div>
		);
	}
}
