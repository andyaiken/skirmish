import { Component, MouseEvent } from 'react';

import { CardType } from '../../../enums/card-type';

import type { StructureModel } from '../../../models/structure';

import { PlayingCard, StatValue } from '../../controls';

import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './structure-card.scss';

interface Props {
	structure: StructureModel;
	disabled: boolean;
	onClick: ((structure: StructureModel) => void) | null;
}

export class StructureCard extends Component<Props> {
	static defaultProps = {
		disabled: false,
		onClick: null,
		onRemove: null
	};

	onClick = (e: MouseEvent) => {
		e.stopPropagation();

		if (this.props.onClick) {
			this.props.onClick(this.props.structure);
		}
	};

	render = () => {
		let content = null;
		if (this.props.structure.level > 1) {
			content = (
				<div className='structure-card-front'>
					<StatValue label='Level' value={this.props.structure.level} />
				</div>
			);
		}

		return (
			<PlayingCard
				type={CardType.Structure}
				front={
					<PlaceholderCard
						text={this.props.structure.name}
						subtext={this.props.structure.description}
						content={content}
					/>
				}
				footerText='Structure'
				disabled={this.props.disabled}
				onClick={this.props.onClick ? this.onClick : null}
			/>
		);
	};
}
