import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { CampaignMapLogic } from '../../../logic/campaign-map/campaign-map-logic';
import { StrongholdLogic } from '../../../logic/stronghold/stronghold-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { Collections } from '../../../utils/collections/collections';

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
	viewMode: string;
	heroMode: string;
	selectedHeroes: CombatantModel[];
	benefits: number;
	detriments: number;
}

export class EncounterStartModal extends Component<Props, State> {
	// The number of heroes an encounter starts with. A War Room can bring another in once the
	// fighting is under way, but that happens in the encounter itself rather than here.
	static partySize = 5;

	// Level is what a hero's development amounts to - features are drawn at every level - so it
	// is what 'best' means here, with XP separating heroes who are level-drawn.
	static getBestHeroes = (heroes: CombatantModel[]) => {
		return [ ...heroes ]
			.sort((a, b) => (b.level - a.level) || (b.xp - a.xp))
			.slice(0, EncounterStartModal.partySize);
	};

	static getParty = (mode: string, heroes: CombatantModel[]) => {
		let party: CombatantModel[] = [];

		switch (mode) {
			case 'all':
				party = [ ...heroes ];
				break;
			case 'best':
				party = EncounterStartModal.getBestHeroes(heroes);
				break;
			case 'random':
				// shuffle works in place, so the game's own hero list is copied before it goes in
				party = Collections.shuffle([ ...heroes ]).slice(0, EncounterStartModal.partySize);
				break;
		}

		return Collections.sort(party, n => n.name);
	};

	// Sending everyone is only an option while everyone fits; beyond that the choice is between
	// the strongest five and five at random.
	static getDefaultHeroMode = (heroes: CombatantModel[]) => {
		return heroes.length <= EncounterStartModal.partySize ? 'all' : 'best';
	};

	constructor(props: Props) {
		super(props);

		const heroMode = EncounterStartModal.getDefaultHeroMode(props.game.heroes);
		this.state = {
			viewMode: 'heroes',
			heroMode: heroMode,
			selectedHeroes: EncounterStartModal.getParty(heroMode, props.game.heroes),
			benefits: 0,
			detriments: 0
		};
	}

	setHeroMode = (heroMode: string) => {
		// Choosing by hand starts from whatever the previous option picked, so a party can be
		// adjusted rather than built again from nothing
		if (heroMode === 'choose') {
			this.setState({ heroMode: heroMode });
			return;
		}

		this.setState({
			heroMode: heroMode,
			selectedHeroes: EncounterStartModal.getParty(heroMode, this.props.game.heroes)
		});
	};

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

	startEncounter = () => {
		this.props.startEncounter(this.props.region, this.state.selectedHeroes, this.state.benefits, this.state.detriments);
	};

	getHeroModeDescription = () => {
		switch (this.state.heroMode) {
			case 'all':
				return <p>Each of your heroes will take part in this encounter.</p>;
			case 'best':
				return <p>Your five highest-level heroes will take part in this encounter.</p>;
			case 'random':
				return <p>Five of your heroes, drawn at random, will take part in this encounter. Pick this option again to draw a different five.</p>;
		}

		return <p>Select <b>up to {EncounterStartModal.partySize} heroes</b> from the list on the left to take part in this encounter.</p>;
	};

	getHeroModeOptions = () => {
		const options = [];

		if (this.props.game.heroes.length <= EncounterStartModal.partySize) {
			options.push({ id: 'all', display: 'All Heroes' });
		} else {
			options.push({ id: 'best', display: 'Send the Five Best Heroes' });
			options.push({ id: 'random', display: 'Send Five Random Heroes' });
		}

		options.push({ id: 'choose', display: 'Choose Heroes' });

		return options;
	};

	getHeroes = () => {
		return this.state.heroMode === 'choose' ? this.getHeroChooser() : this.getParty();
	};

	getParty = () => {
		if (this.state.selectedHeroes.length === 0) {
			return (
				<div className='hero-page party'>
					<Text type={TextType.Empty}>
						You have no heroes to send.
					</Text>
				</div>
			);
		}

		return (
			<div className='hero-page party all'>
				<CardList cards={this.state.selectedHeroes.map(h => <HeroCard key={h.id} hero={h} />)} />
			</div>
		);
	};

	getHeroChooser = () => {
		const candidates = this.props.game.heroes
			.filter(h => !this.state.selectedHeroes.includes(h))
			.map(h => {
				return (
					<HeroCard key={h.id} hero={h} onClick={this.state.selectedHeroes.length < EncounterStartModal.partySize ? hero => this.selectHero(hero) : null} />
				);
			});

		const selected = this.state.selectedHeroes.map(h => <CombatantRowPanel key={h.id} mode='list' combatant={h} options={this.props.options} onCancel={hero => this.deselectHero(hero)} />);
		while (selected.length < EncounterStartModal.partySize) {
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
					<Text type={TextType.Heading}>Start an Encounter</Text>
				</div>
				<Tabs
					options={options}
					selectedID={this.state.viewMode}
					onSelect={id => this.setState({ viewMode: id })}
				/>
				{
					(this.state.viewMode === 'heroes') ?
						<div className='hero-mode'>
							<Selector
								options={this.getHeroModeOptions()}
								selectedID={this.state.heroMode}
								onSelect={this.setHeroMode}
							/>
							<Text type={TextType.Information}>
								{this.getHeroModeDescription()}
							</Text>
						</div>
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
					disabled={(this.state.selectedHeroes.length < 1) || (this.state.selectedHeroes.length > EncounterStartModal.partySize)}
					onClick={this.startEncounter}
				>
					Start the Encounter
				</button>
			</div>
		);
	};
}
