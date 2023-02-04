import { Component } from 'react';
import { Selector } from '../../../controls';
import { Feature } from '../../../models/feature';
import { Game } from '../../../models/game';
import { Hero } from '../../../models/hero';
import { Item } from '../../../models/item';
import { Skill } from '../../../models/skill';
import { Trait } from '../../../models/trait';
import { HeroCard, PlaceholderCard } from '../../cards';
import { CharacterSheetPanel, HeroBuilderPanel, HeroLevelUpPanel } from '../../panels';
import { CardList, Dialog, PlayingCard, Text, TextType } from '../../utility';

import './heroes-screen.scss';

interface Props {
	game: Game;
	addHero: (hero: Hero) => void;
	levelUp: (hero: Hero, trait: Trait, skill: Skill, feature: Feature) => void;
	incrementXP: (hero: Hero) => void;
	equipItem: (item: Item, hero: Hero) => void;
	unequipItem: (item: Item, hero: Hero) => void;
	back: () => void;
}

interface State {
	selectedHero: Hero | null;
}

export class HeroesScreen extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedHero: null
		};
	}

	public render() {
		const heroes = this.props.game.heroes.map(hero => {
			let card = null;
			if (!hero.name) {
				card = (
					<PlaceholderCard text='Hero' />
				);
			} else {
				card = (
					<HeroCard hero={hero} />
				);
			}
			let info = null;
			if (!hero.name) {
				info = (
					<Text type={TextType.Information}>Empty</Text>
				);
			}
			if (hero.xp >= hero.level) {
				info = (
					<Text type={TextType.Information}>Level Up</Text>
				);
			}
			return (
				<div key={hero.id}>
					<PlayingCard front={card} onClick={() => this.setState({ selectedHero: hero })} />
					{info}
					<button className='hack' onClick={() => this.props.incrementXP(hero)}>Add XP</button>
				</div>
			);
		});

		let dialog = null;
		if (this.state.selectedHero) {
			if (!this.state.selectedHero.name) {
				dialog = (
					<Dialog
						content={(
							<HeroBuilderPanel
								finished={hero => {
									const h = this.state.selectedHero as Hero;
									this.setState({
										selectedHero: null
									}, () => {
										hero.id = h.id;
										this.props.addHero(hero);
									});
								}}
							/>
						)}
						onClickOff={() => {
							this.setState({
								selectedHero: null
							});
						}}
					/>
				);
			} else if (this.state.selectedHero.xp >= this.state.selectedHero.level) {
				dialog = (
					<Dialog
						content={(
							<HeroLevelUpPanel
								hero={this.state.selectedHero}
								finished={(trait, skill, feature) => {
									const h = this.state.selectedHero as Hero;
									this.setState({
										selectedHero: null
									}, () => {
										this.props.levelUp(h, trait, skill, feature);
									});
								}}
							/>
						)}
					/>
				);
			} else {
				dialog = (
					<Dialog
						content={(
							<CharacterSheetPanel
								hero={this.state.selectedHero}
								game={this.props.game}
								equipItem={(item, hero) => this.props.equipItem(item, hero)}
								unequipItem={(item, hero) => this.props.unequipItem(item, hero)}
							/>
						)}
						onClickOff={() => {
							this.setState({
								selectedHero: null
							});
						}}
					/>
				);
			}
		}

		let info = null;
		if (this.props.game.heroes.some(h => !h.name)) {
			info = (
				<Text type={TextType.Information}>
					<b>You have unfilled hero slots.</b> Click on a blank hero card to create a new level 1 hero.
				</Text>
			);
		} else if (this.props.game.heroes.some(h => h.xp >= h.level)) {
			info = (
				<Text type={TextType.Information}>
					<b>Some of your heroes can level up.</b> Click on their card to upgrade them.
				</Text>
			);
		}

		return (
			<div className='heroes-screen'>
				<Selector options={[{ id: 'heroes', display: 'Your Heroes' }, { id: 'map', display: 'The Island' }]} selectedID='heroes' onSelect={this.props.back} />
				{info}
				<CardList cards={heroes} />
				{dialog}
			</div>
		);
	}
}
