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
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';

import { ActionCard, BackgroundCard, FeatureCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, Dialog, PlayingCard, StatValue, Switch, Tabs, Text, TextType } from '../../controls';

import './settings-panel.scss';

import pkg from '../../../../package.json';

interface Props {
	game: GameModel | null;
	exceptions: string[];
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
	features: FeatureModel[];
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
			features: [],
			actions: []
		};
	}

	setActions = (source: string, type: CardType, features: FeatureModel[], actions: ActionModel[]) => {
		this.setState({
			actionSourceName: source,
			actionSourceType: type,
			features: features,
			actions: actions
		});
	};

	render = () => {
		try {
			const tabs = [
				{ id: 'rules', display: 'Rules' },
				{ id: 'decks', display: 'Decks' },
				{ id: 'options', display: 'Options' }
			];

			if (this.props.exceptions.length > 0) {
				tabs.push({ id: 'exceptions', display: 'Exceptions' });
			}

			let content = null;
			switch (this.state.selectedTab) {
				case 'rules':
					content = (
						<div className='content'>
							<RulesTab rules={this.props.rules} />
						</div>
					);
					break;
				case 'decks':
					content = (
						<div className='content'>
							<DecksTab developer={this.props.developer} setActions={this.setActions} />
						</div>
					);
					break;
				case 'options':
					content = (
						<div className='content'>
							<OptionsTab
								game={this.props.game}
								version={pkg.version}
								developer={this.props.developer}
								local={this.state.local}
								endCampaign={this.props.endCampaign}
								setDeveloperMode={this.props.setDeveloperMode}
							/>
						</div>
					);
					break;
				case 'exceptions':
					content = (
						<div className='content'>
							{this.props.exceptions.map((ex, n) => <Text key={n}>{ex}</Text>)}
						</div>
					);
					break;
			}

			let dialog = null;
			if (this.state.actionSourceName !== '') {
				const featureCards = [
					<div key='deck'>
						<PlayingCard type={CardType.Feature} stack={true} front={<PlaceholderCard text={<div>Feature<br />Deck</div>} />} />
					</div>
				];
				this.state.features.forEach(f => {
					featureCards.push(
						<div key={f.id}>
							<PlayingCard
								type={CardType.Feature}
								front={<FeatureCard feature={f} />}
								footer={this.state.actionSourceName}
								footerType={this.state.actionSourceType}
							/>
							{this.props.developer ? <StatValue label='Strength' value={GameLogic.getFeatureStrength(f)} /> : null}
						</div>
					);
				});
				const actionCards = [
					<div key='deck'>
						<PlayingCard type={CardType.Action} stack={true} front={<PlaceholderCard text={<div>Action<br />Deck</div>} />} />
					</div>
				];
				this.state.actions.forEach(a => {
					actionCards.push(
						<div key={a.id}>
							<PlayingCard
								type={CardType.Action}
								front={<ActionCard action={a} />}
								footer={this.state.actionSourceName}
								footerType={this.state.actionSourceType}
							/>
							{this.props.developer ? <StatValue label='Strength' value={GameLogic.getActionStrength(a)} /> : null}
						</div>
					);
				});
				const content = (
					<div>
						<Text type={TextType.Heading}>{this.state.actionSourceName}</Text>
						<hr />
						<CardList cards={featureCards} />
						<hr />
						<CardList cards={actionCards} />
					</div>
				);
				dialog = (
					<Dialog
						content={content}
						onClose={() => this.setActions('', CardType.Default, [], [])}
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
		} catch {
			return <div className='settings-panel render-error' />;
		}
	};
}

interface RulesTabProps {
	rules: string;
}

class RulesTab extends Component<RulesTabProps> {
	render = () => {
		return (
			<ReactMarkdown>{this.props.rules}</ReactMarkdown>
		);
	};
}

interface DecksTabProps {
	developer: boolean;
	setActions: (source: string, type: CardType, features: FeatureModel[], actions: ActionModel[]) => void;
}

class DecksTab extends Component<DecksTabProps> {
	render = () => {
		return (
			<div>
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
										onClick={() => this.props.setActions(s.name, CardType.Species, s.features, s.actions)}
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
										footer='Monster'
										onClick={() => this.props.setActions(s.name, CardType.Species, s.features, s.actions)}
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
										onClick={() => this.props.setActions(r.name, CardType.Role, r.features, r.actions)}
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
										onClick={() => this.props.setActions(b.name, CardType.Background, b.features, b.actions)}
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
	};
}

interface OptionsTabProps {
	game: GameModel | null;
	version: string;
	developer: boolean;
	local: boolean;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
}

class OptionsTab extends Component<OptionsTabProps> {
	render = () => {
		return (
			<div className='content'>
				{this.props.local ? <Switch label='Developer Mode' checked={this.props.developer} onChange={this.props.setDeveloperMode} /> : null}
				{this.props.game ? <button className='danger' onClick={() => this.props.endCampaign()}>Abandon this Campaign</button> : null}
				<hr />
				<Text>Version {this.props.version}</Text>
			</div>
		);
	};
}
