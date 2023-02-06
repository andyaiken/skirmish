import { Component } from 'react';
import { Selector } from '../../../controls';
import { BoonType } from '../../../models/boon';
import { CampaignMapRegion } from '../../../models/campaign-map';
import { Game } from '../../../models/game';
import { Item } from '../../../models/item';
import { BoonCard, ItemCard } from '../../cards';
import { CampaignMapPanel } from '../../panels';
import { PlayingCard, StatValue, Text, TextType } from '../../utility';

import './campaign-map-screen.scss';

interface Props {
	game: Game;
	viewHeroes: () => void;
	startEncounter: (region: CampaignMapRegion) => void;
	endCampaign: () => void;
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
		if (this.state.selectedRegion) {
			let boon = <PlayingCard front={<BoonCard boon={this.state.selectedRegion.boon} />} />;
			if (this.state.selectedRegion.boon.type === BoonType.MagicItem) {
				const item: Item = this.state.selectedRegion.boon.data as Item;
				boon = <PlayingCard front={<ItemCard item={item} />} />;
			}
			info = (
				<div className='region'>
					<Text type={TextType.SubHeading}>{this.state.selectedRegion.name}</Text>
					<hr />
					<StatValue label='Encounters' value={this.state.selectedRegion.count} />
					<hr />
					<Text>If you conquer {this.state.selectedRegion.name}, you will recieve:</Text>
					<div className='boon'>
						{boon}
					</div>
					<hr />
					<button disabled={(this.props.game.heroes.length === 0) || this.props.game.heroes.every(h => !h.name)} onClick={() => this.props.startEncounter(this.state.selectedRegion as CampaignMapRegion)}>
						Start an encounter here
					</button>
				</div>
			);
		} else {
			info = (
				<div>
					<Text>This is the map of the island.</Text>
					<Text>There are {this.props.game.map.regions.length} regions, which you must attack and conquer.</Text>
					{this.props.game.map.squares.some(sq => sq.regionID === '') ? <Text>The white area is land you have already conquered.</Text> : ''}
					<Text>Select a region to learn more about it.</Text>
					<hr />
					<button onClick={() => this.props.endCampaign()}>Abandon This Campaign</button>
				</div>
			);
		}

		return (
			<div className='campaign-map-screen'>
				<Selector options={[{ id: 'heroes', display: 'Your Team' }, { id: 'map', display: 'The Island' }]} selectedID='map' onSelect={this.props.viewHeroes} />
				<div className='row'>
					<div className='map'>
						<CampaignMapPanel
							map={this.props.game.map}
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
