import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import type { RoleModel } from '../../../models/role';

import { ListItemPanel } from '../../panels';

import { PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './role-card.scss';

interface Props {
	role: RoleModel;
	disabled: boolean;
	onClick: ((role: RoleModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class RoleCard extends Component<Props, State> {
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
			this.props.onClick(this.props.role);
		}
	};

	render = () => {
		let startingFeatures = null;
		if (this.props.role.startingFeatures.length > 0) {
			startingFeatures = (
				<div>
					<Text type={TextType.MinorHeading}>Start With</Text>
					{this.props.role.startingFeatures.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.role.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.role.features.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.role.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.role.actions.map(a => <ListItemPanel key={a.id} item={ActionLogic.getActionDescription(a)} />)}
				</div>
			);
		}

		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' title='Flip' onClick={this.onFlip}><IconRefresh /></button>
		);

		return (
			<PlayingCard
				type={CardType.Role}
				front={
					<PlaceholderCard
						text={this.props.role.name}
						subtext={this.props.role.description}
					/>
				}
				back={(
					<div className='role-card-back'>
						{startingFeatures}
						{features}
						{actions}
					</div>
				)}
				footerText='Role'
				footerContent={buttons}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
