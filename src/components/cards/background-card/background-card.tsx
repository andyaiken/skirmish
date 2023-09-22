import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import type { BackgroundModel } from '../../../models/background';

import { PlayingCard, Text, TextType } from '../../controls';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import { ListItemPanel } from '../../panels';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './background-card.scss';

interface Props {
	background: BackgroundModel;
	disabled: boolean;
	onClick: ((background: BackgroundModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class BackgroundCard extends Component<Props, State> {
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
			this.props.onClick(this.props.background);
		}
	};

	render = () => {
		let startingFeatures = null;
		if (this.props.background.startingFeatures.length > 0) {
			startingFeatures = (
				<div>
					<Text type={TextType.MinorHeading}>Start With</Text>
					{this.props.background.startingFeatures.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.background.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.background.features.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.background.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.background.actions.map(a => <ListItemPanel key={a.id} item={ActionLogic.getActionDescription(a)} />)}
				</div>
			);
		}

		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' title='Flip' onClick={this.onFlip}><IconRefresh /></button>
		);

		return (
			<PlayingCard
				type={CardType.Background}
				front={
					<PlaceholderCard
						text={this.props.background.name}
						subtext={this.props.background.description}
					/>
				}
				back={(
					<div className='background-card-back'>
						{startingFeatures}
						{features}
						{actions}
					</div>
				)}
				footerText='Background'
				footerContent={buttons}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
