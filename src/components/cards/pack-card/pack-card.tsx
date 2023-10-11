import { Component, MouseEvent } from 'react';
import { IconX } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import { PackLogic } from '../../../logic/pack-logic';

import type { PackModel } from '../../../models/pack';

import { PlayingCard, StatValue } from '../../controls';

import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './pack-card.scss';

interface Props {
	pack: PackModel;
	disabled: boolean;
	onClick: ((pack: PackModel) => void) | null;
	onRemove: ((pack: PackModel) => void) | null;
}

export class PackCard extends Component<Props> {
	static defaultProps = {
		disabled: false,
		onClick: null,
		onRemove: null
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.pack);
		}
	};

	onRemove = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onRemove) {
			this.props.onRemove(this.props.pack);
		}
	};

	render = () => {
		const buttons: JSX.Element[] = [];
		if (this.props.onRemove) {
			buttons.push(
				<button key='retire' className='icon-btn' title='Remove' onClick={this.onRemove}><IconX /></button>
			);
		}

		let content = null;
		if (this.props.pack.id) {
			content = (
				<div className='pack-card-front'>
					<StatValue label='Cards' value={PackLogic.getPackCardCount(this.props.pack.id)} />
				</div>
			);
		}

		return (
			<PlayingCard
				type={CardType.Pack}
				stack={true}
				front={
					<PlaceholderCard
						text={this.props.pack.name}
						subtext={this.props.pack.description}
						content={content}
					/>
				}
				footerText='Pack'
				footerContent={buttons}
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
