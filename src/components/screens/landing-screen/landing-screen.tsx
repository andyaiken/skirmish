import { Component } from 'react';
import { Game } from '../../../models/game';

import './landing-screen.scss';

interface Props {
	game: Game | null;
	startCampaign: () => void;
	continueCampaign: () => void;
}

export class LandingScreen extends Component<Props> {
	public render() {
		let continueBtn = null;
		if (this.props.game?.map) {
			continueBtn = (
				<button onClick={this.props.continueCampaign}>Continue your current campaign</button>
			);
		}


		return (
			<div className='landing-screen'>
				{ continueBtn }
				<button onClick={this.props.startCampaign}>Start a new campaign</button>
			</div>
		);
	}
}
