import { Component } from 'react';

import type { GameModel } from '../../../models/game';

import { PlaceholderCard } from '../../cards';
import { PlayingCard } from '../../controls';

import './landing-screen.scss';

interface Props {
	game: GameModel | null;
	startCampaign: () => void;
	continueCampaign: () => void;
}

export class LandingScreen extends Component<Props> {
	render = () => {
		let continueBtn = null;
		if (this.props.game?.map) {
			continueBtn = (
				<PlayingCard front={<PlaceholderCard>Continue your campaign</PlaceholderCard>} onClick={this.props.continueCampaign} />
			);
		}

		return (
			<div className='landing-screen'>
				<div className='landing-top-bar'>
					<div className='logo-text inset-text'>Skirmish</div>
				</div>
				<div className='landing-content'>
					{ continueBtn }
					<PlayingCard front={<PlaceholderCard>Start a new campaign</PlaceholderCard>} onClick={this.props.startCampaign} />
				</div>
			</div>
		);
	};
}
