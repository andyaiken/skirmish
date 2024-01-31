import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { CampaignMapLogic } from '../../../logic/campaign-map-logic';
import { StrongholdLogic } from '../../../logic/stronghold-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { Collections } from '../../../utils/collections';

import { CardList, Tabs, Text, TextType } from '../../controls';
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
	viewMode: string;
	selectedHeroes: CombatantModel[];
	benefits: number;
	detriments: number;
}

export class EncounterStartModal extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			viewMode: 'heroes',
			selectedHeroes: [],
			benefits: 0,
			detriments: 0
		};
	}

	selectHero = (hero: CombatantModel) => {
		let selected = this.state.selectedHeroes;
		selected.push(hero);
		selected = Collections.sort(selected, n => n.name);

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

	selectAllHeroes = () => {
		let selected = [];
		selected.push(...this.props.game.heroes);
		selected = Collections.sort(selected, n => n.name);

		this.setState({
			viewMode: 'heroes',
			selectedHeroes: selected
		});
	};

	startEncounter = () => {
		this.props.startEncounter(this.props.region, this.state.selectedHeroes, this.state.benefits, this.state.detriments);
	};

	getHeroes = () => {
		const candidates = this.props.game.heroes
			.filter(h => !this.state.selectedHeroes.includes(h))
			.map(h => {
				return (
					<HeroCard key={h.id} hero={h} onClick={this.state.selectedHeroes.length < 5 ? hero => this.selectHero(hero) : null} />
				);
			});

		const selected = this.state.selectedHeroes.map(h => <CombatantRowPanel key={h.id} mode='list' combatant={h} onCancel={hero => this.deselectHero(hero)} />);
		while (selected.length < 5) {
			selected.push(
				<div key={selected.length} className='empty-hero-slot'>
					[No hero selected]
				</div>
			);
		}

		return (
			<div className='hero-page'>
				<div className='hero-list-column candidates'>
					{
						candidates.length === 0 ?
							<Text type={TextType.Empty}>
								You have no more available heroes.
							</Text>
							: null
					}
					<CardList cards={candidates} />
				</div>
				<div className='divider' />
				<div className='hero-list-column selected'>
					{selected}
				</div>
			</div>
		);
	};

	getMonsters = () => {
		const monsters = CampaignMapLogic.getMonsters(this.props.region, this.props.options.packIDs)
			.map(species => (
				<SpeciesCard key={species.id} species={species} />
			));

		return (
			<div className='monster-page'>
				<CardList cards={monsters} />
			</div>
		);
	};

	getAdvanced = () => {
		const cards = [];

		const ben = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Temple);
		if ((ben > 0) || this.props.options.developer) {
			cards.push(
				<div key='bonuses' className='stronghold-benefit'>
					<StrongholdBenefitCard
						label='Bonuses'
						available={ben}
						used={this.state.benefits}
						developer={this.props.options.developer}
						onChange={value => this.setState({ benefits: value })}
					/>
					<Text>Allow some of your heroes to start with a random beneficial condition.</Text>
				</div>
			);
		}

		const det = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Intelligencer);
		if ((det > 0) || this.props.options.developer) {
			cards.push(
				<div key='penalties' className='stronghold-benefit'>
					<StrongholdBenefitCard
						label='Penalties'
						available={det}
						used={this.state.detriments}
						developer={this.props.options.developer}
						onChange={value => this.setState({ detriments: value })}
					/>
					<Text>Force some of your opponents to start with a random detrimental condition.</Text>
				</div>
			);
		}

		return (
			<div className='advanced-page'>
				<CardList cards={cards} />
			</div>
		);
	};

	render = () => {
		const options = [
			{ id: 'heroes', display: 'Selected Heroes' },
			{ id: 'monsters', display: 'Monsters in this Region' }
		];
		const charges = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Temple) + StrongholdLogic.getStructureCharges(this.props.game, StructureType.Intelligencer);
		if ((charges > 0) || this.props.options.developer) {
			options.push({
				id: 'advanced',
				display: 'Advanced Options'
			});
		}

		let content = null;
		switch (this.state.viewMode) {
			case 'heroes': {
				content = this.getHeroes();
				break;
			}
			case 'monsters': {
				content = this.getMonsters();
				break;
			}
			case 'advanced': {
				content = this.getAdvanced();
				break;
			}
		}

		return (
			<div className='encounter-start-modal'>
				<div className='header'>
					<Text type={TextType.Heading}>Choose your Heroes</Text>
				</div>
				<Tabs
					options={options}
					selectedID={this.state.viewMode}
					onSelect={id => this.setState({ viewMode: id })}
				/>
				{
					(this.state.viewMode === 'heroes') ?
						<Text type={TextType.Information}>
							<p>
								Select <b>up to 5 heroes</b> from the list on the left to take part in this encounter
								{
									(this.props.game.heroes.length <= 5) ?
										<span>
											&nbsp;(or <button className='link' onClick={this.selectAllHeroes}>add all heroes</button>)
										</span>
										: null
								}
								.
							</p>
						</Text>
						: null
				}
				{
					(this.state.viewMode === 'monsters') ?
						<Text type={TextType.Information}>
							<p>The following monsters are common in the region you are attacking.</p>
						</Text>
						: null
				}
				{
					(this.state.viewMode === 'advanced') ?
						<Text type={TextType.Information}>
							<p>The buildings in your stronghold allow you to use the following options.</p>
						</Text>
						: null
				}
				{content}
				<button
					className='action primary'
					disabled={(this.state.selectedHeroes.length < 1) || (this.state.selectedHeroes.length > 5)}
					onClick={this.startEncounter}
				>
					Start the Encounter
				</button>
			</div>
		);
	};
}
