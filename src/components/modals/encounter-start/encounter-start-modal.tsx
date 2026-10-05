import { Component } from 'react';

import { StructureType } from '../../../enums/structure-type';

import { CampaignMapLogic } from '../../../logic/campaign-map/campaign-map-logic';
import { StrongholdLogic } from '../../../logic/stronghold/stronghold-logic';

import type { CombatantModel } from '../../../models/combatant';
import type { GameModel } from '../../../models/game';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { Collections } from '../../../utils/collections/collections';

import { CardList, Switch, Text, TextType } from '../../controls';
import { HeroCard, SpeciesCard, StrongholdBenefitCard } from '../../cards';

import './encounter-start-modal.scss';

interface Props {
	region: RegionModel;
	game: GameModel;
	options: OptionsModel;
	startEncounter: (region: RegionModel, heroes: CombatantModel[], benefits: number, detriments: number) => void;
}

interface State {
	panel: string | null;
	selectedHeroes: CombatantModel[];
	benefits: number;
	detriments: number;
}

export class EncounterStartModal extends Component<Props, State> {
	static partySize = 5;

	static getBestHeroes = (heroes: CombatantModel[]) => {
		return [ ...heroes ]
			.sort((a, b) => (b.level - a.level) || (b.xp - a.xp))
			.slice(0, EncounterStartModal.partySize);
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			panel: null,
			selectedHeroes: Collections.sort(EncounterStartModal.getBestHeroes(props.game.heroes), n => n.name),
			benefits: 0,
			detriments: 0
		};
	}

	setPanel = (panel: string | null) => {
		this.setState({
			panel: panel
		});
	};

	toggleHero = (hero: CombatantModel) => {
		const selected = this.state.selectedHeroes.includes(hero)
			? this.state.selectedHeroes.filter(h => h.id !== hero.id)
			: Collections.sort([ ...this.state.selectedHeroes, hero ], n => n.name);

		this.setState({
			selectedHeroes: selected
		});
	};

	startEncounter = () => {
		this.props.startEncounter(this.props.region, this.state.selectedHeroes, this.state.benefits, this.state.detriments);
	};

	hasAdvancedOptions = () => {
		const charges = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Temple) + StrongholdLogic.getStructureCharges(this.props.game, StructureType.Intelligencer);
		return (charges > 0) || this.props.options.developer;
	};

	getParty = () => {
		if (this.state.selectedHeroes.length === 0) {
			return (
				<Text type={TextType.Empty}>
					{this.props.game.heroes.length === 0 ? 'You have no heroes to send.' : 'You have not chosen any heroes to send.'}
				</Text>
			);
		}

		return (
			<div className='party'>
				{this.state.selectedHeroes.map(h => <HeroCard key={h.id} hero={h} />)}
			</div>
		);
	};

	getHeroes = () => {
		const full = this.state.selectedHeroes.length >= EncounterStartModal.partySize;

		const heroes = Collections.sort([ ...this.props.game.heroes ], n => n.name)
			.map(h => {
				const selected = this.state.selectedHeroes.includes(h);
				return (
					<div key={h.id} className={selected ? 'hero-option selected' : 'hero-option'}>
						<HeroCard hero={h} onClick={selected || !full ? hero => this.toggleHero(hero) : null} />
					</div>
				);
			});

		return (
			<div className='hero-page'>
				<Text>
					Tap a hero to add them to the party or remove them from it. <b>Up to {EncounterStartModal.partySize} heroes</b> can take part in this encounter.
				</Text>
				<CardList cards={heroes} />
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
				<Text>
					The following monsters are common in the region you are attacking.
				</Text>
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
				<Text>
					The buildings in your stronghold allow you to use the following options.
				</Text>
				<CardList cards={cards} />
			</div>
		);
	};

	getContent = () => {
		switch (this.state.panel) {
			case 'heroes':
				return this.getHeroes();
			case 'monsters':
				return this.getMonsters();
			case 'advanced':
				return this.getAdvanced();
		}

		return this.getParty();
	};

	render = () => {
		const toggles = [
			{ id: 'heroes', display: 'Change Heroes' },
			{ id: 'monsters', display: 'View Monsters' }
		];
		if (this.hasAdvancedOptions()) {
			toggles.push({ id: 'advanced', display: 'Advanced Options' });
		}

		return (
			<div className='encounter-start-modal'>
				<div className='header'>
					<Text type={TextType.Heading}>Start an Encounter</Text>
				</div>
				<div className='panel-toggles'>
					{
						toggles.map(t => (
							<Switch key={t.id} label={t.display} checked={this.state.panel === t.id} onChange={value => this.setPanel(value ? t.id : null)} />
						))
					}
				</div>
				<div className='encounter-start-content'>
					{this.getContent()}
				</div>
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
