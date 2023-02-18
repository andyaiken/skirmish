import { Component } from 'react';
import type { FeatureModel } from '../../../models/feature';
import { Text, TextType } from '../../../controls';
import { FeatureUtils } from '../../../logic/feature-utils';

import './feature-card.scss';

interface Props {
	feature: FeatureModel;
}

export class FeatureCard extends Component<Props> {
	public render() {
		return (
			<div className='feature-card'>
				<Text type={TextType.SubHeading}>{FeatureUtils.getFeatureTitle(this.props.feature)}</Text>
				<hr />
				<Text>{FeatureUtils.getFeatureDescription(this.props.feature)}</Text>
			</div>
		);
	}
}
