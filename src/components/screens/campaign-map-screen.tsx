import { Button, Col, Divider, Row } from 'antd';
import React from 'react';
import { CampaignMap } from '../../models/campaign-map';
import { Game } from '../../models/game';
import { CampaignMapPanel } from '../panels/campaign-map-panel';

// TODO: Select region, inspect region details, start encounter there

interface Props {
	game: Game;
	viewHeroes: () => void;
	startEncounter: () => void;
	abandonCampaign: () => void;
}

export class CampaignMapScreen extends React.Component<Props> {
	public render() {
		// TODO:
		// If island conquered, show victory message and button to clear game and go to landing page
		// If no heroes, show defeat message and button to clear game and go to landing page

		return (
			<div>
				<CampaignMapPanel map={this.props.game.map as CampaignMap} />
				<Divider/>
				<Row gutter={10}>
					<Col span={8}>
						<Button block={true} onClick={() => this.props.viewHeroes()}>YOUR HEROES</Button>
					</Col>
					<Col span={8}>
						<Button block={true} onClick={() => this.props.startEncounter()}>START AN ENCOUNTER</Button>
					</Col>
					<Col span={8}>
						<Button block={true} onClick={() => this.props.abandonCampaign()}>ABANDON THIS CAMPAIGN</Button>
					</Col>
				</Row>
			</div>
		);
	}
}
