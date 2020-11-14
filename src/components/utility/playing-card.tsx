import React from 'react';
import { Align } from './align';

interface Props {
	back: JSX.Element | string;
	display: 'front' | 'back';
	onClick: () => void;
}

export class PlayingCard extends React.Component<Props> {
	public static defaultProps = {
		back: '',
		display: 'front',
		onClick: () => null
	};

	public render() {
		return (
			<div className={this.props.display === 'front' ? 'playing-card' : 'playing-card flipped'} onClick={() => this.props.onClick()} role='button'>
				<div className='playing-card-inner'>
					<div className='playing-card-front'>
						{this.props.children}
					</div>
					<div className='playing-card-back'>
						<Align>
							{this.props.back}
						</Align>
					</div>
				</div>
			</div>
		);
	}
}
