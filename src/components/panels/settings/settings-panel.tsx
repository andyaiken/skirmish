import { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import { BackgroundData } from '../../../data/background-data';
import { ItemData } from '../../../data/item-data';
import { RoleData } from '../../../data/role-data';
import { SpeciesData } from '../../../data/species-data';

import { CardType } from '../../../enums/card-type';
import { CombatantType } from '../../../enums/combatant-type';

import { GameLogic } from '../../../logic/game-logic';

import type { ActionModel } from '../../../models/action';
import type { GameModel } from '../../../models/game';

import { ActionCard, BackgroundCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, Dialog, PlayingCard, StatValue, Switch, Tabs, Text, TextType } from '../../controls';

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
	actionSourceName: string;
	actionSourceType: CardType;
	actions: ActionModel[];
}

export class SettingsPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedTab: 'rules',
			local: window.location.href.includes('localhost'),
			actionSourceName: '',
			actionSourceType: CardType.Default,
			actions: []
		};
	}

	setActions = (source: string, type: CardType, actions: ActionModel[]) => {
		this.setState({
			actionSourceName: source,
			actionSourceType: type,
			actions: actions
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
					<div className='content'>
						<div className='cards'>
							<div className='card-cell'>
								<PlayingCard
									stack={true}
									type={CardType.Species}
									front={<PlaceholderCard text={<div>Species<br />Deck</div>} subtext='Heroes' />}
								/>
							</div>
							{
								SpeciesData.getList().filter(s => s.type === CombatantType.Hero).map(s => {
									return (
										<div key={s.id} className='card-cell'>
											<PlayingCard
												type={CardType.Species}
												front={<SpeciesCard species={s} />}
												footer='Species'
												onClick={() => this.setActions(s.name, CardType.Species, s.actions)}
											/>
											{this.props.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
										</div>
									);
								})
							}
						</div>
						<hr />
						<div className='cards'>
							<div className='card-cell'>
								<PlayingCard
									stack={true}
									type={CardType.Species}
									front={<PlaceholderCard text={<div>Species<br />Deck</div>} subtext='Monsters' />}
								/>
							</div>
							{
								SpeciesData.getList().filter(s => s.type === CombatantType.Monster).map(s => {
									return (
										<div key={s.id} className='card-cell'>
											<PlayingCard
												type={CardType.Species}
												front={<SpeciesCard species={s} />}
												footer='Species'
												onClick={() => this.setActions(s.name, CardType.Species, s.actions)}
											/>
											{this.props.developer ? <StatValue label='Strength' value={GameLogic.getSpeciesStrength(s)} /> : null}
										</div>
									);
								})
							}
						</div>
						<hr />
						<div className='cards'>
							<div className='card-cell'>
								<PlayingCard
									stack={true}
									type={CardType.Role}
									front={<PlaceholderCard text={<div>Role<br />Deck</div>} />}
								/>
							</div>
							{
								RoleData.getList().map(r => {
									return (
										<div key={r.id} className='card-cell'>
											<PlayingCard
												type={CardType.Role}
												front={<RoleCard role={r} />}
												footer='Role'
												onClick={() => this.setActions(r.name, CardType.Role, r.actions)}
											/>
											{this.props.developer ? <StatValue label='Strength' value={GameLogic.getRoleStrength(r)} /> : null}
										</div>
									);
								})
							}
						</div>
						<hr />
						<div className='cards'>
							<div className='card-cell'>
								<PlayingCard
									stack={true}
									type={CardType.Background}
									front={<PlaceholderCard text={<div>Background<br />Deck</div>} />}
								/>
							</div>
							{
								BackgroundData.getList().map(b => {
									return (
										<div key={b.id} className='card-cell'>
											<PlayingCard
												type={CardType.Background}
												front={<BackgroundCard background={b} />}
												footer='Background'
												onClick={() => this.setActions(b.name, CardType.Background, b.actions)}
											/>
											{this.props.developer ? <StatValue label='Strength' value={GameLogic.getBackgroundStrength(b)} /> : null}
										</div>
									);
								})
							}
						</div>
						<hr />
						<div className='cards'>
							<div className='card-cell'>
								<PlayingCard
									stack={true}
									type={CardType.Item}
									front={<PlaceholderCard text={<div>Item<br />Deck</div>} />}
								/>
							</div>
							{
								ItemData.getList().map(i => {
									return (
										<div key={i.id} className='card-cell'>
											<PlayingCard
												type={CardType.Item}
												front={<ItemCard item={i} />}
												footer='Item'
											/>
										</div>
									);
								})
							}
						</div>
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
		if (this.state.actionSourceName !== '') {
			const actionCards = this.state.actions.map(a => (
				<PlayingCard
					key={a.id}
					type={CardType.Action}
					front={<ActionCard action={a} />}
					footer={this.state.actionSourceName}
					footerType={this.state.actionSourceType}
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
					onClose={() => this.setActions('', CardType.Default, [])}
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
