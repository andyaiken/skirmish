import { Component } from 'react';

import './logo-panel.scss';

import logo from '../../../assets/images/logo.png';

interface Props {
	size: number;
	showText: boolean;
}

export class LogoPanel extends Component<Props> {
	static defaultProps = {
		showText: true
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
						this.props.showText ?
							<div
								className='logo-text'
								style={{
									fontSize: `${this.props.size}px`,
									letterSpacing: `${this.props.size / 6}px`
								}}
							>
								Skirmish
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
