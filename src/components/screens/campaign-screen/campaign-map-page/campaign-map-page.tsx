import { Component } from 'react';

import { OrientationType } from '../../../../enums/orientation-type';

import { CampaignMapLogic } from '../../../../logic/campaign-map-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { OptionsModel } from '../../../../models/options';
import type { RegionModel } from '../../../../models/region';

import { Collections } from '../../../../utils/collections';

import { BoonCard, RegionCard } from '../../../cards';
import { CardList, Dialog, Expander, Gauge, StatValue, Text, TextType } from '../../../controls';
import { CampaignMapPanel } from '../../../panels';
import { EncounterStartModal } from '../../../modals';

import './campaign-map-page.scss';

interface Props {
	game: GameModel;
	options: OptionsModel;
	orientation: OrientationType;
	startEncounter: (region: RegionModel, heroes: CombatantModel[], benefits: number, detriments: number) => void;
	regenerateCampaignMap: () => void;
	conquer: (region: RegionModel) => void;
}

interface State {
	selectedRegion: RegionModel | null;
	showHeroSelection: boolean;
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

	getSidebar = () => {
		if (this.state.selectedRegion) {
			const canAttack = CampaignMapLogic.canAttackRegion(this.props.game.map, this.state.selectedRegion);
			const heroesExist = this.props.game.heroes.length > 0;
			const encounters = this.state.selectedRegion.encounters.length > 1 ? `${this.state.selectedRegion.encounters.length} encounters` : '1 encounter';
			return (
				<div key={this.state.selectedRegion.id} className='sidebar'>
					<div className='sidebar-section'>
						{
							canAttack ?
								null :
								<Text type={TextType.Information}>
									<p><b>You can&apos;t attack {this.state.selectedRegion.name}</b> because it&apos;s not adjacent to your land.</p>
								</Text>
						}
						{
							heroesExist ?
								null :
								<Text type={TextType.Information}>
									<p><b>You can&apos;t attack {this.state.selectedRegion.name}</b> because you don&apos;t have any heroes.</p>
								</Text>
						}
						{canAttack && heroesExist ? <button className='primary' onClick={() => this.setState({ showHeroSelection: true })}>Start an encounter</button> : null}
						{this.props.options.developer ? <button className='developer' onClick={() => this.conquer(this.state.selectedRegion as RegionModel)}>Conquer</button> : null}
						<Text>
							If you take control of <b>{this.state.selectedRegion.name}</b> (by winning <b>{encounters}</b>) you can recruit a new hero, and you will receive a reward.
						</Text>
					</div>
					<div className='sidebar-section'>
						<CardList cards={[ <RegionCard key='region' map={this.props.game.map} region={this.state.selectedRegion} options={this.props.options} /> ]} />
					</div>
					<div className='sidebar-section'>
						<CardList cards={[ <BoonCard key='boon' boon={this.state.selectedRegion.boon} /> ]} />
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
		try {
			return (
				<div className={`campaign-map-page ${this.props.orientation}`}>
					<div className='map-content' onClick={() => this.setState({ selectedRegion: null })}>
						<CampaignMapPanel
							map={this.props.game.map}
							options={this.props.options}
							selectedRegion={this.state.selectedRegion}
							onSelectRegion={region => this.setState({ selectedRegion: region })}
						/>
					</div>
					{this.getSidebar()}
					{this.getDialog()}
				</div>
			);
		} catch {
			return <div className='campaign-map-page render-error' />;
		}
	};
}
