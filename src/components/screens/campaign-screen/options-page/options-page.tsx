import { Component } from 'react';

import { BackgroundData } from '../../../../data/background-data';
import { ItemData } from '../../../../data/item-data';
import { RoleData } from '../../../../data/role-data';
import { SpeciesData } from '../../../../data/species-data';

import { BackgroundCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, Dialog, PlayingCard, Text, TextType } from '../../../controls';

import './options-page.scss';

type DeckType = '' | 'background' | 'role' | 'species' | 'item';

interface Props {
	developer: boolean;
	endCampaign: () => void;
	setDeveloper: (value: boolean) => void;
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
			let heading = '';
			let cards = [];
			switch (this.state.deck) {
				case 'species':
					heading = 'Species Deck';
					cards = SpeciesData.getList().map(s => (<PlayingCard key={s.id} front={<SpeciesCard species={s} />} />));
					break;
				case 'role':
					heading = 'Role Deck';
					cards = RoleData.getList().map(r => (<PlayingCard key={r.id} front={<RoleCard role={r} />} />));
					break;
				case 'background':
					heading = 'Background Deck';
					cards = BackgroundData.getList().map(b => (<PlayingCard key={b.id} front={<BackgroundCard background={b} />} />));
					break;
				case 'item':
					heading = 'Item Deck';
					cards = ItemData.getList().map(i => (<PlayingCard key={i.id} front={<ItemCard item={i} />} />));
			}
			const content = (
				<div>
					<Text type={TextType.Heading}>{heading}</Text>
					<CardList cards={cards} />
				</div>
			);
			dialog = (
				<Dialog
					content={content}
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
				<button className='danger' onClick={() => this.props.setDeveloper(!this.props.developer)}>Developer Mode: {this.props.developer ? 'On' : 'Off'}</button>
				<hr />
				<button className='danger' onClick={() => this.props.endCampaign()}>Abandon This Campaign</button>
				{dialog}
			</div>
		);
	};
}
