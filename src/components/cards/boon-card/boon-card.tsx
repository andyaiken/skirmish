import { Component, MouseEvent } from 'react';

import { BoonType } from '../../../enums/boon-type';
import { CardType } from '../../../enums/card-type';

import type { BoonModel } from '../../../models/boon';
import type { ItemModel } from '../../../models/item';

import { IconSize, IconType, IconValue, PlayingCard } from '../../controls';
import { ItemCard } from '../item-card/item-card';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './boon-card.scss';

interface Props {
	boon: BoonModel;
	disabled: boolean;
	onClick: ((boon: BoonModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class BoonCard extends Component<Props, State> {
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
			this.props.onClick(this.props.boon);
		}
	};

	onSelectItem = (item: ItemModel) => {
		if (this.props.onClick) {
			this.props.onClick(this.props.boon);
		}
	};

	render = () => {
		if (this.props.boon.type === BoonType.MagicItem) {
			return (
				<ItemCard
					item={this.props.boon.data as ItemModel}
					onClick={this.props.onClick ? this.onSelectItem : null}
				/>
			);
		}

		let desc = '';
		let extra = null;
		switch (this.props.boon.type) {
			case BoonType.ExtraHero:
				desc = 'Recruit an additional hero.';
				break;
			case BoonType.ExtraXP:
				desc = 'Choose one of your heroes to gain bonus XP.';
				extra = <IconValue type={IconType.XP} value={this.props.boon.data as number} size={IconSize.Large} />;
				break;
			case BoonType.LevelUp:
				desc = 'Choose one of your heroes to level up.';
				break;
			case BoonType.Money:
				extra = <IconValue type={IconType.Money} value={this.props.boon.data as number} size={IconSize.Large} />;
				break;
			case BoonType.EnchantItem:
				extra = 'Enchant one of your items.';
				break;
		}

		return (
			<PlayingCard
				type={CardType.Boon}
				front={(
					<PlaceholderCard
						text={this.props.boon.type}
						subtext={desc}
						content={(
							<div className='boon-card-front'>
								{extra ? <div className='extra'>{extra}</div> : null}
							</div>
						)}
					/>
				)}
				footerText='Reward'
				flipped={this.state.flipped}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
