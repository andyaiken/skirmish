import { Component } from 'react';
import { Feature, FeatureHelper } from '../../../models/feature';
import { Text, TextType } from '../../utility';

import './feature-card.scss';

interface Props {
	feature: Feature;
}

export class FeatureCard extends Component<Props> {
	public render() {
		return (
			<div className='feature-card'>
				<Text type={TextType.SubHeading}>{FeatureHelper.getName(this.props.feature)}</Text>
			</div>
		);
	}
}
