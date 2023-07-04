import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import { GameLogic } from '../../../logic/game-logic';

import type { ActionModel } from '../../../models/action';
import type { FeatureModel } from '../../../models/feature';
import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';

import { ActionCard, FeatureCard } from '../../cards';
import { CardList, Dialog, StatValue, Tabs, Text, TextType } from '../../controls';
import { DecksTab } from './decks-tab/decks-tab';
import { OptionsTab } from './options-tab/options-tab';
import { PacksTab } from './packs-tab/packs-tab';
import { RulesTab } from './rules-tab/rules-tab';

import './settings-panel.scss';

import pkg from '../../../../package.json';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	exceptions: string[];
	rules: string;
	addPack: (packID: string) => void;
	removePack: (packID: string) => void;
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
				{ id: 'packs', display: 'Packs' },
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
							<DecksTab
								options={this.props.options}
								setActions={this.setActions}
							/>
						</div>
					);
					break;
				case 'packs':
					content = (
						<div className='content'>
							<PacksTab
								options={this.props.options}
								addPack={this.props.addPack}
								setActions={this.setActions}
							/>
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
								removePack={this.props.removePack}
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
				const featureCards = this.state.features.map(f => {
					return (
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
				const actionCards = this.state.actions.map(a => {
					return (
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
						<Text type={TextType.SubHeading}>Feature Cards</Text>
						<CardList cards={featureCards} />
						<hr />
						<Text type={TextType.SubHeading}>Action Cards</Text>
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
