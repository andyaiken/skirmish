import { Component, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { BoonType } from '../../enums/boon-type';
import { CombatantState } from '../../enums/combatant-state';
import { CombatantType } from '../../enums/combatant-type';
import { EncounterState } from '../../enums/encounter-state';
import { FeatureType } from '../../enums/feature-type';
import { OrientationType } from '../../enums/orientation-type';
import { PageType } from '../../enums/page-type';
import { ScreenType } from '../../enums/screen-type';
import { StructureType } from '../../enums/structure-type';

import { CampaignMapGenerator } from '../../generators/campaign-map/campaign-map-generator';
import { EncounterGenerator } from '../../generators/encounter/encounter-generator';
import { EncounterMapGenerator } from '../../generators/encounter-map/encounter-map-generator';

import { CampaignMapLogic } from '../../logic/campaign-map/campaign-map-logic';
import { CombatantLogic } from '../../logic/combatant/combatant-logic';
import { ConditionLogic } from '../../logic/condition/condition-logic';
import { EncounterLogic } from '../../logic/encounter/encounter-logic';
import { EncounterMapLogic } from '../../logic/encounter-map/encounter-map-logic';
import { Factory } from '../../logic/factory/factory';
import { GameLogic } from '../../logic/game/game-logic';
import { IntentsLogic } from '../../logic/intents/intents-logic';
import { PackLogic } from '../../logic/pack/pack-logic';
import { StrongholdLogic } from '../../logic/stronghold/stronghold-logic';

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

import type { CloudAdoptionReason, CloudCampaignModel, CloudConflictModel } from '../../platform/cloud-sync';
import type { Platform } from '../../platform/platform';

import { Collections } from '../../utils/collections/collections';
import { Sound } from '../../utils/sound/sound';
import { Utils } from '../../utils/utils/utils';

import { BackstageScreen, CampaignScreen, EncounterScreen, LandingScreen, SetupScreen } from '../screens';
import { Dialog, ErrorBoundary, PlayingCard, Text, TextType } from '../controls';
import { HelpModal, PacksModal } from '../modals';
import { PlaceholderCard } from '../cards';

import './main.scss';

import encounters from '../../assets/docs/encounters.md';
import island from '../../assets/docs/island.md';
import items from '../../assets/docs/items.md';
import landing from '../../assets/docs/landing.md';
import setup from '../../assets/docs/setup.md';
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
	dialog: ReactNode | null;
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
		// Prices land after the first render, so this pulls the packs modal back through
		// render once they are known.
		this.props.platform.onStoreUpdated = () => this.forceUpdate();
		// StoreKit can also hand us a purchase we never asked for - an Ask to Buy approved
		// later, or a buy made on another device.
		this.props.platform.onOwnershipChanged = packIDs => this.setOwnedPacks(packIDs);
		// The campaign can arrive from, or be contested by, the player's other devices
		this.props.platform.onCloudAdopted = (game, deviceName, reason) => this.adoptCloudCampaign(game, deviceName, reason);
		this.props.platform.onCloudConflict = conflict => this.showCloudConflict(conflict);

		Sound.volume = this.state.options.soundEffectsVolume;
	}

	componentDidMount = () => {
		this.props.platform.loadStore(PackLogic.getExpansionPacks().map(p => p.id));
		this.props.platform.syncOwnedPacks(this.state.options);
		this.props.platform.startCloudSync();

		fetch(encounters).then(response => response.text()).then(text => {
			rules['encounters'] = text;
		});
		fetch(island).then(response => response.text()).then(text => {
			rules['island'] = text;
		});
		fetch(items).then(response => response.text()).then(text => {
			rules['items'] = text;
		});
		fetch(landing).then(response => response.text()).then(text => {
			rules['landing'] = text;
		});
		fetch(setup).then(response => response.text()).then(text => {
			rules['setup'] = text;
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

	setReduceMotion = (value: boolean) => {
		const options = this.state.options;
		options.reduceMotion = value;

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

	getPackPrice = (pack: PackModel) => {
		return this.props.platform.getPackPrice(pack);
	};

	// Both buying and restoring hand back the full set of packs the player owns, so the
	// result replaces packIDs rather than being merged into it - a restore on a fresh
	// install has to be able to fill an empty list, and a refund has to empty it again.
	setOwnedPacks = (packIDs: string[]) => {
		const options = this.state.options;
		options.packIDs = Collections.distinct(packIDs, id => id).sort();

		this.setState({
			options: options
		}, () => {
			this.saveOptions();
		});
	};

	addPacks = (packs: PackModel[]) => {
		this.props.platform
			.getPacks(packs)
			.then(this.setOwnedPacks)
			.catch(ex => this.handlePurchaseError(ex));
	};

	restorePurchases = () => {
		this.props.platform
			.restorePurchases()
			.then(this.setOwnedPacks)
			.catch(ex => this.handlePurchaseError(ex));
	};

	// The store rejects for three quite different reasons and only one of them is a fault.
	handlePurchaseError = (ex: unknown) => {
		const code = (ex as { code?: string }).code;

		if (code === 'cancelled') {
			// The player backed out of the payment sheet. They know what they did; saying
			// anything here would be telling them off for changing their mind.
			return;
		}

		if (code === 'pending') {
			// Ask to Buy, or a payment method needing action elsewhere. Approval can take
			// hours, and the transaction listener adds the pack whenever it arrives - so
			// this has to read as 'waiting', not 'failed'.
			this.showNotification('Waiting for approval. The pack will appear here once it is approved.');
			return;
		}

		this.logException(ex);
		this.showNotification(ex instanceof Error ? ex.message : 'That did not work. Nothing has been charged.');
	};

	showNotification = (message: string) => {
		toast.custom(t => (
			<div key={t.id} className='skirmish-notification' onClick={() => toast.remove(t.id)}>
				{message}
			</div>
		));
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

	//#region Syncing between devices

	adoptCloudCampaign = (game: GameModel | null, deviceName: string, reason: CloudAdoptionReason) => {
		try {
			// A campaign taken from another device can replace the one under whatever screen is
			// showing, so play resumes from the landing screen. A later save from a device already
			// being followed updates in place, unless the screen can no longer show it. Hero setup
			// is left alone: nothing there is saved yet, so leaving it would lose the player's work.
			const stale = ((this.props.screen === ScreenType.Encounter) && !game?.encounter)
				|| ((this.props.screen === ScreenType.Campaign) && !game);
			const busy = (this.props.screen === ScreenType.Setup) || (this.props.screen === ScreenType.Backstage);
			if (!busy && ((reason !== 'following') || stale)) {
				this.props.setScreen(ScreenType.Landing);
			}

			const ended = !game && !!this.state.game;

			this.setState({
				game: game
			});

			// Said once, when another device picks up the campaign, rather than on every save - but
			// an ending is always said, since it takes the player off whatever they were looking at
			if ((reason === 'carried-on') || (ended && (reason === 'following'))) {
				this.showNotification(game ? `Picked up your campaign from your ${deviceName}.` : `Your campaign was ended on your ${deviceName}.`);
			}
		} catch (ex) {
			this.logException(ex);
		}
	};

	showCloudConflict = (conflict: CloudConflictModel) => {
		try {
			// No way to close this without choosing: until the player does, neither campaign is
			// uploaded, and guessing would lose one of them
			this.setState({
				dialog: (
					<div>
						<Text type={TextType.Heading}>Which Campaign?</Text>
						<Text type={TextType.SubHeading}>Your campaign has been played on two devices while they were out of touch.</Text>
						<Text>Choose the one to carry on with. It will replace the other on all of your devices.</Text>
						<div className='card-options'>
							<PlayingCard
								front={<PlaceholderCard text={`This ${conflict.local.deviceName}`} subtext={this.getSavedWhen(conflict.local)} content={this.getCampaignSummary(conflict.local)} />}
								onClick={() => this.resolveCloudConflict(true)}
							/>
							<PlayingCard
								front={<PlaceholderCard text={`Your ${conflict.cloud.deviceName}`} subtext={this.getSavedWhen(conflict.cloud)} content={this.getCampaignSummary(conflict.cloud)} />}
								onClick={() => this.resolveCloudConflict(false)}
							/>
						</div>
					</div>
				)
			});
		} catch (ex) {
			this.logException(ex);
		}
	};

	resolveCloudConflict = (keepThisDevice: boolean) => {
		this.setState({
			dialog: null
		}, () => {
			(keepThisDevice ? this.props.platform.keepThisDeviceCampaign() : this.props.platform.keepCloudCampaign())
				.catch(ex => this.logException(ex));
		});
	};

	getSavedWhen = (campaign: CloudCampaignModel) => {
		// A campaign from before syncing has no recorded time
		if (campaign.savedAt === null) {
			return 'Saved on this device';
		}

		return `Saved ${new Date(campaign.savedAt).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`;
	};

	getCampaignSummary = (campaign: CloudCampaignModel) => {
		if (!campaign.game) {
			return <div className='cloud-campaign-summary'>No campaign in progress</div>;
		}

		const squares = campaign.game.map.squares;
		const controlled = squares.length > 0 ? Math.floor(100 * squares.filter(sq => sq.regionID === '').length / squares.length) : 0;
		const heroes = campaign.game.heroes.length;

		return (
			<div className='cloud-campaign-summary'>
				<div>{controlled}% of the island</div>
				<div>{heroes} {heroes === 1 ? 'hero' : 'heroes'}</div>
				{campaign.game.encounter ? <div>Mid-encounter</div> : null}
			</div>
		);
	};

	//#endregion

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
			// Switch screen in the same batch as the state change; if we did it afterwards,
			// the campaign screen would be rendered once with no game to show
			this.props.setScreen(ScreenType.Landing);

			this.setState({
				game: null,
				showHelp: null,
				showPacks: false,
				dialog: null
			}, () => {
				this.saveGame();
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

			StrongholdLogic.addStructure(game, structure);

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

	chargeStructure = (structure: StructureModel, useTavern: boolean) => {
		try {
			const game = this.state.game as GameModel;

			if (useTavern) {
				// The Tavern does the work instead of the money
				StrongholdLogic.spendCharge(game, StructureType.Tavern, 1);
			} else {
				game.money = Math.max(0, game.money - 100);
			}

			StrongholdLogic.rechargeStructure(structure);

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

	spendCharge = (type: StructureType, count: number) => {
		try {
			const game = this.state.game as GameModel;

			StrongholdLogic.spendCharge(game, type, count);

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

	addXP = (hero: CombatantModel, spendCharge: StructureType | null) => {
		try {
			const game = this.state.game as GameModel;

			hero.xp += 1;

			if (spendCharge) {
				StrongholdLogic.spendCharge(game, spendCharge, 1);
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

			// Add magic items, potions and scrolls. The retire dialog only offers the button when
			// there is room for all of these, so nothing is turned away here.
			GameLogic.addItemsToGame(game, ([] as ItemModel[])
				.concat(hero.items)
				.concat(hero.carried)
				.filter(i => i.magic || i.potion || i.scroll));

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

			// A magic item boon would bring something home, so it keeps until there is room
			// for it - redeeming it into full stores would spend the boon for nothing.
			if ((boon.type === BoonType.MagicItem) && GameLogic.storesAreFull(game)) {
				return;
			}

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
								h.carried[n] = upgrade;
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
					StrongholdLogic.addStructure(game, boon.data as StructureModel);
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

	buyItem = (item: ItemModel, free = false) => {
		try {
			const game = this.state.game as GameModel;

			// The shop buttons are disabled when the stores are full; this is the backstop, and
			// it runs before any money changes hands.
			if (GameLogic.storesAreFull(game)) {
				return;
			}

			game.items.push(item);

			if (!free) {
				game.money = Math.max(0, game.money - StrongholdLogic.getItemPrice(game, item));
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

	sellItem = (item: ItemModel, all: boolean) => {
		try {
			const sell = (item: ItemModel) => {
				game.items = game.items.filter(i => i !== item);

				game.money += StrongholdLogic.getSalePrice(item);
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

				// A region that doesn't border your land was reached by sea, which costs a Shipyard
				// charge per attack - conquering it outright may take several voyages
				if (!CampaignMapLogic.isAdjacentToTerritory(game.map, region) && !this.state.options.developer) {
					StrongholdLogic.spendCharge(game, StructureType.Shipyard, 1);
				}

				heroes.forEach(h => CombatantLogic.resetCombatant(h));
				game.heroes = game.heroes.filter(h => !heroes.includes(h));
				game.encounter = EncounterGenerator.createEncounter(region, heroes, this.state.options.packIDs);

				for (let n = 0; n < benefits; ++n) {
					const hero = Collections.draw(game.encounter.combatants.filter(c => c.faction === CombatantType.Hero));
					hero.combat.conditions.push(ConditionLogic.createRandomBeneficialCondition() as ConditionModel);
				}
				if (!this.state.options.developer) {
					StrongholdLogic.spendCharge(game, StructureType.Temple, benefits);
				}

				for (let n = 0; n < detriments; ++n) {
					const hero = Collections.draw(game.encounter.combatants.filter(c => c.faction === CombatantType.Monster));
					hero.combat.conditions.push(ConditionLogic.createRandomDetrimentalCondition() as ConditionModel);
				}
				if (!this.state.options.developer) {
					StrongholdLogic.spendCharge(game, StructureType.Intelligencer, detriments);
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
				// Read before the encounters are consumed below, or every hero earns nothing.
				const encounterCount = region.encounters.length;

				// Fight through everything the region still holds, so conquering it from the map
				// is worth what playing it would have been. Each encounter is built from the seed
				// the real one would have used, which is why the seeds are taken one at a time
				// exactly as winning them does.
				while (region.encounters.length > 0) {
					// The heroes are copied because the generator places combatants on its map, and
					// positioning the real ones would leave them standing in a battle that never
					// happened. Levels still scale the monsters, since the copies carry them.
					const heroes = JSON.parse(JSON.stringify(game.heroes)) as CombatantModel[];
					const encounter = EncounterGenerator.createEncounter(region, heroes, this.state.options.packIDs);

					// Killing them is what rolls their money, so this has to happen before the
					// piles are collected.
					EncounterLogic.defeatStandingMonsters(encounter);

					// The piles now hold what the map was generated with as well as what the
					// monsters dropped. Whatever is still on a monster - a boss's magic item among
					// it - comes across separately, exactly as an ordinary victory collects it.
					const spoils: ItemModel[] = [];
					encounter.loot.forEach(lp => {
						spoils.push(...lp.items);
						game.money += lp.money;
					});
					encounter.combatants
						.filter(c => (c.type === CombatantType.Monster) && (c.faction === CombatantType.Monster))
						.forEach(c => {
							spoils.push(...c.items);
							spoils.push(...c.carried);
						});
					// Held to the same limit as winning the encounter by hand
					GameLogic.addItemsToGame(game, spoils);

					region.encounters.splice(0, 1);
				}

				// Read while the region is still on the map, as the ordinary path does.
				game.money += StrongholdLogic.getConquestIncome(game, region);
				CampaignMapLogic.conquerRegion(game.map, region);
				game.heroes.forEach(h => h.xp += encounterCount);
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

	getVictoryDialog = () => {
		return (
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
	};

	purchaseRegion = (region: RegionModel) => {
		try {
			if (this.state.game) {
				const game = this.state.game;

				// Price the region before conquering it, while it's still on the map, and note what a
				// Counting House would make of it
				game.money = Math.max(0, game.money - CampaignMapLogic.getPurchasePrice(game, region));
				const income = StrongholdLogic.getConquestIncome(game, region);

				if (!this.state.options.developer) {
					// As with an attack, getting to a region across the water costs a Shipyard charge
					if (!CampaignMapLogic.isAdjacentToTerritory(game.map, region)) {
						StrongholdLogic.spendCharge(game, StructureType.Shipyard, 1);
					}

					// The guilds don't broker a sale for nothing; the discount is already in the price
					StrongholdLogic.spendCharge(game, StructureType.Guildhall, 1);
				}

				CampaignMapLogic.conquerRegion(game.map, region);

				// The boon and the hero slot are awarded exactly as for a conquest, but no XP -
				// nobody fought for this one
				let dialogContent = null;
				if (CampaignMapLogic.isConquered(game.map)) {
					dialogContent = this.getVictoryDialog();
				} else {
					game.heroSlots += 1;
					game.boons.push(region.boon);
					game.money += income;
				}

				this.setState({
					game: game,
					dialog: dialogContent
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

			const region = game.map.regions.find(r => r.id === encounter.regionID);
			encounter.mapSquares = EncounterMapGenerator.generateEncounterMap(Math.random, region ? region.demographics.terrain : '');

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

	addCombatantToEncounter = (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => {
		try {
			const game = this.state.game as GameModel;

			if (combatant.type === CombatantType.Hero) {
				game.heroes = game.heroes.filter(h => h.id !== combatant.id);
			}

			CombatantLogic.resetCombatant(combatant);
			encounter.combatants.push(combatant);
			EncounterGenerator.placeCombatants(encounter, Math.random);

			if (spendCharge) {
				StrongholdLogic.spendCharge(game, spendCharge, 1);
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

	treatWounds = (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => {
		try {
			EncounterLogic.treatWounds(encounter, combatant);

			if (spendCharge) {
				StrongholdLogic.spendCharge(this.state.game as GameModel, spendCharge, 1);
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

	drawActions = (encounter: EncounterModel, combatant: CombatantModel, spendCharge: StructureType | null) => {
		try {
			EncounterLogic.drawActions(encounter, combatant);

			if (spendCharge) {
				StrongholdLogic.spendCharge(this.state.game as GameModel, spendCharge, 1);
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

	// A monster's turn is played out over a series of timeouts; keep hold of the
	// pending one so that it can be cancelled if the encounter ends first.
	monsterTurnTimeout: ReturnType<typeof setTimeout> | null = null;

	cancelMonsterTurn = () => {
		if (this.monsterTurnTimeout !== null) {
			clearTimeout(this.monsterTurnTimeout);
			this.monsterTurnTimeout = null;
		}
	};

	runMonsterTurn = (encounter: EncounterModel, combatant: CombatantModel, onFinished: () => void) => {
		try {
			this.cancelMonsterTurn();

			if (combatant.combat.stunned || (combatant.combat.state === CombatantState.Unconscious) || (combatant.combat.state === CombatantState.Dead)) {
				// Can't act

				EncounterLogic.endTurn(encounter);

				this.setState({
					game: this.state.game
				}, () => {
					this.saveGame();
					onFinished();
				});
			} else {
				// Can act as normal

				const perform = () => {
					this.monsterTurnTimeout = null;

					// The encounter may have finished while this step was queued
					if (this.state.game?.encounter !== encounter) {
						onFinished();
						return;
					}

					combatant.combat.intents = IntentsLogic.getIntents(encounter, combatant);
					if (combatant.combat.intents && (combatant.combat.intents.intents.length > 0)) {
						IntentsLogic.performIntents(encounter, combatant);

						// Not saved here: the turn is saved when it ends, a step
						// later. Saving each step would write the whole game to
						// storage every 800ms for as long as the monsters are
						// acting, and losing a part-played turn costs nothing -
						// the monster simply takes it again from the beginning.
						this.setState({
							game: this.state.game
						}, () => {
							this.monsterTurnTimeout = setTimeout(perform, 800);
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

				this.monsterTurnTimeout = setTimeout(perform, 1000);
			}

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
				// Between encounters the item goes to the stores, so it stays where it is when
				// there is no room - better held by the hero than lost.
				if (GameLogic.storesAreFull(game)) {
					return;
				}

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
			this.cancelMonsterTurn();

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
					// Any monster still on its feet means the encounter was conceded rather than
					// fought out, and it has not dropped anything. Doing it here keeps a manual
					// win worth the same as a real one; in an ordinary victory every monster is
					// already down, so this finds nobody.
					EncounterLogic.defeatStandingMonsters(encounter);
					// Get equipment and money from loot piles, add to game items
					const spoils: ItemModel[] = [];
					encounter.loot.forEach(lp => {
						spoils.push(...lp.items);
						game.money += lp.money;
					});
					encounter.combatants
						.filter(c => (c.type === CombatantType.Monster) && (c.faction === CombatantType.Monster))
						.forEach(c => {
							spoils.push(...c.items);
							spoils.push(...c.carried);
						});
					// Coin always comes home; items only as far as there is room for them
					const leftBehind = GameLogic.addItemsToGame(game, spoils);
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
						// Read the income while the region is still on the map
						const income = StrongholdLogic.getConquestIncome(game, region);
						// Conquer the region
						CampaignMapLogic.conquerRegion(game.map, region);
						if (CampaignMapLogic.isConquered(game.map)) {
							// Show message
							dialogContent = this.getVictoryDialog();
						} else {
							// Add a new hero slot
							game.heroSlots += 1;
							// Add the region's boon
							game.boons.push(region.boon);
							// A Counting House starts collecting from the region
							game.money += income;
						}
					}
					// Say so rather than letting the loot quietly go missing - but not over the end
					// of the campaign, where the stores no longer matter
					if ((leftBehind.length > 0) && (dialogContent === null)) {
						dialogContent = (
							<div>
								<Text type={TextType.Heading}>Your Stores Are Full</Text>
								<Text type={TextType.SubHeading}>
									You left {leftBehind.length === 1 ? 'an item' : `${leftBehind.length} items`} behind in {region.name}.
								</Text>
								<Text>You can keep {GameLogic.maxItems} items. Sell something to make room for the next encounter.</Text>
							</div>
						);
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

			// Switch screen in the same batch as the state change; if we did it afterwards,
			// the encounter screen would be rendered once with no encounter to show
			this.props.setScreen(ScreenType.Campaign);

			this.setState({
				game: game,
				dialog: dialogContent
			}, () => {
				this.saveGame();
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
						showHelp={this.showHelp}
					/>
				);
			case ScreenType.Setup:
				return (
					<SetupScreen
						game={this.state.game as GameModel}
						options={this.state.options}
						orientation={this.props.orientation}
						addHero={this.addHero}
						equipItem={this.equipItem}
						unequipItem={this.unequipItem}
						pickUpItem={this.pickUpItem}
						dropItem={this.dropItem}
						showPacks={this.showPacks}
						showHelp={this.showHelp}
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
						spendCharge={this.spendCharge}
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
						purchaseRegion={this.purchaseRegion}
					/>
				);
			case ScreenType.Encounter:
				if (!this.state.game?.encounter) {
					// The encounter has finished; we're about to move to the campaign screen
					return null;
				}

				return (
					<EncounterScreen
						encounter={this.state.game.encounter}
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
						treatWounds={this.treatWounds}
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
						spendCharge={this.spendCharge}
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
							setReduceMotion={this.setReduceMotion}
							setSoundEffectsVolume={this.setSoundEffectsVolume}
							setRenderer={this.setRenderer}
							restorePurchases={this.restorePurchases}
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
			<div className={this.state.options.reduceMotion ? 'skirmish reduce-motion' : 'skirmish'}>
				<Toaster
					position='bottom-right'
					toastOptions={{
						duration: 5 * 1000
					}}
				/>
				<ErrorBoundary className='skirmish' onError={this.logException}>
					{this.getContent()}
				</ErrorBoundary>
				{dialog}
			</div>
		);
	};

	//#endregion
}
