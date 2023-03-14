import { Component } from 'react';

import { CardType } from '../../../../enums/card-type';

import { CampaignMapLogic } from '../../../../logic/campaign-map-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { RegionModel } from '../../../../models/campaign-map';

import { BoonCard, HeroCard } from '../../../cards';
import { CardList, Dialog, PlayingCard, Selector, StatValue, Text, TextType } from '../../../controls';
import { CampaignMapPanel } from '../../../panels';

import './campaign-map-page.scss';

interface Props {
	game: GameModel;
	developer: boolean;
	startEncounter: (region: RegionModel, heroes: CombatantModel[]) => void;
	conquer: (region: RegionModel) => void;
}

interface State {
	selectedRegion: RegionModel | null;
	showHeroSelection: boolean;
	heroSelectionMode: string;
	selectedHeroes: CombatantModel[];
}

export class CampaignMapPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedRegion: null,
			showHeroSelection: false,
			heroSelectionMode: 'Name',
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
		this.props.startEncounter(this.state.selectedRegion as RegionModel, this.state.selectedHeroes);
	};

	conquer = (region: RegionModel) => {
		this.setState({
			selectedRegion: null
		}, () => {
			this.props.conquer(region);
		});
	};

	getDialog = () => {
		if (this.state.showHeroSelection) {
			const canAdd = this.state.selectedHeroes.length < 5;

			const heroes = ([] as CombatantModel[]).concat(this.props.game.heroes);
			switch (this.state.heroSelectionMode) {
				case 'Name':
					heroes.sort((a, b) => a.name.localeCompare(b.name));
					break;
				case 'Species':
					heroes.sort((a, b) => a.speciesID.localeCompare(b.speciesID));
					break;
				case 'Role':
					heroes.sort((a, b) => a.roleID.localeCompare(b.roleID));
					break;
				case 'Background':
					heroes.sort((a, b) => a.backgroundID.localeCompare(b.backgroundID));
					break;
				case 'Level':
					heroes.sort((a, b) => a.level - b.level);
					break;
			}

			const candidates = heroes
				.filter(h => h.name !== '')
				.filter(h => !this.state.selectedHeroes.includes(h))
				.map(h => {
					return (
						<div key={h.id}>
							<PlayingCard type={CardType.Hero} front={<HeroCard hero={h} />} onClick={canAdd ? () => this.selectHero(h) : null} />
						</div>
					);
				});

			const selected = this.state.selectedHeroes
				.map(h => {
					return (
						<div key={h.id}>
							<PlayingCard type={CardType.Hero} front={<HeroCard hero={h} />} onClick={() => this.deselectHero(h)} />
						</div>
					);
				});

			return (
				<Dialog
					content={(
						<div className='hero-selection'>
							<div className='header'>
								<Text type={TextType.Heading}>Choose your Heroes</Text>
							</div>
							<div className='hero-lists'>
								<div className='hero-list-column'>
									<Text type={TextType.SubHeading}>Available heroes</Text>
									<Selector
										options={[ { id: 'Name' }, { id: 'Species' }, { id: 'Role' }, { id: 'Background' }, { id: 'Level' } ]}
										selectedID={this.state.heroSelectionMode}
										onSelect={id => this.setState({ heroSelectionMode: id })}
									/>
									<CardList cards={candidates} />
								</div>
								<div className='divider' />
								<div className='hero-list-column'>
									<Text type={TextType.SubHeading}>Selected heroes ({selected.length} / 5)</Text>
									{selected.length === 0 ? <Text type={TextType.Information}>Select <b>up to 5 heroes</b> from the left to take part in this encounter.</Text> : null}
									<CardList cards={selected} />
								</div>
							</div>
							<div className='footer'>
								<button disabled={(this.state.selectedHeroes.length < 1) || (this.state.selectedHeroes.length > 5)} onClick={this.startEncounter}>Start the Encounter</button>
							</div>
						</div>
					)}
					onClose={() => {
						this.setState({
							showHeroSelection: false
						});
					}}
				/>
			);
		}

		return;
	};

	render = () => {
		let sidebar = null;
		if (this.state.selectedRegion) {
			const canAttack = CampaignMapLogic.canAttackRegion(this.props.game.map, this.state.selectedRegion);
			const heroesExist = this.props.game.heroes.filter(h => h.name !== '').length > 0;
			sidebar = (
				<div className='region'>
					<Text type={TextType.SubHeading}>{this.state.selectedRegion.name}</Text>
					<hr />
					<StatValue label='Area' value={`${this.state.selectedRegion.demographics.size} sq mi`} />
					<StatValue label='Population' value={`${this.state.selectedRegion.demographics.population},000`} />
					<StatValue label='Terrain' value={this.state.selectedRegion.demographics.terrain} />
					<StatValue label='Number of Encounters' value={this.state.selectedRegion.encounters.length} />
					<hr />
					<Text>If you take control of {this.state.selectedRegion.name}, you will recieve:</Text>
					<div className='boon'>
						<PlayingCard type={CardType.Boon} front={<BoonCard boon={this.state.selectedRegion.boon} />} />
					</div>
					<hr />
					{canAttack ? null : <Text type={TextType.Information}>You can&apos;t attack {this.state.selectedRegion.name} because it&apos;s not on the coast or adjacent to your land.</Text>}
					{heroesExist ? null : <Text type={TextType.Information}>You can&apos;t attack {this.state.selectedRegion.name} because you don&apos;t have any heroes.</Text>}
					{canAttack && heroesExist ? <button onClick={() => this.setState({ showHeroSelection: true })}>Start an encounter here</button> : null}
					{this.props.developer ? <button className='developer' onClick={() => this.conquer(this.state.selectedRegion as RegionModel)}>Conquer</button> : null}
				</div>
			);
		} else {
			const owned = this.props.game.map.squares.filter(sq => sq.regionID === '');
			sidebar = (
				<div>
					<Text type={TextType.SubHeading}>The Island</Text>
					<Text>This is the map of the island.</Text>
					{owned.length > 0 ? <Text>The white area is land you already control.</Text> : null}
					<Text>Select a region to learn more about it.</Text>
					{owned.length > 0 ? <StatValue label='Controlled' value={`${Math.floor(100 * owned.length / this.props.game.map.squares.length)}%`} /> : null}
				</div>
			);
		}


		return (
			<div className='campaign-map-page'>
				<div className='map-content' onClick={() => this.setState({ selectedRegion: null })}>
					<CampaignMapPanel
						map={this.props.game.map}
						selectedRegion={this.state.selectedRegion}
						onSelectRegion={region => this.setState({ selectedRegion: region })}
					/>
				</div>
				<div className='sidebar'>
					{sidebar}
				</div>
				{this.getDialog()}
			</div>
		);
	};
}
