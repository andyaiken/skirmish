import { Component } from 'react';

import { BackgroundData } from '../../../../data/background-data';
import { HeroSpeciesData } from '../../../../data/hero-species-data';
import { RoleData } from '../../../../data/role-data';

import { BackgroundCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, PlayingCard } from '../../../utility';
import { Dialog, Text, TextType } from '../../../../controls';

import './options-page.scss';

type DeckType = '' | 'background' | 'role' | 'species';

interface Props {
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

	public render() {
		let dialog = null;
		if (this.state.deck !== '') {
			let heading = '';
			let cards = [];
			switch (this.state.deck) {
				case 'species':
					heading = 'Species Deck';
					cards = HeroSpeciesData.getList().map(s => (<PlayingCard key={s.id} front={<SpeciesCard species={s} />} />));
					break;
				case 'role':
					heading = 'Role Deck';
					cards = RoleData.getList().map(r => (<PlayingCard key={r.id} front={<RoleCard role={r} />} />));
					break;
				case 'background':
					heading = 'Background Deck';
					cards = BackgroundData.getList().map(b => (<PlayingCard key={b.id} front={<BackgroundCard background={b} />} />));
					break;
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
				<button onClick={() => this.setDeck('species')}>Species Deck</button>
				<button onClick={() => this.setDeck('role')}>Role Deck</button>
				<button onClick={() => this.setDeck('background')}>Background Deck</button>
				<hr />
				<button onClick={() => this.props.endCampaign()}>Abandon This Campaign</button>
				{dialog}
			</div>
		);
	}
}
