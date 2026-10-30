import { Component } from 'react';

import { StructureType } from '../../../../enums/structure-type';

import { CampaignMapLogic } from '../../../../logic/campaign-map/campaign-map-logic';
import { OrientationLogic } from '../../../../logic/orientation/orientation-logic';
import { StrongholdLogic } from '../../../../logic/stronghold/stronghold-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { FeatureModel } from '../../../../models/feature';
import type { GameModel } from '../../../../models/game';
import type { ItemModel } from '../../../../models/item';
import type { LayoutModel } from '../../../../models/layout';
import type { OptionsModel } from '../../../../models/options';
import type { RegionModel } from '../../../../models/region';

import { Collections } from '../../../../utils/collections/collections';

import { BoonCard, RegionCard } from '../../../cards';
import { CardList, CollapsibleSidebar, Dialog, Expander, Gauge, IconSize, IconType, IconValue, PreviewableCard, StatValue, Text, TextType } from '../../../controls';
import { CampaignMapPanel } from '../../../panels';
import { EncounterStartModal } from '../../../modals';

import './campaign-map-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	layout: LayoutModel;
	startEncounter: (region: RegionModel, heroes: CombatantModel[], benefits: number, detriments: number) => void;
	regenerateCampaignMap: () => void;
	conquer: (region: RegionModel) => void;
	purchaseRegion: (region: RegionModel) => void;
	// Passed through to the hero cards in the Start an Encounter modal, so a hero's sheet
	// can be opened there while choosing who to send
	equipItem: (item: ItemModel, hero: CombatantModel) => void;
	unequipItem: (item: ItemModel, hero: CombatantModel) => void;
	pickUpItem: (item: ItemModel, hero: CombatantModel) => void;
	dropItem: (item: ItemModel, hero: CombatantModel) => void;
	levelUp: (feature: FeatureModel, hero: CombatantModel) => void;
	spendCharge: (type: StructureType, count: number) => void;
}

interface State {
	selectedRegion: RegionModel | null;
	showHeroSelection: boolean;
	// A region card and its reward card are small in the sidebar and both have backs worth
}

export class CampaignMapPage extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedRegion: null,
			showHeroSelection: false
		};
	}

	conquer = (region: RegionModel) => {
		this.setState({
			selectedRegion: null
		}, () => {
			this.props.conquer(region);
		});
	};

	purchase = (region: RegionModel) => {
		this.setState({
			selectedRegion: null
		}, () => {
			this.props.purchaseRegion(region);
		});
	};

	getSidebar = () => {
		if (this.state.selectedRegion) {
			const adjacent = CampaignMapLogic.isAdjacentToTerritory(this.props.game.map, this.state.selectedRegion);
			const bySea = !adjacent && CampaignMapLogic.canReachRegionBySea(this.props.game, this.state.selectedRegion);
			const coastal = CampaignMapLogic.isCoastal(this.props.game.map, this.state.selectedRegion);
			const canAttack = adjacent || bySea;
			const canPurchase = CampaignMapLogic.canPurchaseRegion(this.props.game, this.state.selectedRegion);
			const price = CampaignMapLogic.getPurchasePrice(this.props.game, this.state.selectedRegion);
			const guildhall = StrongholdLogic.getStructureCharges(this.props.game, StructureType.Guildhall) > 0;
			const heroesExist = this.props.game.heroes.length > 0;
			const encounters = this.state.selectedRegion.encounters.length > 1 ? `${this.state.selectedRegion.encounters.length} encounters` : '1 encounter';
			return (
				<div key={this.state.selectedRegion.id} className='sidebar'>
					<div className='sidebar-section'>
						<CardList
							cards={[
								<PreviewableCard
									key='region'
									card={<RegionCard map={this.props.game.map} region={this.state.selectedRegion} options={this.props.options} />}
								/>
							]}
						/>
					</div>
					<div className='sidebar-section'>
						{this.props.options.developer ? <button className='developer' onClick={() => this.conquer(this.state.selectedRegion as RegionModel)}>Conquer</button> : null}
						{
							canAttack ?
								null :
								<Text type={TextType.Information}>
									<p><b>You can&apos;t attack {this.state.selectedRegion.name}</b> because it&apos;s not adjacent to your land.</p>
									{
										coastal ?
											<p>It does have a coastline, so a <b>Shipyard</b> would let you reach it by sea.</p>
											: null
									}
								</Text>
						}
						{
							heroesExist ?
								null :
								<Text type={TextType.Information}>
									<p><b>You can&apos;t attack {this.state.selectedRegion.name}</b> because you don&apos;t have any heroes.</p>
								</Text>
						}
						{
							bySea ?
								<Text type={TextType.Information}>
									<p><b>{this.state.selectedRegion.name} lies across the water.</b> Reaching it will use a <b>Shipyard</b> charge, whether you attack it or buy it.</p>
								</Text>
								: null
						}
						{
							canAttack && heroesExist ?
								<>
									<Text>
										If you take control of <b>{this.state.selectedRegion.name}</b> (by winning <b>{encounters}</b>) you can recruit a new hero, and you will receive a reward.
									</Text>
									<button className='primary' onClick={() => this.setState({ showHeroSelection: true })}>Start an encounter</button>
								</>
								: null
						}
						{
							canAttack ?
								<>
									<Text>
										<p>
											You can also buy <b>{this.state.selectedRegion.name}</b> outright, which earns you the same reward without a fight.
										</p>
										<p>
											The price depends on how much of the region is left to conquer and on how many people live there; your most persuasive hero talks it down.
										</p>
										{
											guildhall ?
												<p>
													Your <b>Guildhall</b> has taken a quarter off the price shown. Buying the region will use one of its charges.
												</p>
												: null
										}
									</Text>
									<button disabled={!canPurchase} onClick={() => this.purchase(this.state.selectedRegion as RegionModel)}>
										<div>Buy this region</div>
										<IconValue type={IconType.Money} value={price} size={IconSize.Button} />
									</button>
								</>
								: null
						}
					</div>
					<div className='sidebar-section'>
						<CardList cards={[ <PreviewableCard key='boon' card={<BoonCard boon={this.state.selectedRegion.boon} />} /> ]} />
					</div>
				</div>
			);
		}

		const regions = Collections.distinct(this.props.game.map.squares.map(sq => sq.regionID).filter(id => id !== ''), id => id);
		const owned = this.props.game.map.squares.filter(sq => sq.regionID === '');
		const ownedFraction = owned.length / this.props.game.map.squares.length;
		const encounters = Collections.sum(this.props.game.map.regions, r => r.encounters.length);

		return (
			<div key='map' className='sidebar'>
				<div className='sidebar-section'>
					<Text type={TextType.SubHeading}>The Island</Text>
					<Text>
						<p>This is the map of the island.</p>
						<p>The white area is the part of the island that you control; from here you can attack any adjacent region.</p>
						<p>Select a region to learn more about it.</p>
					</Text>
					{this.props.options.developer ? <button className='developer' onClick={this.props.regenerateCampaignMap}>Regenerate Map</button> : null}
					{
						this.props.options.showTips ?
							<Expander
								header={
									<Text type={TextType.Tip}>To start an encounter, tap on a region on the island.</Text>
								}
								content={
									<div>
										<p>Encounters are the main way your heroes can gain XP (and level up).</p>
										<p>Each region has a certain number of encounters that must be won in order to conquer that region.</p>
										<p>Conquering a region will allow you to recruit a new hero, and will also provide an additional reward - often money or a magical item.</p>
										<p>You can only attack regions that border the land you already control (in white).</p>
										<p>If a region is proving too tough to fight through, you can buy it instead - though it will cost you a great deal more than fighting for it would.</p>
									</div>
								}
							/>
							: null
					}
				</div>
				<div className='sidebar-section'>
					<div className='map-stats'>
						<StatValue
							orientation='vertical'
							label='Island Controlled'
							value={<Gauge progress={ownedFraction} content={<b>{Math.floor(ownedFraction * 100)}%</b>} />}
						/>
					</div>
					<div className='map-stats'>
						<StatValue
							orientation='vertical'
							label='Regions Remaining'
							value={regions.length}
						/>
					</div>
					{
						encounters <= 100 ?
							<div className='map-stats'>
								<StatValue
									orientation='vertical'
									label='Encounters Remaining'
									value={encounters}
								/>
							</div>
							: null
					}
				</div>
			</div>
		);
	};

	getDialog = () => {
		if (!this.state.showHeroSelection) {
			return null;
		}

		return (
			<Dialog
				content={(
					<EncounterStartModal
						region={this.state.selectedRegion as RegionModel}
						game={this.props.game}
						options={this.props.options}
						startEncounter={this.props.startEncounter}
						equipItem={this.props.equipItem}
						unequipItem={this.props.unequipItem}
						pickUpItem={this.props.pickUpItem}
						dropItem={this.props.dropItem}
						levelUp={this.props.levelUp}
						spendCharge={this.props.spendCharge}
					/>
				)}
				onClose={() => {
					this.setState({
						showHeroSelection: false
					});
				}}
			/>
		);
	};

	render = () => {
		return (
			<div className={`campaign-map-page ${OrientationLogic.getClassName(this.props.layout.orientation)}`}>
				<div className='map-content' onClick={() => this.setState({ selectedRegion: null })}>
					<CampaignMapPanel
						map={this.props.game.map}
						options={this.props.options}
						zoomable={true}
						selectedRegion={this.state.selectedRegion}
						onSelectRegion={region => this.setState({ selectedRegion: region })}
					/>
				</div>
				<CollapsibleSidebar
					collapsible={!this.props.layout.roomForSidebarRow}
					summary={this.state.selectedRegion ? this.state.selectedRegion.name : 'The Island'}
					openFor={this.state.selectedRegion ? this.state.selectedRegion.id : null}
				>
					{this.getSidebar()}
				</CollapsibleSidebar>
				{this.getDialog()}
			</div>
		);
	};
}
