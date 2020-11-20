import { Button } from 'antd';
import React from 'react';
import { Game } from '../../models/game';
import { Align } from '../utility/align';

interface Props {
	game: Game | null;
	startCampaign: () => void;
	continueCampaign: () => void;
}

export class LandingScreen extends React.Component<Props> {
	public render() {
		if (this.props.game && this.props.game.map) {
			return (
				<Align>
					<Button block={true} type='primary' onClick={() => this.props.continueCampaign()}>Continue your campaign</Button>
				</Align>
			);
		}

		return (
			<Align>
				<Button block={true} type='primary' onClick={() => this.props.startCampaign()}>Start a new campaign</Button>
			</Align>
		);
	}
}
