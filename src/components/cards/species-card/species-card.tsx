import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';

import { ActionLogic } from '../../../logic/action-logic';
import { FeatureLogic } from '../../../logic/feature-logic';

import type { SpeciesModel } from '../../../models/species';

import { ListItemPanel } from '../../panels';

import { PlayingCard, Tag, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './species-card.scss';

interface Props {
	species: SpeciesModel;
	disabled: boolean;
	onClick: ((species: SpeciesModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class SpeciesCard extends Component<Props, State> {
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
			this.props.onClick(this.props.species);
		}
	};

	render = () => {
		const tags = this.props.species.quirks.map((q, n) => <Tag key={n}>{q}</Tag>);

		let size = null;
		if (this.props.species.size !== 1) {
			size = (
				<div>
					<Text type={TextType.MinorHeading}>Size</Text>
					<ListItemPanel item={`${this.props.species.size}`} />
				</div>
			);
		}

		let startingFeatures = null;
		if (this.props.species.startingFeatures.length > 0) {
			startingFeatures = (
				<div>
					<Text type={TextType.MinorHeading}>Start With</Text>
					{this.props.species.startingFeatures.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let features = null;
		if (this.props.species.features.length > 0) {
			features = (
				<div>
					<Text type={TextType.MinorHeading}>Features</Text>
					{this.props.species.features.map(f => <ListItemPanel key={f.id} item={FeatureLogic.getFeatureDescription(f)} />)}
				</div>
			);
		}

		let actions = null;
		if (this.props.species.actions.length > 0) {
			actions = (
				<div>
					<Text type={TextType.MinorHeading}>Actions</Text>
					{this.props.species.actions.map(a => <ListItemPanel key={a.id} item={ActionLogic.getActionDescription(a)} />)}
				</div>
			);
		}

		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' title='Flip' onClick={this.onFlip}><IconRefresh /></button>
		);

		return (
			<PlayingCard
				type={CardType.Species}
				front={
					<PlaceholderCard
						text={this.props.species.name}
						subtext={this.props.species.description}
						content={(
							<div className='species-card-front'>
								{ tags.length > 0 ? <div className='tags'>{tags}</div> : null }
							</div>
						)}
					/>
				}
				back={(
					<div className='species-card-back'>
						{size}
						{startingFeatures}
						{features}
						{actions}
					</div>
				)}
				footerText={this.props.species.type === CombatantType.Hero ? 'Species' : 'Monster'}
				footerContent={buttons}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : this.onFlip}
			/>
		);
	};
}
