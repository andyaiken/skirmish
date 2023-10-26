import { Component, MouseEvent } from 'react';

import { CardType } from '../../../enums/card-type';

import { FeatureLogic } from '../../../logic/feature-logic';

import type { FeatureModel } from '../../../models/feature';

import { PlaceholderCard } from '../placeholder-card/placeholder-card';
import { PlayingCard } from '../../controls';

import './feature-card.scss';

interface Props {
	feature: FeatureModel;
	footer: string;
	footerType: CardType;
	disabled: boolean;
	onClick: ((feature: FeatureModel) => void) | null;
}

export class FeatureCard extends Component<Props> {
	static defaultProps = {
		disabled: false,
		onClick: null
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.feature);
		}
	};

	render = () => {
		return (
			<PlayingCard
				type={CardType.Feature}
				front={(
					<PlaceholderCard text={FeatureLogic.getFeatureTitle(this.props.feature)} subtext={FeatureLogic.getFeatureInformation(this.props.feature)} />
				)}
				footerText={this.props.footer || 'Feature'}
				footerType={this.props.footerType}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
