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

	selectAllHeroes = () => {
		const heroes = this.props.game.heroes.filter(h => !this.state.selectedHeroes.includes(h));

		let selected = this.state.selectedHeroes;
		selected.push(...heroes);
		selected = Collections.sort(selected, n => n.name);

		this.setState({
			viewMode: 'heroes',
			selectedHeroes: selected
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

	render = () => {
		const candidates = this.props.game.heroes
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
		if ((charges > 0) || this.props.options.developer) {
			options.push({
				id: 'advanced',
				display: 'Advanced'
			});
		}

		let rightContent = null;
		switch (this.state.viewMode) {
			case 'heroes': {
				const selected = this.state.selectedHeroes.map(h => <CombatantRowPanel key={h.id} mode='list' combatant={h} onCancel={hero => this.deselectHero(hero)} />);
				while (selected.length < 5) {
					selected.push(
						<div key={selected.length} className='empty-hero-slot'>
							[No hero selected]
						</div>
					);
				}
				rightContent = (
					<div className='selected-hero-list'>
						{(candidates.length <=5) && (this.state.selectedHeroes.length === 0) ? <button className='primary' onClick={this.selectAllHeroes}>Add All Heroes</button> : null}
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
