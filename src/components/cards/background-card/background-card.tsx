import { Component } from 'react';
import { BackgroundModel } from '../../../models/background';
import { Text, TextType } from '../../../controls';
import { StatValue } from '../../utility';
import { FeatureUtils } from '../../../logic/feature-utils';

import './background-card.scss';

interface Props {
	background: BackgroundModel;
}

export class BackgroundCard extends Component<Props> {
	public render() {
		const features = this.props.background.features.length > 0 ? this.props.background.features.map(f => `${FeatureUtils.getFeatureTitle(f)}: ${FeatureUtils.getFeatureDescription(f)}`) : '-';
		const actions = this.props.background.features.length > 0 ? this.props.background.actions.map(a => a.name) : '-';

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
