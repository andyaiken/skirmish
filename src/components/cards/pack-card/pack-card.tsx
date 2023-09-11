import { Component, MouseEvent } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

import { CardType } from '../../../enums/card-type';

import type { PackModel } from '../../../models/pack';

import { PlayingCard } from '../../controls';

import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './pack-card.scss';

interface Props {
	pack: PackModel;
	disabled: boolean;
	onSelect: ((pack: PackModel) => void) | null;
	onRemove: ((pack: PackModel) => void) | null;
}

export class PackCard extends Component<Props> {
	static defaultProps = {
		disabled: false,
		onSelect: null,
		onRemove: null
	};

	onSelect = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onSelect) {
			this.props.onSelect(this.props.pack);
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
		if (this.props.onSelect) {
			buttons.push(
				<button key='select' className='icon-btn' title='Select' onClick={this.onSelect}><IconCheck /></button>
			);
		}
		if (this.props.onRemove) {
			buttons.push(
				<button key='retire' className='icon-btn' title='Retire' onClick={this.onRemove}><IconX /></button>
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
					/>
				}
				footerText='Pack'
				footerContent={buttons}
				disabled={this.props.disabled}
				onClick={this.props.onSelect ? this.onSelect : null}
			/>
		);
	};
}
