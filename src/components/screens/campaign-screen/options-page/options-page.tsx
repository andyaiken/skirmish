import { Component } from 'react';

import { BackgroundData } from '../../../../data/background-data';
import { ItemData } from '../../../../data/item-data';
import { RoleData } from '../../../../data/role-data';
import { SpeciesData } from '../../../../data/species-data';

import { ActionModel } from '../../../../models/action';

import { ActionCard, BackgroundCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, Dialog, PlayingCard, Text, TextType } from '../../../controls';

import './options-page.scss';

type DeckType = '' | 'background' | 'role' | 'species' | 'item';

interface Props {
	developer: boolean;
	endCampaign: () => void;
}

interface State {
	deck: DeckType;
}

export class OptionsPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			deck: ''
		};
	}

	setDeck = (deck: DeckType) => {
		this.setState({
			deck: deck
		});
	};

	render = () => {
		let dialog = null;
		if (this.state.deck !== '') {
			dialog = (
				<Dialog
					content={<Deck type={this.state.deck} />}
					onClickOff={() => this.setDeck('')}
				/>
			);
		}

		return (
			<div className='options-page'>
				<div className='cards'>
					<PlayingCard front={<PlaceholderCard><Text type={TextType.SubHeading}>Species<br/>Deck</Text></PlaceholderCard>} onClick={() => this.setDeck('species')} />
					<PlayingCard front={<PlaceholderCard><Text type={TextType.SubHeading}>Role<br/>Deck</Text></PlaceholderCard>} onClick={() => this.setDeck('role')} />
					<PlayingCard front={<PlaceholderCard><Text type={TextType.SubHeading}>Background<br/>Deck</Text></PlaceholderCard>} onClick={() => this.setDeck('background')} />
					<PlayingCard front={<PlaceholderCard><Text type={TextType.SubHeading}>Item<br/>Deck</Text></PlaceholderCard>} onClick={() => this.setDeck('item')} />
				</div>
				<hr />
				<button className='danger' onClick={() => this.props.endCampaign()}>Abandon This Campaign</button>
				{dialog}
			</div>
		);
	};
}

interface DeckProps {
	type: DeckType;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DeckState {
	actions: ActionModel[];
}

class Deck extends Component<DeckProps, DeckState> {
	constructor(props: DeckProps) {
		super(props);
		this.state = {
			actions: []
		};
	}

	setActions = (actions: ActionModel[]) => {
		this.setState({
			actions: actions
		});
	};

	render = () => {
		let heading = '';
		let cards: JSX.Element[] = [];
		switch (this.props.type) {
			case 'species':
				heading = 'Species Deck';
				cards = SpeciesData.getList().map(s => (<PlayingCard key={s.id} front={<SpeciesCard species={s} />} onClick={() => this.setActions(s.actions)} />));
				break;
			case 'role':
				heading = 'Role Deck';
				cards = RoleData.getList().map(r => (<PlayingCard key={r.id} front={<RoleCard role={r} />} onClick={() => this.setActions(r.actions)} />));
				break;
			case 'background':
				heading = 'Background Deck';
				cards = BackgroundData.getList().map(b => (<PlayingCard key={b.id} front={<BackgroundCard background={b} />} onClick={() => this.setActions(b.actions)} />));
				break;
			case 'item':
				heading = 'Item Deck';
				cards = ItemData.getList().map(i => (<PlayingCard key={i.id} front={<ItemCard item={i} />} />));
				break;
		}

		let dialog = null;
		if (this.state.actions.length > 0) {
			const actionCards = this.state.actions.map(a => (<PlayingCard key={a.id} front={<ActionCard action={a} />} />));
			const content = (
				<div>
					<Text type={TextType.Heading}>Actions</Text>
					<CardList cards={actionCards} />
				</div>
			);
			dialog = (
				<Dialog
					content={content}
					onClickOff={() => this.setActions([])}
				/>
			);
		}

		return (
			<div>
				<Text type={TextType.Heading}>{heading}</Text>
				<CardList cards={cards} />
				{dialog}
			</div>
		);
	};
}
