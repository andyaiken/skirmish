import { Component } from 'react';

import { CardType } from '../../../enums/card-type';

import type { PackModel } from '../../../models/pack';

import { PlayingCard } from '../../controls';

import { PlaceholderCard } from '../placeholder-card/placeholder-card';

import './pack-card.scss';

interface Props {
	pack: PackModel;
	disabled: boolean;
}

export class PackCard extends Component<Props> {
	static defaultProps = {
		disabled: false
	};

	render = () => {
		return (
			<PlayingCard
				type={CardType.Default}
				stack={true}
				front={
					<PlaceholderCard
						text={this.props.pack.name}
						subtext={this.props.pack.description}
					/>
				}
				footerText='Pack'
				disabled={this.props.disabled}
			/>
		);
	};
}
