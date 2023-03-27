import { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import { BackgroundData } from '../../../data/background-data';
import { ItemData } from '../../../data/item-data';
import { RoleData } from '../../../data/role-data';
import { SpeciesData } from '../../../data/species-data';

import { CardType } from '../../../enums/card-type';

import type { ActionModel } from '../../../models/action';
import type { GameModel } from '../../../models/game';

import { ActionCard, BackgroundCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, Dialog, PlayingCard, Switch, Tabs, Text, TextType } from '../../controls';

import './settings-panel.scss';

import pkg from '../../../../package.json';

interface Props {
	game: GameModel | null;
	rules: string;
	developer: boolean;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
}

interface State {
	selectedTab: string;
	local: boolean;
	deck: CardType;
}

export class SettingsPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedTab: 'rules',
			local: window.location.href.includes('localhost'),
			deck: CardType.Default
		};
	}

	setDeck = (deck: CardType) => {
		this.setState({
			deck: deck
		});
	};

	render = () => {
		const tabs = [
			{ id: 'rules', display: 'Rules' },
			{ id: 'decks', display: 'Decks' },
			{ id: 'options', display: 'Options' }
		];

		let content = null;
		switch (this.state.selectedTab) {
			case 'rules':
				content = (
					<div className='content'>
						<ReactMarkdown>{this.props.rules}</ReactMarkdown>
					</div>
				);
				break;
			case 'decks':
				content = (
					<div className='content cards'>
						<PlayingCard
							stack={true}
							type={CardType.Species}
							front={<PlaceholderCard><Text type={TextType.SubHeading}>Species<br />Deck</Text></PlaceholderCard>}
							onClick={() => this.setDeck(CardType.Species)}
						/>
						<PlayingCard
							stack={true}
							type={CardType.Role}
							front={<PlaceholderCard><Text type={TextType.SubHeading}>Role<br />Deck</Text></PlaceholderCard>}
							onClick={() => this.setDeck(CardType.Role)}
						/>
						<PlayingCard
							stack={true}
							type={CardType.Background}
							front={<PlaceholderCard><Text type={TextType.SubHeading}>Background<br />Deck</Text></PlaceholderCard>}
							onClick={() => this.setDeck(CardType.Background)}
						/>
						<PlayingCard
							stack={true}
							type={CardType.Item}
							front={<PlaceholderCard><Text type={TextType.SubHeading}>Item<br />Deck</Text></PlaceholderCard>}
							onClick={() => this.setDeck(CardType.Item)}
						/>
					</div>
				);
				break;
			case 'options':
				content = (
					<div className='content'>
						{this.state.local ? <Switch label='Developer Mode' checked={this.props.developer} onChange={this.props.setDeveloperMode} /> : null}
						{this.props.game ? <button className='danger' onClick={() => this.props.endCampaign()}>Abandon this Campaign</button> : null}
						<hr />
						<Text>Version {pkg.version}</Text>
					</div>
				);
				break;
		}

		let dialog = null;
		if (this.state.deck !== CardType.Default) {
			dialog = (
				<Dialog
					content={<Deck type={this.state.deck} />}
					onClose={() => this.setDeck(CardType.Default)}
				/>
			);
		}

		return (
			<div className='settings-panel'>
				<Text type={TextType.Heading}>Information</Text>
				<Tabs options={tabs} selectedID={this.state.selectedTab} onSelect={id => this.setState({ selectedTab: id })} />
				{content}
				{dialog}
			</div>
		);
	};
}

interface DeckProps {
	type: CardType;
}

interface DeckState {
	source: string;
	actions: ActionModel[];
}

class Deck extends Component<DeckProps, DeckState> {
	constructor(props: DeckProps) {
		super(props);
		this.state = {
			source: '',
			actions: []
		};
	}

	setActions = (source: string, actions: ActionModel[]) => {
		this.setState({
			source: source,
			actions: actions
		});
	};

	render = () => {
		let heading = '';
		let cards: JSX.Element[] = [];
		switch (this.props.type) {
			case CardType.Species:
				heading = 'Species Deck';
				cards = SpeciesData.getList().map(s => (
					<PlayingCard key={s.id} type={CardType.Species} front={<SpeciesCard species={s} />} onClick={() => this.setActions(s.name, s.actions)} />
				));
				break;
			case CardType.Role:
				heading = 'Role Deck';
				cards = RoleData.getList().map(r => (
					<PlayingCard key={r.id} type={CardType.Role} front={<RoleCard role={r} />} onClick={() => this.setActions(r.name, r.actions)} />
				));
				break;
			case CardType.Background:
				heading = 'Background Deck';
				cards = BackgroundData.getList().map(b => (
					<PlayingCard key={b.id} type={CardType.Background} front={<BackgroundCard background={b} />} onClick={() => this.setActions(b.name, b.actions)} />
				));
				break;
			case CardType.Item:
				heading = 'Item Deck';
				cards = ItemData.getList().map(i => (
					<PlayingCard key={i.id} type={CardType.Item} front={<ItemCard item={i} />} />
				));
				break;
		}

		let dialog = null;
		if (this.state.source !== '') {
			const actionCards = this.state.actions.map(a => (
				<PlayingCard
					key={a.id}
					type={CardType.Action}
					front={<ActionCard action={a} />}
					footer={this.state.source}
					footerType={this.props.type}
				/>
			));
			const content = (
				<div>
					<Text type={TextType.Heading}>Actions</Text>
					<CardList cards={actionCards} />
				</div>
			);
			dialog = (
				<Dialog
					content={content}
					onClose={() => this.setActions('', [])}
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
