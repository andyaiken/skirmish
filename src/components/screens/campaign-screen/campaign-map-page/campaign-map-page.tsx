import { Component } from 'react';
import { Dialog, Text, TextType } from '../../../../controls';
import type { CampaignMapRegionModel } from '../../../../models/campaign-map';
import type { GameModel } from '../../../../models/game';
import type { CombatantModel } from '../../../../models/combatant';
import { CampaignMapUtils } from '../../../../logic/campaign-map-utils';
import { BoonCard, HeroCard } from '../../../cards';
import { CampaignMapPanel } from '../../../panels';
import { CardList, PlayingCard, StatValue } from '../../../utility';

import './campaign-map-page.scss';

interface Props {
	game: GameModel;
	startEncounter: (region: CampaignMapRegionModel, heroes: CombatantModel[]) => void;
}

interface State {
	showHeroSelection: boolean;
	selectedRegion: CampaignMapRegionModel | null;
	selectedHeroes: CombatantModel[];
}

export class CampaignMapPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showHeroSelection: false,
			selectedRegion: null,
			selectedHeroes: []
		};
	}

	selectHero = (hero: CombatantModel) => {
		const selected = this.state.selectedHeroes;
		selected.push(hero);
		this.setState({
			selectedHeroes: selected
		});
	};

	deselectHero = (hero: CombatantModel) => {
		const selected = this.state.selectedHeroes.filter(h => h.id !== hero.id);
		this.setState({
			selectedHeroes: selected
		});
	};

	startEncounter = () => {
		this.props.startEncounter(this.state.selectedRegion as CampaignMapRegionModel, this.state.selectedHeroes);
	};

	public render() {
		let info = null;
		if (this.state.selectedRegion) {
			const canAttack = CampaignMapUtils.canAttackRegion(this.props.game.map, this.state.selectedRegion);
			const heroesExist = this.props.game.heroes.filter(h => h.name !== '').length > 0;
			info = (
				<div className='region'>
					<Text type={TextType.SubHeading}>{this.state.selectedRegion.name}</Text>
					<hr />
					<StatValue label='Size' value={`${CampaignMapUtils.getCampaignMapSquares(this.props.game.map, this.state.selectedRegion).length} sq mi`} />
					<StatValue label='Number of Encounters' value={this.state.selectedRegion.encounters.length} />
					<hr />
					<Text>If you take control of {this.state.selectedRegion.name}, you will recieve:</Text>
					<div className='boon'>
						<PlayingCard front={<BoonCard boon={this.state.selectedRegion.boon} />} />
					</div>
					<hr />
					{canAttack ? null : <Text type={TextType.Information}>You can't attack {this.state.selectedRegion.name} because it's not on the coast or adjacent to your land.</Text>}
					{heroesExist ? null : <Text type={TextType.Information}>You can't attack {this.state.selectedRegion.name} because you don't have any heroes.</Text>}
					{canAttack && heroesExist ? <button onClick={() => this.setState({ showHeroSelection: true })}>Start an encounter here</button> : null}
				</div>
			);
		} else {
			const owned = this.props.game.map.squares.filter(sq => sq.regionID === '');
			info = (
				<div>
					<Text>This is the map of the island.</Text>
					{owned.length > 0 ? <Text>The white area is land you already control.</Text> : null}
					<Text>Select a region to learn more about it.</Text>
					{owned.length > 0 ? <StatValue label='Controlled' value={`${Math.floor(100 * owned.length / this.props.game.map.squares.length)}%`} /> : null}
				</div>
			);
		}

		let dialog = null;
		if (this.state.showHeroSelection) {
			const canAdd = this.state.selectedHeroes.length < 5;
			const candidates = this.props.game.heroes
				.filter(h => h.name !== '')
				.filter(h => !this.state.selectedHeroes.includes(h))
				.map(h => {
					return (
						<div key={h.id}>
							<PlayingCard front={<HeroCard hero={h} />} onClick={canAdd ? () => this.selectHero(h) : null} />
						</div>
					);
				});

			const selected = this.state.selectedHeroes
				.map(h => {
					return (
						<div key={h.id}>
							<PlayingCard front={<HeroCard hero={h} />} onClick={() => this.deselectHero(h)} />
						</div>
					);
				});

			dialog = (
				<Dialog
					content={(
						<div className='hero-selection'>
							<div className='header'>
								<Text type={TextType.Heading}>Choose your Heroes</Text>
								<Text>You can pick up to 5 heroes to take part in this encounter.</Text>
							</div>
							<div className='hero-lists'>
								<div className='hero-list-column'>
									<Text type={TextType.SubHeading}>Available heroes ({candidates.length})</Text>
									<CardList cards={candidates} />
								</div>
								<div className='hero-list-column'>
									<Text type={TextType.SubHeading}>Selected heroes ({selected.length})</Text>
									<CardList cards={selected} />
								</div>
							</div>
							<div className='footer'>
								<button disabled={(this.state.selectedHeroes.length < 1) || (this.state.selectedHeroes.length > 5)} onClick={this.startEncounter}>Start the Encounter</button>
							</div>
						</div>
					)}
					onClickOff={() => {
						this.setState({
							showHeroSelection: false
						});
					}}
				/>
			);
		}

		return (
			<div className='campaign-map-page'>
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
