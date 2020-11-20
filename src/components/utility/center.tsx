import React from 'react';

export class Center extends React.Component {
	public render() {
		return (
			<div style={{ textAlign: 'center' }}>
				{this.props.children}
			</div>
		);
	}
}
