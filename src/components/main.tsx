import React from 'react';
import { EncounterHelper } from '../models/encounter';
import { FeatureHelper } from '../models/feature';
import { Game, GameHelper } from '../models/game';
import { HeroHelper } from '../models/hero';
import { Utils } from '../utils/utils';
import { CampaignMapScreen } from './screens/campaign-map-screen';
import { EncounterScreen } from './screens/encounter-screen';
import { HeroesScreen } from './screens/heroes-screen';
import { LandingScreen } from './screens/landing-screen';

interface Props {
}

interface State {
	screen: 'landing' | 'heroes' | 'campaign-map' | 'encounter';
	game: Game | null;
}

export class Main extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		let game: Game | null = null;
		try {
			const str = window.localStorage.getItem('game');
			if (str) {
				game = JSON.parse(str);
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		this.state = {
			screen: 'landing',
			game: game
		};
	}

	public componentDidUpdate() {
		this.saveAfterDelay();
	}

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

	//#region Saving

	private saveAfterDelay = Utils.debounce(() => this.save(), 5 * 1000);

	private save() {
		this.saveKey(this.state.game, 'game');
	}

	private saveKey(obj: any, key: string) {
		try {
			const json = JSON.stringify(obj);
			window.localStorage.setItem(key, json);
		} catch (ex) {
			console.error('Could not stringify data: ', ex);
		}
	}

	//#endregion

	private getContent() {
		switch (this.state.screen) {
			case 'landing':
				return (
					<LandingScreen
						game={this.state.game}
						startCampaign={() => {
							this.setState({
								game: GameHelper.createGame(),
								screen: 'heroes'
							});
						}}
						continueCampaign={() => {
							const all = (this.state.game !== null) && this.state.game.heroes.every(h => h.name !== HeroHelper.PlaceholderName);
							if (all) {
								this.setState({
									screen: 'campaign-map'
								});
							} else {
								this.setState({
									screen: 'heroes'
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
								screen: 'heroes'
							});
						}}
						startEncounter={() => {
							if (this.state.game) {
								const game = this.state.game;
								game.encounter = EncounterHelper.createEncounter();
							}
							this.setState({
								game: this.state.game,
								screen: 'encounter'
							});
						}}
						abandonCampaign={() => {
							this.setState({
								game: null,
								screen: 'landing'
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
								Utils.sort(game.heroes);
								this.setState({
									game: game
								});
							}
						}}
						levelUp={(hero, trait, skill, feature) => {
							hero.features.push(FeatureHelper.createTraitFeature(trait, 1));
							hero.features.push(FeatureHelper.createSkillFeature(skill, 1));
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
						back={() => {
							this.setState({
								screen: 'campaign-map'
							});
						}}
					/>
				);
			case 'encounter':
				if (this.state.game && this.state.game.encounter) {
					return (
						<EncounterScreen
							encounter={this.state.game.encounter}
							finish={() => {
								this.setState({
									screen: 'campaign-map'
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

	private getHeading() {
		switch (this.state.screen) {
			case 'heroes':
				return 'Your Heroes';
		}

		return 'Skirmish';
	}

	public render() {
		try {
			return (
				<div className='skirmish'>
					<div className='top-bar'>
						{this.getHeading()}
					</div>
					<div className='content'>
						{this.getContent()}
					</div>
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
