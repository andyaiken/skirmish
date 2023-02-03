import { Component } from 'react';
import { CampaignMap, CampaignMapHelper, CampaignMapRegion } from '../../../models/campaign-map';
import { Game } from '../../../models/game';
import { CampaignMapPanel } from '../../panels';
import { Text, TextType } from '../../utility';

import './campaign-map-screen.scss';

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

export class CampaignMapScreen extends Component<Props, State> {
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
					<Text>You have conquered the island!</Text>
					<button onClick={() => this.props.endCampaign()}>Done</button>
				</div>
			);
		} else if (this.props.game.heroes.length === 0) {
			options = (
				<div>
					<Text>You have no more heroes. You have not been able to conquer the island, this time.</Text>
					<button onClick={() => this.props.endCampaign()}>Done</button>
				</div>
			);
		} else if (this.state.selectedRegion) {
			options = (
				<div>
					<Text type={TextType.Heading}>
						{this.state.selectedRegion.name}
					</Text>
					<button onClick={() => this.props.startEncounter(this.state.selectedRegion as CampaignMapRegion)}>Start an Encounter</button>
					<button onClick={() => { this.setState({ selectedRegion: null }); this.props.conquer(this.state.selectedRegion as CampaignMapRegion); }}>Auto-Conquer</button>
				</div>
			);
		} else {
			options = (
				<div>
					<button onClick={() => this.props.viewHeroes()}>Your Heroes</button>
					<button onClick={() => this.props.endCampaign()}>Abandon This Campaign</button>
				</div>
			);
		}

		return (
			<div className='campaign-map-screen'>
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
