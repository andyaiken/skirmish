import { Component, MouseEvent } from 'react';
import { IconCheck } from '@tabler/icons-react';

import { BoonType } from '../../../enums/boon-type';
import { CardType } from '../../../enums/card-type';

import type { BoonModel } from '../../../models/boon';
import type { ItemModel } from '../../../models/item';

import { IconType, IconValue, PlayingCard, StatValue } from '../../controls';
import { ItemCard } from '../item-card/item-card';
import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './boon-card.scss';

interface Props {
	boon: BoonModel;
	onSelect: ((boon: BoonModel) => void) | null;
}

interface State {
	flipped: boolean;
}

export class BoonCard extends Component<Props, State> {
	static defaultProps = {
		onSelect: null
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

	onSelect = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onSelect) {
			this.props.onSelect(this.props.boon);
		}
	};

	onSelectItem = (item: ItemModel) => {
		if (this.props.onSelect) {
			this.props.onSelect(this.props.boon);
		}
	};

	render = () => {
		if (this.props.boon.type === BoonType.MagicItem) {
			return (
				<ItemCard
					item={this.props.boon.data as ItemModel}
					onSelect={this.props.onSelect ? this.onSelectItem : null}
				/>
			);
		}

		let desc = '';
		let extra = null;
		switch (this.props.boon.type) {
			case BoonType.ExtraHero:
				desc = 'Gain an empty hero slot.';
				break;
			case BoonType.ExtraXP:
				desc = 'Choose one of your heroes to gain bonus XP.';
				extra = <StatValue orientation='vertical' label='XP' value={<IconValue type={IconType.XP} value={this.props.boon.data as number} />} />;
				break;
			case BoonType.LevelUp:
				desc = 'Choose one of your heroes to level up.';
				break;
			case BoonType.Money:
				extra = <StatValue orientation='vertical' label='Money' value={<IconValue type={IconType.Money} value={this.props.boon.data as number} />} />;
				break;
		}

		const buttons: JSX.Element[] = [];
		if (this.props.onSelect && (buttons.length > 0)) {
			buttons.push(
				<button key='select' className='icon-btn' onClick={this.onSelect}><IconCheck /></button>
			);
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
				footerContent={buttons}
				flipped={this.state.flipped}
				onClick={this.props.onSelect ? this.onSelect : null}
			/>
		);
	};
}
