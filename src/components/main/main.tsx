import { Component } from 'react';

import { BoonModel, BoonType } from '../../models/boon';
import { CampaignMapRegionModel, removeRegion } from '../../models/campaign-map';
import { createEncounter, EncounterModel, getAllHeroesInEncounter, getDeadHeroes, getSurvivingHeroes } from '../../models/encounter';
import { addHeroToGame, createGame, GameModel } from '../../models/game';
import { createHero, HeroModel } from '../../models/hero';
import { ItemModel } from '../../models/item';
import { debounce } from '../../utils/utils';
import { BoonCard } from '../cards';
import { CampaignScreen, EncounterFinishState, EncounterScreen, LandingScreen } from '../screens';
import { Text, TextType } from '../../controls';
import { PlayingCard } from '../utility';

import './main.scss';

enum ScreenType {
	Landing = 'landing',
	Campaign = 'campaign',
	Encounter = 'encounter'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

interface State {
	screen: ScreenType;
	game: GameModel | null;
	dialog: JSX.Element | null;
}

export class Main extends Component<Props, State> {

	constructor(props: Props) {
		super(props);

		let game: GameModel | null = null;
		try {
			const str = window.localStorage.getItem('game');
			if (str) {
				game = JSON.parse(str) as GameModel;
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		this.state = {
			screen: ScreenType.Landing,
			game: game,
			dialog: null
		};
	}

	componentDidUpdate = () => {
		this.saveAfterDelay();
	}

	setScreen = (screen: ScreenType) => {
		this.setState({
			screen: screen
		});
	};

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

	//#region Landing page

	startCampaign = () => {
		this.setState({
			game: createGame(),
			screen: ScreenType.Campaign
		});
	}

	continueCampaign = () => {
		this.setState({
			screen: ScreenType.Campaign
		});
	}

	//#endregion

	//#region Heroes page

	addHero = (hero: HeroModel) => {
		const game = this.state.game as GameModel;
		addHeroToGame(game, hero);
		this.setState({
			game: game
		});
	}

	incrementXP = (hero: HeroModel) => {
		// DEV ONLY
		hero.xp += 1;
		this.setState({
			game: this.state.game
		});
	}

	equipItem = (item: ItemModel, hero: HeroModel) => {
		const game = this.state.game as GameModel;

		game.items = game.items.filter(i => i !== item);
		hero.items.push(item);

		this.setState({
			game: game
		});
	}

	unequipItem = (item: ItemModel, hero: HeroModel) => {
		const game = this.state.game as GameModel;

		hero.items = hero.items.filter(i => i !== item);
		game.items.push(item);

		this.setState({
			game: game
		});
	}

	redeemBoon = (boon: BoonModel, hero: HeroModel | null) => {
		const game = this.state.game as GameModel;
		game.boons = game.boons.filter(b => b.id !== boon.id);

		switch (boon.type) {
			case BoonType.ExtraHero:
				game.heroes.push(createHero());
				break;
			case BoonType.ExtraXP:
				(hero as HeroModel).xp += boon.data as number;
				break;
			case BoonType.LevelUp:
				(hero as HeroModel).xp += (hero as HeroModel).level;
				break;
			case BoonType.MagicItem:
				game.items.push(boon.data as ItemModel);
				break;
		}

		this.setState({
			game: game
		});
}

	//#endregion

	//#region Campaign map page

	startEncounter = (region: CampaignMapRegionModel, heroes: HeroModel[]) => {
		if (this.state.game) {
			const game = this.state.game;
			game.encounter = createEncounter(region, heroes);
			this.setState({
				game: game,
				screen: ScreenType.Encounter
			});
		}
	}

	//#endregion

	//#region Options page

	endCampaign = () => {
		this.setState({
			game: null,
			screen: ScreenType.Landing
		});
	}

	//#endregion

	//#region Encounter page

	finishEncounter = (state: EncounterFinishState) => {
		const game = this.state.game;
		if (!game) {
			return;
		}

		const encounter = game.encounter;
		if (!encounter) {
			return;
		}

		const region = game.map.regions.find(r => r.id === encounter.regionID);
		if (!region) {
			return;
		}

		let dialog = null;
		switch (state) {
			case EncounterFinishState.Victory: {
				// Remove dead heroes from the game
				const deadHeroes = getDeadHeroes(encounter, game);
				game.heroes = game.heroes.filter(h => !deadHeroes.includes(h));
				// Get equipment from dead heroes, add it to game loot
				deadHeroes.forEach(h => game.items.push(...h.items));
				// Increment XP for surviving heroes
				getSurvivingHeroes(encounter, game).forEach(h => h.xp += 1);
				// Decrement the number of encounters remaining for this region
				region.count -= 1;
				if (region.count <= 0) {
					// Conquer the region
					removeRegion(game.map, region);
					if (game.map.squares.every(sq => sq.regionID === '')) {
						// Show message
						dialog = (
							<div>
								<Text type={TextType.SubHeading}>You control the island!</Text>
								<Text><b>Congratulations!</b> There are no more regions to conquer.</Text>
								<button onClick={() => this.endCampaign()}>Start Again</button>
							</div>
						);
					} else {
						// Add a new level 1 hero
						game.heroes.push(createHero());
						game.heroes.sort((a, b) => a.name > b.name ? 1 : -1);
						// Add the region's boon
						game.boons.push(region.boon);
						// Show message
						dialog = (
							<div>
								<Text type={TextType.SubHeading}>You have taken control of {region.name}!</Text>
								<Text>Each hero who took part in this encounter gains 1 XP, you can recruit a new hero, and you have earned a reward:</Text>
								<PlayingCard front={<BoonCard boon={region.boon} />} />
								<Text>Any heroes who died have been lost, along with all their equipment.</Text>
								<button onClick={() => this.setScreen(ScreenType.Campaign)}>OK</button>
							</div>
						);
					}
				} else {
					// Show message
					dialog = (
						<div>
							<Text type={TextType.SubHeading}>You won the encounter in {region.name}!</Text>
							<Text>Each surviving hero who took part in this encounter gains 1 XP.</Text>
							<Text>Any heroes who died have been lost, along with all their equipment.</Text>
							<button onClick={() => this.setScreen(ScreenType.Campaign)}>OK</button>
						</div>
					);
				}
				// Clear the current encounter
				game.encounter = null;
				break;
			}
			case EncounterFinishState.Retreat: {
				// Remove dead heroes from the game
				const deadHeroes = getDeadHeroes(encounter, game);
				game.heroes = game.heroes.filter(h => !deadHeroes.includes(h));
				// Clear the current encounter
				game.encounter = null;
				// Show message
				dialog = (
					<div>
						<Text type={TextType.SubHeading}>You retreated from the encounter in {region.name}.</Text>
						<Text>Any heroes who died have been lost, along with all their equipment.</Text>
						<button onClick={() => this.setScreen(ScreenType.Campaign)}>OK</button>
					</div>
				);
				break;
			}
			case EncounterFinishState.Defeat: {
				// Remove all participating heroes from the game
				const heroes = getAllHeroesInEncounter(encounter, game);
				game.heroes = game.heroes.filter(h => !heroes.includes(h));
				// Clear the current encounter
				game.encounter = null;
				if ((game.heroes.length === 0) && (!game.boons.some(b => b.type === BoonType.ExtraHero))) {
					// Show message
					dialog = (
						<div>
							<Text type={TextType.SubHeading}>You lost the encounter in {region.name}, and have no more heroes.</Text>
							<Text>Better luck next time.</Text>
							<button onClick={() => this.endCampaign()}>OK</button>
						</div>
					);
				} else {
					// Show message
					dialog = (
						<div>
							<Text type={TextType.SubHeading}>You lost the encounter in {region.name}.</Text>
							<Text>Those heroes who took part have been lost, along with all their equipment.</Text>
							<button onClick={() => this.setScreen(ScreenType.Campaign)}>Try Again</button>
						</div>
					);
				}
				break;
			}
		}

		this.setState({
			screen: ScreenType.Campaign,
			game: game,
			dialog: dialog
		});
	}

	//#endregion

	//#region Rendering

	getContent = () => {
		switch (this.state.screen) {
			case 'landing':
				return (
					<LandingScreen
						game={this.state.game}
						startCampaign={this.startCampaign}
						continueCampaign={this.continueCampaign}
					/>
				);
			case 'campaign':
				return (
					<CampaignScreen
						game={this.state.game as GameModel}
						addHero={this.addHero}
						incrementXP={this.incrementXP}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						redeemBoon={this.redeemBoon}
						startEncounter={this.startEncounter}
						endCampaign={this.endCampaign}
					/>
				);
			case 'encounter':
				return (
					<EncounterScreen
						encounter={this.state.game?.encounter as EncounterModel}
						game={this.state.game as GameModel}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						finishEncounter={this.finishEncounter}
					/>
				);
		}

		return (
			<div>
				{this.state.screen}
			</div>
		);
	}

	render = () => {
		return (
			<div className='skirmish'>
				<div className='skirmish-top-bar'>
					<Text type={TextType.Heading}>Skirmish</Text>
				</div>
				<div className='skirmish-content'>
					{this.getContent()}
				</div>
			</div>
		);
	}

	//#endregion
}
