import { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import { BackgroundData } from '../../../data/background-data';
import { HeroSpeciesData } from '../../../data/hero-species-data';
import { ItemData } from '../../../data/item-data';
import { MonsterSpeciesData } from '../../../data/monster-species-data';
import { RoleData } from '../../../data/role-data';

import { CardType } from '../../../enums/card-type';

import { GameLogic } from '../../../logic/game-logic';

import type { ActionModel } from '../../../models/action';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';

import { ActionCard, BackgroundCard, FeatureCard, ItemCard, PlaceholderCard, RoleCard, SpeciesCard } from '../../cards';
import { CardList, ConfirmButton, Dialog, PlayingCard, StatValue, Switch, Tabs, Text, TextType } from '../../controls';

import './settings-panel.scss';

import pkg from '../../../../package.json';

interface Props {
	game: GameModel | null;
	exceptions: string[];
	rules: string;
	options: OptionsModel;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
	setSoundEffectsVolume: (value: number) => void;
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
							<DecksTab developer={this.props.options.developer} setActions={this.setActions} />
						</div>
					);
					break;
				case 'options':
					content = (
						<div className='content'>
							<OptionsTab
								game={this.props.game}
								options={this.props.options}
								version={pkg.version}
								local={this.state.local}
								endCampaign={this.props.endCampaign}
								setDeveloperMode={this.props.setDeveloperMode}
								setSoundEffectsVolume={this.props.setSoundEffectsVolume}
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
						<PlayingCard type={CardType.Feature} stack={true} front={<PlaceholderCard text='Feature Deck' />} />
					</div>
				];
				this.state.features.forEach(f => {
					featureCards.push(
						<div key={f.id}>
							<FeatureCard
								feature={f}
								footer={this.state.actionSourceName}
								footerType={this.state.actionSourceType}
							/>
							{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getFeatureStrength(f)} /> : null}
						</div>
					);
				});
				const actionCards = [
					<div key='deck'>
						<PlayingCard type={CardType.Action} stack={true} front={<PlaceholderCard text='Action Deck' />} />
					</div>
				];
				this.state.actions.forEach(a => {
					actionCards.push(
						<div key={a.id}>
							<ActionCard
								action={a}
								footer={this.state.actionSourceName}
								footerType={this.state.actionSourceType}
							/>
							{this.props.options.developer ? <StatValue label='Strength' value={GameLogic.getActionStrength(a)} /> : null}
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
						level={2}
						onClose={() => this.setActions('', CardType.Default, [], [])}
					/>
				);
			}

			return (
				<div className='settings-panel'>
					<Text type={TextType.Heading}>About</Text>
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
							front={<PlaceholderCard text='Hero Species Deck' />}
						/>
					</div>
					{
						HeroSpeciesData.getList().map(s => {
							return (
								<div key={s.id} className='card-cell'>
									<SpeciesCard species={s} onSelect={species => this.props.setActions(species.name, CardType.Species, species.features, species.actions)} />
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
							front={<PlaceholderCard text='Monster Species Deck' />}
						/>
					</div>
					{
						MonsterSpeciesData.getList().map(s => {
							return (
								<div key={s.id} className='card-cell'>
									<SpeciesCard species={s} onSelect={species => this.props.setActions(species.name, CardType.Species, species.features, species.actions)} />
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
							front={<PlaceholderCard text='Role Deck' />}
						/>
					</div>
					{
						RoleData.getList().map(r => {
							return (
								<div key={r.id} className='card-cell'>
									<RoleCard role={r} onSelect={role => this.props.setActions(role.name, CardType.Role, role.features, role.actions)} />
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
							front={<PlaceholderCard text='Background Deck' />}
						/>
					</div>
					{
						BackgroundData.getList().map(b => {
							return (
								<div key={b.id} className='card-cell'>
									<BackgroundCard background={b} onSelect={background => this.props.setActions(background.name, CardType.Background, background.features, background.actions)} />
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
							front={<PlaceholderCard text='Item Deck' />}
						/>
					</div>
					{
						ItemData.getList().map(i => {
							return (
								<div key={i.id} className='card-cell'>
									<ItemCard item={i} />
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
	options: OptionsModel;
	version: string;
	local: boolean;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
	setSoundEffectsVolume: (value: number) => void;
}

class OptionsTab extends Component<OptionsTabProps> {
	render = () => {
		return (
			<div className='content'>
				{this.props.local ? <Switch label='Developer Mode' checked={this.props.options.developer} onChange={this.props.setDeveloperMode} /> : null}
				<hr />
				<Text type={TextType.MinorHeading}>Sound Effects Volume</Text>
				<input
					type='range'
					min={0}
					max={1}
					step={0.1}
					value={this.props.options.soundEffectsVolume}
					onChange={e => this.props.setSoundEffectsVolume(parseFloat(e.target.value))}
				/>
				<hr />
				{this.props.game ? <ConfirmButton label='Abandon this Campaign' onClick={() => this.props.endCampaign()} /> : null}
				<hr />
				<Text>Version {this.props.version}</Text>
			</div>
		);
	};
}
