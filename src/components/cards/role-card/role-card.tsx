import { Component, MouseEvent } from 'react';
import { IconCheck, IconRefresh } from '@tabler/icons-react';

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
	onSelect: ((role: RoleModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class RoleCard extends Component<Props, State> {
	static defaultProps = {
		onSelect: null
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

	onSelect = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onSelect) {
			this.props.onSelect(this.props.role);
		}
	};

	render = () => {
		let traits = null;
		if (this.props.role.traits.length > 0) {
			traits = (
				<div>
					<Text type={TextType.MinorHeading}>Traits</Text>
					{this.props.role.traits.map((t, n) => <ListItemPanel key={n} item={t} />)}
				</div>
			);
		}

		let skills = null;
		if (this.props.role.skills.length > 0) {
			skills = (
				<div>
					<Text type={TextType.MinorHeading}>Skills</Text>
					{this.props.role.skills.map((s, n) => <ListItemPanel key={n} item={s} />)}
				</div>
			);
		}

		let profs = null;
		if (this.props.role.proficiencies.length > 0) {
			profs = (
				<div>
					<Text type={TextType.MinorHeading}>Proficiencies</Text>
					{this.props.role.proficiencies.map((p, n) => <ListItemPanel key={n} item={p} />)}
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
			<button key='flip' className='icon-btn' onClick={this.onFlip}><IconRefresh /></button>
		);
		if (this.props.onSelect && (buttons.length > 0)) {
			buttons.push(
				<button key='select' className='icon-btn' onClick={this.onSelect}><IconCheck /></button>
			);
		}

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
						{traits}
						{skills}
						{profs}
						{features}
						{actions}
					</div>
				)}
				footerText='Role'
				footerContent={buttons}
				flipped={this.state.flipped}
				onClick={this.props.onSelect ? this.onSelect : null}
			/>
		);
	};
}
