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

	render = () => {
		try {
			return (
				<div
					className='logo-panel'
					style={{
						gap: `${this.props.size / 3}px`
					}}
				>
					<img
						className='logo-image'
						alt='Skirmish'
						src={logo}
						style={{
							height: `${this.props.size}px`
						}}
					/>
					{
						this.props.text ?
							<div
								className='logo-text'
								style={{
									fontSize: `${this.props.size}px`,
									letterSpacing: `${this.props.size / 6}px`
								}}
							>
								{this.props.text}
							</div>
							: null
					}
				</div>
			);
		} catch {
			return <div className='logo-panel render-error' />;
		}
	};
}
