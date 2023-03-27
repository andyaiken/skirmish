import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import type { GameModel } from '../../../models/game';

import { PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../../cards';

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
		let continueBtn = null;
		if (this.props.game?.map) {
			continueBtn = (
				<PlayingCard
					type={CardType.Species}
					stack={true}
					front={<PlaceholderCard><Text type={TextType.SubHeading}>Continue<br />Your<br />Campaign</Text></PlaceholderCard>}
					onClick={this.props.continueCampaign}
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
						front={<PlaceholderCard><Text type={TextType.SubHeading}>Start<br />A New<br />Campaign</Text></PlaceholderCard>}
						onClick={this.props.startCampaign}
					/>
					<PlayingCard
						type={CardType.Background}
						stack={true}
						front={<PlaceholderCard><Text type={TextType.SubHeading}>About<br />This<br />Game</Text></PlaceholderCard>}
						onClick={() => this.props.showHelp('game')}
					/>
				</div>
			</div>
		);
	};
}
