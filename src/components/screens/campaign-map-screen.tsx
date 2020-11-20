import { Button, Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import { CampaignMap, CampaignMapHelper, CampaignMapRegion } from '../../models/campaign-map';
import { Game } from '../../models/game';
import { CampaignMapPanel } from '../panels/campaign-map-panel';
import { Heading } from '../utility/heading';

interface Props {
	game: Game;
	viewHeroes: () => void;
	startEncounter: (region: CampaignMapRegion) => void;
	endCampaign: () => void;
	conquer: (region: CampaignMapRegion) => void; // TEMP
}

interface State {
	selectedRegion: CampaignMapRegion | null;
}

export class CampaignMapScreen extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedRegion: null
		};
	}

	public render() {
		let options = null;
		if (CampaignMapHelper.isConquered(this.props.game.map as CampaignMap)) {
			options = (
				<div>
					<Typography.Title>
						You have conquered the island!
					</Typography.Title>
					<Button block={true} onClick={() => this.props.endCampaign()}>Done</Button>
				</div>
			);
		} else if (this.props.game.heroes.length === 0) {
			options = (
				<div>
					<Typography.Paragraph>
						You have no more heroes. You have not been able to conquer the island, this time.
					</Typography.Paragraph>
					<Button block={true} onClick={() => this.props.endCampaign()}>Done</Button>
				</div>
			);
		} else if (this.state.selectedRegion) {
			options = (
				<div>
					<Divider>
						<Heading>
							{this.state.selectedRegion.name}
						</Heading>
					</Divider>
					<Button block={true} onClick={() => this.props.startEncounter(this.state.selectedRegion as CampaignMapRegion)}>Start an Encounter</Button>
					<Divider/>
					<Button block={true} onClick={() => { this.setState({ selectedRegion: null }); this.props.conquer(this.state.selectedRegion as CampaignMapRegion); }}>Auto-Conquer</Button>
				</div>
			);
		} else {
			options = (
				<div>
					<Divider/>
					<Button block={true} onClick={() => this.props.viewHeroes()}>Your Heroes</Button>
					<Divider/>
					<Button block={true} onClick={() => this.props.endCampaign()}>Abandon This Campaign</Button>
				</div>
			);
		}

		return (
			<div>
				<CampaignMapPanel
					map={this.props.game.map as CampaignMap}
					selectedRegion={this.state.selectedRegion}
					onSelectRegion={region => this.setState({ selectedRegion: region })}
				/>
				<Row justify='center'>
					<Col span={8}>
						{options}
					</Col>
				</Row>
			</div>
		);
	}
}
