import { Component } from 'react';

import { CampaignMap, removeRegion } from '../../models/campaign-map';
import { createEncounter } from '../../models/encounter';
import { createSkillFeature, createTraitFeature } from '../../models/feature';
import { createGame, Game } from '../../models/game';
import { createHero, Hero } from '../../models/hero';
import { Item } from '../../models/item';
import { debounce } from '../../utils/utils';
import { CampaignMapScreen, EncounterFinishState, EncounterScreen, HeroesScreen, LandingScreen } from '../screens';
import { Text, TextType } from '../utility';

import './main.scss';

enum ScreenType {
	Landing = 'landing',
	Heroes = 'heroes',
	CampaignMap = 'campaign-map',
	Encounter = 'encounter'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

interface State {
	screen: ScreenType;
	game: Game | null;
}

export class Main extends Component<Props, State> {

	constructor(props: Props) {
		super(props);

		let game: Game | null = null;
		try {
			const str = window.localStorage.getItem('game');
			if (str) {
				game = JSON.parse(str) as Game;
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		this.state = {
			screen: ScreenType.Landing,
			game: game
		};
	}

	public componentDidUpdate() {
		this.saveAfterDelay();
	}

	//#region Saving

	private saveAfterDelay = debounce(() => this.save(), 5 * 1000);

	private save() {
		try {
			const json = JSON.stringify(this.state.game);
			window.localStorage.setItem('game', json);
		} catch (ex) {
			console.error('Could not stringify data: ', ex);
		}
	}

	//#endregion

	private equipItem(item: Item, hero: Hero) {
		const game = this.state.game as Game;

		const index = game.items.indexOf(item);
		game.items.splice(index, 1);

		hero.items.push(item);

		this.setState({
			game: game
		});
	}

	private unequipItem(item: Item, hero: Hero) {
		const game = this.state.game as Game;

		const index = hero.items.indexOf(item);
		hero.items.splice(index, 1);

		game.items.push(item);

		this.setState({
			game: game
		});
	}

	/*
	private changeValue(source: any, type: string, value: any) {
		const tokens = type.split('.');
		let obj = source;
		for (let n = 0; n !== tokens.length; ++n) {
			const token = tokens[n];
			if (n === tokens.length - 1) {
				obj[token] = value;
			} else {
				obj = obj[token];
			}
		}

		this.setState({
		});
	}
	*/

	/*
	private nudgeValue(source: any, type: string, delta: number) {
		const tokens = type.split('.');
		let obj = source;
		for (let n = 0; n !== tokens.length; ++n) {
			const token = tokens[n];
			if (n === tokens.length - 1) {
				const value = obj[token] + delta;
				this.changeValue(obj, token, value);
			} else {
				obj = obj[token];
			}
		}
	}
	*/

	private getContent() {
		switch (this.state.screen) {
			case 'landing':
				return (
					<LandingScreen
						game={this.state.game}
						startCampaign={() => {
							this.setState({
								game: createGame(),
								screen: ScreenType.Heroes
							});
						}}
						continueCampaign={() => {
							const all = this.state.game?.heroes.every(h => !!h.name);
							if (all) {
								this.setState({
									screen: ScreenType.CampaignMap
								});
							} else {
								this.setState({
									screen: ScreenType.Heroes
								});
							}
						}}
					/>
				);
			case 'campaign-map':
				return (
					<CampaignMapScreen
						game={this.state.game as Game}
						viewHeroes={() => {
							this.setState({
								screen: ScreenType.Heroes
							});
						}}
						startEncounter={region => {
							if (this.state.game) {
								const game = this.state.game;
								game.encounter = createEncounter();
							}
							this.setState({
								game: this.state.game,
								screen: ScreenType.Encounter
							});
						}}
						endCampaign={() => {
							this.setState({
								game: null,
								screen: ScreenType.Landing
							});
						}}
						// TEMP
						conquer={region => {
							const game = this.state.game as Game;
							removeRegion(game.map as CampaignMap, region);
							game.heroes.push(createHero());
							this.setState({
								game: game
							});
						}}
					/>
				);
			case 'heroes':
				return (
					<HeroesScreen
						game={this.state.game as Game}
						addHero={hero => {
							if (this.state.game) {
								const game = this.state.game;
								const index = this.state.game.heroes.findIndex(h => h.id === hero.id);
								if (index === -1) {
									game.heroes.push(hero);
								} else {
									game.heroes[index] = hero;
								}
								game.heroes.sort((a, b) => a.name > b.name ? 1 : -1);
								this.setState({
									game: game
								});
							}
						}}
						levelUp={(hero, trait, skill, feature) => {
							hero.features.push(createTraitFeature(trait, 1));
							hero.features.push(createSkillFeature(skill, 1));
							hero.features.push(feature);
							hero.level += 1;
							hero.xp = 0;
							this.setState({
								game: this.state.game
							});
						}}
						incrementXP={hero => {
							hero.xp += 1;
							this.setState({
								game: this.state.game
							});
						}}
						equipItem={(item, hero) => this.equipItem(item, hero)}
						unequipItem={(item, hero) => this.unequipItem(item, hero)}
						back={() => {
							this.setState({
								screen: ScreenType.CampaignMap
							});
						}}
					/>
				);
			case 'encounter':
				if (this.state.game?.encounter) {
					return (
						<EncounterScreen
							encounter={this.state.game.encounter}
							game={this.state.game}
							equipItem={(item, hero) => this.equipItem(item, hero)}
							unequipItem={(item, hero) => this.unequipItem(item, hero)}
							finish={state => {
								switch (state) {
									case EncounterFinishState.Victory:
										// TODO
										// Get equipment from dead heroes
										// Remove dead heroes from the game
										// If region conquered: show message, add a new level 1 hero, draw a boon card
										// Show victory message (plus loot)
										// Increment XP for remaining heroes
										// Clear current encounter
										break;
									case EncounterFinishState.Defeat:
										// TODO
										// Remove dead heroes from the game
										// Show defeat message
										// Clear current encounter
										break;
									case EncounterFinishState.Retreat:
										// TODO
										// Remove dead heroes from the game
										// Show retreat message
										// Clear current encounter
										break;
									case EncounterFinishState.Concede:
										// TODO
										// Remove all current heroes from the game
										// Show concede message
										// Clear current encounter
										break;
								}
								this.setState({
									screen: ScreenType.CampaignMap
								});
							}}
						/>
					);
				}
				break;
		}

		return (
			<div>
				{this.state.screen}
			</div>
		);
	}

	public render() {
		return (
			<div className='skirmish'>
				<div className='top-bar'>
					<Text type={TextType.Heading}>Skirmish</Text>
				</div>
				<div className='content'>
					{this.getContent()}
				</div>
			</div>
		);
	}
}
