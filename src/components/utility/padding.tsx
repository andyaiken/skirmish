import React from 'react';

interface Props {
	value: number | string;
}

export class Padding extends React.Component<Props> {
	public static defaultProps = {
		value: 10
	};

	public render() {
		return (
			<div style={{ padding: this.props.value, height: '100%', width: '100%' }}>
				{this.props.children}
			</div>
		);
	}
}
