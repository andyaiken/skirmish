import { Component } from 'react';
import { Selector } from '../../../controls';
import { BoonType } from '../../../models/boon';
import { CampaignMapRegion } from '../../../models/campaign-map';
import { Game } from '../../../models/game';
import { Hero } from '../../../models/hero';
import { Item } from '../../../models/item';
import { BoonCard, HeroCard, ItemCard } from '../../cards';
import { CampaignMapPanel } from '../../panels';
import { Dialog, PlayingCard, StatValue, Text, TextType } from '../../utility';

import './campaign-map-screen.scss';

interface Props {
	game: Game;
	viewHeroes: () => void;
	startEncounter: (region: CampaignMapRegion, heroes: Hero[]) => void;
	endCampaign: () => void;
}

interface State {
	showHeroSelection: boolean;
	selectedRegion: CampaignMapRegion | null;
	selectedHeroes: Hero[];
}

export class CampaignMapScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showHeroSelection: false,
			selectedRegion: null,
			selectedHeroes: []
		};
	}

	selectHero = (hero: Hero) => {
		const selected = this.state.selectedHeroes;
		selected.push(hero);
		this.setState({
			selectedHeroes: selected
		});
	}

	deselectHero = (hero: Hero) => {
		const selected = this.state.selectedHeroes.filter(h => h.id !== hero.id);
		this.setState({
			selectedHeroes: selected
		});
	}

	startEncounter = () => {
		this.props.startEncounter(this.state.selectedRegion as CampaignMapRegion, this.state.selectedHeroes);
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
					<button disabled={this.props.game.heroes.filter(h => h.name !== '').length < 0} onClick={() => this.setState({ showHeroSelection: true })}>
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

		let dialog = null;
		if (this.state.showHeroSelection) {
			const candidates = this.props.game.heroes
				.filter(h => h.name !== '')
				.filter(h => !this.state.selectedHeroes.includes(h))
				.map(h => {
					return (
						<div key={h.id}>
							<PlayingCard front={<HeroCard hero={h} />} />
							<button onClick={() => this.selectHero(h)}>Select</button>
						</div>
					);
				});

			const selected = this.state.selectedHeroes
				.map(h => {
					return (
						<div key={h.id}>
							<PlayingCard front={<HeroCard hero={h} />} />
							<button onClick={() => this.deselectHero(h)}>Deselect</button>
						</div>
					);
				});

			dialog = (
				<Dialog
					content={(
						<div className='hero-selection'>
							<Text type={TextType.Heading}>Choose your Heroes</Text>
							<div className='hero-lists'>
								<div className='hero-list-column'>
									<Text type={TextType.SubHeading}>Available heroes</Text>
									<div className='list'>
										{candidates}
									</div>
								</div>
								<div className='hero-list-column'>
									<Text type={TextType.SubHeading}>Selected heroes</Text>
									<div className='list'>
										{selected}
									</div>
								</div>
							</div>
							<button disabled={this.state.selectedHeroes.length !== 0} onClick={this.startEncounter}>Start the Encounter</button>
						</div>
					)}
					onClickOff={() => {
						this.setState({
							showHeroSelection: false
						});
					}}
				/>
			)
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
				{dialog}
			</div>
		);
	}
}
