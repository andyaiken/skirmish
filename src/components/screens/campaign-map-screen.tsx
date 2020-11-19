import { Button, Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import { CampaignMap, CampaignMapHelper, CampaignMapRegion } from '../../models/campaign-map';
import { Game } from '../../models/game';
import { CampaignMapPanel } from '../panels/campaign-map-panel';
import { Align } from '../utility/align';
import { Heading } from '../utility/heading';
import { Padding } from '../utility/padding';

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
		} else {
			let selection = null;
			if (this.state.selectedRegion) {
				selection = (
					<div>
						<Padding>
							<Align>
								<Heading>
									{this.state.selectedRegion.name}
								</Heading>
							</Align>
						</Padding>
						<Button block={true} onClick={() => this.props.startEncounter(this.state.selectedRegion as CampaignMapRegion)}>Start an Encounter</Button>
						<Divider/>
						<Button block={true} onClick={() => { this.setState({ selectedRegion: null }); this.props.conquer(this.state.selectedRegion as CampaignMapRegion); }}>CONQUER</Button>
					</div>
				);
			} else {
				selection = (
					<div>
						<Divider/>
						<Padding>
							<Align>
								Select a region on the map.
							</Align>
						</Padding>
					</div>
				);
			}

			options = (
				<Row gutter={10}>
					<Col span={12}>
						<Divider/>
						<Button block={true} onClick={() => this.props.viewHeroes()}>Your Heroes</Button>
						<Divider>Options</Divider>
						<Button block={true} onClick={() => this.props.endCampaign()}>Abandon This Campaign</Button>
					</Col>
					<Col span={12}>
						{selection}
					</Col>
				</Row>
			);
		}

		return (
			<div>
				<CampaignMapPanel
					map={this.props.game.map as CampaignMap}
					selectedRegion={this.state.selectedRegion}
					onSelectRegion={region => this.setState({ selectedRegion: region })}
				/>
				{options}
			</div>
		);
	}
}
