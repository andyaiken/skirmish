import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { CampaignMapLogic } from '../../../logic/campaign-map-logic';
import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { CardList, Selector, Tabs, Text, TextType } from '../../controls';
import { HeroCard, SpeciesCard, StrongholdBenefitCard } from '../../cards';
import { CombatantRowPanel } from '../../panels/combatant-row/combatant-row-panel';

import './encounter-start-modal.scss';

interface Props {
	region: RegionModel;
	game: GameModel;
	options: OptionsModel;
	startEncounter: (region: RegionModel, heroes: CombatantModel[], benefits: number, detriments: number) => void;
}

interface State {
	heroSelectionMode: string;
	heroSortMode: string;
	viewMode: string;
	selectedHeroes: CombatantModel[];
	benefits: number;
	detriments: number;
}

export class EncounterStartModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			heroSelectionMode: 'Name',
			heroSortMode: 'asc',
			viewMode: 'heroes',
			selectedHeroes: [],
			benefits: 0,
			detriments: 0
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
		this.props.startEncounter(this.props.region, this.state.selectedHeroes, this.state.benefits, this.state.detriments);
	};

	render = () => {
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

		if (this.state.heroSortMode === 'desc') {
			heroes.reverse();
		}

		const candidates = heroes
			.filter(h => !this.state.selectedHeroes.includes(h))
			.map(h => {
				return (
					<HeroCard key={h.id} hero={h} onClick={this.state.selectedHeroes.length < 5 ? hero => this.selectHero(hero) : null} />
				);
			});

		const options = [
			{ id: 'heroes', display: 'Selected Heroes' },
			{ id: 'monsters', display: 'Monsters' }
		];
		const charges = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Temple) + StrongholdLogic.getStructureCharges(this.props.game, StructureType.Intelligencer);
		if (charges > 0) {
			options.push({
				id: 'advanced',
				display: 'Advanced'
			});
		}

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
				const monsters = CampaignMapLogic.getMonsters(this.props.region, this.props.options.packIDs)
					.map(species => (
						<SpeciesCard key={species.id} species={species} />
					));

				rightContent = (
					<div className='monster-list'>
						<Text type={TextType.SubHeading}>Monsters in this region</Text>
						<CardList cards={monsters} />
					</div>
				);
				break;
			}
			case 'advanced': {
				const cards = [];

				const ben = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Temple);
				if (ben > 0) {
					cards.push(
						<div key='bonuses' className='stronghold-benefit'>
							<StrongholdBenefitCard
								label='Bonuses'
								available={ben}
								used={this.state.benefits}
								developer={false}
								onChange={value => this.setState({ benefits: value })}
							/>
							<Text>Allow some of your heroes to start with a random beneficial condition.</Text>
						</div>
					);
				}

				const det = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Intelligencer);
				if (det > 0) {
					cards.push(
						<div key='penalties' className='stronghold-benefit'>
							<StrongholdBenefitCard
								label='Penalties'
								available={det}
								used={this.state.detriments}
								developer={false}
								onChange={value => this.setState({ detriments: value })}
							/>
							<Text>Force some of your opponents to start with a random detrimental condition.</Text>
						</div>
					);
				}

				rightContent = (
					<div className='advanced-options'>
						<Text type={TextType.SubHeading}>Advanced Options</Text>
						<CardList cards={cards} />
					</div>
				);
				break;
			}
		}

		return (
			<div className='encounter-start-modal'>
				<div className='header'>
					<Text type={TextType.Heading}>Choose your Heroes</Text>
				</div>
				<div className='hero-lists'>
					<div className={(candidates.length === 0) || (this.state.selectedHeroes.length >= 5) ? 'hero-list-column narrow' : 'hero-list-column'}>
						<Text type={TextType.Information}>
							<p>Select <b>up to 5 heroes</b> from this list to take part in this encounter.</p>
						</Text>
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
							options={options}
							selectedID={this.state.viewMode}
							onSelect={id => this.setState({ viewMode: id })}
						/>
						{rightContent}
						<hr />
						<button
							className='primary'
							disabled={(this.state.selectedHeroes.length < 1) || (this.state.selectedHeroes.length > 5)}
							onClick={this.startEncounter}
						>
							Start the Encounter
						</button>
					</div>
				</div>
			</div>
		);
	};
}
