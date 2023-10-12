import { IconCircleMinus, IconCirclePlus } from '@tabler/icons-react';
import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import { IconSize, IconType, IconValue, PlayingCard, StatValue, Text, TextType } from '../../controls';
import { PlaceholderCard } from '..';

import './stronghold-benefit-card.scss';

interface Props {
	label: string;
	available: number;
	used: number;
	developer: boolean;
	onRedraw: null | (() => void);
	onUse: null | (() => void);
	onChange: null | ((value: number) => void);
}

export class StrongholdBenefitCard extends Component<Props> {
	static defaultProps = {
		used: 0,
		onRedraw: null,
		onUse: null,
		onChange: null
	};

	onClick = () => {
		if (this.props.onRedraw) {
			this.props.onRedraw();
		}

		if (this.props.onUse) {
			this.props.onUse();
		}
	};

	onNudge = (delta: number) => {
		if (this.props.onChange) {
			this.props.onChange(this.props.used + delta);
		}
	};

	render = () => {
		try {
			let content = null;

			if (this.props.onRedraw) {
				content = (
					<IconValue
						type={IconType.Redraw}
						value={this.props.available}
						size={IconSize.Large}
					/>
				);
			}

			if (this.props.onUse) {
				content = (
					<StatValue
						orientation='vertical'
						label='Uses'
						value={this.props.available}
					/>
				);
			}

			if (this.props.onChange) {
				content = (
					<div className='spin'>
						<StatValue orientation='vertical' label='Available' value={this.props.developer ? this.props.available : this.props.available - this.props.used} />
						<div className='spin-buttons'>
							<button className='icon-btn' disabled={this.props.used === 0} onClick={() => this.onNudge(-1)}>
								<IconCircleMinus />
							</button>
							<StatValue orientation='vertical' label='Used' value={this.props.used} />
							<button className='icon-btn' disabled={(this.props.used === this.props.available) && !this.props.developer} onClick={() => this.onNudge(1)}>
								<IconCirclePlus />
							</button>
						</div>
					</div>
				);
			}

			return (
				<PlayingCard
					type={CardType.Structure}
					front={
						<PlaceholderCard
							content={
								<div className={this.props.developer ? 'stronghold-benefit-card developer' : 'stronghold-benefit-card'}>
									<Text type={TextType.SubHeading}>{this.props.label}</Text>
									{content}
								</div>
							}
						/>
					}
					footerText='Stronghold Benefit'
					onClick={this.onClick}
				/>
			);
		} catch {
			return <div className='stronghold-benefit-card render-error' />;
		}
	};
}
