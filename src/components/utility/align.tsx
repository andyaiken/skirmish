import { Row } from 'antd';
import React from 'react';

interface Props {
	horizontal: 'start' | 'end' | 'center';
	vertical: 'top' | 'bottom' | 'middle';
}

export class Align extends React.Component<Props> {
	public static defaultProps = {
		horizontal: 'center',
		vertical: 'middle',
		style: {}
	};

	public render() {
		return (
			<Row justify={this.props.horizontal} align={this.props.vertical} style={{ width: '100%', height: '100%' }}>
				{this.props.children}
			</Row>
		);
	}
}
