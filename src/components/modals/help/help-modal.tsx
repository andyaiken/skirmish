import { Component } from 'react';

import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';

import { Tabs, Text, TextType } from '../../controls';
import { AboutTab } from './about-tab/about-tab';
import { DecksTab } from './decks-tab/decks-tab';
import { RulesTab } from './rules-tab/rules-tab';

import './help-modal.scss';

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	exceptions: string[];
	rules: string;
}

interface State {
	selectedTab: string;
}

export class HelpModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedTab: 'rules'
		};
	}

	render = () => {
		try {
			const tabs = [
				{ id: 'rules', display: 'Game Rules' },
				{ id: 'decks', display: 'Your Cards' },
				{ id: 'about', display: 'About' }
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
							<DecksTab options={this.props.options} />
						</div>
					);
					break;
				case 'about':
					content = (
						<div className='content'>
							<AboutTab
								game={this.props.game}
								options={this.props.options}
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

			return (
				<div className='help-modal'>
					<Text type={TextType.Heading}>Help</Text>
					<Tabs options={tabs} selectedID={this.state.selectedTab} onSelect={id => this.setState({ selectedTab: id })} />
					{content}
				</div>
			);
		} catch {
			return <div className='help-modal render-error' />;
		}
	};
}
