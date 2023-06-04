import { Component } from 'react';

import { SpeciesData } from '../../data/species-data';

import { BoonType } from '../../enums/boon-type';
import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { EncounterState } from '../../enums/encounter-state';

import { CampaignMapLogic } from '../../logic/campaign-map-logic';
import { CombatantLogic } from '../../logic/combatant-logic';
import { EncounterGenerator } from '../../generators/encounter-generator';
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

import { Collections } from '../../utils/collections';
import { Utils } from '../../utils/utils';

import { CampaignScreen, EncounterScreen, LandingScreen, SetupScreen } from '../screens';
import { Dialog, PlayingCard, Text, TextType } from '../controls';
import { PlaceholderCard } from '../cards';
import { SettingsPanel } from '../panels';

import './main.scss';

import encounters from '../../docs/encounters.md';
import game from '../../docs/game.md';
import island from '../../docs/island.md';
import items from '../../docs/items.md';
import team from '../../docs/team.md';

const rules: Record<string, string> = {};

enum ScreenType {
	Landing = 'landing',
	Setup = 'setup',
	Campaign = 'campaign',
	Encounter = 'encounter'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

interface State {
	game: GameModel | null;
	screen: ScreenType;
	showHelp: string | null;
	developer: boolean;
	dialog: JSX.Element | null;
	exceptions: string[];
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
				if (h.quirks === undefined) {
					h.quirks = [];
				}
			});

			game.map.regions.forEach(r => {
				if (r.demographics.speciesIDs === undefined) {
					r.demographics.speciesIDs = [
						...Collections.shuffle(SpeciesData.getList().filter(s => s.type === CombatantType.Monster).map(s => s.id)).slice(0, 2)
					];
				}

				if (r.pausedEncounter === undefined) {
					r.pausedEncounter = null;
				}
			});

			if (game.encounter) {
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
			game: game,
			screen: ScreenType.Landing,
			showHelp: null,
			developer: false,
			dialog: null,
			exceptions: []
		};
	}

	componentDidMount(): void {
		fetch(encounters).then(response => response.text()).then(text => {
			rules['encounters'] = text;
		});
		fetch(game).then(response => response.text()).then(text => {
			rules['game'] = text;
		});
		fetch(island).then(response => response.text()).then(text => {
			rules['island'] = text;
		});
		fetch(items).then(response => response.text()).then(text => {
			rules['items'] = text;
		});
		fetch(team).then(response => response.text()).then(text => {
			rules['team'] = text;
		});
	}

	logException = (ex: unknown) => {
		console.error(ex);

		const exceptions = this.state.exceptions;
		exceptions.push(`${ex}`);
		this.setState({
			exceptions: exceptions
		});
	};

	save = () => {
		try {
			const game = JSON.stringify(this.state.game);
			window.localStorage.setItem('game', game);
		} catch (ex) {
			console.error('Could not stringify data: ', ex);
		}
	};

	setScreen = (screen: ScreenType) => {
		this.setState({
			screen: screen,
			dialog: null
		});
	};

	showHelp = (filename: string) => {
		this.setState({
			showHelp: filename
		});
	};

	setDeveloperMode = (value: boolean) => {
		this.setState({
			developer: value
		});
	};

	//#region Campaign

	startCampaign = () => {
		try {
			const game = Factory.createGame();

			this.setState({
				game: game,
				screen: ScreenType.Setup
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	beginCampaign = () => {
		try {
			this.setState({
				screen: ScreenType.Campaign
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	continueCampaign = () => {
		try {
			this.setState({
				screen: !this.state.game?.encounter ? ScreenType.Campaign : ScreenType.Encounter
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	restartCampaign = () => {
		try {
			const game = this.state.game as GameModel;
			game.heroes = [
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero),
				Factory.createCombatant(CombatantType.Hero)
			];
			game.items = [];
			game.boons = [];
			game.money = 0;

			this.setState({
				game: game,
				screen: ScreenType.Campaign,
				dialog: null
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	endCampaign = () => {
		try {
			this.setState({
				game: null,
				screen: ScreenType.Landing,
				dialog: null
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Heroes page

	addHero = (hero: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;
			GameLogic.addHeroToGame(game, hero);
			this.setState({
				game: game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	addHeroes = (heroes: CombatantModel[]) => {
		try {
			const game = this.state.game as GameModel;
			heroes.forEach(hero => {
				GameLogic.addHeroToGame(game, hero);
			});
			this.setState({
				game: game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	incrementXP = (hero: CombatantModel) => {
		try {
			hero.xp = hero.level;
			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	levelUp = (feature: FeatureModel, hero: CombatantModel) => {
		try {
			CombatantLogic.incrementCombatantLevel(hero, feature);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	retireHero = (hero: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;

			// Remove hero
			game.heroes = game.heroes.filter(h => h.id !== hero.id);

			// Add XP
			const spent = hero.level * (hero.level - 1) / 2;
			const xp = Math.floor(spent + hero.xp / 2);
			if (xp > 0) {
				game.boons.push({
					id: Utils.guid(),
					type: BoonType.ExtraXP,
					data: xp
				});
			}

			// Add magic items
			hero.items.filter(i => i.magic).forEach(i => game.items.push(i));
			hero.carried.filter(i => i.magic).forEach(i => game.items.push(i));

			// Add a blank hero
			game.heroes.push(Factory.createCombatant(CombatantType.Hero));

			this.setState({
				game: game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	redeemBoon = (boon: BoonModel, hero: CombatantModel | null) => {
		try {
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
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Items

	buyItem = (item: ItemModel) => {
		try {
			const game = this.state.game as GameModel;

			game.items.push(item);
			game.money = Math.max(0, game.money - 100);

			this.setState({
				game: game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	sellItem = (item: ItemModel, all: boolean) => {
		try {
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
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	addMoney = () => {
		try {
			const game = this.state.game as GameModel;

			game.money += 100;

			this.setState({
				game: game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Campaign map page

	startEncounter = (region: RegionModel, heroes: CombatantModel[]) => {
		try {
			if (this.state.game) {
				heroes.forEach(h => CombatantLogic.resetCombatant(h));

				const game = this.state.game;
				game.encounter = EncounterGenerator.createEncounter(region, heroes);
				region.pausedEncounter = null;

				this.setState({
					game: game,
					screen: ScreenType.Encounter
				}, () => {
					this.save();
				});
			}
		} catch (ex) {
			this.logException(ex);
		}
	};

	conquer = (region: RegionModel) => {
		try {
			if (this.state.game) {
				const game = this.state.game;

				CampaignMapLogic.removeRegion(game.map, region);
				GameLogic.addHeroToGame(game, Factory.createCombatant(CombatantType.Hero));
				game.boons.push(region.boon);

				this.setState({
					game: game
				}, () => {
					this.save();
				});
			}
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Encounter page

	rotateMap = (encounter: EncounterModel, dir: 'l' | 'r') => {
		try {
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
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	rollInitiative = (encounter: EncounterModel) => {
		try {
			EncounterLogic.rollInitiative(encounter);

			const acting = EncounterLogic.getActiveCombatants(encounter);
			const current = acting.length > 0 ? acting[0] : null;
			if (current) {
				EncounterLogic.startOfTurn(encounter, current);
			}

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	move = (encounter: EncounterModel, combatant: CombatantModel, dir: string, cost: number) => {
		try {
			EncounterLogic.move(encounter, combatant, dir, cost);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	addMovement = (encounter:EncounterModel, combatant: CombatantModel, value: number) => {
		try {
			combatant.combat.movement += value;

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	inspire = (encounter: EncounterModel, combatant: CombatantModel) => {
		try {
			EncounterLogic.inspire(encounter, combatant);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	scan = (encounter: EncounterModel, combatant: CombatantModel) => {
		try {
			EncounterLogic.scan(encounter, combatant);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	hide = (encounter: EncounterModel, combatant: CombatantModel) => {
		try {
			EncounterLogic.hide(encounter, combatant);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	drawActions = (encounter: EncounterModel, combatant: CombatantModel) => {
		try {
			EncounterLogic.drawActions(encounter, combatant);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	selectAction = (encounter: EncounterModel, combatant: CombatantModel, action: ActionModel) => {
		try {
			EncounterLogic.selectAction(encounter, combatant, action);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	deselectAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		try {
			EncounterLogic.deselectAction(encounter, combatant);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	setActionParameterValue = (parameter: ActionParameterModel, value: unknown) => {
		try {
			parameter.value = value;

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	runAction = (encounter: EncounterModel, combatant: CombatantModel) => {
		try {
			EncounterLogic.runAction(encounter, combatant);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	endTurn = (encounter: EncounterModel) => {
		try {
			EncounterLogic.endTurn(encounter);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	performIntents = (encounter: EncounterModel, combatant: CombatantModel) => {
		try {
			IntentsLogic.performIntents(encounter, combatant);

			this.setState({
				game: this.state.game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	equipItem = (item: ItemModel, combatant: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;

			if (game.encounter) {
				EncounterLogic.equipItem(game.encounter, combatant, item);
			} else {
				game.items = game.items.filter(i => i.id !== item.id);
				combatant.carried = combatant.carried.filter(i => i.id !== item.id);
				combatant.items.push(item);
			}

			this.setState({
				game: game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	unequipItem = (item: ItemModel, combatant: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;

			if (game.encounter) {
				EncounterLogic.unequipItem(game.encounter, combatant, item);
			} else {
				combatant.items = combatant.items.filter(i => i.id !== item.id);
				combatant.carried.push(item);
			}

			this.setState({
				game: game
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	pickUpItem = (item: ItemModel, combatant: CombatantModel) => {
		try {
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
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	dropItem = (item: ItemModel, combatant: CombatantModel) => {
		try {
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
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	finishEncounter = (state: EncounterState) => {
		try {
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

			let dialogContent = null;
			switch (state) {
				case EncounterState.Victory: {
					// Remove dead heroes from the game
					const deadHeroes = encounter.combatants.filter(c => c.type === CombatantType.Hero).filter(h => h.combat.state === CombatantState.Dead);
					game.heroes = game.heroes.filter(h => !deadHeroes.includes(h));
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
							dialogContent = (
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
					region.pausedEncounter = EncounterLogic.getPausedEncounter(game.encounter as EncounterModel);
					game.encounter = null;
					if ((game.heroes.length === 0) && (!game.boons.some(b => b.type === BoonType.ExtraHero))) {
						// Show message
						dialogContent = (
							<div>
								<Text type={TextType.Heading}>Defeat</Text>
								<Text type={TextType.SubHeading}>You lost the encounter in {region.name}, and have no more heroes.</Text>
								<Text>You can either continue your campaign with a new group of heroes, or abandon it.</Text>
								<div className='defeat-options'>
									<PlayingCard front={<PlaceholderCard text='Continue' onClick={() => this.restartCampaign()} />} />
									<PlayingCard front={<PlaceholderCard text='Abandon' onClick={() => this.endCampaign()} />} />
								</div>
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
					region.pausedEncounter = EncounterLogic.getPausedEncounter(game.encounter as EncounterModel);
					game.encounter = null;
					break;
				}
			}

			game.heroes.forEach(h => CombatantLogic.resetCombatant(h));

			this.setState({
				screen: ScreenType.Campaign,
				game: game,
				dialog: dialogContent
			}, () => {
				this.save();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Rendering

	getContent = () => {
		switch (this.state.screen) {
			case ScreenType.Landing:
				return (
					<LandingScreen
						game={this.state.game}
						developer={this.state.developer}
						showHelp={this.showHelp}
						startCampaign={this.startCampaign}
						continueCampaign={this.continueCampaign}
					/>
				);
			case ScreenType.Setup:
				return (
					<SetupScreen
						game={this.state.game as GameModel}
						developer={this.state.developer}
						addHero={this.addHero}
						addHeroes={this.addHeroes}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
						beginCampaign={this.beginCampaign}
					/>
				);
			case ScreenType.Campaign:
				return (
					<CampaignScreen
						game={this.state.game as GameModel}
						developer={this.state.developer}
						hasExceptions={this.state.exceptions.length > 0}
						showHelp={this.showHelp}
						addHero={this.addHero}
						incrementXP={this.incrementXP}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
						levelUp={this.levelUp}
						retireHero={this.retireHero}
						redeemBoon={this.redeemBoon}
						buyItem={this.buyItem}
						sellItem={this.sellItem}
						addMoney={this.addMoney}
						startEncounter={this.startEncounter}
						conquer={this.conquer}
					/>
				);
			case ScreenType.Encounter:
				return (
					<EncounterScreen
						encounter={this.state.game?.encounter as EncounterModel}
						game={this.state.game as GameModel}
						developer={this.state.developer}
						hasExceptions={this.state.exceptions.length > 0}
						showHelp={this.showHelp}
						rotateMap={this.rotateMap}
						rollInitiative={this.rollInitiative}
						endTurn={this.endTurn}
						performIntents={this.performIntents}
						move={this.move}
						addMovement={this.addMovement}
						inspire={this.inspire}
						scan={this.scan}
						hide={this.hide}
						drawActions={this.drawActions}
						selectAction={this.selectAction}
						deselectAction={this.deselectAction}
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
	};

	render = () => {
		try {
			let help = null;
			if (this.state.showHelp !== null) {
				help = (
					<Dialog
						content={
							<SettingsPanel
								game={this.state.game}
								exceptions={this.state.exceptions}
								rules={rules[this.state.showHelp]}
								developer={this.state.developer}
								endCampaign={this.endCampaign}
								setDeveloperMode={this.setDeveloperMode}
							/>
						}
						onClose={() => this.setState({ showHelp: null })}
					/>
				);
			}

			return (
				<div className='skirmish'>
					{this.getContent()}
					{this.state.dialog ? <Dialog content={this.state.dialog} /> : null}
					{help}
				</div>
			);
		} catch {
			return <div className='skirmish render-error' />;
		}
	};

	//#endregion
}
