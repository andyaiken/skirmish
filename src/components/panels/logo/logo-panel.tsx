import { Component } from 'react';

import './logo-panel.scss';

import logo from '../../../assets/images/logo.png';

interface Props {
	text: string | null;
	size: number;
}

export class LogoPanel extends Component<Props> {
	static defaultProps = {
		text: 'Skirmish'
	};

	// With the game's name in it the panel measures about seven times the font size, and this is
	// the gap left either side of it when the cap does bind. Together they say: use the largest
	// size that still leaves that margin. See the note in render.
	static widthPerFont = 7;
	static margin = 40;

	render = () => {
		// The caller picks a size to suit the screen it's drawing on, which assumes a tablet's width.
		// On a phone that size runs the wordmark off both edges - and the app clips rather than
		// scrolls, so the ends of the word are simply lost rather than reachable. So every dimension
		// here is also capped at whatever would leave a margin either side, scaled in step so the
		// panel keeps its proportions. The cap only shrinks: on a screen with room for the size that
		// was asked for it does not bind at all, which is why a tablet is unaffected.
		const share = (value: number) => value / this.props.size / LogoPanel.widthPerFont;
		const cap = (value: number) => `min(${value}px, calc((100vw - ${LogoPanel.margin}px) * ${share(value)}))`;

		return (
			<div
				className='logo-panel'
				style={{
					gap: cap(this.props.size / 3)
				}}
			>
				<img
					className='logo-image'
					alt='Skirmish'
					src={logo}
					style={{
						height: cap(this.props.size)
					}}
				/>
				{
					this.props.text ?
						<div
							className='logo-text'
							style={{
								fontSize: cap(this.props.size),
								letterSpacing: cap(this.props.size / 6)
							}}
						>
							{this.props.text}
						</div>
						: null
				}
			</div>
		);
	};
}
