import { Button } from 'antd';
import React from 'react';
import { Game } from '../../models/game';

interface Props {
	game: Game | null;
	startCampaign: () => void;
	continueCampaign: () => void;
}

export class LandingScreen extends React.Component<Props> {
	public render() {
		if (this.props.game && this.props.game.map) {
			return (
				<div>
					<Button block={true} type='primary' onClick={() => this.props.continueCampaign()}>Continue your campaign</Button>
				</div>
			);
		}

		return (
			<div>
				<Button block={true} type='primary' onClick={() => this.props.startCampaign()}>Start a new campaign</Button>
			</div>
		);
	}
}
