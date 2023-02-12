import { Component } from 'react';
import { Dialog, Text, TextType } from '../../../../controls';
import { BackgroundList } from '../../../../models/background';
import { RoleList } from '../../../../models/role';
import { HeroSpeciesList } from '../../../../models/species';
import { BackgroundCard, RoleCard, SpeciesCard } from '../../../cards';
import { CardList, PlayingCard } from '../../../utility';

import './options-page.scss';

type DeckType = '' | 'species' | 'role' | 'background';

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
	}

	public render() {
		let dialog = null;
		if (this.state.deck !== '') {
			let heading = '';
			let cards = [];
			switch (this.state.deck) {
				case 'species':
					heading = 'Species Deck';
					cards = HeroSpeciesList.map(s => (<PlayingCard front={<SpeciesCard species={s} />} />));
					break;
				case 'role':
					heading = 'Role Deck';
					cards = RoleList.map(r => (<PlayingCard front={<RoleCard role={r} />} />));
					break;
				case 'background':
					heading = 'Background Deck';
					cards = BackgroundList.map(b => (<PlayingCard front={<BackgroundCard background={b} />} />));
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
