import { Component, ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { CombatantType } from '../../enums/combatant-type';
import { EncounterState } from '../../enums/encounter-state';
import { PageType } from '../../enums/page-type';
import { ScreenType } from '../../enums/screen-type';
import { StructureType } from '../../enums/structure-type';

import { CampaignMapGenerator } from '../../generators/campaign-map/campaign-map-generator';
import { EncounterGenerator } from '../../generators/encounter/encounter-generator';
import { EncounterMapGenerator } from '../../generators/encounter-map/encounter-map-generator';

import { CampaignLogic } from '../../logic/campaign/campaign-logic';
import { CombatantLogic } from '../../logic/combatant/combatant-logic';
import { EncounterLogic } from '../../logic/encounter/encounter-logic';
import { EncounterMapLogic } from '../../logic/encounter-map/encounter-map-logic';
import { Factory } from '../../logic/factory/factory';
import { GameLogic } from '../../logic/game/game-logic';
import { IntentsLogic } from '../../logic/intents/intents-logic';
import { OrientationLogic } from '../../logic/orientation/orientation-logic';
import { PackLogic } from '../../logic/pack/pack-logic';
import { StrongholdLogic } from '../../logic/stronghold/stronghold-logic';

import type { ActionModel, ActionParameterModel } from '../../models/action';
import type { BoonModel } from '../../models/boon';
import type { CombatantModel } from '../../models/combatant';
import type { EncounterModel } from '../../models/encounter';
import type { FeatureModel } from '../../models/feature';
import type { GameModel } from '../../models/game';
import type { ItemModel } from '../../models/item';
import type { LayoutModel } from '../../models/layout';
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
	layout: LayoutModel;
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

		// Seeded from the platform rather than from props: props carry the campaign as it was
		// when the app started, and this component can be remounted mid-game - a device
		// rotating does it - at which point the props would be stale. The platform holds what
		// is current. See Platform.setGame.
		this.state = {
			game: props.platform.getGame() ?? props.game,
			options: props.platform.getOptions() ?? props.options,
			showHelp: null,
			showPacks: false,
			dialog: null,
			exceptions: []
		};

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

	// Every change to the campaign or the settings is handed straight back to the platform,
	// which owns them, saves them and syncs them. Doing it here rather than at each of the
	// places that change them means none can be forgotten, and it runs before the setState
	// callbacks that trigger a save.
	componentDidUpdate = () => {
		this.props.platform.setGame(this.state.game);
		this.props.platform.setOptions(this.state.options);
	};

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
		return this.props.platform
			.restorePurchases()
			.then(packIDs => {
				this.setOwnedPacks(packIDs);
				const count = packIDs.length;
				this.showNotification(count === 0 ? 'There are no purchases on this Apple Account to restore.' : `Restored ${count} ${count === 1 ? 'pack' : 'packs'}.`);
			})
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

			// A campaign taken up is said once, when another device picks it up, rather than on every
			// save. An ending is said whenever it takes a campaign away - but not to a device that
			// had none, such as a fresh install, where there is nothing to have ended.
			if (game && (reason === 'carried-on')) {
				this.showNotification(`Picked up your campaign from your ${deviceName}.`);
			}
			if (ended && (reason !== 'chosen')) {
				this.showNotification(`Your campaign was ended on your ${deviceName}.`);
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
			GameLogic.startNextIsland(game, currentGame);

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
			GameLogic.restartCampaign(game);

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

			StrongholdLogic.buyStructure(game, structure, cost);

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

			StrongholdLogic.sellStructure(game, structure);

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

			StrongholdLogic.chargeStructure(game, structure, useTavern);

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

			StrongholdLogic.upgradeStructure(game, structure);

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

			GameLogic.addXP(game, hero, spendCharge);

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

			GameLogic.retireHero(game, hero);

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

			GameLogic.redeemBoon(game, boon, hero, item, newItem, cost);

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

			GameLogic.buyItem(game, item, free);

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
			const game = this.state.game as GameModel;

			GameLogic.sellItem(game, item, all);

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
				CampaignLogic.startEncounter(game, region, heroes, benefits, detriments, this.state.options.packIDs, this.state.options.developer, EncounterGenerator.createEncounter);

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
				CampaignLogic.conquerRegion(game, region, this.state.options.packIDs, EncounterGenerator.createEncounter);

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
				const conquered = CampaignLogic.purchaseRegion(game, region, this.state.options.developer);

				this.setState({
					game: game,
					dialog: conquered ? this.getVictoryDialog() : null
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
			EncounterLogic.rotate(encounter, dir);

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
			EncounterLogic.rollInitiativeAndStart(encounter);

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

			EncounterLogic.clearPositions(encounter);

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
			EncounterLogic.addMovement(combatant, value);

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

			if (!EncounterLogic.canMonsterAct(combatant)) {
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

			CampaignLogic.equipItem(game, item, combatant);

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

			CampaignLogic.unequipItem(game, item, combatant);

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

			CampaignLogic.pickUpItem(game, item, combatant);

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

			CampaignLogic.dropItem(game, item, combatant);

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

			const result = CampaignLogic.finishEncounter(game, state);
			if (!result) {
				return;
			}

			let dialogContent = null;
			if (result.islandConquered) {
				dialogContent = this.getVictoryDialog();
			} else if (result.leftBehind.length > 0) {
				// Say so rather than letting the loot quietly go missing
				const left = result.leftBehind.length;
				dialogContent = (
					<div>
						<Text type={TextType.Heading}>Your Stores Are Full</Text>
						<Text type={TextType.SubHeading}>
							You left {left === 1 ? 'an item' : `${left} items`} behind in {result.region.name}.
						</Text>
						<Text>You can keep {GameLogic.maxItems} items. Sell something to make room for the next encounter.</Text>
					</div>
				);
			} else if (result.noHeroesRemain) {
				dialogContent = (
					<div>
						<Text type={TextType.Heading}>Defeat</Text>
						<Text type={TextType.SubHeading}>You lost the encounter in {result.region.name}, and have no more heroes.</Text>
						<Text>You can either continue your campaign with a new group of heroes, or abandon it.</Text>
						<div className='card-options'>
							<PlayingCard front={<PlaceholderCard text='Continue' />} onClick={() => this.restartCampaign()} />
							<PlayingCard front={<PlaceholderCard text='Abandon' />} onClick={() => this.endCampaign()} />
						</div>
					</div>
				);
			}

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

			EncounterLogic.incrementMonsterLevel(game.encounter as EncounterModel, combatant, this.props.options.packIDs);

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

			EncounterLogic.switchAllegiance(game.encounter as EncounterModel, combatant);

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

			EncounterLogic.toggleStun(combatant);

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

			EncounterLogic.nudgeInitiative(encounter, combatant, delta);

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
						layout={this.props.layout}
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
						layout={this.props.layout}
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
						layout={this.props.layout}
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
						layout={this.props.layout}
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

		const small = OrientationLogic.isSmall(this.props.layout.orientation);

		return (
			<div className={this.state.options.reduceMotion ? 'skirmish reduce-motion' : 'skirmish'}>
				<Toaster
					// Bottom right is empty space on a roomy screen, and the one place a
					// notification is in the way on a small one: the bottom edge there is given
					// over to controls across its whole width - the encounter screen's toolbar and
					// turn bar, a campaign page's sheet handle - and a notification landed on top
					// of them for its five seconds. The top of a small screen is the map, which is
					// a better thing to cover than the buttons being used.
					position={small ? 'top-center' : 'bottom-right'}
					// The toaster is fixed to the window and pins itself 16px off each edge, so it
					// knows nothing about the strips the screen keeps for the home indicator and
					// the camera housing: measured on a phone, a notification sat inside one or
					// the other at both ends. Its own 16 where there is no strip, the strip where
					// there is one, so nothing changes on a screen that has neither.
					containerStyle={{
						top: 'max(16px, var(--top-inset))',
						bottom: 'max(16px, var(--bottom-inset))'
					}}
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
