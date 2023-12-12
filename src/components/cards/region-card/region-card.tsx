import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import { CampaignMapLogic } from '../../../logic/campaign-map-logic';

import type { CampaignMapModel } from '../../../models/campaign-map';
import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { PlayingCard, StatValue, Tag } from '../../controls';
import { CampaignMapPanel } from '../../panels';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './region-card.scss';

interface Props {
	map: CampaignMapModel;
	region: RegionModel;
	options: OptionsModel;
	disabled: boolean;
	onClick: ((region: RegionModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class RegionCard extends Component<Props, State> {
	static defaultProps = {
		disabled: false,
		onClick: null
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			flipped: false
		};
	}

	onFlip = (e: MouseEvent) => {
		e.stopPropagation();

		this.setState({
			flipped: !this.state.flipped
		});
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.region);
		}
	};

	render = () => {
		const monsters = CampaignMapLogic.getMonsters(this.props.region, this.props.options.packIDs)
			.map(species => species.name)
			.sort()
			.map((m, n) => <Tag key={n}>{m}</Tag>);


		const buttons: JSX.Element[] = [];
		buttons.push(
			<button key='flip' className='icon-btn' title='Flip' onClick={this.onFlip}><IconRefresh /></button>
		);

		return (
			<PlayingCard
				type={CardType.Region}
				front={(
					<PlaceholderCard
						text={this.props.region.name}
						content={(
							<div className='region-card-front'>
								<div className='map-container'>
									<CampaignMapPanel
										map={this.props.map}
										mode='region'
										selectedRegion={this.props.region}
									/>
								</div>
								<div className='stat-container'>
									<StatValue
										orientation='vertical'
										label={this.props.region.encounters.length === 1 ? 'Encounter' : 'Encounters'}
										value={this.props.region.encounters.length}
									/>
								</div>
							</div>
						)}
					/>
				)}
				back={(
					<div className='region-card-back'>
						<StatValue label='Population' value={`${this.props.region.demographics.population},000`} />
						<StatValue label='Area' value={`${this.props.region.demographics.size} sq mi`} />
						<StatValue label='Terrain' value={this.props.region.demographics.terrain} />
						<hr />
						<StatValue label='Denizens' value={monsters} />
					</div>
				)}
				footerText='Region'
				footerContent={buttons}
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : this.onFlip}
			/>
		);
	};
}
