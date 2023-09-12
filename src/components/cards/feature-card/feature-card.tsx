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

interface State {
	flipped: boolean;
}

export class FeatureCard extends Component<Props, State> {
	static defaultProps = {
		disabled: false,
		onClick: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	onFlip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			flipped: !this.state.flipped
		});
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
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
