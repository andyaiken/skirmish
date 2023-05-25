import { Component } from 'react';
import { IconX } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import { GameLogic } from '../../../logic/game-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { RegionModel } from '../../../models/region';

import { Collections } from '../../../utils/collections';

import { CardList, PlayingCard, Selector, StatValue, Tag, Text, TextType } from '../../controls';
import { HeroCard } from '../../cards';

import './encounter-start.scss';

interface Props {
	region: RegionModel;
	game: GameModel;
	startEncounter: (region: RegionModel, heroes: CombatantModel[]) => void;
}

interface State {
	heroSelectionMode: string;
	heroSortMode: string;
	selectedHeroes: CombatantModel[];
}

export class EncounterStartPanel extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			heroSelectionMode: 'Name',
			heroSortMode: 'asc',
			selectedHeroes: []
		};
	}

	selectHero = (hero: CombatantModel) => {
		const selected = this.state.selectedHeroes;
		selected.push(hero);
		selected.sort((a, b) => a.name.localeCompare(b.name));
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

		const selected = this.state.selectedHeroes
			.map(h => {
				return (
					<div key={h.id} className='selected-hero'>
						<div className='name'>
							<Text type={TextType.SubHeading}>{h.name}</Text>
						</div>
						<div className='tags'>
							<Tag>{GameLogic.getSpecies(h.speciesID)?.name ?? 'Unknown species'}</Tag>
							<Tag>{GameLogic.getRole(h.roleID)?.name ?? 'Unknown role'}</Tag>
							<Tag>{GameLogic.getBackground(h.backgroundID)?.name ?? 'Unknown background'}</Tag>
							<Tag>Level {h.level}</Tag>
						</div>
						<button className='icon-btn' onClick={() => this.deselectHero(h)}>
							<IconX />
						</button>
					</div>
				);
			});
		while (selected.length < 5) {
			selected.push(
				<div key={selected.length} className='selected-hero placeholder'>
					[No hero selected]
				</div>
			);
		}

		return (
			<div className='encounter-start'>
				<div className='header'>
					<Text type={TextType.Heading}>Choose your Heroes</Text>
				</div>
				<div className='hero-lists'>
					<div className='hero-list-column'>
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
						{ candidates.length === 0 ? <Text type={TextType.Information}>No heroes left.</Text> : null }
						<CardList cards={candidates} />
					</div>
					<div className='divider' />
					<div className='hero-list-column'>
						<Text type={TextType.SubHeading}>Selected heroes</Text>
						{selected}
						<hr />
						<div className='encounter-info'>
							<div className='encounter-info-column'>
								<StatValue
									label='Monsters'
									value={this.props.region.demographics.speciesIDs.map(id => GameLogic.getSpecies(id)?.name || '[species]').sort().map((m, n) => <Tag key={n}>{m}</Tag>)}
								/>
								<StatValue
									label='Encounter Level'
									value={Collections.sum(this.state.selectedHeroes, h => h.level)}
								/>
							</div>
							<div className='encounter-info-column'>
								<button disabled={(this.state.selectedHeroes.length < 1) || (this.state.selectedHeroes.length > 5)} onClick={this.startEncounter}>Start the Encounter</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};
}
