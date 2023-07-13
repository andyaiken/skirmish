import { Component } from 'react';

import './badge.scss';

interface Props {
	value: number | string | null;
	children: JSX.Element;
}

export class Badge extends Component<Props> {
	static defaultProps = {
		value: null
	};

	render = () => {
		try {
			if (!this.props.value) {
				return this.props.children;
			}

			return (
				<div className='badge'>
					{this.props.children}
					<div className='badge-value'>
						{this.props.value}
					</div>
				</div>
			);
		} catch {
			return <div className='badge render-error' />;
		}
	};
}
