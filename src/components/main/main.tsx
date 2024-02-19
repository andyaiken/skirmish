import { Component } from 'react';
import { Toaster } from 'react-hot-toast';

import { BoonType } from '../../enums/boon-type';
import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { EncounterState } from '../../enums/encounter-state';
import { FeatureType } from '../../enums/feature-type';
import { OrientationType } from '../../enums/orientation-type';
import { PageType } from '../../enums/page-type';
import { ScreenType } from '../../enums/screen-type';
import { StructureType } from '../../enums/structure-type';

import { CampaignMapGenerator } from '../../generators/campaign-map-generator';
import { EncounterGenerator } from '../../generators/encounter-generator';
import { EncounterMapGenerator } from '../../generators/encounter-map-generator';

import { CampaignMapLogic } from '../../logic/campaign-map-logic';
import { CombatantLogic } from '../../logic/combatant-logic';
import { ConditionLogic } from '../../logic/condition-logic';
import { EncounterLogic } from '../../logic/encounter-logic';
import { EncounterMapLogic } from '../../logic/encounter-map-logic';
import { Factory } from '../../logic/factory';
import { GameLogic } from '../../logic/game-logic';
import { IntentsLogic } from '../../logic/intents-logic';
import { StrongholdLogic } from '../../logic/stronghold-logic';

import type { ActionModel, ActionParameterModel } from '../../models/action';
import type { BoonModel } from '../../models/boon';
import type { CombatantModel } from '../../models/combatant';
import type { ConditionModel } from '../../models/condition';
import type { EncounterModel } from '../../models/encounter';
import type { FeatureModel } from '../../models/feature';
import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';
import type { OptionsModel } from '../../models/options';
import type { PackModel } from '../../models/pack';
import type { RegionModel } from '../../models/region';
import type { StructureModel } from '../../models/structure';

import type { Platform } from '../../platform/platform';

import { Collections } from '../../utils/collections';
import { Sound } from '../../utils/sound';
import { Utils } from '../../utils/utils';

import { BackstageScreen, CampaignScreen, EncounterScreen, LandingScreen, SetupScreen } from '../screens';
import { Dialog, PlayingCard, Text, TextType } from '../controls';
import { HelpModal, PacksModal } from '../modals';
import { PlaceholderCard } from '../cards';

import './main.scss';

import encounters from '../../assets/docs/encounters.md';
import island from '../../assets/docs/island.md';
import items from '../../assets/docs/items.md';
import stronghold from '../../assets/docs/stronghold.md';
import team from '../../assets/docs/team.md';

import dong from '../../assets/sounds/dong.mp3';

const rules: Record<string, string> = {};

interface Props {
	game: GameModel | null;
	options: OptionsModel;
	platform: Platform;
	orientation: OrientationType;
	screen: ScreenType;
	page: PageType;
	setScreen: (screen: ScreenType) => void;
	setPage: (page: PageType) => void;
}

interface State {
	game: GameModel | null;
	options: OptionsModel;
	showHelp: string | null;
	showPacks: boolean;
	dialog: JSX.Element | null;
	exceptions: string[];
}

export class Main extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			game: props.game,
			options: props.options,
			showHelp: null,
			showPacks: false,
			dialog: null,
			exceptions: []
		};

		this.props.platform.getGame = () => this.state.game;
		this.props.platform.getOptions = () => this.state.options;
		this.props.platform.logException = ex => this.logException(ex);

		Sound.volume = this.state.options.soundEffectsVolume;
	}

	componentDidMount = () => {
		fetch(encounters).then(response => response.text()).then(text => {
			rules['encounters'] = text;
		});
		fetch(island).then(response => response.text()).then(text => {
			rules['island'] = text;
		});
		fetch(items).then(response => response.text()).then(text => {
			rules['items'] = text;
		});
		fetch(stronghold).then(response => response.text()).then(text => {
			rules['stronghold'] = text;
		});
		fetch(team).then(response => response.text()).then(text => {
			rules['team'] = text;
		});
		fetch(dong).then(response => response.arrayBuffer()).then(arrayBuffer => {
			Sound.dong.array = arrayBuffer;
		});
	};

	logException = (ex: unknown) => {
		console.error(ex);

		const exceptions = this.state.exceptions;
		exceptions.push(`${ex}`);
		this.setState({
			exceptions: exceptions
		});
	};

	saveGame = Utils.debounce(() => {
		this.props.platform.saveGame();
	});

	saveOptions = Utils.debounce(() => {
		this.props.platform.saveOptions();
	});

	setScreen = (screen: ScreenType) => {
		this.setState({
			dialog: null
		}, () => {
			this.props.setScreen(screen);
		});
	};

	showHelp = (filename: string) => {
		this.setState({
			showHelp: filename,
			showPacks: false,
			dialog: null
		});
	};

	showPacks = () => {
		this.setState({
			showHelp: null,
			showPacks: true,
			dialog: null
		});
	};

	setDeveloperMode = (value: boolean) => {
		const options = this.state.options;
		options.developer = value;

		this.setState({
			options: options
		}, () => {
			this.saveOptions();
		});
	};

	setShowTips = (value: boolean) => {
		const options = this.state.options;
		options.showTips = value;

		this.setState({
			options: options
		}, () => {
			this.saveOptions();
		});
	};

	setSoundEffectsVolume = (value: number) => {
		const options = this.state.options;
		options.soundEffectsVolume = value;

		Sound.volume = value;

		this.setState({
			options: options
		}, () => {
			this.saveOptions();
		});
	};

	setRenderer = (value: string) => {
		const options = this.state.options;
		options.renderer = value;

		this.setState({
			options: options
		}, () => {
			this.saveOptions();
		});
	};

	getPackPrice = (packs: PackModel[]) => {
		return this.props.platform.getPackPrice(packs, this.state.options);
	};

	addPacks = (packs: PackModel[]) => {
		const options = this.state.options;

		this.props.platform.getPacks(packs, this.state.options).then(() => {
			packs.forEach(pack => {
				if (!options.packIDs.includes(pack.id)) {
					options.packIDs.push(pack.id);
				}
			});
			options.packIDs.sort();

			this.setState({
				options: options
			}, () => {
				this.saveOptions();
			});
		});
	};

	removePack = (pack: PackModel) => {
		const options = this.state.options;
		options.packIDs = options.packIDs.filter(p => p !== pack.id);

		this.setState({
			options: options
		}, () => {
			this.saveOptions();
		});
	};

	//#region Campaign

	startCampaign = () => {
		try {
			const game = Factory.createGame(this.state.options.packIDs);

			this.setState({
				game: game,
				showHelp: null,
				showPacks: false,
				dialog: null
			}, () => {
				this.saveGame();
				this.props.setScreen(ScreenType.Setup);
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	beginCampaign = () => {
		try {
			this.saveGame();
			this.props.setScreen(ScreenType.Campaign);
		} catch (ex) {
			this.logException(ex);
		}
	};

	continueCampaign = () => {
		try {
			this.saveGame();
			this.props.setScreen(!this.state.game?.encounter ? ScreenType.Campaign : ScreenType.Encounter);
		} catch (ex) {
			this.logException(ex);
		}
	};

	nextIsland = () => {
		try {
			const currentGame = this.state.game as GameModel;
			const game = Factory.createGame(this.state.options.packIDs);
			game.heroes = currentGame.heroes;
			game.heroSlots = 0;

			this.setState({
				game: game,
				showHelp: null,
				showPacks: false,
				dialog: null
			}, () => {
				this.saveGame();
				this.props.setScreen(ScreenType.Campaign);
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	restartCampaign = () => {
		try {
			const game = this.state.game as GameModel;
			game.heroSlots = 5;
			game.heroes = [];
			game.items = [];
			game.boons = [];
			game.money = 0;

			this.setState({
				game: game,
				showHelp: null,
				showPacks: false,
				dialog: null
			}, () => {
				this.saveGame();
				this.props.setScreen(ScreenType.Campaign);
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	endCampaign = () => {
		try {
			this.setState({
				game: null,
				showHelp: null,
				showPacks: false,
				dialog: null
			}, () => {
				this.saveGame();
				this.props.setScreen(ScreenType.Landing);
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Stronghold page

	buyStructure = (structure: StructureModel, cost: number) => {
		try {
			const game = this.state.game as GameModel;

			StrongholdLogic.addStructure(game.stronghold, structure);

			if (cost > 0) {
				game.money = Math.max(0, game.money - cost);
			}

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	sellStructure = (structure: StructureModel) => {
		try {
			const game = this.state.game as GameModel;

			game.stronghold = game.stronghold.filter(s => s.id !== structure.id);
			game.money += 25;

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	chargeStructure = (structure: StructureModel) => {
		try {
			const game = this.state.game as GameModel;

			const money = 100;
			game.money = Math.max(0, game.money - money);

			structure.charges += structure.level;

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	upgradeStructure = (structure: StructureModel) => {
		try {
			const game = this.state.game as GameModel;

			const money = 50 * structure.level;
			game.money = Math.max(0, game.money - money);

			structure.level += 1;

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	useCharge = (type: StructureType, count: number) => {
		try {
			const game = this.state.game as GameModel;

			StrongholdLogic.useCharge(game, type, count);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	addXP = (hero: CombatantModel, useCharge: StructureType | null) => {
		try {
			const game = this.state.game as GameModel;

			hero.xp += 1;

			if (useCharge) {
				StrongholdLogic.useCharge(game, useCharge, 1);
			}

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	levelUp = (feature: FeatureModel, hero: CombatantModel) => {
		try {
			CombatantLogic.incrementCombatantLevel(hero, feature, this.state.options.packIDs);

			this.setState({
				game: this.state.game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	retireHero = (hero: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;

			// Add XP
			const spent = hero.level * (hero.level - 1) / 2;
			const total = spent + hero.xp;
			const xp = Math.floor(total / 2);
			if (xp > 0) {
				game.boons.push({
					id: Utils.guid(),
					type: BoonType.ExtraXP,
					data: xp
				});
			}

			// Remove the hero
			game.heroSlots += 1;
			game.heroes = game.heroes.filter(h => h.id !== hero.id);

			// Add magic items and potions
			hero.items.filter(i => i.magic || i.potion).forEach(i => game.items.push(i));
			hero.carried.filter(i => i.magic || i.potion).forEach(i => game.items.push(i));

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	redeemBoon = (boon: BoonModel, hero: CombatantModel | null, item: ItemModel | null, newItem: ItemModel | null, cost: number) => {
		try {
			const game = this.state.game as GameModel;
			game.boons = game.boons.filter(b => b.id !== boon.id);

			switch (boon.type) {
				case BoonType.ExtraHero:
					game.heroSlots += 1;
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
				case BoonType.EnchantItem: {
					const original = item as ItemModel;
					const upgrade = newItem as ItemModel;
					game.heroes.forEach(h => {
						h.items.forEach((i, n) => {
							if (i.id === original.id) {
								h.items[n] = upgrade;
							}
						});
						h.carried.forEach((i, n) => {
							if (i.id === original.id) {
								h.items[n] = upgrade;
							}
						});
					});
					game.items.forEach((i, n) => {
						if (i.id === original.id) {
							game.items[n] = upgrade;
						}
					});
					break;
				}
				case BoonType.Structure:
					StrongholdLogic.addStructure(game.stronghold, boon.data as StructureModel);
					break;
			}

			game.money -= cost;

			this.setState({
				game: game
			}, () => {
				this.saveGame();
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

			let money = 2;
			if (item.potion) {
				money = 20;
			}
			if (item.magic) {
				money = 100;
			}
			game.money = Math.max(0, game.money - money);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	sellItem = (item: ItemModel, all: boolean) => {
		try {
			const sell = (item: ItemModel) => {
				game.items = game.items.filter(i => i !== item);

				let money = 1;
				if (item.potion) {
					money = 10;
				}
				if (item.magic) {
					money = 50;
				}
				game.money += money;
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
				this.saveGame();
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
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Campaign map page

	startEncounter = (region: RegionModel, heroes: CombatantModel[], benefits: number, detriments: number) => {
		try {
			if (this.state.game) {
				const game = this.state.game;

				heroes.forEach(h => CombatantLogic.resetCombatant(h));
				game.heroes = game.heroes.filter(h => !heroes.includes(h));
				game.encounter = EncounterGenerator.createEncounter(region, heroes, this.state.options.packIDs);

				for (let n = 0; n < benefits; ++n) {
					const hero = Collections.draw(game.encounter.combatants.filter(c => c.faction === CombatantType.Hero));
					hero.combat.conditions.push(ConditionLogic.createRandomBeneficialCondition() as ConditionModel);
				}
				if (!this.state.options.developer) {
					StrongholdLogic.useCharge(game, StructureType.Temple, benefits);
				}

				for (let n = 0; n < detriments; ++n) {
					const hero = Collections.draw(game.encounter.combatants.filter(c => c.faction === CombatantType.Monster));
					hero.combat.conditions.push(ConditionLogic.createRandomDetrimentalCondition() as ConditionModel);
				}
				if (!this.state.options.developer) {
					StrongholdLogic.useCharge(game, StructureType.Intelligencer, detriments);
				}

				EncounterMapLogic.visibilityCache.reset();

				this.setState({
					game: game
				}, () => {
					this.saveGame();
					this.props.setScreen(ScreenType.Encounter);
				});
			}
		} catch (ex) {
			this.logException(ex);
		}
	};

	regenerateCampaignMap = () => {
		try {
			if (this.state.game) {
				const game = this.state.game;

				game.map = CampaignMapGenerator.generateCampaignMap(this.state.options.packIDs, Math.random);

				this.setState({
					game: game
				}, () => {
					this.saveGame();
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

				CampaignMapLogic.conquerRegion(game.map, region);
				game.heroes.forEach(h => h.xp += region.encounters.length);
				game.heroSlots += 1;
				game.boons.push(region.boon);

				this.setState({
					game: game
				}, () => {
					this.saveGame();
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
			EncounterMapLogic.visibilityCache.reset();

			this.setState({
				game: this.state.game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	rollInitiative = () => {
		try {
			const game = this.state.game as GameModel;
			const encounter = game.encounter as EncounterModel;
			EncounterLogic.rollInitiative(encounter);

			const active = EncounterLogic.getActiveCombatants(encounter);
			const current = active.length > 0 ? active[0] : null;
			if (current) {
				EncounterLogic.startOfTurn(encounter, current);
			}

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	regenerateEncounterMap = () => {
		try {
			const game = this.state.game as GameModel;
			const encounter = game.encounter as EncounterModel;

			encounter.mapSquares = EncounterMapGenerator.generateEncounterMap(Math.random);

			encounter.combatants.forEach(c => c.combat.position = { x: Number.MIN_VALUE, y: Number.MIN_VALUE });
			encounter.loot.forEach(lp => lp.position = { x: Number.MIN_VALUE, y: Number.MIN_VALUE });

			EncounterGenerator.placeCombatants(encounter, Math.random);
			EncounterGenerator.placeLoot(encounter, Math.random);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	addCombatantToEncounter = (encounter: EncounterModel, combatant: CombatantModel, useCharge: StructureType | null) => {
		try {
			const game = this.state.game as GameModel;

			if (combatant.type === CombatantType.Hero) {
				game.heroes = game.heroes.filter(h => h.id !== combatant.id);
			}

			CombatantLogic.resetCombatant(combatant);
			encounter.combatants.push(combatant);
			EncounterGenerator.placeCombatants(encounter, Math.random);

			if (useCharge) {
				StrongholdLogic.useCharge(game, useCharge, 1);
			}

			this.setState({
				game: game
			}, () => {
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	drinkPotion = (encounter: EncounterModel, owner: CombatantModel, drinker: CombatantModel, potion: ItemModel) => {
		try {
			EncounterLogic.drinkPotion(encounter, owner, drinker, potion);

			this.setState({
				game: this.state.game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	drawActions = (encounter: EncounterModel, combatant: CombatantModel, useCharge: StructureType | null) => {
		try {
			EncounterLogic.drawActions(encounter, combatant);

			if (useCharge) {
				StrongholdLogic.useCharge(this.state.game as GameModel, useCharge, 1);
			}

			this.setState({
				game: this.state.game
			}, () => {
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	runMonsterTurn = (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => {
		try {
			const perform = () => {
				combatant.combat.intents = IntentsLogic.getIntents(encounter, combatant);
				if (combatant.combat.intents && (combatant.combat.intents.intents.length > 0)) {
					IntentsLogic.performIntents(encounter, combatant);

					this.setState({
						game: this.state.game
					}, () => {
						this.saveGame();
						setTimeout(perform, 800);
					});
				} else {
					EncounterLogic.endTurn(encounter);

					this.setState({
						game: this.state.game
					}, () => {
						this.saveGame();
						onFinished();
					});
				}
			};

			setTimeout(perform, 1000);
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
				this.saveGame();
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
					// Get equipment and money from loot piles, add to game items
					encounter.loot.forEach(lp => {
						game.items.push(...lp.items);
						game.money += lp.money;
					});
					encounter.combatants
						.filter(c => (c.type === CombatantType.Monster) && (c.faction === CombatantType.Monster))
						.forEach(c => {
							game.items.push(...c.items);
							game.items.push(...c.carried);
						});
					// Increment XP for surviving heroes
					encounter.combatants
						.filter(c => (c.type === CombatantType.Hero) && (c.faction === CombatantType.Hero))
						.filter(h => (h.combat.state === CombatantState.Standing) || (h.combat.state === CombatantState.Prone))
						.forEach(h => h.xp += 1);
					// Add surviving heroes back into the game
					encounter.combatants
						.filter(c => (c.type === CombatantType.Hero) && (c.faction === CombatantType.Hero))
						.filter(h => (h.combat.state === CombatantState.Standing) || (h.combat.state === CombatantState.Prone) || (h.combat.state === CombatantState.Unconscious))
						.forEach(h => game.heroes.push(h));
					game.heroes = Collections.sort(game.heroes, n => n.name);
					// Remove the first encounter for this region
					region.encounters.splice(0, 1);
					if (region.encounters.length === 0) {
						// Conquer the region
						CampaignMapLogic.conquerRegion(game.map, region);
						if (game.map.squares.every(sq => sq.regionID === '')) {
							// Show message
							dialogContent = (
								<div>
									<Text type={TextType.Heading}>Victory</Text>
									<Text type={TextType.SubHeading}>You control the island!</Text>
									<Text>
										<p><b>Congratulations!</b> There are no more regions to conquer.</p>
										<p>You can now choose to take your heroes to a new island, or you can start a fresh new campaign.</p>
									</Text>
									<div className='card-options'>
										<PlayingCard front={<PlaceholderCard text='New Island' />} onClick={() => this.nextIsland()} />
										<PlayingCard front={<PlaceholderCard text='Fresh Start' />} onClick={() => this.endCampaign()} />
									</div>
								</div>
							);
						} else {
							// Add a new hero slot
							game.heroSlots += 1;
							// Add the region's boon
							game.boons.push(region.boon);
						}
					}
					// Clear the current encounter
					game.encounter = null;
					break;
				}
				case EncounterState.Defeat: {
					// Clear the current encounter
					game.encounter = null;
					const heroes = game.heroes.length + game.heroSlots + game.boons.filter(b => b.type === BoonType.ExtraHero).length;
					if (heroes === 0) {
						// Show message
						dialogContent = (
							<div>
								<Text type={TextType.Heading}>Defeat</Text>
								<Text type={TextType.SubHeading}>You lost the encounter in {region.name}, and have no more heroes.</Text>
								<Text>You can either continue your campaign with a new group of heroes, or abandon it.</Text>
								<div className='card-options'>
									<PlayingCard front={<PlaceholderCard text='Continue' />} onClick={() => this.restartCampaign()} />
									<PlayingCard front={<PlaceholderCard text='Abandon' />} onClick={() => this.endCampaign()} />
								</div>
							</div>
						);
					}
					break;
				}
				case EncounterState.Retreat: {
					// Add conscious heroes back into the game
					encounter.combatants
						.filter(c => (c.type === CombatantType.Hero) && (c.faction === CombatantType.Hero))
						.filter(h => (h.combat.state === CombatantState.Standing) || (h.combat.state === CombatantState.Prone))
						.forEach(h => game.heroes.push(h));
					game.heroes = Collections.sort(game.heroes, n => n.name);
					// Clear the current encounter
					game.encounter = null;
					break;
				}
			}

			game.heroes.forEach(h => CombatantLogic.resetCombatant(h));
			EncounterMapLogic.visibilityCache.reset();

			this.setState({
				game: game,
				dialog: dialogContent
			}, () => {
				this.saveGame();
				this.props.setScreen(ScreenType.Campaign);
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	incrementMonsterLevel = (combatant: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;

			const featureDeck = CombatantLogic.getFeatureDeck(combatant).filter(f => f.type !== FeatureType.Proficiency);
			CombatantLogic.incrementCombatantLevel(combatant, Collections.draw(featureDeck), this.props.options.packIDs);
			EncounterLogic.drawActions(game.encounter as EncounterModel, combatant);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	switchAllegiance = (combatant: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;

			combatant.faction = (combatant.faction === CombatantType.Hero) ? CombatantType.Monster : CombatantType.Hero;
			EncounterLogic.drawActions(game.encounter as EncounterModel, combatant);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	stun = (combatant: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;

			combatant.combat.stunned = !combatant.combat.stunned;

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	knockout = (combatant: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;
			const encounter = game.encounter as EncounterModel;

			EncounterLogic.knockout(encounter, combatant);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	kill = (combatant: CombatantModel) => {
		try {
			const game = this.state.game as GameModel;
			const encounter = game.encounter as EncounterModel;

			EncounterLogic.kill(encounter, combatant);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	nudgeInitiative = (combatant: CombatantModel, delta: number) => {
		try {
			const game = this.state.game as GameModel;
			const encounter = game.encounter as EncounterModel;

			combatant.combat.initiative += delta;
			EncounterLogic.sortInitiative(encounter);

			this.setState({
				game: game
			}, () => {
				this.saveGame();
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	//#endregion

	//#region Rendering

	getContent = () => {
		switch (this.props.screen) {
			case ScreenType.Landing:
				return (
					<LandingScreen
						game={this.state.game}
						options={this.state.options}
						orientation={this.props.orientation}
						startCampaign={this.startCampaign}
						continueCampaign={this.continueCampaign}
						showPacks={this.showPacks}
					/>
				);
			case ScreenType.Setup:
				return (
					<SetupScreen
						game={this.state.game as GameModel}
						options={this.state.options}
						orientation={this.props.orientation}
						addHero={this.addHero}
						addHeroes={this.addHeroes}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
						showPacks={this.showPacks}
						beginCampaign={this.beginCampaign}
					/>
				);
			case ScreenType.Campaign:
				return (
					<CampaignScreen
						game={this.state.game as GameModel}
						options={this.state.options}
						platform={this.props.platform}
						orientation={this.props.orientation}
						page={this.props.page}
						hasExceptions={this.state.exceptions.length > 0}
						setPage={this.props.setPage}
						showHelp={this.showHelp}
						showPacks={this.showPacks}
						toggleBackstage={() => this.setScreen(ScreenType.Backstage)}
						buyStructure={this.buyStructure}
						sellStructure={this.sellStructure}
						chargeStructure={this.chargeStructure}
						upgradeStructure={this.upgradeStructure}
						useCharge={this.useCharge}
						addHero={this.addHero}
						addXP={this.addXP}
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
						regenerateCampaignMap={this.regenerateCampaignMap}
						conquer={this.conquer}
					/>
				);
			case ScreenType.Encounter:
				return (
					<EncounterScreen
						encounter={this.state.game?.encounter as EncounterModel}
						game={this.state.game as GameModel}
						options={this.state.options}
						orientation={this.props.orientation}
						hasExceptions={this.state.exceptions.length > 0}
						showHelp={this.showHelp}
						rotateMap={this.rotateMap}
						rollInitiative={this.rollInitiative}
						regenerateEncounterMap={this.regenerateEncounterMap}
						addCombatantToEncounter={this.addCombatantToEncounter}
						endTurn={encounter => this.endTurn(encounter)}
						move={this.move}
						addMovement={this.addMovement}
						inspire={this.inspire}
						scan={this.scan}
						hide={this.hide}
						drinkPotion={this.drinkPotion}
						drawActions={this.drawActions}
						selectAction={this.selectAction}
						deselectAction={this.deselectAction}
						setActionParameterValue={this.setActionParameterValue}
						runAction={this.runAction}
						runMonsterTurn={this.runMonsterTurn}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
						useCharge={this.useCharge}
						levelUp={this.incrementMonsterLevel}
						switchAllegiance={this.switchAllegiance}
						stun={this.stun}
						knockout={this.knockout}
						kill={this.kill}
						nudgeInitiative={this.nudgeInitiative}
						finishEncounter={this.finishEncounter}
					/>
				);
			case ScreenType.Backstage: {
				return (
					<BackstageScreen
						options={this.props.options}
						toggleBackstage={() => this.setScreen(ScreenType.Campaign)}
					/>
				);
			}
		}
	};

	render = () => {
		try {
			let dialog = null;
			if (this.state.showHelp !== null) {
				dialog = (
					<Dialog
						content={
							<HelpModal
								game={this.state.game}
								exceptions={this.state.exceptions}
								rules={rules[this.state.showHelp]}
								options={this.state.options}
								endCampaign={this.endCampaign}
								setDeveloperMode={this.setDeveloperMode}
								setShowTips={this.setShowTips}
								setSoundEffectsVolume={this.setSoundEffectsVolume}
								setRenderer={this.setRenderer}
							/>
						}
						onClose={() => this.setState({ showHelp: null })}
					/>
				);
			}
			if (this.state.showPacks) {
				dialog = (
					<Dialog
						content={
							<PacksModal
								options={this.state.options}
								getPrice={this.getPackPrice}
								addPacks={this.addPacks}
								removePack={this.removePack}
							/>
						}
						onClose={() => this.setState({ showPacks: false })}
					/>
				);
			}
			if (this.state.dialog) {
				dialog = (
					<Dialog
						content={this.state.dialog}
					/>
				);
			}

			return (
				<div className='skirmish'>
					<Toaster
						position='bottom-right'
						toastOptions={{
							duration: 5 * 1000
						}}
					/>
					{this.getContent()}
					{dialog}
				</div>
			);
		} catch {
			return <div className='skirmish render-error' />;
		}
	};

	//#endregion
}
