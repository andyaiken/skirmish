import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import type { GameModel } from '../../../models/game';

import { PlaceholderCard } from '../../cards';
import { PlayingCard } from '../../controls';

import './landing-screen.scss';

interface Props {
	game: GameModel | null;
	developer: boolean;
	showHelp: (file: string) => void;
	startCampaign: () => void;
	continueCampaign: () => void;
}

export class LandingScreen extends Component<Props> {
	render = () => {
		try {
			let continueBtn = null;
			if (this.props.game?.map) {
				continueBtn = (
					<PlayingCard
						type={CardType.Species}
						stack={true}
						front={<PlaceholderCard text='Continue' subtext='Continue your current campaign' onClick={this.props.continueCampaign} />}
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
							stack={true}
							front={<PlaceholderCard text='New Campaign' subtext='Begin a new Skirmish campaign' onClick={this.props.startCampaign} />}
						/>
						<PlayingCard
							type={CardType.Background}
							stack={true}
							front={<PlaceholderCard text='About' subtext='Learn about this game' onClick={() => this.props.showHelp('game')} />}
						/>
					</div>
				</div>
			);
		} catch {
			return <div className='landing-screen render-error' />;
		}
	};
}
