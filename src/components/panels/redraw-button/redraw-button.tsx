import { Component } from 'react';

import { IconSize, IconType, IconValue, PlayingCard, Text, TextType } from '../../controls';
import { PlaceholderCard } from '../../cards';

import './redraw-button.scss';

interface Props {
	value: number;
	developer: boolean;
	onClick: () => void;
}

export class RedrawButton extends Component<Props> {
	render = () => {
		try {
			let content = null;
			if (this.props.value > 0) {
				content = (
					<IconValue
						type={IconType.Redraw}
						value={this.props.value}
						size={IconSize.Large}
					/>
				);
			}

			return (
				<PlayingCard
					front={
						<PlaceholderCard
							content={
								<div className={this.props.developer ? 'redraw-button developer' : 'redraw-button'}>
									<Text type={TextType.SubHeading}>Redraw</Text>
									{content}
								</div>
							}
						/>
					}
					onClick={this.props.onClick}
				/>
			);
		} catch {
			return <div className='redraw-button render-error' />;
		}
	};
}
