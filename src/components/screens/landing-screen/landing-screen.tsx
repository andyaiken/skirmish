import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import type { GameModel } from '../../../models/game';

import { Dialog, PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../../cards';
import { SettingsPanel } from '../../panels';

import './landing-screen.scss';

interface Props {
	game: GameModel | null;
	developer: boolean;
	startCampaign: () => void;
	continueCampaign: () => void;
	endCampaign: () => void;
	setDeveloperMode: (value: boolean) => void;
}

interface State {
	showSettings: boolean;
}

export class LandingScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showSettings: false
		};
	}

	setShowSettings = (show: boolean) => {
		this.setState({
			showSettings: show
		});
	};

	render = () => {
		let continueBtn = null;
		if (this.props.game?.map) {
			continueBtn = (
				<PlayingCard
					type={CardType.Species}
					front={<PlaceholderCard><Text type={TextType.SubHeading}>Continue<br />Your<br />Campaign</Text></PlaceholderCard>}
					onClick={this.props.continueCampaign}
				/>
			);
		}

		let dialog = null;
		if (this.state.showSettings) {
			dialog = (
				<Dialog
					content={
						<SettingsPanel
							game={this.props.game}
							developer={this.props.developer}
							endCampaign={this.props.endCampaign}
							setDeveloperMode={this.props.setDeveloperMode}
						/>}
					onClose={() => this.setShowSettings(false)}
				/>
			);
		}

		return (
			<div className='landing-screen'>
				<div className='landing-top-bar'>
					<div className='logo-text inset-text'>Skirmish</div>
				</div>
				<div className='landing-content'>
					{ continueBtn }
					<PlayingCard
						type={CardType.Role}
						front={<PlaceholderCard><Text type={TextType.SubHeading}>Start<br />A New<br />Campaign</Text></PlaceholderCard>}
						onClick={this.props.startCampaign}
					/>
					<PlayingCard
						type={CardType.Background}
						front={<PlaceholderCard><Text type={TextType.SubHeading}>About<br />This<br />Game</Text></PlaceholderCard>}
						onClick={() => this.setShowSettings(true)}
					/>
				</div>
				{dialog}
			</div>
		);
	};
}
