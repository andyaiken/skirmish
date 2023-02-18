import { Component } from 'react';
import { FeatureModel } from '../../../models/feature';
import { Text, TextType } from '../../../controls';
import { getFeatureTitle, getFeatureDescription } from '../../../utils/game-logic';

import './feature-card.scss';

interface Props {
	feature: FeatureModel;
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
