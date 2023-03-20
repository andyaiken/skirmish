import { Component } from 'react';

import { BoonType } from '../../enums/boon-type';
import { CardType } from '../../enums/card-type';
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
import { IntentsLogic } from '../../logic/intents-logic';

import type { ActionModel, ActionParameterModel } from '../../models/action';
import type { BoonModel } from '../../models/boon';
import type { CombatantModel } from '../../models/combatant';
import type { EncounterModel } from '../../models/encounter';
import type { FeatureModel } from '../../models/feature';
import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';
import type { RegionModel } from '../../models/region';

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

				game.encounter.combatants.forEach(c => {
					if (c.combat.trail === undefined) {
						c.combat.trail = [];
					}
					if (c.combat.actionLog === undefined) {
						c.combat.actionLog = [];
					}
					if (c.combat.intents === undefined) {
						c.combat.intents = null;
					}
				});

				for (let n = 0; n !== game.encounter.combatants.length; ++n) {
					const combatant = game.encounter.combatants[n];
					if (combatant.type === CombatantType.Hero) {
						const original = game.heroes.find(h => h.id === combatant.id);
						if (original) {
							original.combat = combatant.combat;
							game.encounter.combatants[n] = original;
						}
					}
				}
			}
		}

		this.state = {
			screen: ScreenType.Landing,
			game: game,
			developer: (window.location.href.includes('localhost')),
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
			case BoonType.Money:
				game.money += boon.data as number;
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
		const sell = (item: ItemModel) => {
			game.items = game.items.filter(i => i !== item);
			game.money += item.magic ? 50 : 1;
		};

		const game = this.state.game as GameModel;

		if (all) {
			game.items
				.filter(i => i.name === item.name)
				.forEach(i => sell(i));
		} else {
			sell(item);
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

	rotateMap = (encounter: EncounterModel, dir: 'l' | 'r') => {
		const move = (position: { x: number, y: number }, size: number): { x: number, y: number } => {
			const result = {
				x: position.x,
				y: position.y
			};

			switch (dir) {
				case 'l':
					result.x = position.y;
					result.y = -position.x - size;
					break;
				case 'r':
					result.x = -position.y - size;
					result.y = position.x;
					break;
			}

			return result;
		};

		encounter.mapSquares.forEach(sq => {
			const pos = move(sq, 1);
			sq.x = pos.x;
			sq.y = pos.y;
		});
		encounter.combatants.forEach(c => {
			const pos = move(c.combat.position, c.size);
			c.combat.position.x = pos.x;
			c.combat.position.y = pos.y;

			c.combat.trail.forEach(step => {
				const pos = move(step, c.size);
				step.x = pos.x;
				step.y = pos.y;
			});
		});
		encounter.loot.forEach(lp => {
			const pos = move(lp.position, 1);
			lp.position.x = pos.x;
			lp.position.y = pos.y;
		});
		EncounterMapLogic.visibilityCache = {};

		this.setState({
			game: this.state.game
		});
	};

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

	addMovement = (encounter:EncounterModel, combatant: CombatantModel, value: number) => {
		combatant.combat.movement += value;

		this.setState({
			game: this.state.game
		});
	};

	standUp = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogic.standUpSitDown(encounter, combatant);

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

	drawActions = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogic.drawActions(encounter, combatant);

		this.setState({
			game: this.state.game
		});
	};

	selectAction = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		EncounterLogic.selectAction(encounter, combatant, action);

		this.setState({
			game: this.state.game
		});
	};

	setActionParameterValue = (parameter: ActionParameterModel, value: unknown) => {
		parameter.value = value;

		this.setState({
			game: this.state.game
		});
	};

	runAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		EncounterLogic.runAction(encounter, combatant);

		this.setState({
			game: this.state.game
		});
	};

	endTurn = (encounter: EncounterModel) => {
		EncounterLogic.endTurn(encounter);

		this.setState({
			game: this.state.game
		});
	};

	performIntents = (encounter: EncounterModel, combatant: CombatantModel) => {
		IntentsLogic.performIntents(encounter, combatant);

		this.setState({
			game: this.state.game
		});
	};

	equipItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		if (game.encounter) {
			EncounterLogic.equipItem(game.encounter, combatant, item);
		} else {
			combatant.carried = combatant.carried.filter(i => i.id !== item.id);
			combatant.items.push(item);
		}

		this.setState({
			game: game
		});
	};

	unequipItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		if (game.encounter) {
			EncounterLogic.unequipItem(game.encounter, combatant, item);
		} else {
			combatant.items = combatant.items.filter(i => i.id !== item.id);
			combatant.carried.push(item);
		}

		this.setState({
			game: game
		});
	};

	pickUpItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		if (game.encounter) {
			EncounterLogic.pickUpItem(game.encounter, combatant, item);
		} else {
			game.items = game.items.filter(i => i.id !== item.id);
			if (CombatantLogic.canEquip(combatant, item)) {
				combatant.items.push(item);
			} else {
				combatant.carried.push(item);
			}
		}

		this.setState({
			game: game
		});
	};

	dropItem = (item: ItemModel, combatant: CombatantModel) => {
		const game = this.state.game as GameModel;

		if (game.encounter) {
			EncounterLogic.dropItem(game.encounter, combatant, item);
		} else {
			combatant.items = combatant.items.filter(i => i.id !== item.id);
			combatant.carried = combatant.carried.filter(i => i.id !== item.id);

			game.items.push(item);
		}

		this.setState({
			game: game
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
				const deadHeroes = encounter.combatants.filter(c => c.type === CombatantType.Hero).filter(h => h.combat.state === CombatantState.Dead);
				game.heroes = game.heroes.filter(h => !deadHeroes.includes(h));
				// Get equipment from dead heroes, add to game items
				deadHeroes.forEach(h => game.items.push(...h.items));
				// Get equipment from loot piles, add to game items
				encounter.loot.forEach(lp => game.items.push(...lp.items));
				// Increment XP for surviving heroes
				encounter.combatants
					.filter(c => c.type === CombatantType.Hero)
					.filter(h => (h.combat.state === CombatantState.Standing) || (h.combat.state === CombatantState.Prone))
					.forEach(h => h.xp += 1);
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
								<div className='boon-panel'>
									<PlayingCard type={CardType.Boon} front={<BoonCard boon={region.boon} />} />
								</div>
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
				const heroes = encounter.combatants.filter(c => c.type === CombatantType.Hero);
				game.heroes = game.heroes.filter(h => !heroes.includes(h));
				// Clear the current encounter
				game.encounter = null;
				if ((game.heroes.length === 0) && (!game.boons.some(b => b.type === BoonType.ExtraHero))) {
					// Show message
					dialog = (
						<div>
							<Text type={TextType.Heading}>Defeat</Text>
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
				const fallenHeroes = encounter.combatants
					.filter(c => c.type === CombatantType.Hero)
					.filter(h => (h.combat.state === CombatantState.Dead) || (h.combat.state === CombatantState.Unconscious));
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
					/>
				);
			case 'encounter':
				return (
					<EncounterScreen
						encounter={this.state.game?.encounter as EncounterModel}
						game={this.state.game as GameModel}
						developer={this.state.developer}
						rotateMap={this.rotateMap}
						rollInitiative={this.rollInitiative}
						endTurn={this.endTurn}
						performIntents={this.performIntents}
						move={this.move}
						addMovement={this.addMovement}
						standUp={this.standUp}
						scan={this.scan}
						hide={this.hide}
						drawActions={this.drawActions}
						selectAction={this.selectAction}
						setActionParameterValue={this.setActionParameterValue}
						runAction={this.runAction}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
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
				{this.getContent()}
				{this.state.dialog ? <Dialog content={this.state.dialog} /> : null}
			</div>
		);
	};

	//#endregion
}
