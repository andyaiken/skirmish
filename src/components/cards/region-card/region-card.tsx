import { Component, MouseEvent } from 'react';
import { IconRefresh } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import { CampaignMapLogic } from '../../../logic/campaign-map-logic';

import type { OptionsModel } from '../../../models/options';
import type { RegionModel } from '../../../models/region';

import { Color } from '../../../utils/color';

import { PlayingCard, StatValue, Tag } from '../../controls';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './region-card.scss';

interface Props {
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
		let colorDark = this.props.region.color;
		let colorLight = this.props.region.color;
		const color = Color.parse(this.props.region.color);
		if (color) {
			colorDark = Color.toString(Color.darken(color));
			colorLight = Color.toString(Color.lighten(color));
		}

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
								<div
									className='color-box'
									style={{
										backgroundImage: `linear-gradient(135deg, ${colorLight}, ${this.props.region.color})`,
										borderColor: colorDark
									}}
								/>
								<StatValue orientation='vertical' label='Encounters' value={this.props.region.encounters.length} />
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
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
