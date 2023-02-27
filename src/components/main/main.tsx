import { Component } from 'react';

import { BoonType } from '../../enums/boon-type';
import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { EncounterState } from '../../enums/encounter-state';

import { CampaignMapLogic } from '../../logic/campaign-map-logic';
import { CombatantLogic } from '../../logic/combatant-logic';
import { EncounterGenerator } from '../../logic/encounter-generator';
import { EncounterLogic } from '../../logic/encounter-logic';
import { EncounterMapLogic } from '../../logic/encounter-map-logic';
import { Factory } from '../../logic/factory';
import { GameLogic } from '../../logic/game-logic';

import type { BoonModel } from '../../models/boon';
import type { CombatantModel } from '../../models/combatant';
import type { EncounterModel } from '../../models/encounter';
import type { FeatureModel } from '../../models/feature';
import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';
import type { RegionModel } from '../../models/campaign-map';

import { Collections } from '../../utils/collections';
import { Utils } from '../../utils/utils';

import { CampaignScreen, EncounterScreen, LandingScreen } from '../screens';
import { Dialog, PlayingCard, Text, TextType } from '../controls';
import { BoonCard } from '../cards';

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
	developer: boolean;
	dialog: JSX.Element | null;
}

export class Main extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		let game: GameModel | null = null;
		try {
			const str = window.localStorage.getItem('game');
			if (str !== null) {
				game = JSON.parse(str) as GameModel;
			}
		} catch (ex) {
			console.error('Could not parse JSON: ', ex);
		}

		if (game) {
			game.heroes.forEach(h => {
				if (h.carried === undefined) {
					h.carried = [];
				}
			});

			if (game.money === undefined) {
				game.money = 0;
			}

			if (game.encounter) {
				if (game.encounter.loot === undefined) {
					game.encounter.loot = [];
				}
				if (game.encounter.mapSquares === undefined) {
					game.encounter.mapSquares = [];
				}
			}
		}

		this.state = {
			screen: ScreenType.Landing,
			game: game,
			developer: false,
			dialog: null
		};
	}

	componentDidUpdate = () => {
		this.saveAfterDelay();
	};

	setScreen = (screen: ScreenType) => {
		this.setState({
			screen: screen,
			dialog: null
		});
	};

	setDeveloper = (value: boolean) => {
		this.setState({
			developer: value
		});
	};

	//#region Saving

	readonly saveAfterDelay = Utils.debounce(() => this.save(), 5 * 1000);

	save = () => {
		try {
			const json = JSON.stringify(this.state.game);
			window.localStorage.setItem('game', json);
		} catch (ex) {
			console.error('Could not stringify data: ', ex);
		}
	};

	//#endregion

	//#region Landing page

	startCampaign = () => {
		this.setState({
			game: Factory.createGame(),
			screen: ScreenType.Campaign
		});
	};

	continueCampaign = () => {
		this.setState({
			screen: !this.state.game?.encounter ? ScreenType.Campaign : ScreenType.Encounter
		});
	};

	//#endregion

	//#region Heroes page

	addHero = (hero: CombatantModel) => {
		const game = this.state.game as GameModel;
		GameLogic.addHeroToGame(game, hero);
		this.setState({
			game: game
		});
	};

	incrementXP = (hero: CombatantModel) => {
		// DEV ONLY
		hero.xp += 1;
		this.setState({
			game: this.state.game
		});
	};

	levelUp = (feature: FeatureModel, hero: CombatantModel) => {
		hero.xp -= hero.level;
		hero.level += 1;
		hero.features.push(feature);

		this.setState({
			game: this.state.game
		});
	};

	redeemBoon = (boon: BoonModel, hero: CombatantModel | null) => {
		const game = this.state.game as GameModel;
		game.boons = game.boons.filter(b => b.id !== boon.id);

		switch (boon.type) {
			case BoonType.ExtraHero:
				GameLogic.addHeroToGame(game, Factory.createCombatant(CombatantType.Hero));
				break;
			case BoonType.ExtraXP:
				(hero as CombatantModel).xp += boon.data as number;
				break;
			case BoonType.LevelUp:
				(hero as CombatantModel).xp += (hero as CombatantModel).level;
				break;
			case BoonType.MagicItem:
				game.items.push(boon.data as ItemModel);
				break;
		}

		this.setState({
			game: game
		});
	};

	//#endregion

	//#region Items

	buyItem = (item: ItemModel) => {
		const game = this.state.game as GameModel;

		game.items.push(item);
		game.money = Math.max(0, game.money - 100);

		this.setState({
			game: game
		});
	};

	sellItem = (item: ItemModel, all: boolean) => {
		const game = this.state.game as GameModel;

		if (all) {
			const items = game.items.filter(i => i.name === item.name);
			game.items = game.items.filter(i => i.name !== item.name);
			game.money += items.length;
		} else {
			game.items = game.items.filter(i => i !== item);
			game.money += 1;
		}

		this.setState({
			game: game
		});
	};

	addMoney = () => {
		const game = this.state.game as GameModel;

		game.money += 100;

		this.setState({
			game: game
		});
	};

	//#endregion

	//#region Campaign map page

	startEncounter = (region: RegionModel, heroes: CombatantModel[]) => {
		if (this.state.game) {
			const game = this.state.game;
			game.encounter = EncounterGenerator.createEncounter(region, heroes);
			this.setState({
				game: game,
				screen: ScreenType.Encounter
			});
		}
	};

	conquer = (region: RegionModel) => {
		if (this.state.game) {
			const game = this.state.game;

			CampaignMapLogic.removeRegion(game.map, region);
			GameLogic.addHeroToGame(game, Factory.createCombatant(CombatantType.Hero));
			game.boons.push(region.boon);

			this.setState({
				game: game
			});
		}
	};

	//#endregion

	//#region Options page

	endCampaign = () => {
		this.setState({
			game: null,
			screen: ScreenType.Landing,
			dialog: null
		});
	};

	//#endregion

	//#region Encounter page

	rollInitiative = (encounter: EncounterModel) => {
		EncounterLogic.rollInitiative(encounter);

		const acting = EncounterLogic.getActiveCombatants(encounter);
		const current = acting.length > 0 ? acting[0] : null;
		if (current) {
			EncounterLogic.startOfTurn(encounter, current);
		}

		this.setState({
			game: this.state.game
		});
	};

	move = (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => {
		EncounterLogic.move(encounter, combatant, dir, cost);

		this.setState({
			game: this.state.game
		});
	};

	standUp = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogic.standUpSitDown(combatant);

		this.setState({
			game: this.state.game
		});
	};

	scan = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogic.scan(encounter, combatant);

		this.setState({
			game: this.state.game
		});
	};

	hide = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogic.hide(encounter, combatant);

		this.setState({
			game: this.state.game
		});
	};

	endTurn = (encounter: EncounterModel) => {
		const acting = EncounterLogic.getActiveCombatants(encounter);
		const current = acting.length > 0 ? acting[0] : null;
		const next = acting.length > 1 ? acting[1] : null;
		if (current) {
			EncounterLogic.endOfTurn(encounter, current);
		}
		if (next) {
			EncounterLogic.startOfTurn(encounter, next);
		}
		this.setState({
			game: this.state.game
		});
	};

	equipItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		if (game.encounter) {
			combatant.combat.movement = Math.max(0, combatant.combat.movement - 1);
		}

		combatant.carried = combatant.carried.filter(i => i.id !== item.id);

		combatant.items.push(item);

		this.setState({
			game: game
		});
	};

	unequipItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		if (game.encounter) {
			combatant.combat.movement = Math.max(0, combatant.combat.movement - 1);
		}

		combatant.items = combatant.items.filter(i => i.id !== item.id);

		combatant.carried.push(item);

		this.setState({
			game: game
		});
	};

	pickUpItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		if (game.encounter) {
			combatant.combat.movement = Math.max(0, combatant.combat.movement - 1);
		}

		if (game.encounter) {
			const adj = EncounterMapLogic.getAdjacentSquares(game.encounter.mapSquares, [ combatant.combat.position ]);
			const piles = game.encounter.loot.filter(lp => adj.find(sq => (sq.x === lp.position.x) && (sq.y === lp.position.y)));
			const lp = piles.find(l => l.items.find(i => i === item));
			if (lp) {
				lp.items = lp.items.filter(i => i.id !== item.id);
				if (lp.items.length === 0) {
					game.encounter.loot = game.encounter.loot.filter(l => l.id !== lp.id);
				}
			}
		} else {
			game.items = game.items.filter(i => i.id !== item.id);
		}

		if ((game.encounter === null) && CombatantLogic.canEquip(combatant, item)) {
			combatant.items.push(item);
		} else {
			combatant.carried.push(item);
		}

		this.setState({
			game: game
		});
	};

	dropItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		combatant.items = combatant.items.filter(i => i.id !== item.id);
		combatant.carried = combatant.carried.filter(i => i.id !== item.id);

		if (game.encounter) {
			// See if we're beside any loot piles
			const adj = EncounterMapLogic.getAdjacentSquares(game.encounter.mapSquares, [ combatant.combat.position ]);
			const piles = game.encounter.loot.filter(lp => adj.find(sq => (sq.x === lp.position.x) && (sq.y === lp.position.y)));

			let lp = null;
			if (piles.length === 0) {
				lp = Factory.createLootPile();

				const empty = adj.filter(sq => EncounterLogic.getSquareIsEmpty(game.encounter as EncounterModel, sq));
				if (empty.length > 0) {
					const sq = Collections.draw(empty);
					lp.position.x = sq.x;
					lp.position.y = sq.y;
					game.encounter.loot.push(lp);
				}
			} else {
				lp = Collections.draw(piles);
			}

			lp.items.push(item);
		} else {
			game.items.push(item);
		}

		this.setState({
			game: game
		});
	};

	kill = (encounter: EncounterModel, combatant: CombatantModel) => {
		const active = EncounterLogic.getActiveCombatants(encounter);
		if (combatant === active[0]) {
			this.endTurn(encounter);
		}

		combatant.combat.state = CombatantState.Dead;

		const loot = Factory.createLootPile();
		loot.items.push(...combatant.items, ...combatant.carried);
		loot.position.x = combatant.combat.position.x;
		loot.position.y = combatant.combat.position.y;
		encounter.loot.push(loot);

		this.setState({
			game: this.state.game
		});
	};

	finishEncounter = (state: EncounterState) => {
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
			case EncounterState.Victory: {
				// Remove dead heroes from the game
				const deadHeroes = EncounterLogic.getDeadHeroes(encounter);
				game.heroes = game.heroes.filter(h => !deadHeroes.includes(h));
				// Get equipment from dead heroes, add to game items
				deadHeroes.forEach(h => game.items.push(...h.items));
				// Get equipment from loot piles, add to game items
				encounter.loot.forEach(lp => game.items.push(...lp.items));
				// Increment XP for surviving heroes
				EncounterLogic.getSurvivingHeroes(encounter).forEach(h => h.xp += 1);
				// Remove the first encounter for this region
				region.encounters.splice(0, 1);
				if (region.encounters.length === 0) {
					// Conquer the region
					CampaignMapLogic.removeRegion(game.map, region);
					if (game.map.squares.every(sq => sq.regionID === '')) {
						// Show message
						dialog = (
							<div>
								<Text type={TextType.Heading}>Victory</Text>
								<Text type={TextType.SubHeading}>You control the island!</Text>
								<Text><b>Congratulations!</b> There are no more regions to conquer.</Text>
								<button onClick={() => this.endCampaign()}>Start Again</button>
							</div>
						);
					} else {
						// Add a new level 1 hero
						GameLogic.addHeroToGame(game, Factory.createCombatant(CombatantType.Hero));
						// Add the region's boon
						game.boons.push(region.boon);
						// Show message
						dialog = (
							<div>
								<Text type={TextType.Heading}>Victory</Text>
								<Text type={TextType.SubHeading}>You have taken control of {region.name}!</Text>
								<Text>You can recruit a new hero, and you have earned a reward:</Text>
								<PlayingCard front={<BoonCard boon={region.boon} />} />
								<Text>Any heroes who died have been lost.</Text>
								<button onClick={() => this.setScreen(ScreenType.Campaign)}>OK</button>
							</div>
						);
					}
				}
				// Clear the current encounter
				game.encounter = null;
				break;
			}
			case EncounterState.Defeat: {
				// Remove all participating heroes from the game
				const heroes = EncounterLogic.getAllHeroesInEncounter(encounter);
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
				}
				break;
			}
			case EncounterState.Retreat: {
				// Remove fallen heroes from the game
				const fallenHeroes = EncounterLogic.getFallenHeroes(encounter);
				game.heroes = game.heroes.filter(h => !fallenHeroes.includes(h));
				// Clear the current encounter
				game.encounter = null;
				break;
			}
		}

		this.setState({
			screen: ScreenType.Campaign,
			game: game,
			dialog: dialog
		});
	};

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
						developer={this.state.developer}
						addHero={this.addHero}
						incrementXP={this.incrementXP}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
						levelUp={this.levelUp}
						redeemBoon={this.redeemBoon}
						buyItem={this.buyItem}
						sellItem={this.sellItem}
						addMoney={this.addMoney}
						startEncounter={this.startEncounter}
						conquer={this.conquer}
						endCampaign={this.endCampaign}
						setDeveloper={this.setDeveloper}
					/>
				);
			case 'encounter':
				return (
					<EncounterScreen
						encounter={this.state.game?.encounter as EncounterModel}
						game={this.state.game as GameModel}
						developer={this.state.developer}
						rollInitiative={this.rollInitiative}
						endTurn={this.endTurn}
						move={this.move}
						standUp={this.standUp}
						scan={this.scan}
						hide={this.hide}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
						kill={this.kill}
						finishEncounter={this.finishEncounter}
					/>
				);
		}

		return (
			<div>
				{this.state.screen}
			</div>
		);
	};

	render = () => {
		return (
			<div className='skirmish'>
				<div className='skirmish-top-bar'>
					<Text type={TextType.Heading}>Skirmish</Text>
				</div>
				<div className='skirmish-content'>
					{this.getContent()}
				</div>
				{this.state.dialog ? <Dialog content={this.state.dialog} /> : null}
			</div>
		);
	};

	//#endregion
}
