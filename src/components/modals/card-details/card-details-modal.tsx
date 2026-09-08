import { Component, Fragment, ReactNode } from 'react';

import { CardType } from '../../../enums/card-type';

import { GameLogic } from '../../../logic/game/game-logic';

import type { ActionModel } from '../../../models/action';
import type { BackgroundModel } from '../../../models/background';
import type { FeatureModel } from '../../../models/feature';
import type { RoleModel } from '../../../models/role';
import type { SpeciesModel } from '../../../models/species';

import { ActionCard, FeatureCard } from '../../cards';
import { Badge, CardList, Tag, Text, TextType } from '../../controls';

import './card-details-modal.scss';

// What a caller holds while one of these modals is open. The card type is the discriminant, so
// narrowing on it hands back the right model and the modal for it cannot be given the wrong one
export type CardSelection =
	{ type: CardType.Species, card: SpeciesModel } |
	{ type: CardType.Role, card: RoleModel } |
	{ type: CardType.Background, card: BackgroundModel };

interface Props {
	name: string;
	description: string;
	type: CardType;
	startingFeatures: FeatureModel[];
	features: FeatureModel[];
	actions: ActionModel[];
	deathActions: ActionModel[];
	// Shown under the description, the way the card itself shows them. Only a species has any: these
	// are its quirks
	tags: string[];
	// The backstage card page is the only caller that wants the balance figures: a strength badge on
	// every card, and the developer detail on the action cards
	developer: boolean;
}

// The body shared by SpeciesModal, RoleModal and BackgroundModal. Prefer one of those to this: they
// take the card itself and fill in the card type, which is the piece that was easy to get wrong
export class CardDetailsModal extends Component<Props> {
	static defaultProps = {
		deathActions: [],
		tags: [],
		developer: false
	};

	getFeatureCards = (features: FeatureModel[]) => {
		return features.map(f => (
			<Badge key={f.id} value={this.props.developer ? GameLogic.getFeatureStrength(f) : ''}>
				<FeatureCard
					feature={f}
					footer={this.props.name}
					footerType={this.props.type}
				/>
			</Badge>
		));
	};

	getActionCards = (actions: ActionModel[]) => {
		return actions.map(a => (
			<Badge key={a.id} value={this.props.developer ? GameLogic.getActionStrength(a) : ''}>
				<ActionCard
					action={a}
					developer={this.props.developer}
					footer={this.props.name}
					footerType={this.props.type}
				/>
			</Badge>
		));
	};

	// A section with nothing in it shows neither its heading nor the rule above it
	getSection = (title: string, cards: ReactNode[]) => {
		if (cards.length === 0) {
			return null;
		}

		return (
			<Fragment>
				<hr />
				<Text type={TextType.SubHeading}>{title}</Text>
				<CardList cards={cards} />
			</Fragment>
		);
	};

	render = () => {
		return (
			<div className='card-details-modal'>
				<Text type={TextType.Heading}>{this.props.name}</Text>
				<hr />
				<Text>
					<p className='card-details-description'>{this.props.description}</p>
				</Text>
				{
					this.props.tags.length > 0 ?
						<div className='card-details-tags'>
							{this.props.tags.map((t, n) => <Tag key={n}>{t}</Tag>)}
						</div>
						: null
				}
				{this.getSection('Starting Cards', this.getFeatureCards(this.props.startingFeatures))}
				{this.getSection('Feature Cards', this.getFeatureCards(this.props.features))}
				{this.getSection('Action Cards', this.getActionCards(this.props.actions))}
				{this.getSection('Death Action Cards', this.getActionCards(this.props.deathActions))}
			</div>
		);
	};
}
