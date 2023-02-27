import { Component } from 'react';

import { FeatureLogic } from '../../../logic/feature-logic';

import type { FeatureModel } from '../../../models/feature';

import { Text, TextType } from '../../controls';

import './feature-card.scss';

interface Props {
	feature: FeatureModel;
}

export class FeatureCard extends Component<Props> {
	render = () => {
		return (
			<div className='feature-card'>
				<Text type={TextType.SubHeading}>{FeatureLogic.getFeatureTitle(this.props.feature)}</Text>
				<hr />
				<Text>{FeatureLogic.getFeatureInformation(this.props.feature)}</Text>
			</div>
		);
	};
}
