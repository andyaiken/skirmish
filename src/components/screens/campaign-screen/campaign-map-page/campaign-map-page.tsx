import { Component } from 'react';

import { CampaignMapLogic } from '../../../../logic/campaign-map-logic';

import type { CombatantModel } from '../../../../models/combatant';
import type { GameModel } from '../../../../models/game';
import type { RegionModel } from '../../../../models/region';

import { Collections } from '../../../../utils/collections';

import { BoonCard, RegionCard } from '../../../cards';
import { CampaignMapPanel, EncounterStartPanel } from '../../../panels';
import { Dialog, StatValue, Text, TextType } from '../../../controls';

import './campaign-map-page.scss';

interface Props {
	game: GameModel;
	developer: boolean;
	startEncounter: (region: RegionModel, heroes: CombatantModel[]) => void;
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
			const heroesExist = this.props.game.heroes.filter(h => h.name !== '').length > 0;
			return (
				<div className='sidebar'>
					<div className='card'>
						<RegionCard region={this.state.selectedRegion} />
					</div>
					<hr />
					{
						canAttack ?
							null :
							<Text type={TextType.Information}>
								<p>You can&apos;t attack {this.state.selectedRegion.name} because it&apos;s not on the coast or adjacent to your land.</p>
							</Text>
					}
					{
						heroesExist ?
							null :
							<Text type={TextType.Information}>
								<p>You can&apos;t attack {this.state.selectedRegion.name} because you don&apos;t have any heroes.</p>
							</Text>
					}
					{canAttack && heroesExist ? <button onClick={() => this.setState({ showHeroSelection: true })}>Start an encounter</button> : null}
					{this.props.developer ? <button className='developer' onClick={() => this.conquer(this.state.selectedRegion as RegionModel)}>Conquer</button> : null}
					<hr />
					<Text>If you take control of {this.state.selectedRegion.name}, you will recieve:</Text>
					<div className='boon'>
						<BoonCard boon={this.state.selectedRegion.boon} />
					</div>
				</div>
			);
		}

		const regions = Collections.distinct(this.props.game.map.squares.map(sq => sq.regionID).filter(id => id !== ''), id => id);
		const owned = this.props.game.map.squares.filter(sq => sq.regionID === '');
		return (
			<div className='sidebar'>
				<Text type={TextType.SubHeading}>The Island</Text>
				<Text>This is the map of the island. Select a region to learn more about it.</Text>
				<hr />
				<div className='map-stats'>
					<StatValue orientation='vertical' label='Regions' value={regions.length} />
					<StatValue orientation='vertical' label='Controlled' value={`${Math.floor(100 * owned.length / this.props.game.map.squares.length)}%`} />
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
					<EncounterStartPanel
						region={this.state.selectedRegion as RegionModel}
						game={this.props.game}
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
				<div className='campaign-map-page'>
					<div className='map-content' onClick={() => this.setState({ selectedRegion: null })}>
						<CampaignMapPanel
							map={this.props.game.map}
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
