import { Component } from 'react';
import { Selector } from '../../../controls';
import { CampaignMap, CampaignMapRegion, isConquered } from '../../../models/campaign-map';
import { Game } from '../../../models/game';
import { BoonCard } from '../../cards';
import { CampaignMapPanel } from '../../panels';
import { PlayingCard, Text, TextType } from '../../utility';

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
		let info = null;
		if (isConquered(this.props.game.map as CampaignMap)) {
			info = (
				<div className='won'>
					<Text type={TextType.SubHeading}>You have conquered the island!</Text>
					<hr />
					<Text>Well done!</Text>
					<button onClick={() => this.props.endCampaign()}>Done</button>
				</div>
			);
		} else if (this.props.game.heroes.length === 0) {
			info = (
				<div className='lost'>
					<Text type={TextType.SubHeading}>You have no more heroes.</Text>
					<hr />
					<Text>You have not been able to conquer the island, this time.</Text>
					<button onClick={() => this.props.endCampaign()}>Done</button>
				</div>
			);
		} else if (this.state.selectedRegion) {
			info = (
				<div className='region'>
					<Text type={TextType.SubHeading}>{this.state.selectedRegion.name}</Text>
					<hr />
					<Text>If you conquer {this.state.selectedRegion.name}, you will recieve:</Text>
					<div className='boon'>
						<PlayingCard front={<BoonCard boon={this.state.selectedRegion.boon} />} />
					</div>
					<hr />
					<button disabled={(this.props.game.heroes.length === 0) || this.props.game.heroes.every(h => !h.name)} onClick={() => this.props.startEncounter(this.state.selectedRegion as CampaignMapRegion)}>
						Start an encounter here
					</button>
					<button className='hack' onClick={() => { this.setState({ selectedRegion: null }); this.props.conquer(this.state.selectedRegion as CampaignMapRegion); }}>
						Auto-conquer
					</button>
				</div>
			);
		} else {
			info = (
				<div>
					<Text>This is the map of the island.</Text>
					<Text>Select a region to learn more about it.</Text>
					<hr />
					<button onClick={() => this.props.endCampaign()}>Abandon This Campaign</button>
				</div>
			);
		}

		return (
			<div className='campaign-map-screen'>
				<Selector options={[{ id: 'heroes', display: 'Your Heroes' }, { id: 'map', display: 'The Island' }]} selectedID='map' onSelect={this.props.viewHeroes} />
				<div className='row'>
					<div className='map'>
						<CampaignMapPanel
							map={this.props.game.map as CampaignMap}
							selectedRegion={this.state.selectedRegion}
							onSelectRegion={region => this.setState({ selectedRegion: region })}
						/>
					</div>
					<div className='info'>
						{info}
					</div>
				</div>
			</div>
		);
	}
}
