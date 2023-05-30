import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { RegionModel } from '../../../models/region';

import { CardList, PlayingCard, Selector, Tabs, Text, TextType } from '../../controls';
import { HeroCard, SpeciesCard } from '../../cards';
import { CombatantRowPanel } from '../combatant-row/combatant-row-panel';

import './encounter-start.scss';

interface Props {
	region: RegionModel;
	game: GameModel;
	startEncounter: (region: RegionModel, heroes: CombatantModel[]) => void;
}

interface State {
	heroSelectionMode: string;
	heroSortMode: string;
	viewMode: string;
	selectedHeroes: CombatantModel[];
}

export class EncounterStartPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			heroSelectionMode: 'Name',
			heroSortMode: 'asc',
			viewMode: 'heroes',
			selectedHeroes: []
		};
	}

	selectHero = (hero: CombatantModel) => {
		const selected = this.state.selectedHeroes;
		selected.push(hero);
		selected.sort((a, b) => a.name.localeCompare(b.name));
		this.setState({
			viewMode: 'heroes',
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
		this.props.startEncounter(this.props.region, this.state.selectedHeroes);
	};

	render = () => {
		const heroes = ([] as CombatantModel[]).concat(this.props.game.heroes.filter(h => h.name !== ''));
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

		if (this.state.heroSortMode === 'desc') {
			heroes.reverse();
		}

		const candidates = heroes
			.filter(h => !this.state.selectedHeroes.includes(h))
			.map(h => {
				return (
					<PlayingCard
						key={h.id}
						type={CardType.Hero}
						front={<HeroCard hero={h} />}
						footer='Hero'
						onClick={this.state.selectedHeroes.length < 5 ? () => this.selectHero(h) : null}
					/>
				);
			});

		let rightContent = null;
		switch (this.state.viewMode) {
			case 'heroes': {
				const selected = this.state.selectedHeroes.map(h => <CombatantRowPanel key={h.id} combatant={h} onCancel={hero => this.deselectHero(hero)} />);
				while (selected.length < 5) {
					selected.push(
						<div key={selected.length} className='empty-hero-slot'>
							[No hero selected]
						</div>
					);
				}
				rightContent = (
					<div className='selected-hero-list'>
						{selected}
					</div>
				);
				break;
			}
			case 'monsters': {
				const monsters = this.props.region.demographics.speciesIDs
					.map(id => {
						const species = GameLogic.getSpecies(id);
						return species ? <PlayingCard type={CardType.Species} front={<SpeciesCard species={species} />} footer='Monster' /> : null;
					});

				rightContent = (
					<div>
						<CardList cards={monsters} />
					</div>
				);
			}
		}

		return (
			<div className='encounter-start'>
				<div className='header'>
					<Text type={TextType.Heading}>Choose your Heroes</Text>
				</div>
				<div className='hero-lists'>
					<div className={(candidates.length === 0) || (this.state.selectedHeroes.length >= 5) ? 'hero-list-column narrow' : 'hero-list-column'}>
						<Text type={TextType.Information}>Select <b>up to 5 heroes</b> from this list to take part in this encounter.</Text>
						{
							heroes.length > 10 ?
								<Selector
									options={[ { id: 'Name' }, { id: 'Species' }, { id: 'Role' }, { id: 'Background' }, { id: 'Level' } ]}
									selectedID={this.state.heroSelectionMode}
									onSelect={id => this.setState({ heroSelectionMode: id })}
								/>
								: null
						}
						{
							heroes.length > 10 ?
								<Selector
									options={[ { id: 'asc', display: 'Asc' }, { id: 'desc', display: 'Desc' } ]}
									selectedID={this.state.heroSortMode}
									onSelect={id => this.setState({ heroSortMode: id })}
								/>
								: null
						}
						<CardList cards={candidates} />
					</div>
					<div className='divider' />
					<div className='hero-list-column'>
						<Tabs
							options={[ { id: 'heroes', display: 'Selected Heroes' }, { id: 'monsters', display: 'Monsters in this Region' } ]}
							selectedID={this.state.viewMode}
							onSelect={id => this.setState({ viewMode: id })}
						/>
						{rightContent}
						<hr />
						<button disabled={(this.state.selectedHeroes.length < 1) || (this.state.selectedHeroes.length > 5)} onClick={this.startEncounter}>Start the Encounter</button>
					</div>
				</div>
			</div>
		);
	};
}
