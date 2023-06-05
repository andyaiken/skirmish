import { Component, MouseEvent } from 'react';
import { IconCheck, IconRefresh } from '@tabler/icons-react';

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
	onSelect: ((species: SpeciesModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class SpeciesCard extends Component<Props, State> {
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
			this.props.onSelect(this.props.species);
		}
	};

	render = () => {
		const tags = this.props.species.quirks.map((q, n) => <Tag key={n}>{q}</Tag>);

		let traits = null;
		if (this.props.species.traits.length > 0) {
			traits = (
				<div>
					<Text type={TextType.MinorHeading}>Traits</Text>
					{this.props.species.traits.map((t, n) => <ListItemPanel key={n} item={t} />)}
				</div>
			);
		}

		let skills = null;
		if (this.props.species.skills.length > 0) {
			skills = (
				<div>
					<Text type={TextType.MinorHeading}>Skills</Text>
					{this.props.species.skills.map((s, n) => <ListItemPanel key={n} item={s} />)}
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
			<button key='flip' className='icon-btn' onClick={this.onFlip}><IconRefresh /></button>
		);
		if (this.props.onSelect && (buttons.length > 0)) {
			buttons.push(
				<button key='select' className='icon-btn' onClick={this.onSelect}><IconCheck /></button>
			);
		}

		return (
			<PlayingCard
				type={CardType.Species}
				front={
					<PlaceholderCard
						text={this.props.species.name}
						subtext={(
							<div className='species-card'>
								<Text type={TextType.Small}>{this.props.species.description}</Text>
								<hr />
								{ tags.length > 0 ? <div className='tags'>{tags}</div> : null }
							</div>
						)} />
				}
				back={(
					<div className='species-card'>
						{traits}
						{skills}
						{features}
						{actions}
					</div>
				)}
				footerText={this.props.species.type === CombatantType.Hero ? 'Species' : 'Monster'}
				footerContent={buttons}
				flipped={this.state.flipped}
				onClick={this.props.onSelect ? this.onSelect : null}
			/>
		);
	};
}
